const fs = require('fs');
const path = require('path');

const ROOT_DIR = process.cwd();
const SITE_URL = 'https://gestoriasonia.ar';
const DEFAULT_INDEX_ROBOTS =
  'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
const DEFAULT_NOINDEX_ROBOTS = 'noindex, nofollow, noarchive, nosnippet';

const PROVIDER_SCHEMA = {
  '@type': 'ProfessionalService',
  name: 'Gestoría Sonia',
  url: `${SITE_URL}/`,
  telephone: '+54 3743 66-8039',
  email: 'Gerasoal@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Av. Antártida Argentina 564',
    addressLocality: 'Jardín América',
    addressRegion: 'Misiones',
    addressCountry: 'AR',
  },
  areaServed: {
    '@type': 'State',
    name: 'Misiones',
  },
};

const SERVICE_PAGES = [
  {
    filename: 'transferencia-automotor.html',
    template: 'gestoria-servicio.html',
    serviceId: 'transferencias',
    serviceName: 'Transferencia automotor',
    serviceType: 'Gestoría del automotor',
    parentName: 'Gestoría del automotor',
    parentPath: 'gestoria.html',
    homeLabel: 'Volver a servicios',
    title: 'Transferencia automotor en Jardín América | Gestoría Sonia',
    description:
      'Transferencia de autos y motos en Jardín América, Misiones. Requisitos, costos orientativos y acompañamiento con Gestoría Sonia.',
    imagePath: '/img/services/transferencia-cover.jpg',
  },
  {
    filename: 'informe-de-dominio.html',
    template: 'gestoria-servicio.html',
    serviceId: 'informe-dominio',
    serviceName: 'Informe de dominio automotor',
    serviceType: 'Gestoría del automotor',
    parentName: 'Gestoría del automotor',
    parentPath: 'gestoria.html',
    homeLabel: 'Volver a servicios',
    title: 'Informe de dominio automotor | Gestoría Sonia',
    description:
      'Solicitá informe de dominio histórico o actual para autos y motos con Gestoría Sonia en Jardín América, Misiones.',
    imagePath: '/img/services/informes-cover.png',
  },
  {
    filename: 'denuncia-de-venta.html',
    template: 'gestoria-servicio.html',
    serviceId: 'denuncia-venta',
    serviceName: 'Denuncia de venta del automotor',
    serviceType: 'Gestoría del automotor',
    parentName: 'Gestoría del automotor',
    parentPath: 'gestoria.html',
    homeLabel: 'Volver a servicios',
    title: 'Denuncia de venta del automotor | Gestoría Sonia',
    description:
      'Realizá la denuncia de venta de tu auto o moto con acompañamiento local en Jardín América, Misiones.',
    imagePath: '/img/services/denuncia-venta-cover.png',
  },
  {
    filename: 'cedula-y-titulo-automotor.html',
    template: 'gestoria-servicio.html',
    serviceId: 'cedula-titulo',
    serviceName: 'Cédula y título del automotor',
    serviceType: 'Gestoría del automotor',
    parentName: 'Gestoría del automotor',
    parentPath: 'gestoria.html',
    homeLabel: 'Volver a servicios',
    title: 'Cédula y título del automotor | Gestoría Sonia',
    description:
      'Gestión de cédula, título, duplicados y documentación digital del automotor en Jardín América, Misiones.',
    imagePath: '/img/services/cedula-titulo-cover.png',
  },
  {
    filename: 'inscripcion-0km.html',
    template: 'gestoria-servicio.html',
    serviceId: 'inscripcion-0km',
    serviceName: 'Inscripción 0 km',
    serviceType: 'Gestoría del automotor',
    parentName: 'Gestoría del automotor',
    parentPath: 'gestoria.html',
    homeLabel: 'Volver a servicios',
    title: 'Inscripción 0 km | Gestoría Sonia',
    description:
      'Patenta tu auto o moto 0 km con Gestoría Sonia. Inscripción inicial y documentación registral en Jardín América, Misiones.',
    imagePath: '/img/services/inscripcion-0km-cover.png',
  },
  {
    filename: 'prendas-y-tramites-registrales.html',
    template: 'gestoria-servicio.html',
    serviceId: 'prendas-registrales',
    serviceName: 'Prendas y trámites registrales',
    serviceType: 'Gestoría del automotor',
    parentName: 'Gestoría del automotor',
    parentPath: 'gestoria.html',
    homeLabel: 'Volver a servicios',
    title: 'Prendas y trámites registrales | Gestoría Sonia',
    description:
      'Cancelaciones, regularizaciones y trámites registrales del automotor con seguimiento local en Jardín América, Misiones.',
    imagePath: '/img/services/prendas-registrales-cover.png',
  },
  {
    filename: 'asesoramiento-automotor.html',
    template: 'gestoria-servicio.html',
    serviceId: 'asesoramiento',
    serviceName: 'Asesoramiento de gestoría del automotor',
    serviceType: 'Gestoría del automotor',
    parentName: 'Gestoría del automotor',
    parentPath: 'gestoria.html',
    homeLabel: 'Volver a servicios',
    title: 'Asesoramiento de gestoría del automotor | Gestoría Sonia',
    description:
      'Asesoramiento para compras, ventas y trámites del automotor con atención personalizada en Jardín América, Misiones.',
    imagePath: '/img/services/asesoramiento-cover.png',
  },
  {
    filename: 'boleto-compra-venta-inmuebles.html',
    template: 'gestoria-inmobiliaria-servicio.html',
    serviceId: 'boleto-compra-venta',
    serviceName: 'Boleto de compra venta de inmuebles',
    serviceType: 'Gestoría inmobiliaria',
    parentName: 'Gestoría inmobiliaria',
    parentPath: 'gestoria-inmobiliaria.html',
    homeLabel: 'Volver a servicios inmobiliarios',
    title: 'Boleto de compra venta de inmuebles | Gestoría Sonia',
    description:
      'Redacción, revisión y sellado de boletos de compra venta de inmuebles en Jardín América, Misiones.',
    imagePath: '/img/services/inmuebles-cover.jpg',
  },
  {
    filename: 'contratos-de-alquiler.html',
    template: 'gestoria-inmobiliaria-servicio.html',
    serviceId: 'contratos-alquiler',
    serviceName: 'Contratos de alquiler',
    serviceType: 'Gestoría inmobiliaria',
    parentName: 'Gestoría inmobiliaria',
    parentPath: 'gestoria-inmobiliaria.html',
    homeLabel: 'Volver a servicios inmobiliarios',
    title: 'Contratos de alquiler | Gestoría Sonia',
    description:
      'Contratos de alquiler con redacción clara, condiciones bien definidas y respaldo documental en Jardín América, Misiones.',
    imagePath: '/img/services/inmuebles-cover.jpg',
  },
];

