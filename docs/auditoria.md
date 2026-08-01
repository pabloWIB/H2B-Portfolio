# Auditoría — H2B

Estado del proyecto **antes** de la reorganización. Documento de trabajo interno.

Fecha: 2026-07-31 · Rama: `main` · Sin cambios de git en este proceso.

---

## 1. Inventario de archivos

### 1.1 HTML

| Archivo | `<title>` | `<h1>` | Propósito real | Estado |
|---|---|---|---|---|
| `index.html` | `H2B` | `Home page` | Única página. Cabecera + tres paneles (`section` / `article` / `footer`) que se expanden al pasar el ratón | Cargando, pero con marcado no semántico y `<footer>` usado como panel de contenido |

No existía `404.html`.

### 1.2 CSS

| Archivo | Líneas | ¿Se carga? | Contenido | Estado |
|---|---|---|---|---|
| `CSS/normalize.css` | 23 | Sí | Normalize v8 minificado en una línea + reglas propias (`body`, `img::selection`, scrollbar) | Mezcla librería y estilos de proyecto. Scrollbar en `#BD0003` (rojo), color ajeno a la paleta |
| `CSS/styles.css` | 1018 | Sí | Salida compilada de `styles.scss` con prefijos de autoprefixer | Generado; no debía editarse a mano |
| `CSS/styles.scss` | 836 | No (fuente) | Estilos reales del sitio | Selectores estructurales `>:nth-child(n)` de hasta 8 niveles |
| `CSS/fonts.css` | 3 | Sí | `@import` de Google Fonts (Inter) | 1 de sus 3 líneas es CSS inválido (ver 2.4) |
| `CSS/prepros.config` | 883 | No | Configuración del IDE Prepros | Artefacto de herramienta local, sin valor para el sitio |

### 1.3 JavaScript

| Archivo | Líneas | ¿Se carga? | Contenido | Estado |
|---|---|---|---|---|
| `JS/script.js` | 22 | Sí, en `<head>` sin `defer` | Tres bloques idénticos: `$(sel).hover(...)` → `toggleClass("open")` | Código triplicado; depende por completo de jQuery |

### 1.4 Imágenes

| Archivo | Peso | Dimensiones | Formato | Uso | Estado |
|---|---|---|---|---|---|
| `IMG/icon.png` | 358 KB | 1024×1024 | PNG | Favicon | 358 KB para un icono de 32 px. Es el 68 % del peso total del sitio |
| `IMG/photo1.jpg` | 128 KB | 485×722 | JPEG | Fondo del panel 1 vía CSS `url()` | Nombre no semántico. Se escala hacia arriba en escritorio |
| `IMG/user.jpg` | 6,6 KB | 225×225 | JPEG | Avatar de 30 px en un solo panel | Foto de banco de imágenes de una persona real ajena al proyecto |
| `IMG/next.svg` | 171 B | viewBox 48×48 | SVG | Flecha, 4 usos | Duplicado por color con `next-white.svg` |
| `IMG/next-white.svg` | 186 B | viewBox 48×48 | SVG | Flecha blanca, 4 usos | Idéntico al anterior salvo `fill` |
| `IMG/instagram.svg` | 705 B | — | SVG | Enlace de cabecera | Apunta a `https://instagram.com` (dominio raíz, no un perfil) |
| `IMG/twitter.svg` | 1,1 KB | — | SVG | Enlace de cabecera | Apunta a `https://twitter.com` |
| `IMG/facebook.svg` | 299 B | — | SVG | Enlace de cabecera | Apunta a `https://facebook.com` |

**Peso total de imágenes: 495 KB**, de los cuales 358 KB son el favicon.

### 1.5 Dependencias externas

| Dependencia | Origen | Uso real | Estado |
|---|---|---|---|
| jQuery slim 3.0.0-beta1 | cdnjs | `$()`, `.hover()`, `.toggleClass()` | Versión **beta de 2016**. ~24 KB comprimidos y bloqueo de render para 22 líneas de código |
| Inter | Google Fonts vía `@import` en CSS | Tipografía única del sitio | `@import` dentro de CSS: bloquea el render y encadena peticiones. Solo pedía el peso 400, pero el diseño usa 700 |

