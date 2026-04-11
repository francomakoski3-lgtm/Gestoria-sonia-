const WA_NUMBER = '543743668039';
const WA_BASE = `https://wa.me/${WA_NUMBER}`;

const cache = {
  autosPromise: null,
  propertiesPromise: null
};

document.addEventListener('DOMContentLoaded', async () => {
  initNavbar();
  initContactForm();

  await Promise.all([
    initHomeDestacados(),
    initMarketplacePage(),
    initAutoPage(),
    initPropertyPage()
  ]);
});

function waLink(message) {
  return `${WA_BASE}?text=${encodeURIComponent(message)}`;
}

function badgeLabel(state) {
  const map = {
    venta: ['badge-venta', 'En venta'],
    reserva: ['badge-reserva', 'Reservado'],
    vendido: ['badge-vendido', 'Vendido'],
    alquiler: ['badge-alquiler', 'En alquiler'],
    alquilado: ['badge-alquilado', 'Alquilado']
  };

  return map[state] || ['badge-venta', state || 'Disponible'];
}

function safeUrl(url, fallback = '#') {
  if (!url) return fallback;
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('/') ||
    url.startsWith('img/') ||
    url.startsWith('uploads/')
  ) {
    return url;
  }

  return fallback;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseIdFromQuery(key) {
  const params = new URLSearchParams(window.location.search);
  const value = Number.parseInt(params.get(key) || '', 10);
  return Number.isFinite(value) ? value : null;
}

async function fetchJson(url) {
  const response = await fetch(url, { credentials: 'same-origin' });
  if (!response.ok) {
    throw new Error('No se pudo cargar la informacion.');
  }
  return response.json();
}

function loadAutos() {
  if (!cache.autosPromise) {
    cache.autosPromise = fetchJson('/api/autos').then(data => data.items || []);
  }
  return cache.autosPromise;
}

function loadProperties() {
  if (!cache.propertiesPromise) {
    cache.propertiesPromise = fetchJson('/api/inmuebles').then(data => data.items || []);
  }
  return cache.propertiesPromise;
}

function renderCarCard(auto) {
  const [badgeClass, badgeText] = badgeLabel(auto.status);
  const specs = [auto.year, auto.fuel, auto.transmission].filter(Boolean).join(' · ');

  return `
    <article class="car-card" data-tipo="${escapeHtml(auto.vehicleType)}" data-estado="${escapeHtml(auto.status)}" data-anio="${escapeHtml(auto.year)}">
      <a href="autos.html?auto=${auto.id}" class="car-card-link" aria-label="Ver ${escapeHtml(auto.title)}">
        <div class="car-card-img">
          <img src="${escapeHtml(safeUrl(auto.coverImage || auto.galleryImages?.[0] || 'img/services/autos-cover.jpg'))}" alt="${escapeHtml(auto.title)}" loading="lazy">
          <span class="badge ${badgeClass}">${escapeHtml(badgeText)}</span>
        </div>
        <div class="car-card-body">
          <h3>${escapeHtml(auto.title)}</h3>
          <p class="car-card-sub">${escapeHtml(specs || auto.version || '')}</p>
          <p class="car-card-price">${escapeHtml(auto.price)} <small>${escapeHtml(auto.currency || '')}</small></p>
        </div>
      </a>
    </article>
  `;
}

function renderPropertyCard(property) {
  const [badgeClass, badgeText] = badgeLabel(property.status || property.operation);
  const features = [
    property.propertyType,
    property.dimensions,
    property.landAreaM2 ? `${property.landAreaM2} m2` : '',
    property.bedrooms ? `${property.bedrooms} dorm.` : ''
  ].filter(Boolean).map(item => `<span class="prop-feat">${escapeHtml(item)}</span>`).join('');

  return `
    <article class="prop-card" data-tipo="${escapeHtml(property.propertyType)}" data-operacion="${escapeHtml(property.operation)}">
      <a href="inmuebles.html?inmueble=${property.id}" class="prop-card-image-link" aria-label="Ver ${escapeHtml(property.title)}">
        <div class="prop-card-img">
          <img src="${escapeHtml(safeUrl(property.coverImage || property.galleryImages?.[0] || 'img/services/inmuebles-cover.jpg'))}" alt="${escapeHtml(property.title)}" loading="lazy">
          <span class="badge ${badgeClass}">${escapeHtml(badgeText)}</span>
        </div>
      </a>
      <div class="prop-card-body">
        <h3>${escapeHtml(property.title)}</h3>
        <p class="prop-location">${escapeHtml(property.location || '')}</p>
        <div class="prop-features">${features}</div>
        <p class="prop-card-price">${escapeHtml(property.price)} <small>${escapeHtml(property.currency || '')}</small></p>
      </div>
    </article>
  `;
}

