/* ============================================================
   GESTORIA SONIA - JavaScript principal
   ============================================================ */

const WA_NUMBER = '543743668039';
const WA_BASE = `https://wa.me/${WA_NUMBER}`;

const AUTOS = [
  {
    id: 1,
    marca: 'Volkswagen',
    modelo: 'Saveiro',
    nombre: 'Volkswagen Saveiro',
    version: '1.9 SD',
    anio: 2007,
    km: null,
    precio: '$ 9.000.000',
    moneda: 'ARS',
    tipo: 'pickup',
    combustible: 'Diesel',
    transmision: 'Manual',
    color: 'Plata',
    puertas: 2,
    motor: '1.9',
    direccion: 'Hidraulica',
    traccion: 'Delantera',
    cabina: 'Simple',
    estado: 'venta',
    ubicacion: 'Jardin America, Misiones',
    imagen: 'img/autos/saveiro/saveiro-06.jpg',
    fotos: [
      'img/autos/saveiro/saveiro-06.jpg',
      'img/autos/saveiro/saveiro-04.jpg',
      'img/autos/saveiro/saveiro-02.jpg',
      'img/autos/saveiro/saveiro-03.jpg',
      'img/autos/saveiro/saveiro-05.jpg',
      'img/autos/saveiro/saveiro-01.jpg'
    ],
    descripcion:
      'Saveiro diesel 1.9 modelo 2007. Motor funcionando, papeles al dia y detalles visibles en chapa. El precio es charlable y la publicacion corresponde a una unidad real disponible hoy.',
    destacados: [
      { icon: 'paint', label: 'Color', value: 'Plata' },
      { icon: 'fuel', label: 'Combustible', value: 'Diesel' },
      { icon: 'door', label: 'Puertas', value: '2' },
      { icon: 'engine', label: 'Motor', value: '1.9' }
    ],
    resumenCompra: [
      'Papeles al dia',
      'Vende el titular',
      'Motor funcionando',
      'Detalles en chapa'
    ],
    caracteristicas: {
      principales: [
        ['Marca', 'Volkswagen'],
        ['Modelo', 'Saveiro'],
        ['Ano', '2007'],
        ['Version', '1.9 SD'],
        ['Color', 'Plata'],
        ['Tipo de combustible', 'Diesel'],
        ['Puertas', '2'],
        ['Kilometros', 'No informado']
      ],
      general: [
        ['Motor', '1.9 diesel'],
        ['Caja', 'Manual de 5 velocidades'],
        ['Direccion', 'Hidraulica'],
        ['Traccion', 'Delantera'],
        ['Cabina', 'Simple']
      ],
      compra: [
        ['Papeles al dia', 'Si'],
        ['Titular vende', 'Si'],
        ['Estado mecanico', 'Motor funcionando'],
        ['Chapa', 'Con detalles'],
        ['Precio', 'Charlable']
      ]
    }
  }
];

const INMUEBLES = [
  {
    id: 1,
    nombre: 'Terreno en esquina en Lomas de Jardin',
    localidad: 'Barrio Lomas de Jardin, Jardin America',
    tipo: 'lote',
    operacion: 'venta',
    precio: 'USD 20.000',
    moneda: 'Billete',
    dormitorios: null,
    banos: null,
    m2: null,
    m2terreno: '603,5',
    imagen: 'img/inmuebles/lomas-de-jardin/terreno-01.jpeg',
    detalleUrl: 'terreno-lomas-de-jardin.html',
    medidas: '17 x 35,5 m',
    esquina: true,
    acceso: 'Empedrado',
    infraestructura: 'Cordon cuneta en ambos lados',
    descripcion:
      'Terreno en esquina en Barrio Lomas de Jardin. Tiene 17 x 35,5 metros, acceso por calle empedrada, cordon cuneta en ambos frentes y una ubicacion muy comoda dentro de Jardin America: a 6 cuadras del Hospital Nuevo y a 6 cuadras de Plaza Colon.'
  }
];

function waLink(message) {
  return `${WA_BASE}?text=${encodeURIComponent(message)}`;
}

function buildAutoDetailUrl(auto) {
  return `autos.html?auto=${auto.id}`;
}

function badgeLabel(state) {
  const map = {
    venta: ['badge-venta', 'En venta'],
    reserva: ['badge-reserva', 'Reservado'],
    vendido: ['badge-vendido', 'Vendido'],
    alquiler: ['badge-alquiler', 'En alquiler'],
    alquilado: ['badge-alquilado', 'Alquilado']
  };

  return map[state] || ['badge-venta', state];
}

function renderCarSpecs(auto) {
  const specs = [
    auto.km
      ? `<span class="car-spec">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ${auto.km} km
        </span>`
      : '',
    auto.combustible
      ? `<span class="car-spec">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3A1 1 0 006 17h12M10 21a1 1 0 100-2 1 1 0 000 2zM21 21a1 1 0 100-2 1 1 0 000 2z"/></svg>
          ${auto.combustible}
        </span>`
      : '',
    auto.transmision
      ? `<span class="car-spec">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          ${auto.transmision}
        </span>`
      : ''
  ];

  return specs.filter(Boolean).join('');
}

function renderCarCard(auto) {
  const [badgeClass, badgeText] = badgeLabel(auto.estado);
  const imageHtml = auto.imagen
    ? `<img src="${auto.imagen}" alt="${auto.nombre}" loading="lazy">`
    : '<span class="placeholder-icon">Auto</span>';

  return `
  <article class="car-card" data-tipo="${auto.tipo}" data-estado="${auto.estado}" data-anio="${auto.anio}">
    <a href="${buildAutoDetailUrl(auto)}" class="car-card-link" aria-label="Ver ficha tecnica de ${auto.nombre} ${auto.version}">
      <div class="car-card-img">
        ${imageHtml}
        <span class="badge ${badgeClass}">${badgeText}</span>
      </div>
      <div class="car-card-body">
        <h3>${auto.nombre}</h3>
        <p class="car-card-sub">${auto.version} · ${auto.anio} · ${auto.color}</p>
        <div class="car-card-specs">
          ${renderCarSpecs(auto)}
        </div>
        <p class="car-card-price">${auto.precio} <small>${auto.moneda}</small></p>
      </div>
    </a>
  </article>`;
}

function renderPropCard(prop) {
  const [badgeClass, badgeText] = badgeLabel(prop.operacion);
  const imageHtml = prop.imagen
    ? `<img src="${prop.imagen}" alt="${prop.nombre}" loading="lazy">`
    : '<span class="placeholder-icon">Casa</span>';
  const featuresHtml = [
    prop.medidas ? `<span class="prop-feat">${prop.medidas}</span>` : '',
    prop.m2terreno != null ? `<span class="prop-feat">${prop.m2terreno} m2</span>` : '',
    prop.esquina ? '<span class="prop-feat">Esquina</span>' : '',
    prop.acceso ? `<span class="prop-feat">${prop.acceso}</span>` : ''
  ].filter(Boolean).join('');
  const imageAction = prop.detalleUrl
    ? `<a href="${prop.detalleUrl}" class="prop-card-image-link" aria-label="Ver informacion del ${prop.nombre}">
        <div class="prop-card-img">
          ${imageHtml}
          <span class="badge ${badgeClass}">${badgeText}</span>
        </div>
      </a>`
    : `<button type="button" class="prop-card-image-link" onclick="verDetalle('inmueble', ${prop.id})" aria-label="Ver informacion del ${prop.nombre}">
        <div class="prop-card-img">
          ${imageHtml}
          <span class="badge ${badgeClass}">${badgeText}</span>
        </div>
      </button>`;

  return `
  <article class="prop-card" data-tipo="${prop.tipo}" data-operacion="${prop.operacion}">
    ${imageAction}
    <div class="prop-card-body">
      <h3>${prop.nombre}</h3>
      <p class="prop-location">📍 ${prop.localidad}</p>
      <div class="prop-features">${featuresHtml}</div>
      <p class="prop-card-price">${prop.precio} <small>${prop.moneda}</small></p>
    </div>
  </article>`;
}

function renderPropDetail(item) {
  const details = [
    ['Localidad', item.localidad],
    ['Tipo', item.tipo],
    item.medidas ? ['Medidas', item.medidas] : null,
    item.m2terreno != null ? ['Superficie', `${item.m2terreno} m2`] : null,
    item.esquina ? ['Ubicacion', 'Esquina'] : null,
    item.acceso ? ['Acceso', item.acceso] : null,
    item.infraestructura ? ['Infraestructura', item.infraestructura] : null
  ].filter(Boolean);

  return `
    <div class="detail-info detail-info-single">
      <p class="detail-price">${item.precio}</p>
      <div class="detail-specs">
        ${details
          .map(
            ([label, value]) => `
          <div class="detail-spec">
            <span>${label}</span>
            <strong>${value}</strong>
          </div>`
          )
          .join('')}
      </div>
      <p class="detail-description">${item.descripcion}</p>
    </div>
  `;
}

