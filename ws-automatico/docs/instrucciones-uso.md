# Instrucciones de uso — Envío Masivo WhatsApp

## ¿Qué hace este sistema?

Te permite enviar mensajes de WhatsApp a múltiples contactos subiendo un archivo CSV.
Los mensajes se envían con 45 segundos de intervalo para evitar bloqueos.

---

## Antes de empezar (una sola vez)

### 1. Conectar WhatsApp al sistema

1. Abrí el navegador y entrá a `http://[IP-DEL-SERVIDOR]:3000/qr`
2. Vas a ver un código QR
3. En tu teléfono: **WhatsApp → Tres puntitos → Dispositivos vinculados → Vincular dispositivo**
4. Escaneá el QR con la cámara
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

| Formato | ¿Válido? |
|---------|---------|
| `1112345678` (10 dígitos, sin 0 ni 15) | ✅ Correcto |
| `1512345678` (con 15) | ❌ No usar |
| `01112345678` (con 0) | ❌ No usar |
| `+5491112345678` | ❌ No usar |

### Cómo crear el CSV desde Excel o Google Sheets

**Desde Excel:**
1. Columna A: `telefono` (header) + los números
2. Columna B: `nombre_empresa` (header) + los nombres
3. Archivo → Guardar como → **CSV UTF-8**

**Desde Google Sheets:**
1. Mismo formato de columnas
2. Archivo → Descargar → **Valores separados por comas (.csv)**

---

## Cómo usar el formulario

1. Abrí el navegador y entrá a `http://[IP-DEL-SERVIDOR]`
2. **Arrastrá** el CSV al área punteada, o hacé click para seleccionar
3. Si aparecen errores en rojo, corregalos en el CSV y volvé a subir
4. *(Opcional)* Escribí un mensaje personalizado usando `{empresa}` como variable:
   ```
   Hola! Tu compra fue enviada por {empresa}. Te llega en 48hs. ¡Gracias!
   ```
   Si dejás el campo vacío, se usa el mensaje por defecto.
5. Hacé click en **Enviar mensajes**
6. Aparece una barra de progreso — el sistema trabaja en segundo plano

> Podés cerrar el formulario sin problema. El envío sigue corriendo en el servidor.

---

## ¿Cuánto tiempo tarda?

| Contactos | Tiempo estimado |
|-----------|----------------|
| 30        | ~24 minutos     |
| 60        | ~47 minutos     |
| 90        | ~71 minutos     |
| 150       | ~118 minutos    |

---

## Mensajes de error comunes

| Error en pantalla | Qué hacer |
|-------------------|-----------|
| Columna "telefono" no encontrada | Verificar que la primera fila diga exactamente `telefono,nombre_empresa` |
| Teléfono inválido fila X | Ese número no tiene 10 dígitos. Corregirlo en el CSV |
| "nombre_empresa" está vacío | Completar el nombre de empresa en esa fila |
| Error de red / servidor respondió 4xx | Verificar que n8n esté activo. Avisarle al administrador |
| Los mensajes no llegan | La sesión de WhatsApp puede haberse desconectado. Repetir el paso del QR |

---

## Límites importantes

- **Máximo por día:** 150 mensajes
- **Primeros 7 días:** Enviar no más de 20-30 mensajes por día (calentamiento del número)
- **No usar links acortados** (bit.ly, tinyurl, etc.) — pueden activar el filtro antispam
- Si WhatsApp pide verificación o muestra advertencias, detener los envíos ese día

---

## Mensaje por defecto

Si no escribís un mensaje personalizado, se envía este:

> Hola, tu paquete fue despachado por **[empresa]** y está en camino. Llegará en 2-3 días hábiles.
