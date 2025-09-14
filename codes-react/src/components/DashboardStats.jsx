import React, { useState, useEffect } from 'react';
import { Row, Col, Card, ProgressBar } from 'react-bootstrap';
import './DashboardStats.css';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalViews: 0,
    monthlyViews: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de estadísticas
    const loadStats = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalPosts: 24,
        publishedPosts: 18,
        draftPosts: 6,
        totalUsers: 156,
        activeUsers: 89,
        totalViews: 12450,
        monthlyViews: 3240
      });
      
      setLoading(false);
    };

    loadStats();
  }, []);

  const statCards = [
    {
      title: 'Total de Posts',
      value: stats.totalPosts,
      icon: 'fas fa-newspaper',
      color: 'primary',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Posts Publicados',
      value: stats.publishedPosts,
      icon: 'fas fa-check-circle',
      color: 'success',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Borradores',
      value: stats.draftPosts,
      icon: 'fas fa-edit',
      color: 'warning',
      change: '+3%',
      changeType: 'positive'
    },
    {
      title: 'Usuarios Activos',
      value: stats.activeUsers,
      icon: 'fas fa-users',
      color: 'info',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Vistas Totales',
      value: stats.totalViews.toLocaleString(),
      icon: 'fas fa-eye',
      color: 'secondary',
      change: '+22%',
      changeType: 'positive'
    },
    {
      title: 'Vistas del Mes',
      value: stats.monthlyViews.toLocaleString(),
      icon: 'fas fa-chart-line',
      color: 'danger',
      change: '+18%',
      changeType: 'positive'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Nuevo post publicado',
      description: 'Plan de Estudios 2025',
      user: 'Admin',
      time: 'Hace 2 horas',
      type: 'success'
    },
    {
      id: 2,
      action: 'Usuario registrado',
      description: 'nuevo.miembro@unlu.edu.ar',
      user: 'Sistema',
      time: 'Hace 4 horas',
      type: 'info'
    },
    {
      id: 3,
      action: 'Post actualizado',
      description: 'Hackathon Virtual 2025',
      user: 'Editor',
      time: 'Hace 6 horas',
      type: 'warning'
    },
    {
      id: 4,
      action: 'Comentario moderado',
      description: 'En post de Recursos',
      user: 'Admin',
      time: 'Hace 8 horas',
      type: 'primary'
    }
  ];

  if (loading) {
    return (
      <div className="stats-loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-stats">
      <Row className="mb-4">
        {statCards.map((card, index) => (
          <Col lg={4} md={6} key={index} className="mb-4">
            <Card className={`stat-card stat-${card.color}`}>
              <Card.Body>
                <div className="stat-header">
                  <div className="stat-icon">
                    <i className={card.icon}></i>
                  </div>
                  <div className={`stat-change stat-change-${card.changeType}`}>
                    {card.change}
                  </div>
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{card.value}</h3>
                  <p className="stat-title">{card.title}</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        <Col lg={8} className="mb-4">
          <Card className="activity-card">
            <Card.Header>
              <h5 className="card-title">
                <i className="fas fa-history me-2"></i>
                Actividad Reciente
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="activity-list">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className={`activity-icon activity-${activity.type}`}>
                      <i className="fas fa-circle"></i>
                    </div>
                    <div className="activity-content">
                      <div className="activity-action">{activity.action}</div>
                      <div className="activity-description">{activity.description}</div>
                      <div className="activity-meta">
                        <span className="activity-user">{activity.user}</span>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} className="mb-4">
          <Card className="progress-card">
            <Card.Header>
              <h5 className="card-title">
                <i className="fas fa-chart-pie me-2"></i>
                Progreso del Mes
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="progress-item">
                <div className="progress-label">
                  <span>Posts Publicados</span>
                  <span>75%</span>
                </div>
                <ProgressBar now={75} variant="success" className="progress-bar-custom" />
              </div>
              
              <div className="progress-item">
                <div className="progress-label">
                  <span>Usuarios Activos</span>
                  <span>57%</span>
                </div>
                <ProgressBar now={57} variant="info" className="progress-bar-custom" />
              </div>
              
              <div className="progress-item">
                <div className="progress-label">
                  <span>Engagement</span>
                  <span>82%</span>
                </div>
                <ProgressBar now={82} variant="warning" className="progress-bar-custom" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardStats;
