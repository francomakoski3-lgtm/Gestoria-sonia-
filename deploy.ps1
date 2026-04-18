# ============================================================
#  deploy.ps1 — Script de deploy para Gestoria Sonia
#  Uso: click derecho → "Ejecutar con PowerShell"
#        o desde terminal: .\deploy.ps1
# ============================================================

Set-Location $PSScriptRoot

# ── 1. Generar versión única con fecha y hora ─────────────────
$version = Get-Date -Format "yyyyMMdd-HHmm"
Write-Host ""
Write-Host "  Deployando version v=$version ..." -ForegroundColor Cyan

# ── 2. Reemplazar versión en todos los HTML ───────────────────
$htmlFiles = Get-ChildItem -Filter "*.html" -File
foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    # Reemplaza cualquier ?v=XXXX en referencias a site.js y styles.css
    $newContent = $content -replace '(site\.js|styles\.css)\?v=[^\s"'']+', "`$1?v=$version"
    if ($newContent -ne $content) {
        Set-Content $file.FullName $newContent -Encoding UTF8 -NoNewline
        Write-Host "    Actualizado: $($file.Name)" -ForegroundColor Gray
    }
}

# ── 3. Git: agregar todo, commitear y pushear ─────────────────
Write-Host ""
Write-Host "  Subiendo a GitHub..." -ForegroundColor Cyan

git add -A -- ':!.claude' ':!.git'

$status = git status --porcelain
if (-not $status) {
    Write-Host "  No hay cambios para subir." -ForegroundColor Yellow
    exit 0
}

$msg = "Deploy v$version"
git -c user.email="francomakoski3@gmail.com" -c user.name="francomakoski3-lgtm" commit -m $msg
git push origin main

Write-Host ""
Write-Host "  Listo! El sitio se actualizara en ~1 minuto." -ForegroundColor Green
Write-Host "  Version: $version" -ForegroundColor Green
Write-Host ""
