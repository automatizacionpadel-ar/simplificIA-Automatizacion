const fs = require("fs");
const path = require("path");
const { Resend } = require("resend");

// ─── Configuración ───────────────────────────────────────────────
const CSV_PATH = path.resolve(__dirname, "../apify_results/con_emails_buenos_aires.csv");
const TEMPLATE_PATHS = [
  path.resolve(__dirname, "../apify_results/mail-captacion-clientes.md"),
  path.resolve(__dirname, "../apify_results/mail-captacion-clientes-2.md"),
  path.resolve(__dirname, "../apify_results/mail-captacion-clientes-3.md"),
];
const PDF_PATH = path.resolve(__dirname, "../apify_results/presentacion-simplificia.pdf");
const LOG_PATH = path.resolve(__dirname, "sent-log.json");
const BATCH_SIZE_DEFAULT = 20;
const DELAY_BETWEEN_BATCHES_MS = 30_000;

// ─── Cargar .env ─────────────────────────────────────────────────
const envPath = path.resolve(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const envLines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of envLines) {
    const eqIdx = line.indexOf("=");
    if (eqIdx > 0 && !line.trim().startsWith("#")) {
      process.env[line.substring(0, eqIdx).trim()] = line.substring(eqIdx + 1).trim();
    }
  }
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM || "Gustavo Tallaferro <gustavo.tallaferro@simplificia.com.ar>";

