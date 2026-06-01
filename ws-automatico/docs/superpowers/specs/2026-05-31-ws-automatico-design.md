# Diseño: Sistema de Envío Masivo de WhatsApp (ws-automatico)

**Fecha:** 2026-05-31  
**Proyecto:** ws-automatico  
**Cliente interno:** simplificIA — www.simplificia.com.ar  
**Caso de uso:** Notificaciones transaccionales de paquetes despachados (90-150/día)

---

## Contexto y Objetivo

Una usuaria freelance de logística necesita enviar entre 90 y 150 mensajes diarios de WhatsApp notificando a destinatarios que su paquete fue despachado. El mensaje varía por empresa remitente. La solución usa un número comprado específicamente para esto (no la API oficial de WhatsApp Business).

**Restricción crítica de anti-bloqueo:** 1 mensaje cada 45 segundos como mínimo. Máximo 150 mensajes/día. Los primeros 7 días calentar el número con 20-30 mensajes/día.

---

## Arquitectura

Tres contenedores Docker en red interna `whatsapp-net`:

```
[Browser de la usuaria]
        │
        ▼
┌───────────────┐     ┌──────────────┐     ┌─────────────────┐
│    nginx      │────▶│     n8n      │────▶│   wwebjs-api    │
│  puerto :80   │     │  puerto :5678│     │  puerto :3000   │
│  (formulario) │     │  (workflow)  │     │  (WhatsApp Web) │
└───────────────┘     └──────────────┘     └─────────────────┘
```

- **nginx**: sirve el formulario HTML estático. Puerto 80 expuesto al host.
- **n8n**: procesa el CSV, itera con delay, llama a wwebjs-api. Puerto 5678 expuesto al host (para panel de administración).
- **wwebjs-api** (`avoylenko/wwebjs-api:1.34.6`): ejecuta whatsapp-web.js, expone REST API. Puerto 3000 solo interno (no expuesto al host por seguridad).

### Volúmenes
| Volumen | Contenido |
|---------|-----------|
| `n8n_data` | Configuración y workflows de n8n |
| `./sessions` | Sesión persistente de WhatsApp Web |
| `./form` | Archivos HTML/CSS/JS del formulario |
| `./n8n-workflows` | JSON del workflow para importar |

### Variables de entorno (`.env`)
```
WWEBJS_API_KEY=clave-secreta-aqui
N8N_EXECUTIONS_TIMEOUT=10800
```

---

## Workflow n8n (Opción B: Split In Batches + Wait)

```
Webhook POST /whatsapp-csv-upload
    │
    ▼
Extract From File  →  CSV a array JSON [{telefono, nombre_empresa}]
    │
    ▼
Code Node
  - Normalizar teléfono: si 10 dígitos → agregar "549"; si 13 → dejar igual
  - Construir chatId: "549XXXXXXXXXX@c.us"
  - Aplicar mensaje: reemplazar {empresa} en texto custom o usar default
    │
    ▼
Split In Batches (Batch Size: 1)
    │
    ▼
HTTP Request → POST http://wwebjs-api:3000/sendMessage
  Headers: { "x-api-key": "{{WWEBJS_API_KEY}}" }
  Body:    { "chatId": "...", "message": "..." }
    │
    ▼
Wait Node (45 segundos)
    │
    └── (loop al siguiente batch hasta agotar items)
```

**Mensaje default:**
```
Hola, tu paquete fue despachado por {empresa} y está en camino. Llegará en 2-3 días hábiles.
```

**Normalización de teléfonos (Argentina):**
- 10 dígitos (ej: `1112345678`) → `5491112345678@c.us`
- 13 dígitos (ej: `5491112345678`) → `5491112345678@c.us`
- Cualquier otro formato → error marcado en log

**Timeout de ejecución:** `N8N_EXECUTIONS_TIMEOUT=10800` (3 horas) en docker-compose para soportar 150 mensajes × 47s ≈ 118 minutos.

---

## Formulario HTML

