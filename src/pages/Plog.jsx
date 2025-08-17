import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { getAllHighlights, getSectionPhotos } from '../data/photos';
import { PHOTO_CONFIG } from '../config/photos';
import SmartImage from '../components/SmartImage';
import '../styles/Plog.css';

function Plog() {
  const [selectedSection, setSelectedSection] = useState('highlights');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [highlights, setHighlights] = useState([]);
  const [sections, setSections] = useState({ travel: [], nature: [], city: [] });
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  // Load all photos from manifest
  useEffect(() => {
    try {
      setIsLoading(true);
      
      // Get all highlights
      const highlightsData = getAllHighlights();
      setHighlights(highlightsData);
      
      // Get all section photos
      const sectionsData = {};
      Object.keys(PHOTO_CONFIG.SECTIONS).forEach(sectionName => {
        sectionsData[sectionName] = getSectionPhotos(sectionName);
      });
      setSections(sectionsData);
      
    } catch (error) {
      console.warn('Could not load photos:', error);
      // Keep empty arrays as fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openLightbox = (photo) => {
    setSelectedPhoto(photo);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  useEffect(() => {
    // Get dark mode state from localStorage and apply it
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    } else {
      setDarkMode(prefersDark);
    }
    
    // Smooth scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    // Apply dark mode class to body
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  return (
    <div className={`plog-page ${darkMode ? 'dark' : ''}`}>
      {/* Header with back button */}
      <header className="plog-header">
        <Link to="/#photography" className="back-button">
          <span className="back-arrow">←</span>
          <span>{t('plog.back')}</span>
        </Link>
        <div className="plog-title-section">
          <h1 className="plog-title">{t('photography.title')}</h1>
          <p className="plog-subtitle">{t('plog.fullSubtitle')}</p>
        </div>
      </header>

      {/* Section Navigation */}
      <nav className="plog-nav">
        <button 
          className={`plog-nav-btn ${selectedSection === 'highlights' ? 'active' : ''}`}
          onClick={() => setSelectedSection('highlights')}
        >
          {t('photography.nav.highlights')}
        </button>
        {Object.keys(sections).map(section => (
          <button 
            key={section}
            className={`plog-nav-btn ${selectedSection === section ? 'active' : ''}`}
            onClick={() => setSelectedSection(section)}
          >
            {section === 'travel' && t('photography.nav.travel')}
            {section === 'nature' && t('photography.nav.nature')}
            {section === 'city' && t('photography.nav.city')}
          </button>
        ))}
      </nav>

      {/* Photo Grid */}
      <main className="plog-content">
        <div className="plog-photo-grid">
          {isLoading ? (
            // Loading placeholders
            Array.from({ length: 12 }, (_, index) => (
              <div key={`loading-${index}`} className="plog-photo-item plog-photo-loading">
                <div className="plog-photo-thumbnail loading-placeholder">
                  📷
                </div>
              </div>
            ))
          ) : selectedSection === 'highlights' ? (
            highlights.length > 0 ? (
              highlights.map((photo, index) => (
                <div 
                  key={photo.src || index} 
                  className="plog-photo-item" 
                  onClick={() => openLightbox(photo)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <SmartImage 
                    baseSrc={photo.src} 
                    alt={photo.alt} 
                    className="plog-photo-thumbnail"
                    loading="lazy"
                  />
                  <div className="plog-photo-overlay">
                    <span className="plog-photo-expand">⤢</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="plog-no-photos">
                <p>No photos found in highlights folder</p>
                <p>Add photos to /public/photos/highlights/</p>
              </div>
            )
          ) : (
            sections[selectedSection] && sections[selectedSection].length > 0 ? (
              sections[selectedSection].map((photo, index) => (
                <div 
                  key={photo.src || index} 
                  className="plog-photo-item" 
                  onClick={() => openLightbox(photo)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <SmartImage 
                    baseSrc={photo.src} 
                    alt={photo.alt} 
                    className="plog-photo-thumbnail"
                    loading="lazy"
                  />
                  <div className="plog-photo-overlay">
                    <span className="plog-photo-expand">⤢</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="plog-no-photos">
                <p>No photos found in {selectedSection} folder</p>
                <p>Add photos to /public/photos/sections/{selectedSection}/</p>
              </div>
            )
          )}
        </div>
      </main>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="plog-lightbox-overlay" onClick={closeLightbox}>
          <div className="plog-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="plog-lightbox-close" onClick={closeLightbox}>×</button>
            <SmartImage 
              baseSrc={selectedPhoto.src} 
              alt={selectedPhoto.alt} 
              className="plog-lightbox-image"
            />
            <div className="plog-lightbox-info">
              <p className="plog-lightbox-category">{selectedPhoto.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Plog;