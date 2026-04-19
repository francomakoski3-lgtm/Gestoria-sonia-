const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { URL } = require('node:url');
const { DatabaseSync } = require('node:sqlite');

const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, 'data');
const DB_PATH = path.join(DATA_DIR, 'gestoria-sonia.db');
const UPLOADS_DIR = path.join(ROOT_DIR, 'uploads');
const PORT = Number.parseInt(process.env.PORT || '3000', 10);
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const COOKIE_NAME = 'gs_admin_session';
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';
const GOOGLE_PLACE_ID_ENV = process.env.GOOGLE_PLACE_ID || '';

// Cache de reseñas en memoria (se renueva cada 24 horas)
const reviewsCache = { data: null, expiresAt: 0, placeId: GOOGLE_PLACE_ID_ENV };
const REVIEWS_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const SESSION_DAYS = 30;
const MAX_BODY_SIZE = 30 * 1024 * 1024;
const DEFAULT_ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin1234';

// Rate limiting — protección contra fuerza bruta en el login
const loginAttempts = new Map(); // ip -> { count, resetAt }
const LOGIN_MAX_ATTEMPTS = 10;
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutos

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

const AUTO_SEEDS = [
  {
    title: 'Volkswagen Saveiro 1.9 SD',
    brand: 'Volkswagen',
    model: 'Saveiro',
    version: '1.9 SD',
    year: 2007,
    km: null,
    price: '$ 9.000.000',
    currency: 'ARS',
    vehicleType: 'pickup',
    fuel: 'Diesel',
    transmission: 'Manual',
    color: 'Plata',
    doors: 2,
    engine: '1.9',
    steering: 'Hidraulica',
    traction: 'Delantera',
    cabin: 'Simple',
    status: 'venta',
    location: 'Jardin America, Misiones',
    description:
      'Saveiro diesel 1.9 modelo 2007. Motor funcionando, papeles al dia y detalles visibles en chapa. El precio es charlable y la publicacion corresponde a una unidad real disponible hoy.',
    coverImage: 'img/autos/saveiro/saveiro-06.jpg',
    galleryImages: [
      'img/autos/saveiro/saveiro-06.jpg',
      'img/autos/saveiro/saveiro-04.jpg',
      'img/autos/saveiro/saveiro-02.jpg',
      'img/autos/saveiro/saveiro-03.jpg',
      'img/autos/saveiro/saveiro-05.jpg',
      'img/autos/saveiro/saveiro-01.jpg'
    ],
    highlights: ['Papeles al dia', 'Vende el titular', 'Motor funcionando', 'Detalles en chapa'],
    featured: true
  }
];

const PROPERTY_SEEDS = [
  {
    title: 'Terreno en esquina en Lomas de Jardin',
    location: 'Barrio Lomas de Jardin, Jardin America',
    propertyType: 'lote',
    operation: 'venta',
    status: 'venta',
    price: 'USD 20.000',
    currency: 'USD',
    bedrooms: null,
    bathrooms: null,
    areaM2: null,
    landAreaM2: 603.5,
    dimensions: '17 x 35,5 m',
    corner: true,
    access: 'Empedrado',
    infrastructure: 'Cordon cuneta en ambos lados',
    mapUrl:
      'https://www.google.com/maps/place/27%C2%B002%2742.3%22S+55%C2%B013%2709.5%22W/@-27.0451687,-55.2213766,17.25z/data=!4m4!3m3!8m2!3d-27.0450821!4d-55.2192993!5m1!1e1?hl=es&entry=ttu&g_ep=EgoyMDI2MDQwNi4wIKXMDSoASAFQAw%3D%3D',
    description:
      'Terreno en esquina ubicado en Barrio Lomas de Jardin. Tiene 17 x 35,5 metros, acceso por calle empedrada, cordon cuneta en ambos frentes y una ubicacion muy comoda dentro de Jardin America.',
    coverImage: 'img/inmuebles/lomas-de-jardin/terreno-01.jpeg',
    galleryImages: [
      'img/inmuebles/lomas-de-jardin/terreno-01.jpeg',
      'img/inmuebles/lomas-de-jardin/terreno-medidas.jpeg',
      'img/inmuebles/lomas-de-jardin/ubicacion-mapa.jpeg'
    ],
    highlights: [
      'Esquina',
      '17 x 35,5 m',
      'A 6 cuadras del Hospital Nuevo',
      'A 6 cuadras de Plaza Colon'
    ],
    featured: true
  }
];

ensureDir(DATA_DIR);
ensureDir(UPLOADS_DIR);
ensureDir(path.join(UPLOADS_DIR, 'autos'));
ensureDir(path.join(UPLOADS_DIR, 'inmuebles'));

const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA journal_mode = WAL;');

