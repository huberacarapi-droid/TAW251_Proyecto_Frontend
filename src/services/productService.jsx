// src/services/api.js
//const API_URL = 'http://localhost:3000';
const API_URL = import.meta.env.VITE_APP_API_URL;

export const api = {
  // Obtener todas las categorías
  getCategories: async () => {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error('Error al obtener categorías');
    return response.json();
  },

  // Obtener todos los productos
  getProducts: async () => {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('Error al obtener productos');
    return response.json();
  },

  // Obtener productos por categoría
  getProductsByCategory: async (categoryId) => {
    const response = await fetch(`${API_URL}/products/category/${categoryId}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener productos');
    }
    return response.json();
  },

  // Obtener un producto por ID
  getProduct: async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) throw new Error('Error al obtener el producto');
    return response.json();
  }
};