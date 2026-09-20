/* ============================================================
   flujoPan_data.js — Base de datos de procesos panaderos
   Versión 3.0 · Basada en "Libro Panadería Gastón"
   ------------------------------------------------------------
   Estructura:
   CATEGORIAS  → agrupa recetas por familia
   PROCESOS    → cada receta con sus etapas, consideraciones y BPM
   REFERENCIAS → tablas de consulta rápida
   ============================================================ */

const CATEGORIAS = {
  clasicos:   { nombre: 'Los Clásicos',              icono: '🥖', orden: 1 },
  manteca:    { nombre: 'Facturas de Manteca',        icono: '🥐', orden: 2 },
  grasa:      { nombre: 'Facturas de Grasa',          icono: '🥟', orden: 3 },
  regionales: { nombre: 'Panes Regionales',           icono: '🌾', orden: 4 },
  inmigrantes:{ nombre: 'Panes de Inmigrantes',       icono: '🌍', orden: 5 },
  fiesta:     { nombre: 'Panes de Fiesta',            icono: '🎉', orden: 6 },
  panettone:  { nombre: 'Panettone',                  icono: '🍰', orden: 7 },
  bases:      { nombre: 'Recetas Base',               icono: '🧂', orden: 8 }
};

const PROCESOS = {

  /* ==========================================================
     CATEGORÍA: LOS CLÁSICOS
     ========================================================== */
  flautas: {
    cat: 'clasicos',
    name: 'Flautas y Minones', icon: '🥖', time: '3.5-5 h',
    tempHorno: '200-220°C',
    hidratacion: '58-62%',
    stages: [
      { name:'Mezclado y amasado', dur:15, desc:'Harina 000 + agua + levadura + sal + malta' },
      { name:'Fermentación en bloque', dur:90, desc:'1ª fermentación · 25-28°C · tapado' },
      { name:'Reposo y estirado', dur:20, desc:'5 vueltas de palo · 5 mm' },
      { name:'División y ovillado', dur:20, desc:'8 piezas de 100 g · cilindro' },
      { name:'Leudado final', dur:60, desc:'Duplicar volumen · 25-28°C' },
      { name:'Corte y horneado', dur:25, desc:'Cortes diagonales · 200-220°C · vapor' },
      { name:'Enfriado en rejilla', dur:45, desc:'Corteza crujiente' }
    ],
    considerations: [
      { type:'ok', title:'✓ Hidratación media', text:'58-62%. Permite miga alveolada sin dificultad de manejo.' },
      { type:'', title:'⚖ Amasado moderado', text:'Desarrollar gluten extensible, no excesivo. Prueba de membrana.' },
      { type:'warn', title:'⚠ Vapor esencial', text:'Los primeros 5-8 min con vapor. Retrasa la corteza y permite oven spring.' },
      { type:'', title:'🌡 TDM', text:'24-26°C al final del amasado. Fórmula: T_agua = (T_deseada×3) − (T_harina + T_ambiente + T_fricción).' }
    ],
    bpm: [
      { etapa:'Recepción harina',   peligro:'Bacillus cereus, mohos', control:'Proveedor habilitado', limite:'Fecha vigente' },
      { etapa:'Amasado',            peligro:'Contaminación manipulador', control:'Higiene', limite:'Manos lavadas' },
      { etapa:'Fermentación',       peligro:'Crecimiento patógenos', control:'Control T° y tiempo', limite:'25-28°C, 1-2 h' },
      { etapa:'Horneado',           peligro:'Supervivencia patógenos', control:'T° y tiempo', limite:'200-220°C, T° int ≥85°C' },
      { etapa:'Enfriado',           peligro:'Mohos', control:'Rejilla, no envolver caliente', limite:'T° ≤30°C' }
    ]
  },

  baguetines: {
    cat: 'clasicos',
    name: 'Baguetines de Colita de Cuadril', icon: '🥖', time: '4-5 h',
    tempHorno: '180-200°C',
    hidratacion: '55-60%',
    stages: [
      { name:'Preparar masa base', dur:20, desc:'Harina 000 + agua + levadura + sal + malta + manteca' },
      { name:'Fermentación', dur:90, desc:'1ª fermentación · 25-28°C' },
      { name:'Preparar relleno', dur:40, desc:'Colita al horno + cebollas + morrones rehogados' },
      { name:'División y formado', dur:20, desc:'Cilindros cortos y anchos' },
      { name:'Leudado final', dur:45, desc:'Duplicar volumen' },
      { name:'Horneado', dur:20, desc:'180-200°C · 15-20 min' },
      { name:'Armado', dur:15, desc:'Abrir, rellenar con carne + queso gruyère, cerrar' }
    ],
    considerations: [
      { type:'ok', title:'✓ Masa firme', text:'Hidratación 55-60% para soportar el relleno sin desmoronarse.' },
      { type:'warn', title:'⚠ Cadena de frío de la carne', text:'Colita de cuadril ≤4°C. Cocción interna ≥71°C antes de rellenar.' },
      { type:'', title:'⚖ Enfriado rápido del relleno', text:'De 71°C a ≤4°C en menos de 2 horas para evitar proliferación.' },
      { type:'', title:'🧀 Queso gruyère', text:'1 feta por baguetín. Funde y aporta sabor lácteo.' }
    ],
    bpm: [
      { etapa:'Recepción carne',    peligro:'Salmonella, E. coli', control:'Proveedor habilitado, cadena frío', limite:'T° ≤4°C' },
      { etapa:'Cocción carne',      peligro:'Supervivencia patógenos', control:'T° interna', limite:'≥71°C' },
      { etapa:'Enfriado carne',     peligro:'Crecimiento microbiano', control:'Enfriar rápido', limite:'≤4°C en 2 h' },
      { etapa:'Armado',             peligro:'Contaminación cruzada', control:'Higiene, utensilios', limite:'---' },
      { etapa:'Horneado',           peligro:'Supervivencia patógenos', control:'T° y tiempo', limite:'180-200°C, 15-20 min' }
    ]
  },

  pebetes: {
    cat: 'clasicos',
    name: 'Pebetes y Chips', icon: '🍞', time: '3-4 h',
    tempHorno: '200°C',
    hidratacion: '55-60%',
    stages: [
      { name:'Mezclado', dur:10, desc:'Harina 0000 + agua + levadura + azúcar + sal + edulcorante' },
      { name:'Amasado + manteca', dur:15, desc:'Incorporar manteca blanda · masa lisa' },
      { name:'Estirado y doblado', dur:15, desc:'10 vueltas de palo · 5 mm' },
      { name:'División y bollado', dur:15, desc:'8 pebetes de 100 g · reposo 10 min' },
      { name:'Formado alargado', dur:10, desc:'Bollos alargados, pegados por extremos' },
      { name:'Leudado final', dur:60, desc:'Duplicar volumen · 25-28°C' },
      { name:'Horneado', dur:18, desc:'200°C · 15-20 min' },
      { name:'Pintado con chuño', dur:5, desc:'Al salir del horno, brillo y suavidad' }
    ],
    considerations: [
      { type:'ok', title:'✓ Miga tierna', text:'El chuño (almidón de maíz) da brillo y suavidad a la corteza.' },
      { type:'', title:'⚖ Edulcorante y azúcar', text:'4% azúcar + 1% edulcorante. Aportan color y sabor ligeramente dulce.' },
      { type:'warn', title:'⚠ Pegado por extremos', text:'Los pebetes se colocan pegados en la bandeja para que crezcan juntos y formen cadena.' }
    ],
    bpm: [
      { etapa:'Recepción harina',   peligro:'Bacillus cereus', control:'Proveedor habilitado', limite:'Fecha vigente' },
      { etapa:'Amasado',            peligro:'Contaminación', control:'Higiene', limite:'---' },
      { etapa:'Horneado',           peligro:'Supervivencia patógenos', control:'T° y tiempo', limite:'200°C, T° int ≥85°C' }
    ]
  },

  bizcochitos: {
    cat: 'clasicos',
    name: 'Bizcochitos y Cuernitos de Grasa', icon: '🥨', time: '2-3 h',
    tempHorno: '200°C',
    hidratacion: '25-30%',
    stages: [
      { name:'Mezclado', dur:10, desc:'Harina + agua + levadura + sal + grasa 40%' },
      { name:'Amasado', dur:10, desc:'Masa lisa · reposo 10 min' },
      { name:'Laminado', dur:15, desc:'Estirar 5 mm, doblar en 3, repetir' },
      { name:'Corte bizcochitos', dur:10, desc:'Pinchar y cortar círculos 3 cm' },
      { name:'Corte cuernitos', dur:10, desc:'Tiras 3×12 cm, enrollar desde extremos' },
      { name:'Reposo', dur:10, desc:'Antes de hornear' },
      { name:'Horneado', dur:12, desc:'200°C · 10-12 min · dorados y crocantes' }
    ],
    considerations: [
      { type:'ok', title:'✓ Grasa 40%', text:'La grasa es el ingrediente principal: da crocancia y sabor.' },
      { type:'warn', title:'⚠ Hidratación muy baja', text:'25-30%. Masa seca, no elástica. No amasar en exceso.' },
      { type:'', title:'🔥 Alta temperatura', text:'200°C sella la superficie y crea crocancia inmediata.' }
    ],
    bpm: [
      { etapa:'Recepción harina',   peligro:'Bacillus cereus', control:'Proveedor habilitado', limite:'Fecha vigente' },
      { etapa:'Horneado',           peligro:'Supervivencia patógenos', control:'T° y tiempo', limite:'200°C, 10-12 min' },
      { etapa:'Almacenamiento',     peligro:'Mohos', control:'Recipiente hermético', limite:'5-7 días' }
    ]
  },

  criollitos: {
    cat: 'clasicos',
    name: 'Criollitos y Galleta Criolla', icon: '🥯', time: '2-3 h',
    tempHorno: '200°C',
    hidratacion: '52%',
    stages: [
      { name:'Mezclado', dur:10, desc:'Harina + agua + levadura + sal + malta + grasa 5%' },
      { name:'Amasado', dur:15, desc:'Masa suave · 10 vueltas de palo' },
      { name:'Reposo', dur:10, desc:'Relajación del gluten' },
      { name:'Estirado y doblado', dur:15, desc:'Rectángulo 1 cm · doblar con harina dentro' },
      { name:'Corte', dur:10, desc:'Círculos incompletos 8-12 cm' },
      { name:'Leudado', dur:20, desc:'20-30 min según tamaño' },
      { name:'Horneado', dur:25, desc:'200°C · 20-30 min · hojaldrados' }
    ],
    considerations: [
      { type:'ok', title:'✓ Grasa 5%', text:'Se incorpora a la masa, no se lamina. Hojaldre rústico.' },
      { type:'', title:'⚖ Doblez con harina', text:'La harina espolvoreada dentro del doblez crea las capas características.' },
      { type:'warn', title:'⚠ Corte incompleto', text:'El círculo no se cierra: queda un "lomo" que se presiona con el pulgar.' }
    ],
    bpm: [
      { etapa:'Horneado',           peligro:'Supervivencia patógenos', control:'T° y tiempo', limite:'200°C, 20-30 min' },
      { etapa:'Almacenamiento',     peligro:'Mohos', control:'Recipiente hermético', limite:'5-7 días' }
    ]
  },

  negritos: {
    cat: 'clasicos',
    name: 'Negritos', icon: '⚫', time: '3-4 h',
    tempHorno: '220°C',
    hidratacion: '60%',
    stages: [
      { name:'Mezclado', dur:10, desc:'Harina + agua + levadura + sal + salvado + azúcar negra + miel + malta' },
      { name:'Amasado + manteca', dur:15, desc:'Incorporar manteca blanda · masa lisa y elástica' },
      { name:'Estirado y doblado', dur:10, desc:'3-4 vueltas · 1 cm grosor' },
      { name:'Corte', dur:10, desc:'Aro cortante 4 cm · 32 piezas' },
      { name:'Reposo', dur:15, desc:'Tapado' },
      { name:'Rebozado en semillas', dur:10, desc:'Doradura + sésamo, amapola, avena, lino' },
      { name:'Leudado final', dur:45, desc:'Duplicar volumen' },
      { name:'Horneado', dur:18, desc:'220°C · 15-20 min' }
    ],
    considerations: [
      { type:'ok', title:'✓ Integral enriquecido', text:'Salvado fino 10%, azúcar negra 6%, miel 2%, malta 2%, manteca 10%.' },
      { type:'', title:'⚖ Mezcla de semillas', text:'Sésamo + amapola + avena + lino en partes iguales.' },
      { type:'warn', title:'⚠ Rebozado uniforme', text:'Pintar con doradura y rebozar antes del leudado final.' }
    ],
    bpm: [
      { etapa:'Recepción semillas', peligro:'Mohos, aflatoxinas', control:'Proveedor habilitado', limite:'Fecha vigente' },
      { etapa:'Horneado',           peligro:'Supervivencia patógenos', control:'T° y tiempo', limite:'220°C, 15-20 min' }
    ]
  },

  /* ==========================================================
     CATEGORÍA: FACTURAS DE MANTECA
     ========================================================== */
  masa_manteca: {
    cat: 'manteca',
    name: 'Masa Base de Facturas de Manteca', icon: '🧈', time: '4-5 h + frío',
    tempHorno: '180°C',
    hidratacion: '55% (leche)',
    stages: [
      { name:'Mezclado base', dur:10, desc:'Leche + azúcar + sal + miel + edulcorante + vainilla + levadura' },
      { name:'Amasado + manteca', dur:20, desc:'Harina 0000 + manteca 15% · masa lisa y elástica' },
      { name:'Frío inicial', dur:60, desc:'Aplastar 1.5-2 cm · film · freezer 1 h' },
      { name:'Laminado 1', dur:15, desc:'Estirar 5 mm · empaste 40% manteca · tríptico' },
      { name:'Frío', dur:30, desc:'Film · freezer 30 min' },
      { name:'Laminado 2', dur:10, desc:'Estirar 5 mm · doblar en 3' },
      { name:'Frío final', dur:30, desc:'Listo para cortar piezas' }
    ],
    considerations: [
      { type:'ok', title:'✓ Manteca 15% + empaste 40%', text:'Total 55% de materia grasa sobre harina. Hojaldre lácteo.' },
      { type:'', title:'⚖ Leche en lugar de agua', text:'Aporta lactosa (Maillard), grasa y proteínas. Miga más tierna.' },
      { type:'warn', title:'⚠ Temperatura de trabajo', text:'Manteca 15-18°C (fría pero plástica). Masa 4-8°C entre vueltas.' }
    ],
    bpm: [
      { etapa:'Recepción manteca',  peligro:'Listeria, Salmonella', control:'Cadena de frío', limite:'T° ≤4°C' },
      { etapa:'Recepción leche',    peligro:'Listeria, E. coli', control:'Cadena de frío', limite:'T° ≤4°C' },
      { etapa:'Laminado',           peligro:'Contaminación superficie', control:'Mesas limpias', limite:'---' },
      { etapa:'Horneado',           peligro:'Supervivencia patógenos', control:'T° y tiempo', limite:'180°C, T° int ≥85°C' }
    ]
  },

  medialunas_manteca: {
    cat: 'manteca',
    name: 'Medialunas de Manteca', icon: '🥐', time: '5-6 h',
    tempHorno: '180°C',
    hidratacion: '55% (leche)',
    stages: [
      { name:'Preparar masa base', dur:60, desc:'Masa de facturas de manteca + frío' },
      { name:'Estirado y corte', dur:20, desc:'Rectángulo 4 mm · 24 triángulos 12×15 cm' },
      { name:'Enrollado', dur:20, desc:'Base arriba, cola estirada, enrollar dejando punta abajo' },
      { name:'Formado medialuna', dur:10, desc:'Estirar puntas, curvar, sellar contra placa' },
      { name:'Leudado final', dur:90, desc:'Casi duplicar · 25-28°C' },
      { name:'Horneado', dur:14, desc:'180°C · 12-15 min · doradas' },
      { name:'Pintado con almíbar', dur:5, desc:'Brillo, dulzor y suavidad' }
    ],
    considerations: [
      { type:'ok', title:'✓ Almíbar al salir', text:'Azúcar + agua + cáscara de naranja + miel. Aplica en caliente.' },
      { type:'warn', title:'⚠ No levar en exceso', text:'Casi duplicar. Si leva de más, el hojaldre se pierde.' },
      { type:'', title:'🥐 Enrollado tenso', text:'Firme pero sin apretar. Si queda flojo, se abre en el horno.' }
    ],
    bpm: [
      { etapa:'Recepción manteca',  peligro:'Listeria', control:'Cadena frío', limite:'T° ≤4°C' },
      { etapa:'Leudado',            peligro:'Crecimiento patógenos', control:'T°', limite:'25-28°C' },
      { etapa:'Horneado',           peligro:'Supervivencia', control:'T° y tiempo', limite:'180°C, 12-15 min' }
    ]
  },

  facturas_manteca_surtidas: {
    cat: 'manteca',
    name: 'Facturas de Manteca Surtidas', icon: '🍩', time: '5-6 h',
    tempHorno: '180°C',
    hidratacion: '55% (leche)',
    stages: [
      { name:'Preparar masa base', dur:60, desc:'Masa de facturas de manteca · 3 tiras' },
      { name:'Corte rectángulos', dur:15, desc:'24 rectángulos 10×5 cm' },
      { name:'Formado moños', dur:15, desc:'Torsión central + copetes membrillo/crema' },
      { name:'Formado doble vuelta', dur:10, desc:'Torsión continua + dulce de leche' },
      { name:'Formado calzones rotos', dur:10, desc:'Doblez + corte central + relleno' },
      { name:'Formado ochos', dur:10, desc:'Doblez + cierre central + crema + dulce' },
      { name:'Leudado final', dur:60, desc:'Duplicar volumen' },
      { name:'Horneado', dur:14, desc:'180°C · 12-15 min' },
      { name:'Decoración final', dur:15, desc:'Almíbar + glaseado + chocolate + coco + nueces' }
    ],
    considerations: [
      { type:'ok', title:'✓ Rellenos variados', text:'Membrillo, crema pastelera, dulce de leche repostero.' },
      { type:'', title:'⚖ Decoración final', text:'Hilos de glaseado y chocolate, coco rallado, nueces picadas.' },
      { type:'warn', title:'⚠ Formado cuidadoso', text:'Cada forma tiene su técnica. Practicar antes de producir en serie.' }
    ],
    bpm: [
      { etapa:'Recepción huevos',   peligro:'Salmonella', control:'Proveedor habilitado', limite:'Fecha vigente' },
      { etapa:'Horneado',           peligro:'Supervivencia', control:'T° y tiempo', limite:'180°C, 12-15 min' }
    ]
  },

  banda_manzana: {
    cat: 'manteca',
    name: 'Banda de Manzana y Tortitas Negras', icon: '🍎', time: '1-2 h',
    tempHorno: '180°C',
    hidratacion: 'Recortes de masa',
    stages: [
      { name:'Reunir recortes', dur:10, desc:'Superponer sin amasar · aplastar' },
      { name:'Estirado', dur:10, desc:'Rectángulo 8 mm · frío 1 h' },
      { name:'Formado banda', dur:10, desc:'Hendidura central con palo delgado' },
      { name:'Leudado', dur:45, desc:'Duplicar volumen' },
      { name:'Relleno', dur:10, desc:'Crema pastelera + rodajas de manzana verde' },
      { name:'Horneado', dur:25, desc:'180°C · 20-30 min' },
      { name:'Decoración', dur:5, desc:'Almíbar + coco rallado en los lados' },
      { name:'Formado tortitas', dur:10, desc:'Cuadrado 12×12 cm · cortar en cruz' },
      { name:'Cobertura tortitas', dur:5, desc:'Azúcar negra + blanca + harina' },
      { name:'Horneado tortitas', dur:15, desc:'180°C · 15 min' }
    ],
    considerations: [
      { type:'ok', title:'✓ Aprovechamiento total', text:'Los recortes de la masa de facturas se reutilizan. Cero desperdicio.' },
      { type:'', title:'⚖ Manzana verde', text:'Sin pelar, en rodajas muy finas. Aporta acidez y textura.' },
      { type:'warn', title:'⚠ No amasar recortes', text:'Superponer apenas. Amasar desarrolla gluten y endurece la masa.' }
    ],
    bpm: [
      { etapa:'Recortes',           peligro:'Contaminación', control:'Higiene, refrigeración', limite:'T° ≤4°C' },
      { etapa:'Horneado',           peligro:'Supervivencia', control:'T° y tiempo', limite:'180°C, 15-30 min' }
    ]
  },

  /* ==========================================================
     CATEGORÍA: FACTURAS DE GRASA
     ========================================================== */
  masa_grasa: {
    cat: 'grasa',
    name: 'Masa Base de Facturas de Grasa', icon: '🥟', time: '3 h',
    tempHorno: '220°C',
    hidratacion: '60%',
    stages: [
      { name:'Mezclado', dur:10, desc:'Harina 0000 + agua + levadura + azúcar + sal' },
      { name:'Amasado', dur:10, desc:'Masa suave y homogénea · bollo' },
      { name:'Preparar empaste', dur:10, desc:'Grasa cerdo/vacuna 20% + margarina 20% + harina 10%' },
      { name:'Estirado inicial', dur:10, desc:'Cuadrado 33×33 cm · 1 cm · con manos' },
      { name:'Untado y doblez', dur:10, desc:'Empaste en mitad · cubrir · sellar bordes' },
      { name:'Reposo', dur:20, desc:'Temperatura ambiente' },
      { name:'Estirado y reposo', dur:20, desc:'Cuadrado 33×33 · reposo 15-20 min' },
      { name:'Ovillado 1', dur:10, desc:'Enrollar, sellar, estirar 40 cm' },
      { name:'Reposo', dur:20, desc:'---' },
      { name:'Ovillado 2', dur:10, desc:'Aplastar, ovillar, estirar 60 cm' },
      { name:'Reposo', dur:20, desc:'---' },
      { name:'Ovillado 3', dur:10, desc:'Aplastar, ovillar, estirar 80 cm' },
      { name:'Reposo final', dur:20, desc:'Curvar en 3 vueltas · aceitar' },
      { name:'Corte de piezas', dur:15, desc:'Piezas de 30 g con puño cerrado' },
      { name:'Reposo piezas', dur:30, desc:'Antes de armar' }
    ],
    considerations: [
      { type:'ok', title:'✓ Grasa de alto punto de fusión', text:'40-45°C. Ideal para climas cálidos, no se derrite fácil.' },
      { type:'', title:'⚖ Empaste con harina', text:'80% grasa + 20% harina. Más fácil de laminar, textura uniforme.' },
      { type:'warn', title:'⚠ Respetar tiempos de reposo', text:'20 min entre ovillados. Sin reposo, el gluten se tensa y rompe.' }
    ],
    bpm: [
      { etapa:'Recepción grasa',    peligro:'Listeria, Salmonella', control:'Cadena de frío', limite:'T° ≤4°C' },
      { etapa:'Laminado',           peligro:'Contaminación', control:'Mesas limpias', limite:'---' },
      { etapa:'Horneado',           peligro:'Supervivencia', control:'T° y tiempo', limite:'220°C, 12-15 min' }
    ]
  },

  medialunas_grasa: {
    cat: 'grasa',
    name: 'Medialunas de Grasa', icon: '🥐', time: '3-4 h',
    tempHorno: '220°C',
    hidratacion: '60%',
    stages: [
      { name:'Preparar masa base', dur:120, desc:'Masa de facturas de grasa · 36 piezas de 30 g' },
      { name:'Estirado triangular', dur:15, desc:'Cada pieza en triángulo 12 cm de lado' },
      { name:'Ovillado', dur:20, desc:'Enrollar desde base, sellar, estirar' },
      { name:'Formado medialuna', dur:10, desc:'Curvar en semicírculo, sellar puntas' },
      { name:'Reposo', dur:30, desc:'Descanso antes de hornear' },
      { name:'Horneado', dur:14, desc:'220°C · 12-15 min · crujientes' }
    ],
    considerations: [
      { type:'ok', title:'✓ No levar demasiado', text:'Debe ser fina y crocante. Leudado corto (30 min).' },
      { type:'', title:'⚖ Estirado fino', text:'Para medialunas delgadas, estirar el cilindro con las palmas.' },
      { type:'warn', title:'⚠ Alta temperatura', text:'220°C sella la superficie y crea crocancia.' }
    ],
    bpm: [
      { etapa:'Recepción grasa',    peligro:'Listeria', control:'Cadena frío', limite:'T° ≤4°C' },
      { etapa:'Horneado',           peligro:'Supervivencia', control:'T° y tiempo', limite:'220°C, 12-15 min' }
    ]
  },

  facturas_grasa_surtidas: {
    cat: 'grasa',
    name: 'Facturas de Grasa Surtidas', icon: '🥟', time: '3-4 h',
    tempHorno: '220°C',
    hidratacion: '60%',
    stages: [
      { name:'Preparar masa base', dur:120, desc:'Masa de facturas de grasa · 36 piezas' },
      { name:'Formado santiagueras', dur:10, desc:'Bollos redondos aplastados + crema + membrillo' },
      { name:'Formado lengüitas', dur:10, desc:'Rectángulos doblados + membrillo + crema' },
      { name:'Formado vigilantes', dur:10, desc:'Cilindros largos 18 cm + azúcar' },
      { name:'Formado cielitos', dur:10, desc:'Cilindros doblados en herradura + crema' },
      { name:'Leudado', dur:30, desc:'Antes de hornear' },
      { name:'Horneado', dur:14, desc:'220°C · 12-15 min' }
    ],
    considerations: [
      { type:'ok', title:'✓ Misma masa, distintas formas', text:'Santiagueras, lengüitas, vigilantes, cielitos.' },
      { type:'', title:'⚖ Rellenos clásicos', text:'Crema pastelera, dulce de membrillo, dulce de leche.' },
      { type:'warn', title:'⚠ Azúcar antes de hornear', text:'Rociar con azúcar granulado para caramelo crujiente.' }
    ],
    bpm: [
      { etapa:'Recepción huevos',   peligro:'Salmonella', control:'Proveedor habilitado', limite:'Fecha vigente' },
      { etapa:'Horneado',           peligro:'Supervivencia', control:'T° y tiempo', limite:'220°C, 12-15 min' }
    ]
  },

  sacramentos: {
    cat: 'grasa',
    name: 'Sacramentos Rellenos', icon: '🥖', time: '3-4 h',
    tempHorno: '220°C',
    hidratacion: '60%',
    stages: [
      { name:'Preparar masa base', dur:120, desc:'Masa de facturas de grasa · 36 piezas' },
      { name:'Preparar rollitos', dur:10, desc:'Jamón + queso en tiritas enrolladas' },
      { name:'Estirado y relleno', dur:20, desc:'Triángulo + rollito en base + envolver' },
      { name:'Formado', dur:10, desc:'Enrollar, sellar, cierre abajo' },
      { name:'Leudado', dur:30, desc:'Antes de hornear' },
      { name:'Decoración', dur:5, desc:'Pintar con agua + queso rallado grueso' },
      { name:'Horneado', dur:14, desc:'220°C · 12-15 min' }
    ],
    considerations: [
      { type:'ok', title:'✓ Queso rallado rústico', text:'Parmesano rallado grueso, decoración irregular.' },
      { type:'warn', title:'⚠ Cadena de frío jamón y queso', text:'≤4°C hasta el armado. No dejar a temperatura ambiente.' },
      { type:'', title:'⚖ Cierre hacia abajo', text:'Colocar en placa con el cierre hacia abajo para que no se abra.' }
    ],
    bpm: [
      { etapa:'Recepción jamón',    peligro:'Listeria, Salmonella', control:'Cadena frío', limite:'T° ≤4°C' },
      { etapa:'Armado',             peligro:'Contaminación cruzada', control:'Higiene, utensilios', limite:'---' },
      { etapa:'Horneado',           peligro:'Supervivencia', control:'T° y tiempo', limite:'220°C, 12-15 min' }
    ]
  },

  /* ==========================================================
     CATEGORÍA: PANES REGIONALES
     ========================================================== */
  pan_campo: {
    cat: 'regionales',
    name: 'Pan de Campo', icon: '🍞', time: '3-4 h',
    tempHorno: '200°C',
    hidratacion: '52-55%',
    stages: [
      { name:'Mezclado', dur:10, desc:'Harina 000 + agua + levadura + sal + malta + grasa 5%' },
      { name:'Amasado', dur:15, desc:'Masa suave y homogénea' },
      { name:'Estirado y doblez', dur:15, desc:'10 vueltas de palo · 2 cm' },
      { name:'División y bollado', dur:10, desc:'2 bollos o cilindros · reposo 10 min' },
      { name:'Leudado final', dur:60, desc:'Duplicar volumen · sin corrientes' },
      { name:'Corte', dur:5, desc:'Cruz en bollos · 3 diagonales en cilindros' },
      { name:'Horneado', dur:22, desc:'200°C · 20-25 min' }
    ],
    considerations: [
      { type:'ok', title:'✓ Grasa 5%', text:'Bovina o porcina. Aporta suavidad y conservación.' },
      { type:'', title:'⚖ Miga compacta', text:'Hidratación baja 52-55%. Alveolos irregulares, corteza gruesa.' },
      { type:'warn', title:'⚠ Leudado sin corrientes', text:'Cubrir con film o paño. El aire reseca la superficie.' }
    ],
    bpm: [
      { etapa:'Recepción grasa',    peligro:'Listeria', control:'Cadena frío', limite:'T° ≤4°C' },
      { etapa:'Horneado',           peligro:'Supervivencia', control:'T° y tiempo', limite:'200°C, T° int ≥85°C' }
    ]
  },

  pan_chicharrones: {
    cat: 'regionales',
    name: 'Pan con Chicharrones', icon: '🥓', time: '3-4 h',
    tempHorno: '200°C',
    hidratacion: '52-55%',
    stages: [
      { name:'Preparar masa base', dur:25, desc:'Igual que pan de campo' },
      { name:'Incorporar chicharrones', dur:5, desc:'200 g junto con la grasa' },
      { name:'Amasado final', dur:10, desc:'Integrar bien' },
      { name:'División y aplastado', dur:10, desc:'2 bollos · aplastar a 2 cm' },
      { name:'Leudado', dur:60, desc:'Duplicar volumen' },
      { name:'Pinchado', dur:2, desc:'Tenedor en superficie' },
      { name:'Horneado', dur:22, desc:'200°C · 20-25 min' }
    ],
    considerations: [
      { type:'ok', title:'✓ Chicharrones 200 g', text:'Trocitos de carne y grasa fritos. Sabor intenso.' },
      { type:'', title:'⚖ Pan chato', text:'Aplastar a 2 cm de grosor. Pinchar con tenedor.' },
      { type:'warn', title:'⚠ Cadena de frío', text:'Chicharrones ≤4°C hasta el amasado.' }
    ],
    bpm: [
      { etapa:'Recepción chicharrones', peligro:'Listeria, Salmonella', control:'Cadena frío', limite:'T° ≤4°C' },
      { etapa:'Horneado',           peligro:'Supervivencia', control:'T° y tiempo', limite:'200°C, 20-25 min' }
    ]
  },

  raspadita: {
    cat: 'regionales',
    name: 'Raspadita y Tortitas Mendocinas', icon: '🫓', time: '1-2 h',
    tempHorno: '200°C',
    hidratacion: '40%',
    stages: [
      { name:'Mezclado', dur:10, desc:'Harina + agua + sal + grasa 20%' },
      { name:'Amasado', dur:15, desc:'Masa suave y homogénea' },
      { name:'Estirado y doblez', dur:10, desc:'4 vueltas de palo · reposo 10 min' },
      { name:'Formado raspadita', dur:10, desc:'3 panes chatos 18-20 cm' },
      { name:'Reposo', dur:20, desc:'Pérdida de fuerza' },
      { name:'Pinchado', dur:2, desc:'Tenedor o rodillo pinchar' },
      { name:'Horneado', dur:20, desc:'200°C · 20 min' }
    ],
    considerations: [
      { type:'ok', title:'✓ Grasa 20%', text:'Ingrediente principal. Da suavidad y sabor.' },
      { type:'', title:'⚖ Hidratación muy baja', text:'40%. Miga firme, pan chato.' },
      { type:'warn', title:'⚠ Pinchar antes de hornear', text:'Evita que se formen burbujas grandes.' }
    ],
    bpm: [
      { etapa:'Recepción grasa',    peligro:'Listeria', control:'Cadena frío', limite:'T° ≤4°C' },
      { etapa:'Horneado',           peligro:'Supervivencia', control:'T° y tiempo', limite:'200°C, 20 min' }
    ]
  },

  chipas: {
    cat: 'regionales',
    name: 'Chipas Correntinos', icon: '🧀', time: '1 h',
    tempHorno: '200°C',
    hidratacion: 'Sin gluten',
    stages: [
      { name:'Batido inicial', dur:5, desc:'Huevos + manteca blanda' },
      { name:'Incorporar quesos', dur:5, desc:'Fresco + gruyère + fontina + reggianito' },
      { name:'Incorporar fécula', dur:5, desc:'Fécula de mandioca + sal' },
      { name:'Incorporar leche', dur:3, desc:'80 ml · masa final' },
      { name:'Formado cilindros', dur:10, desc:'2.5 cm espesor · cortar 20 g' },
      { name:'Reposo', dur:10, desc:'Antes de hornear' },
      { name:'Horneado', dur:12, desc:'200°C · 10-15 min · ligera coloración' }
    ],
    considerations: [
      { type:'ok', title:'✓ Sin gluten', text:'La estructura se forma por gelatinización del almidón de mandioca.' },
      { type:'', title:'⚖ Mezcla de quesos', text:'Fresco 200 g + gruyère 100 g + fontina 200 g + reggianito 50 g.' },
      { type:'warn', title:'⚠ Colocar de pie', text:'En la bandeja, "de pie" para que crezcan hacia arriba.' }
    ],
    bpm: [
      { etapa:'Recepción quesos',   peligro:'Listeria, Salmonella', control:'Cadena frío', limite:'T° ≤4°C' },
      { etapa:'Recepción huevos',   peligro:'Salmonella', control:'Proveedor habilitado', limite:'Fecha vigente' },
      { etapa:'Horneado',           peligro:'Supervivencia', control:'T° y tiempo', limite:'200°C, 10-15 min' }
    ]
  },

  chipas_soo: {
    cat: 'regionales',
    name: 'Chipas So\'o (Rellenos)', icon: '🥟', time: '1.5 h',
    tempHorno: '200°C',
    hidratacion: 'Sin gluten',
    stages: [
      { name:'Preparar masa chipa', dur:20, desc:'Masa base de chipas · 16 piezas de 80 g' },
      { name:'Preparar relleno', dur:20, desc:'Carne + cebolla + morrones + huevos duros + aceitunas' },
      { name:'Enfriar relleno', dur:15, desc:'Antes de armar' },
      { name:'Armado', dur:15, desc:'Canastita + relleno + cerrar en bola' },
      { name:'Reposo', dur:10, desc:'Antes de hornear' },
      { name:'Horneado', dur:12, desc:'200°C · 10-15 min' }
    ],
    considerations: [
      { type:'ok', title:'✓ Plato completo', text:'Carne, verduras, huevos y aceitunas. Comida rápida.' },
      { type:'warn', title:'⚠ Cadena de frío carne', text:'≤4°C. Cocción interna ≥71°C antes de rellenar.' },
      { type:'', title:'⚖ Cierre hacia abajo', text:'Colocar con el cierre abajo para que no se abra.' }
    ],
    bpm: [
      { etapa:'Recepción carne',    peligro:'Salmonella, E. coli', control:'Cadena frío', limite:'T° ≤4°C' },
      { etapa:'Cocción carne',      peligro:'Supervivencia', control:'T° interna', limite:'≥71°C' },
      { etapa:'Armado',             peligro:'Contaminación cruzada', control:'Higiene', limite:'---' }
    ]
  },

  tortilla_santiaguenia: {
    cat: 'regionales',
    name: 'Tortilla Santiagueña', icon: '🫓', time: '1.5 h',
    tempHorno: 'Plancha/Horno 180°C',
    hidratacion: '50%',
    stages: [
      { name:'Mezclado', dur:10, desc:'Harina + agua tibia + sal + grasa 20%' },
      { name:'Amasado', dur:15, desc:'Masa dura, se despega de la mesa' },
      { name:'División y bollado', dur:10, desc:'4 bollos' },
      { name:'Reposo', dur:35, desc:'Tapados con film' },
      { name:'Estirado', dur:10, desc:'Tortillas 5 mm · pinchar' },
      { name:'Cocción', dur:15, desc:'Plancha/brasas 5-10 min por lado, o horno 180°C 15 min' }
    ],
    considerations: [
      { type:'ok', title:'✓ Cocción en plancha o brasas', text:'Marca característica. Sabor ligeramente ahumado.' },
      { type:'', title:'⚖ Masa dura', text:'No agregar agua. Amasar hasta que se despegue de la mesa.' },
      { type:'warn', title:'⚠ Calor moderado', text:'Brasas a 15 cm. Si el calor es muy fuerte, se quema por fuera y queda cruda.' }
    ],
    bpm: [
      { etapa:'Recepción grasa',    peligro:'Listeria', control:'Cadena frío', limite:'T° ≤4°C' },
      { etapa:'Cocción',            peligro:'Supervivencia', control:'T° plancha', limite:'5-10 min por lado' }
    ]
  },

  /* ==========================================================
     CATEGORÍA: PANES DE INMIGRANTES
     ========================================================== */
  ciabatta: {
    cat: 'inmigrantes',
    name: 'Ciabatta', icon: '🥖', time: '14-26 h',
    tempHorno: '220-230°C',
    hidratacion: '70-80%',
    stages: [
      { name:'Mezclado', dur:10, desc:'Harina 0000 + agua 75% + levadura + sal + malta' },
      { name:'Autólisis', dur:20, desc:'Reposo sin amasar' },
      { name:'Plegados', dur:120, desc:'4 pliegues cada 30 min · aceite de oliva' },
      { name:'Fermentación bloque', dur:90, desc:'1-2 h temperatura ambiente' },
      { name:'Fermentación frío', dur:1080, desc:'12-24 h · 4°C' },
      { name:'Atemperado', dur:60, desc:'1 h fuera de heladera' },
      { name:'Volcado y corte', dur:15, desc:'Sin desgasificar · 2 tiras alargadas' },
      { name:'Leudado final', dur:90, desc:'1-2 h sobre papel enharinado' },
      { name:'Horneado', dur:22, desc:'220-230°C con vapor · 20-25 min' }
    ],
    considerations: [
      { type:'ok', title:'✓ Alta hidratación', text:'70-80%. Harina de fuerza (12-13% proteína) obligatoria.' },
      { type:'', title:'⚖ Plegados (stretch & fold)', text:'4 pliegues cada 30 min. Desarrollan gluten sin amasado intenso.' },
      { type:'warn', title:'⚠ Manipulación mínima', text:'NO desgasificar. Cada burbuja cuenta para la miga alveolada.' }
    ],
    bpm: [
      { etapa:'Recepción harina',   peligro:'Bacillus cereus', control:'Proveedor habilitado', limite:'Fecha vigente' },
      { etapa:'Fermentación frío',  peligro:'Crecimiento patógenos', control:'T°', limite:'4°C, 12-24 h' },
      { etapa:'Horneado',           peligro:'Supervivencia', control:'T° y tiempo', limite:'220-230°C, 20-25 min' }
    ]
  },

  trenza_jale: {
    cat: 'inmigrantes',
    name: 'Trenza Clásica o Jale', icon: '🍞', time: '3-4 h',
    tempHorno: '170°C',
    hidratacion: '40%',
    stages: [
      { name:'Mezclado', dur:10, desc:'Harina 0000 + agua + levadura + huevo + azúcar + aceite + sal' },
      { name:'Amasado', dur:15, desc:'Masa lisa, con fuerza y elasticidad' },
      { name:'Reposo', dur:10, desc:'Film' },
      { name:'División y cilindros', dur:15, desc:'2 bollos · 3 tiras de 30-35 cm cada uno' },
      { name:'Trenzado', dur:10, desc:'Cruzar tiras externas sobre la del medio' },
      { name:'Doradura y semillas', dur:5, desc:'Huevo + amapola' },
      { name:'Leudado', dur:60, desc:'Duplicar volumen' },
      { name:'Horneado', dur:32, desc:'170°C · 30-35 min' }
    ],
    considerations: [
      { type:'ok', title:'✓ Tradición judía', text:'Se consume en Shabat y fiestas. Representa generosidad.' },
      { type:'', title:'⚖ Hidratación baja', text:'40%. Miga tierna pero firme.' },
      { type:'warn', title:'⚠ Doradura y amapola', text:'Pintar antes de levar. Las semillas se adhieren mejor.' }
    ],
    bpm: [
      { etapa:'Recepción huevos',   peligro:'Salmonella', control:'Proveedor habilitado', limite:'Fecha vigente' },
      { etapa:'Horneado',           peligro:'Supervivencia', control:'T° y tiempo', limite:'170°C, 30-35 min' }
    ]
  },

  pletzalaj: {
    cat: 'inmigrantes',
    name: 'Pletzalaj', icon: '🧅', time: '3-4 h',
    tempHorno: '170°C',
    hidratacion: '40%',
    stages: [
      { name:'Preparar masa base', dur:25, desc:'Masa de trenza clásica' },
      { name:'División y bollado', dur:15, desc:'24 bollitos de 40 g · reposo 10 min' },
      { name:'Estirado', dur:10, desc:'Círculos · placa enmantecada' },
      { name:'Doradura y leudado', dur:60, desc:'Duplicar volumen' },
      { name:'Cobertura', dur:10, desc:'Cebollas picadas + aceite + amapola' },
      { name:'Horneado', dur:20, desc:'170°C · 20 min' },
      { name:'Armado', dur:15, desc:'Abrir, mayonesa, pastrón+pepinos o queso+salmón' }
    ],
    considerations: [
      { type:'ok', title:'✓ Pan de cebolla ashkenazí', text:'Cobertura de cebolla picada, aceite y amapola.' },
      { type:'warn', title:'⚠ Salmón ahumado', text:'Cadena de frío ≤4°C. Consumir en 1-2 días.' },
      { type:'', title:'⚖ Pinchar centro', text:'Antes de colocar la cobertura, pinchar con tenedor.' }
    ],
    bpm: [
      { etapa:'Recepción salmón',   peligro:'Listeria, Salmonella', control:'Cadena frío', limite:'T° ≤4°C' },
      { etapa:'Horneado',           peligro:'Supervivencia', control:'T° y tiempo', limite:'170°C, 20 min' },
      { etapa:'Armado',             peligro:'Contaminación cruzada', control:'Higiene', limite:'---' }
    ]
  },

  pan_miel: {
    cat: 'inmigrantes',
    name: 'Pan con Miel', icon: '🍯', time: '4-5 h',
    tempHorno: '200°C',
    hidratacion: '64%',
    stages: [
      { name:'Preparar esponja', dur:60, desc:'Harina 0000 + levadura + agua + miel' },
      { name:'Mezclado masa', dur:15, desc:'Harinas + agua + esponja + sal + azúcar negra + miel' },
      { name:'Amasado + manteca', dur:20, desc:'Masa lisa y elástica' },
      { name:'Reposo', dur:10, desc:'---' },
      { name:'División y cilindros', dur:10, desc:'2 bollos · cilindros para molde' },
      { name:'Doradura y avena', dur:5, desc:'Pintar + rebozar' },
      { name:'Leudado en molde', dur:60, desc:'Superar borde 1 cm' },
      { name:'Horneado', dur:35, desc:'200°C · 30-40 min' }
    ],
    considerations: [
      { type:'ok', title:'✓ Esponja 1 h', text:'Mejora sabor y textura. Harina + levadura + agua + miel.' },
      { type:'', title:'⚖ Miel y azúcar negra', text:'13% miel + 10% azúcar negra. Sabor profundo.' },
      { type:'warn', title:'⚠ Leudado en molde', text:'Debe superar el borde del molde 1 cm antes de hornear.' }
    ],
    bpm: [
      { etapa:'Recepción miel',     peligro:'Mohos, Bacillus', control:'Proveedor habilitado', limite:'Fecha vigente' },
      { etapa:'Horneado',           peligro:'Supervivencia', control:'T° y tiempo', limite:'200°C, 30-40 min' }
    ]
  },

  pan_integral_nueces: {
    cat: 'inmigrantes',
    name: 'Pan Integral con Nueces y Pasas', icon: '🌰', time: '26-28 h',
    tempHorno: '180°C',
    hidratacion: '59%',
    stages: [
      { name:'Preparar esponja', dur:1440, desc:'Harina 0000 + levadura + sal + agua · 24 h' },
      { name:'Mezclado masa', dur:15, desc:'Harinas + agua + esponja + malta + sal + levadura' },
      { name:'Amasado + manteca', dur:20, desc:'Masa lisa y elástica' },
      { name:'Estirado y relleno', dur:15, desc:'Rectángulo 25×35 · nueces + pasas' },
      { name:'Arrollado y corte', dur:15, desc:'Tajadas gruesas · apilar alternando' },
      { name:'Bollado y reposo', dur:20, desc:'---' },
      { name:'Formado y corte', dur:15, desc:'3 tiras × 4 = 12 piezas 7×8 cm' },
      { name:'Leudado', dur:60, desc:'Duplicar volumen' },
      { name:'Horneado', dur:30, desc:'180°C · 25-35 min' }
    ],
    considerations: [
      { type:'ok', title:'✓ Esponja 24 h', text:'Fermentación larga. Sabor profundo y textura superior.' },
      { type:'', title:'⚖ Harina integral de centeno 25%', text:'Aporta sabor y nutrientes. Ajustar hidratación.' },
      { type:'warn', title:'⚠ Nueces y pasas', text:'Proveedor habilitado. Ausencia de moho visible.' }
    ],
    bpm: [
      { etapa:'Recepción nueces',   peligro:'Mohos, aflatoxinas', control:'Proveedor habilitado', limite:'Fecha vigente' },
      { etapa:'Recepción pasas',    peligro:'Mohos, Bacillus', control:'Proveedor habilitado', limite:'Fecha vigente' },
      { etapa:'Horneado',           peligro:'Supervivencia', control:'T° y tiempo', limite:'180°C, 25-35 min' }
    ]
  },

  pan_pinita: {
    cat: 'inmigrantes',
    name: 'Pan Piñita', icon: '🍞', time: '3-4 h',
    tempHorno: '180°C',
    hidratacion: '40%',
    stages: [
      { name:'Mezclado', dur:10, desc:'Agua + yema + sal + edulcorante + vainilla + azúcar + levadura + leche polvo + harina' },
      { name:'Amasado + manteca', dur:20, desc:'Masa lisa y elástica' },
      { name:'Estirado y doblez', dur:15, desc:'6 vueltas de palo · 2 cm' },
      { name:'Reposo', dur:10, desc:'---' },
      { name:'División y bollado', dur:15, desc:'24 piezas de 80 g · pegadas' },
      { name:'Doradura y corte', dur:5, desc:'Pintar + corte en cruz con tijera' },
      { name:'Leudado', dur:60, desc:'Duplicar volumen' },
      { name:'Horneado', dur:18, desc:'180°C · 15-20 min' }
    ],
    considerations: [
      { type:'ok', title:'✓ Pan venezolano', text:'Miga tierna, corteza suave, ligeramente dulce.' },
      { type:'', title:'⚖ Relleno sugerido', text:'Queso gruyère + jamón crudo. Ideal para sándwiches.' },
      { type:'warn', title:'⚠ Corte en cruz', text:'Con tijera, antes de levar. Da forma característica.' }
    ],
    bpm: [
      { etapa:'Recepción huevos',   peligro:'Salmonella', control:'Proveedor habilitado', limite:'Fecha vigente' },
      { etapa:'Horneado',           peligro:'Supervivencia', control:'T° y tiempo', limite:'180°C, 15-20 min' }
    ]
  },

  /* ==========================================================
     CATEGORÍA: PANES DE FIESTA
     ========================================================== */
  pastelitos: {
    cat: 'fiesta',
    name: 'Pastelitos', icon: '🥟', time: '2-3 h',
    tempHorno: 'Fritura 120°C + 180°C',
    hidratacion: '40%',
    stages: [
      { name:'Mezclado', dur:10, desc:'Harina 0000 + grasa 10% + sal + agua + vinagre' },
      { name:'Amasado y reposo', dur:25, desc:'Bollo · reposo 15 min' },
      { name:'Estirado y doblez', dur:15, desc:'6 vueltas de palo' },
      { name:'Frío', dur:30, desc:'Heladera 30 min' },
      { name:'Laminado', dur:20, desc:'Laminadora · 2 mm · margarina + maicena' },
      { name:'Doblado en paquetito', dur:15, desc:'Doblar sobre sí mismo' },
      { name:'Frío', dur:30, desc:'Heladera 30 min' },
      { name:'Estirado final', dur:10, desc:'3 mm · rectángulos 16×40 cm' },
      { name:'Corte y armado', dur:20, desc:'Cuadrados 8×8 · relleno membrillo/batata' },
      { name:'Fritura 1', dur:3, desc:'120°C · abrir hojaldre' },
      { name:'Fritura 2', dur:3, desc:'180°C · dorar' },
      { name:'Decoración', dur:5, desc:'Azúcar impalpable o almíbar' }
    ],
    considerations: [
      { type:'ok', title:'✓ Doble fritura', text:'120°C abre el hojaldre, 180°C dora y cocina. Fundamental.' },
      { type:'', title:'⚖ Laminado con maicena', text:'Margarina derretida + almidón de maíz. Capas finas.' },
      { type:'warn', title:'⚠ Vinagre en la masa', text:'1 cda. Aporta flexibilidad y evita oxidación.' }
    ],
    bpm: [
      { etapa:'Recepción grasa',    peligro:'Listeria', control:'Cadena frío', limite:'T° ≤4°C' },
      { etapa:'Recepción dulce',    peligro:'Mohos, Bacillus', control:'Proveedor habilitado', limite:'Fecha vigente' },
      { etapa:'Fritura',            peligro:'Supervivencia', control:'T°', limite:'120°C + 180°C' }
    ]
  },

  tortas_fritas: {
    cat: 'fiesta',
    name: 'Tortas Fritas', icon: '🫓', time: '1.5-2 h',
    tempHorno: 'Fritura 180°C',
    hidratacion: '40%',
    stages: [
      { name:'Preparar masa', dur:25, desc:'Masa de pastelitos sin laminar' },
      { name:'División y bollado', dur:15, desc:'Piezas de 50 g · reposo 30 min' },
      { name:'Estirado', dur:10, desc:'Discos 8 cm · pinchar' },
      { name:'Fritura', dur:6, desc:'180°C · dorar de ambos lados' },
      { name:'Decoración', dur:3, desc:'Azúcar en caliente' }
    ],
    considerations: [
      { type:'ok', title:'✓ Días de lluvia', text:'Tradición argentina. Se comen calientes, recién hechas.' },
      { type:'', title:'⚖ Masa de pastelitos', text:'Misma masa, sin laminar. Más simple.' },
      { type:'warn', title:'⚠ Grasa a 180°C', text:'Caliente pero no humeante. Si humea, está quemada.' }
    ],
    bpm: [
      { etapa:'Fritura',            peligro:'Supervivencia', control:'T°', limite:'180°C' },
      { etapa:'Almacenamiento',     peligro:'Mohos', control:'Recipiente hermético', limite:'1-2 días' }
    ]
  },

  pan_dulce: {
    cat: 'fiesta',
    name: 'Mi Pan Dulce Genovés', icon: '🎄', time: '5-7 h',
    tempHorno: '150-160°C',
    hidratacion: '50-60%',
    stages: [
      { name:'Mezclado', dur:15, desc:'Harina + agua + levadura + huevos + yemas + azúcar + miel + manteca + vainilla + limón + sal' },
      { name:'Amasado', dur:20, desc:'Masa lisa y elástica' },
      { name:'Incorporar frutas', dur:10, desc:'Pasas + nueces + almendras + cerezas + naranjas' },
      { name:'Reposo', dur:10, desc:'---' },
      { name:'División y bollado', dur:10, desc:'2 bollos' },
      { name:'Leudado', dur:120, desc:'Duplicar volumen · lugar tibio' },
      { name:'Decoración', dur:10, desc:'Clara + frutas secas + cortes en triángulo' },
      { name:'Horneado', dur:55, desc:'150-160°C · 50-60 min · T° int 76-78°C' },
      { name:'Enfriado', dur:180, desc:'Colgado boca abajo 8-12 h' },
      { name:'Decoración final', dur:5, desc:'Azúcar impalpable + cerezas + higos' }
    ],
    considerations: [
      { type:'ok', title:'✓ T° interna 76-78°C', text:'Menor que panettone por menor densidad.' },
      { type:'', title:'⚖ Frutas variadas', text:'Pasas 100 g, nueces 50 g, almendras 50 g, cerezas 50 g, naranjas 50 g.' },
      { type:'warn', title:'⚠ Horneado lento', text:'150-160°C. Baja temperatura para cocción uniforme.' }
    ],
    bpm: [
      { etapa:'Recepción huevos',   peligro:'Salmonella', control:'Proveedor habilitado', limite:'Fecha vigente' },
      { etapa:'Recepción frutas',   peligro:'Mohos, aflatoxinas', control:'Proveedor habilitado', limite:'Fecha vigente' },
      { etapa:'Horneado',           peligro:'Supervivencia', control:'T° y tiempo', limite:'150-160°C, T° int 76-78°C' }
    ]
  },

  masa_rosca: {
    cat: 'fiesta',
    name: 'Masa de Rosca, Trenza y Bollitos', icon: '🍩', time: '4-5 h',
    tempHorno: '180°C',
    hidratacion: '50-55%',
    stages: [
      { name:'Preparar esponja', dur:120, desc:'Harina 0000 + levadura + miel + leche' },
      { name:'Mezclado', dur:15, desc:'Huevo + yema + azúcar + vainilla + edulcorante + limón + sal + esponja' },
      { name:'Amasado', dur:20, desc:'Harina + gluten + levadura + leche + manteca' },
      { name:'Reposo', dur:15, desc:'Film' }
    ],
    considerations: [
      { type:'ok', title:'✓ Esponja 2 h', text:'Mejora sabor y textura. Fermentación previa.' },
      { type:'', title:'⚖ Gluten de trigo 10 g', text:'Refuerza la masa enriquecida. Esencial.' },
      { type:'warn', title:'⚠ Masa pegajosa', text:'No agregar harina hasta que la manteca se integre.' }
    ],
    bpm: [
      { etapa:'Recepción huevos',   peligro:'Salmonella', control:'Proveedor habilitado', limite:'Fecha vigente' },
      { etapa:'Recepción manteca',  peligro:'Listeria', control:'Cadena frío', limite:'T° ≤4°C' }
    ]
  },

  rosca_reyes: {
    cat: 'fiesta',
    name: 'Rosca de Reyes y de Pascua', icon: '👑', time: '4-5 h',
    tempHorno: '180°C',
    hidratacion: '50-55%',
    stages: [
      { name:'Preparar masa base', dur:180, desc:'Masa de rosca · 2 bollos' },
      { name:'Reposo', dur:25, desc:'Tapados con film' },
      { name:'Abrir agujero central', dur:10, desc:'Palo de amasar + dedos · 20 cm diámetro' },
      { name:'Formado', dur:10, desc:'Circular (Reyes) u ovalada (Pascua)' },
      { name:'Leudado', dur:60, desc:'Duplicar volumen' },
      { name:'Horneado', dur:20, desc:'180°C · 20 min' },
      { name:'Decoración', dur:10, desc:'Gel de brillo + crema pastelera + cerezas + higos' }
    ],
    considerations: [
      { type:'ok', title:'✓ Huevos de chocolate', text:'En Pascua, reemplazar huevos cocidos por huevos de chocolate.' },
      { type:'', title:'⚖ Agujero central', text:'20 cm diámetro, agujero 12 cm. Cocción uniforme.' },
      { type:'warn', title:'⚠ Gel de brillo', text:'Al salir del horno. Da brillo y protege la decoración.' }
    ],
    bpm: [
      { etapa:'Recepción huevos',   peligro:'Salmonella', control:'Proveedor habilitado', limite:'Fecha vigente' },
      { etapa:'Horneado',           peligro:'Supervivencia', control:'T° y tiempo', limite:'180°C, 20 min' }
    ]
  },

  trenza_vienesa: {
    cat: 'fiesta',
    name: 'Trenza Vienesa', icon: '🍫', time: '4-5 h',
    tempHorno: '180°C',
    hidratacion: '50-55%',
    stages: [
      { name:'Preparar masa base', dur:180, desc:'Masa de rosca · 2 bollos' },
      { name:'Preparar relleno', dur:10, desc:'Crema pastelera + coco + nueces + chocolate + limón' },
      { name:'Estirado y relleno', dur:15, desc:'Rectángulo 20×30 · relleno en 2/3' },
      { name:'Doblez y corte', dur:10, desc:'Doblar · cortar 3 tiras' },
      { name:'Trenzado', dur:10, desc:'Trenzar, sellar extremos' },
      { name:'Leudado', dur:60, desc:'Duplicar volumen' },
      { name:'Horneado', dur:28, desc:'180°C · 25-30 min' },
      { name:'Decoración', dur:10, desc:'Almíbar + almendras + chocolate blanco y negro' }
    ],
    considerations: [
      { type:'ok', title:'✓ Relleno variado', text:'Crema + coco + nueces + chocolate + ralladura de limón.' },
      { type:'', title:'⚖ Trenzado cuidadoso', text:'No apretar demasiado. El relleno puede salir.' },
      { type:'warn', title:'⚠ Hilos de chocolate', text:'Al final, con manga. Decoración profesional.' }
    ],
    bpm: [
      { etapa:'Recepción huevos',   peligro:'Salmonella', control:'Proveedor habilitado', limite:'Fecha vigente' },
      { etapa:'Horneado',           peligro:'Supervivencia', control:'T° y tiempo', limite:'180°C, 25-30 min' }
    ]
  },

  bollitos_surtidos: {
    cat: 'fiesta',
    name: 'Bollitos Surtidos (Donas, Berlinesas)', icon: '🍩', time: '4-5 h',
    tempHorno: 'Fritura 160-180°C / Horno 180°C',
    hidratacion: '50-55%',
    stages: [
      { name:'Preparar masa base', dur:180, desc:'Masa de rosca · 24 piezas de 40 g' },
      { name:'Bollado', dur:15, desc:'Piezas redondas' },
      { name:'Leudado', dur:60, desc:'Duplicar volumen' },
      { name:'Freído', dur:6, desc:'160-180°C · dorar ambos lados' },
      { name:'Rebozado', dur:5, desc:'Azúcar granulada en caliente' },
      { name:'Relleno', dur:10, desc:'Dulce de leche o crema pastelera' }
    ],
    considerations: [
      { type:'ok', title:'✓ Donas y berlinesas', text:'Donas con agujero, berlinesas rellenas.' },
      { type:'', title:'⚖ Freído a 160-180°C', text:'Si la grasa está muy caliente, se dora por fuera y queda cruda por dentro.' },
      { type:'warn', title:'⚠ Rebozar en caliente', text:'El azúcar se adhiere mejor cuando están calientes.' }
    ],
    bpm: [
      { etapa:'Freído',             peligro:'Supervivencia', control:'T°', limite:'160-180°C' },
      { etapa:'Almacenamiento',     peligro:'Mohos', control:'Recipiente hermético', limite:'2-3 días' }
    ]
  },

  pancitos_leche: {
    cat: 'fiesta',
    name: 'Pancitos de Leche y Miguelitos', icon: '🥛', time: '4-5 h',
    tempHorno: '180°C',
    hidratacion: '50-55%',
    stages: [
      { name:'Preparar masa base', dur:180, desc:'Masa de rosca · 24 bollitos' },
      { name:'Formado redondo', dur:10, desc:'Pancitos de leche · bollos' },
      { name:'Formado alargado', dur:10, desc:'Miguelitos · estibar superponiendo extremos' },
      { name:'Leudado', dur:60, desc:'Duplicar volumen' },
      { name:'Horneado', dur:18, desc:'180°C · 15-20 min' },
      { name:'Decoración', dur:10, desc:'Almíbar + crema pastelera + azúcar impalpable' }
    ],
    considerations: [
      { type:'ok', title:'✓ Pancitos de leche', text:'Redondos, con coronita de crema pastelera.' },
      { type:'', title:'⚖ Miguelitos', text:'Alargados, cortados en diagonal, rellenos de dulce de leche o crema.' },
      { type:'warn', title:'⚠ Estibar miguelitos', text:'Superponer extremos y sellar con un dedo. Forman "trencitos".' }
    ],
    bpm: [
      { etapa:'Recepción huevos',   peligro:'Salmonella', control:'Proveedor habilitado', limite:'Fecha vigente' },
      { etapa:'Horneado',           peligro:'Supervivencia', control:'T° y tiempo', limite:'180°C, 15-20 min' }
    ]
  },

  /* ==========================================================
     CATEGORÍA: PANETTONE
     ========================================================== */
  panettone_clasico: {
    cat: 'panettone',
    name: 'Panettone Clásico (LM)', icon: '🍰', time: '3-5 días',
    tempHorno: '180-200°C → 150-160°C',
    hidratacion: '65-75%',
    stages: [
      { name:'Refrescos LM', dur:240, desc:'Cada 3-4 h · 26°C · pH 4.0-4.5' },
      { name:'Primer amasado (Impasto I)', dur:25, desc:'LM + harina + agua + yemas + manteca' },
      { name:'Fermentación 1ª masa', dur:780, desc:'12-14 h · 26-28°C · x3 volumen' },
      { name:'Segundo amasado (Impasto II)', dur:35, desc:'+ harina + azúcar + miel + yemas + manteca + aromas' },
      { name:'Incorporación frutas', dur:10, desc:'Pasas + cerezas + naranjas + limones · vel. mínima' },
      { name:'Fermentación 2ª masa', dur:90, desc:'1-2 h · 26-28°C · x2 volumen' },
      { name:'Formado y molde', dur:15, desc:'Bollar · molde papel · 1 kg' },
      { name:'Leudado final', dur:300, desc:'4-6 h · 26-28°C · 85% HR · llega al borde' },
      { name:'Horneado', dur:55, desc:'180-200°C → 150-160°C · 50-60 min · T° int 94-96°C' },
      { name:'Enfriado colgado', dur:600, desc:'Boca abajo · 8-12 h' },
      { name:'Decoración y envasado', dur:15, desc:'Almendras + azúcar impalpable · film alta barrera' }
    ],
    considerations: [
      { type:'ok', title:'✓ Lievito Madre activo', text:'3 refrescos + bagnetto. Debe triplicar en 3-4 h.' },
      { type:'warn', title:'⚠ T° masa crítica', text:'1ª masa 26°C, 2ª masa 28°C. Si supera 30°C, la manteca se funde.' },
      { type:'', title:'⚖ Incorporación gradual', text:'Azúcar en 3 tandas. Manteca pomada en 3 tandas. Yemas en 2-3 tandas.' },
      { type:'', title:'🔥 Horneado y volteo', text:'165-170°C · T int 94°C. Voltear boca abajo inmediatamente.' },
      { type:'', title:'⏰ Envejecimiento', text:'Mínimo 24 h antes de consumir. Ideal 48-72 h.' }
    ],
    bpm: [
      { etapa:'Recepción harina',   peligro:'Bacillus cereus, mohos', control:'Proveedor habilitado', limite:'Fecha vigente' },
      { etapa:'Recepción huevos',   peligro:'Salmonella', control:'Proveedor habilitado', limite:'Fecha vigente, T° ≤4°C' },
      { etapa:'Recepción manteca',  peligro:'Listeria, Salmonella', control:'Cadena frío', limite:'T° ≤4°C' },
      { etapa:'Control LM',         peligro:'Desequilibrio microbiano', control:'pH, acidez, volumen', limite:'pH 4.0-4.5' },
      { etapa:'Horneado',           peligro:'Supervivencia patógenos', control:'T° y tiempo', limite:'T° int 94-96°C' },
      { etapa:'Enfriado',           peligro:'Mohos', control:'Colgado boca abajo', limite:'T° ≤30°C antes de envasar' },
      { etapa:'Envasado',           peligro:'Mohos, bacterias', control:'Envase hermético', limite:'Sin fugas' }
    ]
  },

  panettone_moderno: {
    cat: 'panettone',
    name: 'Panettone Moderno (Biga)', icon: '🍰', time: '1-2 días',
    tempHorno: '180-200°C → 150-160°C',
    hidratacion: '65-75%',
    stages: [
      { name:'Preparar Biga', dur:15, desc:'Harina + agua + levadura · 50-60% hidratación' },
      { name:'Fermentación Biga', dur:1080, desc:'12-24 h · 18-20°C · duplica o triplica' },
      { name:'Mezclado masa final', dur:15, desc:'Biga + harina + azúcar + miel + yemas' },
      { name:'Amasado + manteca', dur:25, desc:'Manteca pomada gradual · masa lisa' },
      { name:'Incorporar frutas', dur:10, desc:'Pasas + cerezas + naranjas + limones' },
      { name:'Fermentación', dur:90, desc:'1-2 h · 26-28°C · x2 volumen' },
      { name:'Formado y molde', dur:15, desc:'Bollar · molde papel · 1 kg' },
      { name:'Leudado final', dur:300, desc:'4-6 h · 26-28°C · llega al borde' },
      { name:'Horneado', dur:55, desc:'180-200°C → 150-160°C · 50-60 min · T° int 94-96°C' },
      { name:'Enfriado colgado', dur:600, desc:'Boca abajo · 8-12 h' },
      { name:'Decoración y envasado', dur:15, desc:'Almendras + azúcar impalpable · film alta barrera' }
    ],
    considerations: [
      { type:'ok', title:'✓ Biga 12-24 h', text:'Prefermento italiano con levadura comercial. Más fácil que LM.' },
      { type:'', title:'⚖ Sabor menos complejo', text:'Que el clásico, pero excelente textura y miga alveolada.' },
      { type:'warn', title:'⚠ Vida útil más corta', text:'1-2 semanas vs. 2-4 semanas del clásico.' },
      { type:'', title:'⏰ Sin mantenimiento', text:'No requiere LM activo. Ideal para principiantes.' }
    ],
    bpm: [
      { etapa:'Recepción harina',   peligro:'Bacillus cereus, mohos', control:'Proveedor habilitado', limite:'Fecha vigente' },
      { etapa:'Recepción huevos',   peligro:'Salmonella', control:'Proveedor habilitado', limite:'Fecha vigente, T° ≤4°C' },
      { etapa:'Fermentación Biga',  peligro:'Crecimiento patógenos', control:'T° y tiempo', limite:'18-20°C, 12-24 h' },
      { etapa:'Horneado',           peligro:'Supervivencia patógenos', control:'T° y tiempo', limite:'T° int 94-96°C' },
      { etapa:'Enfriado',           peligro:'Mohos', control:'Colgado boca abajo', limite:'T° ≤30°C antes de envasar' }
    ]
  },

  /* ==========================================================
     CATEGORÍA: RECETAS BASE
     ========================================================== */
  crema_pastelera: {
    cat: 'bases',
    name: 'Crema Pastelera', icon: '🍮', time: '30 min',
    tempHorno: 'Cocción 85°C',
    hidratacion: '---',
    stages: [
      { name:'Batir yemas + azúcar', dur:5, desc:'Hasta blanquear' },
      { name:'Agregar almidón', dur:3, desc:'Maicena · integrar' },
      { name:'Calentar leche', dur:5, desc:'Con vainilla · punto de ebullición' },
      { name:'Temperar', dur:5, desc:'Agregar leche caliente a la mezcla de yemas' },
      { name:'Cocinar', dur:10, desc:'Fuego medio · Revolver hasta espesar · 85°C' },
      { name:'Enfriar', dur:15, desc:'Film en contacto · heladera' }
    ],
    considerations: [
      { type:'ok', title:'✓ T° 85°C', text:'Pasteurización de la yema. No hervir para no cortar la crema.' },
      { type:'', title:'⚖ Film en contacto', text:'Evita que se forme costra en la superficie.' },
      { type:'warn', title:'⚠ Cadena de frío', text:'≤4°C. Consumir en 2-3 días.' }
    ],
    bpm: [
      { etapa:'Recepción huevos',   peligro:'Salmonella', control:'Proveedor habilitado', limite:'Fecha vigente' },
      { etapa:'Cocción',            peligro:'Supervivencia', control:'T°', limite:'85°C' },
      { etapa:'Almacenamiento',     peligro:'Mohos, bacterias', control:'Refrigeración', limite:'T° ≤4°C, 2-3 días' }
    ]
  },

  chuno: {
    cat: 'bases',
    name: 'Chuño (Pintura)', icon: '🖌️', time: '10 min',
    tempHorno: '---',
    hidratacion: '---',
    stages: [
      { name:'Mezclar', dur:5, desc:'Almidón de maíz + agua' },
      { name:'Cocinar', dur:5, desc:'Fuego medio · Revolver hasta espesar' },
      { name:'Enfriar', dur:5, desc:'Antes de usar' }
    ],
    considerations: [
      { type:'ok', title:'✓ Brillo y suavidad', text:'Se aplica al salir del horno. Da brillo a pebetes y chips.' },
      { type:'', title:'⚖ Proporción', text:'1 parte de almidón + 4 partes de agua.' },
      { type:'warn', title:'⚠ Aplicar caliente', text:'Sobre los panes recién salidos del horno.' }
    ],
    bpm: [
      { etapa:'Preparación',        peligro:'Contaminación', control:'Higiene', limite:'---' }
    ]
  },

  doradura: {
    cat: 'bases',
    name: 'Doradura', icon: '🥚', time: '5 min',
    tempHorno: '---',
    hidratacion: '---',
    stages: [
      { name:'Batir', dur:5, desc:'Huevo + agua · batir ligeramente' }
    ],
    considerations: [
      { type:'ok', title:'✓ Brillo dorado', text:'Se aplica antes de hornear. Da color y brillo a la corteza.' },
      { type:'', title:'⚖ Proporción', text:'1 huevo + 1 cda de agua.' },
      { type:'warn', title:'⚠ Huevo fresco', text:'Cadena de frío ≤4°C. Consumir el mismo día.' }
    ],
    bpm: [
      { etapa:'Recepción huevos',   peligro:'Salmonella', control:'Proveedor habilitado', limite:'Fecha vigente' },
      { etapa:'Preparación',        peligro:'Contaminación', control:'Higiene', limite:'---' }
    ]
  },

  almibar: {
    cat: 'bases',
    name: 'Almíbar', icon: '🍯', time: '15 min',
    tempHorno: 'Cocción 105°C',
    hidratacion: '---',
    stages: [
      { name:'Mezclar', dur:2, desc:'Azúcar + agua + cáscara de naranja + miel' },
      { name:'Hervir', dur:10, desc:'Fuego medio · 5-10 min · 105°C' },
      { name:'Enfriar', dur:5, desc:'Antes de usar' }
    ],
    considerations: [
      { type:'ok', title:'✓ Brillo y dulzor', text:'Se aplica al salir del horno. Da brillo a facturas y roscas.' },
      { type:'', title:'⚖ Proporción', text:'200 g azúcar + 200 ml agua + cáscara naranja + 1 cda miel.' },
      { type:'warn', title:'⚠ No cristalizar', text:'Agregar unas gotas de limón para evitar cristalización.' }
    ],
    bpm: [
      { etapa:'Preparación',        peligro:'Contaminación', control:'Higiene', limite:'---' }
    ]
  },

  glase: {
    cat: 'bases',
    name: 'Glasé', icon: '❄️', time: '5 min',
    tempHorno: '---',
    hidratacion: '---',
    stages: [
      { name:'Mezclar', dur:3, desc:'Azúcar impalpable + agua o limón' },
      { name:'Ajustar', dur:2, desc:'Consistencia para hilos' }
    ],
    considerations: [
      { type:'ok', title:'✓ Decoración', text:'Hilos sobre facturas, roscas y pan dulce.' },
      { type:'', title:'⚖ Proporción', text:'200 g azúcar impalpable + 2-3 cdas de líquido.' },
      { type:'warn', title:'⚠ Consistencia', text:'Ni muy líquido ni muy espeso. Prueba con cuchara.' }
    ],
    bpm: [
      { etapa:'Preparación',        peligro:'Contaminación', control:'Higiene', limite:'---' }
    ]
  }
};

