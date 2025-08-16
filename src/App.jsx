import { useState, useEffect } from 'react';
import './App.css';
import { useTranslation } from './hooks/useTranslation';
import { useLanguage } from './contexts/LanguageContext';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedSection, setSelectedSection] = useState('highlights');
  const { t } = useTranslation();
  const { toggleLanguage, language } = useLanguage();

  // Generate photo data from folder structure
  const generatePhotos = () => {
    const highlights = [];
    const sections = {
      travel: [],
      nature: [],
      city: []
    };

    // Generate highlights (9 photos)
    for (let i = 1; i <= 9; i++) {
      highlights.push({
        src: `/photos/highlights/highlight_${i}.jpg`,
        alt: `Highlight ${i}`,
        category: 'highlights'
      });
    }

    // Generate section photos
    const sectionConfig = {
      travel: { count: 2, name: 'Travel' },
      nature: { count: 2, name: 'Nature' },
      city: { count: 2, name: 'City' }
    };

    Object.entries(sectionConfig).forEach(([key, config]) => {
      for (let i = 1; i <= config.count; i++) {
        sections[key].push({
          src: `/photos/sections/${key}/${key}_${i}.jpg`,
          alt: `${config.name} ${i}`,
          category: key
        });
      }
    });

    return { highlights, sections };
  };

  const { highlights, sections } = generatePhotos();

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
          
          {/* Section Navigation */}
          <div className="photo-nav">
            <button 
              className={`photo-nav-btn ${selectedSection === 'highlights' ? 'active' : ''}`}
              onClick={() => setSelectedSection('highlights')}
            >
              {t('photography.nav.highlights')}
            </button>
            {Object.keys(sections).map(section => (
              <button 
                key={section}
                className={`photo-nav-btn ${selectedSection === section ? 'active' : ''}`}
                onClick={() => setSelectedSection(section)}
              >
                {section === 'travel' && t('photography.nav.travel')}
                {section === 'nature' && t('photography.nav.nature')}
                {section === 'city' && t('photography.nav.city')}
              </button>
            ))}
          </div>

          {/* Photo Grid */}
          <div className="photo-grid">
            {selectedSection === 'highlights' && highlights.map((photo, index) => (
              <div 
                key={index} 
                className="photo-item" 
                onClick={() => openLightbox(photo)}
              >
                <img 
                  src={photo.src} 
                  alt={photo.alt} 
                  className="photo-thumbnail"
                />
              </div>
            ))}
            {selectedSection !== 'highlights' && sections[selectedSection] && sections[selectedSection].map((photo, index) => (
              <div 
                key={index} 
                className="photo-item" 
                onClick={() => openLightbox(photo)}
              >
                <img 
                  src={photo.src} 
                  alt={photo.alt} 
                  className="photo-thumbnail"
                />
              </div>
            ))}
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
            <img 
              src={selectedPhoto.src} 
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
