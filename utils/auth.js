// utils/auth.js
// Utilidad simple para manejar la autenticación

// Verificar si estamos en el cliente
const isClient = () => typeof window !== 'undefined';

// Guardar token en localStorage
export const setToken = (token) => {
  if (isClient()) {
    localStorage.setItem('token', token);
  }
};

// Obtener token de localStorage
export const getToken = () => {
  if (isClient()) {
    return localStorage.getItem('token');
  }
  return null;
};

// Eliminar token de localStorage
export const removeToken = () => {
  if (isClient()) {
    localStorage.removeItem('token');
  }
};

// Guardar información de usuario en localStorage
export const setUserInfo = (userInfo) => {
  if (isClient() && userInfo) {
    localStorage.setItem('user', JSON.stringify(userInfo));
  }
};

// Obtener información de usuario de localStorage
export const getUserInfo = () => {
  if (isClient()) {
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      return JSON.parse(userInfo);
    }
  }
  return null;
};

// Eliminar información de usuario de localStorage
export const removeUserInfo = () => {
  if (isClient()) {
    localStorage.removeItem('user');
  }
};

// Decodificar token JWT
export const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    // Decodificar el token (solo la parte de payload)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error decodificando token:", e);
    return null;
  }
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  return !!getToken();
};

export default {
  setToken,
  getToken,
  removeToken,
  setUserInfo,
  getUserInfo,
  removeUserInfo,
  decodeToken,
  isAuthenticated
};