function renderFeatureIcon(type) {
  const icons = {
    paint:
      'https://http2.mlstatic.com/storage/catalog-technical-specs/images/assets/vectorial/color.svg',
    fuel:
      'https://http2.mlstatic.com/storage/catalog-technical-specs/images/assets/vectorial/fuel_type.svg',
    door:
      'https://http2.mlstatic.com/storage/catalog-technical-specs/images/assets/vectorial/doors.svg',
    engine:
      'https://http2.mlstatic.com/storage/catalog-technical-specs/images/assets/vectorial/engine.svg'
  };

  return icons[type] || icons.engine;
}

function renderFeatureRows(rows) {
  return rows
    .map(
      ([label, value]) => `
      <tr class="auto-feature-row">
        <th scope="row">${label}</th>
        <td>${value}</td>
      </tr>`
    )
    .join('');
}

function renderAutoDetailPage(auto) {
  const waMessage = `Hola, me interesa la ${auto.nombre} ${auto.version} (${auto.anio}). Quiero mas informacion.`;

  return `
    <section class="auto-detail-page">
      <div class="auto-detail-topbar">
        <p class="breadcrumb"><a href="index.html">Inicio</a> › <a href="autos.html">Autos</a> › <span>${auto.nombre}</span></p>
        <a href="autos.html" class="auto-back-link" data-auto-back aria-label="Volver atrás">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.7 5.3a1 1 0 0 1 0 1.4L10.4 11H20a1 1 0 1 1 0 2h-9.6l4.3 4.3a1 1 0 0 1-1.4 1.4l-6-6a1 1 0 0 1 0-1.4l6-6a1 1 0 0 1 1.4 0Z" fill="currentColor"/></svg>
        </a>
      </div>

      <div class="auto-detail-hero">
        <div class="auto-gallery-panel">
          <div class="auto-gallery-main">
            <img src="${auto.fotos[0]}" alt="${auto.nombre}" data-auto-main-image>
          </div>
          <div class="auto-gallery-thumbs">
            ${auto.fotos
              .map(
                (photo, index) => `
                <button type="button" class="auto-gallery-thumb${index === 0 ? ' is-active' : ''}" data-auto-thumb data-image="${photo}" aria-label="Ver foto ${index + 1}">
                  <img src="${photo}" alt="${auto.nombre} foto ${index + 1}" loading="lazy">
                </button>`
              )
              .join('')}
          </div>
        </div>

        <aside class="auto-detail-aside">
          <span class="auto-detail-badge">Disponible</span>
          <h1>${auto.nombre} ${auto.version}</h1>
          <p class="auto-detail-meta">${auto.anio} · ${auto.ubicacion}</p>
          <p class="auto-detail-price-main">${auto.precio}</p>
          <p class="auto-detail-description">${auto.descripcion}</p>

          <ul class="auto-detail-checks">
            ${auto.resumenCompra
              .map(
                item => `
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
                  <span>${item}</span>
                </li>`
              )
              .join('')}
          </ul>

          <div class="auto-detail-actions">
            <a href="${waLink(waMessage)}" target="_blank" rel="noopener" class="btn btn-primary">Consultar por WhatsApp</a>
            <a href="autos.html" class="btn btn-dark">Seguir viendo autos</a>
          </div>
        </aside>
      </div>

      <section class="auto-product-section">
        <div class="auto-product-header">
          <h2>Caracteristicas del producto</h2>
        </div>

        <div class="auto-feature-highlights">
          ${auto.destacados
            .map(
              feature => `
              <article class="auto-highlight-item">
                <span class="auto-highlight-icon" aria-hidden="true">
                  <img src="${renderFeatureIcon(feature.icon)}" alt="" loading="lazy">
                </span>
                <div class="auto-highlight-copy">
                  <p><span>${feature.label}:</span> <strong>${feature.value}</strong></p>
                </div>
              </article>`
            )
            .join('')}
        </div>

        <div class="auto-feature-groups" data-feature-groups>
          <div class="auto-feature-column">
            <section class="auto-feature-group">
              <h3>Principales</h3>
              <table class="auto-feature-table">
                <tbody>
                  ${renderFeatureRows(auto.caracteristicas.principales)}
                </tbody>
              </table>
            </section>
          </div>

          <div class="auto-feature-column auto-feature-column-stack">
            <section class="auto-feature-group">
              <h3>Informacion general</h3>
              <table class="auto-feature-table">
                <tbody>
                  ${renderFeatureRows(auto.caracteristicas.general)}
                </tbody>
              </table>
            </section>

            <section class="auto-feature-group">
              <h3>Condiciones de compra</h3>
              <table class="auto-feature-table">
                <tbody>
                  ${renderFeatureRows(auto.caracteristicas.compra)}
                </tbody>
              </table>
            </section>
          </div>
        </div>
      </section>
    </section>
  `;
}

