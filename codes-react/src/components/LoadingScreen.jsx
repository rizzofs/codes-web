import React, { useState, useEffect } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Inicializando...');
  const [showContent, setShowContent] = useState(false);

  const loadingSteps = [
    { text: 'Cargando recursos...', progress: 20 },
    { text: 'Conectando con la comunidad...', progress: 40 },
    { text: 'Preparando experiencias...', progress: 60 },
    { text: 'Optimizando rendimiento...', progress: 80 },
    { text: '¡Listo para explorar!', progress: 100 }
  ];

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setLoadingText(loadingSteps[currentStep].text);
        setProgress(loadingSteps[currentStep].progress);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setShowContent(true);
          setTimeout(() => {
            onComplete();
          }, 1000);
        }, 500);
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`loading-screen ${showContent ? 'fade-out' : ''}`}>
      <div className="loading-background">
        <div className="loading-particles"></div>
        <div className="loading-waves"></div>
      </div>
      
      <div className="loading-content">
        <div className="loading-logo">
          <div className="logo-container">
            <div className="logo-text">CODES++</div>
            <div className="logo-subtitle">Centro de Estudiantes</div>
          </div>
        </div>
        
        <div className="loading-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">{loadingText}</div>
          <div className="progress-percentage">{progress}%</div>
        </div>
        
        <div className="loading-animation">
          <div className="code-animation">
            <div className="code-line">const codes = {'{'}</div>
            <div className="code-line">  innovation: true,</div>
            <div className="code-line">  community: &quot;amazing&quot;,</div>
            <div className="code-line">  future: &quot;bright&quot;</div>
            <div className="code-line">{'};'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
