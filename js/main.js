/* ============================================================
   GESTORÍA SONIA — JavaScript principal
   ============================================================ */

// ── Número de WhatsApp ────────────────────────────────────────
// IMPORTANTE: reemplazar con el número real (formato: 54 + código area sin 0 + número)
const WA_NUMBER = '5493764000000';
const WA_BASE   = `https://wa.me/${WA_NUMBER}`;

// ── Datos de ejemplo — Autos ──────────────────────────────────
// Para agregar un auto real: copiar un objeto del array y completar los campos.
// Para usar imagen propia: poner la ruta relativa en "imagen", ej: "img/autos/hilux.jpg"
const AUTOS = [
  {
    id: 1,
    nombre: 'Toyota Hilux',
    version: 'SRV 4x4 AT',
    año: 2021,
    km: '38.000',
    precio: '$ 14.500.000',
    moneda: 'ARS',
    tipo: 'pickup',
    combustible: 'Diésel',
    transmision: 'Automática',
    color: 'Blanco',
    estado: 'venta',
    imagen: null,
    descripcion: 'Excelente estado, full equipo, airbags, control de crucero. Única dueña.'
  },
  {
    id: 2,
    nombre: 'Volkswagen Amarok',
    version: 'Highline V6',
    año: 2020,
    km: '55.000',
    precio: '$ 13.200.000',
    moneda: 'ARS',
    tipo: 'pickup',
    combustible: 'Diésel',
    transmision: 'Automática',
    color: 'Gris Oscuro',
    estado: 'venta',
    imagen: null,
    descripcion: 'Motor V6, techo corredizo, tapizado cuero. Revisión completa realizada.'
  },
  {
    id: 3,
    nombre: 'Ford Ranger',
    version: 'XLS 4x2 MT',
    año: 2019,
    km: '78.000',
    precio: '$ 8.900.000',
    moneda: 'ARS',
    tipo: 'pickup',
    combustible: 'Diésel',
    transmision: 'Manual',
    color: 'Rojo',
    estado: 'venta',
    imagen: null,
    descripcion: 'Muy buen estado general. Ideal trabajo en zona rural.'
  },
  {
    id: 4,
    nombre: 'Chevrolet S10',
    version: 'LTZ 4x4 AT',
    año: 2022,
    km: '22.000',
    precio: '$ 16.000.000',
    moneda: 'ARS',
    tipo: 'pickup',
    combustible: 'Diésel',
    transmision: 'Automática',
    color: 'Negro',
    estado: 'reserva',
    imagen: null,
    descripcion: 'Como nuevo, todos los servicios en concesionaria. Garantía vigente.'
  },
  {
    id: 5,
    nombre: 'Toyota Corolla',
    version: 'XEi CVT',
    año: 2023,
    km: '12.000',
    precio: '$ 11.800.000',
    moneda: 'ARS',
    tipo: 'sedan',
    combustible: 'Nafta',
    transmision: 'CVT',
    color: 'Plata',
    estado: 'venta',
    imagen: null,
    descripcion: 'Impecable. Full equipo, cámara de retroceso, pantalla táctil.'
  },
  {
    id: 6,
    nombre: 'Renault Duster',
    version: 'Oroch Dynamique',
    año: 2020,
    km: '61.000',
    precio: '$ 7.400.000',
    moneda: 'ARS',
    tipo: 'pickup',
    combustible: 'Nafta',
    transmision: 'Manual',
    color: 'Naranja',
    estado: 'venta',
    imagen: null,
    descripcion: 'Neumáticos nuevos, dirección hidráulica, airbags frontales.'
  },
];

