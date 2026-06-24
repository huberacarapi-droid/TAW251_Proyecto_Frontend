// src/components/admin/AdminCategorias.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../../services/adminServices';
import '../../styles/Admin.css';

function AdminCategorias() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

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
      setError('Error al cargar categorías');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        nombre: category.nombre,
        descripcion: category.descripcion || ''
      });
    } else {
      setEditingCategory(null);
      setFormData({
        nombre: '',
        descripcion: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ nombre: '', descripcion: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        // Actualizar
        await api.updateCategory(editingCategory.id, formData);
      } else {
        // Crear
        await api.createCategory(formData);
      }
      await loadCategories();
      handleCloseModal();
    } catch (err) {
      alert(err.message || 'Error al guardar categoría');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;
    try {
      await api.deleteCategory(id);
      await loadCategories();
    } catch (err) {
      alert(err.message || 'Error al eliminar categoría');
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
        <button className="btn btn-link" onClick={loadCategories}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="admin-crud-container">
      <div className="admin-crud-header">
        <h2 className='text-primary'>Gestión de Categorías</h2>
        <button 
          className="btn btn-primary"
          onClick={() => handleOpenModal()}
        >
          <i className="fas fa-plus me-2"></i>
          Nueva Categoría
        </button>
      </div>

      {/* Tabla de categorías */}
      <div className="table-responsive">
        <table className="table table-hover admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Fecha Actualización</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  <i className="fas fa-inbox fa-2x d-block mb-2 text-muted"></i>
                  No hay categorías registradas
                </td>
              </tr>
            ) : (
              categories.map(category => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td><strong>{category.nombre}</strong></td>
                  <td>{category.descripcion || '-'}</td>
                  <td>{new Date(category.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => handleOpenModal(category)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn btn-outline-danger"
                        onClick={() => handleDelete(category.id)}
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
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
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
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      rows="3"
                      maxLength={255}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingCategory ? 'Actualizar' : 'Crear'}
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

export default AdminCategorias;