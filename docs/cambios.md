# Registro de cambios

Reorganización completa del proyecto, 2026-07-31. Agrupado por fase.

Ningún comando de git se ejecutó en este proceso: todos los cambios son locales.
El estado del que se parte está documentado en [auditoria.md](auditoria.md).

---

## 1. Auditoría

- Inventariados los 14 archivos del proyecto: 1 HTML, 5 CSS, 1 JS, 8 imágenes.
- Verificado contra el despliegue real que `/CSS/styles.css` y `/IMG/icon.png` devuelven
  404 mientras sus equivalentes en minúscula devuelven 200.
- Búsqueda de credenciales sobre todos los archivos de código: sin resultados.
- Escrito `docs/auditoria.md` con el inventario y los 13 grupos de problemas detectados.

## 2. Estructura

- `CSS/` + `JS/` + `IMG/` → `assets/css/` + `assets/js/` + `assets/img/`, todo en
  minúscula. Con esto desaparece el fallo crítico de mayúsculas.
- Imágenes clasificadas en `assets/img/content/` y `assets/img/logo/`.
- Archivos renombrados con nombres semánticos:
  - `photo1.jpg` → `architecture-glass-facade.jpg`
  - `icon.png` → `favicon-32.png`, `apple-touch-icon.png` y `h2b-logo.png`
- Añadidos `404.html`, `robots.txt`, `sitemap.xml`, `.gitignore` y `docs/`.
- No se creó `assets/fonts/` ni `assets/css/pages/`: el proyecto no los necesita.

## 3. Higiene

**Eliminado:**

| Archivo | Motivo |
|---|---|
| `CSS/styles.scss` | 836 líneas de selectores `nth-child`; reemplazado por CSS con clases |
| `CSS/styles.css` | Salida compilada del anterior |
| `CSS/normalize.css` | Normalize minificado mezclado con estilos propios; el reset vive ahora en `base.css` |
| `CSS/fonts.css` | 3 líneas, una de ellas CSS inválido; la fuente se carga desde el `<head>` |
| `CSS/prepros.config` | 883 líneas de configuración de un IDE; ya no hay paso de compilación |
| `JS/script.js` | 22 líneas, tres veces el mismo bloque de jQuery |
| `IMG/user.jpg` | Foto de banco de imágenes de una persona ajena al proyecto |
| `IMG/instagram.svg`, `twitter.svg`, `facebook.svg` | Enlazaban a la raíz de cada red, no a perfiles reales |
| `IMG/next.svg`, `next-white.svg` | La flecha pasa a ser un SVG en línea con `currentColor`: un solo trazado en lugar de dos archivos por color |

- `.gitignore` creado para un sitio estático: SO, editores, `node_modules/`, `.env`,
  logs y `.vercel/`.
- Sin credenciales que extraer.
- Formato normalizado: 2 espacios, comillas dobles en HTML, punto y coma en JS,
  salto de línea final en todos los archivos, sin tabuladores ni CRLF.

## 4. Imágenes

- **Favicon: 358 KB → 891 B.** El original era un PNG de 1024×1024 usado como icono de
  32 px. Recortado al badge, cuantizado y generado en tres tamaños reales:
  `favicon-32.png` (891 B), `apple-touch-icon.png` (6,4 KB) y `h2b-logo.png` (30 KB,
  solo para la tarjeta Open Graph).
- La fotografía pasa de `background-image` en CSS a un `<img>` con `width`, `height`,
  `alt` real y `fetchpriority="high"`: sin salto de layout y con prioridad de carga
  correcta al ser el elemento más grande de la primera pantalla.
- 128 KB y 485×722 px se conservan: por debajo del umbral de 200 KB y es la única
  copia existente, no hay original mayor del que partir.
- Ninguna imagen nueva inventada ni descargada.

## 5. HTML, SEO y accesibilidad

- **`<footer>` dejó de ser un panel de contenido.** Los tres paneles son ahora
  `<article>` dentro de una `<section>`, y la página tiene un `<footer>` real.
- Un solo `<h1>` por página. Las letras gigantes (`H`, `2`, `B`) pasan a ser `<p>`
  con `aria-hidden`: eran decorativas, no encabezados.
