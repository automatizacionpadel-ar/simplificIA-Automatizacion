# Propuesta: Nuevo Servicio de Creación de Páginas Web — SimplificIA

> Fecha: Octubre 2026 | Estado: Propuesta / Para revisión
> Objetivo: Agregar "Páginas Web Inteligentes" como 5to servicio (y vertical de ingreso recurrente) sin romper la propuesta actual de Automatización con IA.

---

## 1. Resumen ejecutivo

SimplificIA hoy vende **automatización + IA para PyMEs** (Integración IA, Automatización de Procesos, Consultoría, Agentes IA 24/7) con un funnel de **Auditoría Gratuita en 2 pasos** (`AuditStep1` → `AuditStep2`).

**La oportunidad:** la mayoría de las PyMEs argentinas que necesitan automatización **tampoco tienen una web decente** (o tienen una lenta, no responsive, sin WhatsApp, sin SEO). Si les vendemos solo el "cerebro" (IA) sin la "cara" (web), dejamos plata sobre la mesa y el lead se enfría.

**La propuesta:** lanzar **"Webs Inteligentes SimplificIA"**: páginas web ultrarrápidas, optimizadas para convertir (WhatsApp + leads), **con IA y automatizaciones ya integradas de fábrica**. No es "hago páginas web" genérico. Es el diferenciador:

> *"No te hacemos una web. Te montamos tu vendedor digital 24/7 conectado a tu operación."*

Esto nos permite:
1. **Bajar la barrera de entrada** (una web es más fácil de entender/comprar que "automatización").
2. **Subir el ticket + MRR** (web + agente IA + mantenimiento = combo).
3. **Reutilizar 90% del stack actual** (React + Vite + Tailwind, Vercel) y componentes existentes.

---

## 2. Análisis del proyecto actual (qué tenemos y qué falta)

### Lo que ya funciona bien
- **Stack simple y rápido:** React 19 + Vite + Tailwind CDN, deploy en Vercel (`vercel.json`). Ideal para clonar como base de webs de clientes.
- **Identidad clara:** verde `#96bd45`, dark mode, `glass-card`, `rounded-super (2.5rem)`, tipografías Plus Jakarta Sans + Inter. Sistema de diseño ya definido → reutilizable para plantillas de clientes.
- **Funnel de conversión probado:** `Hero → Prueba Gratuita → AuditStep1 (área + herramientas) → AuditStep2`. Es el activo más valioso.
- **Prueba social:** sección `SocialProof` con métricas (24/7, +40% conversión, 98% satisfacción).

### Gaps para vender webs hoy
1. `Services.tsx` solo tiene 4 servicios, ninguno habla de web → el visitante con necesidad web rebota.
2. `AuditStep1.tsx` pregunta por Ventas / Atención / Operaciones, pero no por **"¿Tenés web? ¿Cómo te llegan clientes hoy?"** → perdemos qualifier clave.
3. No hay **portafolio / demo / pricing** → un servicio web sin ejemplos no convierte.
4. No hay oferta de **mantenimiento / hosting / SEO** → se pierde el ingreso recurrente (lo más rentable).

---

## 3. Propuesta de servicio: "Webs Inteligentes"

### 3.1 Posicionamiento (cómo no sonar genérico)
No competir con "diseño web barato". Competir en 3 ejes:

| Eje | Web tradicional | Web SimplificIA |
|---|---|---|
| Velocidad | WordPress pesado (3-6s) | Vite/React estático (<1.5s garantizado) |
| Conversión | Formulario que nadie mira | Botón WhatsApp + Agente IA 24/7 que califica y agenda |
| Operación | Sitio aislado | Conectada a CRM / Sheets / Email / n8n desde día 1 |

**Naming sugerido:** `Web Inteligente` (no "página web"). Icono Material: `language` o `web` o `rocket_launch`.

**Claim:** *"Tu web que vende mientras dormís, conectada a tu WhatsApp y a tu CRM."*

### 3.2 Paquetes (3 niveles, precios sugeridos ARS/USD)

> Ajustar a tu costo/hora real. La lógica es: entrada barata → upsell a IA.

**1. Landing Esencial (producto de entrada, 7-10 días)**
- One-page (como la actual de SimplificIA): Hero + Servicios + Proceso + Testimonios + Contacto + WhatsApp flotante.
- Copy base + fotos del cliente, responsive, SEO básico, Google Maps + Instagram.
- Formulario → WhatsApp + Email (Resend ya está en `package.json`).
- Ideal para: profesionales, locales, oficios.
- Precio sugerido: **USD 400-600** único + mantenimiento opcional.

**2. Web PyME + IA (core, 2-3 semanas) — ⭐ EL QUE IMPULSAMOS**
- Todo lo Esencial + hasta 5 secciones/páginas (Servicios, Nosotros, FAQ, Blog simple).
- **Agente IA 24/7** (chat que responde con info del negocio + deriva a WhatsApp) → reutiliza tu servicio actual.
- Conexiones: Google Sheets/CRM, email automático, turno/reserva por WhatsApp.
- SEO local (ficha Google, keywords por ciudad), Analytics + Pixel.
- Precio sugerido: **USD 900-1.500** + MRR.