initDatabase();
ensureDefaultAdmin();
seedListings();

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || `127.0.0.1:${PORT}`}`);
    const pathname = url.pathname;

    if (pathname.startsWith('/api/')) {
      await handleApi(req, res, url);
      return;
    }

    await serveStatic(req, res, pathname);
  } catch (error) {
    console.error(error);
    sendJson(res, error.statusCode || 500, {
      error: error.expose ? error.message : 'Ocurrio un error interno en el servidor.'
    });
  }
});

server.listen(PORT, () => {
  console.log(`Gestoria Sonia lista en http://localhost:${PORT}`);
  console.log(`Panel administrativo: http://localhost:${PORT}/admin.html`);
});

function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS autos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      brand TEXT,
      model TEXT,
      version TEXT,
      year INTEGER,
      km INTEGER,
      price TEXT NOT NULL,
      currency TEXT NOT NULL,
      vehicle_type TEXT,
      fuel TEXT,
      transmission TEXT,
      color TEXT,
      doors INTEGER,
      engine TEXT,
      steering TEXT,
      traction TEXT,
      cabin TEXT,
      status TEXT NOT NULL,
      location TEXT,
      description TEXT NOT NULL,
      cover_image TEXT,
      gallery_json TEXT NOT NULL DEFAULT '[]',
      highlights_json TEXT NOT NULL DEFAULT '[]',
      featured INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      location TEXT,
      property_type TEXT,
      operation TEXT NOT NULL,
      status TEXT NOT NULL,
      price TEXT NOT NULL,
      currency TEXT NOT NULL,
      bedrooms INTEGER,
      bathrooms INTEGER,
      area_m2 REAL,
      land_area_m2 REAL,
      dimensions TEXT,
      corner INTEGER NOT NULL DEFAULT 0,
      access TEXT,
      infrastructure TEXT,
      map_url TEXT,
      description TEXT NOT NULL,
      cover_image TEXT,
      gallery_json TEXT NOT NULL DEFAULT '[]',
      highlights_json TEXT NOT NULL DEFAULT '[]',
      featured INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS consumer_withdrawal_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      contact_email TEXT,
      contact_phone TEXT,
      service_name TEXT NOT NULL,
      contract_date TEXT NOT NULL,
      details TEXT,
      origin_channel TEXT NOT NULL,
      page_url TEXT,
      status TEXT NOT NULL DEFAULT 'received',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

function ensureDefaultAdmin() {
  const existing = getRow('SELECT id FROM users LIMIT 1');
  if (existing) return;

  const now = nowIso();
  const password = createPasswordHash(DEFAULT_ADMIN_PASSWORD);

  runStatement(
    `
      INSERT INTO users (username, password_hash, password_salt, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `,
    DEFAULT_ADMIN_USER,
    password.hash,
    password.salt,
    now,
    now
  );

  console.log('Usuario administrador inicial creado.');
  console.log(`Usuario: ${DEFAULT_ADMIN_USER}`);
  console.log('Clave: definida por variable de entorno ADMIN_PASSWORD (o el valor por defecto).');
  console.log('Cambia la clave desde el panel despues del primer acceso.');
}