const STATIC_PAGE_CONFIG = {
  'index.html': {
    title: 'Gestoría, Seguros y Mercado en Jardín América | Gestoría Sonia',
    description:
      'Gestoría Sonia en Jardín América, Misiones: gestoría del automotor, gestoría inmobiliaria, seguros y mercado de autos e inmuebles en un solo lugar.',
    canonical: `${SITE_URL}/`,
    imagePath: '/img/site-icon.png',
    sitemap: true,
  },
  'agendar-cita.html': {
    title: 'Agendar cita en Gestoría Sonia | Jardín América',
    description:
      'Reservá una cita gratis en Gestoría Sonia para revisar tu trámite, seguro o consulta inmobiliaria en Jardín América, Misiones.',
    imagePath: '/img/team/sonia.jpeg',
    sitemap: true,
  },
  'autos.html': {
    title: 'Autos en venta en Jardín América | Gestoría Sonia',
    description:
      'Autos y camionetas disponibles en Jardín América, Misiones. Mirá fotos, datos principales y consultá por WhatsApp.',
    imagePath: '/img/services/autos-cover.jpg',
    sitemap: true,
  },
  'boton-arrepentimiento.html': {
    imagePath: '/img/site-icon.png',
    sitemap: true,
  },
  'cotizacion-transferencia-resultado.html': {
    robots: DEFAULT_NOINDEX_ROBOTS,
    sharePreview: false,
    sitemap: false,
  },
  'cotizar-seguro.html': {
    title: 'Cotizar seguro de auto en Jardín América | Gestoría Sonia',
    description:
      'Cotizá seguros para auto, moto, camioneta o camión y revisá valores orientativos con Gestoría Sonia en Jardín América, Misiones.',
    imagePath: '/img/services/seguros-cover.jpg',
    sitemap: true,
  },
  'cotizar-transferencia.html': {
    title: 'Cotizar transferencia automotor en Misiones | Gestoría Sonia',
    description:
      'Calculá el costo orientativo de una transferencia automotor o moto y seguí la gestión por WhatsApp con Gestoría Sonia.',
    imagePath: '/img/services/transferencia-cover.jpg',
    sitemap: true,
  },
  'defensa-del-consumidor.html': {
    imagePath: '/img/site-icon.png',
    sitemap: true,
  },
  'gestoria.html': {
    title: 'Gestoría del automotor en Jardín América | Gestoría Sonia',
    description:
      'Transferencias, informes de dominio, cédulas, títulos, 0 km, prendas y trámites registrales en Jardín América, Misiones.',
    imagePath: '/img/services/gestoria-cover.jpg',
    sitemap: true,
  },
  'gestoria-inmobiliaria.html': {
    title: 'Gestoría inmobiliaria en Jardín América | Gestoría Sonia',
    description:
      'Boletos de compra venta, contratos de alquiler y acompañamiento documental para operaciones inmobiliarias en Jardín América, Misiones.',
    imagePath: '/img/services/inmuebles-cover.jpg',
    sitemap: true,
  },
  'gestoria-inmobiliaria-servicio.html': {
    title: 'Servicios de gestoría inmobiliaria | Gestoría Sonia',
    description: 'Plantilla interna para páginas de servicios inmobiliarios.',
    robots: DEFAULT_NOINDEX_ROBOTS,
    sharePreview: false,
    sitemap: false,
  },
  'gestoria-servicio.html': {
    title: 'Servicios de gestoría del automotor | Gestoría Sonia',
    description: 'Plantilla interna para páginas de servicios del automotor.',
    robots: DEFAULT_NOINDEX_ROBOTS,
    sharePreview: false,
    sitemap: false,
  },
  'gracias-reserva.html': {
    robots: DEFAULT_NOINDEX_ROBOTS,
    sharePreview: false,
    sitemap: false,
  },
  'inmuebles.html': {
    title: 'Inmuebles en venta y alquiler en Jardín América | Gestoría Sonia',
    description:
      'Casas, departamentos, lotes y locales en venta o alquiler en Jardín América, Misiones. Consultá disponibilidad por WhatsApp.',
    imagePath: '/img/services/inmuebles-cover.jpg',
    sitemap: true,
  },
  'liderar-seguros.html': {
    title: 'Liderar Seguros en Jardín América | Gestoría Sonia',
    description:
      'Conocé coberturas, preguntas frecuentes, contacto oficial y cotización de Liderar Seguros desde Gestoría Sonia.',
    imagePath: '/img/services/seguros-cover.jpg',
    sitemap: true,
  },
  'mercado.html': {
    title: 'Autos e inmuebles en Jardín América | Gestoría Sonia',
    description:
      'Mercado local de autos, casas, departamentos, lotes y alquileres en Jardín América, Misiones.',
    imagePath: '/img/services/autos-cover.jpg',
    sitemap: true,
  },
  'politica-de-privacidad.html': {
    imagePath: '/img/site-icon.png',
    sitemap: true,
  },
  'seguros.html': {
    title: 'Seguros para autos en Jardín América | Gestoría Sonia',
    description:
      'Asesoramiento y cotización de seguros para autos, motos y camionetas en Jardín América, Misiones. Hoy trabajamos con Liderar Seguros.',
    imagePath: '/img/services/seguros-cover.jpg',
    sitemap: true,
  },
  'terminos-y-condiciones.html': {
    imagePath: '/img/site-icon.png',
    sitemap: true,
  },
  'terreno-lomas-de-jardin.html': {
    title: 'Terreno en venta en Lomas de Jardín | Gestoría Sonia',
    description:
      'Terreno en esquina en Barrio Lomas de Jardín, Jardín América. Medidas 17 x 35,5 metros, con empedrado y cordón cuneta en ambos lados.',
    imagePath: '/img/inmuebles/lomas-de-jardin/terreno-01.jpeg',
    sitemap: true,
  },
  'titulos.html': {
    title: 'Matrícula, títulos y capacitaciones | Gestoría Sonia',
    description:
      'Revisá la matrícula, títulos, cursos y capacitaciones que respaldan el trabajo profesional de Gestoría Sonia.',
    imagePath: '/img/team/sonia.jpeg',
    sitemap: true,
  },
  'admin.html': {
    robots: DEFAULT_NOINDEX_ROBOTS,
    sharePreview: false,
    sitemap: false,
  },
};

