/* ============================================================
   flujoPan_pdf.js
   Exportador PDF formato libro (vía iframe + window.print)
   Versión 3.1 · Corregido: SVG en impresión + colores exactos
   ============================================================ */

/* ------------------------------------------------------------
   UTILIDADES
   ------------------------------------------------------------ */
function formatDuration(mins) {
  if (mins == null) return '';
  if (mins < 60) return mins + ' min';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (m === 0) return h + ' h';
  return h + ' h ' + m + ' min';
}

function escXML(t) {
  return String(t == null ? '' : t)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/* ------------------------------------------------------------
   LIBRO PDF
   ------------------------------------------------------------ */
const LibroPDF = {

  /**
   * Genera el PDF y lo imprime.
   * @param {object} opciones
   * @param {string[]} opciones.recetas          - claves de PROCESOS
   * @param {string}   opciones.titulo           - título del libro
   * @param {string}   opciones.autor            - autor
   * @param {string}   opciones.fecha            - fecha de generación
   * @param {boolean}  opciones.incluirPortada
   * @param {boolean}  opciones.incluirIndice
   * @param {boolean}  opciones.incluirReferencias
   * @param {boolean}  opciones.incluirBPM
   * @param {boolean}  opciones.incluirDiagramas
   * @param {boolean}  opciones.autoImprimir     - abre el diálogo automáticamente
   */
  generar(opciones) {
    const {
      recetas = [],
      titulo = 'Manual Operativo del Panadero',
      autor = 'Gastón',
      fecha = new Date().toLocaleDateString('es-AR'),
      incluirPortada = true,
      incluirIndice = true,
      incluirReferencias = true,
      incluirBPM = true,
      incluirDiagramas = true,
      autoImprimir = true
    } = opciones || {};

    if (!recetas || recetas.length === 0) {
      alert('Seleccioná al menos una receta antes de exportar.');
      return null;
    }

    const recetasData = recetas.map(k => ({ key: k, ...PROCESOS[k] })).filter(Boolean);
    if (recetasData.length === 0) {
      alert('No se encontraron las recetas seleccionadas.');
      return null;
    }

    const html = this._construirHTML({
      recetasData, titulo, autor, fecha,
      incluirPortada, incluirIndice, incluirReferencias,
      incluirBPM, incluirDiagramas
    });

    return this._abrirEImprimir(html, autoImprimir);
  },

  /* ============================================================
     CONSTRUCCIÓN DEL HTML
     ============================================================ */
  _construirHTML(cfg) {
    const {
      recetasData, titulo, autor, fecha,
      incluirPortada, incluirIndice, incluirReferencias,
      incluirBPM, incluirDiagramas
    } = cfg;

    return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>${escXML(titulo)}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/cormorant-garamond@5.0.16/400.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/cormorant-garamond@5.0.16/700.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.16/400.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.16/600.css">
<style>${this._css()}</style>
</head>
<body>

<div class="toolbar-pdf no-print">
  <button onclick="window.print()">🖨 Imprimir / Guardar PDF</button>
  <button class="sec" onclick="window.close()">✕ Cerrar</button>
</div>

<div class="libro">
${incluirPortada ? this._portada(titulo, autor, fecha) : ''}
${this._creditos(titulo, autor, fecha, recetasData.length)}
${incluirIndice ? this._indice(recetasData) : ''}
${recetasData.map((r, i) => this._capitulo(r, i + 1, incluirDiagramas, incluirBPM)).join('\n')}
${incluirReferencias ? this._referencias() : ''}
</div>

</body>
</html>`;
  },

  /* ============================================================
     CSS EMBEBIDO
     ============================================================ */
  _css() {
    return `
:root{
  --bg:#fffaf0; --ink:#2b1d0e; --gold:#8b6a1f;
  --red:#a83232; --green:#4a7a3a; --amber:#b8862e; --blue:#3a5a7a;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#e8dcc0}
body{font-family:'Inter',sans-serif;color:var(--ink);line-height:1.6}

.libro{max-width:210mm;margin:0 auto;background:var(--bg)}

/* ============ PORTADA ============ */
.portada{
  height:297mm;display:flex;flex-direction:column;justify-content:center;align-items:center;
  text-align:center;padding:40mm;page-break-after:always;break-after:page;position:relative;
}
.portada::before{
  content:'';position:absolute;top:20mm;left:20mm;right:20mm;bottom:20mm;
  border:3px double var(--gold);pointer-events:none;
}
.portada .icono{font-size:6em;margin-bottom:20mm;color:var(--red)}
.portada h1{
  font-family:'Cormorant Garamond',serif;font-weight:700;
  font-size:3.2em;color:var(--red);letter-spacing:3px;line-height:1.1;
  margin-bottom:8mm;
}
.portada .subtitulo{
  font-family:'Cormorant Garamond',serif;font-style:italic;
  font-size:1.4em;color:var(--gold);margin-bottom:20mm;
}
.portada .autor{
  font-family:'Cormorant Garamond',serif;font-size:1.2em;
  color:var(--ink);margin-bottom:4mm;
}
.portada .fecha{font-size:.9em;color:var(--gold);letter-spacing:2px}
.portada .epigrafe{
  position:absolute;bottom:30mm;left:0;right:0;
  font-family:'Cormorant Garamond',serif;font-style:italic;
  color:var(--gold);font-size:1em;
}

/* ============ CREDITOS ============ */
.creditos{
  page-break-after:always;break-after:page;padding:40mm 30mm;
  font-size:.9em;line-height:1.8;color:var(--ink);
}
.creditos h2{
  font-family:'Cormorant Garamond',serif;color:var(--red);
  font-size:1.6em;margin-bottom:8mm;
}
.creditos p{margin-bottom:3mm}

/* ============ INDICE ============ */
.indice{page-break-after:always;break-after:page;padding:30mm}
.indice h2{
  font-family:'Cormorant Garamond',serif;color:var(--red);
  font-size:2em;margin-bottom:10mm;border-bottom:2px solid var(--gold);
  padding-bottom:4mm;
}
.indice ol{list-style:none;font-size:1.05em}
.indice li{
  display:flex;justify-content:space-between;align-items:baseline;
  padding:3mm 0;border-bottom:1px dotted var(--gold);
  font-family:'Cormorant Garamond',serif;
  page-break-inside:avoid;break-inside:avoid;
}
.indice li .num{color:var(--gold);font-weight:700;margin-right:4mm;min-width:8mm}
.indice li .nombre{flex:1}
.indice li .pag{color:var(--red);font-weight:700}

/* ============ CAPITULO ============ */
.capitulo{page-break-before:always;break-before:page;padding:25mm 20mm}
.capitulo-header{
  text-align:center;margin-bottom:12mm;
  border-bottom:3px double var(--gold);padding-bottom:8mm;
}
.capitulo-header .num-cap{
  font-family:'Cormorant Garamond',serif;color:var(--gold);
  font-size:1em;letter-spacing:4px;text-transform:uppercase;
  margin-bottom:4mm;
}
.capitulo-header h2{
  font-family:'Cormorant Garamond',serif;font-weight:700;
  font-size:2.4em;color:var(--red);letter-spacing:2px;line-height:1.2;
}
.capitulo-header .meta{
  font-size:.85em;color:var(--gold);margin-top:4mm;
  font-family:'Cormorant Garamond',serif;font-style:italic;
}
.capitulo-header .icono{font-size:3em;margin-bottom:4mm;color:var(--red)}

/* ============ SECCIONES ============ */
h3.sub{
  font-family:'Cormorant Garamond',serif;font-weight:700;
  font-size:1.5em;color:var(--gold);margin:8mm 0 4mm;
  border-bottom:1px solid #e8dcc0;padding-bottom:2mm;
  page-break-after:avoid;break-after:avoid;
}
h3.sub::before{content:'§ ';color:var(--red)}
p{font-size:.92em;line-height:1.7;margin-bottom:4mm;text-align:justify}

/* ============ DIAGRAMA ============ */
.flow-diagram{
  background:#fff;border:1px solid var(--gold);border-radius:4px;
  padding:6mm;margin:6mm 0;overflow:visible;
  page-break-inside:avoid;break-inside:avoid;
  -webkit-print-color-adjust:exact;
  print-color-adjust:exact;
}
.flow-svg{
  display:block;margin:0 auto;
  width:100%;height:auto;max-height:200mm;
  -webkit-print-color-adjust:exact;
  print-color-adjust:exact;
}
.flow-svg text{
  font-family:'Inter',sans-serif;
  -webkit-print-color-adjust:exact;
  print-color-adjust:exact;
}
.flow-svg .stage-label{font-family:'Cormorant Garamond',serif;font-weight:700}
.flow-svg rect,.flow-svg polygon,.flow-svg line,.flow-svg path{
  -webkit-print-color-adjust:exact;
  print-color-adjust:exact;
}

/* ============ TABLAS ============ */
table.ref{
  width:100%;border-collapse:collapse;margin:4mm 0 6mm;
  font-size:.82em;background:#fff;
  page-break-inside:avoid;break-inside:avoid;
  -webkit-print-color-adjust:exact;
  print-color-adjust:exact;
}
table.ref th{
  background:var(--red);color:var(--bg);
  font-family:'Cormorant Garamond',serif;font-weight:700;
  padding:3mm 4mm;text-align:left;letter-spacing:.5px;
  border:1px solid var(--gold);
  -webkit-print-color-adjust:exact;
  print-color-adjust:exact;
}
table.ref td{padding:2.5mm 4mm;border:1px solid #e8dcc0;vertical-align:top}
table.ref tr:nth-child(even) td{background:#f9f3e3}

table.bpm{
  width:100%;border-collapse:collapse;margin:4mm 0;font-size:.78em;
  background:#fff;
  page-break-inside:avoid;break-inside:avoid;
  -webkit-print-color-adjust:exact;
  print-color-adjust:exact;
}
table.bpm th{
  background:var(--blue);color:var(--bg);
  font-family:'Cormorant Garamond',serif;font-weight:700;
  padding:2.5mm 3mm;text-align:left;border:1px solid var(--gold);
  -webkit-print-color-adjust:exact;
  print-color-adjust:exact;
}
table.bpm td{padding:2mm 3mm;border:1px solid #e8dcc0;vertical-align:top}
table.bpm tr:nth-child(even) td{background:#f9f3e3}

/* ============ CONSIDERACIONES ============ */
.consideracion{
  background:#fff;border-left:4px solid var(--amber);
  padding:3mm 4mm;margin:3mm 0;border-radius:0 3px 3px 0;
  page-break-inside:avoid;break-inside:avoid;font-size:.88em;
  -webkit-print-color-adjust:exact;
  print-color-adjust:exact;
}
.consideracion.warn{border-left-color:var(--red)}
.consideracion.ok{border-left-color:var(--green)}
.consideracion .c-titulo{
  font-family:'Cormorant Garamond',serif;font-weight:700;
  color:var(--red);margin-bottom:1.5mm;font-size:1.05em;
}
.consideracion p{margin:0;font-size:.95em;line-height:1.5}

/* ============ PIE ============ */
.pie{
  text-align:center;font-family:'Cormorant Garamond',serif;
  font-style:italic;color:var(--gold);font-size:.85em;
  margin-top:10mm;padding-top:4mm;border-top:1px solid var(--gold);
}
.pie .num-pag{
  display:inline-block;background:var(--red);color:var(--bg);
  padding:1mm 4mm;border-radius:10px;font-style:normal;
  font-weight:700;font-family:'Inter',sans-serif;font-size:.85em;
  -webkit-print-color-adjust:exact;
  print-color-adjust:exact;
}

/* ============ TOOLBAR ============ */
.toolbar-pdf{
  position:fixed;top:20px;right:20px;z-index:100;display:flex;gap:8px;
}
.toolbar-pdf button{
  background:var(--green);color:white;border:none;
  padding:12px 22px;border-radius:4px;cursor:pointer;
  font-family:'Cormorant Garamond',serif;font-weight:700;
  font-size:1.05em;letter-spacing:1px;
  box-shadow:0 3px 10px rgba(0,0,0,.3);
}
.toolbar-pdf button:hover{background:var(--ink)}
.toolbar-pdf button.sec{background:var(--gold)}

/* ============ PRINT ============ */
@page{
  size:A4;
  margin:15mm 12mm;
}
@page:first{
  margin:0;
}
@media print{
  html,body{background:white !important}
  .libro{max-width:100%;background:white !important}
  .no-print,.toolbar-pdf{display:none !important}

  .portada{
    height:297mm;
    page-break-after:always;
    break-after:page;
  }
  .creditos,.indice{
    page-break-after:always;
    break-after:page;
  }
  .capitulo{
    page-break-before:always;
    break-before:page;
    padding:0;
  }

  /* Forzar renderizado del SVG y sus colores */
  svg,.flow-svg,.flow-diagram{
    display:block !important;
    visibility:visible !important;
    opacity:1 !important;
    max-width:100% !important;
    height:auto !important;
    page-break-inside:avoid;
    break-inside:avoid;
    -webkit-print-color-adjust:exact !important;
    print-color-adjust:exact !important;
  }
  svg text{
    -webkit-print-color-adjust:exact !important;
    print-color-adjust:exact !important;
  }
  svg rect,svg polygon,svg line,svg path,svg circle{
    -webkit-print-color-adjust:exact !important;
    print-color-adjust:exact !important;
  }

  table.ref,table.bpm,.consideracion{
    page-break-inside:avoid;
    break-inside:avoid;
    -webkit-print-color-adjust:exact !important;
    print-color-adjust:exact !important;
  }
  h3.sub{page-break-after:avoid;break-after:avoid}
  .indice li{page-break-inside:avoid;break-inside:avoid}
}
`;
  },

  /* ============================================================
     COMPONENTES
     ============================================================ */
  _portada(titulo, autor, fecha) {
    return `<section class="portada">
      <div class="icono">⎖</div>
      <h1>${escXML(titulo)}</h1>
      <div class="subtitulo">Flujo de trabajo · Calendario eterno · Consideraciones técnicas</div>
      <div class="autor">${escXML(autor)}</div>
      <div class="fecha">${escXML(fecha)}</div>
      <div class="epigrafe">«Las matemáticas silencian el ruido.<br>Los sentidos toman el mando.»</div>
    </section>`;
  },

  _creditos(titulo, autor, fecha, numRecetas) {
    return `<section class="creditos">
      <h2>Créditos</h2>
      <p><b>${escXML(titulo)}</b></p>
      <p>Autor: ${escXML(autor)}</p>
      <p>Fecha de generación: ${escXML(fecha)}</p>
      <p>Recetas incluidas: ${numRecetas}</p>
      <p style="margin-top:8mm">Este documento fue generado automáticamente por <b>flujoPan v3.1</b>,
      basado en el libro <i>Panadería Argentina: Las Mejores Recetas para Hacer en Casa</i>
      de Claudio Olijavetzky, complementado con fundamentos científicos, técnicos
      y de Buenas Prácticas de Manufactura (BPM).</p>
      <p style="margin-top:8mm;font-size:.85em;color:var(--gold)">
      Documento imprimible · A4 · Uso profesional</p>
    </section>`;
  },

  _indice(recetasData) {
    return `<section class="indice">
      <h2>Índice de Recetas</h2>
      <ol>
        ${recetasData.map((r, i) => `
          <li>
            <span class="num">${String(i + 1).padStart(2, '0')}</span>
            <span class="nombre">${escXML(r.icon)} ${escXML(r.name)}</span>
            <span class="pag">Cap. ${i + 1}</span>
          </li>
        `).join('')}
      </ol>
    </section>`;
  },

  _capitulo(receta, num, incluirDiagramas, incluirBPM) {
    const meta = [];
    if (receta.time)        meta.push(`Tiempo total: ${receta.time}`);
    if (receta.tempHorno)   meta.push(`Horno: ${receta.tempHorno}`);
    if (receta.hidratacion) meta.push(`Hidratación: ${receta.hidratacion}`);

    return `<section class="capitulo">
      <div class="capitulo-header">
        <div class="num-cap">Capítulo ${num}</div>
        <div class="icono">${escXML(receta.icon)}</div>
        <h2>${escXML(receta.name)}</h2>
        <div class="meta">${meta.map(escXML).join(' · ')}</div>
      </div>

      ${incluirDiagramas ? this._diagrama(receta) : ''}

      ${receta.considerations && receta.considerations.length > 0 ? `
        <h3 class="sub">Consideraciones Técnicas</h3>
        ${receta.considerations.map(c => `
          <div class="consideracion ${c.type || ''}">
            <div class="c-titulo">${escXML(c.title)}</div>
            <p>${escXML(c.text)}</p>
          </div>
        `).join('')}
      ` : ''}

      ${incluirBPM && receta.bpm && receta.bpm.length > 0 ? `
        <h3 class="sub">Buenas Prácticas de Manufactura</h3>
        <table class="bpm">
          <tr><th>Etapa</th><th>Peligro</th><th>Control</th><th>Límite crítico</th></tr>
          ${receta.bpm.map(b => `
            <tr>
              <td>${escXML(b.etapa)}</td>
              <td>${escXML(b.peligro)}</td>
              <td>${escXML(b.control)}</td>
              <td>${escXML(b.limite)}</td>
            </tr>
          `).join('')}
        </table>
      ` : ''}

      <div class="pie">
        <span class="num-pag">Capítulo ${num}</span>
      </div>
    </section>`;
  },

  /* ============================================================
     DIAGRAMA SVG (CORREGIDO)
     ============================================================ */
  _diagrama(receta) {
    const stages = receta.stages || [];
    if (stages.length === 0) return '';

    const n = stages.length;
    const boxW = 150, boxH = 70, gap = 25;
    const cols = Math.min(4, n);
    const rows = Math.ceil(n / cols);
    const svgW = cols * (boxW + gap) + 60;
    const svgH = rows * (boxH + 70) + 100;

    let svg = `<div class="flow-diagram"><svg class="flow-svg" viewBox="0 0 ${svgW} ${svgH}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">`;

    stages.forEach((s, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = 30 + col * (boxW + gap);
      const y = 40 + row * (boxH + 70);

      // Color según tipo de etapa
      let fill = '#4a7a3a';
      const nameL = (s.name || '').toLowerCase();
      if (nameL.includes('ferm') || nameL.includes('leud') || nameL.includes('bloque') ||
          nameL.includes('refresco') || nameL.includes('reposo') || nameL.includes('autólisis')) {
        fill = '#b8862e';
      }
      if (nameL.includes('horne') || nameL.includes('corte') || nameL.includes('fritura') ||
          nameL.includes('cocción')) {
        fill = '#a83232';
      }
      if (nameL.includes('frío') || nameL.includes('enfriad') || nameL.includes('atemper')) {
        fill = '#3a5a7a';
      }
      if (nameL.includes('divis') || nameL.includes('form') || nameL.includes('boll') ||
          nameL.includes('ovill') || nameL.includes('armado') || nameL.includes('trenz')) {
        fill = '#3a5a7a';
      }

      // Truncar textos
      const nombreCorto = (s.name || '').length > 22 ? s.name.substring(0, 20) + '…' : s.name;
      const descCorta = (s.desc || '').length > 40 ? s.desc.substring(0, 38) + '…' : (s.desc || '');

      svg += `<g>
        <rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="6" ry="6" fill="${fill}" stroke="#2b1d0e" stroke-width="1.5"/>
        <text x="${x + boxW / 2}" y="${y + 20}" text-anchor="middle" fill="#fffaf0" class="stage-label" font-size="12" font-weight="700">${i + 1}. ${escXML(nombreCorto)}</text>
        <text x="${x + boxW / 2}" y="${y + 38}" text-anchor="middle" fill="#fffaf0" font-size="10">${escXML(formatDuration(s.dur))}</text>
        <text x="${x + boxW / 2}" y="${y + 55}" text-anchor="middle" fill="#fffaf0" font-size="9" font-style="italic" opacity="0.9">${escXML(descCorta)}</text>
      </g>`;

      // Flechas entre etapas
      if (i < n - 1) {
        const nextCol = (i + 1) % cols;
        const nextRow = Math.floor((i + 1) / cols);
        if (nextRow === row) {
          // Misma fila → flecha horizontal
          svg += `<line x1="${x + boxW}" y1="${y + boxH / 2}" x2="${x + boxW + gap - 8}" y2="${y + boxH / 2}" stroke="#a83232" stroke-width="2"/>
                  <polygon points="${x + boxW + gap},${y + boxH / 2} ${x + boxW + gap - 8},${y + boxH / 2 - 4} ${x + boxW + gap - 8},${y + boxH / 2 + 4}" fill="#a83232"/>`;
        } else {
          // Cambio de fila → flecha curva
          const xIni = x + boxW / 2;
          const yIni = y + boxH;
          const xFin = 30 + nextCol * (boxW + gap) + boxW / 2;
          const yFin = y + boxH + 50;
          svg += `<path d="M ${xIni} ${yIni} Q ${xIni} ${yIni + 20} ${xFin} ${yIni + 20} T ${xFin} ${yFin - 8}" fill="none" stroke="#a83232" stroke-width="2" stroke-dasharray="5,3"/>
                  <polygon points="${xFin},${yFin} ${xFin - 5},${yFin - 8} ${xFin + 5},${yFin - 8}" fill="#a83232"/>`;
        }
      }
    });

    // Leyenda
    const legY = svgH - 50;
    svg += `<g transform="translate(30,${legY})">
      <rect x="0" y="0" width="14" height="14" fill="#4a7a3a" rx="2"/>
      <text x="20" y="11" font-size="10" fill="#2b1d0e">Mezcla/amasado</text>
      <rect x="140" y="0" width="14" height="14" fill="#b8862e" rx="2"/>
      <text x="160" y="11" font-size="10" fill="#2b1d0e">Fermentación</text>
      <rect x="270" y="0" width="14" height="14" fill="#3a5a7a" rx="2"/>
      <text x="290" y="11" font-size="10" fill="#2b1d0e">Formado/reposo</text>
      <rect x="410" y="0" width="14" height="14" fill="#a83232" rx="2"/>
      <text x="430" y="11" font-size="10" fill="#2b1d0e">Horneado/cocción</text>
    </g>`;

    svg += `</svg></div>`;
    return svg;
  },

  /* ============================================================
     REFERENCIAS
     ============================================================ */
  _referencias() {
    const t = REFERENCIAS.temperaturas || [];
    const l = REFERENCIAS.levaduras || [];
    const r = REFERENCIAS.reglas_oro || [];

    return `<section class="capitulo">
      <div class="capitulo-header">
        <div class="num-cap">Apéndice</div>
        <h2>Tablas de Referencia Rápida</h2>
      </div>

      <h3 class="sub">Temperaturas Internas de Cocción</h3>
      <table class="ref">
        <tr><th>Producto</th><th>Horno</th><th>T. interna</th><th>Tiempo aprox.</th></tr>
        ${t.map(x => `<tr><td>${escXML(x.producto)}</td><td>${escXML(x.horno)}</td><td>${escXML(x.interna)}</td><td>${escXML(x.tiempo)}</td></tr>`).join('')}
      </table>

      <h3 class="sub">Equivalencias de Levadura</h3>
      <table class="ref">
        <tr><th>Tipo</th><th>Equivalencia</th><th>Uso por kg harina</th></tr>
        ${l.map(x => `<tr><td>${escXML(x.tipo)}</td><td>${escXML(x.equivalencia)}</td><td>${escXML(x.uso)}</td></tr>`).join('')}
      </table>

      <h3 class="sub">Reglas de Oro del Panadero</h3>
      <table class="ref">
        <tr><th>Regla</th><th>Aplicación</th></tr>
        ${r.map(x => `<tr><td>${escXML(x.regla)}</td><td>${escXML(x.aplicacion)}</td></tr>`).join('')}
      </table>

      <div class="pie">
        <span class="num-pag">Apéndice</span>
      </div>
    </section>`;
  },

  /* ============================================================
     APERTURA E IMPRESIÓN (con iframe oculto)
     ============================================================ */
  _abrirEImprimir(html, autoImprimir) {
    // Crear iframe oculto (más confiable que window.open)
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.opacity = '0';
    iframe.setAttribute('aria-hidden', 'true');
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();

    // Esperar a que cargue y disparar impresión
    const dispararImpresion = () => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (e) {
        console.error('Error al imprimir:', e);
      }
    };

    if (autoImprimir) {
      // Doble setTimeout: uno para que se pinte el DOM, otro para que el SVG esté listo
      setTimeout(() => {
        setTimeout(() => {
          dispararImpresion();
          // Limpiar después de un tiempo prudencial
          setTimeout(() => {
            if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
          }, 60000);
        }, 500);
      }, 300);
    }

    return iframe;
  }
};

/* Exportar */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LibroPDF, formatDuration };
}