function seedListings() {
  const autosCount = getRow('SELECT COUNT(*) AS total FROM autos').total;
  if (!autosCount) {
    AUTO_SEEDS.forEach(seed => insertAuto(seed));
  }

  const propertiesCount = getRow('SELECT COUNT(*) AS total FROM properties').total;
  if (!propertiesCount) {
    PROPERTY_SEEDS.forEach(seed => insertProperty(seed));
  }
}
async function handleApi(req, res, url) {
  const pathname = url.pathname;

  if (req.method === 'GET' && pathname === '/api/health') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/auth/login') {
    // Rate limiting por IP
    const ip = req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const record = loginAttempts.get(ip) || { count: 0, resetAt: now + LOGIN_WINDOW_MS };
    if (now > record.resetAt) { record.count = 0; record.resetAt = now + LOGIN_WINDOW_MS; }
    if (record.count >= LOGIN_MAX_ATTEMPTS) {
      const waitMin = Math.ceil((record.resetAt - now) / 60000);
      throw createHttpError(429, `Demasiados intentos. Esperá ${waitMin} minuto(s).`, true);
    }
    record.count++;
    loginAttempts.set(ip, record);

    const body = await readJsonBody(req);
    const username = readString(body.username);
    const password = readString(body.password);

    if (!username || !password) {
      throw createHttpError(400, 'Completa usuario y contrasena.', true);
    }

    const user = getRow('SELECT * FROM users WHERE username = ?', username);
    const isValid =
      user && verifyPassword(password, user.password_salt, user.password_hash);

    if (!isValid) {
      throw createHttpError(401, 'Usuario o contrasena incorrectos.', true);
    }

    // Login exitoso: limpiar contador de la IP
    loginAttempts.delete(ip);

    const session = createSession(user.id);
    setCookie(res, COOKIE_NAME, session.token, {
      httpOnly: true,
      maxAge: SESSION_DAYS * 24 * 60 * 60,
      path: '/',
      sameSite: 'Lax',
      secure: IS_PRODUCTION  // HTTPS en producción
    });

    sendJson(res, 200, { user: { id: user.id, username: user.username } });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/auth/logout') {
    const session = getSession(req);
    if (session) {
      runStatement('DELETE FROM sessions WHERE id = ?', session.sessionId);
    }
    clearCookie(res, COOKIE_NAME);
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/auth/me') {
    const session = getSession(req);
    if (!session) {
      sendJson(res, 200, { authenticated: false });
      return;
    }

    sendJson(res, 200, {
      authenticated: true,
      user: { id: session.userId, username: session.username }
    });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/auth/change-password') {
    const session = requireAuth(req);
    const body = await readJsonBody(req);
    const currentPassword = readString(body.currentPassword);
    const nextPassword = readString(body.nextPassword);

    if (!currentPassword || !nextPassword) {
      throw createHttpError(400, 'Completa la clave actual y la nueva.', true);
    }

    if (nextPassword.length < 8) {
      throw createHttpError(400, 'La nueva clave debe tener al menos 8 caracteres.', true);
    }

    const user = getRow('SELECT * FROM users WHERE id = ?', session.userId);
    if (!user || !verifyPassword(currentPassword, user.password_salt, user.password_hash)) {
      throw createHttpError(401, 'La clave actual no coincide.', true);
    }

    const updatedPassword = createPasswordHash(nextPassword);
    runStatement(
      `
        UPDATE users
        SET password_hash = ?, password_salt = ?, updated_at = ?
        WHERE id = ?
      `,
      updatedPassword.hash,
      updatedPassword.salt,
      nowIso(),
      session.userId
    );

    runStatement(
      'DELETE FROM sessions WHERE user_id = ? AND id <> ?',
      session.userId,
      session.sessionId
    );

    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/admin/dashboard') {
    requireAuth(req);

    const stats = {
      autos: getRow('SELECT COUNT(*) AS total FROM autos').total,
      inmuebles: getRow('SELECT COUNT(*) AS total FROM properties').total,
      destacados:
        getRow('SELECT COUNT(*) AS total FROM autos WHERE featured = 1').total +
        getRow('SELECT COUNT(*) AS total FROM properties WHERE featured = 1').total
    };

    sendJson(res, 200, stats);
    return;
  }

  if (req.method === 'GET' && pathname === '/api/admin/consumer-withdrawals') {
    requireAuth(req);
    sendJson(res, 200, { items: listConsumerWithdrawalRequests() });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/consumer/withdrawals') {
    const body = await readJsonBody(req);
    const request = createConsumerWithdrawalRequest(normalizeConsumerWithdrawalInput(body));
    sendJson(res, 201, { request });
    return;
  }

  if (pathname === '/api/autos' && req.method === 'GET') {
    sendJson(res, 200, { items: listAutos() });
    return;
  }

  if (pathname === '/api/autos' && req.method === 'POST') {
    requireAuth(req);
    const body = await readJsonBody(req);
    const auto = insertAuto(normalizeAutoInput(body));
    sendJson(res, 201, { item: auto });
    return;
  }

  const autoMatch = pathname.match(/^\/api\/autos\/(\d+)$/);
  if (autoMatch) {
    const autoId = Number.parseInt(autoMatch[1], 10);

    if (req.method === 'GET') {
      const auto = getAutoById(autoId);
      if (!auto) throw createHttpError(404, 'Vehiculo no encontrado.', true);
      sendJson(res, 200, { item: auto });
      return;
    }

    if (req.method === 'PUT') {
      requireAuth(req);
      const current = getAutoRow(autoId);
      if (!current) throw createHttpError(404, 'Vehiculo no encontrado.', true);

      const body = await readJsonBody(req);
      const auto = updateAuto(autoId, normalizeAutoInput(body, current));
      sendJson(res, 200, { item: auto });
      return;
    }

    if (req.method === 'DELETE') {
      requireAuth(req);
      const current = getAutoRow(autoId);
      if (!current) throw createHttpError(404, 'Vehiculo no encontrado.', true);
      runStatement('DELETE FROM autos WHERE id = ?', autoId);
      sendJson(res, 200, { ok: true });
      return;
    }
  }

  if (pathname === '/api/inmuebles' && req.method === 'GET') {
    sendJson(res, 200, { items: listProperties() });
    return;
  }

  if (pathname === '/api/inmuebles' && req.method === 'POST') {
    requireAuth(req);
    const body = await readJsonBody(req);
    const property = insertProperty(normalizePropertyInput(body));
    sendJson(res, 201, { item: property });
    return;
  }

  const propertyMatch = pathname.match(/^\/api\/inmuebles\/(\d+)$/);
  if (propertyMatch) {
    const propertyId = Number.parseInt(propertyMatch[1], 10);

    if (req.method === 'GET') {
      const property = getPropertyById(propertyId);
      if (!property) throw createHttpError(404, 'Propiedad no encontrada.', true);
      sendJson(res, 200, { item: property });
      return;
    }

    if (req.method === 'PUT') {
      requireAuth(req);
      const current = getPropertyRow(propertyId);
      if (!current) throw createHttpError(404, 'Propiedad no encontrada.', true);

      const body = await readJsonBody(req);
      const property = updateProperty(propertyId, normalizePropertyInput(body, current));
      sendJson(res, 200, { item: property });
      return;
    }

    if (req.method === 'DELETE') {
      requireAuth(req);
      const current = getPropertyRow(propertyId);
      if (!current) throw createHttpError(404, 'Propiedad no encontrada.', true);
      runStatement('DELETE FROM properties WHERE id = ?', propertyId);
      sendJson(res, 200, { ok: true });
      return;
    }
  }

  if (req.method === 'GET' && pathname === '/api/reviews') {
    const result = await getGoogleReviews();
    sendJson(res, 200, result);
    return;
  }

  throw createHttpError(404, 'Ruta no encontrada.', true);
}

