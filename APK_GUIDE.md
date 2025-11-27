# 📱 Guía para Generar APK

Esta aplicación puede compilarse a APK para dispositivos Android usando **Capacitor**.

## 📋 Requisitos previos

- ✅ Node.js 14+
- ✅ npm o yarn
- ✅ Android Studio instalado (opcional pero recomendado)
- ✅ Java Development Kit (JDK 11+)
- ✅ Android SDK con herramientas de compilación

## 🚀 Pasos para generar el APK

### 1. Compilar la aplicación web

```bash
npm install
npm run build
```

Esto genera la carpeta `dist/` con la aplicación compilada.

### 2. Instalar Capacitor

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
```

### 3. Inicializar Capacitor

```bash
npx cap init
```

Se te pedirá:
- **Nombre de la app**: `Harry Potter API`
- **ID del paquete**: `com.harrypotter.api` (o similar)

### 4. Agregar plataforma Android

```bash
npx cap add android
```

Esto crea la carpeta `android/` con el proyecto Android.

### 5. Sincronizar archivos web

```bash
npx cap sync
```

### 6. Abrir en Android Studio (opcional)

```bash
npx cap open android
```

O abre manualmente la carpeta `android/` con Android Studio.

### 7. Compilar APK en modo debug

**Opción A: Línea de comandos**
```bash
npx cap build android
```

O con gradle directamente:
```bash
cd android
./gradlew assembleDebug
cd ..
```

**Opción B: Android Studio**
1. Abre Android Studio
2. Abre la carpeta `android/`
3. Ve a **Build > Make Project**
4. Ve a **Build > Build Bundle(s) / APK(s) > Build APK(s)**

### 8. Ubicar el APK generado

El APK se encuentra en:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

## 📦 Generar APK para producción (Signed)

Para publicar en Google Play Store, necesitas un APK firmado:

### 1. Generar keystore

```bash
keytool -genkey -v -keystore harry-potter.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias harrypotter
```

Te pedirá:
- Contraseña del keystore
- Datos personales
- Contraseña de la clave

### 2. Compilar APK signed

```bash
cd android
./gradlew assembleRelease -Pandroid.injected.signing.store.file=$(pwd)/../harry-potter.keystore -Pandroid.injected.signing.store.password=tu_contraseña -Pandroid.injected.signing.key.alias=harrypotter -Pandroid.injected.signing.key.password=tu_contraseña_clave
cd ..
```

O usando Android Studio:
1. **Build > Generate Signed Bundle / APK**
2. Selecciona **APK**
3. Proporciona tu keystore
4. Selecciona **release**

El APK estará en:
```
android/app/build/outputs/apk/release/app-release.apk
```

## 🔧 Configuración personalizada

### AndroidManifest.xml

Edita `android/app/src/main/AndroidManifest.xml` para:
- Cambiar permisos
- Agregar ícono personalizado
- Configurar orientación

### Ícono y Splash Screen

Reemplaza en `android/app/src/main/res/`:
- **mipmap-*/ic_launcher.png**: Ícono de la app
- **drawable/splash.png**: Pantalla de inicio

### Configurar Firebase en Android

1. En Android Studio, abre **Tools > Firebase**
2. Sigue el asistente de configuración
3. Descarga el archivo `google-services.json`
4. Colócalo en `android/app/`

## 📲 Instalar APK en dispositivo

### Usando ADB (Android Debug Bridge)

```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

O con conexión inalámbrica:

```bash
# Conectar por WiFi
adb connect <IP_DISPOSITIVO>:5555

# Instalar APK
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### Instalación manual

1. Copia el APK al dispositivo
2. En el dispositivo: **Ajustes > Seguridad > Permitir instalación de apps desconocidas**
3. Abre el archivo APK
4. Toca **Instalar**

## 🐛 Solución de problemas

### "gradle not found"
```bash
# Windows
gradlew.bat assembleDebug

# Linux/Mac
./gradlew assembleDebug
```

### "Android SDK not found"
Instala Android Studio y ejecuta:
```bash
npx cap add android
```

### "Permission denied" en Linux/Mac
```bash
chmod +x android/gradlew
./android/gradlew assembleDebug
```

### APK no se abre
- Verifica que sea para Android 6.0+ (API 23+)
- Comprueba que Firebase esté configurado
- Mira los logs en Android Studio

### Problemas con Firebase
- Descarga `google-services.json` de Firebase Console
- Colócalo en `android/app/`
- Ejecuta `npx cap sync`

## 📊 Optimización de APK

### Reducir tamaño

Edita `android/app/build.gradle`:

```gradle
android {
    bundle {
        language.enable = false
        density.enable = true
        abi.enable = true
    }
}
```

### Habilitar ProGuard/R8

```gradle
android {
    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

## 📚 Recursos

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developers](https://developer.android.com/)
- [Firebase for Android](https://firebase.google.com/docs/android/setup)
- [Android Build System](https://developer.android.com/build)

## ✅ Checklist antes de publicar

- [ ] APK compilado correctamente
- [ ] Probado en múltiples dispositivos
- [ ] Ícono personalizado agregado
- [ ] Nombre y versión correctos en `build.gradle`
- [ ] Keystore firmado generado
- [ ] Firebase configurado
- [ ] Privacidad y permisos revisados
- [ ] Screenshots para Google Play Store

## 📝 Versiones

Para cambiar versión del APK, edita `android/app/build.gradle`:

```gradle
android {
    defaultConfig {
        versionCode 1
        versionName "1.0.0"
    }
}
```

---

**¡APK generado exitosamente! 🎉**