function formatVehicleType(type) {
  const map = {
    pickup: 'Pickup',
    sedan: 'Sedan',
    suv: 'SUV',
    hatchback: 'Hatchback',
    utilitario: 'Utilitario'
  };

  return map[type] || 'Auto';
}

function formatPropertyType(type) {
  const map = {
    casa: 'Casa',
    departamento: 'Departamento',
    lote: 'Lote',
    local: 'Local',
    campo: 'Campo'
  };

  return map[type] || 'Inmueble';
}

function getMarketTimestamp(item) {
  const raw = item.createdAt || item.updatedAt || '';
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

function buildMarketItems(autos, properties) {
  const autoItems = autos.map(auto => {
    const [badgeClass, badgeText] = badgeLabel(auto.status);

    return {
      id: auto.id,
      kind: 'auto',
      title: auto.title || [auto.brand, auto.model].filter(Boolean).join(' ') || 'Vehiculo',
      href: `autos.html?auto=${auto.id}`,
      image: safeUrl(auto.coverImage || auto.galleryImages?.[0] || 'img/services/autos-cover.jpg'),
      badgeClass,
      badgeText,
      categoryLabel: 'Auto',
      typeLabel: formatVehicleType(auto.vehicleType),
      location: auto.location || 'Jardin America, Misiones',
      price: auto.price || 'Consultar precio',
      currency: auto.currency || '',
      meta: [
        auto.year ? String(auto.year) : '',
        auto.fuel || '',
        auto.km ? formatAutoKm(auto.km) : ''
      ].filter(Boolean),
      filterType: 'auto',
      filterOperation: auto.status === 'alquiler' ? 'alquiler' : 'venta',
      featured: Boolean(auto.featured),
      createdAt: auto.createdAt,
      updatedAt: auto.updatedAt
    };
  });

  const propertyItems = properties.map(property => {
    const [badgeClass, badgeText] = badgeLabel(property.status || property.operation);
    const areaLabel =
      property.landAreaM2 ? `${property.landAreaM2} m2`
        : property.areaM2 ? `${property.areaM2} m2`
          : '';

    return {
      id: property.id,
      kind: 'inmueble',
      title: property.title || 'Propiedad',
      href: `inmuebles.html?inmueble=${property.id}`,
      image: safeUrl(property.coverImage || property.galleryImages?.[0] || 'img/services/inmuebles-cover.jpg'),
      badgeClass,
      badgeText,
      categoryLabel: 'Inmueble',
      typeLabel: formatPropertyType(property.propertyType),
      location: property.location || 'Jardin America, Misiones',
      price: property.price || 'Consultar precio',
      currency: property.currency || '',
      meta: [
        formatPropertyType(property.propertyType),
        property.operation === 'alquiler' ? 'Alquiler' : 'Venta',
        areaLabel || (property.bedrooms ? `${property.bedrooms} dorm.` : '')
      ].filter(Boolean),
      filterType: 'inmueble',
      filterOperation: property.operation || (property.status === 'alquiler' ? 'alquiler' : 'venta'),
      featured: Boolean(property.featured),
      createdAt: property.createdAt,
      updatedAt: property.updatedAt
    };
  });

  return [...autoItems, ...propertyItems].sort((left, right) => {
    if (left.featured !== right.featured) {
      return Number(right.featured) - Number(left.featured);
    }

    return getMarketTimestamp(right) - getMarketTimestamp(left);
  });
}

function renderMarketCard(item) {
  return `
    <article class="market-card" data-market-type="${escapeHtml(item.filterType)}" data-market-operation="${escapeHtml(item.filterOperation)}">
      <a href="${escapeHtml(item.href)}" class="market-card-link" aria-label="Ver ${escapeHtml(item.title)}">
        <div class="market-card-media">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy">
          <span class="badge ${escapeHtml(item.badgeClass)}">${escapeHtml(item.badgeText)}</span>
          <span class="market-card-kind">${escapeHtml(item.categoryLabel)}</span>
        </div>
        <div class="market-card-body">
          <p class="market-card-eyebrow">Mercado · ${escapeHtml(item.typeLabel)}</p>
          <h3>${escapeHtml(item.title)}</h3>
          <p class="market-card-location">${escapeHtml(item.location)}</p>
          <div class="market-card-meta">
            ${item.meta.map(detail => `<span>${escapeHtml(detail)}</span>`).join('')}
          </div>
          <p class="market-card-price">${escapeHtml(item.price)}${item.currency ? ` <small>${escapeHtml(item.currency)}</small>` : ''}</p>
        </div>
      </a>
    </article>
  `;
}

function formatAutoKm(value) {
  if (value === null || value === undefined || value === '') {
    return 'Kilometraje no informado';
  }

  const raw = String(value).trim();
  const digits = raw.replace(/\D/g, '');
  if (!digits) {
    return raw.toLowerCase().includes('km') ? raw : `${raw} km`;
  }

  return `${Number.parseInt(digits, 10).toLocaleString('es-AR')} km`;
}

function formatPublishedTime(value) {
  if (!value) return 'Publicado recientemente';

  const createdAt = new Date(value);
  if (Number.isNaN(createdAt.getTime())) return 'Publicado recientemente';

  const today = new Date();
  const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startCreated = new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate());
  const diffDays = Math.max(0, Math.floor((startToday - startCreated) / 86400000));

  if (diffDays === 0) return 'Publicado hoy';
  if (diffDays === 1) return 'Publicado hace 1 dia';
  return `Publicado hace ${diffDays} dias`;
}