// ── Datos de ejemplo — Inmuebles ──────────────────────────────
const INMUEBLES = [
  {
    id: 1,
    nombre: 'Casa familiar en barrio residencial',
    localidad: 'Jardín América',
    tipo: 'casa',
    operacion: 'venta',
    precio: '$ 35.000.000',
    moneda: 'ARS',
    dormitorios: 3,
    baños: 2,
    m2: 120,
    m2terreno: 400,
    imagen: null,
    descripcion: 'Amplia casa de tres dormitorios, garage, jardín, quincho. Zona tranquila a pocas cuadras del centro.'
  },
  {
    id: 2,
    nombre: 'Departamento 2 ambientes',
    localidad: 'Jardín América',
    tipo: 'departamento',
    operacion: 'alquiler',
    precio: '$ 120.000 / mes',
    moneda: 'ARS',
    dormitorios: 1,
    baños: 1,
    m2: 48,
    m2terreno: null,
    imagen: null,
    descripcion: 'Primer piso, luminoso, cocina equipada, balcón. Muy bien ubicado.'
  },
  {
    id: 3,
    nombre: 'Lote en barrio privado',
    localidad: 'Jardín América',
    tipo: 'lote',
    operacion: 'venta',
    precio: '$ 8.500.000',
    moneda: 'ARS',
    dormitorios: null,
    baños: null,
    m2: null,
    m2terreno: 600,
    imagen: null,
    descripcion: 'Lote en barrio cerrado con acceso controlado. Todos los servicios. Escritura lista.'
  },
  {
    id: 4,
    nombre: 'Casa con pileta',
    localidad: 'Jardín América',
    tipo: 'casa',
    operacion: 'alquiler',
    precio: '$ 220.000 / mes',
    moneda: 'ARS',
    dormitorios: 4,
    baños: 2,
    m2: 180,
    m2terreno: 800,
    imagen: null,
    descripcion: 'Casa grande ideal para familia numerosa. Pileta, galería, garage doble.'
  },
  {
    id: 5,
    nombre: 'Local comercial sobre avenida',
    localidad: 'Jardín América',
    tipo: 'local',
    operacion: 'alquiler',
    precio: '$ 180.000 / mes',
    moneda: 'ARS',
    dormitorios: null,
    baños: 1,
    m2: 80,
    m2terreno: null,
    imagen: null,
    descripcion: 'Excelente ubicación sobre Av. principal, vidriera grande, baño, depósito.'
  },
  {
    id: 6,
    nombre: 'Casa a estrenar',
    localidad: 'Jardín América',
    tipo: 'casa',
    operacion: 'venta',
    precio: '$ 52.000.000',
    moneda: 'ARS',
    dormitorios: 3,
    baños: 2,
    m2: 160,
    m2terreno: 500,
    imagen: null,
    descripcion: 'Construcción moderna, aberturas de aluminio, pisos de porcelanato. Nunca habitada.'
  },
];

// ── Utilidades ────────────────────────────────────────────────
function waLink(msg) {
  return `${WA_BASE}?text=${encodeURIComponent(msg)}`;
}

function badgeLabel(estado) {
  const map = {
    venta:    ['badge-venta',    'En Venta'],
    reserva:  ['badge-reserva',  'Reservado'],
    vendido:  ['badge-vendido',  'Vendido'],
    alquiler: ['badge-alquiler', 'En Alquiler'],
    alquilado:['badge-alquilado','Alquilado'],
  };
  return map[estado] || ['badge-venta', estado];
}

// ── Render de tarjetas de autos ───────────────────────────────
function renderCarCard(auto) {
  const [badgeClass, badgeText] = badgeLabel(auto.estado);
  const imgHtml = auto.imagen
    ? `<img src="${auto.imagen}" alt="${auto.nombre}" loading="lazy">`
    : `<span class="placeholder-icon">🚗</span>`;

  const waMsg = `Hola, vi la publicación del ${auto.nombre} ${auto.version} (${auto.año}) y me gustaría más información.`;

  return `
  <article class="car-card" data-tipo="${auto.tipo}" data-estado="${auto.estado}" data-año="${auto.año}">
    <div class="car-card-img">
      ${imgHtml}
      <span class="badge ${badgeClass}">${badgeText}</span>
    </div>
    <div class="car-card-body">
      <h3>${auto.nombre}</h3>
      <p class="car-card-sub">${auto.version} · ${auto.año} · ${auto.color}</p>
      <div class="car-card-specs">
        <span class="car-spec">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ${auto.km} km
        </span>
        <span class="car-spec">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3A1 1 0 006 17h12M10 21a1 1 0 100-2 1 1 0 000 2zM21 21a1 1 0 100-2 1 1 0 000 2z"/></svg>
          ${auto.combustible}
        </span>
        <span class="car-spec">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          ${auto.transmision}
        </span>
      </div>
      <p class="car-card-price">${auto.precio} <small>${auto.moneda}</small></p>
      <div class="car-card-footer">
        <a href="${waLink(waMsg)}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">Consultar</a>
        <button class="btn btn-dark btn-sm" onclick="verDetalle('auto', ${auto.id})">Ver más</button>
      </div>
    </div>
  </article>`;
}

