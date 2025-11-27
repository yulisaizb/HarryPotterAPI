# Harry Potter API - Aplicación Web con Vite, Firebase y API Harry Potter

Una aplicación web interactiva que integra la API de Harry Potter con autenticación Firebase y almacenamiento de datos en Firestore.

## ✨ Características

- ✅ **Login y Registro funcionales** con Firebase Authentication
- ✅ **Búsqueda de personajes** de la API de Harry Potter
- ✅ **Filtrado por casa** (Gryffindor, Slytherin, Hufflepuff, Ravenclaw)
- ✅ **Sistema de favoritos** guardados en Firebase Firestore (FUNCIÓN ORIGINAL)
- ✅ **Análisis de búsquedas** guardado en Firestore
- ✅ **Interfaz responsiva** con CSS moderno
- ✅ **Diseño tema Harry Potter** con colores de casas

## 📋 Requisitos

- Node.js (v14 o superior)
- npm o yarn
- Cuenta de Firebase (gratuita)

## 🚀 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Crea una aplicación web
4. Copia la configuración
5. Crea un archivo `.env.local` en la raíz del proyecto:

```
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

### 3. Configurar reglas de Firestore

En Firebase Console, ve a Firestore Database > Rules y establece:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /favorites/{document=**} {
      allow read, create, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /searchAnalytics/{document=**} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## 💻 Desarrollo

```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:5173`

## 🔨 Construcción

```bash
npm run build
```

Genera la carpeta `dist/` lista para producción.

## 📁 Estructura del Proyecto

```
HarryPotterAPI/
├── index.html              # HTML principal
├── src/
│   ├── main.js            # Lógica principal
│   ├── firebaseConfig.js  # Configuración de Firebase
│   └── style.css          # Estilos
├── package.json           # Dependencias
├── vite.config.js        # Configuración de Vite
└── .env.local            # Variables de entorno (no commitear)
```

## 🎮 Funcionalidades Principales

### 1. Autenticación (15%)
- Registro de usuarios con email y contraseña
- Login con validación
- Logout y sesiones persistentes

### 2. Mostrar elementos del API (15%)
- Integración con API de Harry Potter
- Búsqueda por nombre
- Filtrado por casa de Hogwarts

### 3. Función Original - Sistema de Favoritos (15%)
- Guardar personajes favoritos en Firestore
- Eliminar favoritos
- Visualizar lista de favoritos personales
- Análisis de búsquedas en Firestore

### 4. Datos en Firebase (15%)
- Autenticación con Firebase Auth
- Almacenamiento de favoritos en Firestore
- Análisis de búsquedas en Firestore
- Datos asociados al usuario autenticado

### 5. Interfaz con Vite (15%)
- Build rápido y optimizado
- Hot Module Replacement (HMR)
- Código modular y escalable

## 📦 APK (Aplicación Mobile)

Para generar una APK compatible:

```bash
# 1. Instalar dependencias necesarias
npm install @capacitor/core @capacitor/cli

# 2. Compilar aplicación
npm run build

# 3. Usar Capacitor para generar APK
npx cap init
npx cap add android
npx cap sync
npx cap build android
```

## 🔐 Variables de Entorno

Crea `.env.local` (no se commitea) con:

```
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
```

## 🌐 APIs Utilizadas

- **Harry Potter API**: https://hp-api.herokuapp.com/
- **Firebase Authentication**: Autenticación segura
- **Firestore Database**: Base de datos NoSQL

## 📱 Características Responsivas

- Diseño mobile-first
- Adaptable a tablets
- Pantalla completa en desktop
- Temas para diferentes casas

## 🎨 Colores de Casas

- 🔴 Gryffindor: #740001
- 🟢 Slytherin: #1a472a
- 🟡 Hufflepuff: #f0d958
- 🔵 Ravenclaw: #222f5b

## 🐛 Solución de Problemas

### "Error: CORS" al cargar API
- La API de Harry Potter permite CORS
- Si persiste, usa un proxy CORS

### "Firebase no inicializa"
- Verifica las variables de entorno
- Confirma que Firebase está habilitado
- Revisa la consola del navegador

### "No se carga la imagen del personaje"
- La API puede no tener imagen
- Se muestra placeholder automáticamente

## 📝 Licencia

Este proyecto es de propósito educativo.

## 👨‍💻 Autor

Creado como proyecto de integración de APIs con Firebase.

---

**¡Disfruta explorando el mundo mágico de Harry Potter! 🧙✨**