const ROBOTS_DISALLOW = [
  '/admin.html',
  '/cotizacion-transferencia-resultado.html',
  '/gracias-reserva.html',
  '/gestoria-servicio.html',
  '/gestoria-inmobiliaria-servicio.html',
  '/review_dom_chrome.html',
  '/review_dom_edge.html',
  '/review_google.html',
  '/review_page_edge.html',
];

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeFile(filePath, contents) {
  fs.writeFileSync(filePath, contents, 'utf8');
}

function detectEol(contents) {
  return contents.includes('\r\n') ? '\r\n' : '\n';
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function toAbsoluteUrl(value) {
  if (!value) return '';
  return /^https?:\/\//i.test(value) ? value : `${SITE_URL}${value}`;
}

function ensureTitle(contents, title) {
  if (!title) return contents;
  const markup = `<title>${escapeHtml(title)}</title>`;
  if (/<title>[\s\S]*?<\/title>/i.test(contents)) {
    return contents.replace(/<title>[\s\S]*?<\/title>/i, markup);
  }
  return contents.replace(/(<head>\r?\n?)/i, `$1  ${markup}\n`);
}

function ensureMetaDescription(contents, description) {
  if (!description) return contents;
  const markup = `<meta name="description" content="${escapeHtml(description)}">`;
  if (/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i.test(contents)) {
    return contents.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, markup);
  }
  return contents.replace(/(<meta\s+name="viewport"[^>]*>\r?\n?)/i, `${markup}\n$1`);
}

function ensureCanonical(contents, canonical) {
  if (!canonical) return contents;
  const markup = `<link rel="canonical" href="${escapeHtml(canonical)}">`;
  if (/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i.test(contents)) {
    return contents.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, markup);
  }
  return contents.replace(/(<meta\s+name="description"[^>]*>\r?\n?)/i, `$1  ${markup}\n`);
}

function extractFirst(contents, pattern, label, filename) {
  const match = contents.match(pattern);
  if (!match) {
    throw new Error(`No se encontro ${label} en ${filename}.`);
  }
  return match[1];
}

function removeManagedSeo(contents) {
  return contents
    .replace(/[ \t]*<!-- SEO:START -->[\s\S]*?<!-- SEO:END -->[ \t]*\r?\n?/gim, '')
    .replace(/^[ \t]*<meta\s+name="robots"\s+content="[^"]*">\r?\n?/gim, '')
    .replace(/^[ \t]*<meta\s+property="og:[^"]+"\s+content="[^"]*">\r?\n?/gim, '')
    .replace(/^[ \t]*<meta\s+name="twitter:[^"]+"\s+content="[^"]*">\r?\n?/gim, '');
}

function buildBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function buildWebPageSchema(pageType, canonical, title, description, imageUrl) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': pageType || 'WebPage',
    url: canonical,
    name: title,
    description,
    inLanguage: 'es-AR',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: 'Gestoría Sonia',
    },
    about: PROVIDER_SCHEMA,
  };

  if (imageUrl) {
    schema.primaryImageOfPage = imageUrl;
  }

  return schema;
}

