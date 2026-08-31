const fs = require("fs");
const path = require("path");
const https = require("https");

// ─── Configuración ───────────────────────────────────────────────
const CSV_PATH = path.resolve(__dirname, "../apify_results/con_emails_buenos_aires.csv");
const TEMPLATE_PATHS = [
  path.resolve(__dirname, "../apify_results/mail-captacion-clientes.md"),
  path.resolve(__dirname, "../apify_results/mail-captacion-clientes-2.md"),
  path.resolve(__dirname, "../apify_results/mail-captacion-clientes-3.md"),
];
const PDF_PATH = path.resolve(__dirname, "../apify_results/presentacion-simplificia.pdf");
const LOG_PATH = path.resolve(__dirname, "sent-log.json");
const DELAY_MS = 180_000; // 3 minutos entre envíos

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

const REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;
const CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const ACCOUNT_ID = "3083405000000008002";
const FROM_ADDRESS = "gustavo.tallaferro@simplificia.com.ar";

if (!REFRESH_TOKEN || !CLIENT_ID || !CLIENT_SECRET) {
  console.error("Falta ZOHO_REFRESH_TOKEN, ZOHO_CLIENT_ID o ZOHO_CLIENT_SECRET en .env");
  process.exit(1);
}

// ─── Helpers HTTP ────────────────────────────────────────────────
let cachedToken = null;
let tokenExpiresAt = 0;

function httpsRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt - 60000) {
    return cachedToken;
  }
  const result = await httpsRequest(
    {
      hostname: "accounts.zoho.com",
      path: "/oauth/v2/token",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
    new URLSearchParams({
      refresh_token: REFRESH_TOKEN,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "refresh_token",
    }).toString()
  );
  if (result.data.error) throw new Error(`OAuth error: ${result.data.error}`);
  cachedToken = result.data.access_token;
  tokenExpiresAt = Date.now() + result.data.expires_in * 1000;
  return cachedToken;
}