function renderFeatureRows(rows) {
  return rows
    .map(
      ([label, value]) => `
        <tr class="auto-feature-row">
          <th scope="row">${escapeHtml(label)}</th>
          <td>${escapeHtml(value)}</td>
        </tr>`
    )
    .join('');
}

function renderFeatureIcon(type) {
  const icons = {
    paint: 'https://http2.mlstatic.com/storage/catalog-technical-specs/images/assets/vectorial/color.svg',
    fuel: 'https://http2.mlstatic.com/storage/catalog-technical-specs/images/assets/vectorial/fuel_type.svg',
    door: 'https://http2.mlstatic.com/storage/catalog-technical-specs/images/assets/vectorial/doors.svg',
    engine: 'https://http2.mlstatic.com/storage/catalog-technical-specs/images/assets/vectorial/engine.svg'
  };

  return icons[type] || icons.engine;
}

function renderAutoDetailPage(auto) {
  const gallery = auto.galleryImages && auto.galleryImages.length
    ? auto.galleryImages
    : [auto.coverImage].filter(Boolean);
  const [, badgeText] = badgeLabel(auto.status);
  const title = auto.title || [auto.brand, auto.model].filter(Boolean).join(' ') || 'Vehiculo';
  const highlights = (auto.highlights || []).length
    ? auto.highlights
    : ['Publicacion activa', 'Consulta directa por WhatsApp'];
  const primaryRows = [
    ['Marca', auto.brand],
    ['Modelo', auto.model],
    ['Version', auto.version],
    ['Anio', auto.year],
    ['Color', auto.color],
    ['Tipo de combustible', auto.fuel],
    ['Puertas', auto.doors],
    ['Motor', auto.engine],
    ['Kilometros', formatAutoKm(auto.km)]
  ].filter(([, value]) => value);
  const generalRows = [
    ['Caja', auto.transmission],
    ['Direccion', auto.steering],
    ['Traccion', auto.traction],
    ['Cabina', auto.cabin],
    ['Ubicacion', auto.location]
  ].filter(([, value]) => value);
  const purchaseRows = ((auto.highlights || []).length
    ? auto.highlights.slice(0, 4).map(item => [item, 'Si'])
    : [['Estado de la publicacion', badgeText]])
    .filter(([, value]) => value);
  const summarySpecs = [
    auto.year ? String(auto.year) : 'Ano no informado',
    formatAutoKm(auto.km),
    formatPublishedTime(auto.createdAt)
  ];
  const askLink = waLink(`Hola, tengo una consulta sobre el vehiculo ${title}.`);
  const whatsappLink = waLink(`Hola, me interesa el vehiculo ${title}. Quiero mas informacion.`);

  return `
    <section class="auto-detail-page">
      <div class="auto-detail-topbar">
        <p class="breadcrumb"><a href="index.html">Inicio</a> › <a href="mercado.html">Mercado</a> › <span>${escapeHtml(title)}</span></p>
        <a href="mercado.html" class="auto-back-link" data-back-link aria-label="Volver">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.7 5.3a1 1 0 0 1 0 1.4L10.4 11H20a1 1 0 1 1 0 2h-9.6l4.3 4.3a1 1 0 0 1-1.4 1.4l-6-6a1 1 0 0 1 0-1.4l6-6a1 1 0 0 1 1.4 0Z" fill="currentColor"/></svg>
        </a>
      </div>

      <div class="auto-market-layout">
        <div class="auto-market-main">
          <div class="auto-gallery-shell">
            <div class="auto-gallery-rail">
              ${gallery.map((photo, index) => `
                <button type="button" class="auto-gallery-thumb${index === 0 ? ' is-active' : ''}" data-thumb-image="${escapeHtml(safeUrl(photo))}" aria-label="Ver foto ${index + 1}">
                  <img src="${escapeHtml(safeUrl(photo))}" alt="${escapeHtml(title)} foto ${index + 1}" loading="lazy">
                </button>
              `).join('')}
            </div>
            <div class="auto-gallery-main">
              <img src="${escapeHtml(safeUrl(gallery[0] || 'img/services/autos-cover.jpg'))}" alt="${escapeHtml(title)}" data-main-image>
            </div>
          </div>
        </div>

        <aside class="auto-market-sidebar">
          <div class="auto-market-card">
            <div class="auto-market-meta">
              ${summarySpecs.map(item => `<span>${escapeHtml(item)}</span>`).join('')}
            </div>
            <span class="auto-detail-badge">${escapeHtml(badgeText)}</span>
            <h1>${escapeHtml(title)}</h1>
            ${auto.location ? `<p class="auto-market-location">${escapeHtml(auto.location)}</p>` : ''}
            <p class="auto-detail-price-main">${escapeHtml(auto.price)}</p>
            <ul class="auto-detail-checks">
              ${highlights.map(item => `<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg><span>${escapeHtml(item)}</span></li>`).join('')}
            </ul>
            <div class="auto-market-actions">
              <a href="${askLink}" target="_blank" rel="noopener" class="auto-market-btn auto-market-btn--ask">Preguntar</a>
              <a href="${whatsappLink}" target="_blank" rel="noopener" class="auto-market-btn auto-market-btn--wa">WhatsApp</a>
            </div>
          </div>
        </aside>
      </div>

      <section class="auto-product-section">
        <div class="auto-product-header"><h2>Caracteristicas del producto</h2></div>

        <div class="auto-feature-highlights">
          ${[
            { icon: 'paint', label: 'Color', value: auto.color || 'No informado' },
            { icon: 'fuel', label: 'Tipo de combustible', value: auto.fuel || 'No informado' },
            { icon: 'door', label: 'Puertas', value: auto.doors || 'No informado' },
            { icon: 'engine', label: 'Motor', value: auto.engine || 'No informado' }
          ].map(feature => `
            <article class="auto-highlight-item">
              <span class="auto-highlight-icon" aria-hidden="true">
                <img src="${renderFeatureIcon(feature.icon)}" alt="" loading="lazy">
              </span>
              <div class="auto-highlight-copy">
                <p><span>${escapeHtml(feature.label)}:</span> <strong>${escapeHtml(feature.value)}</strong></p>
              </div>
            </article>
          `).join('')}
        </div>

        <div class="auto-feature-groups">
          <div class="auto-feature-column">
            <section class="auto-feature-group">
              <h3>Principales</h3>
              <table class="auto-feature-table"><tbody>${renderFeatureRows(primaryRows)}</tbody></table>
            </section>
          </div>

          <div class="auto-feature-column auto-feature-column-stack">
            <section class="auto-feature-group">
              <h3>Informacion general</h3>
              <table class="auto-feature-table"><tbody>${renderFeatureRows(generalRows)}</tbody></table>
            </section>

            <section class="auto-feature-group">
              <h3>Condiciones de compra</h3>
              <table class="auto-feature-table"><tbody>${renderFeatureRows(purchaseRows)}</tbody></table>
            </section>
          </div>
        </div>
      </section>
    </section>
  `;
}