function renderAutoNotFound() {
  return `
    <section class="auto-detail-empty">
      <p class="breadcrumb"><a href="index.html">Inicio</a> › <a href="autos.html">Autos</a> › <span>No encontrado</span></p>
      <h1>Ese vehiculo no esta disponible</h1>
      <p>La publicacion que intentaste abrir ya no existe o cambio de enlace.</p>
      <a href="autos.html" class="btn btn-dark">Volver a autos</a>
    </section>
  `;
}

function openPropertyModal(item) {
  const waMessage = `Hola, me interesa la propiedad "${item.nombre}" en ${item.localidad}. Quiero mas detalles.`;
  const modal = document.createElement('div');
  modal.className = 'detail-modal';
  modal.innerHTML = `
    <div class="detail-panel">
      <div class="detail-header">
        <h3>${item.nombre}</h3>
        <button type="button" class="detail-close" aria-label="Cerrar detalle">×</button>
      </div>
      <div class="detail-content">
        ${renderPropDetail(item)}
      </div>
      <div class="detail-footer">
        <a href="${waLink(waMessage)}" target="_blank" rel="noopener" class="detail-wa-link">Consultar por WhatsApp</a>
      </div>
    </div>
  `;

  modal.querySelector('.detail-close')?.addEventListener('click', () => modal.remove());
  modal.addEventListener('click', event => {
    if (event.target === modal) modal.remove();
  });

  document.body.appendChild(modal);
}

function verDetalle(type, id) {
  if (type === 'auto') {
    const auto = AUTOS.find(item => item.id === id);
    if (auto) window.location.href = buildAutoDetailUrl(auto);
    return;
  }

  const property = INMUEBLES.find(item => item.id === id);
  if (!property) return;
  if (property.detalleUrl) {
    window.location.href = property.detalleUrl;
    return;
  }

  openPropertyModal(property);
}

function initAutoFilters() {
  const grid = document.getElementById('autos-grid');
  if (!grid) return;

  grid.innerHTML = AUTOS.map(renderCarCard).join('');
  updateAutoCount(AUTOS.length);

  ['filtro-tipo-auto', 'filtro-estado-auto', 'filtro-anio-auto'].forEach(id => {
    const element = document.getElementById(id);
    if (element) element.addEventListener('change', filterAutos);
  });
}

function filterAutos() {
  const type = document.getElementById('filtro-tipo-auto')?.value || '';
  const state = document.getElementById('filtro-estado-auto')?.value || '';
  const year = document.getElementById('filtro-anio-auto')?.value || '';

  const filtered = AUTOS.filter(auto => {
    if (type && auto.tipo !== type) return false;
    if (state && auto.estado !== state) return false;
    if (year) {
      const yearMin = parseInt(year, 10);
      if (auto.anio < yearMin) return false;
    }
    return true;
  });

  const grid = document.getElementById('autos-grid');
  if (!grid) return;

  grid.innerHTML = filtered.length
    ? filtered.map(renderCarCard).join('')
    : '<div class="no-results"><p>No se encontraron vehiculos con esos filtros.</p></div>';

  updateAutoCount(filtered.length);
}

function updateAutoCount(total) {
  const element = document.getElementById('autos-count');
  if (element) element.textContent = `${total} vehiculo${total !== 1 ? 's' : ''}`;
}

function initPropFilters() {
  const grid = document.getElementById('inmuebles-grid');
  if (!grid) return;

  grid.innerHTML = INMUEBLES.map(renderPropCard).join('');
  updatePropertyCount(INMUEBLES.length);

  ['filtro-operacion', 'filtro-tipo-prop'].forEach(id => {
    const element = document.getElementById(id);
    if (element) element.addEventListener('change', filterProperties);
  });
}

