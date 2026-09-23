// ============================================================
// Formulario de receta — ETAPA 4
// Agrega edición de tips, BPM y consideraciones.
// Todavía NO toca: referencias_cruzadas, metadata.
// ============================================================

const UNIDADES = ['g', 'ml', 'u', 'cdas', 'cditas', 'tazas', 'fetas', 'láminas', 'parte', 'partes'];
const TIPOS_CONSIDERACION = [
  { valor: 'ok',   etiqueta: '✓ OK / buena práctica' },
  { valor: 'info', etiqueta: 'ℹ Info / dato técnico' },
  { valor: 'warn', etiqueta: '⚠ Atención / advertencia' }
];

const Formulario = {
  recetaEnEdicion: null,
  esNueva: false,
  idOriginal: null,

  // ---- Abrir ----
  abrirNueva(categorias) {
    this.recetaEnEdicion = this.recetaVacia();
    this.esNueva = true;
    this.idOriginal = null;
    this.render(categorias, 'Nueva receta');
  },

  abrirEdicion(receta, categorias) {
    this.recetaEnEdicion = JSON.parse(JSON.stringify(receta));
    this.esNueva = false;
    this.idOriginal = receta.id;
    this.render(categorias, 'Editar receta');
  },

  abrirDuplicado(receta, categorias) {
    const copia = JSON.parse(JSON.stringify(receta));
    copia.id = this.sugerirIdUnico((copia.id || 'receta') + '_copia', App.estado.recetas);
    copia.nombre = (copia.nombre || '') + ' (copia)';
    this.recetaEnEdicion = copia;
    this.esNueva = true;
    this.idOriginal = null;
    this.render(categorias, 'Duplicar receta');
  },

  recetaVacia() {
    return {
      id: '',
      nombre: '',
      categoria: '',
      icono: '',
      fuente: '',
      version: '1.0',
      estado: 'borrador',
      tiempo_total: '',
      temperatura_horno: '',
      hidratacion: '',
      rinde: '',
      descripcion: '',
      ingredientes: { harina_total_g: 0, grupos: [] },
      etapas: [],
      consideraciones: [],
      bpm: [],
      tips: [],
      variantes: [],
      referencias_cruzadas: {
        temperaturas_relacionadas: [],
        prefermentos_sugeridos: [],
        productos_similares: []
      },
      metadata: {
        autor_receta: '',
        fecha_creacion: new Date().toISOString().slice(0, 10),
        fecha_actualizacion: new Date().toISOString().slice(0, 10),
        tags: []
      }
    };
  },

  sugerirIdUnico(base, recetas) {
    const ids = new Set(recetas.map(r => r.id));
    if (!ids.has(base)) return base;
    let i = 2;
    while (ids.has(base + '_' + i)) i++;
    return base + '_' + i;
  },

  // ---- Render ----
  render(categorias, titulo) {
    const r = this.recetaEnEdicion;

    document.getElementById('form-titulo').textContent = titulo;
    document.getElementById('form-subtitulo').textContent =
      this.esNueva ? 'Completá los datos y guardá' : `ID original: ${this.idOriginal}`;

    document.getElementById('campo-id').value = r.id || '';
    document.getElementById('campo-nombre').value = r.nombre || '';
    document.getElementById('campo-icono').value = r.icono || '';
    document.getElementById('campo-fuente').value = r.fuente || '';
    document.getElementById('campo-version').value = r.version || '';
    document.getElementById('campo-estado').value = r.estado || 'borrador';
    document.getElementById('campo-tiempo-total').value = r.tiempo_total || '';
    document.getElementById('campo-temperatura-horno').value = r.temperatura_horno || '';
    document.getElementById('campo-hidratacion').value = r.hidratacion || '';
    document.getElementById('campo-rinde').value = r.rinde || '';
    document.getElementById('campo-descripcion').value = r.descripcion || '';

    const selectCat = document.getElementById('campo-categoria');
    selectCat.innerHTML = '<option value="">— Elegir —</option>';
    (categorias || []).forEach(cat => {
      const id = cat.id || cat;
      const nombre = cat.nombre || cat;
      const opt = document.createElement('option');
      opt.value = id;
      opt.textContent = nombre;
      selectCat.appendChild(opt);
    });
    selectCat.value = r.categoria || '';

    // Asegurar estructuras
    if (!r.ingredientes || typeof r.ingredientes !== 'object') {
      r.ingredientes = { harina_total_g: 0, grupos: [] };
    }
    if (!Array.isArray(r.ingredientes.grupos)) r.ingredientes.grupos = [];
    if (!Array.isArray(r.etapas)) r.etapas = [];
    if (!Array.isArray(r.tips)) r.tips = [];
    if (!Array.isArray(r.bpm)) r.bpm = [];
    if (!Array.isArray(r.consideraciones)) r.consideraciones = [];
    if (!Array.isArray(r.variantes)) r.variantes = [];
    if (!r.referencias_cruzadas || typeof r.referencias_cruzadas !== 'object') {
      r.referencias_cruzadas = {
        temperaturas_relacionadas: [],
        prefermentos_sugeridos: [],
        productos_similares: []
      };
    }
    ['temperaturas_relacionadas', 'prefermentos_sugeridos', 'productos_similares'].forEach(k => {
      if (!Array.isArray(r.referencias_cruzadas[k])) r.referencias_cruzadas[k] = [];
    });
    if (!r.metadata || typeof r.metadata !== 'object') r.metadata = {};
    if (!Array.isArray(r.metadata.tags)) r.metadata.tags = [];

    this.renderIngredientes();
    this.renderEtapas();
    this.renderListaSimple('variantes', 'lista-variantes');
    this.renderListaSimple('tips', 'lista-tips');
    this.renderBPM();
    this.renderConsideraciones();
    this.renderReferenciasCruzadas();
    this.renderMetadata();

    document.getElementById('btn-eliminar').style.display = this.esNueva ? 'none' : '';
  },

  // ============================================================
  // INGREDIENTES
  // ============================================================

  renderIngredientes() {
    const cont = document.getElementById('lista-grupos');
    cont.innerHTML = '';
    const grupos = this.recetaEnEdicion.ingredientes.grupos || [];

    if (grupos.length === 0) {
      cont.innerHTML = '<p class="vacio">Sin grupos. Agregá al menos uno.</p>';
      this.actualizarHarinaTotal();
      return;
    }

    grupos.forEach((grupo, gi) => {
      const div = document.createElement('div');
      div.className = 'grupo-item';
      div.innerHTML = `
        <div class="grupo-cabecera">
          <input type="text" data-grupo-nombre="${gi}" value="${escapeAttr(grupo.nombre || '')}" placeholder="Nombre del grupo (ej: Masa base)">
          <button type="button" class="btn-eliminar-grupo" data-eliminar-grupo="${gi}" title="Eliminar grupo">× Grupo</button>
        </div>
        <div class="grupo-cuerpo">
          <div class="tabla-scroll">
            <table class="tabla-ingredientes">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Cantidad</th>
                  <th>Unidad</th>
                  <th title="Marcar si es harina">Harina</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                ${(grupo.items || []).map((item, ii) => `
                  <tr>
                    <td><input type="text" data-campo="nombre" data-gi="${gi}" data-ii="${ii}" value="${escapeAttr(item.nombre)}" placeholder="Harina 000"></td>
                    <td><input type="number" step="any" min="0" data-campo="cantidad" data-gi="${gi}" data-ii="${ii}" value="${item.cantidad ?? ''}"></td>
                    <td>
                      <select data-campo="unidad" data-gi="${gi}" data-ii="${ii}">
                        ${UNIDADES.map(u => `<option value="${u}" ${item.unidad === u ? 'selected' : ''}>${u}</option>`).join('')}
                      </select>
                    </td>
                    <td style="text-align:center">
                      <input type="checkbox" data-campo="es_harina" data-gi="${gi}" data-ii="${ii}" ${item.es_harina ? 'checked' : ''}>
                    </td>
                    <td>
                      <button type="button" class="btn-eliminar-fila" data-eliminar-item="${gi}:${ii}" title="Eliminar ingrediente">×</button>
                    </td>
                  </tr>
                `).join('') || '<tr><td colspan="5" class="vacio">Sin ingredientes en este grupo.</td></tr>'}
              </tbody>
            </table>
          </div>
          <button type="button" class="btn" data-agregar-item="${gi}">+ Agregar ingrediente</button>
        </div>
      `;
      cont.appendChild(div);
    });

    cont.querySelectorAll('input[data-grupo-nombre]').forEach(el => {
      el.addEventListener('input', (e) => {
        const gi = Number(e.target.dataset.grupoNombre);
        this.recetaEnEdicion.ingredientes.grupos[gi].nombre = e.target.value;
      });
    });
    cont.querySelectorAll('button[data-eliminar-grupo]').forEach(btn => {
      btn.addEventListener('click', () => {
        const gi = Number(btn.dataset.eliminarGrupo);
        if (!confirm('¿Eliminar este grupo completo con todos sus ingredientes?')) return;
        this.recetaEnEdicion.ingredientes.grupos.splice(gi, 1);
        this.renderIngredientes();
      });
    });
    cont.querySelectorAll('button[data-agregar-item]').forEach(btn => {
      btn.addEventListener('click', () => {
        const gi = Number(btn.dataset.agregarItem);
        const grupo = this.recetaEnEdicion.ingredientes.grupos[gi];
        if (!Array.isArray(grupo.items)) grupo.items = [];
        grupo.items.push({ nombre: '', cantidad: '', unidad: 'g', es_harina: false });
        this.renderIngredientes();
      });
    });
    cont.querySelectorAll('button[data-eliminar-item]').forEach(btn => {
      btn.addEventListener('click', () => {
        const [gi, ii] = btn.dataset.eliminarItem.split(':').map(Number);
        this.recetaEnEdicion.ingredientes.grupos[gi].items.splice(ii, 1);
        this.renderIngredientes();
      });
    });
    cont.querySelectorAll('input[data-campo], select[data-campo]').forEach(el => {
      el.addEventListener('input', (e) => this.actualizarItem(e.target));
      el.addEventListener('change', (e) => this.actualizarItem(e.target));
    });

    this.actualizarHarinaTotal();
  },

  actualizarItem(el) {
    const gi = Number(el.dataset.gi);
    const ii = Number(el.dataset.ii);
    const campo = el.dataset.campo;
    let valor;
    if (el.type === 'checkbox') valor = el.checked;
    else if (el.type === 'number') valor = el.value === '' ? '' : Number(el.value);
    else valor = el.value;
    this.recetaEnEdicion.ingredientes.grupos[gi].items[ii][campo] = valor;
    if (campo === 'es_harina' || campo === 'cantidad' || campo === 'unidad') {
      this.actualizarHarinaTotal();
    }
  },

  actualizarHarinaTotal() {
    const total = this.calcularHarinaTotalEnVivo();
    this.recetaEnEdicion.ingredientes.harina_total_g = total;
    document.getElementById('harina-total').textContent = total;
  },

  calcularHarinaTotalEnVivo() {
    let total = 0;
    const grupos = this.recetaEnEdicion.ingredientes.grupos || [];
    grupos.forEach(g => {
      (g.items || []).forEach(i => {
        if (i.es_harina && (i.unidad === 'g' || i.unidad === 'ml')) {
          total += Number(i.cantidad) || 0;
        }
      });
    });
    return total;
  },

  agregarGrupo() {
    this.recetaEnEdicion.ingredientes.grupos.push({
      nombre: 'Nuevo grupo',
      items: []
    });
    this.renderIngredientes();
  },

  // ============================================================
  // ETAPAS
  // ============================================================

  renderEtapas() {
    const cont = document.getElementById('lista-etapas');
    cont.innerHTML = '';
    const etapas = this.recetaEnEdicion.etapas || [];

    if (etapas.length === 0) {
      cont.innerHTML = '<p class="vacio">Sin etapas. Agregá al menos una.</p>';
      return;
    }

    etapas.forEach((et, i) => {
      const div = document.createElement('div');
      div.className = 'etapa-item';
      div.innerHTML = `
        <div class="etapa-cabecera">
          <span class="num-etapa">${i + 1}.</span>
          <input type="text" data-etapa-campo="nombre" data-idx="${i}" value="${escapeAttr(et.nombre)}" placeholder="Nombre de la etapa">
        </div>
        <div class="campo-fila">
          <div class="campo">
            <label>Duración (min)</label>
            <input type="number" min="0" data-etapa-campo="duracion_min" data-idx="${i}" value="${et.duracion_min ?? ''}">
          </div>
        </div>
        <div class="campo">
          <label>Descripción / instrucciones</label>
          <textarea rows="2" data-etapa-campo="descripcion" data-idx="${i}">${escapeHtml(et.descripcion || '')}</textarea>
        </div>
        <div class="campo">
          <label>Notas técnicas</label>
          <textarea rows="2" data-etapa-campo="notas_tecnicas" data-idx="${i}">${escapeHtml(et.notas_tecnicas || '')}</textarea>
        </div>
        <div class="etapa-acciones">
          <button type="button" class="btn btn-mover" data-etapa-mover="subir" data-idx="${i}" ${i === 0 ? 'disabled' : ''}>↑ Subir</button>
          <button type="button" class="btn btn-mover" data-etapa-mover="bajar" data-idx="${i}" ${i === etapas.length - 1 ? 'disabled' : ''}>↓ Bajar</button>
          <button type="button" class="btn btn-peligro" data-etapa-eliminar="${i}">Eliminar etapa</button>
        </div>
      `;
      cont.appendChild(div);
    });

    cont.querySelectorAll('[data-etapa-campo]').forEach(el => {
      el.addEventListener('input', (e) => {
        const idx = Number(e.target.dataset.idx);
        const campo = e.target.dataset.etapaCampo;
        let valor;
        if (e.target.type === 'number') valor = e.target.value === '' ? '' : Number(e.target.value);
        else valor = e.target.value;
        this.recetaEnEdicion.etapas[idx][campo] = valor;
      });
    });
    cont.querySelectorAll('[data-etapa-mover]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.idx);
        const dir = btn.dataset.etapaMover;
        const arr = this.recetaEnEdicion.etapas;
        const nuevo = dir === 'subir' ? idx - 1 : idx + 1;
        if (nuevo < 0 || nuevo >= arr.length) return;
        [arr[idx], arr[nuevo]] = [arr[nuevo], arr[idx]];
        this.renderEtapas();
      });
    });
    cont.querySelectorAll('[data-etapa-eliminar]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.etapaEliminar);
        if (!confirm('¿Eliminar esta etapa?')) return;
        this.recetaEnEdicion.etapas.splice(idx, 1);
        this.renderEtapas();
      });
    });
  },

  agregarEtapa() {
    if (!Array.isArray(this.recetaEnEdicion.etapas)) this.recetaEnEdicion.etapas = [];
    this.recetaEnEdicion.etapas.push({
      orden: this.recetaEnEdicion.etapas.length + 1,
      nombre: '',
      duracion_min: '',
      descripcion: '',
      notas_tecnicas: ''
    });
    this.renderEtapas();
  },

  // ============================================================
  // BPM
  // ============================================================

  renderBPM() {
    const cont = document.getElementById('lista-bpm');
    cont.innerHTML = '';
    const items = this.recetaEnEdicion.bpm || [];

    if (items.length === 0) {
      cont.innerHTML = '<p class="vacio">Sin BPM. Agregá al menos uno.</p>';
      return;
    }

    items.forEach((b, i) => {
      const div = document.createElement('div');
      div.className = 'bpm-item';
      div.innerHTML = `
        <div class="bpm-cabecera">
          <span class="num-bpm">BPM ${i + 1}</span>
          <button type="button" data-eliminar-bpm="${i}" title="Eliminar">× Eliminar</button>
        </div>
        <div class="campo">
          <label>Etapa</label>
          <input type="text" data-bpm-campo="etapa" data-idx="${i}" value="${escapeAttr(b.etapa || '')}" placeholder="Recepción harina">
        </div>
        <div class="campo-fila">
          <div class="campo">
            <label>Peligro</label>
            <input type="text" data-bpm-campo="peligro" data-idx="${i}" value="${escapeAttr(b.peligro || '')}" placeholder="Bacillus cereus, mohos">
          </div>
          <div class="campo">
            <label>Control</label>
            <input type="text" data-bpm-campo="control" data-idx="${i}" value="${escapeAttr(b.control || '')}" placeholder="Proveedor habilitado">
          </div>
        </div>
        <div class="campo">
          <label>Límite crítico</label>
          <input type="text" data-bpm-campo="limite_critico" data-idx="${i}" value="${escapeAttr(b.limite_critico || '')}" placeholder="Fecha vigente">
        </div>
      `;
      cont.appendChild(div);
    });

    cont.querySelectorAll('[data-bpm-campo]').forEach(el => {
      el.addEventListener('input', (e) => {
        const idx = Number(e.target.dataset.idx);
        const campo = e.target.dataset.bpmCampo;
        this.recetaEnEdicion.bpm[idx][campo] = e.target.value;
      });
    });
    cont.querySelectorAll('[data-eliminar-bpm]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.eliminarBpm);
        if (!confirm('¿Eliminar este BPM?')) return;
        this.recetaEnEdicion.bpm.splice(idx, 1);
        this.renderBPM();
      });
    });
  },

  agregarBPM() {
    this.recetaEnEdicion.bpm.push({
      etapa: '', peligro: '', control: '', limite_critico: ''
    });
    this.renderBPM();
  },

  // ============================================================
  // CONSIDERACIONES
  // ============================================================

  renderConsideraciones() {
    const cont = document.getElementById('lista-consideraciones');
    cont.innerHTML = '';
    const items = this.recetaEnEdicion.consideraciones || [];

    if (items.length === 0) {
      cont.innerHTML = '<p class="vacio">Sin consideraciones. Agregá al menos una.</p>';
      return;
    }

    items.forEach((c, i) => {
      const tipoActual = c.tipo || 'info';
      const div = document.createElement('div');
      div.className = 'consideracion-item tipo-' + tipoActual;
      div.innerHTML = `
        <div class="cons-cabecera">
          <select data-cons-campo="tipo" data-idx="${i}">
            ${TIPOS_CONSIDERACION.map(t => `<option value="${t.valor}" ${tipoActual === t.valor ? 'selected' : ''}>${t.etiqueta}</option>`).join('')}
          </select>
          <button type="button" data-eliminar-cons="${i}" title="Eliminar">× Eliminar</button>
        </div>
        <div class="campo">
          <label>Título</label>
          <input type="text" data-cons-campo="titulo" data-idx="${i}" value="${escapeAttr(c.titulo || '')}" placeholder="✓ Hidratación media">
        </div>
        <div class="campo">
          <label>Texto</label>
          <textarea rows="2" data-cons-campo="texto" data-idx="${i}">${escapeHtml(c.texto || '')}</textarea>
        </div>
      `;
      cont.appendChild(div);
    });

    cont.querySelectorAll('[data-cons-campo]').forEach(el => {
      el.addEventListener('input', (e) => {
        const idx = Number(e.target.dataset.idx);
        const campo = e.target.dataset.consCampo;
        this.recetaEnEdicion.consideraciones[idx][campo] = e.target.value;
        if (campo === 'tipo') this.renderConsideraciones(); // re-render para actualizar el color
      });
      el.addEventListener('change', (e) => {
        if (e.target.tagName === 'SELECT') {
          const idx = Number(e.target.dataset.idx);
          this.recetaEnEdicion.consideraciones[idx].tipo = e.target.value;
          this.renderConsideraciones();
        }
      });
    });
    cont.querySelectorAll('[data-eliminar-cons]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.eliminarCons);
        if (!confirm('¿Eliminar esta consideración?')) return;
        this.recetaEnEdicion.consideraciones.splice(idx, 1);
        this.renderConsideraciones();
      });
    });
  },

  agregarConsideracion() {
    this.recetaEnEdicion.consideraciones.push({
      tipo: 'info', titulo: '', texto: ''
    });
    this.renderConsideraciones();
  },

  // ============================================================
  // LISTAS SIMPLES (variantes, tips)
  // ============================================================

  renderListaSimple(campo, contenedorId) {
    const cont = document.getElementById(contenedorId);
    cont.innerHTML = '';
    const items = this.recetaEnEdicion[campo] || [];

    if (items.length === 0) {
      cont.innerHTML = '<p class="vacio">Sin elementos.</p>';
      return;
    }

    items.forEach((texto, i) => {
      const div = document.createElement('div');
      div.className = 'fila-lista';
      div.innerHTML = `
        <textarea rows="2" data-idx="${i}">${escapeHtml(texto)}</textarea>
        <button type="button" data-eliminar="${i}" title="Eliminar">×</button>
      `;
      cont.appendChild(div);
    });

    cont.querySelectorAll('textarea').forEach(el => {
      el.addEventListener('input', (e) => {
        this.recetaEnEdicion[campo][Number(e.target.dataset.idx)] = e.target.value;
      });
    });
    cont.querySelectorAll('button[data-eliminar]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.recetaEnEdicion[campo].splice(Number(btn.dataset.eliminar), 1);
        this.renderListaSimple(campo, contenedorId);
      });
    });
  },

  agregarItemLista(campo, contenedorId) {
    if (!this.recetaEnEdicion[campo]) this.recetaEnEdicion[campo] = [];
    this.recetaEnEdicion[campo].push('');
    this.renderListaSimple(campo, contenedorId);
  },

  // ============================================================
  // RECOGER, VALIDAR, GUARDAR
  // ============================================================

  recogerDatos() {
    const r = this.recetaEnEdicion;

    r.id = document.getElementById('campo-id').value.trim();
    r.nombre = document.getElementById('campo-nombre').value.trim();
    r.icono = document.getElementById('campo-icono').value.trim();
    r.fuente = document.getElementById('campo-fuente').value.trim();
    r.version = document.getElementById('campo-version').value.trim();
    r.categoria = document.getElementById('campo-categoria').value;
    r.estado = document.getElementById('campo-estado').value;
    r.tiempo_total = document.getElementById('campo-tiempo-total').value.trim();
    r.temperatura_horno = document.getElementById('campo-temperatura-horno').value.trim();
    r.hidratacion = document.getElementById('campo-hidratacion').value.trim();
    r.rinde = document.getElementById('campo-rinde').value.trim();
    r.descripcion = document.getElementById('campo-descripcion').value.trim();

    r.ingredientes.harina_total_g = this.calcularHarinaTotalEnVivo();

    // Metadata
    r.metadata.autor_receta = document.getElementById('campo-autor').value.trim();
    r.metadata.fecha_creacion = document.getElementById('campo-fecha-creacion').value;
    r.metadata.fecha_actualizacion = document.getElementById('campo-fecha-actualizacion').value;
    const tagsRaw = document.getElementById('campo-tags').value;
    r.metadata.tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);

        return r;
  },

  validarUI(r, recetas, idOriginal) {
    const errores = [];

    if (!r.id) errores.push('El ID es obligatorio.');
    else if (!/^[a-z0-9_]+$/.test(r.id)) {
      errores.push('El ID debe ser snake_case sin acentos (solo minúsculas, números y _).');
    } else if (recetas.some(x => x.id === r.id && x.id !== idOriginal)) {
      errores.push(`Ya existe una receta con el ID "${r.id}".`);
    }

    if (!r.nombre) errores.push('El nombre es obligatorio.');
    if (!r.categoria) errores.push('Elegí una categoría.');

    const grupos = r.ingredientes.grupos || [];
    if (grupos.length === 0) {
      errores.push('Agregá al menos un grupo de ingredientes.');
    } else {
      let sinItems = false, conItemsInvalidos = false, conHarina = false;
      grupos.forEach(g => {
        if (!g.items || g.items.length === 0) sinItems = true;
        (g.items || []).forEach(it => {
          if (!it.nombre || !String(it.nombre).trim()) conItemsInvalidos = true;
          if (it.cantidad === '' || it.cantidad === null || isNaN(Number(it.cantidad))) conItemsInvalidos = true;
          if (it.es_harina) conHarina = true;
        });
      });
      if (sinItems) errores.push('Cada grupo debe tener al menos un ingrediente.');
      if (conItemsInvalidos) errores.push('Todos los ingredientes deben tener nombre y cantidad numérica.');
      if (!conHarina) errores.push('Marcá al menos un ingrediente como harina (es_harina).');
    }

    if (!r.etapas || r.etapas.length === 0) errores.push('Agregá al menos una etapa.');

    return errores;
  },

  guardar() {
    const r = this.recogerDatos();
    const errores = this.validarUI(r, App.estado.recetas, this.idOriginal);
    if (errores.length > 0) {
      alert('Revisá estos puntos:\n\n- ' + errores.join('\n- '));
      return false;
    }

    // Limpiar listas simples
    r.variantes = (r.variantes || []).map(s => s.trim()).filter(Boolean);
    r.tips = (r.tips || []).map(s => s.trim()).filter(Boolean);

    // Renumerar etapas
    (r.etapas || []).forEach((et, i) => { et.orden = i + 1; });

    // Filtrar BPM vacíos
    r.bpm = (r.bpm || []).filter(b => b.etapa || b.peligro || b.control || b.limite_critico);

    // Filtrar consideraciones vacías
    r.consideraciones = (r.consideraciones || []).filter(c => c.titulo || c.texto);
    // Limpiar referencias cruzadas
    ['temperaturas_relacionadas', 'prefermentos_sugeridos', 'productos_similares'].forEach(k => {
      r.referencias_cruzadas[k] = (r.referencias_cruzadas[k] || [])
        .map(s => String(s).trim())
        .filter(Boolean);
    });

    // Metadata
        if (!r.metadata) r.metadata = {};
    if (!r.metadata.fecha_actualizacion) {
      r.metadata.fecha_actualizacion = new Date().toISOString().slice(0, 10);
    }

    if (this.esNueva) {
      App.estado.recetas.push(r);
      App.estado.cambios.nuevas.add(r.id);
    } else {
      const idx = App.estado.recetas.findIndex(x => x.id === this.idOriginal);
      if (idx >= 0) App.estado.recetas[idx] = r;
      App.estado.cambios.modificadas.add(r.id);
    }

    Storage.guardar(App.estado);
    return true;
  },
  // ============================================================
  // REFERENCIAS CRUZADAS
  // ============================================================

  renderReferenciasCruzadas() {
    const refs = this.recetaEnEdicion.referencias_cruzadas;
    const map = [
      ['temperaturas_relacionadas', 'lista-temperaturas-relacionadas'],
      ['prefermentos_sugeridos', 'lista-prefermentos-sugeridos'],
      ['productos_similares', 'lista-productos-similares']
    ];
    map.forEach(([campo, contId]) => {
      this.renderListaEnRefs(campo, contId);
    });
  },

  renderListaEnRefs(campo, contenedorId) {
    const cont = document.getElementById(contenedorId);
    cont.innerHTML = '';
    const items = (this.recetaEnEdicion.referencias_cruzadas[campo] || []);

    if (items.length === 0) {
      cont.innerHTML = '<p class="vacio">Sin elementos.</p>';
      return;
    }

    items.forEach((texto, i) => {
      const div = document.createElement('div');
      div.className = 'fila-lista';
      div.innerHTML = `
        <input type="text" data-idx="${i}" value="${escapeAttr(texto)}">
        <button type="button" data-eliminar="${i}" title="Eliminar">×</button>
      `;
      cont.appendChild(div);
    });

    cont.querySelectorAll('input').forEach(el => {
      el.addEventListener('input', (e) => {
        this.recetaEnEdicion.referencias_cruzadas[campo][Number(e.target.dataset.idx)] = e.target.value;
      });
    });
    cont.querySelectorAll('button[data-eliminar]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.recetaEnEdicion.referencias_cruzadas[campo].splice(Number(btn.dataset.eliminar), 1);
        this.renderListaEnRefs(campo, contenedorId);
      });
    });
  },

  agregarItemRef(campo) {
    this.recetaEnEdicion.referencias_cruzadas[campo].push('');
    const map = {
      temperaturas_relacionadas: 'lista-temperaturas-relacionadas',
      prefermentos_sugeridos: 'lista-prefermentos-sugeridos',
      productos_similares: 'lista-productos-similares'
    };
    this.renderListaEnRefs(campo, map[campo]);
  },

  // ============================================================
  // METADATA
  // ============================================================

  renderMetadata() {
    const m = this.recetaEnEdicion.metadata || {};
    document.getElementById('campo-autor').value = m.autor_receta || '';
    document.getElementById('campo-fecha-creacion').value = m.fecha_creacion || '';
    document.getElementById('campo-fecha-actualizacion').value = m.fecha_actualizacion || '';
    document.getElementById('campo-tags').value = (m.tags || []).join(', ');
  }
};

// ---- Helpers ----
function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
function escapeAttr(s) {
  return escapeHtml(s).replace(/"/g, '&quot;');
}