function renderPropertyDetailPage(property) {
  const gallery = property.galleryImages && property.galleryImages.length
    ? property.galleryImages
    : [property.coverImage].filter(Boolean);
  const highlights = (property.highlights || []).length
    ? property.highlights
    : ['Publicacion activa'];
  const rows = [
    ['Operacion', property.operation],
    ['Estado', badgeLabel(property.status || property.operation)[1]],
    ['Tipo', property.propertyType],
    ['Ubicacion', property.location],
    ['Dormitorios', property.bedrooms],
    ['Banos', property.bathrooms],
    ['Metros cubiertos', property.areaM2 ? `${property.areaM2} m2` : ''],
    ['Metros de terreno', property.landAreaM2 ? `${property.landAreaM2} m2` : ''],
    ['Medidas', property.dimensions],
    ['Acceso', property.access],
    ['Infraestructura', property.infrastructure],
    ['Esquina', property.corner ? 'Si' : '']
  ].filter(([, value]) => value);

  return `
    <section class="property-detail-section">
      <div class="page-hero" style="margin-bottom:32px;">
        <div>
          <p class="breadcrumb"><a href="index.html">Inicio</a> › <a href="mercado.html">Mercado</a> › <span>${escapeHtml(property.title)}</span></p>
          <h1>${escapeHtml(property.title)}</h1>
          <p>${escapeHtml([property.location, property.price].filter(Boolean).join(' · '))}</p>
        </div>
        <a href="${waLink(`Hola, me interesa el inmueble ${property.title}. Quiero mas informacion.`)}" target="_blank" rel="noopener" class="btn btn-primary">Consultar por WhatsApp</a>
      </div>

      <div class="property-detail-grid">
        <div class="property-main">
          <div class="detail-gallery">${gallery.map(photo => `<a href="${escapeHtml(safeUrl(photo))}" target="_blank" rel="noopener" class="detail-gallery-item"><img src="${escapeHtml(safeUrl(photo))}" alt="${escapeHtml(property.title)}" loading="lazy"></a>`).join('')}</div>
          <div class="property-summary" style="margin-top:24px;">
            <span class="detail-pill">${escapeHtml(badgeLabel(property.status || property.operation)[1])}</span>
            <h2>Descripcion</h2>
            <p class="property-lead">${escapeHtml(property.description)}</p>
            <div class="property-highlight-grid">${highlights.map(item => `<div class="property-highlight-card"><strong>${escapeHtml(item)}</strong></div>`).join('')}</div>
          </div>
        </div>

        <aside class="property-sidebar">
          <div class="property-sticky">
            <div class="property-price-card">
              <p class="property-price-label">Precio</p>
              <strong class="property-price-value">${escapeHtml(property.price)}</strong>
              <p>Consultas directas por WhatsApp para coordinar visita o pedir documentacion.</p>
              <div class="property-card-actions">
                <a href="${waLink(`Hola, quiero consultar por el inmueble ${property.title}.`)}" target="_blank" rel="noopener" class="btn btn-primary">Consultar ahora</a>
                ${property.mapUrl ? `<a href="${escapeHtml(safeUrl(property.mapUrl))}" target="_blank" rel="noopener" class="btn btn-dark">Abrir ubicacion</a>` : ''}
              </div>
            </div>
            <div class="property-tech-card">
              <h3>Ficha tecnica</h3>
              <dl class="tech-list">${rows.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl>
            </div>
          </div>
        </aside>
      </div>
    </section>
  `;
}

