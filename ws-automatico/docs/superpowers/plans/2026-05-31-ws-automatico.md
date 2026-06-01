# ws-automatico — Plan de Implementación

> **Para workers agénticos:** SUB-SKILL REQUERIDO: Usar superpowers:subagent-driven-development (recomendado) o superpowers:executing-plans para implementar este plan tarea por tarea. Los pasos usan sintaxis de checkbox (`- [ ]`) para seguimiento.

**Goal:** Construir un sistema de envío masivo de WhatsApp para notificaciones transaccionales de logística con formulario web, n8n y wwebjs-api, todo orquestado en Docker.

**Architecture:** El formulario HTML (nginx) parsea el CSV client-side y envía JSON al webhook de n8n. n8n itera los contactos con Split In Batches (size=1) + Wait de 45s entre cada item, llamando a wwebjs-api para cada envío. La barra de progreso en el frontend es local, basada en tiempo estimado (filas × 47s).

**Tech Stack:** Docker Compose, n8n self-hosted, avoylenko/wwebjs-api:1.34.6, nginx:alpine, HTML/CSS/JS vanilla

> **Nota de diseño:** El spec original pedía "Extract From File Node" para parsear CSV. Se optó por parsear el CSV client-side en app.js y enviar JSON al webhook. Esto es funcionalmente equivalente, evita la complejidad del manejo de binarios multipart en n8n, y es más confiable entre versiones. El cliente-side parsing es necesario de todas formas para la validación.

---

## Mapa de archivos

| Archivo | Rol |
|---------|-----|
| `docker-compose.yml` | Orquesta los 3 servicios con red y volúmenes |
| `.env` | Variables secretas (API key de wwebjs) |
| `.gitignore` | Excluye .env, sessions/ |
| `form/img/logo.png` | Logo simplificIA copiado desde proyecto simplificia |
| `form/index.html` | Formulario completo con header, form, progreso, footer |
| `form/style.css` | Estilos con colores de marca simplificIA |
| `form/app.js` | CSV parse, validación, fetch a webhook, barra de progreso |
| `n8n-workflows/whatsapp-csv-workflow.json` | Workflow n8n listo para importar |
| `docs/instrucciones-uso.md` | Guía para la usuaria final |

---

## Task 1: Scaffold — estructura base del proyecto

**Files:**
- Create: `/Users/gus/Developer/ws-automatico/.env`
- Create: `/Users/gus/Developer/ws-automatico/.gitignore`
- Create: `/Users/gus/Developer/ws-automatico/form/img/` (directorio)
- Create: `/Users/gus/Developer/ws-automatico/n8n-workflows/` (directorio)
- Create: `/Users/gus/Developer/ws-automatico/sessions/` (directorio vacío)

- [ ] **Step 1: Crear directorios del proyecto**

```bash
cd /Users/gus/Developer/ws-automatico
mkdir -p form/img n8n-workflows sessions docs
```

- [ ] **Step 2: Crear .env con la API key de wwebjs**

Contenido de `.env`:
```
WWEBJS_API_KEY=cambia-esta-clave-secreta
```

- [ ] **Step 3: Crear .gitignore**

Contenido de `.gitignore`:
```
.env
sessions/
node_modules/
```

- [ ] **Step 4: Copiar logo desde proyecto simplificia**

```bash
cp /Users/gus/Developer/simplificia/public/img/logo.png \
   /Users/gus/Developer/ws-automatico/form/img/logo.png
```

- [ ] **Step 5: Verificar estructura**

```bash
find /Users/gus/Developer/ws-automatico -not -path "*/sessions*" -not -path "*/.git*"
```

Salida esperada (los dirs vacíos como `sessions/` pueden no aparecer):
```
/Users/gus/Developer/ws-automatico
/Users/gus/Developer/ws-automatico/.env
/Users/gus/Developer/ws-automatico/.gitignore
/Users/gus/Developer/ws-automatico/form
/Users/gus/Developer/ws-automatico/form/img
/Users/gus/Developer/ws-automatico/form/img/logo.png
/Users/gus/Developer/ws-automatico/n8n-workflows
/Users/gus/Developer/ws-automatico/docs
```

- [ ] **Step 6: Commit**

```bash
cd /Users/gus/Developer/ws-automatico
git init
git add .gitignore docs/
git commit -m "chore: scaffold proyecto ws-automatico"
```

---

