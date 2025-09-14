import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import './Blog.css';

const Blog = () => {
  const [activeFilter, setActiveFilter] = useState('todos');

  const blogPosts = [
    {
      id: 1,
      title: 'Nuevo Plan de Estudios 2025',
      excerpt: 'Conocé todos los cambios y mejoras en el plan de estudios de la carrera de Sistemas para el próximo año académico.',
      content: 'El nuevo plan de estudios incluye materias actualizadas con las últimas tecnologías, nuevos laboratorios y una estructura más flexible que se adapta a las necesidades del mercado laboral actual.',
      author: 'CODES++',
      date: '2025-01-15',
      category: 'Académico',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop',
      tags: ['Plan de Estudios', 'Académico', '2025'],
      featured: true
    },
    {
      id: 2,
      title: 'Hackathon Virtual 2025 - Resultados',
      excerpt: 'Los equipos ganadores del Hackathon Virtual 2025 presentaron proyectos innovadores que beneficiarán a la comunidad universitaria.',
      content: 'El evento contó con la participación de más de 50 estudiantes que desarrollaron soluciones tecnológicas durante 48 horas de programación intensiva.',
      author: 'Equipo CODES++',
      date: '2025-01-10',
      category: 'Eventos',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
      tags: ['Hackathon', 'Programación', 'Competencia'],
      featured: false
    },
    {
      id: 3,
      title: 'Nuevos Recursos de Estudio Disponibles',
      excerpt: 'Hemos agregado nuevos materiales de estudio, apuntes y recursos digitales a nuestra biblioteca virtual.',
      content: 'La biblioteca virtual ahora incluye más de 200 recursos actualizados, incluyendo libros digitales, videos tutoriales y ejercicios prácticos.',
      author: 'Comisión Académica',
      date: '2025-01-08',
      category: 'Recursos',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop',
      tags: ['Recursos', 'Estudio', 'Biblioteca'],
      featured: false
    },
    {
      id: 4,
      title: 'Charla: "El Futuro de la Programación"',
      excerpt: 'El próximo viernes tendremos una charla especial con profesionales de la industria sobre las tendencias en programación.',
      content: 'La charla será dictada por ingenieros de Google y Microsoft, quienes compartirán su experiencia y visión sobre el futuro de la programación.',
      author: 'CODES++',
      date: '2025-01-05',
      category: 'Eventos',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=200&fit=crop',
      tags: ['Charla', 'Programación', 'Profesionales'],
      featured: true
    },
    {
      id: 5,
      title: 'Nuevo Servidor de Discord',
      excerpt: 'Lanzamos nuestro nuevo servidor de Discord con canales organizados por materias y actividades.',
      content: 'El servidor incluye canales de estudio, noticias, eventos y un espacio para que los estudiantes se conecten y colaboren.',
      author: 'Equipo TIC',
      date: '2025-01-03',
      category: 'Comunidad',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop',
      tags: ['Discord', 'Comunidad', 'Estudio'],
      featured: false
    },
    {
      id: 6,
      title: 'Convocatoria: Representantes de Materia',
      excerpt: 'Buscamos estudiantes que quieran representar a sus compañeros en las comisiones de cada materia.',
      content: 'Los representantes de materia son fundamentales para mantener la comunicación entre estudiantes y profesores, y para mejorar la calidad académica.',
      author: 'Comisión Directiva',
      date: '2025-01-01',
      category: 'Comunidad',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop',
      tags: ['Representantes', 'Participación', 'Comunidad'],
      featured: false
    }
  ];

  const categories = [
    { id: 'todos', name: 'Todos', count: blogPosts.length },
    { id: 'Académico', name: 'Académico', count: blogPosts.filter(post => post.category === 'Académico').length },
    { id: 'Eventos', name: 'Eventos', count: blogPosts.filter(post => post.category === 'Eventos').length },
    { id: 'Recursos', name: 'Recursos', count: blogPosts.filter(post => post.category === 'Recursos').length },
    { id: 'Comunidad', name: 'Comunidad', count: blogPosts.filter(post => post.category === 'Comunidad').length }
  ];

  const filteredPosts = activeFilter === 'todos' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeFilter);

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section id="blog" className="py-5">
      <Container>
        <div className="text-center mb-5">
          <h2 className="section-title">📰 Blog y Noticias</h2>
          <p className="section-subtitle">
            Mantente informado sobre las últimas novedades, eventos y recursos de CODES++
          </p>
        </div>

        {/* Filtros de Categorías */}
        <div className="blog-filters mb-5">
          <div className="filters-container">
            {categories.map(category => (
              <button
                key={category.id}
                className={`filter-btn ${activeFilter === category.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(category.id)}
              >
                {category.name}
                <Badge bg="secondary" className="ms-2">{category.count}</Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Posts Destacados */}
        {activeFilter === 'todos' && featuredPosts.length > 0 && (
          <div className="featured-posts mb-5">
            <h3 className="featured-title">
              <i className="fas fa-star me-2"></i>
              Destacados
            </h3>
            <Row>
              {featuredPosts.map(post => (
                <Col lg={6} key={post.id} className="mb-4">
                  <Card className="featured-card h-100">
                    <div className="card-image">
                      <img src={post.image} alt={post.title} />
                      <div className="card-overlay">
                        <Badge bg="primary" className="category-badge">
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <div className="card-meta">
                        <span className="author">
                          <i className="fas fa-user me-1"></i>
                          {post.author}
                        </span>
                        <span className="date">
                          <i className="fas fa-calendar me-1"></i>
                          {formatDate(post.date)}
                        </span>
                      </div>
                      <Card.Title className="card-title">{post.title}</Card.Title>
                      <Card.Text className="card-excerpt flex-grow-1">
                        {post.excerpt}
                      </Card.Text>
                      <div className="card-tags">
                        {post.tags.map(tag => (
                          <Badge key={tag} bg="light" text="dark" className="me-1">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button variant="primary" className="read-more-btn">
                        Leer más
                        <i className="fas fa-arrow-right ms-2"></i>
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* Posts Regulares */}
        <div className="regular-posts">
          {activeFilter !== 'todos' && (
            <h3 className="posts-title">
              <i className="fas fa-newspaper me-2"></i>
              {categories.find(cat => cat.id === activeFilter)?.name}
            </h3>
          )}
          <Row>
            {regularPosts.map(post => (
              <Col lg={4} md={6} key={post.id} className="mb-4">
                <Card className="blog-card h-100">
                  <div className="card-image">
                    <img src={post.image} alt={post.title} />
                    <div className="card-overlay">
                      <Badge bg="primary" className="category-badge">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <div className="card-meta">
                      <span className="author">
                        <i className="fas fa-user me-1"></i>
                        {post.author}
                      </span>
                      <span className="date">
                        <i className="fas fa-calendar me-1"></i>
                        {formatDate(post.date)}
                      </span>
                    </div>
                    <Card.Title className="card-title">{post.title}</Card.Title>
                    <Card.Text className="card-excerpt flex-grow-1">
                      {post.excerpt}
                    </Card.Text>
                    <div className="card-tags">
                      {post.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} bg="light" text="dark" className="me-1">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="outline-primary" className="read-more-btn">
                      Leer más
                      <i className="fas fa-arrow-right ms-2"></i>
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Ver Más */}
        <div className="text-center mt-5">
          <Button variant="primary" size="lg" className="load-more-btn">
            <i className="fas fa-plus me-2"></i>
            Ver Todas las Noticias
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default Blog;