### Layout
```
┌─────────────────────────────────────────┐
│           [Logo simplificIA]            │
│        Envío Masivo WhatsApp            │
├─────────────────────────────────────────┤
│  📎 Zona drag & drop para CSV           │
│     ✓ archivo.csv (150 filas)           │
│                                         │
│  💬 Mensaje personalizado (opcional)    │
│     [textarea con placeholder default]  │
│     ℹ Usá {empresa} como variable       │
│                                         │
│  [    ENVIAR MENSAJES    ]              │
│                                         │
│  ████████░░░░░░░░░  45% (68/150)       │
│  ✓ Enviando... próximo en 45s          │
├─────────────────────────────────────────┤
│  simplificIA · www.simplificia.com.ar   │
│  info@simplificia.com.ar                │
└─────────────────────────────────────────┘
```

### Colores de marca
- Primary: `#96bd45`
- Primary dark: `#15803d`
- Fondo: `#F9FAFB`
- Logo: `/img/logo.png` (copiado desde simplificia/public/img/)

### Validaciones (client-side, antes de enviar)
1. Archivo debe ser `.csv`
2. CSV debe contener columnas `telefono` y `nombre_empresa`
3. Cada `telefono` debe tener 10 o 13 dígitos numéricos
4. Si hay filas inválidas: listarlas con número de fila antes de permitir envío

### Estados de UI
| Estado | Descripción |
|--------|-------------|
| Inicial | Formulario limpio |
| Archivo cargado | Nombre del archivo + cantidad de filas válidas |
| Enviando | Botón deshabilitado, barra de progreso animada, contador regresivo |
| Éxito | Mensaje verde con total enviado |
| Error | Mensaje rojo con detalle del error |

### Progreso estimado
La barra de progreso es local (no hay callback en tiempo real desde n8n). El JS calcula duración total = `filas × 47s` y anima la barra de forma lineal desde el momento del envío.

---

## Estructura de archivos

```
/Users/gus/Developer/ws-automatico/
├── docker-compose.yml
├── .env
├── .gitignore                        (ignorar .env y sessions/)
├── form/
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── img/
│       └── logo.png                  (copiado desde simplificia)
├── sessions/                         (creada automáticamente por wwebjs-api)
├── n8n-workflows/
│   └── whatsapp-csv-workflow.json
└── docs/
    ├── instrucciones-uso.md
    └── superpowers/specs/
        └── 2026-05-31-ws-automatico-design.md
```

---

## CSV de entrada

**Formato requerido:**
```csv
telefono,nombre_empresa
1112345678,Logística Express
1187654321,Mega Envíos
```

- Sin `+`, sin `549`, sin espacios, sin guiones
- Codificación UTF-8 (para nombres con acentos)
- Primera fila: headers exactos `telefono` y `nombre_empresa`

---

## Instrucciones de primer uso

1. Copiar `.env.example` a `.env` y configurar `WWEBJS_API_KEY`
2. `docker compose up -d`
3. Abrir `http://servidor:3000/qr` para ver el QR de WhatsApp
4. Escanear el QR con el teléfono designado
5. Sesión guardada en `./sessions/` — no repetir hasta que expire
6. Abrir n8n en `http://servidor:5678`
7. Importar `n8n-workflows/whatsapp-csv-workflow.json`
8. Activar el workflow
9. La usuaria accede a `http://servidor` y usa el formulario

---

## Benchmarks anti-bloqueo

| Parámetro | Valor |
|-----------|-------|
| Delay entre mensajes | 45 segundos |
| Máximo diario | 150 mensajes |
| Tiempo total (150 msgs) | ~118 minutos |
| Calentamiento (semana 1) | 20-30 msgs/día |
| Links acortados | NO usar |
| API oficial WhatsApp | NO (usa whatsapp-web.js) |

---

## Archivos a generar

| Archivo | Descripción |
|---------|-------------|
| `docker-compose.yml` | Todos los servicios con red y volúmenes |
| `.env` | Variables secretas |
| `.gitignore` | Excluye .env, sessions/ |
| `form/index.html` | Formulario completo con branding simplificIA |
| `form/style.css` | Estilos con colores de marca |
| `form/app.js` | Lógica de upload, validación, progreso |
| `n8n-workflows/whatsapp-csv-workflow.json` | Workflow n8n listo para importar |
| `docs/instrucciones-uso.md` | Guía para la usuaria |