## Task 2: docker-compose.yml

**Files:**
- Create: `docker-compose.yml`

- [ ] **Step 1: Crear docker-compose.yml**

```yaml
version: '3.8'

services:

  n8n:
    image: n8nio/n8n:latest
    container_name: ws-n8n
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=0.0.0.0
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - N8N_EXECUTIONS_TIMEOUT=10800
      - N8N_EXECUTIONS_TIMEOUT_MAX=10800
      - WEBHOOK_URL=http://localhost:5678/
      - GENERIC_TIMEZONE=America/Argentina/Buenos_Aires
      - TZ=America/Argentina/Buenos_Aires
      - N8N_CORS_ENABLED=true
      - N8N_CORS_ALLOWED_ORIGINS=*
    volumes:
      - n8n_data:/home/node/.n8n
    networks:
      - whatsapp-net

  wwebjs-api:
    image: avoylenko/wwebjs-api:1.34.6
    container_name: ws-wwebjs
    restart: unless-stopped
    environment:
      - API_KEY=${WWEBJS_API_KEY}
    volumes:
      - ./sessions:/app/sessions
    networks:
      - whatsapp-net

  nginx:
    image: nginx:alpine
    container_name: ws-nginx
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./form:/usr/share/nginx/html:ro
    networks:
      - whatsapp-net

networks:
  whatsapp-net:
    driver: bridge

volumes:
  n8n_data:
```

- [ ] **Step 2: Validar sintaxis del compose**

```bash
cd /Users/gus/Developer/ws-automatico
docker compose config
```

Salida esperada: el compose expandido sin errores. Si falla por `WWEBJS_API_KEY` no definida, exportar primero:
```bash
export $(cat .env | xargs) && docker compose config
```

- [ ] **Step 3: Commit**

```bash
git add docker-compose.yml
git commit -m "feat: agregar docker-compose con n8n, wwebjs-api y nginx"
```

---

## Task 3: Formulario — style.css

**Files:**
- Create: `form/style.css`

- [ ] **Step 1: Crear style.css completo**

```css
/* === Variables de marca simplificIA === */
:root {
  --primary: #96bd45;
  --primary-dark: #15803d;
  --primary-light: #c8e68a;
  --bg: #F9FAFB;
  --surface: #ffffff;
  --text: #1f2937;
  --text-muted: #6b7280;
  --border: #e5e7eb;
  --danger: #dc2626;
  --success: #16a34a;
  --radius: 12px;
  --shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* === Header === */
.header {
  background: var(--surface);
  box-shadow: var(--shadow);
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
}

.header img {
  height: 48px;
  width: auto;
}

.header h1 {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-muted);
  letter-spacing: 0.02em;
}

/* === Main layout === */
main {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 16px;
}

.card {
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 36px 32px;
  width: 100%;
  max-width: 560px;
}

.card h2 {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 28px;
}

/* === Drop zone === */
.drop-zone {
  border: 2px dashed var(--border);
  border-radius: var(--radius);
  padding: 36px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--bg);
  margin-bottom: 24px;
  position: relative;
}

.drop-zone:hover,
.drop-zone.drag-over {
  border-color: var(--primary);
  background: #f0f9e4;
}

.drop-zone.file-loaded {
  border-color: var(--primary);
  background: #f0f9e4;
  border-style: solid;
}

.drop-zone input[type="file"] {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
}

.drop-zone .icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

.drop-zone .label {
  font-size: 0.95rem;
  color: var(--text-muted);
}

.drop-zone .label strong {
  color: var(--primary-dark);
}

.file-info {
  display: none;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  font-size: 0.9rem;
  color: var(--primary-dark);
  font-weight: 500;
}

.file-info.visible {
  display: flex;
  justify-content: center;
}

/* === Errores de validación === */
.validation-errors {
  display: none;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  font-size: 0.88rem;
  color: var(--danger);
}

.validation-errors.visible {
  display: block;
}

.validation-errors ul {
  margin-top: 6px;
  padding-left: 16px;
}

/* === Mensaje personalizado === */
.field-group {
  margin-bottom: 24px;
}

.field-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 8px;
}

.field-group .hint {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 6px;
}

.field-group textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  font-size: 0.92rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s;
  color: var(--text);
  background: var(--bg);
}

.field-group textarea:focus {
  outline: none;
  border-color: var(--primary);
}

/* === Botón de envío === */
.btn-submit {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  border: none;
  border-radius: var(--radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  letter-spacing: 0.02em;
}

.btn-submit:hover:not(:disabled) {
  opacity: 0.92;
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* === Progreso === */
.progress-section {
  display: none;
  margin-top: 24px;
}

.progress-section.visible {
  display: block;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.88rem;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.progress-bar-track {
  background: var(--border);
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--primary-dark));
  border-radius: 999px;
  transition: width 1s linear;
  width: 0%;
}

.progress-status {
  font-size: 0.88rem;
  color: var(--text-muted);
  text-align: center;
}

/* === Alertas === */
.alert {
  display: none;
  padding: 14px 16px;
  border-radius: 8px;
  font-size: 0.92rem;
  margin-top: 20px;
}

.alert.visible {
  display: block;
}

.alert-success {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: var(--success);
}

.alert-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: var(--danger);
}

/* === Footer === */
.footer {
  background: var(--surface);
  border-top: 1px solid var(--border);
  padding: 20px 24px;
  text-align: center;
  font-size: 0.82rem;
  color: var(--text-muted);
  line-height: 1.7;
}

.footer a {
  color: var(--primary-dark);
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

.footer .separator {
  margin: 0 6px;
}

/* === Responsive === */
@media (max-width: 600px) {
  .card {
    padding: 24px 18px;
    border-radius: 0;
    box-shadow: none;
  }

  main {
    padding: 0;
  }
}
```