// ── Render de tarjetas de inmuebles ───────────────────────────
function renderPropCard(prop) {
  const [badgeClass, badgeText] = badgeLabel(prop.operacion);
  const imgHtml = prop.imagen
    ? `<img src="${prop.imagen}" alt="${prop.nombre}" loading="lazy">`
    : `<span class="placeholder-icon">🏠</span>`;

  const waMsg = `Hola, vi la publicación "${prop.nombre}" en ${prop.localidad} y me gustaría más información.`;

  const featuresHtml = [
    prop.dormitorios != null ? `<span class="prop-feat">🛏 ${prop.dormitorios} dorm.</span>` : '',
    prop.baños != null       ? `<span class="prop-feat">🚿 ${prop.baños} baño${prop.baños > 1 ? 's' : ''}</span>` : '',
    prop.m2 != null          ? `<span class="prop-feat">📐 ${prop.m2} m²</span>` : '',
    prop.m2terreno != null   ? `<span class="prop-feat">🌳 ${prop.m2terreno} m² terreno</span>` : '',
  ].filter(Boolean).join('');

  return `
  <article class="prop-card" data-tipo="${prop.tipo}" data-operacion="${prop.operacion}">
    <div class="prop-card-img">
      ${imgHtml}
      <span class="badge ${badgeClass}">${badgeText}</span>
    </div>
    <div class="prop-card-body">
      <h3>${prop.nombre}</h3>
      <p class="prop-location">📍 ${prop.localidad}</p>
      <div class="prop-features">${featuresHtml}</div>
      <p class="prop-card-price">${prop.precio} <small>${prop.moneda}</small></p>
      <div class="prop-card-footer">
        <a href="${waLink(waMsg)}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">Consultar</a>
        <button class="btn btn-dark btn-sm" onclick="verDetalle('inmueble', ${prop.id})">Ver más</button>
      </div>
    </div>
  </article>`;
}

// ── Detalle (modal simple) ─────────────────────────────────────
function verDetalle(tipo, id) {
  const item = tipo === 'auto'
    ? AUTOS.find(a => a.id === id)
    : INMUEBLES.find(p => p.id === id);
  if (!item) return;

  const titulo = tipo === 'auto'
    ? `${item.nombre} ${item.version} ${item.año}`
    : item.nombre;

  const waMsg = tipo === 'auto'
    ? `Hola, me interesa el ${item.nombre} ${item.version} (${item.año}). ¿Podría darme más detalles?`
    : `Hola, me interesa la propiedad "${item.nombre}" en ${item.localidad}. ¿Podría darme más detalles?`;

  const detalles = tipo === 'auto'
    ? `<p><strong>Versión:</strong> ${item.version}</p>
       <p><strong>Año:</strong> ${item.año}</p>
       <p><strong>Kilometraje:</strong> ${item.km} km</p>
       <p><strong>Combustible:</strong> ${item.combustible}</p>
       <p><strong>Transmisión:</strong> ${item.transmision}</p>
       <p><strong>Color:</strong> ${item.color}</p>`
    : `<p><strong>Localidad:</strong> ${item.localidad}</p>
       <p><strong>Tipo:</strong> ${item.tipo}</p>
       ${item.dormitorios != null ? `<p><strong>Dormitorios:</strong> ${item.dormitorios}</p>` : ''}
       ${item.baños != null ? `<p><strong>Baños:</strong> ${item.baños}</p>` : ''}
       ${item.m2 != null ? `<p><strong>Superficie:</strong> ${item.m2} m²</p>` : ''}
       ${item.m2terreno != null ? `<p><strong>Terreno:</strong> ${item.m2terreno} m²</p>` : ''}`;

  const modal = document.createElement('div');
  modal.style.cssText = `
    position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.7);
    display:flex;align-items:center;justify-content:center;padding:20px;
  `;
  modal.innerHTML = `
    <div style="background:#fff;border-radius:8px;max-width:520px;width:100%;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.4);">
      <div style="background:#111;padding:20px 24px;display:flex;justify-content:space-between;align-items:center;">
        <h3 style="color:#fff;font-size:15px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;">${titulo}</h3>
        <button onclick="this.closest('[style]').remove()" style="background:none;border:none;color:#fff;font-size:22px;cursor:pointer;line-height:1;">×</button>
      </div>
      <div style="padding:24px;">
        <p style="font-size:22px;font-weight:900;margin-bottom:16px;">${item.precio}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;font-size:13px;">
          ${detalles}
        </div>
        <p style="font-size:14px;color:#555;line-height:1.6;margin-bottom:24px;">${item.descripcion}</p>
        <a href="${waLink(waMsg)}" target="_blank" rel="noopener"
           style="display:flex;align-items:center;justify-content:center;gap:8px;background:#25d366;color:#fff;font-weight:700;font-size:13px;letter-spacing:1px;text-transform:uppercase;padding:14px;border-radius:6px;text-decoration:none;">
          💬 Consultar por WhatsApp
        </a>
      </div>
    </div>`;
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}

