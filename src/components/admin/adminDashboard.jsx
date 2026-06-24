// src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/adminServices';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import '../../styles/Admin.css';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// Componente de carga
const LoadingSpinner = ({ message = 'Cargando estadísticas...' }) => (
  <div className="text-center py-5">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Cargando...</span>
    </div>
    <p className="mt-3 text-muted">{message}</p>
  </div>
);

// Componente de tarjeta de estadísticas
const StatCard = ({ icon, label, value, subtitle, color, linkTo, linkText }) => {
  const colorMap = {
    primary: 'stat-card-primary',
    success: 'stat-card-success',
    info: 'stat-card-info',
    warning: 'stat-card-warning',
  };

  const iconMap = {
    products: 'fa-box',
    categories: 'fa-tags',
    users: 'fa-users',
    inventory: 'fa-chart-line',
  };

  return (
    <div className={`dashboard-card ${colorMap[color]}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="card-label">{label}</div>
            <div className="card-number">{value}</div>
            {subtitle && (
              <small className="text-muted d-block mt-1">
                <i className={`fas ${iconMap[icon]} me-1`}></i>
                {subtitle}
              </small>
            )}
          </div>
          <div className="card-icon-wrapper">
            <i className={`fas ${iconMap[icon]}`}></i>
          </div>
        </div>
        {linkTo && (
          <div className="card-footer-link">
            <Link to={linkTo} className="stretched-link">
              {linkText || 'Ver todos'} <i className="fas fa-arrow-right ms-1"></i>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente de badge de rol
const RoleBadge = ({ rol }) => {
  const roles = useMemo(() => ({
    admin: { color: 'danger', icon: 'fa-user-shield', label: 'Administrador' },
    user: { color: 'primary', icon: 'fa-user', label: 'Usuario' },
    guest: { color: 'secondary', icon: 'fa-user-clock', label: 'Invitado' },
  }), []);

  const rolInfo = roles[rol] || roles.guest;
  
  return (
    <span className={`badge bg-${rolInfo.color}`}>
      <i className={`fas ${rolInfo.icon} me-1`}></i>
      {rolInfo.label}
    </span>
  );
};

// Componente para gráfico con manejo de errores
const ChartWrapper = ({ children, title, icon, emptyMessage = 'No hay datos suficientes para mostrar' }) => {
  return (
    <div className="dashboard-card">
      <div className="card-header-custom">
        <h5 className="mb-0">
          <i className={`fas ${icon} me-2 text-primary`}></i>
          {title}
        </h5>
      </div>
      <div className="card-body" style={{ height: '300px', position: 'relative' }}>
        {children ? (
          children
        ) : (
          <div className="d-flex align-items-center justify-content-center h-100">
            <p className="text-muted text-center">
              <i className="fas fa-chart-simple fa-2x d-block mb-2"></i>
              {emptyMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      categories: 0,
      products: 0,
      users: 0,
      admins: 0,
      totalStock: 0,
      totalValue: 0,
    },
    recentProducts: [],
    recentUsers: [],
    chartData: {
      categoryCounts: { labels: [], data: [] },
      categoryValues: { labels: [], data: [] },
      monthly: { labels: [], products: [], value: [] },
    },
    monthlyData: { labels: [], products: [], value: [] },
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  // Formateador de fecha
  const formatDate = useCallback((date) => {
    if (!date) return 'Fecha no disponible';
    try {
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Fecha inválida';
    }
  }, []);

  // Generar datos para gráficos - VERSIÓN CORREGIDA
  const generateChartData = useCallback((products, categories) => {
    try {
      // Crear mapa de categorías por ID
      const categoryMap = {};
      categories.forEach(cat => {
        categoryMap[cat.id] = cat.nombre;
      });

      // Datos para gráfico de barras - Productos por categoría
      const categoryCounts = {};
      
      products.forEach(product => {
        // CORRECCIÓN: Usar product.category?.id en lugar de product.categoryId
        const catId = product.category?.id || 'sin-categoria';
        const catName = product.category?.nombre || 'Sin categoría';
        
        if (!categoryCounts[catId]) {
          categoryCounts[catId] = {
            count: 0,
            name: catName,
            totalValue: 0
          };
        }
        categoryCounts[catId].count += 1;
        
        // Calcular valor del producto (precio * stock)
        const price = parseFloat(product.precio) || 0;
        const stock = Math.max(0, product.stock || 0);
        categoryCounts[catId].totalValue += price * stock;
      });

      // Preparar datos para gráfico de barras (productos por categoría)
      const labels = [];
      const data = [];
      Object.keys(categoryCounts).forEach(catId => {
        labels.push(categoryCounts[catId].name);
        data.push(categoryCounts[catId].count);
      });

      // Preparar datos para gráfico de doughnut (valor por categoría)
      const valueLabels = [];
      const valueData = [];
      Object.keys(categoryCounts).forEach(catId => {
        valueLabels.push(categoryCounts[catId].name);
        valueData.push(categoryCounts[catId].totalValue);
      });

      // Si no hay datos, mostrar valores por defecto
      if (labels.length === 0) {
        labels.push('Sin datos');
        data.push(0);
        valueLabels.push('Sin datos');
        valueData.push(0);
      }

      // Datos mensuales - Usando fechas reales de los productos
      const monthlyData = {};
      products.forEach(product => {
        if (product.createdAt) {
          const date = new Date(product.createdAt);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          const monthName = date.toLocaleString('es-ES', { month: 'short' });
          
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
              name: monthName,
              count: 0,
              value: 0
            };
          }
          monthlyData[monthKey].count += 1;
          const price = parseFloat(product.precio) || 0;
          const stock = Math.max(0, product.stock || 0);
          monthlyData[monthKey].value += price * stock;
        }
      });

      // Ordenar por mes y preparar datos
      const sortedMonths = Object.keys(monthlyData).sort();
      
      // Si no hay datos mensuales, usar datos simulados
      let monthlyProducts = [];
      let monthlyValue = [];
      let monthLabels = [];
      
      if (sortedMonths.length > 0) {
        monthLabels = sortedMonths.map(key => monthlyData[key].name);
        monthlyProducts = sortedMonths.map(key => monthlyData[key].count);
        monthlyValue = sortedMonths.map(key => monthlyData[key].value);
      } else {
        // Datos simulados si no hay productos con fecha
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        monthLabels = months;
        monthlyProducts = months.map(() => Math.floor(Math.random() * 20) + 5);
        monthlyValue = months.map(() => Math.floor(Math.random() * 10000) + 2000);
      }

      return {
        categoryCounts: { 
          labels: labels, 
          data: data 
        },
        categoryValues: { 
          labels: valueLabels, 
          data: valueData 
        },
        monthly: {
          labels: monthLabels,
          products: monthlyProducts,
          value: monthlyValue,
        },
      };
    } catch (error) {
      console.error('Error generating chart data:', error);
      return {
        categoryCounts: { labels: ['Sin datos'], data: [0] },
        categoryValues: { labels: ['Sin datos'], data: [0] },
        monthly: { 
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'], 
          products: [0, 0, 0, 0, 0, 0], 
          value: [0, 0, 0, 0, 0, 0] 
        },
      };
    }
  }, []);

  // Cargar datos del dashboard
  const loadDashboardData = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) setIsRefreshing(true);
      else setLoading(true);
      setError(null);

      const [categories, products, users] = await Promise.all([
        api.getCategories().catch(() => []),
        api.getProducts().catch(() => []),
        api.getUsers().catch(() => []),
      ]);

      // Debug: Verificar estructura de los datos
      console.log('Products loaded:', products.map(p => ({
        id: p.id,
        nombre: p.nombre,
        category: p.category,
        precio: p.precio,
        stock: p.stock
      })));

      // Cálculos de estadísticas
      const totalStock = products.reduce((sum, p) => sum + Math.max(0, p.stock || 0), 0);
      const totalValue = products.reduce((sum, p) => {
        const price = parseFloat(p.precio) || 0;
        const stock = Math.max(0, p.stock || 0);
        return sum + (price * stock);
      }, 0);
      const admins = users.filter(u => u.rol === 'admin').length;

      // Ordenar y obtener recientes
      const sortedProducts = [...products].sort((a, b) => 
        new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
      ).slice(0, 5);

      const sortedUsers = [...users].sort((a, b) => 
        new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
      ).slice(0, 5);

      // Generar datos para gráficos
      const chartData = generateChartData(products, categories);

      setDashboardData({
        stats: {
          categories: categories.length,
          products: products.length,
          users: users.length,
          admins,
          totalStock,
          totalValue,
        },
        recentProducts: sortedProducts,
        recentUsers: sortedUsers,
        chartData,
        monthlyData: chartData.monthly,
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Error al cargar los datos del dashboard. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [generateChartData]);

  // Generar reporte PDF
  const generatePDFReport = useCallback(async () => {
    try {
      setGeneratingPDF(true);
      
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.width;
      
      // Título
      doc.setFontSize(22);
      doc.setTextColor(33, 37, 41);
      doc.text('Dashboard - Reporte de Gestión', pageWidth / 2, 25, { align: 'center' });
      
      // Fecha
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      const now = new Date();
      const dateStr = now.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      doc.text(`Generado: ${dateStr}`, pageWidth / 2, 33, { align: 'center' });
      
      // Línea separadora
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 38, pageWidth - 20, 38);
      
      // Resumen de Estadísticas
      doc.setFontSize(16);
      doc.setTextColor(33, 37, 41);
      doc.text('Resumen de Estadísticas', 20, 48);
      
      const { stats } = dashboardData;
      const statsData = [
        ['Métrica', 'Valor', 'Detalle'],
        ['Total Productos', stats.products.toString(), `${stats.totalStock} unidades en stock`],
        ['Total Categorías', stats.categories.toString(), ''],
        ['Total Usuarios', stats.users.toString(), `${stats.admins} administradores`],
        ['Valor del Inventario', `$${stats.totalValue.toFixed(2)}`, ''],
      ];
      
      doc.autoTable({
        startY: 52,
        head: [statsData[0]],
        body: statsData.slice(1),
        theme: 'striped',
        headStyles: {
          fillColor: [13, 110, 253],
          textColor: [255, 255, 255],
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 10,
        },
        columnStyles: {
          0: { cellWidth: 70 },
          1: { cellWidth: 50 },
          2: { cellWidth: 70 },
        },
        margin: { left: 20 },
      });
      
      // Productos Recientes
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(16);
      doc.setTextColor(33, 37, 41);
      doc.text('Productos Recientes', 20, finalY);
      
      const productsData = dashboardData.recentProducts.map(p => [
        p.nombre || 'Sin nombre',
        p.category?.nombre || 'Sin categoría',
        `$${parseFloat(p.precio || 0).toFixed(2)}`,
        `${p.stock || 0} unidades`,
      ]);
      
      doc.autoTable({
        startY: finalY + 4,
        head: [['Producto', 'Categoría', 'Precio', 'Stock']],
        body: productsData.length > 0 ? productsData : [['No hay productos registrados', '', '', '']],
        theme: 'striped',
        headStyles: {
          fillColor: [13, 110, 253],
          textColor: [255, 255, 255],
          fontSize: 9,
        },
        bodyStyles: {
          fontSize: 9,
        },
        columnStyles: {
          0: { cellWidth: 55 },
          1: { cellWidth: 40 },
          2: { cellWidth: 30 },
          3: { cellWidth: 35 },
        },
        margin: { left: 20 },
      });
      
      // Usuarios Recientes
      const finalY2 = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(16);
      doc.setTextColor(33, 37, 41);
      doc.text('Usuarios Recientes', 20, finalY2);
      
      const usersData = dashboardData.recentUsers.map(u => [
        `${u.nombre || ''} ${u.paterno || ''}`.trim() || 'Sin nombre',
        u.email || 'Sin email',
        u.rol || 'user',
        formatDate(u.updatedAt || u.createdAt),
      ]);
      
      doc.autoTable({
        startY: finalY2 + 4,
        head: [['Nombre', 'Email', 'Rol', 'Última actividad']],
        body: usersData.length > 0 ? usersData : [['No hay usuarios registrados', '', '', '']],
        theme: 'striped',
        headStyles: {
          fillColor: [13, 110, 253],
          textColor: [255, 255, 255],
          fontSize: 9,
        },
        bodyStyles: {
          fontSize: 9,
        },
        columnStyles: {
          0: { cellWidth: 45 },
          1: { cellWidth: 50 },
          2: { cellWidth: 25 },
          3: { cellWidth: 40 },
        },
        margin: { left: 20 },
      });
      
      // Pie de página
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Página ${i} de ${pageCount} - Sistema de Gestión Admin`,
          pageWidth / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
      
      // Descargar PDF
      doc.save(`dashboard-reporte-${now.toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el reporte PDF. Por favor, intenta nuevamente.');
    } finally {
      setGeneratingPDF(false);
    }
  }, [dashboardData, formatDate]);

  // Configuración de gráficos - con validación de datos
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
          },
        },
      },
    },
  }), []);

  // Datos para gráficos con validación - CORREGIDO
  const barChartData = useMemo(() => {
    const data = dashboardData.chartData?.categoryCounts || { labels: ['Sin datos'], data: [0] };
    return {
      labels: data.labels || ['Sin datos'],
      datasets: [
        {
          label: 'Productos por Categoría',
          data: data.data || [0],
          backgroundColor: [
            'rgba(13, 110, 253, 0.8)',
            'rgba(40, 167, 69, 0.8)',
            'rgba(255, 193, 7, 0.8)',
            'rgba(23, 162, 184, 0.8)',
            'rgba(220, 53, 69, 0.8)',
            'rgba(111, 66, 193, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(54, 162, 235, 0.8)',
          ],
          borderColor: [
            'rgb(13, 110, 253)',
            'rgb(40, 167, 69)',
            'rgb(255, 193, 7)',
            'rgb(23, 162, 184)',
            'rgb(220, 53, 69)',
            'rgb(111, 66, 193)',
            'rgb(255, 159, 64)',
            'rgb(54, 162, 235)',
          ],
          borderWidth: 2,
        },
      ],
    };
  }, [dashboardData.chartData]);

  // Datos para gráfico Doughnut - CORREGIDO
  const doughnutData = useMemo(() => {
    const data = dashboardData.chartData?.categoryValues || { labels: ['Sin datos'], data: [0] };
    // Verificar que los datos sean válidos
    const hasValidData = data.data && data.data.some(val => val > 0);
    
    if (!hasValidData) {
      return {
        labels: ['Sin datos'],
        datasets: [
          {
            label: 'Valor por Categoría',
            data: [1],
            backgroundColor: ['rgba(200, 200, 200, 0.8)'],
            borderColor: ['rgb(200, 200, 200)'],
            borderWidth: 2,
          },
        ],
      };
    }

    return {
      labels: data.labels || ['Sin datos'],
      datasets: [
        {
          label: 'Valor por Categoría ($)',
          data: data.data || [0],
          backgroundColor: [
            'rgba(13, 110, 253, 0.8)',
            'rgba(40, 167, 69, 0.8)',
            'rgba(255, 193, 7, 0.8)',
            'rgba(23, 162, 184, 0.8)',
            'rgba(220, 53, 69, 0.8)',
            'rgba(111, 66, 193, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(54, 162, 235, 0.8)',
          ],
          borderColor: '#fff',
          borderWidth: 2,
        },
      ],
    };
  }, [dashboardData.chartData]);

  const lineChartData = useMemo(() => {
    const monthly = dashboardData.monthlyData || { labels: [], products: [], value: [] };
    return {
      labels: monthly.labels || ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Productos Agregados',
          data: monthly.products || [0, 0, 0, 0, 0, 0],
          borderColor: 'rgb(13, 110, 253)',
          backgroundColor: 'rgba(13, 110, 253, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Valor ($)',
          data: monthly.value || [0, 0, 0, 0, 0, 0],
          borderColor: 'rgb(40, 167, 69)',
          backgroundColor: 'rgba(40, 167, 69, 0.1)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y1',
        },
      ],
    };
  }, [dashboardData.monthlyData]);

  // Verificar si hay datos para gráficos
  const hasChartData = useMemo(() => {
    const counts = dashboardData.chartData?.categoryCounts?.data || [];
    const values = dashboardData.chartData?.categoryValues?.data || [];
    return (counts.some(v => v > 0) || values.some(v => v > 0));
  }, [dashboardData.chartData]);

  // Efectos
  useEffect(() => {
    loadDashboardData();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    const refreshTimer = setInterval(() => {
      loadDashboardData(true);
    }, 300000);

    return () => {
      clearInterval(timer);
      clearInterval(refreshTimer);
    };
  }, [loadDashboardData]);

  // Memoizar valores calculados
  const formattedTime = useMemo(() => {
    return currentTime.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }, [currentTime]);

  const formattedDate = useMemo(() => {
    return currentTime.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [currentTime]);

  if (loading) {
    return <LoadingSpinner message="Cargando estadísticas del dashboard..." />;
  }

  if (error) {
    return (
      <div className="alert alert-danger d-flex align-items-center justify-content-between" role="alert">
        <div>
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
        <button 
          className="btn btn-outline-danger btn-sm" 
          onClick={() => loadDashboardData()}
        >
          <i className="fas fa-sync-alt me-1"></i>
          Reintentar
        </button>
      </div>
    );
  }

  const { stats, recentProducts, recentUsers } = dashboardData;

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h2 className="fw-bold mb-1 text-primary">Dashboard</h2>
          <p className="text-muted mb-0">
            <i className="far fa-calendar-alt me-2"></i>
            {formattedDate}
          </p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-danger btn-sm"
            onClick={generatePDFReport}
            disabled={generatingPDF}
          >
            <i className={`fas fa-file-pdf ${generatingPDF ? 'fa-spin' : ''} me-1`}></i>
            {generatingPDF ? 'Generando...' : 'Exportar PDF'}
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => loadDashboardData(true)}
            disabled={isRefreshing}
          >
            <i className={`fas fa-sync-alt ${isRefreshing ? 'fa-spin' : ''} me-1`}></i>
            {isRefreshing ? 'Actualizando...' : 'Actualizar'}
          </button>
          <span className="text-muted">
            <i className="far fa-clock me-1"></i>
            {formattedTime}
          </span>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="row my-5">
        <div className="col-xl-3 col-lg-6 col-md-6">
          <StatCard
            icon="products"
            label="Productos"
            value={stats.products}
            color="primary"
            linkTo="/admin/productos"
          />
        </div>

        <div className="col-xl-3 col-lg-6 col-md-6">
          <StatCard
            icon="categories"
            label="Categorías"
            value={stats.categories}
            color="success"
            linkTo="/admin/categorias"
          />
        </div>

        <div className="col-xl-3 col-lg-6 col-md-6">
          <StatCard
            icon="users"
            label="Usuarios"
            value={stats.users}
            subtitle={`${stats.admins} administradores`}
            color="info"
            linkTo="/admin/usuarios"
          />
        </div>

        <div className="col-xl-3 col-lg-6 col-md-6">
          <StatCard
            icon="inventory"
            label="Valor del Inventario"
            value={`$${stats.totalValue.toFixed(2)}`}
            subtitle={`${stats.totalStock} unidades en stock`}
            color="warning"
          />
        </div>
      </div>

      {/* Gráficos Estadísticos */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <ChartWrapper 
            title="Productos por Categoría" 
            icon="fa-chart-bar"
            emptyMessage="No hay datos de productos para mostrar"
          >
            {barChartData && barChartData.labels && barChartData.labels.length > 0 && (
              <Bar 
                data={barChartData} 
                options={{
                  ...chartOptions,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                      },
                    },
                  },
                }}
              />
            )}
          </ChartWrapper>
        </div>

        <div className="col-lg-6">
          <ChartWrapper 
            title="Valor por Categoría" 
            icon="fa-chart-pie"
            emptyMessage="No hay datos de valor para mostrar"
          >
            {doughnutData && doughnutData.labels && doughnutData.labels.length > 0 && (
              <Doughnut 
                data={doughnutData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      position: 'bottom',
                      labels: {
                        font: {
                          size: 11,
                        },
                        padding: 10,
                      },
                    },
                  },
                  cutout: '60%',
                }}
              />
            )}
          </ChartWrapper>
        </div>
      </div>

      {/* Tendencia Mensual */}
      <div className="row g-4 mb-4">
        <div className="col-12">
          <ChartWrapper 
            title="Tendencia Mensual" 
            icon="fa-chart-line"
            emptyMessage="No hay datos de tendencia para mostrar"
          >
            {lineChartData && lineChartData.labels && lineChartData.labels.length > 0 && (
              <Line 
                data={lineChartData}
                options={{
                  ...chartOptions,
                  scales: {
                    y: {
                      beginAtZero: true,
                      position: 'left',
                    },
                    y1: {
                      beginAtZero: true,
                      position: 'right',
                      grid: {
                        drawOnChartArea: false,
                      },
                    },
                  },
                }}
              />
            )}
          </ChartWrapper>
        </div>
      </div>

      {/* Actividad Reciente */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="dashboard-card">
            <div className="card-header-custom">
              <h5 className="mb-0">
                <i className="fas fa-box me-2 text-primary"></i>
                Productos Recientes
                <span className="badge bg-primary ms-2">
                  {recentProducts.length}
                </span>
              </h5>
              <Link to="/admin/productos" className="btn btn-sm btn-outline-primary">
                Ver todos
              </Link>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {recentProducts.length === 0 ? (
                  <div className="list-group-item text-center text-muted py-4">
                    <i className="fas fa-inbox fa-2x d-block mb-2"></i>
                    No hay productos registrados
                  </div>
                ) : (
                  recentProducts.map(product => (
                    <div key={product.id} className="list-group-item recent-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={product.images[0].url} 
                              alt={product.nombre}
                              className="recent-thumbnail"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/40';
                              }}
                              loading="lazy"
                            />
                          ) : (
                            <div className="recent-thumbnail placeholder-bg">
                              <i className="fas fa-image text-muted"></i>
                            </div>
                          )}
                          <div className="ms-3">
                            <div className="fw-semibold">{product.nombre}</div>
                            <small className="text-muted">
                              {product.category?.nombre || 'Sin categoría'}
                            </small>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-primary">
                            ${parseFloat(product.precio || 0).toFixed(2)}
                          </div>
                          <small className="text-muted">
                            Stock: {Math.max(0, product.stock || 0)}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="dashboard-card">
            <div className="card-header-custom">
              <h5 className="mb-0">
                <i className="fas fa-users me-2 text-info"></i>
                Usuarios Recientes
                <span className="badge bg-info ms-2">
                  {recentUsers.length}
                </span>
              </h5>
              <Link to="/admin/usuarios" className="btn btn-sm btn-outline-primary">
                Ver todos
              </Link>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {recentUsers.length === 0 ? (
                  <div className="list-group-item text-center text-muted py-4">
                    <i className="fas fa-inbox fa-2x d-block mb-2"></i>
                    No hay usuarios registrados
                  </div>
                ) : (
                  recentUsers.map(user => (
                    <div key={user.id} className="list-group-item recent-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <div className="recent-avatar">
                            <i className="fas fa-user-circle fa-2x text-secondary"></i>
                          </div>
                          <div className="ms-3">
                            <div className="fw-semibold">
                              {`${user.nombre || ''} ${user.paterno || ''}`.trim() || 'Usuario sin nombre'}
                            </div>
                            <small className="text-muted d-block">
                              {user.email || 'Sin email'}
                            </small>
                          </div>
                        </div>
                        <div className="text-end">
                          <RoleBadge rol={user.rol} />
                          <div>
                            <small className="text-muted">
                              {formatDate(user.updatedAt || user.createdAt)}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="dashboard-card">
            <h5 className="mb-3">
              <i className="fas fa-bolt me-2 text-warning"></i>
              Acciones Rápidas
            </h5>
            <div className="d-flex flex-wrap gap-2">
              <Link to="/admin/productos/nuevo" className="btn btn-primary">
                <i className="fas fa-plus me-1"></i>
                Nuevo Producto
              </Link>
              <Link to="/admin/categorias/nueva" className="btn btn-success">
                <i className="fas fa-plus me-1"></i>
                Nueva Categoría
              </Link>
              <Link to="/admin/usuarios/nuevo" className="btn btn-info text-white">
                <i className="fas fa-user-plus me-1"></i>
                Nuevo Usuario
              </Link>
              <button 
                className="btn btn-danger"
                onClick={generatePDFReport}
                disabled={generatingPDF}
              >
                <i className={`fas fa-file-pdf ${generatingPDF ? 'fa-spin' : ''} me-1`}></i>
                {generatingPDF ? 'Generando PDF...' : 'Exportar Reporte PDF'}
              </button>
              <Link to="/productos" className="btn btn-outline-secondary">
                <i className="fas fa-store me-1"></i>
                Ver Tienda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(AdminDashboard);