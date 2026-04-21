@echo off
title Gestoria Sonia - Subir cambios al sitio
cd /d "%~dp0.."

echo.
echo ============================================
echo    GESTORIA SONIA  -  Subir cambios
echo ============================================
echo.

echo Archivos modificados:
echo.
git status --short
echo.

echo Escribe un mensaje para los cambios:
echo Ejemplo: Mejoras mobile, footer corregido
echo.
set /p MENSAJE=Mensaje:

if "%MENSAJE%"=="" set MENSAJE=Actualizacion del sitio

echo.
echo Subiendo cambios a GitHub...
echo.

git add -A
git commit -m "%MENSAJE%"
git push origin main

echo.
if %errorlevel%==0 (
    echo OK - Cambios subidos correctamente.
    echo El sitio se actualizara en unos segundos.
) else (
    echo ERROR - Algo salio mal. Revisa tu conexion.
)

echo.
pause
