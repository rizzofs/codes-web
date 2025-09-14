import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/MobileFix.css';
import { AuthProvider } from './contexts/AuthContext';

// Components
import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';
import Sidebar from './components/Sidebar';
import Logo from './components/Logo';
import Hero from './components/Hero';
import About from './components/About';
import Members from './components/Members';
import Events from './components/Events';
import Resources from './components/Resources';
import Blog from './components/Blog';
import FAQ from './components/FAQ';
import Colaboradores from './components/Colaboradores';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import ScrollIndicator from './components/ScrollIndicator';
import MobileFormEnhancer from './components/MobileFormEnhancer';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TestDashboard from './components/TestDashboard';

// Pages
import Groups from './pages/Groups';
import ExpoUnlu from './pages/ExpoUnlu';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <CustomCursor />
          <Sidebar />
          <Logo />
          <ScrollIndicator />
          <MobileFormEnhancer />
          
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <About />
                <Members />
                <Events />
                <Resources />
                <Blog />
                <FAQ />
                <Colaboradores />
                <Contact />
              </>
            } />
            <Route path="/grupos" element={<Groups />} />
            <Route path="/expo-unlu" element={<ExpoUnlu />} />
            <Route path="/login" element={<Login />} />
            <Route path="/test-dashboard" element={<TestDashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
          
          <Footer />
          <BackToTop />
          <ScrollToTop />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
