@echo off
echo 🚀 Demarrage du Performance Bridge Go - Mayu & Jack Studio
echo ===========================================================
echo.

echo 📋 Verification des fichiers...
if not exist "performance_bridge.exe" (
    echo ❌ Erreur: performance_bridge.exe non trouve
    echo 🔧 Compilation en cours...
    go build -o performance_bridge.exe performance_bridge.go
    if errorlevel 1 (
        echo ❌ Erreur de compilation
        pause
        exit /b 1
    )
    echo ✅ Compilation reussie
)

echo.
echo 🎯 Configuration:
echo    - Port: 8080
echo    - Workers: 8
echo    - Cache: 200MB
echo.

echo 🚀 Demarrage du serveur...
echo 📍 API disponible sur: http://localhost:8080
echo 📊 Metriques: http://localhost:8080/api/metrics
echo 📈 Status: http://localhost:8080/api/status
echo.

echo ⚠️  Appuyez sur Ctrl+C pour arreter le serveur
echo.

performance_bridge.exe

echo.
echo 👋 Serveur arrete
pause
