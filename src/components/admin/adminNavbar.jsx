// src/components/admin/AdminNavbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function AdminNavbar() {
  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-content">
        <div className="admin-navbar-left">
          <button 
            className="btn btn-link d-md-none"
            onClick={() => document.querySelector('.admin-sidebar')?.classList.toggle('show')}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
        <div className="admin-navbar-right">
          <Link to="/productos" className="btn btn-outline-primary btn-sm me-2">
            <i className="fas fa-store me-1"></i>
            Ver tienda
          </Link>
          <div className="dropdown">
            <button 
              className="btn btn-link dropdown-toggle" 
              type="button" 
              data-bs-toggle="dropdown"
            >
              <i className="fas fa-user-circle fa-2x"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><Link className="dropdown-item" to="/admin/perfil">Perfil</Link></li>
              <li><hr className="dropdown-divider" /></li>
              <li><Link className="dropdown-item" to="/logout">Cerrar sesión</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;