# 🔥 Guía de Configuración de Firebase

## Pasos para configurar Firebase correctamente

### 1️⃣ Crear proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en **"Crear un proyecto"**
3. Ingresa el nombre: `Harry Potter API`
4. Acepta los términos y crea el proyecto
5. Espera a que se complete la inicialización

### 2️⃣ Crear aplicación web

1. En el proyecto, haz clic en **"+ Agregar aplicación"**
2. Selecciona la opción **"Web"** (</> icono)
3. Ingresa un apodo: `Harry Potter App`
4. Haz clic en **"Registrar app"**

### 3️⃣ Obtener credenciales

Después de registrar, verás un bloque de configuración como:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "harrypotterapi.firebaseapp.com",
  projectId: "harrypotterapi-xxx",
  storageBucket: "harrypotterapi-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456789"
};
```

### 4️⃣ Crear archivo .env.local

En la raíz del proyecto, crea el archivo `.env.local` con:

```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=harrypotterapi.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=harrypotterapi-xxx
VITE_FIREBASE_STORAGE_BUCKET=harrypotterapi-xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456789
```

### 5️⃣ Habilitar Authentication

1. En Firebase Console, ve a **"Authentication"** (o "Autenticación")
2. Haz clic en **"Comenzar"**
3. En el tab **"Método de acceso"**, selecciona **"Correo electrónico/Contraseña"**
4. Habilita **"Contraseña"** (no es necesario "Enlace de acceso por correo")
5. Haz clic en **"Guardar"**

### 6️⃣ Crear base de datos Firestore

1. Ve a **"Firestore Database"**
2. Haz clic en **"Crear base de datos"**
3. Selecciona modo: **"Iniciar en modo de prueba"**
4. Selecciona ubicación: **"(us-central1)"** o tu región
5. Haz clic en **"Habilitar"**

### 7️⃣ Configurar reglas de seguridad

En Firestore, ve a la pestaña **"Reglas"** y reemplaza el contenido con:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Favoritos - solo el propietario puede ver/crear/eliminar
    match /favorites/{document=**} {
      allow read, create, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Análisis de búsquedas - solo crear, leer propios datos
    match /searchAnalytics/{document=**} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

Haz clic en **"Publicar"**

### 8️⃣ Estructura de base de datos

**Colección: `favorites`**
```
{
  userId: "uid del usuario",
  characterId: "id del personaje",
  characterName: "Nombre del personaje",
  characterImage: "URL de imagen",
  characterHouse: "Casa de Hogwarts",
  addedAt: timestamp,
  notes: "Notas del usuario"
}
```

**Colección: `searchAnalytics`**
```
{
  userId: "uid del usuario",
  searchTerm: "término buscado",
  resultsCount: número,
  timestamp: timestamp
}
```

## ✅ Verificación

Para verificar que todo funciona:

1. Ejecuta `npm install`
2. Ejecuta `npm run dev`
3. Prueba el registro con un correo
4. Prueba el login
5. Busca un personaje y agrégalo a favoritos
6. Verifica en Firebase Console que aparecen los datos

## 🐛 Solución de problemas

### "Firebase Initialization Error"
- Verifica que `.env.local` tenga todas las variables
- Recarga la página (Ctrl+Shift+R)

### "Permission denied" al agregar favoritos
- Verifica las reglas de Firestore (paso 7)
- Asegúrate de estar autenticado

### "Authentication/invalid-email"
- Ingresa un correo válido
- La contraseña debe tener al menos 6 caracteres

### "CORS error"
- Esto no debería ocurrir con Firebase
- Si ocurre, verifica el navegador

## 📚 Documentación oficial

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)

## 🔒 Consideraciones de seguridad

- Nunca commitees el archivo `.env.local`
- Las API keys están limitadas por dominio en Firebase
- Las reglas de Firestore protegen los datos del usuario
- Los usuarios solo pueden acceder a sus propios favoritos

---

**¡Firebase configurado correctamente! 🚀**
