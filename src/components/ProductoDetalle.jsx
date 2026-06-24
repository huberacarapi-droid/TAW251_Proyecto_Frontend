// src/components/ProductoDetalle.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/productService';
import '../styles/Productos.css';

function ProductoDetalle() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProductDetail();
  }, [id]);

  const loadProductDetail = async () => {
    try {
      setLoading(true);
      const data = await api.getProduct(Number(id));
      setProduct(data);
      if (data.images && data.images.length > 0) {
        setSelectedImage(data.images[0].url);
      }
      setError(null);
    } catch (err) {
      setError('Error al cargar el producto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCategory = () => {
    if (product?.category?.id) {
      navigate(`/productos/categoria/${product.category.id}`);
    } else {
      navigate('/productos');
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando detalle...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error || 'Producto no encontrado'}
        </div>
        <Link to="/productos" className="btn btn-primary">
          Volver a productos
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
          <li className="breadcrumb-item">
            <Link to={`/productos/categoria/${product.category?.id}`}>
              {product.category?.nombre || 'Categoría'}
            </Link>
          </li>
          <li className="breadcrumb-item active">{product.nombre}</li>
        </ol>
      </nav>

      <div className="row g-4">
        {/* Imágenes del producto */}
        <div className="col-md-6">
          {selectedImage && (
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-3">
                <img 
                  src={selectedImage} 
                  alt={product.nombre}
                  className="img-fluid rounded"
                  style={{ maxHeight: '400px', width: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x400?text=Sin+Imagen';
                  }}
                />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="card-footer bg-transparent border-0">
                  <div className="d-flex gap-2 flex-wrap">
                    {product.images.map((img) => (
                      <img
                        key={img.id}
                        src={img.url}
                        alt={`${product.nombre} - ${img.id}`}
                        className={`img-thumbnail ${selectedImage === img.url ? 'border-primary' : ''}`}
                        style={{ 
                          width: '60px', 
                          height: '60px', 
                          objectFit: 'cover',
                          cursor: 'pointer',
                          borderWidth: selectedImage === img.url ? '3px' : '1px'
                        }}
                        onClick={() => setSelectedImage(img.url)}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/60';
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Detalles del producto */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <div className="mb-3">
                <span className="badge bg-primary mb-2">
                  {product.category?.nombre || 'Sin categoría'}
                </span>
                <h2 className="fw-bold text-primary">{product.nombre}</h2>
                <h3>${product.precio}</h3>
              </div>

              <hr />

              <div className="mb-4">
                <h5 className="fw-semibold">Descripción</h5>
                <p className="text-secondary">
                  {product.descripcion || 'Sin descripción disponible'}
                </p>
              </div>

              <div className="mb-4">
                <div className="d-flex align-items-center">
                  <i className="fas fa-box me-2 text-primary"></i>
                  <span>
                    <strong>Stock disponible:</strong> {product.stock} unidades
                  </span>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button 
                  className="btn btn-primary flex-grow-1"
                  onClick={() => alert('Funcionalidad de compra en desarrollo')}
                >
                  <i className="fas fa-shopping-cart me-2"></i>
                  Agregar al carrito
                </button>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={handleBackToCategory}
                >
                  <i className="fas fa-arrow-left"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;