async function initHomeDestacados() {
  const autosMount = document.getElementById('home-autos');
  const propertiesMount = document.getElementById('home-inmuebles');
  const marketplaceMount = document.getElementById('home-mercado');
  if (!autosMount && !propertiesMount && !marketplaceMount) return;

  try {
    const [autos, properties] = await Promise.all([loadAutos(), loadProperties()]);
    const marketItems = buildMarketItems(autos, properties);
    if (autosMount) {
      const featuredAutos = autos.filter(item => item.featured).slice(0, 3);
      autosMount.innerHTML = (featuredAutos.length ? featuredAutos : autos.slice(0, 3)).map(renderCarCard).join('');
    }
    if (propertiesMount) {
      const featuredProperties = properties.filter(item => item.featured).slice(0, 3);
      propertiesMount.innerHTML = (featuredProperties.length ? featuredProperties : properties.slice(0, 3)).map(renderPropertyCard).join('');
    }
    if (marketplaceMount) {
      const featuredMarket = marketItems.filter(item => item.featured).slice(0, 4);
      marketplaceMount.innerHTML = (featuredMarket.length ? featuredMarket : marketItems.slice(0, 4)).map(renderMarketCard).join('');
    }
  } catch {
    if (autosMount) autosMount.innerHTML = '<p style="color:var(--gray-500);">No se pudieron cargar los autos.</p>';
    if (propertiesMount) propertiesMount.innerHTML = '<p style="color:var(--gray-500);">No se pudieron cargar los inmuebles.</p>';
    if (marketplaceMount) marketplaceMount.innerHTML = '<p style="color:var(--gray-500);">No se pudo cargar el mercado.</p>';
  }
}

