import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Soluciones from "./components/Soluciones";
import Servicios from "./components/Servicios";
import Productos from "./components/Productos";
import About from "./components/About";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";

import MainLayout from "./layouts/MainLayout";
import ProductoDetalle from "./components/ProductoDetalle";
import ProductosPorCategoria from "./components/ProductosPorCategoria";

import AdminLayout from './components/admin/adminLayout';
import AdminDashboard from './components/admin/adminDashboard';
import AdminCategorias from './components/admin/adminCategorias';
import AdminProductos from './components/admin/adminProductos';
import AdminUsuarios from './components/admin/adminUsuarios';

function App() {
  return (
    <BrowserRouter>
      <Routes>      

        {/* Login sin navbar */}
        <Route path="/login" element={<Login />} />

        {/* Rutas con navbar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          {/* Rutas del panel admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="categorias" element={<AdminCategorias />} />
          <Route path="productos" element={<AdminProductos />} />
          <Route path="usuarios" element={<AdminUsuarios />} />
        </Route>

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/soluciones" element={<Soluciones />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/categoria/:categoryId" element={<ProductosPorCategoria />} />
          <Route path="/productos/:id" element={<ProductoDetalle />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;