function buildServiceSchema(servicePage, canonical, description, imageUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: servicePage.serviceName,
    serviceType: servicePage.serviceType,
    description,
    areaServed: PROVIDER_SCHEMA.areaServed,
    provider: PROVIDER_SCHEMA,
    url: canonical,
    image: imageUrl,
  };
}

function buildSchemasForPage(config, canonical, title, description, imageUrl) {
  if (!config.schemas) return [];

  const schemas = [];

  if (config.schemas.webPageType) {
    schemas.push(
      buildWebPageSchema(
        config.schemas.webPageType,
        canonical,
        title,
        description,
        imageUrl
      )
    );
  }

  if (config.schemas.breadcrumb?.length) {
    schemas.push(
      buildBreadcrumbSchema(
        config.schemas.breadcrumb.map(item => ({
          name: item.name,
          url: item.path ? `${SITE_URL}${item.path}` : canonical,
        }))
      )
    );
  }

  if (config.schemas.servicePage) {
    schemas.push(buildServiceSchema(config.schemas.servicePage, canonical, description, imageUrl));
  }

  return schemas;
}

function buildSeoBlock({ eol, title, description, canonical, imageUrl, robots, sharePreview, schemas }) {
  const lines = ['  <!-- SEO:START -->', `  <meta name="robots" content="${robots}">`];

  if (sharePreview) {
    lines.push('  <meta property="og:locale" content="es_AR">');
    lines.push('  <meta property="og:type" content="website">');
    lines.push('  <meta property="og:site_name" content="Gestoría Sonia">');
    lines.push(`  <meta property="og:title" content="${escapeHtml(title)}">`);
    lines.push(`  <meta property="og:description" content="${escapeHtml(description)}">`);
    lines.push(`  <meta property="og:url" content="${escapeHtml(canonical)}">`);
    lines.push(`  <meta property="og:image" content="${escapeHtml(imageUrl)}">`);
    lines.push(`  <meta property="og:image:alt" content="${escapeHtml(title)}">`);
    lines.push('  <meta name="twitter:card" content="summary_large_image">');
    lines.push(`  <meta name="twitter:title" content="${escapeHtml(title)}">`);
    lines.push(`  <meta name="twitter:description" content="${escapeHtml(description)}">`);
    lines.push(`  <meta name="twitter:image" content="${escapeHtml(imageUrl)}">`);
  }

  for (const schema of schemas) {
    lines.push('  <script type="application/ld+json">');
    lines.push(
      JSON.stringify(schema, null, 2)
        .split('\n')
        .map(line => `  ${line}`)
        .join(eol)
    );
    lines.push('  </script>');
  }

  lines.push('  <!-- SEO:END -->');
  return lines.join(eol);
}

function insertSeoBlock(contents, block) {
  const eol = detectEol(contents);
  const anchors = [
    /(<link\s+rel="canonical"[^>]*>\r?\n?)/i,
    /(<meta\s+name="description"[^>]*>\r?\n?)/i,
    /(<meta\s+name="viewport"[^>]*>\r?\n?)/i,
    /(<meta\s+charset="[^"]+"\s*>\r?\n?)/i,
  ];

  for (const pattern of anchors) {
    const match = contents.match(pattern);
    if (match) {
      const spacer = /\r?\n$/.test(match[1]) ? '' : eol;
      return contents.replace(pattern, `${match[1]}${spacer}${block}${eol}`);
    }
  }

  throw new Error('No se encontro un ancla valida para insertar SEO.');
}

function replaceServiceMount(contents, servicePage) {
  const mountMarkup = [
    '  <div',
    '    id="gestoria-service-detail-mount"',
    `    data-service-id="${escapeHtml(servicePage.serviceId)}"`,
    `    data-service-home="${escapeHtml(servicePage.parentPath)}"`,
    `    data-service-home-label="${escapeHtml(servicePage.homeLabel)}"></div>`,
  ].join('\n');

  return contents.replace(
    /<div\s+id="gestoria-service-detail-mount"[\s\S]*?<\/div>/i,
    mountMarkup
  );
}

