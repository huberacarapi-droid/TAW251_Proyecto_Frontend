// src/components/Productos.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/productService';
import '../styles/Productos.css';

function Productos() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await api.getCategories();
            setCategories(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar las categorías');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (categoryId) => {
        navigate(`/productos/categoria/${categoryId}`);
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="text-center mb-2">
                <h2 className="fw-bold text-primary">Productos</h2>
                <p className="text-muted mx-auto" style={{ maxWidth: "720px" }}>
                    Descubre nuestras categorías de productos diseñadas para conectar,
                    medir y automatizar procesos industriales. Ofrecemos soluciones
                    completas con hardware y software pensados para cada etapa de tu operación.
                </p>
            </div>

            <div className="row g-4">
                {categories.map((category) => {
                    return (
                        <div
                            key={category.id}
                            className="col-sm-12 col-xl-6"
                            onClick={() => handleCategoryClick(category.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="card h-100 shadow-sm border-0 rounded-4 category-card hover-effect">
                                {/* Cuerpo de la tarjeta */}
                                <div className="card-body p-4">
                                    <div className="mb-3 d-flex align-items-center justify-content-between">
                                        <span className="badge bg-primary py-2 px-3 rounded-pill">
                                            Categoría
                                        </span>
                                    </div>
                                    <h5 className="card-title fw-semibold">{category.nombre}</h5>
                                    <p className="card-text text-secondary">{category.descripcion}</p>
                                </div>

                                {/* Footer de la tarjeta con el botón */}
                                <div className="card-footer bg-transparent border-0 px-4 pb-4 pt-0">
                                    <button
                                        className="btn btn-outline-primary w-100"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCategoryClick(category.id);
                                        }}
                                    >
                                        Ver productos
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Productos;