**3. Web + Automatización Total (premium, 3-5 semanas)**
- Todo lo anterior + multi-idioma o catálogo, integraciones n8n/Make, dashboard simple, email marketing (`email-campana.html` ya existe → reutilizar).
- Ideal para: agencias (¡tenés data scrapeada en `agencias_por_provincia/`!), inmobiliarias, clínicas.
- Precio sugerido: **USD 2.000+** + MRR alto.

**MRR (la clave de rentabilidad): Plan Care IA — USD 30-80/mes**
- Hosting Vercel + dominio + SSL, cambios de texto/fotos (X/mes), backup, monitoreo uptime, reporte mensual, mejoras IA continuas.
- Objetivo: 70% de clientes web en Care a los 6 meses.

### 3.3 Qué incluye "de fábrica" (checklist diferenciador)
- [ ] Performance: Lighthouse >90 (mobile), imágenes `public/img` optimizadas (WebP), lazy-load.
- [ ] SEO técnico: title/meta por página, Open Graph, sitemap, `robots.txt`, schema.org LocalBusiness.
- [ ] Conversión: CTA WhatsApp sticky, formulario corto (nombre + WhatsApp + mensaje), prueba social, garantía (reutilizar banner de `SocialProof.tsx:89-100`).
- [ ] IA: chatbot con FAQs del negocio, respuestas fuera de horario, resumen diario de leads al dueño por email/WhatsApp.
- [ ] Medición: GA4 + Search Console + evento "click WhatsApp" como conversión.
- [ ] Legal AR: aviso Ley de Defensa del Consumidor, link AFIP / botón de arrepentimiento si vende online.

---

## 4. Cómo integrarlo al sitio actual (cambios mínimos, máximo impacto)

### Fase 1 — Sin romper nada (1-2 días dev)
1. **`components/Services.tsx`:** agregar 5to item:
   - `icon: 'language', title: 'Webs Inteligentes', description: 'Páginas ultrarrápidas que convierten visitas en WhatsApps, con IA y CRM conectados.'`
   - Cambiar grid de `lg:grid-cols-4` → `lg:grid-cols-3` + fila destacada, o `md:grid-cols-2 lg:grid-cols-5` → mejor: grid 3+2 o card destacada full-width. Recomendado: pasar a `lg:grid-cols-3` con la card Web en highlight (borde primary).
2. **`components/Navbar.tsx`:** agregar link `Webs` (`#webs`) entre Servicios y Proceso.
3. **Nueva sección `components/WebPlans.tsx` (id="webs"):** 3 cards de pricing + comparativa + CTA "Quiero mi web" → reutiliza estilos `glass-card` + `rounded-super`.
4. **`components/Hero.tsx`:** test A/B del subtítulo: agregar línea *"¿Sin web o con una web que no vende? Te la creamos con IA integrada."* + botón secundario "Ver Webs".
5. **`components/AuditStep1.tsx`:** agregar pregunta 0: *"¿Cómo te encuentran hoy tus clientes?"* [Instagram / Google / Recomendación / No tengo web] + card 4ta área: `Web / Presencia online`. Esto califica automáticamente para el upsell web.

### Fase 2 — Conversión (3-5 días)
6. **Demo viva:** `/demo-web` (ruta o vista `AppView` nueva `demo-web`): clonar `App.tsx` landing pero con datos ficticios de cliente tipo (ej: "Clínica Dental Córdoba") para mostrar "mirá lo que te entregamos". Es tu mejor vendedor.
7. **Portafolio + antes/después:** sección con Lighthouse scores (ej: "De 38 → 96 en mobile").
8. **Calculadora ROI web:** extender el panel lateral de `AuditStep1.tsx:101-134` ("Resultados Esperados") con *"Leads extra/mes estimados con Web + IA"*.
9. **`Footer.tsx`:** agregar columna "Webs" (Precios, Demos, Mantenimiento) + email `webs@simplificia.com.ar` si aplica.

### Fase 3 — Operativa (para escalar)
10. **Template base versionado:** crear `templates/web-base/` clonando este repo (Navbar/Hero/Services/Process/Footer) con variables `cliente.json` (nombre, colores, WhatsApp, servicios). Cada web nueva = fork + config, no desde cero.
11. **Automatizar entrega:** script `new-client.sh` que copia template, cambia logo/colores, deploy preview en Vercel. Objetivo: landing en <8hs de trabajo.
12. **Pipeline n8n (ya tenés `workflow_ia.json`, `ws-automatico/`):** Form web → valida → guarda en Sheets/CRM → avisa WhatsApp dueño → email bienvenida lead → resumen diario IA.

---