// ── Filtros de autos ──────────────────────────────────────────
function initAutoFilters() {
  const grid = document.getElementById('autos-grid');
  if (!grid) return;

  // Renderizar todos al inicio
  grid.innerHTML = AUTOS.map(renderCarCard).join('');
  actualizarContadorAutos(AUTOS.length);

  ['filtro-tipo-auto', 'filtro-estado-auto', 'filtro-año-auto'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', filtrarAutos);
  });
}

function filtrarAutos() {
  const tipo   = document.getElementById('filtro-tipo-auto')?.value   || '';
  const estado = document.getElementById('filtro-estado-auto')?.value || '';
  const año    = document.getElementById('filtro-año-auto')?.value    || '';

  const filtrados = AUTOS.filter(a => {
    if (tipo   && a.tipo   !== tipo)   return false;
    if (estado && a.estado !== estado) return false;
    if (año) {
      const añoN = parseInt(año);
      if (a.año < añoN) return false;
    }
    return true;
  });

  const grid = document.getElementById('autos-grid');
  if (!grid) return;
  grid.innerHTML = filtrados.length
    ? filtrados.map(renderCarCard).join('')
    : '<div class="no-results"><p>No se encontraron vehículos con esos filtros.</p></div>';

  actualizarContadorAutos(filtrados.length);
}

function actualizarContadorAutos(n) {
  const el = document.getElementById('autos-count');
  if (el) el.textContent = `${n} vehículo${n !== 1 ? 's' : ''}`;
}

// ── Filtros de inmuebles ───────────────────────────────────────
function initPropFilters() {
  const grid = document.getElementById('inmuebles-grid');
  if (!grid) return;

  grid.innerHTML = INMUEBLES.map(renderPropCard).join('');
  actualizarContadorInmuebles(INMUEBLES.length);

  ['filtro-operacion', 'filtro-tipo-prop'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', filtrarInmuebles);
  });
}

function filtrarInmuebles() {
  const operacion = document.getElementById('filtro-operacion')?.value || '';
  const tipo      = document.getElementById('filtro-tipo-prop')?.value  || '';

  const filtrados = INMUEBLES.filter(p => {
    if (operacion && p.operacion !== operacion) return false;
    if (tipo      && p.tipo      !== tipo)      return false;
    return true;
  });

  const grid = document.getElementById('inmuebles-grid');
  if (!grid) return;
  grid.innerHTML = filtrados.length
    ? filtrados.map(renderPropCard).join('')
    : '<div class="no-results"><p>No se encontraron propiedades con esos filtros.</p></div>';

  actualizarContadorInmuebles(filtrados.length);
}

function actualizarContadorInmuebles(n) {
  const el = document.getElementById('inmuebles-count');
  if (el) el.textContent = `${n} propiedad${n !== 1 ? 'es' : ''}`;
}

// ── Home: destacados ──────────────────────────────────────────
function initHomeDestacados() {
  const autosEl = document.getElementById('home-autos');
  const propsEl = document.getElementById('home-inmuebles');

  if (autosEl) {
    autosEl.innerHTML = AUTOS.slice(0, 3).map(renderCarCard).join('');
  }
  if (propsEl) {
    propsEl.innerHTML = INMUEBLES.slice(0, 3).map(renderPropCard).join('');
  }
}

// ── Navbar hamburger ──────────────────────────────────────────
function initNavbar() {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }

  // Marcar enlace activo
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// ── Formulario de contacto ─────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre   = form.nombre.value.trim();
    const telefono = form.telefono.value.trim();
    const asunto   = form.asunto.value;
    const mensaje  = form.mensaje.value.trim();

    const text = `Hola, soy ${nombre}${telefono ? ` (tel: ${telefono})` : ''}.\nAsunto: ${asunto}\n${mensaje}`;
    window.open(waLink(text), '_blank');
  });
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHomeDestacados();
  initAutoFilters();
  initPropFilters();
  initContactForm();
});
