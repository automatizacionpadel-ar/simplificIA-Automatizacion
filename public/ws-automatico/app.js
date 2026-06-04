// === Plantillas de mensaje ===
const PLANTILLAS = [
  '👋🏻Hola! Nos contactamos desde Buenos Aires Logística. 🚚 Tenemos un envío de {empresa} para entregarte.\nQueremos avisarte que la entrega se realizará hoy entre las 16:00 y las 22:00 hs.\nEn caso de que por cuestiones operativas no llegue a completarse dentro de ese rango, la entrega pasará automáticamente al siguiente día hábil entre las 10:30 y las 22:00 hs.\nAgradecemos tu comprensión y quedamos atentos ante cualquier consulta 🙌',
  '📦 ¡Hola! Te contactamos desde Buenos Aires Logística.\n\nQueremos informarte que tenemos un envío de {empresa} programado para ser entregado hoy 🚚.\n\n⏰ El horario estimado de entrega es entre las 16:00 y las 22:00 hs.\n\nSi por razones operativas no fuera posible concretar la entrega dentro de ese período, el envío será reprogramado automáticamente para el próximo día hábil entre las 10:30 y las 22:00 hs.\n\n¡Muchas gracias por tu comprensión! 😊 Estamos a disposición para cualquier consulta.',
  '👋 ¡Hola que tal!\n\nDesde Buenos Aires Logística queremos avisarte que tu envío de {empresa} se encuentra en ruta 🚛.\n\n📍 La entrega está prevista para hoy entre las 16:00 y las 22:00 hs.\n\nEn caso de surgir alguna demora operativa que impida completar la entrega en ese horario, la misma se realizará el siguiente día hábil dentro de la franja de 10:30 a 22:00 hs.\n\nGracias por tu paciencia y confianza. 🙌 Ante cualquier duda, estamos para ayudarte.',
  '🚚 ¡Hola!\n\nTe escribimos desde Buenos Aires Logística para informarte que estamos coordinando la entrega de tu envío de {empresa}.\n\n🕓 La visita está programada para realizarse hoy entre las 16:00 y las 22:00 hs.\n\nSi por motivos logísticos la entrega no pudiera efectuarse en ese rango horario, se reagendará automáticamente para el próximo día hábil entre las 10:30 y las 22:00 hs.\n\n✨ Gracias por tu comprensión. Si necesitas asistencia o tienes alguna consulta, no dudes en contactarnos.'
];

const DELAY_MIN_MS = 45000;
const DELAY_MAX_MS = 90000;
const DELAY_CHECK_MS = 1000;

// === Referencias al DOM ===
const dropZone           = document.getElementById('dropZone');
const csvInput           = document.getElementById('csvInput');
const fileInfo           = document.getElementById('fileInfo');
const fileInfoText       = document.getElementById('fileInfoText');
const valErrors          = document.getElementById('validationErrors');
const errorList          = document.getElementById('errorList');
const mensajeInput       = document.getElementById('mensajeInput');
const btnSubmit          = document.getElementById('btnSubmit');
const progressSection    = document.getElementById('progressSection');
const progressLabel      = document.getElementById('progressLabel');
const progressFill       = document.getElementById('progressFill');
const progressStatus     = document.getElementById('progressStatus');
const alertSuccess       = document.getElementById('alertSuccess');
const alertError         = document.getElementById('alertError');
const noWhatsappSection  = document.getElementById('noWhatsappSection');
const noWhatsappList     = document.getElementById('noWhatsappList');
const resultadoSection   = document.getElementById('resultadoSection');
const modalOverlay       = document.getElementById('modalOverlay');
const btnAbrirMensaje    = document.getElementById('btnAbrirMensaje');
const btnCerrarModal     = document.getElementById('btnCerrarModal');
const btnGuardarMensaje  = document.getElementById('btnGuardarMensaje');
const btnLimpiarMensaje  = document.getElementById('btnLimpiarMensaje');
const mensajeBadge       = document.getElementById('mensajeBadge');

let contactosParsed = [];
let enviandoActivo  = false;

// === Drag & Drop ===
dropZone.addEventListener('dragover', e => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  if (e.dataTransfer.files[0]) procesarArchivo(e.dataTransfer.files[0]);
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
    obj._linea = idx + 2;
    return obj;
  });
  return { headers, filas };
}

// === Validaciones ===
function validarCSV(headers, filas) {
  const errores = [];
  if (!headers.includes('telefono')) errores.push('Columna "telefono" no encontrada.');
  if (!headers.includes('nombre_empresa')) errores.push('Columna "nombre_empresa" no encontrada.');
  if (errores.length > 0) return errores;
  filas.forEach(fila => {
    const tel = String(fila.telefono || '').replace(/\D/g, '');
    if (tel.length !== 10 && tel.length !== 13)
      errores.push(`Fila ${fila._linea}: teléfono "${fila.telefono}" inválido (debe tener 10 o 13 dígitos).`);
    if (!fila.nombre_empresa || !fila.nombre_empresa.trim())
      errores.push(`Fila ${fila._linea}: "nombre_empresa" está vacío.`);
  });
  return errores;
}