function generateServicePages() {
  const templateCache = new Map();

  for (const servicePage of SERVICE_PAGES) {
    const templatePath = path.join(ROOT_DIR, servicePage.template);
    const outputPath = path.join(ROOT_DIR, servicePage.filename);

    if (!templateCache.has(templatePath)) {
      templateCache.set(templatePath, readFile(templatePath));
    }

    let contents = templateCache.get(templatePath);
    contents = replaceServiceMount(contents, servicePage);
    writeFile(outputPath, contents);
  }
}

function buildPageConfig() {
  const pageConfig = { ...STATIC_PAGE_CONFIG };

  for (const servicePage of SERVICE_PAGES) {
    pageConfig[servicePage.filename] = {
      title: servicePage.title,
      description: servicePage.description,
      canonical: `${SITE_URL}/${servicePage.filename}`,
      imagePath: servicePage.imagePath,
      sitemap: true,
      schemas: {
        webPageType: 'WebPage',
        breadcrumb: [
          { name: 'Inicio', path: '/' },
          { name: servicePage.parentName, path: `/${servicePage.parentPath}` },
          { name: servicePage.serviceName, path: `/${servicePage.filename}` },
        ],
        servicePage,
      },
    };
  }

  pageConfig['agendar-cita.html'].schemas = {
    webPageType: 'WebPage',
    breadcrumb: [
      { name: 'Inicio', path: '/' },
      { name: 'Agendar cita', path: '/agendar-cita.html' },
    ],
  };
  pageConfig['autos.html'].schemas = {
    webPageType: 'CollectionPage',
    breadcrumb: [
      { name: 'Inicio', path: '/' },
      { name: 'Mercado', path: '/mercado.html' },
      { name: 'Autos', path: '/autos.html' },
    ],
  };
  pageConfig['cotizar-seguro.html'].schemas = {
    webPageType: 'WebPage',
    breadcrumb: [
      { name: 'Inicio', path: '/' },
      { name: 'Seguros', path: '/seguros.html' },
      { name: 'Cotizar seguro', path: '/cotizar-seguro.html' },
    ],
  };
  pageConfig['cotizar-transferencia.html'].schemas = {
    webPageType: 'WebPage',
    breadcrumb: [
      { name: 'Inicio', path: '/' },
      { name: 'Gestoría del automotor', path: '/gestoria.html' },
      { name: 'Cotizar transferencia', path: '/cotizar-transferencia.html' },
    ],
  };
  pageConfig['gestoria.html'].schemas = {
    webPageType: 'WebPage',
    breadcrumb: [
      { name: 'Inicio', path: '/' },
      { name: 'Gestoría del automotor', path: '/gestoria.html' },
    ],
  };
  pageConfig['gestoria-inmobiliaria.html'].schemas = {
    webPageType: 'WebPage',
    breadcrumb: [
      { name: 'Inicio', path: '/' },
      { name: 'Gestoría inmobiliaria', path: '/gestoria-inmobiliaria.html' },
    ],
  };
  pageConfig['inmuebles.html'].schemas = {
    webPageType: 'CollectionPage',
    breadcrumb: [
      { name: 'Inicio', path: '/' },
      { name: 'Mercado', path: '/mercado.html' },
      { name: 'Inmuebles', path: '/inmuebles.html' },
    ],
  };
  pageConfig['liderar-seguros.html'].schemas = {
    webPageType: 'WebPage',
    breadcrumb: [
      { name: 'Inicio', path: '/' },
      { name: 'Seguros', path: '/seguros.html' },
      { name: 'Liderar Seguros', path: '/liderar-seguros.html' },
    ],
  };
  pageConfig['mercado.html'].schemas = {
    webPageType: 'CollectionPage',
    breadcrumb: [
      { name: 'Inicio', path: '/' },
      { name: 'Mercado', path: '/mercado.html' },
    ],
  };
  pageConfig['seguros.html'].schemas = {
    webPageType: 'WebPage',
    breadcrumb: [
      { name: 'Inicio', path: '/' },
      { name: 'Seguros', path: '/seguros.html' },
    ],
  };
  pageConfig['terreno-lomas-de-jardin.html'].schemas = {
    webPageType: 'WebPage',
    breadcrumb: [
      { name: 'Inicio', path: '/' },
      { name: 'Mercado', path: '/mercado.html' },
      { name: 'Inmuebles', path: '/inmuebles.html' },
      { name: 'Terreno en Lomas de Jardín', path: '/terreno-lomas-de-jardin.html' },
    ],
  };
  pageConfig['titulos.html'].schemas = {
    webPageType: 'CollectionPage',
    breadcrumb: [
      { name: 'Inicio', path: '/' },
      { name: 'Títulos y capacitaciones', path: '/titulos.html' },
    ],
  };

  return pageConfig;
}

