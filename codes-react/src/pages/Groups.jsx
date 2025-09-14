import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Groups = () => {
  const groups = [
    { materia: 'Algoritmos y Estructuras de Datos', link: '#' },
    { materia: 'Programación I', link: '#' },
    { materia: 'Programación II', link: '#' },
    { materia: 'Base de Datos', link: '#' },
    { materia: 'Sistemas Operativos', link: '#' },
    { materia: 'Redes de Computadoras', link: '#' },
    { materia: 'Ingeniería de Software', link: '#' },
    { materia: 'Inteligencia Artificial', link: '#' }
  ];

  return (
    <div className="py-5" style={{ marginTop: '80px' }}>
      <Container>
        <Row className="mb-4">
          <Col>
            <Link to="/" className="btn btn-outline-primary mb-3">
              <i className="bi bi-arrow-left me-2"></i>
              Volver al Inicio
            </Link>
            <h1 className="display-4 mb-3">Grupos de Estudio</h1>
            <p className="lead">
              Unite a los grupos de estudio de cada materia y conectate con otros estudiantes.
            </p>
          </Col>
        </Row>

        <Row>
          <Col lg={8} className="mx-auto">
            <div className="list-group">
              {groups.map((group, index) => (
                <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">{group.materia}</h5>
                    <p className="mb-0 text-muted">Grupo de estudio activo</p>
                  </div>
                  <Button 
                    as="a" 
                    href={group.link}
                    variant="primary" 
                    size="sm"
                    data-materia={group.materia}
                  >
                    Unirse
                  </Button>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Groups;

