import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './adminNavbar';
import '../../styles/Admin.css';

function AdminLayout() {
  return (
    <div className="admin-wrapper2">
      
      <div className="admin-main">
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;