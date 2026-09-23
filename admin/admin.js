// ============================================================
// Panel de Administración — Cuaderno de Panadería Años 40
// ============================================================

const TOKEN_ADMIN = 'cuaderno-1940';
const DATA_PATH = '../data/';

// Estado global (expuesto como App.estado para el formulario)
const App = {
  estado: {
    recetas: [],
    categorias: [],
    appConfig: {},
    cambios: {
      nuevas: new Set(),
      modificadas: new Set(),
      borradas: new Set()
    },
    cargado: false
  }
};

let ordenActual = { campo: 'id', direccion: 'asc' };

// ---- Verificación de acceso ----
function tieneAcceso() {
  const host = location.hostname;
  const esLocal = host === 'localhost' || host === '127.0.0.1' || host === '';
  const params = new URLSearchParams(location.search);
  const tokenOk = params.get('k') === TOKEN_ADMIN;
  return esLocal || tokenOk;
}

function mostrarBloqueo() {
  document.getElementById('bloqueo').classList.remove('oculto');
  document.getElementById('app').classList.add('oculto');
}

function mostrarApp() {
  document.getElementById('bloqueo').classList.add('oculto');
  document.getElementById('app').classList.remove('oculto');
}

// ---- Navegación lista / formulario ----
function mostrarVistaLista() {
  document.getElementById('vista-lista').classList.remove('oculto');
  document.getElementById('vista-formulario').classList.add('oculto');
  window.scrollTo({ top: 0 });
}

function mostrarVistaFormulario() {
  document.getElementById('vista-lista').classList.add('oculto');
  document.getElementById('vista-formulario').classList.remove('oculto');
  window.scrollTo({ top: 0 });
}

// ---- Carga de datos ----
async function cargarDatosActuales() {
  try {
    setEstadoGlobal('Cargando...', '');
    const [recetasRaw, categoriasRaw, appConfig] = await Promise.all([
      fetch(DATA_PATH + 'recetas.json').then(r => r.json()),
      fetch(DATA_PATH + 'categorias.json').then(r => r.json()),
      fetch(DATA_PATH + 'app_config.json').then(r => r.json())
    ]);

    // recetas.json es un array plano
    App.estado.recetas = Array.isArray(recetasRaw) ? recetasRaw : [];

    // categorias.json es { categorias: [...] }
    if (Array.isArray(categoriasRaw)) {
      App.estado.categorias = categoriasRaw;
    } else if (categoriasRaw && Array.isArray(categoriasRaw.categorias)) {
      App.estado.categorias = categoriasRaw.categorias;
    } else {
      App.estado.categorias = [];
    }

    App.estado.appConfig = appConfig || {};
    App.estado.cargado = true;
    App.estado.cambios = { nuevas: new Set(), modificadas: new Set(), borradas: new Set() };

    Storage.guardar(App.estado);
    refrescarTodo();
    setEstadoGlobal(`${App.estado.recetas.length} recetas cargadas`, 'ok');
  } catch (e) {
    console.error(e);
    setEstadoGlobal('Error al cargar datos. ¿Estás sirviendo con HTTP?', '');
    alert('No se pudieron cargar los datos.\n\n' + e.message);
  }
}

function recuperarDeStorage() {
  const guardado = Storage.cargar();
  if (guardado && guardado.cargado) {
    const cambios = guardado.cambios || {};
    App.estado = {
      ...guardado,
      cambios: {
        nuevas: new Set(Array.isArray(cambios.nuevas) ? cambios.nuevas : []),
        modificadas: new Set(Array.isArray(cambios.modificadas) ? cambios.modificadas : []),
        borradas: new Set(Array.isArray(cambios.borradas) ? cambios.borradas : [])
      }
    };
    return true;
  }
  return false;
}

// ---- Render global ----
function setEstadoGlobal(texto, clase) {
  const el = document.getElementById('estado-global');
  el.textContent = texto;
  el.className = 'estado' + (clase ? ' ' + clase : '');
}

function refrescarTodo() {
  refrescarCategorias();
  refrescarTabla();
  refrescarPie();
}