function syncHtmlFile(filename, config) {
  const filePath = path.join(ROOT_DIR, filename);
  let contents = readFile(filePath);
  const eol = detectEol(contents);

  contents = removeManagedSeo(contents);
  contents = ensureTitle(contents, config.title);
  contents = ensureMetaDescription(contents, config.description);
  contents = ensureCanonical(contents, config.canonical);

  const title = extractFirst(contents, /<title>([\s\S]*?)<\/title>/i, '<title>', filename).trim();
  const description = extractFirst(
    contents,
    /<meta\s+name="description"\s+content="([^"]*)"\s*\/?>/i,
    'meta description',
    filename
  ).trim();
  const canonical = config.sharePreview === false
    ? config.canonical || null
    : extractFirst(
        contents,
        /<link\s+rel="canonical"\s+href="([^"]+)"\s*\/?>/i,
        'canonical',
        filename
      ).trim();
  const sharePreview = config.sharePreview !== false;
  const robots = config.robots || DEFAULT_INDEX_ROBOTS;
  const imageUrl = sharePreview ? toAbsoluteUrl(config.imagePath) : '';
  const schemas = sharePreview
    ? buildSchemasForPage(config, canonical, title, description, imageUrl)
    : [];
  const seoBlock = buildSeoBlock({
    eol,
    title,
    description,
    canonical: canonical || '',
    imageUrl,
    robots,
    sharePreview,
    schemas,
  });

  contents = insertSeoBlock(contents, seoBlock);
  writeFile(filePath, contents);

  return {
    filename,
    canonical,
    includedInSitemap: Boolean(config.sitemap && canonical),
  };
}

function formatDateForSitemap(date) {
  return date.toISOString().slice(0, 10);
}

function writeRobotsTxt() {
  const lines = ['User-agent: *', 'Allow: /'];

  for (const disallowPath of ROBOTS_DISALLOW) {
    lines.push(`Disallow: ${disallowPath}`);
  }

  lines.push('', `Sitemap: ${SITE_URL}/sitemap.xml`, '');
  writeFile(path.join(ROOT_DIR, 'robots.txt'), lines.join('\n'));
}

function writeSitemap(entries) {
  const publicEntries = entries.filter(entry => entry.includedInSitemap);
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...publicEntries.map(entry => {
      const filePath = path.join(ROOT_DIR, entry.filename);
      const lastmod = formatDateForSitemap(fs.statSync(filePath).mtime);
      return [
        '  <url>',
        `    <loc>${entry.canonical}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        '  </url>',
      ].join('\n');
    }),
    '</urlset>',
    '',
  ].join('\n');

  writeFile(path.join(ROOT_DIR, 'sitemap.xml'), xml);
}

function main() {
  generateServicePages();

  const pageConfig = buildPageConfig();
  const entries = Object.entries(pageConfig).map(([filename, config]) =>
    syncHtmlFile(filename, config)
  );

  writeRobotsTxt();
  writeSitemap(entries);

  console.log(`SEO sincronizado para ${entries.length} páginas.`);
}

main();
