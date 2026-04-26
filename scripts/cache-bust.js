const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const VISUAL_CHANGE_RE = /^(css|js|img)\//i;
const HTML_RE = /\.html$/i;

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

function versionLocalAssets(content, version) {
  const assetUrl = String.raw`([^"']+\.(?:css|js|png|jpe?g|webp|svg|ico))`;
  const query = String.raw`(?:\?v=[^"']*)?`;
  const attrs = String.raw`([^>]*>)`;
  const tagAssetRe = new RegExp(
    String.raw`(<(?:link|script|img)\b[^>]*\b(?:href|src)=["'])` +
      String.raw`(?!https?:|mailto:|tel:|#|data:)` +
      assetUrl +
      query +
      String.raw`(["']` +
      attrs,
    'gi'
  );

  return content.replace(tagAssetRe, `$1$2?v=${version}$3`);
}

const changedFiles = gitStatusLines().map(statusPath);
const visualChanges = changedFiles.filter((file) => VISUAL_CHANGE_RE.test(file));

if (visualChanges.length === 0) {
  console.log('Cache: no hay cambios visuales para versionar.');
  process.exit(0);
}

const version = makeVersion();
const updated = [];

for (const file of htmlFiles()) {
  const content = fs.readFileSync(file, 'utf8');
  const next = versionLocalAssets(content, version);
  if (next !== content) {
    fs.writeFileSync(file, next, 'utf8');
    updated.push(path.basename(file));
  }
}

console.log(`Cache: version v=${version}`);
console.log(`Cache: cambios visuales detectados (${visualChanges.length}).`);

if (updated.length === 0) {
  console.log('Cache: no habia referencias HTML para actualizar.');
} else {
  console.log(`Cache: HTML actualizados (${updated.length}).`);
}
