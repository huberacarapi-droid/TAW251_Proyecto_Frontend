// src/components/admin/AdminSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

function AdminSidebar() {
  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h4 className="text-white mb-0">Panel Admin</h4>
        <small className="text-muted">Sistema de gestión</small>
      </div>
      <nav className="admin-sidebar-nav">
        <NavLink 
          to="/admin" 
          className={({ isActive }) => 
            `admin-nav-link ${isActive ? 'active' : ''}`
          }
          end
        >
          <i className="fas fa-tachometer-alt me-2"></i>
          Dashboard
        </NavLink>
        <NavLink 
          to="/admin/categorias" 
          className={({ isActive }) => 
            `admin-nav-link ${isActive ? 'active' : ''}`
          }
        >
          <i className="fas fa-tags me-2"></i>
          Categorías
        </NavLink>
        <NavLink 
          to="/admin/productos" 
          className={({ isActive }) => 
            `admin-nav-link ${isActive ? 'active' : ''}`
          }
        >
          <i className="fas fa-box me-2"></i>
          Productos
        </NavLink>
        <NavLink 
          to="/admin/usuarios" 
            className={({ isActive }) => 
              `admin-nav-link ${isActive ? 'active' : ''}`
            }
          >
          <i className="fas fa-users me-2"></i>
          Usuarios
        </NavLink>

        <NavLink to="/productos"
        className={({ isActive }) => 
              `admin-nav-link ${isActive ? 'active' : ''}`
            }
          >
          <i className="fas fa-store me-1"></i>
          Ver tienda
        </NavLink>
    
      </nav>
    </div>
  );
}

export default AdminSidebar;