- [ ] **Step 2: Verificar (no hay errores de sintaxis)**

El archivo no tiene errores de sintaxis CSS si no hay `:` o `{` desbalanceados. No hace falta herramienta — el browser lo valida al abrir index.html.

- [ ] **Step 3: Commit**

```bash
cd /Users/gus/Developer/ws-automatico
git add form/style.css
git commit -m "feat: agregar estilos del formulario con branding simplificIA"
```

---

## Task 4: Formulario — index.html

**Files:**
- Create: `form/index.html`

- [ ] **Step 1: Crear index.html completo**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Envío Masivo WhatsApp — simplificIA</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>

  <!-- Header -->
  <header class="header">
    <img src="img/logo.png" alt="simplificIA" />
    <h1>Envío Masivo de WhatsApp</h1>
  </header>

  <!-- Main content -->
  <main>
    <div class="card">
      <h2>Subir lista de contactos</h2>

      <!-- Drop zone CSV -->
      <div class="drop-zone" id="dropZone">
        <input
          type="file"
          id="csvInput"
          accept=".csv"
          aria-label="Seleccionar archivo CSV"
        />
        <div class="icon">📋</div>
        <div class="label">
          <strong>Arrastrá el CSV aquí</strong><br />
          o hacé click para seleccionar
        </div>
        <div class="file-info" id="fileInfo">
          <span>✅</span>
          <span id="fileInfoText"></span>
        </div>
      </div>

      <!-- Errores de validación -->
      <div class="validation-errors" id="validationErrors">
        <strong>Errores en el CSV:</strong>
        <ul id="errorList"></ul>
      </div>

      <!-- Mensaje personalizado -->
      <div class="field-group">
        <label for="mensajeInput">
          Mensaje personalizado
          <span style="font-weight:400; color:#6b7280;">(opcional)</span>
        </label>
        <textarea
          id="mensajeInput"
          placeholder="Hola, tu paquete fue despachado por {empresa} y está en camino. Llegará en 2-3 días hábiles."
          rows="4"
        ></textarea>
        <p class="hint">
          Usá <code>{empresa}</code> donde querés que aparezca el nombre de la empresa.
          Si dejás vacío, se usa el mensaje de arriba por defecto.
        </p>
      </div>

      <!-- Botón enviar -->
      <button class="btn-submit" id="btnSubmit" disabled>
        Enviar mensajes
      </button>

      <!-- Barra de progreso -->
      <div class="progress-section" id="progressSection">
        <div class="progress-header">
          <span>Procesando en segundo plano...</span>
          <span id="progressLabel">0%</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" id="progressFill"></div>
        </div>
        <p class="progress-status" id="progressStatus">
          Iniciando envíos...
        </p>
      </div>

      <!-- Alertas de resultado -->
      <div class="alert alert-success" id="alertSuccess"></div>
      <div class="alert alert-error" id="alertError"></div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="footer">
    <strong>simplificIA</strong><span class="separator">·</span>
    <a href="https://www.simplificia.com.ar" target="_blank">www.simplificia.com.ar</a>
    <span class="separator">·</span>
    <a href="mailto:info@simplificia.com.ar">info@simplificia.com.ar</a>
    <br />
    Automatización inteligente para tu negocio
  </footer>

  <script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add form/index.html form/img/
