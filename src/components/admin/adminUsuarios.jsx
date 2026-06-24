// src/components/admin/AdminUsuarios.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../../services/adminServices';
import '../../styles/Admin.css';

function AdminUsuarios() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    paterno: '',
    materno: '',
    email: '',
    password: '',
    rol: 'user'
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        nombre: user.nombre,
        paterno: user.paterno,
        materno: user.materno || '',
        email: user.email,
        password: '', // No mostrar la contraseña existente
        rol: user.rol || 'user'
      });
    } else {
      setEditingUser(null);
      setFormData({
        nombre: '',
        paterno: '',
        materno: '',
        email: '',
        password: '',
        rol: 'user'
      });
    }
    setShowPassword(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      nombre: '',
      paterno: '',
      materno: '',
      email: '',
      password: '',
      rol: 'user'
    });
    setShowPassword(false);
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
    
    // Validaciones
    if (!formData.nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }
    if (!formData.paterno.trim()) {
      alert('El apellido paterno es obligatorio');
      return;
    }
    if (!formData.email.trim()) {
      alert('El email es obligatorio');
      return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Por favor ingresa un email válido');
      return;
    }

    // Validar contraseña solo para nuevos usuarios o si se proporciona una nueva
    if (!editingUser && !formData.password) {
      alert('La contraseña es obligatoria para nuevos usuarios');
      return;
    }
    
    if (formData.password && formData.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      const userData = {
        nombre: formData.nombre.trim(),
        paterno: formData.paterno.trim(),
        materno: formData.materno.trim() || undefined,
        email: formData.email.trim(),
        rol: formData.rol
      };

      // Solo incluir password si se proporciona
      if (formData.password) {
        userData.password = formData.password;
      }

      if (editingUser) {
        await api.updateUser(editingUser.id, userData);
      } else {
        await api.createUser(userData);
      }
      
      await loadUsers();
      handleCloseModal();
    } catch (err) {
      alert(err.message || 'Error al guardar usuario');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      await api.deleteUser(id);
      await loadUsers();
    } catch (err) {
      alert(err.message || 'Error al eliminar usuario');
    }
  };

  const getRolBadge = (rol) => {
    const roles = {
      admin: { color: 'danger', icon: 'fa-user-shield' },
      user: { color: 'primary', icon: 'fa-user' },
      guest: { color: 'secondary', icon: 'fa-user-clock' }
    };
    const rolInfo = roles[rol] || roles.guest;
    return (
      <span className={`badge bg-${rolInfo.color}`}>
        <i className={`fas ${rolInfo.icon} me-1`}></i>
        {rol}
      </span>
    );
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
        <button className="btn btn-link" onClick={loadUsers}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="admin-crud-container">
      <div className="admin-crud-header">
        <h2 className='text-primary'>Gestión de Usuarios</h2>
        <button 
          className="btn btn-primary"
          onClick={() => handleOpenModal()}
        >
          <i className="fas fa-user-plus me-2"></i>
          Nuevo Usuario
        </button>
      </div>

      {/* Tabla de usuarios */}
      <div className="table-responsive">
        <table className="table table-hover admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre completo</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  <i className="fas fa-inbox fa-2x d-block mb-2 text-muted"></i>
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="user-avatar me-2">
                        <i className="fas fa-user-circle fa-2x text-secondary"></i>
                      </div>
                      <div>
                        <strong>{user.nombre} {user.paterno}</strong>
                        {user.materno && (
                          <div className="text-muted small">{user.materno}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <a href={`mailto:${user.email}`} className="text-decoration-none">
                      {user.email}
                    </a>
                  </td>
                  <td>{getRolBadge(user.rol)}</td>
                  <td>
                    <small className="text-muted">
                      {new Date(user.createdAt || user.updatedAt).toLocaleDateString()}
                    </small>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => handleOpenModal(user)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn btn-outline-danger"
                        onClick={() => handleDelete(user.id)}
                        disabled={user.rol === 'admin'} // No permitir eliminar admin
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                    {user.rol === 'admin' && (
                      <span className="badge bg-warning text-dark ms-1" title="Usuario administrador - no se puede eliminar">
                        <i className="fas fa-lock"></i>
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Estadísticas rápidas */}
      <div className="row mt-4 g-3">
        <div className="col-md-3 col-6">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h6 className="mb-0">Total Usuarios</h6>
              <h3 className="mb-0">{users.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card bg-danger text-white">
            <div className="card-body text-center">
              <h6 className="mb-0">Administradores</h6>
              <h3 className="mb-0">{users.filter(u => u.rol === 'admin').length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h6 className="mb-0">Usuarios</h6>
              <h3 className="mb-0">{users.filter(u => u.rol === 'user').length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card bg-secondary text-white">
            <div className="card-body text-center">
              <h6 className="mb-0">Invitados</h6>
              <h3 className="mb-0">{users.filter(u => u.rol === 'guest').length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de creación/edición */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-user me-2"></i>
                  {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
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
                          maxLength={50}
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Apellido Paterno *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="paterno"
                          value={formData.paterno}
                          onChange={handleInputChange}
                          required
                          maxLength={50}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Apellido Materno</label>
                    <input
                      type="text"
                      className="form-control"
                      name="materno"
                      value={formData.materno}
                      onChange={handleInputChange}
                      maxLength={50}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      maxLength={100}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      {editingUser ? 'Nueva Contraseña (opcional)' : 'Contraseña *'}
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required={!editingUser}
                        minLength={6}
                        placeholder={editingUser ? 'Dejar en blanco para mantener' : 'Mínimo 6 caracteres'}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                    {editingUser && (
                      <small className="text-muted">
                        <i className="fas fa-info-circle me-1"></i>
                        Solo completar si deseas cambiar la contraseña
                      </small>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Rol</label>
                    <select
                      className="form-select"
                      name="rol"
                      value={formData.rol}
                      onChange={handleInputChange}
                    >
                      <option value="admin">Administrador</option>
                      <option value="user">Usuario</option>
                      <option value="guest">Invitado</option>
                    </select>
                    <small className="text-muted">
                      <i className="fas fa-info-circle me-1"></i>
                      El rol define los permisos del usuario
                    </small>
                  </div>

                  {editingUser && editingUser.rol === 'admin' && (
                    <div className="alert alert-warning">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      Estás editando un usuario administrador. Ten cuidado con los cambios.
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className={`fas ${editingUser ? 'fa-save' : 'fa-user-plus'} me-2`}></i>
                    {editingUser ? 'Actualizar' : 'Crear'}
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

export default AdminUsuarios;