### 1.6 Archivos basura

No se encontraron `.bak`, `copia de`, `final_v2`, `.DS_Store`, `Thumbs.db` ni `node_modules`. El proyecto estaba limpio en ese aspecto.

---

## 2. Problemas detectados

### 2.1 Rutas de assets con mayúsculas/minúsculas cruzadas — CRÍTICO

Las carpetas en disco son `CSS/`, `IMG/` y `JS/`; `index.html` las referenciaba en minúscula.

Comprobado contra el despliegue real:

| URL | Respuesta |
|---|---|
| `https://h2b.wib.digital/css/styles.css` | 200 |
| `https://h2b.wib.digital/CSS/styles.css` | **404** |
| `https://h2b.wib.digital/img/icon.png` | 200 |
| `https://h2b.wib.digital/IMG/icon.png` | **404** |

Funcionaba por dos coincidencias: Windows y macOS tienen sistemas de archivos insensibles a mayúsculas, y Vercel normaliza las rutas estáticas a minúsculas. En cualquier host sensible a mayúsculas (nginx sobre Linux, GitHub Pages) las tres hojas de estilo, el script y las ocho imágenes devolverían 404 y la página se vería como HTML sin estilos.

`core.ignorecase = true` en `.git/config` impedía que `git status` lo delatara.

### 2.2 Enlaces sin destino real

| Enlace | Destino declarado | Problema |
|---|---|---|
| Flecha de cabecera | `https://index.com` | Dominio de aparcamiento, sin relación con el proyecto |
| Flecha del menú móvil | `https://fullstack.com` | Ídem |
| Instagram | `https://instagram.com` | Raíz del sitio, no un perfil |
| Twitter | `https://twitter.com` | Ídem |
| Facebook | `https://facebook.com` | Ídem |

Los cinco usaban `target="blank"` en lugar de `target="_blank"`: eso no abre una pestaña nueva, abre una ventana con nombre `blank` y reutiliza esa misma ventana en cada clic. Ninguno llevaba `rel="noopener"`.

### 2.3 Imágenes y CSS/JS referenciados

Ninguna ruta apuntaba a un archivo inexistente, más allá del problema de mayúsculas de 2.1. `styles.scss` referenciaba `../IMG/photo1.jpg` en mayúsculas mientras el HTML usaba minúsculas: dos convenciones opuestas dentro del mismo proyecto.

### 2.4 CSS inválido y muerto

| Ubicación | Problema |
|---|---|
| `CSS/fonts.css:3` | `font-family: 'Inter', sans-serif;` fuera de cualquier regla. El parser la descarta: 1 de las 3 líneas del archivo no hacía nada |
| `styles.scss:277-281` | Regla `>:nth-child(3) > :nth-child(2) { }` con cuerpo vacío |
| `styles.scss:486` y `styles.scss:586` | Dos bloques `@media (max-width: 850px)` separados, duplicando el mismo breakpoint |
| `styles.css:244` | `all: unset` sobre `h2, h3, h4, p` dentro de `main`: anula toda la cascada y obliga a redeclarar cada propiedad |
| Los tres paneles | Los bloques `section`, `article` y `footer` y sus variantes `.open` son el mismo código repetido tres veces con cambios de color: ~370 de las 836 líneas del SCSS |

### 2.5 Selectores frágiles

Todo el diseño se apoyaba en la posición de los nodos, no en clases:

```scss
main > section > :nth-child(1) > :nth-child(2) > :nth-child(3) h4 { }
```

Hasta 8 niveles de profundidad. Insertar un `<div>` o reordenar dos bloques en el HTML rompía el diseño en silencio.

### 2.6 HTML duplicado

Al ser una sola página no había duplicación entre archivos, pero sí dentro del archivo: los tres paneles repetían la misma estructura de 34 líneas con distinto texto, y los tres bloques de `JS/script.js` eran el mismo código copiado.

### 2.7 Contenido de relleno heredado