- Cada panel es una región con nombre, etiquetada por su propio `<h2>`.
- `<head>` completo: `title` único de 50–60 caracteres, `description` de 150–160,
  canonical, Open Graph con `og:image` apuntando a un archivo que existe, favicon y
  apple-touch-icon.
- Los cinco `target="blank"` pasan a `target="_blank" rel="noopener"`.
- Añadidos `robots.txt`, `sitemap.xml` y `404.html` con enlace de vuelta al inicio.
- Enlace de salto al contenido, visible solo al recibir foco.

**Contenido eliminado por no ser real:**

| Elemento | Motivo |
|---|---|
| Contador `Portafolio 120+` | Cifra inventada, sin nada que la respalde |
| Píldora `Categoria Servives` | Errata y mezcla de idiomas; sin función |
| Enlaces a `index.com` y `fullstack.com` | Dominios sin relación con el proyecto |
| Tres enlaces sociales | Apuntaban a la raíz de cada red, no a perfiles |
| Avatar `user.jpg` | Persona ajena al proyecto, en 1 de 3 paneles |
| `<h1>Home page</h1>` | Etiqueta de navegación usada como título |

**Contenido corregido:**

- `Servives` → `Services`; `Netx` → texto alternativo descriptivo real.
- Los tres encabezados del panel 2 eran copia del panel 1 (`Architecture / Minimalist /
  Landscape views` en un panel de dirección de arte). Sustituidos por los tres términos
  que el propio texto del panel ya nombraba: `Application design`, `Wireframes`,
  `User experience`.
- El pie decorativo del panel 3 repetía el del panel 1; ahora corresponde a su contenido.
- Los tres párrafos estaban mal construidos en inglés. Reescritos sin añadir ninguna
  afirmación nueva.
- Enlaces reales en su lugar: el repositorio y wib.digital, ambos verificados.

## 6. CSS y sistema de diseño

- Tres archivos en lugar de cinco: `base.css` (variables, reset, tipografía,
  utilidades), `layout.css` (estructura) y `components.css` (componentes). Orden interno:
  variables → reset → base → layout → componentes → utilidades → media queries.
- Paleta extraída a `:root` a partir de los colores que ya usaba el sitio. El gris
  `#919191` se oscurece a `#6E6E6E`: con texto blanco encima solo daba 3,14:1 y ahora
  da 5,10:1.
- Escala de espaciado 4/8/16/24/32/48/64/96 y escala tipográfica coherente. Una sola
  familia. Desaparecen los `margin-top: 2.5px` y `height: 63%`.
- **Profundidad máxima de selector: 3.** Antes había cadenas de `>:nth-child(n)` de hasta
  8 niveles. Ahora todo va por clases con nombre.
- Los tres paneles compartían ~370 líneas duplicadas; ahora es un componente `.panel`
  con tres modificadores de color.
- Eliminados: `all: unset`, la regla vacía, el bloque `@media` duplicado y el scrollbar
  en `#BD0003`, que venía de otro proyecto.
- `!important` solo en el bloque `prefers-reduced-motion`, que es donde corresponde.
- Sin CSS muerto: cada clase declarada se usa en el HTML o en el JS.

## 7. Responsive

- Mobile-first con `min-width` en 480 / 768 / 1024 / 1440. Antes eran dos bloques
  `max-width: 850px` duplicados más uno de 450px.
- Comprobado sin scroll horizontal en 360, 480, 768, 1024 y 1440px, midiendo
  `document.documentElement.scrollWidth > window.innerWidth`. Se retiró el
  `overflow-x: hidden` del `body` que tenía puesto de entrada, porque enmascaraba
  el desbordamiento en lugar de evitarlo: la medición se hizo sin esa red.
- Áreas táctiles de 44×44 px como mínimo en todo elemento interactivo.
- El botón "Menu" abre un panel real: bloquea el scroll de fondo, deja el resto de la
  página en `inert`, cierra con `Escape`, al pulsar un enlace y al tocar fuera, y
  devuelve el foco al botón que lo abrió. Antes era un enlace a un dominio externo.

