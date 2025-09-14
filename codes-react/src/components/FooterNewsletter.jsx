import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import './FooterNewsletter.css';

const FooterNewsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('El email es requerido');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('El email no es válido');
      return;
    }

    setError('');
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus('success');
      setEmail('');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="footer-newsletter-container">
      <div className="newsletter-header">
        <h5>
          <i className="fas fa-envelope me-2"></i>
          ¡Únete a nuestra comunidad!
        </h5>
        <p>Recibe las últimas noticias y eventos</p>
      </div>

      <Form onSubmit={handleSubmit} className="newsletter-form">
        {submitStatus === 'success' && (
          <Alert variant="success" className="newsletter-alert">
            <i className="fas fa-check-circle me-2"></i>
            ¡Te has suscrito exitosamente!
          </Alert>
        )}

        {submitStatus === 'error' && (
          <Alert variant="danger" className="newsletter-alert">
            <i className="fas fa-exclamation-circle me-2"></i>
            Hubo un error. Intenta nuevamente.
          </Alert>
        )}

        <div className="newsletter-input-group">
          <Form.Control
            type="email"
            value={email}
            onChange={handleInputChange}
            placeholder="Tu email"
            isInvalid={!!error}
            className="newsletter-input"
          />
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="newsletter-btn"
          >
            {isSubmitting ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <i className="fas fa-paper-plane"></i>
            )}
          </Button>
        </div>
        
        {error && (
          <div className="invalid-feedback d-block">
            {error}
          </div>
        )}
        
        <p className="newsletter-privacy">
          <i className="fas fa-shield-alt me-1"></i>
          Respetamos tu privacidad
        </p>
      </Form>
    </div>
  );
};

export default FooterNewsletter;
