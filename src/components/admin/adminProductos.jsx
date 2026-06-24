// src/components/admin/AdminProductos.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../../services/adminServices';
import '../../styles/Admin.css';

function AdminProductos() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoryId: '',
    images: []
  });
  const [imageInput, setImageInput] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        api.getProducts(),
        api.getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      setError('Error al cargar datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nombre: product.nombre,
        descripcion: product.descripcion || '',
        precio: product.precio.toString(),
        stock: product.stock.toString(),
        categoryId: product.category?.id?.toString() || '',
        images: product.images?.map(img => img.url) || []
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoryId: '',
        images: []
      });
    }
    setImageInput('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      categoryId: '',
      images: []
    });
    setImageInput('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddImage = () => {
    if (imageInput && imageInput.trim()) {
      // Validar que sea una URL válida
      try {
        new URL(imageInput);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, imageInput.trim()]
        }));
        setImageInput('');
      } catch {
        alert('Por favor ingresa una URL válida');
      }
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }
    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      alert('El precio debe ser mayor a 0');
      return;
    }
    if (!formData.categoryId) {
      alert('Debes seleccionar una categoría');
      return;
    }

    try {
      const productData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || undefined,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock) || 0,
        categoryId: parseInt(formData.categoryId),
        images: formData.images
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productData);
      } else {
        await api.createProduct(productData);
      }
      
      await loadData();
      handleCloseModal();
    } catch (err) {
      alert(err.message || 'Error al guardar producto');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await api.deleteProduct(id);
      await loadData();
    } catch (err) {
      alert(err.message || 'Error al eliminar producto');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
        <button className="btn btn-link" onClick={loadData}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="admin-crud-container">
      <div className="admin-crud-header">
        <h2 className='text-primary'>Gestión de Productos</h2>
        <button 
          className="btn btn-primary"
          onClick={() => handleOpenModal()}
        >
          <i className="fas fa-plus me-2"></i>
          Nuevo Producto
        </button>
      </div>

      {/* Tabla de productos */}
<div className="table-responsive">
        <table className="table table-hover admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Imágenes</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  <i className="fas fa-inbox fa-2x d-block mb-2 text-muted"></i>
                  No hay productos registrados
                </td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  {/* SOLUCIÓN AQUÍ: Se limita el ancho máximo y se trunca el texto */}
                  <td style={{ maxWidth: '250px' }}>
                    <strong className="d-block text-truncate">{product.nombre}</strong>
                    {product.descripcion && (
                      <div 
                        className="text-muted small text-truncate" 
                        title={product.descripcion} // Muestra el texto completo al pasar el mouse
                      >
                        {product.descripcion}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className="badge bg-secondary">
                      {product.category?.nombre || 'Sin categoría'}
                    </span>
                  </td>
                  <td className="text-primary fw-bold">${product.precio}</td>
                  <td>
                    <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    {product.images && product.images.length > 0 ? (
                      <div className="d-flex gap-1 flex-wrap">
                        {product.images.slice(0, 3).map((img, idx) => (
                          <img 
                            key={idx}
                            src={img.url} 
                            alt={`${product.nombre}-${idx}`}
                            style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                            className="rounded"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/30';
                            }}
                          />
                        ))}
                        {product.images.length > 3 && (
                          <span className="badge bg-secondary">+{product.images.length - 3}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted">Sin imágenes</span>
                    )}
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => handleOpenModal(product)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn btn-outline-danger"
                        onClick={() => handleDelete(product.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de creación/edición */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Nombre *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          required
                          maxLength={100}
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Categoría *</label>
                        <select
                          className="form-select"
                          name="categoryId"
                          value={formData.categoryId}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Seleccionar categoría</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                              {cat.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      rows="2"
                      maxLength={500}
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Precio *</label>
                        <div className="input-group">
                          <span className="input-group-text">$</span>
                          <input
                            type="number"
                            className="form-control"
                            name="precio"
                            value={formData.precio}
                            onChange={handleInputChange}
                            required
                            min="0.01"
                            step="0.01"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Stock</label>
                        <input
                          type="number"
                          className="form-control"
                          name="stock"
                          value={formData.stock}
                          onChange={handleInputChange}
                          min="0"
                          step="1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Imágenes</label>
                    <div className="input-group mb-2">
                      <input
                        type="url"
                        className="form-control"
                        placeholder="URL de la imagen"
                        value={imageInput}
                        onChange={(e) => setImageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddImage()}
                      />
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary"
                        onClick={handleAddImage}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                    <div className="d-flex gap-2 flex-wrap">
                      {formData.images.map((url, index) => (
                        <div key={index} className="position-relative">
                          <img 
                            src={url} 
                            alt={`Imagen ${index + 1}`}
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                            className="rounded border"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/60';
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute top-0 end-0 translate-middle"
                            style={{ fontSize: '10px', padding: '2px 5px' }}
                            onClick={() => handleRemoveImage(index)}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                      {formData.images.length === 0 && (
                        <span className="text-muted small">No hay imágenes agregadas</span>
                      )}
                    </div>
                    <small className="text-muted">
                      {formData.images.length} imagen(es) agregada(s)
                    </small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingProduct ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductos;