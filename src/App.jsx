import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import { useTranslation } from './hooks/useTranslation';
import { useLanguage } from './contexts/LanguageContext';
import { getPreviewPhotos } from './data/photos';
import SmartImage from './components/SmartImage';

// Development-only image format testing
if (process.env.NODE_ENV === 'development') {
  import('./utils/imageFormatTest.js').then(module => {
    window.testImageFormats = module.testImageFormats;
  });
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);
  const { t } = useTranslation();
  const { toggleLanguage, language } = useLanguage();

  // Load preview photos from manifest
  useEffect(() => {
    try {
      setIsLoadingPhotos(true);
      const previewPhotos = getPreviewPhotos(6); // Get first 6 photos
      setHighlights(previewPhotos);
      setIsLoadingPhotos(false);
    } catch (error) {
      console.warn('Could not load preview photos:', error);
      setHighlights([]); // Fallback to empty array
      setIsLoadingPhotos(false);
    }
  }, []);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    } else {
      setDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const openLightbox = (photo) => {
    setSelectedPhoto(photo);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      {/* Navigation */}
      <nav className="nav-bar">
        <div className="nav-links">
          <a href="#intro" className="nav-link">{t('nav.home')}</a>
          <a href="#projects" className="nav-link">{t('nav.projects')}</a>
          <a href="#photography" className="nav-link">{t('nav.photography')}</a>
          <a href="#contact" className="nav-link">{t('nav.contact')}</a>
        </div>
        <div className="nav-controls">
          <button className="language-toggle" onClick={toggleLanguage} aria-label="Toggle language">
            {language === 'en' ? '🇳🇴' : '🇬🇧'}
          </button>
          <button className="dark-mode-toggle" onClick={toggleDarkMode} aria-label="Toggle dark mode">
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      <main className="main-content">
        {/* Intro Section */}
        <section id="intro" className="section intro-section">
          <div className="profile-image">
            <img src="public/icons/IMG_3129.png" alt="Axel Friberg Hagen" />
          </div>
          <h1 className="name-title">Axel Friberg Hagen</h1>
          <p className="intro-text">
            {t('intro.greeting')}
          </p>
          <div className="status-indicator">
            <span className="status-dot"></span>
            {t('intro.availability')}
          </div>
          
          <div className="social-links">
            <a href="https://github.com/axelfhagen" className="social-link" target="_blank" rel="noopener noreferrer">
              <img src="/icons/github-logo.svg" alt="" className="social-icon" />
              {t('social.github')}
            </a>
            <a href="https://www.linkedin.com/in/axelhagen/" className="social-link" target="_blank" rel="noopener noreferrer">
              <img src="/icons/linkedin-logo.svg" alt="" className="social-icon" />
              {t('social.linkedin')}
            </a>
            <a href="mailto:axel.hagen@hotmail.com" className="social-link">
              <img src="/icons/email-logo.svg" alt="" className="social-icon" />
              {t('social.email')}
            </a>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="section">
          <h2 className="section-title">{t('projects.title')}</h2>
          <div className="projects-grid">
            <div className="project-card">
              <h3 className="project-title">{t('projects.website.title')}</h3>
              <p className="project-description">
                {t('projects.website.description')}
              </p>
              <div className="project-tech">{t('projects.website.tech')}</div>
              <a href="https://github.com/axelfhagen/first-website" className="project-link">{t('projects.website.link')}</a>
            </div>
            
            <div className="project-card">
              <h3 className="project-title">{t('projects.plant.title')}</h3>
              <p className="project-description">
                {t('projects.plant.description')}
              </p>
              <div className="project-tech">{t('projects.plant.tech')}</div>
              <a href="https://github.com/axelfhagen/CNN-plant-health-classifier" className="project-link">{t('projects.website.link')}</a>
            </div>

            <div className="project-card">
              <h3 className="project-title">{t('projects.ais.title')}</h3>
              <p className="project-description">
                {t('projects.ais.description')}
              </p>
              <div className="project-tech">{t('projects.ais.tech')}</div>
              <a href="https://github.com/axelfhagen/AIS-Forcaster" className="project-link">{t('projects.website.link')}</a>
            </div>

            <div className="project-card">
              <h3 className="project-title">{t('projects.lstm.title')}</h3>
              <p className="project-description">
                {t('projects.lstm.description')}
              </p>
              <div className="project-tech">{t('projects.lstm.tech')}</div>
              <a href="https://github.com/axelfhagen/LSTM-timeseries-forecasting" className="project-link">{t('projects.website.link')}</a>
            </div>
          </div>
        </section>

        {/* Photography Section */}
        <section id="photography" className="section">
          <h2 className="section-title">{t('photography.title')}</h2>
          <p className="section-subtitle">{t('photography.subtitle')}</p>
          
          {/* Preview Photo Grid - showing highlights only */}
          <div className="photo-grid preview-grid">
            {isLoadingPhotos ? (
              // Loading placeholders
              Array.from({ length: 6 }, (_, index) => (
                <div key={`loading-${index}`} className="photo-item photo-loading">
                  <div className="photo-thumbnail loading-placeholder">
                    📷
                  </div>
                </div>
              ))
            ) : highlights.length > 0 ? (
              // Actual photos
              highlights.map((photo, index) => (
                <div 
                  key={photo.src || index} 
                  className="photo-item" 
                  onClick={() => openLightbox(photo)}
                >
                  <SmartImage 
                    baseSrc={photo.src} 
                    alt={photo.alt} 
                    className="photo-thumbnail"
                  />
                </div>
              ))
            ) : (
              // No photos found state
              <div className="no-photos-message">
                <p>No photos found in highlights folder</p>
                <p>1. Add photos to: <code>/public/photos/highlights/</code></p>
                <p>2. Run: <code>npm run scan-photos</code></p>
                <p>3. Refresh page 📸</p>
              </div>
            )}
          </div>
          
          {/* View Full Collection Button */}
          <div className="plog-cta">
            <Link to="/plog" className="plog-cta-button">
              {t('plog.viewAll')}
            </Link>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="section contact-section">
          <h2 className="section-title">{t('contact.title')}</h2>
          <p className="contact-text">
            {t('contact.description')}
          </p>
          <div className="contact-methods">
            <a href="mailto:axel.hagen@hotmail.com" className="contact-button">
              {t('contact.email')}
            </a>
            <a href={t('contact.resumeFile')} className="contact-button secondary" target="_blank" rel="noopener noreferrer">
              {t('contact.resume')}
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-info">
            <p className="footer-built">
              {t('footer.built')}<a href="https://github.com/axelfhagen/first-website" target="_blank" rel="noopener noreferrer" className="footer-link">{t('footer.viewSource')}</a>
            </p>
            <p className="footer-contact">
              {t('footer.getInTouch')}<a href="mailto:axel.hagen@hotmail.com" className="footer-link">axel.hagen@hotmail.com</a>
            </p>
          </div>
          <div className="footer-social">
            <a href="https://github.com/axelfhagen" className="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <img src="/icons/github-logo.svg" alt="" className="footer-social-icon" />
              <span>{t('social.github')}</span>
            </a>
            <a href="https://www.linkedin.com/in/axelhagen/" className="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <img src="/icons/linkedin-logo.svg" alt="" className="footer-social-icon" />
              <span>{t('social.linkedin')}</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>×</button>
            <SmartImage 
              baseSrc={selectedPhoto.src} 
              alt={selectedPhoto.alt} 
              className="lightbox-image"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