/* ============================================================
   TABLAS DE REFERENCIA
   ============================================================ */
const REFERENCIAS = {
  temperaturas: [
    { producto:'Pan de molde / enriquecido', horno:'175°C', interna:'85-88°C', tiempo:'30-40 min' },
    { producto:'Centeno', horno:'190°C', interna:'88-90°C', tiempo:'45-60 min' },
    { producto:'Integral', horno:'205°C', interna:'90-93°C', tiempo:'40-50 min' },
    { producto:'Baguette / flauta', horno:'230°C', interna:'95-96°C', tiempo:'18-22 min' },
    { producto:'Pan de campo (MM)', horno:'250→230°C', interna:'96°C', tiempo:'40-50 min' },
    { producto:'Ciabatta', horno:'245°C', interna:'95°C', tiempo:'25-30 min' },
    { producto:'Panettone', horno:'165-170°C', interna:'94°C', tiempo:'45-55 min' },
    { producto:'Pan dulce', horno:'150-160°C', interna:'76-78°C', tiempo:'50-60 min' },
    { producto:'Brioche', horno:'180°C', interna:'88-90°C', tiempo:'25-35 min' },
    { producto:'Facturas', horno:'200°C', interna:'—', tiempo:'12-15 min' },
    { producto:'Pizza', horno:'280-320°C', interna:'—', tiempo:'5-8 min' }
  ],
  levaduras: [
    { tipo:'Fresca prensada', equivalencia:'100%', uso:'15-20 g (panes); 30-40 g (enriquecidos)' },
    { tipo:'Seca activa', equivalencia:'40-50% de la fresca', uso:'5-7 g' },
    { tipo:'Seca instantánea', equivalencia:'33% de la fresca', uso:'3-5 g' },
    { tipo:'Osmotolerante', equivalencia:'—', uso:'10-15 g (masas >15% azúcar)' }
  ],
  reglas_oro: [
    { regla:'×2 / 9°C', aplicacion:'Por cada 9°C menos, el tiempo de fermentación se duplica.' },
    { regla:'TDM 24-26°C', aplicacion:'Temperatura final de masa ideal para panes directos.' },
    { regla:'Sal 1.8-2.2%', aplicacion:'Rango de equilibrio. Por debajo: masa débil. Por encima: fermentación lenta.' },
    { regla:'Prueba del dedo', aplicacion:'Recuperación lenta con marca = listo. Rápida = subfermentado. Sin recuperación = sobrefermentado.' },
    { regla:'Prueba de membrana', aplicacion:'Estirar masa hasta ver lámina translúcida sin romperse = gluten desarrollado.' },
    { regla:'Volteo panettone', aplicacion:'Inmediato al salir del horno, boca abajo, 10-12 h.' }
  ]
};

/* Exportar para uso en módulos (opcional) */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CATEGORIAS, PROCESOS, REFERENCIAS };
}