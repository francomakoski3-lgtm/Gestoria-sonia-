const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const SITE_ORIGIN = 'https://gestoriasonia.ar/';
const VISUAL_CHANGE_RE = /^(css|js|img)\//i;
const HTML_RE = /\.html$/i;
const CSS_RE = /\.css$/i;
const ASSET_PATH_RE = /\.(?:css|js|png|jpe?g|webp|svg|ico)$/i;
const FORCE = process.argv.includes('--force');

function gitStatusLines() {
  try {
    return execFileSync('git', ['status', '--porcelain', '--untracked-files=all'], {
      cwd: ROOT,
      encoding: 'utf8',
    })
      .split(/\r?\n/)
      .filter(Boolean);
  } catch (error) {
    console.error('No se pudo leer el estado de Git.');
    process.exit(1);
  }
}

function statusPath(line) {
  const raw = line.slice(3).trim();
  const renamed = raw.match(/^(.+?) -> (.+)$/);
  return (renamed ? renamed[2] : raw).replace(/\\/g, '/');
}

function makeVersion() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    '-',
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join('');
}

function htmlFiles() {
  return fs
    .readdirSync(ROOT)
    .filter((name) => HTML_RE.test(name) && !name.startsWith('review_'))
    .map((name) => path.join(ROOT, name));
}

function cssFiles() {
  const cssDir = path.join(ROOT, 'css');
  if (!fs.existsSync(cssDir)) return [];

  return fs
    .readdirSync(cssDir)
    .filter((name) => CSS_RE.test(name))
    .map((name) => path.join(cssDir, name));
}

function splitAssetUrl(url) {
  const hashIndex = url.indexOf('#');
  const hash = hashIndex >= 0 ? url.slice(hashIndex) : '';
  const beforeHash = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
  const queryIndex = beforeHash.indexOf('?');

  return {
    pathPart: queryIndex >= 0 ? beforeHash.slice(0, queryIndex) : beforeHash,
    query: queryIndex >= 0 ? beforeHash.slice(queryIndex + 1) : '',
    hash,
  };
}

function isLocalOrSiteAsset(url) {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (/^(?:mailto:|tel:|#|data:|javascript:|blob:)/i.test(trimmed)) return false;
  if (/^\/\//.test(trimmed)) return false;

  if (/^https?:\/\//i.test(trimmed) && !trimmed.startsWith(SITE_ORIGIN)) {
    return false;
  }

  const { pathPart } = splitAssetUrl(trimmed);
  return ASSET_PATH_RE.test(pathPart);
}

function versionAssetUrl(url, version) {
  if (!isLocalOrSiteAsset(url)) return url;

  const { pathPart, query, hash } = splitAssetUrl(url.trim());
  const queryParts = query ? query.split('&').filter(Boolean) : [];
  let hasVersion = false;

  const nextQueryParts = queryParts.map((part) => {
    const key = part.split('=')[0];
    if (key === 'v') {
      hasVersion = true;
      return `v=${version}`;
    }
    return part;
  });

  if (!hasVersion) {
    nextQueryParts.push(`v=${version}`);
  }

  return `${pathPart}?${nextQueryParts.join('&')}${hash}`;
}

function versionCssAssets(content, version) {
  return content.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi, (match, quote, url) => {
    const nextUrl = versionAssetUrl(url, version);
    return `url(${quote}${nextUrl}${quote})`;
  });
}

function versionHtmlAssets(content, version) {
  let next = content.replace(
    /(\b(?:href|src|content)=["'])([^"']+)(["'])/gi,
    (match, prefix, url, suffix) => `${prefix}${versionAssetUrl(url, version)}${suffix}`
  );

  next = next.replace(
    /(["'])(https:\/\/gestoriasonia\.ar\/[^"']+\.(?:css|js|png|jpe?g|webp|svg|ico)(?:\?[^"']*)?)(["'])/gi,
    (match, quote, url, suffix) => `${quote}${versionAssetUrl(url, version)}${suffix}`
  );

  next = next.replace(
    /(["'])((?:\.\.?\/|\/)?(?:img|css|js)\/[^"']+\.(?:css|js|png|jpe?g|webp|svg|ico)(?:\?[^"']*)?)(["'])/gi,
    (match, quote, url, suffix) => `${quote}${versionAssetUrl(url, version)}${suffix}`
  );

  return versionCssAssets(next, version);
}

const changedFiles = gitStatusLines().map(statusPath);
const visualChanges = changedFiles.filter((file) => VISUAL_CHANGE_RE.test(file));

if (visualChanges.length === 0 && !FORCE) {
  console.log('Cache: no hay cambios visuales para versionar.');
  process.exit(0);
}

const version = makeVersion();
const updatedHtml = [];
const updatedCss = [];

for (const file of htmlFiles()) {
  const content = fs.readFileSync(file, 'utf8');
  const next = versionHtmlAssets(content, version);
  if (next !== content) {
    fs.writeFileSync(file, next, 'utf8');
    updatedHtml.push(path.basename(file));
  }
}

for (const file of cssFiles()) {
  const content = fs.readFileSync(file, 'utf8');
  const next = versionCssAssets(content, version);
  if (next !== content) {
    fs.writeFileSync(file, next, 'utf8');
    updatedCss.push(path.relative(ROOT, file).replace(/\\/g, '/'));
  }
}

console.log(`Cache: version v=${version}`);
console.log(FORCE ? 'Cache: versionado forzado.' : `Cache: cambios visuales detectados (${visualChanges.length}).`);

if (updatedHtml.length === 0 && updatedCss.length === 0) {
  console.log('Cache: no habia referencias para actualizar.');
} else {
  if (updatedHtml.length > 0) {
    console.log(`Cache: HTML actualizados (${updatedHtml.length}).`);
  }
  if (updatedCss.length > 0) {
    console.log(`Cache: CSS actualizados (${updatedCss.length}).`);
  }
}