async function initMarketplacePage() {
  const grid = document.getElementById('mercado-grid');
  if (!grid) return;

  try {
    const [autos, properties] = await Promise.all([loadAutos(), loadProperties()]);
    const items = buildMarketItems(autos, properties);
    const params = new URLSearchParams(window.location.search);
    const typeSelect = document.getElementById('filtro-mercado-tipo');
    const operationSelect = document.getElementById('filtro-mercado-operacion');
    const count = document.getElementById('mercado-count');
    const requestedType = params.get('tipo') || '';
    const requestedOperation = params.get('operacion') || '';

    if (typeSelect && ['auto', 'inmueble'].includes(requestedType)) {
      typeSelect.value = requestedType;
    }

    if (operationSelect && ['venta', 'alquiler'].includes(requestedOperation)) {
      operationSelect.value = requestedOperation;
    }

    const renderFilteredMarket = () => {
      const selectedType = typeSelect?.value || '';
      const selectedOperation = operationSelect?.value || '';
      const filtered = items.filter(item => {
        if (selectedType && item.filterType !== selectedType) return false;
        if (selectedOperation && item.filterOperation !== selectedOperation) return false;
        return true;
      });

      grid.innerHTML = filtered.length
        ? filtered.map(renderMarketCard).join('')
        : '<div class="no-results"><p>No se encontraron publicaciones para esos filtros.</p></div>';

      if (count) {
        count.textContent = `${filtered.length} publicacion${filtered.length === 1 ? '' : 'es'}`;
      }
    };

    [typeSelect, operationSelect].forEach(select => {
      select?.addEventListener('change', renderFilteredMarket);
    });

    renderFilteredMarket();
  } catch {
    grid.innerHTML = '<p style="color:var(--gray-500);">No se pudieron cargar las publicaciones del mercado.</p>';
  }
}

async function initAutoPage() {
  const grid = document.getElementById('autos-grid');
  const detailMount = document.getElementById('auto-detail-view');
  if (!grid && !detailMount) return;

  try {
    const autos = await loadAutos();
    const requestedId = parseIdFromQuery('auto');

    if (requestedId && detailMount) {
      const auto = autos.find(item => item.id === requestedId);
      document.querySelectorAll('[data-autos-list-view]').forEach(section => { section.hidden = true; });
      detailMount.hidden = false;
      detailMount.innerHTML = auto ? renderAutoDetailPage(auto) : '<section class="auto-detail-empty"><h1>Vehiculo no encontrado</h1><p>La publicacion ya no existe.</p><a href="mercado.html" class="btn btn-dark">Volver al mercado</a></section>';
      bindDetailGallery();
      return;
    }

    if (detailMount) {
      detailMount.hidden = true;
      detailMount.innerHTML = '';
    }

    if (!grid) return;
    const renderFilteredAutos = () => {
      const type = document.getElementById('filtro-tipo-auto')?.value || '';
      const status = document.getElementById('filtro-estado-auto')?.value || '';
      const year = Number.parseInt(document.getElementById('filtro-anio-auto')?.value || '', 10);
      const filtered = autos.filter(auto => {
        if (type && auto.vehicleType !== type) return false;
        if (status && auto.status !== status) return false;
        if (Number.isFinite(year) && auto.year && auto.year < year) return false;
        return true;
      });
      grid.innerHTML = filtered.length ? filtered.map(renderCarCard).join('') : '<div class="no-results"><p>No se encontraron vehiculos con esos filtros.</p></div>';
      const counter = document.getElementById('autos-count');
      if (counter) counter.textContent = `${filtered.length} vehiculo${filtered.length === 1 ? '' : 's'}`;
    };

    ['filtro-tipo-auto', 'filtro-estado-auto', 'filtro-anio-auto'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', renderFilteredAutos);
    });
    renderFilteredAutos();
  } catch {
    if (grid) grid.innerHTML = '<p style="color:var(--gray-500);">No se pudieron cargar los vehiculos.</p>';
  }
}