function filterProperties() {
  const operation = document.getElementById('filtro-operacion')?.value || '';
  const type = document.getElementById('filtro-tipo-prop')?.value || '';

  const filtered = INMUEBLES.filter(property => {
    if (operation && property.operacion !== operation) return false;
    if (type && property.tipo !== type) return false;
    return true;
  });

  const grid = document.getElementById('inmuebles-grid');
  if (!grid) return;

  grid.innerHTML = filtered.length
    ? filtered.map(renderPropCard).join('')
    : '<div class="no-results"><p>No se encontraron propiedades con esos filtros.</p></div>';

  updatePropertyCount(filtered.length);
}

function updatePropertyCount(total) {
  const element = document.getElementById('inmuebles-count');
  if (element) element.textContent = `${total} propiedad${total !== 1 ? 'es' : ''}`;
}

function initHomeDestacados() {
  const autosElement = document.getElementById('home-autos');
  const propertiesElement = document.getElementById('home-inmuebles');

  if (autosElement) autosElement.innerHTML = AUTOS.slice(0, 3).map(renderCarCard).join('');
  if (propertiesElement) propertiesElement.innerHTML = INMUEBLES.slice(0, 3).map(renderPropCard).join('');
}

function getRequestedAuto() {
  const params = new URLSearchParams(window.location.search);
  const autoId = parseInt(params.get('auto') || '', 10);
  if (!Number.isFinite(autoId)) return null;
  return AUTOS.find(auto => auto.id === autoId) || false;
}

function initAutoDetailInteractions() {
  const mainImage = document.querySelector('[data-auto-main-image]');
  const thumbs = document.querySelectorAll('[data-auto-thumb]');
  const backLink = document.querySelector('[data-auto-back]');

  if (mainImage && thumbs.length) {
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const nextImage = thumb.getAttribute('data-image');
        if (!nextImage) return;

        mainImage.src = nextImage;
        thumbs.forEach(item => item.classList.remove('is-active'));
        thumb.classList.add('is-active');
      });
    });
  }

  if (backLink) {
    backLink.addEventListener('click', event => {
      if (window.history.length <= 1) return;
      event.preventDefault();
      window.history.back();
    });
  }
}

function initAutoPage() {
  const detailMount = document.getElementById('auto-detail-view');
  const grid = document.getElementById('autos-grid');
  if (!detailMount && !grid) return;

  const requestedAuto = getRequestedAuto();
  if (requestedAuto && detailMount) {
    document.querySelectorAll('[data-autos-list-view]').forEach(section => {
      section.hidden = true;
    });

    detailMount.hidden = false;
    detailMount.innerHTML = renderAutoDetailPage(requestedAuto);

    document.title = `${requestedAuto.nombre} ${requestedAuto.version} ${requestedAuto.anio} | Gestoria Sonia`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        `${requestedAuto.nombre} ${requestedAuto.version} ${requestedAuto.anio} en Jardin America. Fotos reales, caracteristicas y contacto por WhatsApp.`
      );
    }

    initAutoDetailInteractions();
    return;
  }

  if (requestedAuto === false && detailMount) {
    document.querySelectorAll('[data-autos-list-view]').forEach(section => {
      section.hidden = true;
    });

    detailMount.hidden = false;
    detailMount.innerHTML = renderAutoNotFound();
    document.title = 'Auto no encontrado | Gestoria Sonia';
    return;
  }

  if (detailMount) {
    detailMount.hidden = true;
    detailMount.innerHTML = '';
  }

  initAutoFilters();
}

function initNavbar() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  const navbar = document.querySelector('.navbar');

  if (toggle && links && navbar) {
    toggle.addEventListener('click', event => {
      event.stopPropagation();
      const isOpen = links.classList.toggle('open');
      navbar.classList.toggle('menu-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('open');
        navbar.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', event => {
      if (!links.classList.contains('open')) return;
      if (navbar.contains(event.target)) return;
      links.classList.remove('open');
      navbar.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  }

  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = form.nombre.value.trim();
    const phone = form.telefono.value.trim();
    const subject = form.asunto.value;
    const message = form.mensaje.value.trim();

    const text = `Hola, soy ${name}${phone ? ` (tel: ${phone})` : ''}.\nAsunto: ${subject}\n${message}`;
    window.open(waLink(text), '_blank');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHomeDestacados();
  initAutoPage();
  initPropFilters();
  initContactForm();
});