git commit -m "feat: agregar HTML del formulario con estructura completa"
```

---

## Task 5: Formulario — app.js

**Files:**
- Create: `form/app.js`

> La URL del webhook se construye dinámicamente con `window.location.hostname` para que funcione tanto en localhost como en la IP del servidor de producción.

- [ ] **Step 1: Crear app.js completo**

```javascript
// === Configuración ===
const WEBHOOK_PORT = 5678;
const WEBHOOK_PATH = '/webhook/whatsapp-csv-upload';
const DELAY_POR_MENSAJE_MS = 47000; // 45s wait + 2s overhead
const DEFAULT_MENSAJE =
  'Hola, tu paquete fue despachado por {empresa} y está en camino. Llegará en 2-3 días hábiles.';

// URL dinámica: funciona en localhost y en servidor por IP
function getWebhookUrl() {
  return `http://${window.location.hostname}:${WEBHOOK_PORT}${WEBHOOK_PATH}`;
}

// === Referencias al DOM ===
const dropZone     = document.getElementById('dropZone');
const csvInput     = document.getElementById('csvInput');
const fileInfo     = document.getElementById('fileInfo');
const fileInfoText = document.getElementById('fileInfoText');
const valErrors    = document.getElementById('validationErrors');
const errorList    = document.getElementById('errorList');
const mensajeInput = document.getElementById('mensajeInput');
const btnSubmit    = document.getElementById('btnSubmit');
const progressSection = document.getElementById('progressSection');
const progressLabel   = document.getElementById('progressLabel');
const progressFill    = document.getElementById('progressFill');
const progressStatus  = document.getElementById('progressStatus');
const alertSuccess = document.getElementById('alertSuccess');
const alertError   = document.getElementById('alertError');

// Estado de la app
let contactosParsed = []; // [{telefono, nombre_empresa}]

// === Drag & Drop ===
dropZone.addEventListener('dragover', e => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) procesarArchivo(file);
});

csvInput.addEventListener('change', () => {
  if (csvInput.files[0]) procesarArchivo(csvInput.files[0]);
});

