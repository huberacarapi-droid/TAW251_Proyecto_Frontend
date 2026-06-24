/*
// Si el backend está en el puerto 3000
const API_URL = "http://localhost:3000/auth";

export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || "Error en el inicio de sesión");
        }

        const data = await response.json();
        
        // Guardar token y usuario
        if (data.access_token) {
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));
        }
        
        return data;
    } catch (error) {
        console.error("Error en login:", error);
        throw error;
    }
};

export const register = async (email, nombre, password) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, nombre, password }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || "Error en el registro");
        }

        return await response.json();
    } catch (error) {
        console.error("Error en registro:", error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

export const getToken = () => {
    return localStorage.getItem("token");
};

export const getUser = () => {
    try {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
};

export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    
    // Verificar expiración
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000;
        return Date.now() < exp;
    } catch {
        return !!token;
    }
};
*/
/*
import axios from 'axios';

const API_URL = "http://localhost:3000/auth";

// Configurar axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Extraer el mensaje de error del backend
        const errorMessage = error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Error de conexión";
        throw new Error(errorMessage);
    }
);

export const login = async (email, password) => {
    try {
        const response = await api.post('/login', { email, password });
        const data = response.data;

        // Guardar token y usuario
        if (data.access_token) {
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));
        }

        return data;
    } catch (error) {
        console.error("Error en login:", error);
        throw error;
    }
};

export const register = async (email, nombre, password) => {
    try {
        const response = await api.post('/register', { email, nombre, password });
        return response.data;
    } catch (error) {
        console.error("Error en registro:", error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

export const getToken = () => {
    return localStorage.getItem("token");
};

export const getUser = () => {
    try {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
};

export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000;
        return Date.now() < exp;
    } catch {
        return !!token;
    }
};*/
/*
const API_URL = "http://localhost:3000/auth";

export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            let errorMessage = "Error en el inicio de sesión";
            
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (parseError) {
                errorMessage = await response.text() || errorMessage;
            }
            
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log(data);
        // Guardar token y usuario (incluyendo el rol)
        if (data.access_token) {
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));
        }
        
        return data;
    } catch (error) {
        console.error("Error en login:", error);
        throw error;
    }
};

export const register = async (email, nombre, password) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, nombre, password }),
        });

        if (!response.ok) {
            let errorMessage = "Error en el registro";
            
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (parseError) {
                errorMessage = await response.text() || errorMessage;
            }
            
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en registro:", error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

export const getToken = () => {
    return localStorage.getItem("token");
};

export const getUser = () => {
    try {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
};

export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000;
        return Date.now() < exp;
    } catch {
        return !!token;
    }
};

// Función para obtener el rol del usuario
export const getUserRole = () => {
    const user = getUser();
    return user?.rol || 'guest';
};

// Función para verificar si el usuario es admin
export const isAdmin = () => {
    return getUserRole() === 'admin';
};

// Función para verificar si el usuario es user
export const isUser = () => {
    return getUserRole() === 'user';
};*/
// services/authService.js
//const API_URL = "http://localhost:3000/auth";
const API_URL = `${import.meta.env.VITE_APP_API_URL}/auth`;

export const login = async (email, password, captchaToken) => {
    try {
        // Validar que el captchaToken no esté vacío
        if (!captchaToken || captchaToken.trim() === "") {
            throw new Error("El captcha es obligatorio");
        }

        console.log("Enviando login con:", { email, captchaToken: captchaToken.substring(0, 20) + "..." });

        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                email, 
                password, 
                captchaToken  // Añadir el captchaToken
            }),
        });

        if (!response.ok) {
            let errorMessage = "Error en el inicio de sesión";
            
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
                console.error("Error del servidor:", errorData);
            } catch (parseError) {
                errorMessage = await response.text() || errorMessage;
            }
            
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log("Login exitoso:", data);
        
        // Guardar token y usuario (incluyendo el rol)
        if (data.access_token) {
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));
        }
        
        return data;
    } catch (error) {
        console.error("Error en login:", error);
        throw error;
    }
};

// El resto de funciones permanecen igual...
export const register = async (email, nombre, password) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, nombre, password }),
        });

        if (!response.ok) {
            let errorMessage = "Error en el registro";
            
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (parseError) {
                errorMessage = await response.text() || errorMessage;
            }
            
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en registro:", error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

export const getToken = () => {
    return localStorage.getItem("token");
};

export const getUser = () => {
    try {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
};

export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000;
        return Date.now() < exp;
    } catch {
        return !!token;
    }
};

export const getUserRole = () => {
    const user = getUser();
    return user?.rol || 'guest';
};

export const isAdmin = () => {
    return getUserRole() === 'admin';
};

export const isUser = () => {
    return getUserRole() === 'user';
};