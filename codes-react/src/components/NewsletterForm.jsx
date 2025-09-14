import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import './NewsletterForm.css';

const NewsletterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    interests: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const interestOptions = [
    { id: 'academic', label: 'Noticias Académicas', icon: 'fas fa-graduation-cap' },
    { id: 'events', label: 'Eventos y Actividades', icon: 'fas fa-calendar-alt' },
    { id: 'resources', label: 'Recursos de Estudio', icon: 'fas fa-book' },
    { id: 'community', label: 'Comunidad y Networking', icon: 'fas fa-users' },
    { id: 'tech', label: 'Tecnología y Programación', icon: 'fas fa-code' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleInterestChange = (interestId) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (formData.interests.length === 0) {
      newErrors.interests = 'Selecciona al menos un interés';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setFormData({ email: '', name: '', interests: [] });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="newsletter-form-container">
      <div className="newsletter-header">
        <h3>
          <i className="fas fa-envelope me-2"></i>
          ¡Únete a nuestra comunidad!
        </h3>
        <p>Recibe las últimas noticias, eventos y recursos directamente en tu inbox</p>
      </div>

      <Form onSubmit={handleSubmit} className="newsletter-form">
        {submitStatus === 'success' && (
          <Alert variant="success" className="newsletter-alert">
            <i className="fas fa-check-circle me-2"></i>
            ¡Te has suscrito exitosamente! Te enviaremos un email de confirmación.
          </Alert>
        )}

        {submitStatus === 'error' && (
          <Alert variant="danger" className="newsletter-alert">
            <i className="fas fa-exclamation-circle me-2"></i>
            Hubo un error al procesar tu suscripción. Por favor, intenta nuevamente.
          </Alert>
        )}

        <div className="form-row">
          <Form.Group className="form-group">
            <Form.Label>
              <i className="fas fa-user me-1"></i>
              Nombre Completo
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Tu nombre completo"
              isInvalid={!!errors.name}
              className="form-input"
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label>
              <i className="fas fa-envelope me-1"></i>
              Email
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="tu@email.com"
              isInvalid={!!errors.email}
              className="form-input"
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <Form.Group className="interests-group">
          <Form.Label>
            <i className="fas fa-heart me-1"></i>
            ¿Qué te interesa? (Selecciona al menos uno)
          </Form.Label>
          <div className="interests-grid">
            {interestOptions.map(option => (
              <div
                key={option.id}
                className={`interest-option ${formData.interests.includes(option.id) ? 'selected' : ''}`}
                onClick={() => handleInterestChange(option.id)}
              >
                <input
                  type="checkbox"
                  checked={formData.interests.includes(option.id)}
                  onChange={() => handleInterestChange(option.id)}
                  className="interest-checkbox"
                />
                <div className="interest-content">
                  <i className={option.icon}></i>
                  <span>{option.label}</span>
                </div>
              </div>
            ))}
          </div>
          {errors.interests && (
            <div className="invalid-feedback d-block">
              {errors.interests}
            </div>
          )}
        </Form.Group>

        <div className="form-footer">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            className="submit-btn"
          >
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Suscribiéndose...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane me-2"></i>
                Suscribirse
              </>
            )}
          </Button>
          
          <p className="privacy-note">
            <i className="fas fa-shield-alt me-1"></i>
            Respetamos tu privacidad. No compartimos tu información con terceros.
          </p>
        </div>
      </Form>
    </div>
  );
};

export default NewsletterForm;