// === Parser CSV ===
function parsearCSV(texto) {
  const lineas = texto.trim().split(/\r?\n/);
  if (lineas.length < 2) return { headers: [], filas: [] };

  const headers = lineas[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
  const filas = lineas.slice(1).map((linea, idx) => {
    const cols = linea.split(',').map(c => c.trim().replace(/"/g, ''));
    const obj = {};
    headers.forEach((h, i) => { obj[h] = cols[i] || ''; });
    obj._linea = idx + 2; // número de línea en CSV (con header = 1)
    return obj;
  });

  return { headers, filas };
}

// === Validaciones ===
function validarCSV(headers, filas) {
  const errores = [];

  if (!headers.includes('telefono')) {
    errores.push('Columna "telefono" no encontrada. Verificá el nombre exacto.');
  }
  if (!headers.includes('nombre_empresa')) {
    errores.push('Columna "nombre_empresa" no encontrada. Verificá el nombre exacto.');
  }

  if (errores.length > 0) return errores; // sin continuar si faltan columnas

  filas.forEach(fila => {
    const tel = String(fila.telefono || '').replace(/\D/g, '');
    if (tel.length !== 10 && tel.length !== 13) {
      errores.push(
        `Fila ${fila._linea}: teléfono "${fila.telefono}" inválido (debe tener 10 o 13 dígitos numéricos).`
      );
    }
    if (!fila.nombre_empresa || fila.nombre_empresa.trim() === '') {
      errores.push(`Fila ${fila._linea}: "nombre_empresa" está vacío.`);
    }
  });

  return errores;
}

// === Procesar archivo seleccionado ===
function procesarArchivo(file) {
  ocultarAlertas();
  contactosParsed = [];
  btnSubmit.disabled = true;

  if (!file.name.toLowerCase().endsWith('.csv')) {
    mostrarValidationErrors(['El archivo debe ser un CSV (.csv).']);
    return;
  }

  const reader = new FileReader();
  reader.onload = e => {
    const texto = e.target.result;
    const { headers, filas } = parsearCSV(texto);

    if (filas.length === 0) {
      mostrarValidationErrors(['El CSV está vacío o no tiene filas de datos.']);
      return;
    }

    const errores = validarCSV(headers, filas);

    if (errores.length > 0) {
      mostrarValidationErrors(errores);
      actualizarDropZoneError(file.name);
      return;
    }

    // Válido
    contactosParsed = filas.map(f => ({
      telefono: String(f.telefono).trim().replace(/\D/g, ''),
      nombre_empresa: f.nombre_empresa.trim()
    }));

    ocultarValidationErrors();
    actualizarDropZoneOK(file.name, filas.length);
    btnSubmit.disabled = false;
  };

  reader.readAsText(file, 'UTF-8');
}

// === UI helpers ===
function actualizarDropZoneOK(nombre, cantidad) {
  dropZone.classList.add('file-loaded');
  fileInfoText.textContent = `${nombre} — ${cantidad} contacto${cantidad !== 1 ? 's' : ''} válido${cantidad !== 1 ? 's' : ''}`;
  fileInfo.classList.add('visible');
}

function actualizarDropZoneError(nombre) {
  dropZone.classList.remove('file-loaded');
  fileInfo.classList.remove('visible');
}

function mostrarValidationErrors(errores) {
  errorList.innerHTML = errores.map(e => `<li>${e}</li>`).join('');
  valErrors.classList.add('visible');
}

function ocultarValidationErrors() {
  valErrors.classList.remove('visible');
  errorList.innerHTML = '';
}

function ocultarAlertas() {
  alertSuccess.classList.remove('visible');
  alertError.classList.remove('visible');
  progressSection.classList.remove('visible');
}

function mostrarExito(total) {
  alertSuccess.textContent = `✅ CSV enviado correctamente. Se procesarán ${total} mensajes (estimado: ${formatDuracion(total * DELAY_POR_MENSAJE_MS)}).`;
  alertSuccess.classList.add('visible');
}

function mostrarError(msg) {
  alertError.textContent = `❌ Error al enviar: ${msg}`;
  alertError.classList.add('visible');
}

function formatDuracion(ms) {
  const mins = Math.round(ms / 60000);
  return mins >= 60
    ? `${Math.floor(mins / 60)}h ${mins % 60}min`
    : `${mins} min`;
}

// === Barra de progreso local (estimada) ===
let progressInterval = null;

function iniciarProgreso(total) {
  progressSection.classList.add('visible');
  const duracionTotal = total * DELAY_POR_MENSAJE_MS;
  const inicio = Date.now();

  progressInterval = setInterval(() => {
    const elapsed = Date.now() - inicio;
    const pct = Math.min(Math.round((elapsed / duracionTotal) * 100), 99);
    const enviados = Math.min(Math.floor(elapsed / DELAY_POR_MENSAJE_MS), total);

    progressFill.style.width = `${pct}%`;
    progressLabel.textContent = `${pct}%`;
    progressStatus.textContent =
      `📤 Enviando... ${enviados}/${total} mensajes — próximo en ~45s`;

    if (elapsed >= duracionTotal) {
      clearInterval(progressInterval);
      progressFill.style.width = '100%';
      progressLabel.textContent = '100%';
      progressStatus.textContent = `✅ Proceso finalizado (${total} mensajes enviados estimado)`;
    }
  }, 1000);
}

// === Envío al webhook de n8n ===
btnSubmit.addEventListener('click', async () => {
  if (contactosParsed.length === 0) return;

  ocultarAlertas();
  btnSubmit.disabled = true;
  btnSubmit.textContent = 'Enviando...';

  const mensaje = mensajeInput.value.trim() || DEFAULT_MENSAJE;
  const payload = {
    contactos: contactosParsed,
    mensaje
  };

  try {
    const res = await fetch(getWebhookUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`El servidor respondió con código ${res.status}`);
    }

    mostrarExito(contactosParsed.length);
    iniciarProgreso(contactosParsed.length);

  } catch (err) {
    mostrarError(err.message || 'Error de red. Verificá que n8n esté activo.');
    btnSubmit.disabled = false;
  } finally {
    btnSubmit.textContent = 'Enviar mensajes';
  }
});
```

- [ ] **Step 2: Commit**

```bash
git add form/app.js
git commit -m "feat: agregar lógica JavaScript del formulario (CSV parser, validación, progreso)"
```

---

## Task 6: Workflow JSON de n8n

**Files:**
- Create: `n8n-workflows/whatsapp-csv-workflow.json`

> Este JSON se importa en n8n vía: **Workflows → Import from file**. Antes de activarlo, crear la variable `WWEBJS_API_KEY` en n8n (Settings → Variables → New Variable).

- [ ] **Step 1: Crear el workflow JSON**

```json
{
  "name": "WhatsApp CSV Sender",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "whatsapp-csv-upload",
        "responseMode": "onReceived",
        "options": {
          "allowedOrigins": "*"
        }
      },
      "id": "aaaa0001-0000-0000-0000-000000000001",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [240, 300],
      "webhookId": "whatsapp-csv-upload"
    },
    {
      "parameters": {
        "language": "javaScript",
        "jsCode": "// Extraer datos del webhook\nconst body = $input.first().json.body;\nconst contactos = body.contactos || [];\nconst mensajeTemplate = (body.mensaje && body.mensaje.trim())\n  ? body.mensaje.trim()\n  : 'Hola, tu paquete fue despachado por {empresa} y está en camino. Llegará en 2-3 días hábiles.';\n\n// Formatear cada contacto\nreturn contactos.map(c => {\n  // Limpiar número y agregar prefijo Argentina si faltan\n  let tel = String(c.telefono || '').replace(/\\D/g, '');\n  if (tel.length === 10) {\n    tel = '549' + tel;\n  }\n  const chatId = tel + '@c.us';\n  const message = mensajeTemplate.replace(/\\{empresa\\}/gi, c.nombre_empresa || '');\n  return {\n    json: { chatId, message }\n  };\n});"
      },
      "id": "aaaa0002-0000-0000-0000-000000000002",
      "name": "Formatear Contactos",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [460, 300]
    },
    {
      "parameters": {
        "batchSize": 1,
        "options": {}
      },
      "id": "aaaa0003-0000-0000-0000-000000000003",
      "name": "Split In Batches",
      "type": "n8n-nodes-base.splitInBatches",
      "typeVersion": 3,
      "position": [680, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "http://wwebjs-api:3000/sendMessage",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "x-api-key",
              "value": "={{ $vars.WWEBJS_API_KEY }}"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "keypair",
        "bodyParameters": {
          "parameters": [
            {
              "name": "chatId",
              "value": "={{ $json.chatId }}"
            },
            {
              "name": "message",
              "value": "={{ $json.message }}"
            }
          ]
        },
        "options": {
          "timeout": 30000
        }
      },
      "id": "aaaa0004-0000-0000-0000-000000000004",
      "name": "Enviar Mensaje WhatsApp",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [900, 300]
    },
    {
      "parameters": {
        "resume": "timeInterval",
        "resumeAmount": 45,
        "resumeUnit": "seconds",
        "options": {}
      },
      "id": "aaaa0005-0000-0000-0000-000000000005",
      "name": "Esperar 45s",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1,
      "position": [1120, 300],
      "webhookId": "aaaa0006-0000-0000-0000-000000000006"
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "Formatear Contactos",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Formatear Contactos": {
      "main": [
        [
          {
            "node": "Split In Batches",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Split In Batches": {
      "main": [
        [
          {
            "node": "Enviar Mensaje WhatsApp",
            "type": "main",
            "index": 0
          }
        ],
        []
      ]
    },
    "Enviar Mensaje WhatsApp": {
      "main": [
        [
          {
            "node": "Esperar 45s",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Esperar 45s": {
      "main": [
        [
          {
            "node": "Split In Batches",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "settings": {
    "executionOrder": "v1",
    "saveManualExecutions": true,
    "saveExecutionProgress": true
  },
  "staticData": null,
  "tags": [
    {
      "name": "whatsapp"
    },
    {
      "name": "logistica"
    }
  ]
}
```

- [ ] **Step 2: Verificar JSON válido**

```bash
cat /Users/gus/Developer/ws-automatico/n8n-workflows/whatsapp-csv-workflow.json | python3 -m json.tool > /dev/null && echo "JSON válido ✅" || echo "JSON inválido ❌"
```

Salida esperada: `JSON válido ✅`

- [ ] **Step 3: Commit**

```bash
git add n8n-workflows/whatsapp-csv-workflow.json
git commit -m "feat: agregar workflow n8n para envío masivo WhatsApp"
```

---

## Task 7: Instrucciones de uso para la usuaria

**Files:**
- Create: `docs/instrucciones-uso.md`

- [ ] **Step 1: Crear guía completa**

```markdown
# Instrucciones de uso — Envío Masivo WhatsApp

## ¿Qué hace este sistema?

Te permite enviar mensajes de WhatsApp a múltiples contactos con un solo archivo CSV.
Los mensajes se envían con 45 segundos de intervalo para evitar bloqueos.

---

## Antes de empezar (una sola vez)

### 1. Conectar WhatsApp

1. Abrí el navegador y entrá a `http://[IP-DEL-SERVIDOR]:3000/qr`
2. Vas a ver un código QR
3. En tu teléfono: **WhatsApp → Tres puntitos → Dispositivos vinculados → Vincular dispositivo**
4. Escaneá el QR
5. Listo — la sesión queda guardada. No hay que repetir esto a menos que se desconecte.

---

## Preparar el archivo CSV

### Formato requerido

El archivo debe ser un CSV con exactamente estas dos columnas:

```
telefono,nombre_empresa
1112345678,Logística Express
1187654321,Mega Envíos
1155443322,Despachos Rápidos SA
```

### Reglas del teléfono

- **10 dígitos** (sin 0, sin 15, sin +54): `1112345678` ✅
- **Sin espacios, guiones ni paréntesis**: `(011) 1234-5678` ❌
- **Solo números**: `+5491112345678` ❌

### Cómo crear el CSV desde Excel o Google Sheets

1. Poné los datos en dos columnas: A = telefono, B = nombre_empresa
2. **Excel**: Archivo → Guardar como → CSV UTF-8
3. **Google Sheets**: Archivo → Descargar → Valores separados por comas (.csv)

---

## Cómo usar el formulario

1. Abrí el navegador y entrá a `http://[IP-DEL-SERVIDOR]`
2. **Arrastrá** el CSV al área punteada, o hacé click para seleccionar
3. Si aparecen errores en rojo, corregalos en el CSV y volvé a intentar
4. *(Opcional)* Escribí un mensaje personalizado. Usá `{empresa}` donde debe ir el nombre:
   ```
   Hola! Tu compra fue enviada por {empresa}. Te llega en 48hs.
   ```
5. Hacé click en **Enviar mensajes**
6. Aparece una barra de progreso — el sistema trabaja en segundo plano

### ¿Cuánto tiempo tarda?

| Contactos | Tiempo estimado |
|-----------|----------------|
| 30        | ~24 minutos     |
| 60        | ~47 minutos     |
| 90        | ~71 minutos     |
| 150       | ~118 minutos    |

Podés cerrar el formulario — el envío sigue en el servidor.

---

## Mensajes de error comunes

| Error | Solución |
|-------|---------|
| "Error de red" | Verificar que n8n esté activo (`docker compose ps`) |
| "Columna telefono no encontrada" | Revisar que la primera fila tenga exactamente `telefono,nombre_empresa` |
| "Teléfono inválido fila X" | Ese número no tiene 10 dígitos numéricos |
| Mensajes que no llegan | Verificar que el QR esté escaneado y la sesión activa |

---

## Límites recomendados

- **Máximo por día**: 150 mensajes
- **Primeros 7 días**: No más de 20-30 mensajes/día (calentamiento del número)
- **No usar links acortados** (bit.ly, tinyurl) — pueden disparar el antispam
```

- [ ] **Step 2: Commit**

```bash
git add docs/instrucciones-uso.md
git commit -m "docs: agregar instrucciones de uso para la usuaria"
```

---

## Task 8: Levantar servicios y verificar

- [ ] **Step 1: Levantar todos los contenedores**

```bash
cd /Users/gus/Developer/ws-automatico
docker compose up -d
```

Salida esperada:
```
[+] Running 4/4
 ✔ Network ws-automatico_whatsapp-net  Created
 ✔ Container ws-wwebjs                 Started
 ✔ Container ws-n8n                    Started
 ✔ Container ws-nginx                  Started
```

- [ ] **Step 2: Verificar que los 3 contenedores están corriendo**

```bash
docker compose ps
```

Salida esperada: los 3 contenedores con estado `Up` o `running`.

- [ ] **Step 3: Verificar nginx sirve el formulario**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:80
```

Salida esperada: `200`

- [ ] **Step 4: Verificar n8n responde**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:5678
```

Salida esperada: `200` o `301`

- [ ] **Step 5: Verificar wwebjs-api responde**

```bash
docker exec ws-wwebjs wget -qO- http://localhost:3000/ping 2>/dev/null || \
docker logs ws-wwebjs --tail 5
```

Salida esperada: algún JSON de respuesta o logs mostrando que la API está activa.

- [ ] **Step 6: Importar workflow en n8n**

1. Abrir `http://localhost:5678` en el browser
2. Crear cuenta de admin si es la primera vez
3. **Settings → Variables → Add Variable**: Name = `WWEBJS_API_KEY`, Value = (el valor del .env)
4. Menú izquierdo → **Workflows → Add Workflow → Import from file**
5. Seleccionar `n8n-workflows/whatsapp-csv-workflow.json`
6. Hacer click en **Save** y luego **Activate**

- [ ] **Step 7: Test con CSV de 2 contactos**

Crear archivo `test.csv`:
```csv
telefono,nombre_empresa
1112345678,Test Empresa
```

Subir desde el formulario en `http://localhost:80`. Verificar en n8n (Executions) que la ejecución se inició correctamente.

- [ ] **Step 8: Escanear QR de WhatsApp**

1. Abrir `http://localhost:3000/qr` (o la IP del servidor)
2. Escanear con el teléfono de WhatsApp destinado al envío
3. Verificar que el QR desaparece y se muestra un mensaje de éxito

- [ ] **Step 9: Commit final**

```bash
git add -A
git commit -m "chore: proyecto ws-automatico completo y funcional"
```

---

## Notas de troubleshooting post-instalación

### El webhook devuelve error CORS
Verificar que en docker-compose está `N8N_CORS_ENABLED=true` y `N8N_CORS_ALLOWED_ORIGINS=*`. Reiniciar n8n: `docker compose restart ws-n8n`.

### wwebjs-api no envía mensajes (HTTP 401)
La API key no coincide. Verificar que `WWEBJS_API_KEY` en `.env` es la misma que se configuró en la variable `WWEBJS_API_KEY` de n8n.

### wwebjs-api no envía mensajes (HTTP 4xx/5xx)
El endpoint `/sendMessage` puede variar según la versión. Verificar logs: `docker logs ws-wwebjs --tail 20`. Si la versión usa `/api/sendMessage` o un body diferente (`content` en vez de `message`), actualizar el nodo HTTP Request en n8n.

### La sesión de WhatsApp se desconecta
Normal si el teléfono reinicia o pierde internet. Volver al paso de escanear QR. Las sesiones se persisten en `./sessions/`.

### El workflow tarda más de lo esperado / se corta
Verificar que `N8N_EXECUTIONS_TIMEOUT=10800` esté seteado. Puede verificarse con: `docker exec ws-n8n printenv N8N_EXECUTIONS_TIMEOUT`.
```

- [ ] **Step 2: Commit**

```bash
git add docs/instrucciones-uso.md
git commit -m "docs: instrucciones completas con troubleshooting"
```

---

## Checklist de spec coverage

| Requisito del spec | Tarea |
|-------------------|-------|
| docker-compose con n8n, wwebjs-api, nginx | Task 2 |
| Red Docker `whatsapp-net` | Task 2 |
| Puerto 5678 (n8n), 3000 (wwebjs), 80 (nginx) | Task 2 |
| Formulario HTML con logo y footer simplificIA | Task 4 |
| Upload de CSV con validación | Task 5 |
| Campo mensaje personalizado con `{empresa}` | Task 4 + 5 |
| Barra de progreso estimada | Task 5 |
| Webhook n8n POST `/whatsapp-csv-upload` | Task 6 |
| Formateo de número Argentina (549 + 10 dígitos) | Task 6 |
| Split In Batches batch=1 | Task 6 |
| Wait 45 segundos entre mensajes | Task 6 |
| HTTP Request a `wwebjs-api:3000/sendMessage` | Task 6 |
| Header `x-api-key` | Task 6 |
| Timeout de ejecución 3 horas | Task 2 |
| Sesión WhatsApp persistida en `./sessions` | Task 2 |
| Instrucciones de uso | Task 7 |
| Ruta del proyecto `ws-automatico` | Task 1 |