function procesarArchivo(file) {
  ocultarTodo();
  contactosParsed = [];
  btnSubmit.disabled = true;
  if (!file.name.toLowerCase().endsWith('.csv')) {
    mostrarValidationErrors(['El archivo debe ser un CSV (.csv).']);
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    const { headers, filas } = parsearCSV(e.target.result);
    if (filas.length === 0) { mostrarValidationErrors(['El CSV está vacío.']); return; }
    const errores = validarCSV(headers, filas);
    if (errores.length > 0) { mostrarValidationErrors(errores); actualizarDropZoneError(); return; }
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
function ocultarTodo() {
  alertSuccess.classList.remove('visible');
  alertError.classList.remove('visible');
  progressSection.classList.remove('visible');
  noWhatsappSection.classList.remove('visible');
  noWhatsappList.innerHTML = '';
  resultadoSection.classList.remove('visible');
  resultadoSection.innerHTML = '';
}

function mostrarResumen(sinWhatsapp, fallos, enviados, detenido) {
  noWhatsappSection.classList.remove('visible');

  let html = '';

  if (detenido) {
    html += '<div class="resumen-item resumen-stopped">🛑 Proceso detenido por el usuario</div>';
  }

  if (enviados > 0) {
    const s = enviados !== 1;
    html += '<div class="resumen-item resumen-ok">';
    html += '✅ ' + enviados + ' mensaje' + (s ? 's' : '') + ' enviado' + (s ? 's' : '') + ' correctamente';
    html += '</div>';
  }

  if (sinWhatsapp.length > 0) {
    const s = sinWhatsapp.length !== 1;
    html += '<div class="resumen-item resumen-warn">';
    html += '<strong>⚠️ ' + sinWhatsapp.length + ' contacto' + (s ? 's' : '') + ' sin WhatsApp (omitido' + (s ? 's' : '') + '):</strong>';
    html += '<ul>' + sinWhatsapp.map(function(c) {
      return '<li>' + c.nombre_empresa + ' · ' + c.telefono + '</li>';
    }).join('') + '</ul>';
    html += '</div>';
  }

  if (fallos.length > 0) {
    const s = fallos.length !== 1;
    html += '<div class="resumen-item resumen-error">';
    html += '<strong>❌ ' + fallos.length + ' error' + (s ? 'es' : '') + ' de envío:</strong>';
    html += '<ul>' + fallos.map(function(f) {
      return '<li>' + f.contacto.nombre_empresa + ' · ' + f.contacto.telefono + ' — ' + f.error + '</li>';
    }).join('') + '</ul>';
    html += '</div>';
  }

  if (html) {
    resultadoSection.innerHTML = html;
    resultadoSection.classList.add('visible');
  }
}
function formatDuracion(ms) {
  const mins = Math.round(ms / 60000);
  return mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}min` : `${mins} min`;
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// === Fase 1: Verificar números ===
async function verificarNumeros(contactos) {
  const total = contactos.length;
  var sinWhatsapp = [];
  var conWhatsapp = [];

  progressSection.classList.add('visible');
  progressFill.style.width = '0%';
  progressLabel.textContent = '0%';

  for (let i = 0; i < total; i++) {
    if (!enviandoActivo) break;

    const c = contactos[i];
    const pct = Math.round((i / total) * 100);
    progressFill.style.width = `${pct}%`;
    progressLabel.textContent = `${pct}%`;
    progressStatus.textContent = `🔍 Verificando ${i + 1}/${total}: ${c.nombre_empresa}...`;

    try {
      const res = await fetch('/ws-automatico/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telefono: c.telefono })
      });
      const data = await res.json();
      if (data.hasWhatsapp) {
        conWhatsapp.push(c);
      } else {
        sinWhatsapp.push(c);
      }
    } catch {
      conWhatsapp.push(c);
    }

    if (i < total - 1 && enviandoActivo) await sleep(DELAY_CHECK_MS);
  }

  // Mostrar los que no tienen WhatsApp
  if (sinWhatsapp.length > 0) {
    noWhatsappList.innerHTML = sinWhatsapp
      .map(c => `<li>${c.nombre_empresa} (${c.telefono})</li>`)
      .join('');
    noWhatsappSection.classList.add('visible');
  }

  return { conWhatsapp: conWhatsapp, sinWhatsapp: sinWhatsapp };
}

// === Fase 2: Enviar mensajes ===
function elegirMensaje(nombreEmpresa, mensajeCustom) {
  const base = mensajeCustom || PLANTILLAS[Math.floor(Math.random() * PLANTILLAS.length)];
  return base.replace(/\{empresa\}/gi, nombreEmpresa);
}

async function enviarContactos(contactos, mensajeCustom) {
  var total = contactos.length;
  var fallos = [];
  var enviados = 0;

  for (var i = 0; i < total; i++) {
    if (!enviandoActivo) break;

    var contacto = contactos[i];
    var mensaje = elegirMensaje(contacto.nombre_empresa, mensajeCustom);

    progressFill.style.width = Math.round((i / total) * 100) + '%';
    progressLabel.textContent = Math.round((i / total) * 100) + '%';
    progressStatus.textContent = '📤 Enviando ' + (i + 1) + '/' + total + ': ' + contacto.nombre_empresa + '...';

    try {
      var res = await fetch('/ws-automatico/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telefono: contacto.telefono, nombre_empresa: contacto.nombre_empresa, mensaje: mensaje })
      });
      if (!res.ok) {
        var errData = await res.json().catch(function() { return {}; });
        var errorMsg = errData.error || ('HTTP ' + res.status);
        console.warn('Error en ' + contacto.nombre_empresa + ':', errorMsg);
        fallos.push({ contacto: contacto, error: errorMsg });
      } else {
        enviados++;
      }
    } catch (err) {
      var redMsg = err.message || 'Error de red';
      console.warn('Error de red en ' + contacto.nombre_empresa + ':', redMsg);
      fallos.push({ contacto: contacto, error: redMsg });
    }

    if (i < total - 1 && enviandoActivo) {
      var delay = Math.floor(Math.random() * (DELAY_MAX_MS - DELAY_MIN_MS + 1)) + DELAY_MIN_MS;
      var proximos = total - i - 1;
      progressStatus.textContent = '⏳ Esperando ' + Math.round(delay / 1000) + 's — quedan ' + proximos + ' mensaje' + (proximos !== 1 ? 's' : '');
      await sleep(delay);
    }
  }

  return { enviados: enviados, fallos: fallos };
}

// === Modal mensaje personalizado ===
function actualizarBtnMensaje() {
  var tiene = mensajeInput.value.trim().length > 0;
  mensajeBadge.style.display = tiene ? 'inline' : 'none';
  if (tiene) {
    btnAbrirMensaje.classList.add('activo');
  } else {
    btnAbrirMensaje.classList.remove('activo');
  }
}

function abrirModal() {
  modalOverlay.classList.add('visible');
  mensajeInput.focus();
}

function cerrarModal() {
  modalOverlay.classList.remove('visible');
  actualizarBtnMensaje();
}

btnAbrirMensaje.addEventListener('click', abrirModal);
btnCerrarModal.addEventListener('click', cerrarModal);

btnGuardarMensaje.addEventListener('click', cerrarModal);

btnLimpiarMensaje.addEventListener('click', function() {
  mensajeInput.value = '';
});

modalOverlay.addEventListener('click', function(e) {
  if (e.target === modalOverlay) cerrarModal();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && modalOverlay.classList.contains('visible')) cerrarModal();
});

// === Botón principal ===
btnSubmit.addEventListener('click', async () => {
  if (enviandoActivo) {
    enviandoActivo = false;
    btnSubmit.textContent = 'Deteniendo...';
    btnSubmit.disabled = true;
    return;
  }

  if (contactosParsed.length === 0) return;

  ocultarTodo();
  enviandoActivo = true;
  btnSubmit.textContent = '⏹ Detener';
  btnSubmit.disabled = false;

  // Fase 1: verificación
  progressStatus.textContent = '🔍 Verificando números con WhatsApp...';
  var resultado = await verificarNumeros([...contactosParsed]);
  var conWhatsapp = resultado.conWhatsapp;
  var sinWhatsapp = resultado.sinWhatsapp;

  if (!enviandoActivo) {
    progressStatus.textContent = '🛑 Verificación detenida por el usuario';
    mostrarResumen(sinWhatsapp, [], 0, true);
    btnSubmit.disabled = false;
    btnSubmit.textContent = 'Enviar mensajes';
    return;
  }

  if (conWhatsapp.length === 0) {
    progressSection.classList.add('visible');
    progressStatus.textContent = '⚠️ Ningún contacto tiene WhatsApp activo.';
    progressFill.style.width = '100%';
    progressLabel.textContent = '100%';
    mostrarResumen(sinWhatsapp, [], 0, false);
    enviandoActivo = false;
    btnSubmit.disabled = false;
    btnSubmit.textContent = 'Enviar mensajes';
    return;
  }

  // Fase 2: envío
  var mensajeCustom = mensajeInput.value.trim() || null;
  var tiempoEstimado = conWhatsapp.length * ((DELAY_MIN_MS + DELAY_MAX_MS) / 2);
  progressStatus.textContent = '📤 Iniciando envío a ' + conWhatsapp.length + ' contactos. Tiempo estimado: ' + formatDuracion(tiempoEstimado);
  progressFill.style.width = '0%';
  progressLabel.textContent = '0%';

  var envioResultado = await enviarContactos(conWhatsapp, mensajeCustom);
  var enviados = envioResultado.enviados;
  var fallos = envioResultado.fallos;
  var detenido = !enviandoActivo;

  progressFill.style.width = '100%';
  progressLabel.textContent = '100%';
  progressStatus.textContent = detenido
    ? '🛑 Envío detenido — ' + enviados + ' mensajes enviados antes de detener'
    : '✅ Proceso finalizado — ' + enviados + ' mensajes enviados';

  mostrarResumen(sinWhatsapp, fallos, enviados, detenido);

  enviandoActivo = false;
  btnSubmit.disabled = false;
  btnSubmit.textContent = 'Enviar mensajes';
});
