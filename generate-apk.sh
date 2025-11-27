#!/bin/bash
# Script para generar APK con Capacitor

echo "🧙 Harry Potter API - Generador de APK"
echo "======================================"

# Verificar si Node está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    exit 1
fi

echo "✅ Node.js y npm encontrados"
echo ""

# Paso 1: Instalar Capacitor
echo "📦 Instalando Capacitor..."
npm install @capacitor/core @capacitor/cli @capacitor/android

echo ""
echo "🔨 Construyendo aplicación..."
npm run build

echo ""
echo "⚙️ Inicializando Capacitor..."
npx cap init

echo ""
echo "🤖 Agregando plataforma Android..."
npx cap add android

echo ""
echo "🔄 Sincronizando archivos..."
npx cap sync

echo ""
echo "📱 Compilando APK..."
npx cap build android

echo ""
echo "✅ ¡APK generado exitosamente!"
echo ""
echo "📍 Ubicación: android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "Para generar APK signed (para publicar):"
echo "  npx cap build android --keystorePath=ruta/a/keystore.jks --keystoreAlias=aliasname"
