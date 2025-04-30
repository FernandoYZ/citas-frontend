// utils/storage.js
// Utilidad para manejar localStorage de forma segura

// Verificar si estamos en el cliente y localStorage está disponible
const isLocalStorageAvailable = () => {
    if (typeof window === 'undefined') return false;
    if (typeof localStorage === 'undefined') return false;
    return true;
  };
  
  // Obtener un valor de localStorage
  export const getItem = (key) => {
    if (!isLocalStorageAvailable()) return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error al obtener ${key} de localStorage:`, error);
      return null;
    }
  };
  
  // Guardar un valor en localStorage
  export const setItem = (key, value) => {
    if (!isLocalStorageAvailable()) return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error al guardar ${key} en localStorage:`, error);
      return false;
    }
  };
  
  // Eliminar un valor de localStorage
  export const removeItem = (key) => {
    if (!isLocalStorageAvailable()) return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error al eliminar ${key} de localStorage:`, error);
      return false;
    }
  };
  
  // Verificar si un valor existe en localStorage
  export const hasItem = (key) => {
    if (!isLocalStorageAvailable()) return false;
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`Error al verificar ${key} en localStorage:`, error);
      return false;
    }
  };
  
  export default {
    getItem,
    setItem,
    removeItem,
    hasItem
  };