# Cuaderno de Panadería Años 40 — Base de Datos

Base de datos JSON de recetas de panadería argentina, basada en el libro
*Panadería Gastón* de Claudio Olijavetzky.

## 📁 Estructura
data/
├── recetas.json ← Todas las recetas
├── categorias.json ← Categorías y metadatos
├── referencias.json ← Tablas de consulta rápida
├── app_config.json ← Configuración de la app
└── schema.json ← JSON Schema de validación
validar.js ← Script de validación


## 🚀 Cómo agregar una receta nueva

1. **Abrí `data/recetas.json`** y agregá un nuevo objeto al final del array.
2. **Copiá la estructura** de una receta existente como plantilla.
3. **Completá los campos obligatorios**:
   - `id`: slug único en snake_case sin acentos (ej: `pan_centeno`)
   - `nombre`: nombre visible de la receta
   - `categoria`: una de las claves de `categorias.json`
   - `icono`: emoji representativo
   - `fuente`: referencia al libro y capítulo
   - `version`: "1.0"
   - `estado`: "publicada", "borrador" o "deprecada"
   - `tiempo_total`, `temperatura_horno`, `hidratacion`, `rinde`
   - `ingredientes`: con `harina_total_g` y `grupos[].items[]`
   - `etapas[]`: con `orden`, `nombre`, `duracion_min`, `descripcion`, `notas_tecnicas`
   - `consideraciones[]`: con `tipo` ("ok", "warn", "info"), `titulo`, `texto`
   - `bpm[]`: con `etapa`, `peligro`, `control`, `limite_critico`
   - `tips[]`, `variantes[]`
   - `referencias_cruzadas`: con `temperaturas_relacionadas`, `prefermentos_sugeridos`, `productos_similares`
   - `metadata`: con `autor_receta`, `fecha_creacion`, `fecha_actualizacion`, `tags[]`

4. **Verificá que `harina_total_g`** coincida con la suma de los ingredientes
   marcados con `"es_harina": true`.

5. **Actualizá `app_config.json`**:
   - Agregá el `id` a `recetas_publicadas` si está lista
   - O a `recetas_borrador` si todavía no

6. **Validá la base de datos**:
   ```bash
   npm install ajv
   node validar.js

Reglas

    NO inventar datos: si un campo no está en el libro, dejarlo como
    null o "por_definir".

    Unidades consistentes: g, ml, u, cdas, cditas, tazas,
    fetas, láminas, parte, partes.

    Porcentajes panaderos NO se guardan: se calculan en la app a partir
    de harina_total_g.

    IDs únicos en snake_case sin acentos.

    Estructura anidada: ingredientes.grupos[].items[].

    Estados posibles: publicada, borrador, deprecada.

🧪 Validación

El script validar.js verifica:

    Que cada receta cumpla con schema.json

    Que los IDs sean únicos

    Que las categorías existan en categorias.json

    Que harina_total_g coincida con la suma de es_harina

USO EN LA APP

La app PWA consume estos archivos con fetch():

const recetas = await fetch('/data/recetas.json').then(r => r.json());
const categorias = await fetch('/data/categorias.json').then(r => r.json());

Para actualizar la base sin reinstalar la app, solo hay que reemplazar
los archivos JSON en el servidor. El service worker los cachea
automáticamente.
