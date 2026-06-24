//const API_URL = 'http://localhost:3000';
const API_URL = import.meta.env.VITE_APP_API_URL;

export const api = {
  // ========== CATEGORÍAS ==========
  getCategories: async () => {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error('Error al obtener categorías');
    return response.json();
  },

  getCategory: async (id) => {
    const response = await fetch(`${API_URL}/categories/${id}`);
    if (!response.ok) throw new Error('Error al obtener la categoría');
    return response.json();
  },

  createCategory: async (data) => {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear categoría');
    }
    return response.json();
  },

  updateCategory: async (id, data) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar categoría');
    }
    return response.json();
  },

  deleteCategory: async (id) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar categoría');
    }
    return response.json();
  },

  // ========== PRODUCTOS ==========
  getProducts: async () => {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('Error al obtener productos');
    return response.json();
  },

  getProduct: async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) throw new Error('Error al obtener el producto');
    return response.json();
  },

  getProductsByCategory: async (categoryId) => {
    const response = await fetch(`${API_URL}/products/category/${categoryId}`);
    if (!response.ok) throw new Error('Error al obtener productos por categoría');
    return response.json();
  },

  createProduct: async (data) => {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear producto');
    }
    return response.json();
  },

  updateProduct: async (id, data) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar producto');
    }
    return response.json();
  },

  deleteProduct: async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar producto');
    }
    return response.json();
  },

  // ========== USUARIOS ==========
  getUsers: async () => {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) throw new Error('Error al obtener usuarios');
    return response.json();
  },

  getUser: async (id) => {
    const response = await fetch(`${API_URL}/users/${id}`);
    if (!response.ok) throw new Error('Error al obtener el usuario');
    return response.json();
  },

  createUser: async (data) => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear usuario');
    }
    return response.json();
  },

  updateUser: async (id, data) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar usuario');
    }
    return response.json();
  },

  deleteUser: async (id) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar usuario');
    }
    return response.json();
  },
};