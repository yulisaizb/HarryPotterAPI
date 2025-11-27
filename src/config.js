// config.js - Configuración global de la aplicación

export const CONFIG = {
  // API de Harry Potter
  HARRY_POTTER_API: 'https://hp-api.herokuapp.com/api/characters',
  
  // Casas de Hogwarts
  HOUSES: [
    { name: 'Gryffindor', color: '#740001', hex: '#740001' },
    { name: 'Slytherin', color: '#1a472a', hex: '#1a472a' },
    { name: 'Hufflepuff', color: '#f0d958', hex: '#f0d958' },
    { name: 'Ravenclaw', color: '#222f5b', hex: '#222f5b' }
  ],
  
  // Configuración de búsqueda
  SEARCH: {
    debounceDelay: 300,
    maxResults: 100
  },
  
  // Configuración de Firebase
  FIREBASE: {
    collections: {
      favorites: 'favorites',
      searchAnalytics: 'searchAnalytics'
    }
  },
  
  // Timeout de API
  API_TIMEOUT: 10000,
  
  // Mensajes
  MESSAGES: {
    errors: {
      loadCharacters: 'Error al cargar personajes',
      firebaseError: 'Error de conexión con Firebase',
      networkError: 'Error de conexión de red'
    },
    success: {
      addFavorite: 'Agregado a favoritos',
      removeFavorite: 'Removido de favoritos',
      loginSuccess: '¡Bienvenido!'
    }
  }
};

// Funciones auxiliares
export const getHouseColor = (houseName) => {
  const house = CONFIG.HOUSES.find(h => h.name === houseName);
  return house ? house.color : '#666';
};

export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const capitalizeFirst = (str) => {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
};