async function initPropertyPage() {
  const grid = document.getElementById('inmuebles-grid');
  const detailMount = document.getElementById('inmueble-detail-view');
  if (!grid && !detailMount) return;

  try {
    const properties = await loadProperties();
    const requestedId = parseIdFromQuery('inmueble');

    if (requestedId && detailMount) {
      const property = properties.find(item => item.id === requestedId);
      document.querySelectorAll('[data-inmuebles-list-view]').forEach(section => { section.hidden = true; });
      detailMount.hidden = false;
      detailMount.innerHTML = property ? renderPropertyDetailPage(property) : '<section class="auto-detail-empty"><h1>Inmueble no encontrado</h1><p>La publicacion ya no existe.</p><a href="mercado.html" class="btn btn-dark">Volver al mercado</a></section>';
      return;
    }

    if (detailMount) {
      detailMount.hidden = true;
      detailMount.innerHTML = '';
    }

    if (!grid) return;
    const renderFilteredProperties = operationOverride => {
      const operation =
        operationOverride ?? (document.getElementById('filtro-operacion')?.value || '');
      const type = document.getElementById('filtro-tipo-prop')?.value || '';
      const filtered = properties.filter(property => {
        if (operation && property.operation !== operation) return false;
        if (type && property.propertyType !== type) return false;
        return true;
      });
      grid.innerHTML = filtered.length ? filtered.map(renderPropertyCard).join('') : '<div class="no-results"><p>No se encontraron propiedades con esos filtros.</p></div>';
      const counter = document.getElementById('inmuebles-count');
      if (counter) counter.textContent = `${filtered.length} propiedad${filtered.length === 1 ? '' : 'es'}`;
    };

    document.querySelectorAll('[data-property-tab]').forEach(button => {
      button.addEventListener('click', () => {
        updatePropertyTabStyles(button);
        const select = document.getElementById('filtro-operacion');
        if (select) select.value = button.dataset.propertyTab;
        renderFilteredProperties(button.dataset.propertyTab);
      });
    });

    ['filtro-operacion', 'filtro-tipo-prop'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', () => renderFilteredProperties());
    });
    const activeTab = document.querySelector('[data-property-tab].active') || document.querySelector('[data-property-tab=""]');
    if (activeTab) updatePropertyTabStyles(activeTab);
    renderFilteredProperties();
  } catch {
    if (grid) grid.innerHTML = '<p style="color:var(--gray-500);">No se pudieron cargar los inmuebles.</p>';
  }
}

function bindDetailGallery() {
  const mainImage = document.querySelector('[data-main-image]');
  const thumbButtons = Array.from(document.querySelectorAll('[data-thumb-image]'));
  thumbButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (!mainImage) return;
      mainImage.src = button.dataset.thumbImage;
      thumbButtons.forEach(item => item.classList.remove('is-active'));
      button.classList.add('is-active');
    });
  });

  document.querySelector('[data-back-link]')?.addEventListener('click', event => {
    if (window.history.length <= 1) return;
    event.preventDefault();
    window.history.back();
  });
}

function initNavbar() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    const syncNavbarScrollState = () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 18);
    };
    syncNavbarScrollState();
    window.addEventListener('scroll', syncNavbarScrollState, { passive: true });
  }

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

function updatePropertyTabStyles(activeButton) {
  document.querySelectorAll('[data-property-tab]').forEach(button => {
    button.classList.toggle('active', button === activeButton);
    button.style.color = button === activeButton ? 'var(--black)' : 'var(--gray-500)';
    button.style.borderBottomColor = button === activeButton ? 'var(--red)' : 'transparent';
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