async function serveStatic(req, res, pathname) {
  if (!['GET', 'HEAD'].includes(req.method)) {
    throw createHttpError(405, 'Metodo no permitido.');
  }

  const requestedPath =
    pathname === '/admin' || pathname === '/panel' ? '/admin.html' : pathname;
  const filePath = resolvePublicFile(requestedPath === '/' ? '/index.html' : requestedPath);

  if (!filePath || !fs.existsSync(filePath)) {
    throw createHttpError(404, 'Archivo no encontrado.', true);
  }

  const stat = fs.statSync(filePath);
  if (!stat.isFile()) {
    throw createHttpError(404, 'Archivo no encontrado.', true);
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Length': stat.size,
    'Content-Type': contentType,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    ...(IS_PRODUCTION && { 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains' })
  });

  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  fs.createReadStream(filePath).pipe(res);
}

function resolvePublicFile(requestPath) {
  const decodedPath = decodeURIComponent(requestPath);
  const normalizedPath = path.normalize(decodedPath).replace(/^(\.\.(\/|\\|$))+/, '');
  const candidate = path.resolve(ROOT_DIR, `.${path.sep}${normalizedPath}`);
  if (!candidate.startsWith(ROOT_DIR)) return null;
  return candidate;
}
function listAutos() {
  return allRows(`
    SELECT *
    FROM autos
    ORDER BY featured DESC, updated_at DESC, id DESC
  `).map(mapAutoRow);
}

function listProperties() {
  return allRows(`
    SELECT *
    FROM properties
    ORDER BY featured DESC, updated_at DESC, id DESC
  `).map(mapPropertyRow);
}

function listConsumerWithdrawalRequests() {
  return allRows(`
    SELECT *
    FROM consumer_withdrawal_requests
    ORDER BY created_at DESC, id DESC
    LIMIT 200
  `).map(mapConsumerWithdrawalRow);
}

function getAutoRow(id) {
  return getRow('SELECT * FROM autos WHERE id = ?', id);
}

function getAutoById(id) {
  const row = getAutoRow(id);
  return row ? mapAutoRow(row) : null;
}

function getPropertyRow(id) {
  return getRow('SELECT * FROM properties WHERE id = ?', id);
}

function getPropertyById(id) {
  const row = getPropertyRow(id);
  return row ? mapPropertyRow(row) : null;
}

function insertAuto(input) {
  const now = nowIso();
  const result = runStatement(
    `
      INSERT INTO autos (
        title, brand, model, version, year, km, price, currency, vehicle_type,
        fuel, transmission, color, doors, engine, steering, traction, cabin,
        status, location, description, cover_image, gallery_json, highlights_json,
        featured, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    input.title,
    input.brand,
    input.model,
    input.version,
    input.year,
    input.km,
    input.price,
    input.currency,
    input.vehicleType,
    input.fuel,
    input.transmission,
    input.color,
    input.doors,
    input.engine,
    input.steering,
    input.traction,
    input.cabin,
    input.status,
    input.location,
    input.description,
    input.coverImage,
    JSON.stringify(input.galleryImages),
    JSON.stringify(input.highlights),
    input.featured ? 1 : 0,
    now,
    now
  );

  return getAutoById(Number(result.lastInsertRowid));
}

function updateAuto(id, input) {
  runStatement(
    `
      UPDATE autos
      SET
        title = ?,
        brand = ?,
        model = ?,
        version = ?,
        year = ?,
        km = ?,
        price = ?,
        currency = ?,
        vehicle_type = ?,
        fuel = ?,
        transmission = ?,
        color = ?,
        doors = ?,
        engine = ?,
        steering = ?,
        traction = ?,
        cabin = ?,
        status = ?,
        location = ?,
        description = ?,
        cover_image = ?,
        gallery_json = ?,
        highlights_json = ?,
        featured = ?,
        updated_at = ?
      WHERE id = ?
    `,
    input.title,
    input.brand,
    input.model,
    input.version,
    input.year,
    input.km,
    input.price,
    input.currency,
    input.vehicleType,
    input.fuel,
    input.transmission,
    input.color,
    input.doors,
    input.engine,
    input.steering,
    input.traction,
    input.cabin,
    input.status,
    input.location,
    input.description,
    input.coverImage,
    JSON.stringify(input.galleryImages),
    JSON.stringify(input.highlights),
    input.featured ? 1 : 0,
    nowIso(),
    id
  );

  return getAutoById(id);
}

function insertProperty(input) {
  const now = nowIso();
  const result = runStatement(
    `
      INSERT INTO properties (
        title, location, property_type, operation, status, price, currency,
        bedrooms, bathrooms, area_m2, land_area_m2, dimensions, corner,
        access, infrastructure, map_url, description, cover_image,
        gallery_json, highlights_json, featured, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    input.title,
    input.location,
    input.propertyType,
    input.operation,
    input.status,
    input.price,
    input.currency,
    input.bedrooms,
    input.bathrooms,
    input.areaM2,
    input.landAreaM2,
    input.dimensions,
    input.corner ? 1 : 0,
    input.access,
    input.infrastructure,
    input.mapUrl,
    input.description,
    input.coverImage,
    JSON.stringify(input.galleryImages),
    JSON.stringify(input.highlights),
    input.featured ? 1 : 0,
    now,
    now
  );

  return getPropertyById(Number(result.lastInsertRowid));
}

function createConsumerWithdrawalRequest(input) {
  const now = nowIso();
  const code = buildConsumerWithdrawalCode();

  runStatement(
    `
      INSERT INTO consumer_withdrawal_requests (
        code,
        full_name,
        contact_email,
        contact_phone,
        service_name,
        contract_date,
        details,
        origin_channel,
        page_url,
        status,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'received', ?, ?)
    `,
    code,
    input.fullName,
    input.contactEmail,
    input.contactPhone,
    input.serviceName,
    input.contractDate,
    input.details,
    input.originChannel,
    input.pageUrl,
    now,
    now
  );

  console.log(`[Arrepentimiento] ${code} - ${input.fullName} - ${input.serviceName}`);

  return {
    code,
    fullName: input.fullName,
    serviceName: input.serviceName,
    contractDate: input.contractDate,
    status: 'received',
    createdAt: now
  };
}

function updateProperty(id, input) {
  runStatement(
    `
      UPDATE properties
      SET
        title = ?,
        location = ?,
        property_type = ?,
        operation = ?,
        status = ?,
        price = ?,
        currency = ?,
        bedrooms = ?,
        bathrooms = ?,
        area_m2 = ?,
        land_area_m2 = ?,
        dimensions = ?,
        corner = ?,
        access = ?,
        infrastructure = ?,
        map_url = ?,
        description = ?,
        cover_image = ?,
        gallery_json = ?,
        highlights_json = ?,
        featured = ?,
        updated_at = ?
      WHERE id = ?
    `,
    input.title,
    input.location,
    input.propertyType,
    input.operation,
    input.status,
    input.price,
    input.currency,
    input.bedrooms,
    input.bathrooms,
    input.areaM2,
    input.landAreaM2,
    input.dimensions,
    input.corner ? 1 : 0,
    input.access,
    input.infrastructure,
    input.mapUrl,
    input.description,
    input.coverImage,
    JSON.stringify(input.galleryImages),
    JSON.stringify(input.highlights),
    input.featured ? 1 : 0,
    nowIso(),
    id
  );

  return getPropertyById(id);
}
function normalizeAutoInput(payload, existingRow) {
  const galleryImages = resolveImageArray(
    payload.galleryImages,
    'autos',
    existingRow ? parseJsonArray(existingRow.gallery_json) : []
  );
  const currentCover = existingRow ? existingRow.cover_image : null;
  const coverImage =
    resolveImageValue(payload.coverImage, 'autos', currentCover) ||
    galleryImages[0] ||
    null;

  const auto = {
    title: readString(payload.title),
    brand: readNullableString(payload.brand),
    model: readNullableString(payload.model),
    version: readNullableString(payload.version),
    year: readNullableInteger(payload.year),
    km: readNullableInteger(payload.km),
    price: readString(payload.price),
    currency: readString(payload.currency) || 'ARS',
    vehicleType: readNullableString(payload.vehicleType),
    fuel: readNullableString(payload.fuel),
    transmission: readNullableString(payload.transmission),
    color: readNullableString(payload.color),
    doors: readNullableInteger(payload.doors),
    engine: readNullableString(payload.engine),
    steering: readNullableString(payload.steering),
    traction: readNullableString(payload.traction),
    cabin: readNullableString(payload.cabin),
    status: readString(payload.status) || 'venta',
    location: readNullableString(payload.location),
    description: readString(payload.description),
    coverImage,
    galleryImages,
    highlights: readStringArray(payload.highlights),
    featured: toBoolean(payload.featured)
  };

  if (!auto.title) {
    throw createHttpError(400, 'El nombre del vehiculo es obligatorio.', true);
  }
  if (!auto.price) {
    throw createHttpError(400, 'El precio del vehiculo es obligatorio.', true);
  }
  if (!auto.description) {
    throw createHttpError(400, 'La descripcion del vehiculo es obligatoria.', true);
  }

  return auto;
}

function normalizePropertyInput(payload, existingRow) {
  const galleryImages = resolveImageArray(
    payload.galleryImages,
    'inmuebles',
    existingRow ? parseJsonArray(existingRow.gallery_json) : []
  );
  const currentCover = existingRow ? existingRow.cover_image : null;
  const coverImage =
    resolveImageValue(payload.coverImage, 'inmuebles', currentCover) ||
    galleryImages[0] ||
    null;

  const property = {
    title: readString(payload.title),
    location: readNullableString(payload.location),
    propertyType: readNullableString(payload.propertyType),
    operation: readString(payload.operation) || 'venta',
    status: readString(payload.status) || readString(payload.operation) || 'venta',
    price: readString(payload.price),
    currency: readString(payload.currency) || 'USD',
    bedrooms: readNullableInteger(payload.bedrooms),
    bathrooms: readNullableInteger(payload.bathrooms),
    areaM2: readNullableFloat(payload.areaM2),
    landAreaM2: readNullableFloat(payload.landAreaM2),
    dimensions: readNullableString(payload.dimensions),
    corner: toBoolean(payload.corner),
    access: readNullableString(payload.access),
    infrastructure: readNullableString(payload.infrastructure),
    mapUrl: readNullableString(payload.mapUrl),
    description: readString(payload.description),
    coverImage,
    galleryImages,
    highlights: readStringArray(payload.highlights),
    featured: toBoolean(payload.featured)
  };

  if (!property.title) {
    throw createHttpError(400, 'El nombre del inmueble es obligatorio.', true);
  }
  if (!property.price) {
    throw createHttpError(400, 'El precio del inmueble es obligatorio.', true);
  }
  if (!property.description) {
    throw createHttpError(400, 'La descripcion del inmueble es obligatoria.', true);
  }

  return property;
}

function normalizeConsumerWithdrawalInput(payload) {
  const fullName = readString(payload.fullName);
  const serviceName = readString(payload.serviceName);
  const contractDate = readString(payload.contractDate);
  const details = readNullableString(payload.details);
  const originChannel = readString(payload.originChannel) || 'web';
  const pageUrl = readNullableString(payload.pageUrl);
  const acceptedPrivacy = toBoolean(payload.acceptedPrivacy);

  const contactEmailRaw = readNullableString(payload.contactEmail);
  const contactEmail = contactEmailRaw ? contactEmailRaw.toLowerCase() : null;
  const contactPhone = readNullableString(payload.contactPhone);

  if (!fullName) {
    throw createHttpError(400, 'Ingresa tu nombre y apellido.', true);
  }
  if (fullName.length > 120) {
    throw createHttpError(400, 'El nombre informado es demasiado largo.', true);
  }
  if (!serviceName) {
    throw createHttpError(400, 'Indica el servicio o contratacion que queres revocar.', true);
  }
  if (serviceName.length > 160) {
    throw createHttpError(400, 'El detalle del servicio es demasiado largo.', true);
  }
  if (!contractDate || !isValidIsoDate(contractDate)) {
    throw createHttpError(400, 'Ingresa una fecha valida de contratacion.', true);
  }
  if (!contactEmail && !contactPhone) {
    throw createHttpError(400, 'Ingresa un correo electronico o telefono de contacto.', true);
  }
  if (contactEmail && !isValidEmail(contactEmail)) {
    throw createHttpError(400, 'Ingresa un correo electronico valido.', true);
  }
  if (contactPhone && contactPhone.length > 40) {
    throw createHttpError(400, 'El telefono informado es demasiado largo.', true);
  }
  if (details && details.length > 1500) {
    throw createHttpError(400, 'La descripcion supera el limite permitido.', true);
  }
  if (!acceptedPrivacy) {
    throw createHttpError(400, 'Debes aceptar la politica de privacidad para continuar.', true);
  }

  return {
    fullName,
    contactEmail,
    contactPhone,
    serviceName,
    contractDate,
    details,
    originChannel,
    pageUrl
  };
}

function mapAutoRow(row) {
  return {
    id: row.id,
    title: row.title,
    brand: row.brand || '',
    model: row.model || '',
    version: row.version || '',
    year: row.year,
    km: row.km,
    price: row.price,
    currency: row.currency,
    vehicleType: row.vehicle_type || '',
    fuel: row.fuel || '',
    transmission: row.transmission || '',
    color: row.color || '',
    doors: row.doors,
    engine: row.engine || '',
    steering: row.steering || '',
    traction: row.traction || '',
    cabin: row.cabin || '',
    status: row.status,
    location: row.location || '',
    description: row.description,
    coverImage: row.cover_image || '',
    galleryImages: parseJsonArray(row.gallery_json),
    highlights: parseJsonArray(row.highlights_json),
    featured: Boolean(row.featured),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapPropertyRow(row) {
  return {
    id: row.id,
    title: row.title,
    location: row.location || '',
    propertyType: row.property_type || '',
    operation: row.operation,
    status: row.status,
    price: row.price,
    currency: row.currency,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    areaM2: row.area_m2,
    landAreaM2: row.land_area_m2,
    dimensions: row.dimensions || '',
    corner: Boolean(row.corner),
    access: row.access || '',
    infrastructure: row.infrastructure || '',
    mapUrl: row.map_url || '',
    description: row.description,
    coverImage: row.cover_image || '',
    galleryImages: parseJsonArray(row.gallery_json),
    highlights: parseJsonArray(row.highlights_json),
    featured: Boolean(row.featured),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapConsumerWithdrawalRow(row) {
  return {
    id: row.id,
    code: row.code,
    fullName: row.full_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    serviceName: row.service_name,
    contractDate: row.contract_date,
    details: row.details,
    originChannel: row.origin_channel,
    pageUrl: row.page_url,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(token);
  const now = nowIso();
  const expiresAt = new Date(
    Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();

  runStatement(
    `
      INSERT INTO sessions (user_id, token_hash, created_at, expires_at)
      VALUES (?, ?, ?, ?)
    `,
    userId,
    tokenHash,
    now,
    expiresAt
  );

  return { token, expiresAt };
}

function getSession(req) {
  const cookies = parseCookies(req.headers.cookie || '');
  const token = cookies[COOKIE_NAME];
  if (!token) return null;

  const session = getRow(
    `
      SELECT
        sessions.id AS session_id,
        sessions.user_id,
        sessions.expires_at,
        users.username
      FROM sessions
      JOIN users ON users.id = sessions.user_id
      WHERE sessions.token_hash = ?
        AND sessions.expires_at > ?
      LIMIT 1
    `,
    hashToken(token),
    nowIso()
  );

  if (!session) return null;

  return {
    sessionId: session.session_id,
    userId: session.user_id,
    username: session.username,
    expiresAt: session.expires_at
  };
}

function requireAuth(req) {
  const session = getSession(req);
  if (!session) {
    throw createHttpError(401, 'Necesitas iniciar sesion.', true);
  }
  return session;
}

function createPasswordHash(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

function verifyPassword(password, salt, expectedHash) {
  const currentHash = crypto.scryptSync(password, salt, 64);
  const savedHash = Buffer.from(expectedHash, 'hex');
  return currentHash.length === savedHash.length && crypto.timingSafeEqual(currentHash, savedHash);
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function parseCookies(header) {
  return header
    .split(';')
    .map(item => item.trim())
    .filter(Boolean)
    .reduce((cookies, pair) => {
      const separatorIndex = pair.indexOf('=');
      if (separatorIndex === -1) return cookies;
      const key = pair.slice(0, separatorIndex);
      const value = pair.slice(separatorIndex + 1);
      cookies[key] = decodeURIComponent(value);
      return cookies;
    }, {});
}

function setCookie(res, name, value, options) {
  const cookie = [
    `${name}=${encodeURIComponent(value)}`,
    'HttpOnly',
    `Max-Age=${options.maxAge}`,
    `Path=${options.path || '/'}`,
    `SameSite=${options.sameSite || 'Lax'}`
  ].join('; ');

  appendSetCookie(res, cookie);
}

function clearCookie(res, name) {
  appendSetCookie(res, `${name}=; HttpOnly; Max-Age=0; Path=/; SameSite=Lax`);
}

function appendSetCookie(res, cookie) {
  const current = res.getHeader('Set-Cookie');
  if (!current) {
    res.setHeader('Set-Cookie', cookie);
    return;
  }

  if (Array.isArray(current)) {
    res.setHeader('Set-Cookie', [...current, cookie]);
    return;
  }

  res.setHeader('Set-Cookie', [current, cookie]);
}
async function readJsonBody(req) {
  const rawBody = await readRawBody(req);
  if (!rawBody) return {};

  try {
    return JSON.parse(rawBody);
  } catch {
    throw createHttpError(400, 'JSON invalido.', true);
  }
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];

    req.on('data', chunk => {
      size += chunk.length;
      if (size > MAX_BODY_SIZE) {
        reject(createHttpError(413, 'El contenido es demasiado grande.', true));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf8'));
    });

    req.on('error', reject);
  });
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'application/json; charset=utf-8'
  });
  res.end(body);
}

function createHttpError(statusCode, message, expose = false) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.expose = expose;
  return error;
}

function readString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function readNullableString(value) {
  const parsed = readString(value);
  return parsed || null;
}

function readNullableInteger(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function readNullableFloat(value) {
  if (value === null || value === undefined || value === '') return null;
  const normalized = String(value).replace(',', '.');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function readStringArray(value) {
  if (Array.isArray(value)) {
    return value.map(readString).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean);
  }

  return [];
}

function toBoolean(value) {
  return value === true || value === 1 || value === '1' || value === 'true' || value === 'on';
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return false;

  const [year, month, day] = value.split('-').map(Number);
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() + 1 === month &&
    parsed.getUTCDate() === day
  );
}

function buildConsumerWithdrawalCode() {
  const date = new Date();
  const stamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('');
  const suffix = crypto.randomInt(1000, 9999);

  return `ARREP-${stamp}-${suffix}`;
}

function parseJsonArray(value) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function resolveImageArray(value, folderName, fallback) {
  if (!Array.isArray(value)) return fallback || [];

  return value
    .map(item => resolveImageValue(item, folderName, null))
    .filter(Boolean);
}

function resolveImageValue(value, folderName, fallback) {
  if (value === null || value === undefined) return fallback || null;
  if (typeof value === 'string') return value.trim() || fallback || null;

  if (value.kind === 'existing' && typeof value.url === 'string') {
    return value.url.trim() || fallback || null;
  }

  if (value.kind === 'upload' && typeof value.dataUrl === 'string') {
    return saveDataUrlImage(folderName, value.name, value.dataUrl);
  }

  return fallback || null;
}

function saveDataUrlImage(folderName, originalName, dataUrl) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw createHttpError(400, 'Una imagen no tiene un formato valido.', true);
  }

  const mimeType = match[1];
  const base64 = match[2];
  const extension = getImageExtension(mimeType, originalName);
  const safeBaseName = slugify(path.parse(originalName || 'imagen').name || 'imagen');
  const fileName = `${Date.now()}-${crypto.randomUUID()}-${safeBaseName}${extension}`;
  const targetDir = path.join(UPLOADS_DIR, folderName);
  ensureDir(targetDir);

  fs.writeFileSync(path.join(targetDir, fileName), Buffer.from(base64, 'base64'));
  return path.posix.join('uploads', folderName, fileName);
}

function getImageExtension(mimeType, originalName) {
  const byName = path.extname(originalName || '').toLowerCase();
  if (byName) return byName;

  const map = {
    'image/gif': '.gif',
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/svg+xml': '.svg',
    'image/webp': '.webp'
  };

  return map[mimeType] || '.png';
}

function slugify(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}
async function getGoogleReviews() {
  if (!GOOGLE_PLACES_API_KEY) {
    return { fallback: true };
  }

  if (reviewsCache.data && Date.now() < reviewsCache.expiresAt) {
    return reviewsCache.data;
  }

  try {
    if (!reviewsCache.placeId) {
      const searchRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
          'X-Goog-FieldMask': 'places.id'
        },
        body: JSON.stringify({ textQuery: 'GESTORÍA Sonia Altamirano Jardín América Misiones' })
      });
      const searchData = await searchRes.json();
      const placeId = searchData?.places?.[0]?.id;
      if (!placeId) return { fallback: true };
      reviewsCache.placeId = placeId;
    }

    const detailRes = await fetch(
      `https://places.googleapis.com/v1/places/${reviewsCache.placeId}`,
      {
        headers: {
          'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
          'X-Goog-FieldMask': 'id,rating,userRatingsTotal,reviews'
        }
      }
    );
    const detail = await detailRes.json();

    const reviews = (detail.reviews || []).map(r => ({
      author: r.authorAttribution?.displayName || 'Cliente',
      photoUrl: r.authorAttribution?.photoUri || null,
      rating: r.rating || 5,
      text: r.text?.text || '',
      relativeTime: r.relativePublishTimeDescription || ''
    }));

    const result = {
      rating: detail.rating || null,
      totalRatings: detail.userRatingsTotal || null,
      reviews,
      fetchedAt: new Date().toISOString()
    };

    reviewsCache.data = result;
    reviewsCache.expiresAt = Date.now() + REVIEWS_CACHE_TTL_MS;

    return result;
  } catch (err) {
    console.error('[reviews] Error al obtener reseñas de Google:', err.message);
    return { fallback: true };
  }
}

function ensureDir(target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
}
function nowIso() {
  return new Date().toISOString();
}

function getRow(sql, ...params) {
  return db.prepare(sql).get(...params);
}

function allRows(sql, ...params) {
  return db.prepare(sql).all(...params);
}

function runStatement(sql, ...params) {
  return db.prepare(sql).run(...params);
}