if (!RESEND_API_KEY) {
  console.error("Falta RESEND_API_KEY en ws-automatico/.env");
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

// ─── Templates ────────────────────────────────────────────────────
function parseTemplate(mdContent) {
  const lines = mdContent.split("\n");
  let subject = "";
  let bodyLines = [];
  let inBody = false;

  for (const line of lines) {
    if (line.startsWith("**Asunto:**")) {
      subject = line.replace(/^\*\*Asunto:\*\*\s*/, "").trim();
      continue;
    }
    if (!inBody) {
      if (line.match(/^(Hola |Hola,?\s*\[Nombre)/i)) {
        inBody = true;
      } else {
        continue;
      }
    }
    if (inBody) {
      if (line.trim().startsWith("_Notas") || line.trim().startsWith("---")) break;
      bodyLines.push(line);
    }
  }

  return {
    subject: subject || "[Nombre del negocio] podés tener su propio asistente de turnos con IA",
    body: bodyLines.join("\n").trim(),
  };
}

const TITLES = [
  "Licenciada", "Licenciado", "Lic.",
  "Doctora", "Doctor", "Dra.", "Dr.",
  "Psicóloga en", "Psicóloga", "Psicólogo",
  "M.V.", "M.V",
  "Prof.", "Prof",
];

function cleanName(fullName) {
  let name = fullName
    .replace(/["""]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  let changed = true;
  while (changed) {
    changed = false;
    for (const t of TITLES) {
      const escaped = t.replace(/\./g, "\\.");
      const regex = new RegExp(`^[\\s.]*${escaped}[\\s.]*`, "i");
      const before = name;
      name = name.replace(regex, "").trim();
      if (name !== before) changed = true;
    }
  }

  return name || fullName;
}

function extractShortName(fullName) {
  let name = cleanName(fullName);
  name = name.replace(/^[\s.\-–—]+/, "").replace(/[\s.\-–—]+$/, "").trim();
  const parts = name.split(/[,\-–—()\/|]/).map((p) => p.trim()).filter((p) => p.length > 0);
  name = parts[0] || "";
  name = name.replace(/\s+(Psicólogo|Psicóloga|Veterinario|Veterinaria|Psicología|Terapia)\s*$/gi, "").trim();
  const words = name.split(/\s+/).filter((w) => w.length > 1);
  const result = words.slice(0, 3).join(" ");
  if (!result) {
    const rawWords = fullName.split(/\s+/).filter((w) => w.length > 1);
    return rawWords.slice(0, 3).join(" ") || fullName.substring(0, 30);
  }
  return result;
}

function extractFirstName(fullName) {
  let name = cleanName(fullName);
  name = name.replace(/^[\s.\-–—]+/, "").trim();
  const parts = name.split(/[,\-–—()\/|]/).map((p) => p.trim()).filter((p) => p.length > 0);
  name = parts[0] || "";
  const words = name.split(/\s+/).filter((w) => w.length > 1);
  return words[0] || cleanName(fullName).split(/\s+/).filter((w) => w.length > 1)[0] || fullName;
}

function personalizeTemplate(template, contact) {
  const nombre = extractFirstName(contact.Nombre);
  const negocio = extractShortName(contact.Nombre);

  let subject = template.subject.replace(/\[Nombre del negocio\]/g, negocio);
  let body = template.body
    .replace(/\[Nombre del contacto\]/g, nombre)
    .replace(/\[Nombre del negocio\]/g, negocio);

  body = body
    .split("\n")
    .map((line) => {
      line = line.trim();
      if (!line) return "<br>";
      if (line.startsWith("**") && line.endsWith("**")) {
        return `<strong>${line.slice(2, -2)}</strong><br>`;
      }
      return line + "<br>";
    })
    .join("\n");

  return { subject, body };
}

// ─── CSV ──────────────────────────────────────────────────────────
function parseCSV(content) {
  const lines = content.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let current = "";
    let inQuotes = false;

    for (let j = 0; j < lines[i].length; j++) {
      const ch = lines[i][j];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    values.push(current.trim());

    const row = {};
    for (let k = 0; k < headers.length; k++) {
      row[headers[k]] = values[k] || "";
    }
    rows.push(row);
  }
  return rows;
}

// ─── Progress Log ─────────────────────────────────────────────────
function loadProgress() {
  if (fs.existsSync(LOG_PATH)) {
    try {
      return new Set(JSON.parse(fs.readFileSync(LOG_PATH, "utf8")));
    } catch {
      return new Set();
    }
  }
  return new Set();
}

function saveProgress(sent) {
  fs.writeFileSync(LOG_PATH, JSON.stringify([...sent], null, 2));
}

// ─── Sleep ────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Main ─────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const maxSend = (() => {
    const idx = args.indexOf("--max");
    return idx >= 0 ? parseInt(args[idx + 1]) : 0;
  })();
  const categoriaFilter = (() => {
    const idx = args.indexOf("--categoria");
    return idx >= 0 ? args[idx + 1] : null;
  })();
  const batchSize = (() => {
    const idx = args.indexOf("--batch-size");
    return idx >= 0 ? parseInt(args[idx + 1]) : BATCH_SIZE_DEFAULT;
  })();

  console.log("=== SimplificIA Email Sender (Resend) ===\n");

  const csvContent = fs.readFileSync(CSV_PATH, "utf8");
  const contacts = parseCSV(csvContent);

  const templates = TEMPLATE_PATHS
    .filter((p) => fs.existsSync(p))
    .map((p) => {
      const md = fs.readFileSync(p, "utf8");
      return parseTemplate(md);
    });
  console.log(`${templates.length} plantillas cargadas`);

  let filtered = contacts;
  if (categoriaFilter) {
    filtered = contacts.filter((c) => c["Categoría"]?.toLowerCase().includes(categoriaFilter.toLowerCase()));
    console.log(`Filtrando por categoría: ${categoriaFilter} → ${filtered.length} contactos`);
  }

  console.log(`Total contactos a procesar: ${filtered.length}`);
  console.log(`Templates: ${templates.length} (rotando)`);
  console.log(`PDF: ${path.basename(PDF_PATH)} (${(fs.statSync(PDF_PATH).size / 1024).toFixed(0)} KB)`);
  console.log(`Batch size: ${batchSize} emails por lote`);
  console.log(`Delay entre lotes: ${DELAY_BETWEEN_BATCHES_MS / 1000}s`);
  console.log(`From: ${RESEND_FROM}`);
  console.log(`Dry-run: ${dryRun ? "SÍ" : "NO"}\n`);

  const sentLog = loadProgress();
  console.log(`Ya enviados previamente: ${sentLog.size}\n`);

  const hasPdf = fs.existsSync(PDF_PATH);
  const pdfBase64 = hasPdf ? fs.readFileSync(PDF_PATH).toString("base64") : null;

  // Construir emails pendientes
  let pendingEmails = [];

  for (let i = 0; i < filtered.length; i++) {
    const contact = filtered[i];
    const emails = contact.Emails.split(",").map((e) => e.trim()).filter((e) => e.includes("@"));

    for (const email of emails) {
      const logKey = email.toLowerCase();

      if (sentLog.has(logKey)) {
        console.log(`[${i + 1}/${filtered.length}] SKIP (ya enviado): ${email}`);
        continue;
      }

      const templateIdx = pendingEmails.length % templates.length;
      const template = templates[templateIdx];
      const { subject, body } = personalizeTemplate(template, contact);

      const payload = {
        from: RESEND_FROM,
        to: [email],
        subject,
        html: body,
      };

      if (hasPdf) {
        payload.attachments = [
          { filename: "presentacion-simplificia.pdf", content: pdfBase64 },
        ];
      }

      pendingEmails.push({ logKey, payload, label: `[T${templateIdx + 1}] ${email}` });

      if (maxSend > 0 && pendingEmails.length >= maxSend) break;
    }
    if (maxSend > 0 && pendingEmails.length >= maxSend) break;
  }

  console.log(`Emails pendientes de envío: ${pendingEmails.length}\n`);

  if (pendingEmails.length === 0) {
    console.log("Nada para enviar.");
    return;
  }

  let sent = 0;
  let errors = 0;

  const batches = [];
  for (let i = 0; i < pendingEmails.length; i += batchSize) {
    batches.push(pendingEmails.slice(i, i + batchSize));
  }

  for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
    const batch = batches[batchIdx];
    console.log(`── Lote ${batchIdx + 1}/${batches.length} (${batch.length} emails) ──`);

    if (dryRun) {
      for (const item of batch) {
        console.log(`  [DRY] ${item.label}`);
        console.log(`    Asunto: ${item.payload.subject.substring(0, 80)}...`);
        sent++;
      }
    } else {
      const batchPayloads = batch.map((item) => item.payload);

      const { data, error } = await resend.batch.send(batchPayloads);

      if (error) {
        console.error(`  ❌ Error de batch: ${error.message}`);
        errors += batch.length;
        continue;
      }

      const results = data?.data || [];
      for (let j = 0; j < batch.length; j++) {
        const item = batch[j];
        const result = results[j];

        if (result?.error) {
          console.log(`  ❌ ${item.label}: ${result.error.message || JSON.stringify(result.error)}`);
          errors++;
        } else {
          console.log(`  ✅ ${item.label} (ID: ${result?.id || "ok"})`);
          sentLog.add(item.logKey);
          sent++;
        }
      }

      saveProgress(sentLog);
    }

    if (maxSend > 0 && sent >= maxSend) {
      console.log(`\n🛑 Límite de ${maxSend} envíos alcanzado.`);
      break;
    }

    if (!dryRun && batchIdx < batches.length - 1) {
      const waitSec = DELAY_BETWEEN_BATCHES_MS / 1000;
      process.stdout.write(`  ⏳ Esperando ${waitSec}s...`);
      await sleep(DELAY_BETWEEN_BATCHES_MS);
      console.log(" listo\n");
    }
  }

  console.log("\n========================================");
  console.log("  RESUMEN");
  console.log("========================================");
  console.log(`  Enviados: ${sent}`);
  console.log(`  Errores:  ${errors}`);
  console.log(`  Total procesados: ${pendingEmails.length}`);
  console.log("========================================");
}

main().catch((err) => {
  console.error("Error fatal:", err.message);
  process.exit(1);
});
