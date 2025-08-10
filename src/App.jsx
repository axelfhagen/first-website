import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedSection, setSelectedSection] = useState('highlights');

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
          <a href="#intro" className="nav-link">Home</a>
          <a href="#projects" className="nav-link">Projects</a>
          <a href="#photography" className="nav-link">"Plog"</a>
          <a href="#contact" className="nav-link">Contact</a>
        </div>
        <button className="dark-mode-toggle" onClick={toggleDarkMode} aria-label="Toggle dark mode">
          {darkMode ? '☀️' : '🌙'}
        </button>
      </nav>

      <main className="main-content">
        {/* Intro Section */}
        <section id="intro" className="section intro-section">
          <h1 className="name-title">Axel Friberg Hagen</h1>
          <p className="intro-text">
            Hey, I'm Axel!👋 Physics and math student from Norway who's into AI and Statistics.
            I also love to travel ✈️- check out some of my photos below📸
          </p>
          <div className="status-indicator">
            <span className="status-dot"></span>
            Available for new opportunities
          </div>
          
          <div className="social-links">
            <a href="https://github.com/axelfhagen" className="social-link" target="_blank" rel="noopener noreferrer">
              <img src="/icons/github-logo.svg" alt="" className="social-icon" />
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/axelhagen/" className="social-link" target="_blank" rel="noopener noreferrer">
              <img src="/icons/linkedin-logo.svg" alt="" className="social-icon" />
              LinkedIn
            </a>
            <a href="mailto:axel.hagen@hotmail.com" className="social-link">
              <img src="/icons/email-logo.svg" alt="" className="social-icon" />
              Email
            </a>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="section">
          <h2 className="section-title">Featured Projects</h2>
          <div className="projects-grid">
            <div className="project-card">
              <h3 className="project-title">🚀 Personal Website</h3>
              <p className="project-description">
                This very website! Built with React.
              </p>
              <div className="project-tech">React • CSS3 • Glassmorphism</div>
              <a href="https://github.com/axelfhagen/first-website" className="project-link">View on GitHub →</a>
            </div>
            
            <div className="project-card">
              <h3 className="project-title">🌱Plant Classifier</h3>
              <p className="project-description">
                Classifying healthy / unhealthy plants with computer vision.
              </p>
              <div className="project-tech">Python • TensorFlow • Kaggle</div>
              <a href="https://github.com/axelfhagen/CNN-plant-health-classifier" className="project-link">View on GitHub →</a>
            </div>

            <div className="project-card">
              <h3 className="project-title">⛴️ AIS Forecaster</h3>
              <p className="project-description">
                Predicting position of cargo ships using AIS data.
              </p>
              <div className="project-tech">Python • sklearn • pandas</div>
              <a href="https://github.com/axelfhagen/AIS-Forcaster" className="project-link">View on GitHub →</a>
            </div>

            <div className="project-card">
              <h3 className="project-title">📈 LSTM Timeseries</h3>
              <p className="project-description">
                Predicting future values with Deep Learning.
              </p>
              <div className="project-tech">Python • TensorFlow • numpy</div>
              <a href="https://github.com/axelfhagen/LSTM-timeseries-forecasting" className="project-link">View on GitHub →</a>
            </div>
          </div>
        </section>

        {/* Photography Section */}
        <section id="photography" className="section">
          <h2 className="section-title">"Plog"</h2>
          <p className="section-subtitle">Capturing moments through Photos</p>
          
          {/* Section Navigation */}
          <div className="photo-nav">
            <button 
              className={`photo-nav-btn ${selectedSection === 'highlights' ? 'active' : ''}`}
              onClick={() => setSelectedSection('highlights')}
            >
              ✨ Highlights
            </button>
            {Object.keys(sections).map(section => (
              <button 
                key={section}
                className={`photo-nav-btn ${selectedSection === section ? 'active' : ''}`}
                onClick={() => setSelectedSection(section)}
              >
                {section === 'travel' && '✈️ Travel'}
                {section === 'nature' && '🌿 Nature'}
                {section === 'city' && '🏙️ City'}
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
          <h2 className="section-title">Let's Connect</h2>
          <p className="contact-text">
            I'm always interested in new opportunities and interesting projects.
          </p>
          <div className="contact-methods">
            <a href="mailto:axel.hagen@hotmail.com" className="contact-button">
              Send me an email
            </a>
            <a href="/Axel_Hagen_CV_English.pdf" className="contact-button secondary" target="_blank" rel="noopener noreferrer">
              Download Resume
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-info">
            <p className="footer-built">
              Built with React & lots of ☕ • <a href="https://github.com/axelfhagen/first-website" target="_blank" rel="noopener noreferrer" className="footer-link">View Source</a>
            </p>
            <p className="footer-contact">
              Let's get in touch • <a href="mailto:axel.hagen@hotmail.com" className="footer-link">axel.hagen@hotmail.com</a>
            </p>
          </div>
          <div className="footer-social">
            <a href="https://github.com/axelfhagen" className="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <img src="/icons/github-logo.svg" alt="" className="footer-social-icon" />
              <span>GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/axelhagen/" className="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <img src="/icons/linkedin-logo.svg" alt="" className="footer-social-icon" />
              <span>LinkedIn</span>
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