function refrescarCategorias() {
  const select = document.getElementById('filtro-categoria');
  const valorActual = select.value;
  select.innerHTML = '<option value="">Todas las categorías</option>';
  (App.estado.categorias || []).forEach(cat => {
    const id = cat.id || cat;
    const nombre = cat.nombre || cat;
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = nombre;
    select.appendChild(opt);
  });
  select.value = valorActual;
}

function recetasFiltradas() {
  const busqueda = document.getElementById('filtro-busqueda').value.toLowerCase().trim();
  const categoria = document.getElementById('filtro-categoria').value;
  const estadoFiltro = document.getElementById('filtro-estado').value;

  return App.estado.recetas.filter(r => {
    if (categoria && r.categoria !== categoria) return false;
    if (estadoFiltro && r.estado !== estadoFiltro) return false;
    if (busqueda) {
      const id = (r.id || '').toLowerCase();
      const nombre = (r.nombre || '').toLowerCase();
      const tags = (r.metadata && r.metadata.tags || []).join(' ').toLowerCase();
      if (!id.includes(busqueda) && !nombre.includes(busqueda) && !tags.includes(busqueda)) return false;
    }
    return true;
  });
}

function ordenarRecetas(lista) {
  const { campo, direccion } = ordenActual;
  const signo = direccion === 'asc' ? 1 : -1;
  return [...lista].sort((a, b) => {
    let va = a[campo] ?? '';
    let vb = b[campo] ?? '';
    if (campo === 'harina_total_g') {
      va = calcularHarinaTotal(a);
      vb = calcularHarinaTotal(b);
    }
    if (typeof va === 'number' && typeof vb === 'number') {
      return (va - vb) * signo;
    }
    return String(va).localeCompare(String(vb)) * signo;
  });
}

