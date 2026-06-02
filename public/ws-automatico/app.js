// === Configuración ===
const WEBHOOK_URL = 'https://n8n.simplificia.com.ar/webhook/whatsapp-csv-upload'; // n8n en mismo dominio
const DELAY_POR_MENSAJE_MS = 54000; // promedio ~52s (random 45-60s) + 2s overhead

function getWebhookUrl() {
  return WEBHOOK_URL;
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
    obj._linea = idx + 2; // número de línea en CSV (header = línea 1)
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

  if (errores.length > 0) return errores;

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
      actualizarDropZoneError();
      return;
    }

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

function actualizarDropZoneError() {
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

  const mensaje = mensajeInput.value.trim();
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
