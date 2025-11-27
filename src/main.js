// main.js - Lógica principal de la aplicación
import {
  registerUser,
  loginUser,
  logoutUser,
  addFavorite,
  removeFavorite,
  getFavorites,
  monitorAuth
} from './firebaseConfig.js';
// ===== VARIABLES GLOBALES =====
let currentUser = null;
let favorites = [];
// Proxy CORS solo en desarrollo (usando allorigins)
const IS_DEV = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1') || window.location.hostname.endsWith('.github.dev');
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
const HARRY_POTTER_API = IS_DEV
  ? CORS_PROXY + encodeURIComponent('https://hp-api.onrender.com/api/characters')
  : 'https://hp-api.onrender.com/api/characters';

// ===== ELEMENTOS DEL DOM =====
const authSection = document.getElementById('auth-section');
const mainSection = document.getElementById('main-section');

const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginMessage = document.getElementById('login-message');

const registerEmail = document.getElementById('register-email');
const registerPassword = document.getElementById('register-password');
const registerConfirm = document.getElementById('register-confirm');
const registerMessage = document.getElementById('register-message');

const logoutBtn = document.getElementById('logout-btn');
const userEmail = document.getElementById('user-email');

const searchInput = document.getElementById('search-input');
const filterHouse = document.getElementById('filter-house');
const searchBtn = document.getElementById('search-btn');
const charactersGrid = document.getElementById('characters-grid');
const favoritesList = document.getElementById('favorites-list');
const noResults = document.getElementById('no-results');

// ===== AUTENTICACIÓN - TABS =====
loginTab.addEventListener('click', () => {
  loginForm.classList.add('active');
  registerForm.classList.remove('active');
  loginTab.classList.add('active');
  registerTab.classList.remove('active');
  clearMessages();
  // Forzar display block para el formulario activo
  loginForm.style.display = 'flex';
  registerForm.style.display = 'none';
});

registerTab.addEventListener('click', () => {
  registerForm.classList.add('active');
  loginForm.classList.remove('active');
  registerTab.classList.add('active');
  loginTab.classList.remove('active');
  clearMessages();
  // Forzar display block para el formulario activo
  registerForm.style.display = 'flex';
  loginForm.style.display = 'none';
});

// ===== AUTENTICACIÓN - LOGIN =====
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = loginEmail.value.trim();
  const password = loginPassword.value;
  
  if (!email || !password) {
    showMessage(loginMessage, 'Por favor completa todos los campos', 'error');
    return;
  }
  
  const result = await loginUser(email, password);
  
  if (result.success) {
    showMessage(loginMessage, '¡Bienvenido!', 'success');
    loginForm.reset();
  } else {
    showMessage(loginMessage, result.error, 'error');
  }
});

// ===== AUTENTICACIÓN - REGISTRO =====
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = registerEmail.value.trim();
  const password = registerPassword.value;
  const confirm = registerConfirm.value;
  
  if (!email || !password || !confirm) {
    showMessage(registerMessage, 'Por favor completa todos los campos', 'error');
    return;
  }
  
  if (password.length < 6) {
    showMessage(registerMessage, 'La contraseña debe tener al menos 6 caracteres', 'error');
    return;
  }
  
  if (password !== confirm) {
    showMessage(registerMessage, 'Las contraseñas no coinciden', 'error');
    return;
  }
  
  const result = await registerUser(email, password);
  
  if (result.success) {
    showMessage(registerMessage, '¡Registro exitoso! Ahora inicia sesión', 'success');
    registerForm.reset();
    setTimeout(() => {
      loginTab.click();
    }, 1500);
  } else {
    showMessage(registerMessage, result.error, 'error');
  }
});

// ===== LOGOUT =====
logoutBtn.addEventListener('click', async () => {
  const result = await logoutUser();
  if (result.success) {
    clearMessages();
  }
});

// ===== MONITOREO DE AUTENTICACIÓN =====
monitorAuth(async (user) => {
  if (user) {
    currentUser = user;
    userEmail.textContent = user.email;

    authSection.style.display = 'none';
    mainSection.style.display = 'block';

    // Cargar favoritos del usuario
    await loadFavorites();
  } else {
    currentUser = null;
    favorites = [];

    authSection.style.display = 'flex';
    mainSection.style.display = 'none';
  }
});

