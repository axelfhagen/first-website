import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

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

  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      {/* Navigation */}
      <nav className="nav-bar">
        <div className="nav-links">
          <a href="#intro" className="nav-link">Home</a>
          <a href="#projects" className="nav-link">Projects</a>
          <a href="#photography" className="nav-link">Photography</a>
          <a href="#contact" className="nav-link">Contact</a>
        </div>
        <button className="dark-mode-toggle" onClick={toggleDarkMode} aria-label="Toggle dark mode">
          {darkMode ? '☀️' : '🌙'}
        </button>
      </nav>

      <main className="main-content">
        {/* Intro Section */}
        <section id="intro" className="section intro-section">
          <h1 className="name-title">Axel Hagen</h1>
          <p className="intro-text">
            Applied physics & mathematics student with a passion for AI and deep learning. 
            I love diving into natural language processing and building things that blend 
            mathematical elegance with real-world impact.
          </p>
          <div className="status-indicator">
            <span className="status-dot"></span>
            Available for new opportunities
          </div>
          
          <div className="social-links">
            <a href="https://github.com/axelfhagen" className="social-link" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/axelhagen/" className="social-link" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="mailto:axel.hagen@hotmail.com" className="social-link">
              Email
            </a>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="section">
          <h2 className="section-title">Featured Projects</h2>
          <div className="projects-grid">
            <div className="project-card">
              <h3 className="project-title">🚀 Portfolio Website</h3>
              <p className="project-description">
                This very website! Built with React and smooth macOS-like animations.
              </p>
              <div className="project-tech">React • CSS3 • Glassmorphism</div>
              <a href="https://github.com/axelfhagen/first-webiste" className="project-link">View on GitHub →</a>
            </div>
            
            <div className="project-card">
              <h3 className="project-title">📱 Mobile App</h3>
              <p className="project-description">
                Classifying healthy unhealthy plants with computer vision🌱🍂
              </p>
              <div className="project-tech">React Native • TypeScript</div>
              <a href="https://github.com/axelfhagen/CNN-plant-health-classifier" className="project-link">View on GitHub →</a>
            </div>

            <div className="project-card">
              <h3 className="project-title">📱 Mobile App</h3>
              <p className="project-description">
                Classifying healthy unhealthy plants with computer vision🌱🍂
              </p>
              <div className="project-tech">React Native • TypeScript</div>
              <a href="https://github.com/axelfhagen/CNN-plant-health-classifier" className="project-link">View on GitHub →</a>
            </div>

            <div className="project-card">
              <h3 className="project-title">🤖 AI Tool</h3>
              <p className="project-description">
                Predicting future values with Deep Learning📈
              </p>
              <div className="project-tech">Python • OpenAI • FastAPI</div>
              <a href="https://github.com/axelfhagen/LSTM-timeseries-forecasting" className="project-link">View on GitHub →</a>
            </div>
          </div>
        </section>

        {/* Photography Section */}
        <section id="photography" className="section">
          <h2 className="section-title">Photography</h2>
          <p className="section-subtitle">Capturing moments and perspectives</p>
          <div className="photo-grid">
            <div className="photo-placeholder">🌅 Sunrise in the Mountains</div>
            <div className="photo-placeholder">🏙️ City Architecture</div>
            <div className="photo-placeholder">🌊 Ocean Waves</div>
            <div className="photo-placeholder">🍂 Autumn Colors</div>
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
            <a href="/resume.pdf" className="contact-button secondary" target="_blank">
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
              <span>GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/axelhagen/" className="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
