#!/usr/bin/env node
/**
 * Validador de la base de datos de recetas.
 * Uso: node validar.js
 * Verifica que recetas.json cumpla con schema.json.
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

const DATA_DIR = path.join(__dirname, 'data');
const RECETAS_PATH = path.join(DATA_DIR, 'recetas.json');
const SCHEMA_PATH = path.join(DATA_DIR, 'schema.json');
const CATEGORIAS_PATH = path.join(DATA_DIR, 'categorias.json');

function leerJSON(ruta) {
  try {
    const contenido = fs.readFileSync(ruta, 'utf8');
    return JSON.parse(contenido);
  } catch (error) {
    console.error(`❌ Error al leer ${ruta}:`, error.message);
    process.exit(1);
  }
}

function validar() {
  console.log('🔍 Validando base de datos de recetas...\n');

  const recetas = leerJSON(RECETAS_PATH);
  const schema = leerJSON(SCHEMA_PATH);
  const categorias = leerJSON(CATEGORIAS_PATH);

  // Validar con Ajv
  const ajv = new Ajv({ allErrors: true });
  const validarReceta = ajv.compile(schema);

  let errores = 0;
  let validas = 0;

  recetas.forEach((receta, index) => {
    const esValida = validarReceta(receta);
    if (!esValida) {
      errores++;
      console.error(`❌ Receta #${index + 1} (${receta.id || 'sin id'}):`);
      validarReceta.errors.forEach(err => {
        console.error(`   - ${err.instancePath} ${err.message}`);
      });
    } else {
      validas++;
    }
  });

  // Validaciones adicionales
  console.log('\n📋 Validaciones adicionales:');
  
  // IDs únicos
  const ids = recetas.map(r => r.id);
  const idsDuplicados = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (idsDuplicados.length > 0) {
    console.error(`   ❌ IDs duplicados: ${[...new Set(idsDuplicados)].join(', ')}`);
    errores++;
  } else {
    console.log('   ✅ IDs únicos');
  }

  // Categorías existentes
  const categoriasIds = categorias.categorias.map(c => c.id);
  const categoriasInvalidas = recetas
    .filter(r => !categoriasIds.includes(r.categoria))
    .map(r => `${r.id} → ${r.categoria}`);
  if (categoriasInvalidas.length > 0) {
    console.error(`   ❌ Categorías inexistentes: ${categoriasInvalidas.join(', ')}`);
    errores++;
  } else {
    console.log('   ✅ Todas las categorías existen');
  }

  // harina_total_g coincide con la suma de es_harina
  recetas.forEach(r => {
    const sumaHarinas = r.ingredientes.grupos
      .flatMap(g => g.items)
      .filter(i => i.es_harina)
      .reduce((acc, i) => acc + i.cantidad, 0);
    if (Math.abs(sumaHarinas - r.ingredientes.harina_total_g) > 0.01) {
      console.error(`   ❌ ${r.id}: harina_total_g (${r.ingredientes.harina_total_g}) no coincide con la suma de es_harina (${sumaHarinas})`);
      errores++;
    }
  });
  if (errores === 0) console.log('   ✅ harina_total_g coincide con la suma de es_harina');

  // Resultado final
  console.log('\n📊 Resultado:');
  console.log(`   Recetas válidas: ${validas}/${recetas.length}`);
  console.log(`   Errores: ${errores}`);

  if (errores > 0) {
    process.exit(1);
  } else {
    console.log('\n✅ Base de datos validada correctamente.');
  }
}

validar();