// ===== API HARRY POTTER =====
async function searchCharacters() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const house = filterHouse.value;
  
  try {
    charactersGrid.innerHTML = '<div class="loading">Cargando personajes...</div>';
    
    const response = await fetch(HARRY_POTTER_API);
    const allCharacters = await response.json();
    
    let filtered = allCharacters;
    
    // Filtrar por nombre
    if (searchTerm) {
      filtered = filtered.filter(char => 
        char.name.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filtrar por casa
    if (house) {
      filtered = filtered.filter(char => char.house === house);
    }
    
    // Guardar análisis de búsqueda
    if (currentUser) {
      await saveSearchAnalytics(currentUser.uid, searchTerm || 'all', filtered.length);
    }
    
    // Mostrar resultados
    if (filtered.length === 0) {
      noResults.style.display = 'block';
      charactersGrid.innerHTML = '';
    } else {
      noResults.style.display = 'none';
      displayCharacters(filtered);
    }
  } catch (error) {
    console.error('Error:', error);
    charactersGrid.innerHTML = '<p class="no-results">Error al cargar los personajes</p>';
  }
}

function displayCharacters(characters) {
  charactersGrid.innerHTML = '';
  
  characters.forEach(character => {
    const isFavorite = favorites.some(fav => fav.characterId === character.id);
    
    const card = document.createElement('div');
    card.className = 'character-card';
    card.innerHTML = `
      <img src="${character.image || 'https://via.placeholder.com/300x400?text=No+Image'}" 
           alt="${character.name}" 
           class="character-image" 
           onerror="this.src='https://via.placeholder.com/300x400?text=No+Image'">
      <div class="character-content">
        <div class="character-name">${character.name}</div>
        <div class="character-info"><strong>Casa:</strong> ${character.house || 'Desconocida'}</div>
        <div class="character-info"><strong>Especie:</strong> ${character.species || 'Humano'}</div>
        <div class="character-info"><strong>Nacimiento:</strong> ${character.dateOfBirth || 'Desconocida'}</div>
        ${character.actor ? `<div class="character-info"><strong>Actor:</strong> ${character.actor}</div>` : ''}
        ${character.house ? `<span class="character-house ${character.house.toLowerCase()}-house">${character.house}</span>` : ''}
        <div class="character-actions">
          <button class="btn btn-small favorite-btn ${isFavorite ? 'added' : ''}" 
                  data-character='${JSON.stringify(character)}'>
            ${isFavorite ? '⭐ En Favoritos' : '☆ Agregar a Favoritos'}
          </button>
        </div>
      </div>
    `;
    
    // Evento para agregar/quitar favorito
    const favoriteBtn = card.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', async () => {
      await toggleFavorite(character);
      await loadFavorites();
      searchCharacters(); // Refrescar resultados
    });
    
    charactersGrid.appendChild(card);
  });
}

// ===== FUNCIÓN ORIGINAL: GESTIÓN DE FAVORITOS =====
async function toggleFavorite(character) {
  const existingFavorite = favorites.find(fav => fav.characterId === character.id);
  
  if (existingFavorite) {
    // Remover de favoritos
    const result = await removeFavorite(existingFavorite.id);
    if (result.success) {
      console.log('Removido de favoritos');
    }
  } else {
    // Agregar a favoritos
    const result = await addFavorite(currentUser.uid, {
      id: character.id,
      name: character.name,
      image: character.image,
      house: character.house,
      species: character.species,
      actor: character.actor,
      dateOfBirth: character.dateOfBirth
    });
    if (result.success) {
      console.log('Agregado a favoritos');
    }
  }
}

async function loadFavorites() {
  if (!currentUser) return;
  
  const result = await getFavorites(currentUser.uid);
  
  if (result.success) {
    favorites = result.data;
    displayFavorites();
  }
}

function displayFavorites() {
  favoritesList.innerHTML = '';
  
  if (favorites.length === 0) {
    favoritesList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">No tienes personajes favoritos aún</p>';
    return;
  }
  
  favorites.forEach(favorite => {
    const card = document.createElement('div');
    card.className = 'character-card';
    card.innerHTML = `
      <img src="${favorite.characterImage || 'https://via.placeholder.com/300x400?text=No+Image'}" 
           alt="${favorite.characterName}" 
           class="character-image"
           onerror="this.src='https://via.placeholder.com/300x400?text=No+Image'">
      <div class="character-content">
        <div class="character-name">${favorite.characterName}</div>
        <div class="character-info"><strong>Casa:</strong> ${favorite.characterHouse || 'Desconocida'}</div>
        ${favorite.characterHouse ? `<span class="character-house ${favorite.characterHouse.toLowerCase()}-house">${favorite.characterHouse}</span>` : ''}
        <div class="character-actions">
          <button class="btn btn-small remove-btn">❌ Remover</button>
        </div>
      </div>
    `;
    
    const removeBtn = card.querySelector('.remove-btn');
    removeBtn.addEventListener('click', async () => {
      const result = await removeFavorite(favorite.id);
      if (result.success) {
        await loadFavorites();
        searchCharacters();
      }
    });
    
    favoritesList.appendChild(card);
  });
}

// ===== EVENTOS DE BÚSQUEDA =====
searchBtn.addEventListener('click', searchCharacters);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchCharacters();
});

// ===== UTILIDADES =====
function showMessage(element, message, type) {
  element.textContent = message;
  element.className = `auth-message ${type}`;
  
  if (type === 'success') {
    setTimeout(() => {
      element.className = 'auth-message';
      element.textContent = '';
    }, 3000);
  }
}

function clearMessages() {
  loginMessage.className = 'auth-message';
  registerMessage.className = 'auth-message';
  loginMessage.textContent = '';
  registerMessage.textContent = '';
}

// ===== CARGA INICIAL =====
console.log('🧙 Harry Potter API - Aplicación cargada');
