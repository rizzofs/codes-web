import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Resources.css';

const Resources = () => {
  const resources = [
    {
      title: 'Bibliografía recomendada',
      description: 'Accedé a una recopilación de libros y manuales usados en las materias de la carrera.',
      icon: 'fas fa-book-open',
      link: 'https://github.com/CODES-UNLU/Libros_Digitales',
      external: true,
      category: 'Estudio',
      color: '#ff6b6b'
    },
    {
      title: 'Guías y apuntes por materia',
      description: 'Repositorio organizado por año con guías, parciales resueltos y apuntes útiles.',
      icon: 'fas fa-file-alt',
      link: 'https://github.com/CODES-UNLU',
      external: true,
      category: 'Material',
      color: '#4ecdc4'
    },
    {
      title: 'Grupos de estudio (Discord)',
      description: 'Unite a nuestro servidor para consultas, organización de grupos y apoyo entre estudiantes.',
      icon: 'fab fa-discord',
      link: 'https://discord.gg/rDtEx4dMvD',
      external: true,
      category: 'Comunidad',
      color: '#7289da'
    },
    {
      title: 'Grupos de WhatsApp',
      description: 'Sumate a los grupos de WhatsApp para cada materia y cuatrimestre.',
      icon: 'fab fa-whatsapp',
      link: '/grupos',
      external: false,
      category: 'Comunidad',
      color: '#25d366'
    },
    {
      title: 'Simulador de avance',
      description: 'Simulá tu avance en la carrera, marcá materias aprobadas y planificá tu recorrido académico.',
      icon: 'fas fa-chart-line',
      link: 'https://codes-unlu.github.io/GestorAcademico/',
      external: true,
      category: 'Herramientas',
      color: '#f093fb'
    },
    {
      title: 'Calendario académico',
      description: 'Mantente al día con fechas importantes, exámenes y eventos de la universidad.',
      icon: 'fas fa-calendar-alt',
      link: '/calendario',
      external: false,
      category: 'Información',
      color: '#4facfe'
    }
  ];

  return (
    <section id="extra" className="py-5">
      <Container>
        <div className="text-center mb-5">
          <h2 className="section-title">📂 Recursos Útiles</h2>
          <p className="section-subtitle">
            Accedé a todos los recursos que hemos preparado para ayudarte en tu carrera.
          </p>
        </div>

        <div className="resources-grid">
          {resources.map((resource, index) => (
            <div className="resource-card" key={index}>
              <div className="resource-card-inner">
                <div className="resource-icon" style={{ backgroundColor: resource.color }}>
                  <i className={resource.icon}></i>
                </div>
                <div className="resource-category">{resource.category}</div>
                <h3 className="resource-title">{resource.title}</h3>
                <p className="resource-description">{resource.description}</p>
                <a 
                  href={resource.link} 
                  target={resource.external ? "_blank" : "_self"}
                  rel={resource.external ? "noopener noreferrer" : ""}
                  className="resource-link"
                  data-bs-toggle="tooltip" 
                  data-bs-placement="top" 
                  title={resource.external ? "Abrir enlace externo" : "Ver información"}
                >
                  <span>Acceder</span>
                  <i className="fas fa-arrow-right"></i>
                </a>
                {resource.external && (
                  <div className="external-indicator">
                    <i className="fas fa-external-link-alt"></i>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Resources;

