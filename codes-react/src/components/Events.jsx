import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Carousel, Button } from 'react-bootstrap';
import './Events.css';

const Events = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const events = [
    {
      id: 'hackathon',
      title: 'HACKATHON VIRTUAL',
      organizer: 'CODES++',
      description: [
        'Competencia de programación en equipos',
        '48 horas de desarrollo intensivo',
        'Reconocimientos especiales para ganadores',
        'Proyectos para la comunidad UNLu'
      ],
      details: [
        { icon: 'bi-calendar-event', label: 'Fecha', value: 'Viernes 26 de Septiembre (tentativa)' },
        { icon: 'bi-people', label: 'Equipos', value: '3 personas obligatorio' },
        { icon: 'bi-laptop', label: 'Modalidad', value: 'Virtual' }
      ],
      note: '¿Nunca participaste? ¡No te preocupes! Es perfecto para aprender y experimentar.',
      buttonText: 'Ver Información Completa',
      buttonLink: '#',
      icon: 'bi-code-slash'
    },
    {
      id: 'expo-unlu',
      title: 'Expo UNLu 2025',
      organizer: 'Evento anual de la Universidad Nacional de Luján',
      description: [
        'La Expo UNLu es un evento anual pensado para que estudiantes de escuelas secundarias conozcan las carreras que ofrece la universidad.',
        'Es una instancia clave para acercar a nuevos ingresantes y mostrar las oportunidades académicas disponibles.'
      ],
      features: [
        '📚 Información detallada de todas las carreras',
        '👥 Charlas con estudiantes y graduados',
        '🏫 Recorridos por las instalaciones',
        '💼 Orientación vocacional y académica',
        '🎓 Experiencias de vida universitaria'
      ],
      buttonText: 'Ver información completa',
      buttonLink: '/expo-unlu',
      icon: 'bi-building'
    }
  ];

  // Auto-advance carousel (pausa cuando está en hover)
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % events.length);
      }, 5000); // Cambia cada 5 segundos
      return () => clearInterval(interval);
    }
  }, [isHovered, events.length]);

  // Navegación por teclado
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        setActiveIndex((prevIndex) => 
          prevIndex === 0 ? events.length - 1 : prevIndex - 1
        );
      } else if (event.key === 'ArrowRight') {
        setActiveIndex((prevIndex) => 
          prevIndex === events.length - 1 ? 0 : prevIndex + 1
        );
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [events.length]);

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <section id="eventos" className="py-5">
      <Container>
        <div className="text-center mb-5">
          <h2 className="section-title">Actividades y Novedades</h2>
          <p className="section-subtitle">
            Mantente al día con nuestras próximas actividades y eventos.
          </p>
        </div>

        {/* Carrusel Mejorado */}
        <div className="activities-carousel-container">
          <Carousel
            activeIndex={activeIndex}
            onSelect={handleSelect}
            interval={null} // Deshabilitamos el auto-advance de Bootstrap
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="activities-carousel"
          >
            {events.map((event, index) => (
              <Carousel.Item key={event.id}>
                <Row className="justify-content-center">
                  <Col md={8} lg={6}>
                    <div className="event-card">
                      <div className="event-content">
                        <h3>
                          <i className={`bi ${event.icon} text-primary me-2`}></i>
                          {event.title}
                        </h3>
                        <p className="mb-2">
                          <strong>Organiza:</strong> {event.organizer}
                        </p>
                        
                        {/* Descripción */}
                        {event.description && (
                          <div className="mb-3">
                            {event.description.map((desc, idx) => (
                              <p key={idx} className={idx === 0 ? 'mb-2' : 'mb-1'}>
                                {desc}
                              </p>
                            ))}
                          </div>
                        )}

                        {/* Lista de características */}
                        {event.description && event.description.length > 1 && (
                          <ul className="mb-2">
                            {event.description.slice(1).map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        )}

                        {/* Características especiales */}
                        {event.features && (
                          <div className="mb-3">
                            <h6 className="fw-bold text-primary mb-2">
                              <i className="bi bi-calendar-check me-1"></i>¿Qué encontrarás?
                            </h6>
                            <ul className="mb-2 small">
                              {event.features.map((feature, idx) => (
                                <li key={idx}>{feature}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Detalles adicionales */}
                        {event.details && (
                          <div className="mb-3">
                            {event.details.map((detail, idx) => (
                              <p key={idx} className="mb-2">
                                <i className={`bi ${detail.icon} text-primary`}></i>
                                <strong> {detail.label}:</strong> {detail.value}
                              </p>
                            ))}
                          </div>
                        )}

                        {/* Nota especial */}
                        {event.note && (
                          <p className="mb-3">
                            <i className="bi bi-info-circle text-primary"></i>
                            <strong> {event.note}</strong>
                          </p>
                        )}
                      </div>
                      
                      <div className="event-button">
                        <Button 
                          as="a" 
                          href={event.buttonLink}
                          className="btn btn-primary w-100"
                        >
                          <i className={`bi ${event.icon} me-2`}></i>
                          {event.buttonText}
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        {/* Indicadores personalizados */}
        <div className="text-center mt-4">
          <div className="carousel-indicators-custom">
            {events.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Ir a la actividad ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Navegación por teclado */}
        <div className="text-center mt-3">
          <small className="text-muted">
            <i className="bi bi-keyboard me-1"></i>
            Usa las flechas ← → del teclado para navegar
          </small>
        </div>
      </Container>
    </section>
  );
};

export default Events;