## 8. UX / UI

- Jerarquía clara: el titular de cada panel es su disciplina, no la letra.
- Un CTA con destino real y verificado: el repositorio en GitHub.
- Estados completos en todo elemento interactivo (reposo, hover, foco, activo) con
  transiciones de 160 ms.
- **Anillo de foco corregido.** Estaba definido como `outline: 2px solid currentColor`,
  y en las píldoras que se rellenan al recibir foco `currentColor` pasaba a blanco: el
  anillo quedaba blanco sobre fondo blanco. Ahora usa `--color-focus`, que vale tinta
  por defecto y blanco dentro de los paneles oscuros.
- La longitud de línea de los párrafos se limita a 62 caracteres.
- Sin formularios: el proyecto no tiene backend y no se finge que lo tenga.

## 9. JavaScript

- **jQuery fuera.** Era la versión `3.0.0-beta1` de 2016, servida desde un CDN, en
  `<head>` y sin `defer`, para tres llamadas: `$()`, `.hover()` y `.toggleClass()`.
- Los tres bloques idénticos de `script.js` pasan a ser una función parametrizada.
- Todo dentro de una IIFE con `"use strict"`: sin variables globales.
- Cada función comprueba que sus elementos existen antes de operar sobre ellos.
- Los eventos del panel de menú se delegan sobre el contenedor.
- Se conserva sintaxis de script clásico en lugar de módulos ES para que el JavaScript
  también se ejecute al abrir `index.html` directamente desde el disco: los módulos ES
  están bloqueados bajo `file://`.
- Cero errores y cero avisos en consola en las dos páginas, en `file://` y en HTTP.

## 10. Rendimiento

| | Antes | Después |
|---|---|---|
| Favicon | 358 KB | 891 B |
| jQuery | 24 KB desde CDN, bloqueando el render | Eliminado |
| Hojas de estilo | 3 archivos, una con `@import` encadenado | 3 archivos, sin `@import` |
| Fuente | `@import` dentro de un CSS, peso 400 únicamente | `<link>` con `preconnect` y `display=swap`, pesos 400/500/700 |
| Scripts | En `<head>`, sin `defer` | Con `defer` |
| **Imágenes de la primera carga** | **484 KB** | **126 KB** |
| **Primera carga completa** | 484 KB de imágenes + jQuery + HTML/CSS/JS | **154 KB en total** |

## 11. QA

Verificado uno por uno, con el sitio servido en local:

- Todos los enlaces internos y externos resuelven; los externos comprobados por HTTP.
- Toda ruta de imagen corresponde a un archivo real en disco.
- Todo `<link>` y `<script>` apunta a un archivo que existe.
- Cero mensajes en consola en `index.html` y `404.html`.
- Sin scroll horizontal en 360 / 480 / 768 / 1024 / 1440 px.
- El panel de menú abre y cierra por los cuatro caminos previstos.
- La expansión de paneles responde a ratón y a teclado, y `Escape` la revierte.
- Sin `Lorem ipsum`, `TODO` ni texto heredado del template.
- Ninguna imagen rota.
- `title` y `description` únicos y dentro de rango en las dos páginas.
- `404.html` existe y enlaza al inicio.
- Sin credenciales en el código.
- Contraste: el mínimo del sitio es 5,10:1 (texto gris del pie). Sobre la fotografía,
  el peor caso frente al píxel más claro detrás del texto es 7,45:1.

## 12. Documentación

- `README.md` reescrito. El anterior describía un "burger menu", tarjetas de proyecto
  con imagen y una rejilla de portafolio: nada de eso existía en el código. También
  documentaba el fallo de mayúsculas como problema conocido, que ya está resuelto.
- `docs/auditoria.md` y `docs/cambios.md` añadidos.

## 13. Deploy

- Comprobado abriendo `index.html` directamente desde el disco y con `npx serve`.
- Sin rutas absolutas de máquina en ningún archivo.
- Todas las rutas internas relativas y en minúscula.
- No se creó configuración de hosting: no se indicó destino y el proyecto no la necesita.
- No se ejecutó ningún despliegue.