## 5. Optimización: cómo hacerlo rentable y rápido

### 5.1 Producto (menos horas, más valor)
- **No custom total al inicio:** 2 plantillas (Servicios / Local gastronómico-salud) cubren 80% de PyMEs. Custom = premium.
- **Contenido con IA:** pedir al cliente 10 respuestas por WhatsApp → generar copy + FAQs con IA → cliente solo aprueba. Reduce idas y vueltas (el cuello de botella #1 en webs).
- **Fotos:** banco + fotos celu del cliente optimizadas; no esperar sesión profesional para lanzar.
- **Alcance cerrado por contrato:** nº páginas, nº revisiones (2), qué NO incluye. Evita scope creep.

### 5.2 Técnica (aprovechar lo que ya hay)
- **Reutilizar:** Tailwind CDN config de `index.html:17-38`, `glass-card`, dark mode. No introducir nuevo framework.
- **Migrar a Tailwind v4 / CSS propio a mediano plazo:** hoy el CDN + `?plugins=` es rápido para prototipo pero penaliza performance real de clientes. Para webs de clientes usar build Vite puro (`vite build`) y quitar importmap `esm.sh` de `index.html:68-76` (latencia + dependencia externa).
- **Formularios:** usar endpoint `api/` existente + Resend (ya dependencia) → WhatsApp deep link como fallback si falla el backend.
- **SEO/Perf checklist automatizado:** script `lighthouse-ci` en `package.json` que bloquee deploy si <90.
- **Analytics único:** un snippet GA4 + evento `whatsapp_click` estándar en todas las webs → reportes mensuales automáticos = justifica el MRR.

### 5.3 Comercial (vender más con lo mismo)
- **Web como lead magnet de automatización:** "Te hacemos la web; a los 60 días te mostramos qué automatizar con los datos reales de tus leads". Tasa de upsell esperada 30-40%.
- **Combo explícito:** Landing + Agente IA con 20% off vs. separado. Ancla el paquete medio.
- **Garantía espejo:** extender la "Garantía 100% 30 días" de `SocialProof` a webs ("si no carga en <2s, la optimizamos gratis").
- **Nichos con data propia:** tenés `scrape_agencias.py`, `agencias_por_provincia/`, `apify_results/` → campaña outbound a agencias de viajes/turismo ("vimos tu web, te hacemos demo gratis en 48hs"). Es oro sin explotar.
- **Pricing psicológico AR:** mostrar USD + ARS, pago en cuotas, descuento pago único. Mantenimiento en ARS mensual ajustable.

### 5.4 Métricas (para saber si funciona)
- Conversión Hero → Auditoría (baseline actual vs. con link Webs).
- % audits que marcan "Sin web / Web vieja" (nuevo campo paso 1).
- Tiempo medio entrega landing (meta: ≤10 días), horas/cliente (meta: ≤15hs con template).
- % clientes web que contratan Care (meta ≥60%) y que hacen upsell IA a 90 días (meta ≥30%).
- Lighthouse medio del portafolio (meta ≥92) como prueba comercial.

---

## 6. Roadmap propuesto (4 semanas)

| Semana | Entregable | Esfuerzo |
|---|---|---|
| 1 | Fase 1 (Services + Navbar + `WebPlans.tsx` + AuditStep1 qualifier) + copy final + precios | 2-3 días |
| 2 | Template `web-base` + script `new-client` + demo viva `/demo` | 3-4 días |
| 3 | 1er cliente piloto (precio promo a cambio de testimonio + métricas) + pipeline n8n form→CRM→WhatsApp | en paralelo |
| 4 | Portafolio (piloto + 1 demo nicho agencias), SEO checklist, lanzamiento email/IG (`email-campana.html` como base) | 2 días |

**Regla de oro:** no vender 5 webs a medida antes de tener el template. Vender 1 piloto → templatizar → escalar.

---

## 7. Riesgos y cómo mitigarlos
- **"Nos convertimos en agencia web genérica"** → mitigación: solo vendemos web *con IA/automatización*; si el cliente quiere solo diseño barato, se deriva o se cobra premium.
- **Soporte infinito por cambios chicos** → mitigación: Plan Care con límite mensual claro; fuera de plan = hora extra facturada.
- **Performance real vs. demo** → mitigación: quitar CDN Tailwind e importmap en webs cliente; test Lighthouse en CI.
- **Dependencia WhatsApp/Meta** → mitigación: todo lead también va a email/CRM propio, no solo WhatsApp.

---

## 8. Próximo paso sugerido
1. Definir precios finales + alcance de los 3 paquetes (¿los confirmamos?).
2. Yo implemento **Fase 1** en código (Services, Navbar, `WebPlans.tsx`, qualifier en Audit).
3. Elegimos nicho piloto (propongo: agencias de turismo con tu base scrapeada).

*¿Te preparo el diseño de la sección `WebPlans` y los textos en español rioplatense para la Fase 1?*