| Elemento | Valor | Problema |
|---|---|---|
| `<h1>` | `Home page` | No es un título, es una etiqueta de navegación |
| Contador | `Portafolio 120+` | Cifra de negocio inventada, sin respaldo |
| Categoría | `Categoria Servives` | `Servives` es una errata; `Portafolio`/`Categoria` están en español en una página `lang="en"` |
| `alt` de la flecha | `Netx` | Errata de `Next` |
| `IMG/user.jpg` | Avatar | Foto de banco de imágenes de una persona ajena, en 1 de 3 paneles |
| Enlaces sociales | 3 iconos | Perfiles que no existen (ver 2.2) |

### 2.8 Semántica y accesibilidad

- `<footer>` usado como tercer panel de contenido **dentro de `<main>`**: el landmark de pie de página quedaba ocupado por contenido, y la página no tenía footer real.
- Sin `<nav>`. Sin `<h1>` que describa la página.
- Jerarquía de encabezados incoherente: `h2` servía a la vez para las letras gigantes (`H`, `2`, `B`) y para las etiquetas de las píldoras de cabecera.
- La expansión de los paneles era **solo por `hover`**: sin teclado, sin foco visible, inaccesible en lectores de pantalla.
- `cursor: pointer` en todas las imágenes y en los paneles, que no eran interactivos.
- Sin `aria-label` en los enlaces que solo contenían un icono.

### 2.9 SEO

Faltaba todo salvo `charset` y `viewport`: sin `<meta name="description">`, sin Open Graph, sin `<link rel="canonical">`, sin `robots.txt`, sin `sitemap.xml`, sin `404.html`. El `<title>` era `H2B`, 3 caracteres.

### 2.10 Rendimiento

| Problema | Impacto |
|---|---|
| Favicon de 358 KB | 68 % del peso total de la primera carga |
| jQuery beta desde CDN, en `<head>`, sin `defer` | Bloqueo de render + una conexión DNS/TLS extra |
| `JS/script.js` en `<head>` sin `defer` | Bloqueo de render |
| `@import` de Google Fonts dentro de un CSS | Cadena de peticiones en serie; sin `preconnect` |
| 3 hojas de estilo separadas cargadas en serie | Peticiones evitables |

### 2.11 Responsive

- Media queries en `max-width` (desktop-first) con breakpoints de 850 y 450 px, fuera de la escala estándar.
- En móvil los tres paneles ocupaban `height: 63%` cada uno dentro de un `main` con `height: 90%`: el contenido se desbordaba del contenedor.
- El botón "Menu" móvil no abría nada: era un enlace a un dominio externo.

### 2.12 Seguridad

Sin credenciales, tokens ni claves de API en el código. Verificado con búsqueda sobre `*.html`, `*.css`, `*.scss`, `*.js`, `*.json`, `*.config` y `*.md`.

### 2.13 Documentación

El `README.md` describía funcionalidades inexistentes: un "burger menu", "tarjetas de proyecto con imagen y etiqueta" y una rejilla de portafolio. El sitio no tenía ninguna de las tres.

---

## 3. Resumen

1. **Qué es**: una página única que presenta tres disciplinas —fotografía, dirección de arte y contabilidad— en tres paneles marcados `H`, `2` y `B`, que se expanden al pasar el ratón. Ejercicio de maquetación e interacción, sin backend ni CMS.
2. **Estado visual**: el diseño funcionaba y era coherente; el problema no era estético sino estructural.
3. **Lo más grave**: las rutas en minúscula contra carpetas en mayúscula. El sitio solo se sostenía porque Vercel normaliza las URLs; movido a cualquier host sensible a mayúsculas se caía entero.
4. **Segundo más grave**: el diseño colgaba de selectores `nth-child` de hasta 8 niveles, y la única forma de interactuar era el `hover` del ratón: sin teclado, sin foco, sin táctil real.
5. **Relleno**: cinco enlaces a dominios sin relación con el proyecto, un contador de "120+" inventado, una foto de banco de imágenes de una persona ajena y dos erratas visibles (`Servives`, `Netx`).