async function uploadAttachment(accessToken, filePath, fileName) {
  const fileBuffer = fs.readFileSync(filePath);
  const boundary = "----FormBoundary" + Math.random().toString(36).substring(2);
  const header =
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="attach"; filename="${fileName}"\r\n` +
    `Content-Type: application/pdf\r\n\r\n`;
  const footer = `\r\n--${boundary}--\r\n`;
  const body = Buffer.concat([Buffer.from(header), fileBuffer, Buffer.from(footer)]);

  const result = await httpsRequest(
    {
      hostname: "mail.zoho.com",
      path: `/api/accounts/${ACCOUNT_ID}/messages/attachments?uploadType=multipart&isInline=false`,
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        Accept: "application/json",
      },
    },
    body
  );

  if (result.status !== 200 || !result.data.data) {
    throw new Error(`Error uploading attachment: ${JSON.stringify(result.data)}`);
  }
  const attachment = Array.isArray(result.data.data) ? result.data.data[0] : result.data.data;
  return attachment;
}

async function sendEmail(accessToken, toAddress, subject, content, attachment) {
  const payload = {
    fromAddress: FROM_ADDRESS,
    toAddress,
    subject,
    content,
    mailFormat: "html",
  };

  if (attachment) {
    payload.attachments = [
      {
        storeName: attachment.storeName,
        attachmentPath: attachment.attachmentPath,
        attachmentName: attachment.attachmentName,
      },
    ];
  }

  const result = await httpsRequest(
    {
      hostname: "mail.zoho.com",
      path: `/api/accounts/${ACCOUNT_ID}/messages`,
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
    JSON.stringify(payload)
  );

  return result;
}

// ─── Template ─────────────────────────────────────────────────────
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

    // Detect start of body: line after "---" separator that has actual content
    if (!inBody) {
      // Skip metadata lines until we find the greeting
      if (line.match(/^(Hola |Hola,?\s*\[Nombre)/i)) {
        inBody = true;
      } else {
        continue;
      }
    }

    if (inBody) {
      // Stop at notes/footer section
      if (line.trim().startsWith("_Notas") || line.trim().startsWith("---")) break;
      bodyLines.push(line);
    }
  }

  return {
    subject: subject || "[Nombre del negocio] podés tener su propio asistente de turnos con IA",
    body: bodyLines.join("\n").trim(),
  };
}

// Only strip personal/academic titles, not business types
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

  // Strip titles iteratively (some names have multiple stacked titles)
  let changed = true;
  while (changed) {
    changed = false;
    for (const t of TITLES) {
      const escaped = t.replace(/\./g, "\\.");
      // Match title optionally followed by whitespace/period/end
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
  
  // Clean leading/trailing garbage
  name = name.replace(/^[\s.\-–—]+/, "").replace(/[\s.\-–—]+$/, "").trim();
  
  // Split on delimiters, take first non-empty part
  const parts = name.split(/[,\-–—()\/|]/).map((p) => p.trim()).filter((p) => p.length > 0);
  name = parts[0] || "";
  
  // Remove trailing job descriptors (only from the end)
  name = name.replace(/\s+(Psicólogo|Psicóloga|Veterinario|Veterinaria|Psicología|Terapia)\s*$/gi, "").trim();
  
  const words = name.split(/\s+/).filter((w) => w.length > 1);
  const result = words.slice(0, 3).join(" ");
  
  // Fallback: if everything was stripped, use raw name (first 3 words)
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

  // Convert plaintext to basic HTML
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

  console.log("=== SimplificIA Email Sender (Zoho Mail API) ===\n");

  // Cargar datos
  const csvContent = fs.readFileSync(CSV_PATH, "utf8");
  const contacts = parseCSV(csvContent);

  // Cargar plantillas
  const templates = TEMPLATE_PATHS
    .filter((p) => fs.existsSync(p))
    .map((p) => {
      const md = fs.readFileSync(p, "utf8");
      return parseTemplate(md);
    });
  console.log(`${templates.length} plantillas cargadas`);

  // Filtrar
  let filtered = contacts;
  if (categoriaFilter) {
    filtered = contacts.filter((c) => c["Categoría"]?.toLowerCase().includes(categoriaFilter.toLowerCase()));
    console.log(`Filtrando por categoría: ${categoriaFilter} → ${filtered.length} contactos`);
  }

  console.log(`Total contactos a procesar: ${filtered.length}`);
  console.log(`Templates: ${templates.length} (rotando)`);
  console.log(`PDF: ${path.basename(PDF_PATH)} (${(fs.statSync(PDF_PATH).size / 1024).toFixed(0)} KB)`);
  console.log(`Delay entre envíos: ${DELAY_MS / 1000}s (${(DELAY_MS / 60000).toFixed(1)} min)`);
  console.log(`Dry-run: ${dryRun ? "SÍ" : "NO"}\n`);

  // Cargar progreso
  const sentLog = loadProgress();
  console.log(`Ya enviados previamente: ${sentLog.size}\n`);

  // Obtener token
  let accessToken = "dry-run";
  if (!dryRun) {
    console.log("Obteniendo access token...");
    accessToken = await getAccessToken();
  } else {
    console.log("(Dry-run: sin token)\n");
  }

  // Verificar PDF
  const hasPdf = fs.existsSync(PDF_PATH);
  console.log(`PDF: ${hasPdf ? "disponible" : "NO ENCONTRADO"}\n`);

  // Procesar contactos
  let sent = 0;
  let errors = 0;
  let skipped = 0;

  for (let i = 0; i < filtered.length; i++) {
    const contact = filtered[i];
    const emails = contact.Emails.split(",").map((e) => e.trim()).filter((e) => e.includes("@"));

    if (emails.length === 0) {
      skipped++;
      continue;
    }

    for (const email of emails) {
      const logKey = email.toLowerCase();

      if (sentLog.has(logKey)) {
        console.log(`[${i + 1}/${filtered.length}] SKIP (ya enviado): ${email}`);
        skipped++;
        continue;
      }

      // Rotar plantillas por email para variar el contenido y evitar detección de spam
      const templateIdx = sent % templates.length;
      const template = templates[templateIdx];
      const { subject, body } = personalizeTemplate(template, contact);

      console.log(`[${i + 1}/${filtered.length}] Enviando a: ${email} [T${templateIdx + 1}]`);
      console.log(`  Asunto: ${subject.substring(0, 80)}...`);

      if (dryRun) {
        console.log(`  DRY-RUN: no se envió`);
        sent++;
      } else {
        // Refresh token si necesario
        accessToken = await getAccessToken();

        // Subir PDF fresco (Zoho invalida el adjunto después de cada envío)
        let attachment = null;
        if (hasPdf) {
          try {
            attachment = await uploadAttachment(accessToken, PDF_PATH, "presentacion-simplificia.pdf");
          } catch (e) {
            console.log(`  ⚠️  Error subiendo PDF: ${e.message}`);
          }
        }

        const result = await sendEmail(accessToken, email, subject, body, attachment);
        if (result.status === 200 && result.data.status?.code === 200) {
          console.log(`  ✅ Enviado (ID: ${result.data.data?.messageId || "ok"})`);
          sent++;
          sentLog.add(logKey);
          saveProgress(sentLog);

          // Límite de envíos
          if (maxSend > 0 && sent >= maxSend) {
            console.log(`\n  🛑 Límite de ${maxSend} envíos alcanzado.`);
            break;
          }
        } else {
          console.log(`  ❌ Error: ${JSON.stringify(result.data).substring(0, 200)}`);
          errors++;
        }

        // Delay entre envíos
        if (!dryRun && i < filtered.length - 1) {
          const waitSec = DELAY_MS / 1000;
          process.stdout.write(`  ⏳ Esperando ${waitSec}s...`);
          await sleep(DELAY_MS);
          console.log(" listo");
        }
      }
    }
    if (maxSend > 0 && sent >= maxSend) break;
  }

  // Resumen
  console.log("\n========================================");
  console.log("  RESUMEN");
  console.log("========================================");
  console.log(`  Enviados: ${sent}`);
  console.log(`  Errores:  ${errors}`);
  console.log(`  Skipped:  ${skipped}`);
  console.log(`  Total:    ${filtered.length}`);
  console.log("========================================");
}

main().catch((err) => {
  console.error("Error fatal:", err.message);
  process.exit(1);
});
