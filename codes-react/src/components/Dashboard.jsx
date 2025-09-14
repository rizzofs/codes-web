import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Nav, Tab } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import BlogManagement from './BlogManagement';
import UserManagement from './UserManagement';
import DashboardStats from './DashboardStats';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');

  // Usuario por defecto para testing
  const defaultUser = {
    id: 1,
    name: 'Usuario de Prueba',
    email: 'test@codes.unlu.edu.ar',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  };

  // Usar usuario real o usuario por defecto
  const currentUser = user || defaultUser;

  // Función de permisos por defecto (admin tiene todos los permisos)
  const hasPermissionDefault = (permission) => {
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'editor') return permission === 'manage_blog';
    return false;
  };

  const handleLogout = () => {
    if (user) {
      logout();
    }
    window.location.href = '/';
  };

  const getRoleDisplayName = (role) => {
    const roles = {
      admin: 'Administrador',
      editor: 'Editor',
      member: 'Miembro'
    };
    return roles[role] || role;
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'danger',
      editor: 'warning',
      member: 'info'
    };
    return colors[role] || 'secondary';
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <i className="fas fa-code"></i>
            <span>CODES++</span>
          </div>
          <div className="sidebar-user">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name}
              className="user-avatar"
            />
            <div className="user-info">
              <div className="user-name">{currentUser.name}</div>
              <div className={`user-role role-${getRoleColor(currentUser.role)}`}>
                {getRoleDisplayName(currentUser.role)}
              </div>
            </div>
          </div>
        </div>

        <Nav variant="pills" className="flex-column sidebar-nav">
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'stats'} 
              onClick={() => setActiveTab('stats')}
              className="nav-link"
            >
              <i className="fas fa-chart-bar me-2"></i>
              Estadísticas
            </Nav.Link>
          </Nav.Item>
          
          {hasPermissionDefault('manage_blog') && (
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'blog'} 
                onClick={() => setActiveTab('blog')}
                className="nav-link"
              >
                <i className="fas fa-newspaper me-2"></i>
                Gestión de Blog
              </Nav.Link>
            </Nav.Item>
          )}
          
          {hasPermissionDefault('manage_users') && (
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'users'} 
                onClick={() => setActiveTab('users')}
                className="nav-link"
              >
                <i className="fas fa-users me-2"></i>
                Gestión de Usuarios
              </Nav.Link>
            </Nav.Item>
          )}
        </Nav>

        <div className="sidebar-footer">
          <Button 
            variant="outline-danger" 
            size="sm" 
            onClick={handleLogout}
            className="logout-btn"
          >
            <i className="fas fa-sign-out-alt me-2"></i>
            Cerrar Sesión
          </Button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            {activeTab === 'stats' && 'Estadísticas'}
            {activeTab === 'blog' && 'Gestión de Blog'}
            {activeTab === 'users' && 'Gestión de Usuarios'}
          </h1>
          <div className="dashboard-breadcrumb">
            <span>Dashboard</span>
            <i className="fas fa-chevron-right"></i>
            <span>
              {activeTab === 'stats' && 'Estadísticas'}
              {activeTab === 'blog' && 'Blog'}
              {activeTab === 'users' && 'Usuarios'}
            </span>
          </div>
        </div>

        <div className="dashboard-body">
          {activeTab === 'stats' && <DashboardStats />}
          {activeTab === 'blog' && hasPermissionDefault('manage_blog') && <BlogManagement />}
          {activeTab === 'users' && hasPermissionDefault('manage_users') && <UserManagement />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