function refrescarTabla() {
  const tbody = document.getElementById('cuerpo-tabla');
  const lista = ordenarRecetas(recetasFiltradas());

  if (!App.estado.cargado) {
    tbody.innerHTML = '<tr><td colspan="6" class="vacio">No hay recetas cargadas. Usá "Cargar datos actuales".</td></tr>';
    return;
  }

  if (lista.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="vacio">No hay recetas que coincidan con los filtros.</td></tr>';
    return;
  }

  tbody.innerHTML = '';
  lista.forEach(r => {
    const tr = document.createElement('tr');
    const harinaTotal = calcularHarinaTotal(r);
    const categoriaNombre = (App.estado.categorias.find(c => c.id === r.categoria) || {}).nombre || r.categoria || '';
    tr.innerHTML = `
      <td><code>${r.id || ''}</code></td>
      <td>${r.icono ? r.icono + ' ' : ''}${r.nombre || ''}</td>
      <td>${categoriaNombre}</td>
      <td>${r.estado || ''}</td>
      <td>${harinaTotal || '—'}</td>
      <td>
        <div class="acciones-fila">
          <button class="btn" data-accion="editar" data-id="${r.id}">Editar</button>
          <button class="btn" data-accion="duplicar" data-id="${r.id}">Duplicar</button>
          <button class="btn btn-peligro" data-accion="borrar" data-id="${r.id}">Borrar</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('button[data-accion]').forEach(btn => {
    btn.addEventListener('click', () => {
      const accion = btn.dataset.accion;
      const id = btn.dataset.id;
      if (accion === 'editar') editarReceta(id);
      else if (accion === 'duplicar') duplicarReceta(id);
      else if (accion === 'borrar') borrarReceta(id);
    });
  });
}

function calcularHarinaTotal(receta) {
  // Tu estructura: receta.ingredientes.harina_total_g ya viene calculado
  if (receta.ingredientes && typeof receta.ingredientes.harina_total_g === 'number') {
    return receta.ingredientes.harina_total_g;
  }
  // Fallback: sumar a mano desde los grupos
  if (receta.ingredientes && Array.isArray(receta.ingredientes.grupos)) {
    let total = 0;
    receta.ingredientes.grupos.forEach(g => {
      (g.items || []).forEach(i => {
        if (i.es_harina && (i.unidad === 'g' || i.unidad === 'ml')) {
          total += Number(i.cantidad) || 0;
        }
      });
    });
    return total;
  }
  return 0;
}

function refrescarPie() {
  const { nuevas, modificadas, borradas } = App.estado.cambios;
  const total = nuevas.size + modificadas.size + borradas.size;
  const pie = document.getElementById('pie-estado');
  if (total === 0) {
    pie.textContent = 'Sin cambios';
    if (App.estado.cargado) setEstadoGlobal(`${App.estado.recetas.length} recetas cargadas`, 'ok');
  } else {
    pie.textContent = `${nuevas.size} nuevas, ${modificadas.size} modificadas, ${borradas.size} borradas — sin exportar`;
    setEstadoGlobal('Cambios sin exportar', 'cambios');
  }
}

// ---- Acciones ----
function editarReceta(id) {
  const receta = App.estado.recetas.find(r => r.id === id);
  if (!receta) return;
  Formulario.abrirEdicion(receta, App.estado.categorias);
  mostrarVistaFormulario();
}

function duplicarReceta(id) {
  const receta = App.estado.recetas.find(r => r.id === id);
  if (!receta) return;
  Formulario.abrirDuplicado(receta, App.estado.categorias);
  mostrarVistaFormulario();
}

function borrarReceta(id) {
  const receta = App.estado.recetas.find(r => r.id === id);
  if (!receta) return;
  if (!confirm(`¿Borrar la receta "${receta.nombre}" (${id})?`)) return;
  App.estado.recetas = App.estado.recetas.filter(r => r.id !== id);
  if (App.estado.cambios.nuevas.has(id)) {
    App.estado.cambios.nuevas.delete(id);
  } else {
    App.estado.cambios.borradas.add(id);
  }
  App.estado.cambios.modificadas.delete(id);
  Storage.guardar(App.estado);
  refrescarTodo();
}

function nuevaReceta() {
  Formulario.abrirNueva(App.estado.categorias);
  mostrarVistaFormulario();
}

// ---- Eventos del formulario ----
function inicializarEventosFormulario() {
  document.getElementById('btn-volver').addEventListener('click', () => {
    if (hayCambiosFormulario()) {
      if (!confirm('Hay cambios sin guardar. ¿Salir igual?')) return;
    }
    mostrarVistaLista();
    refrescarTodo();
  });

  document.getElementById('btn-cancelar').addEventListener('click', () => {
    if (hayCambiosFormulario()) {
      if (!confirm('Hay cambios sin guardar. ¿Salir igual?')) return;
    }
    mostrarVistaLista();
    refrescarTodo();
  });

  document.getElementById('form-receta').addEventListener('submit', (e) => {
    e.preventDefault();
    if (Formulario.guardar()) {
      mostrarVistaLista();
      refrescarTodo();
    }
  });

  document.getElementById('btn-guardar-duplicar').addEventListener('click', () => {
    if (!Formulario.guardar()) return;
    const idGuardado = Formulario.esNueva ? Formulario.recetaEnEdicion.id : Formulario.idOriginal;
    const receta = App.estado.recetas.find(r => r.id === idGuardado);
    if (!receta) {
      mostrarVistaLista();
      refrescarTodo();
      return;
    }
    Formulario.abrirDuplicado(receta, App.estado.categorias);
    mostrarVistaFormulario();
    refrescarTodo();
  });

  document.getElementById('btn-eliminar').addEventListener('click', () => {
    const id = Formulario.idOriginal;
    if (!id) return;
    const receta = App.estado.recetas.find(r => r.id === id);
    if (!receta) return;
    if (!confirm(`¿Borrar la receta "${receta.nombre}" (${id})?`)) return;

    App.estado.recetas = App.estado.recetas.filter(r => r.id !== id);
    if (App.estado.cambios.nuevas.has(id)) {
      App.estado.cambios.nuevas.delete(id);
    } else {
      App.estado.cambios.borradas.add(id);
    }
    App.estado.cambios.modificadas.delete(id);
    Storage.guardar(App.estado);
    mostrarVistaLista();
    refrescarTodo();
  });

  document.getElementById('btn-agregar-variante').addEventListener('click', () => {
    Formulario.agregarItemLista('variantes', 'lista-variantes');
  });
  document.getElementById('btn-agregar-grupo').addEventListener('click', () => {
    Formulario.agregarGrupo();
  });
  document.getElementById('btn-agregar-etapa').addEventListener('click', () => {
    Formulario.agregarEtapa();
  });
  document.getElementById('btn-agregar-tip').addEventListener('click', () => {
    Formulario.agregarItemLista('tips', 'lista-tips');
  });
  document.getElementById('btn-agregar-bpm').addEventListener('click', () => {
    Formulario.agregarBPM();
  });
  document.getElementById('btn-agregar-consideracion').addEventListener('click', () => {
    Formulario.agregarConsideracion();
  });
  // Referencias cruzadas: botones "+ Agregar"
  document.querySelectorAll('[data-agregar-lista]').forEach(btn => {
    btn.addEventListener('click', () => {
      Formulario.agregarItemRef(btn.dataset.agregarLista);
    });
  });
}
// Detecta si hay cambios sin guardar comparando el estado del formulario
// con la receta original.
function hayCambiosFormulario() {
  if (!Formulario.recetaEnEdicion) return false;
  const actual = JSON.parse(JSON.stringify(Formulario.recetaEnEdicion));
  try {
    actual.id = document.getElementById('campo-id').value.trim();
    actual.nombre = document.getElementById('campo-nombre').value.trim();
    actual.icono = document.getElementById('campo-icono').value.trim();
    actual.fuente = document.getElementById('campo-fuente').value.trim();
    actual.version = document.getElementById('campo-version').value.trim();
    actual.categoria = document.getElementById('campo-categoria').value;
    actual.estado = document.getElementById('campo-estado').value;
    actual.tiempo_total = document.getElementById('campo-tiempo-total').value.trim();
    actual.temperatura_horno = document.getElementById('campo-temperatura-horno').value.trim();
    actual.hidratacion = document.getElementById('campo-hidratacion').value.trim();
    actual.rinde = document.getElementById('campo-rinde').value.trim();
    actual.descripcion = document.getElementById('campo-descripcion').value.trim();
  } catch (e) { /* noop */ }

  if (Formulario.esNueva) {
    return !!(actual.id || actual.nombre ||
              (actual.ingredientes && actual.ingredientes.grupos && actual.ingredientes.grupos.length > 0) ||
              (actual.etapas && actual.etapas.length > 0));
  }

  const original = App.estado.recetas.find(r => r.id === Formulario.idOriginal);
  if (!original) return true;
  return JSON.stringify(actual) !== JSON.stringify(original);
}

// ---- Eventos generales ----
function inicializarEventos() {
  document.getElementById('btn-cargar').addEventListener('click', cargarDatosActuales);
  document.getElementById('btn-importar').addEventListener('click', () => {
    document.getElementById('input-importar').click();
  });
    document.getElementById('btn-exportar').addEventListener('click', () => {
    ImportarExportar.exportarRecetas();
  });
  document.getElementById('btn-exportar-appconfig').addEventListener('click', () => {
    ImportarExportar.exportarAppConfig();
  });
  document.getElementById('btn-nueva').addEventListener('click', nuevaReceta);

  document.getElementById('filtro-busqueda').addEventListener('input', refrescarTabla);
  document.getElementById('filtro-categoria').addEventListener('change', refrescarTabla);
  document.getElementById('filtro-estado').addEventListener('change', refrescarTabla);

  document.querySelectorAll('th[data-orden]').forEach(th => {
    th.addEventListener('click', () => {
      const campo = th.dataset.orden;
      if (ordenActual.campo === campo) {
        ordenActual.direccion = ordenActual.direccion === 'asc' ? 'desc' : 'asc';
      } else {
        ordenActual.campo = campo;
        ordenActual.direccion = 'asc';
      }
      refrescarTabla();
    });
  });

  inicializarEventosFormulario();
}

// ---- Arranque ----
function iniciar() {
  if (!tieneAcceso()) {
    mostrarBloqueo();
    return;
  }
  mostrarApp();
  inicializarEventos();

  if (recuperarDeStorage()) {
    refrescarTodo();
    setEstadoGlobal(`${App.estado.recetas.length} recetas recuperadas de sesión previa`, 'cambios');
  } else {
    setEstadoGlobal('Sin datos cargados', '');
  }
}

document.addEventListener('DOMContentLoaded', iniciar);
