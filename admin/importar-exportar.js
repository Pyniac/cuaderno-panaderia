// ============================================================
// Import/Export — Cuaderno de Panadería Años 40
// Exporta recetas.json (con sincronización de app_config).
// ============================================================

const ImportarExportar = {

  // ------------------------------------------------------------
  // EXPORTAR RECETAS
  // ------------------------------------------------------------
  exportarRecetas() {
    const estado = App.estado;

    if (!estado.cargado || !Array.isArray(estado.recetas)) {
      alert('No hay datos cargados. Cargá primero con "Cargar datos actuales".');
      return;
    }

    // Validaciones previas
    const problemas = this.validarAntesDeExportar(estado);
    if (problemas.length > 0) {
      const msg = 'Se encontraron estos problemas antes de exportar:\n\n- ' +
                  problemas.join('\n- ') +
                  '\n\n¿Exportar de todos modos?';
      if (!confirm(msg)) return;
    }

    // Ordenar recetas: por categoría (según orden de categorias.json), luego por id
    const recetasOrdenadas = this.ordenarRecetas(estado.recetas, estado.categorias);

    // Serializar
    const json = JSON.stringify(recetasOrdenadas, null, 2);

    // Descargar
    this.descargar('recetas.json', json);

    // Actualizar indicador
    estado.cambios = { nuevas: new Set(), modificadas: new Set(), borradas: new Set() };
    Storage.guardar(estado);
    if (typeof refrescarPie === 'function') refrescarPie();

    // Preguntar si quiere exportar app_config también
    setTimeout(() => {
      if (confirm('recetas.json descargado.\n\n¿Querés exportar también app_config.json con "recetas_publicadas" sincronizado?')) {
        this.exportarAppConfig();
      }
    }, 500);
  },

  // ------------------------------------------------------------
  // EXPORTAR APP_CONFIG (con recetas_publicadas sincronizado)
  // ------------------------------------------------------------
  exportarAppConfig() {
    const estado = App.estado;

    if (!estado.cargado) {
      alert('No hay datos cargados.');
      return;
    }

    // Sincronizar recetas_publicadas
    const publicadas = estado.recetas
      .filter(r => r.estado === 'publicada')
      .map(r => r.id)
      .sort();

    const appConfig = Object.assign({}, estado.appConfig || {});
    appConfig.recetas_publicadas = publicadas;
    appConfig.fecha_actualizacion = new Date().toISOString().slice(0, 10);

    // Sincronizar también el estado interno para que quede coherente
    estado.appConfig = appConfig;
    Storage.guardar(estado);

    const json = JSON.stringify(appConfig, null, 2);
    this.descargar('app_config.json', json);
  },

  // ------------------------------------------------------------
  // VALIDACIONES PREVIAS
  // ------------------------------------------------------------
  validarAntesDeExportar(estado) {
    const problemas = [];
    const recetas = estado.recetas || [];

    // IDs duplicados
    const ids = recetas.map(r => r.id);
    const idsUnicos = new Set(ids);
    if (ids.length !== idsUnicos.size) {
      const duplicados = ids.filter((id, i) => ids.indexOf(id) !== i);
      problemas.push('IDs duplicados: ' + [...new Set(duplicados)].join(', '));
    }

    // Recetas sin id o sin nombre
    recetas.forEach(r => {
      if (!r.id) problemas.push('Hay una receta sin id.');
      else if (!r.nombre) problemas.push(`La receta "${r.id}" no tiene nombre.`);
    });

    // Harina total
    recetas.forEach(r => {
      const problemasHarina = this.verificarHarinaTotal(r);
      if (problemasHarina) problemas.push(problemasHarina);
    });

    // Categorías inexistentes
    const categoriasValidas = new Set((estado.categorias || []).map(c => c.id));
    recetas.forEach(r => {
      if (r.categoria && !categoriasValidas.has(r.categoria)) {
        problemas.push(`La receta "${r.id}" tiene categoría "${r.categoria}" que no existe en categorias.json.`);
      }
    });

    return problemas;
  },

    verificarHarinaTotal(receta) {
    if (!receta.ingredientes) return null;
    const guardado = receta.ingredientes.harina_total_g;

    // Si no hay grupos, no chequeamos
    if (!Array.isArray(receta.ingredientes.grupos)) return null;

    // Detectar si es una receta compuesta (usa otra receta como ingrediente)
    let tieneRecetaComoIngrediente = false;
    let calculado = 0;
    receta.ingredientes.grupos.forEach(g => {
      (g.items || []).forEach(i => {
        if (i.unidad === 'receta' || i.unidad === 'recetas') {
          tieneRecetaComoIngrediente = true;
        }
        if (i.es_harina && (i.unidad === 'g' || i.unidad === 'ml')) {
          calculado += Number(i.cantidad) || 0;
        }
      });
    });

    // Si es compuesta, no podemos validar la harina total localmente
    if (tieneRecetaComoIngrediente) return null;

    // Si no es compuesta, chequear normalmente
    if (typeof guardado === 'number' && guardado !== calculado) {
      return `En "${receta.id}": harina_total_g dice ${guardado} pero la suma de ingredientes con es_harina da ${calculado}.`;
    }
    return null;
  },

  // ------------------------------------------------------------
  // ORDENAR RECETAS
  // ------------------------------------------------------------
  ordenarRecetas(recetas, categorias) {
    // Mapa de categoría -> orden
    const ordenCat = {};
    (categorias || []).forEach((c, i) => {
      ordenCat[c.id] = (typeof c.orden === 'number') ? c.orden : (i + 100);
    });

    return [...recetas].sort((a, b) => {
      const oa = ordenCat[a.categoria] !== undefined ? ordenCat[a.categoria] : 999;
      const ob = ordenCat[b.categoria] !== undefined ? ordenCat[b.categoria] : 999;
      if (oa !== ob) return oa - ob;
      return String(a.id).localeCompare(String(b.id));
    });
  },

  // ------------------------------------------------------------
  // DESCARGA
  // ------------------------------------------------------------
  descargar(nombreArchivo, contenido) {
    const blob = new Blob([contenido], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },

  // ------------------------------------------------------------
  // IMPORTAR (placeholder para más adelante)
  // ------------------------------------------------------------
  importarArchivos(files) {
    alert('Importar todavía no está implementado.\n\nSe implementa en una próxima etapa.');
  }
};
