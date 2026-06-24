// src/components/ProductosPorCategoria.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/productService';
import '../styles/Productos.css';

function ProductosPorCategoria() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProductsByCategory();
  }, [categoryId]);

  const loadProductsByCategory = async () => {
    try {
      setLoading(true);
      const data = await api.getProductsByCategory(Number(categoryId));
      
      // Si hay productos, obtenemos la categoría del primero
      if (data.length > 0) {
        setCategory(data[0].category);
      } else {
        // Si no hay productos, obtenemos la categoría por separado
        const categories = await api.getCategories();
        const foundCategory = categories.find(c => c.id === Number(categoryId));
        setCategory(foundCategory || null);
      }
      
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar los productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/productos/${productId}`);
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando productos...</span>
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
        <Link to="/productos" className="btn btn-primary">
          Volver a categorías
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {/* Navegación */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/productos">Productos</Link>
          </li>
          <li className="breadcrumb-item active">
            {category?.nombre || 'Categoría'}
          </li>
        </ol>
      </nav>

      {/* Header de categoría */}
      <div className="mb-4">
        <h2 className="fw-bold text-primary">{category?.nombre || 'Productos'}</h2>
        <p className="text-muted">{category?.descripcion}</p>
        <Link to="/productos" className="btn btn-outline-primary btn-sm">
          <i className="fas fa-arrow-left me-2"></i>
          Volver a categorías
        </Link>
      </div>

      {/* Lista de productos */}
      {products.length === 0 ? (
        <div className="alert alert-info">
          No hay productos disponibles en esta categoría.
        </div>
      ) : (
        <div className="row g-4">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="col-md-6 col-lg-4"
              onClick={() => handleProductClick(product.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card h-100 shadow-sm border-0 rounded-4 product-card hover-effect">
                <div className="card-body p-4">
                  {/* Imagen del producto (si existe) */}
                  {product.images && product.images.length > 0 && (
                    <div className="text-center mb-3">
                      <img 
                        src={product.images[0].url} 
                        alt={product.nombre}
                        className="img-fluid rounded"
                        style={{ maxHeight: '150px', objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title fw-semibold">{product.nombre}</h5>
                    <span className="badge bg-primary rounded-pill">
                      ${product.precio}
                    </span>
                  </div>
                  
                  <p className="card-text text-secondary">
                    {product.descripcion || 'Sin descripción'}
                  </p>
                  
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="badge bg-light text-dark">
                      <i className="fas fa-box me-1"></i>
                      Stock: {product.stock}
                    </span>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product.id);
                      }}
                    >
                      Ver detalle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductosPorCategoria;