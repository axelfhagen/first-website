import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { getRecentPhotos, getHighlightPhotos, getTripPhotos, getAllTrips } from '../data/photos';
import SmartImage from '../components/SmartImage';
import { marked } from 'marked';
import '../styles/Plog.css';

function Plog() {
  const [selectedSection, setSelectedSection] = useState('recent');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [recentPhotos, setRecentPhotos] = useState([]);
  const [highlightPhotos, setHighlightPhotos] = useState([]);
  const [trips, setTrips] = useState([]);
  const [currentTripPhotos, setCurrentTripPhotos] = useState([]);
  const [currentTripContent, setCurrentTripContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAllTrips, setShowAllTrips] = useState(false);
  const { t } = useTranslation();

  // Load all photos from manifest
  useEffect(() => {
    try {
      setIsLoading(true);
      
      // Get recent photos
      const recentData = getRecentPhotos();
      setRecentPhotos(recentData);
      
      // Get highlight photos
      const highlightData = getHighlightPhotos();
      setHighlightPhotos(highlightData);
      
      // Get all trips
      const tripsData = getAllTrips();
      setTrips(tripsData);
      
    } catch (error) {
      console.warn('Could not load photos:', error);
      // Keep empty arrays as fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load trip photos and content when a trip is selected
  useEffect(() => {
    if (selectedSection !== 'recent' && selectedSection !== 'highlights' && selectedSection !== '') {
      const tripPhotos = getTripPhotos(selectedSection);
      setCurrentTripPhotos(tripPhotos);
      
      // Load trip markdown content
      loadTripContent(selectedSection);
    } else {
      setCurrentTripContent('');
    }
  }, [selectedSection]);

  // Function to load trip markdown content
  const loadTripContent = async (tripId) => {
    try {
      const response = await fetch(`/photos/trips/${tripId}/trip.md`);
      if (response.ok) {
        const markdownContent = await response.text();
        const htmlContent = marked(markdownContent);
        setCurrentTripContent(htmlContent);
      } else {
        setCurrentTripContent('');
      }
    } catch (error) {
      console.warn(`Could not load content for trip ${tripId}:`, error);
      setCurrentTripContent('');
    }
  };

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
          className={`plog-nav-btn ${selectedSection === 'recent' ? 'active' : ''}`}
          onClick={() => setSelectedSection('recent')}
        >
          Recent
        </button>
        <button 
          className={`plog-nav-btn ${selectedSection === 'highlights' ? 'active' : ''}`}
          onClick={() => setSelectedSection('highlights')}
        >
          Highlights
        </button>
        {trips.slice(0, 3).map(trip => (
          <button 
            key={trip.id}
            className={`plog-nav-btn ${selectedSection === trip.id ? 'active' : ''}`}
            onClick={() => setSelectedSection(trip.id)}
          >
            {trip.title}
          </button>
        ))}
        {trips.length > 3 && (
          <button 
            className="plog-nav-btn plog-more-btn"
            onClick={() => setShowAllTrips(true)}
          >
            More trips
          </button>
        )}
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
          ) : selectedSection === 'recent' ? (
            recentPhotos.length > 0 ? (
              recentPhotos.map((photo, index) => (
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
                <p>No photos found in recent folder</p>
                <p>Add photos to /public/photos/recent/</p>
              </div>
            )
          ) : selectedSection === 'highlights' ? (
            highlightPhotos.length > 0 ? (
              highlightPhotos.map((photo, index) => (
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
            currentTripPhotos.length > 0 ? (
              currentTripPhotos.map((photo, index) => (
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
                <p>No photos found for this trip</p>
                <p>Add photos to /public/photos/trips/{selectedSection}/</p>
              </div>
            )
          )}
        </div>
      </main>

      {/* Trip Content */}
      {selectedSection !== 'recent' && selectedSection !== 'highlights' && currentTripContent && (
        <section className="plog-trip-content">
          <div 
            className="plog-trip-description"
            dangerouslySetInnerHTML={{ __html: currentTripContent }}
          />
        </section>
      )}

      {/* All Trips Modal */}
      {showAllTrips && (
        <div className="plog-modal-overlay" onClick={() => setShowAllTrips(false)}>
          <div className="plog-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="plog-modal-header">
              <h2>All Trips</h2>
              <button className="plog-modal-close" onClick={() => setShowAllTrips(false)}>×</button>
            </div>
            <div className="plog-trips-grid">
              {trips.map(trip => (
                <div 
                  key={trip.id}
                  className="plog-trip-card"
                  onClick={() => {
                    setSelectedSection(trip.id);
                    setShowAllTrips(false);
                  }}
                >
                  <div className="plog-trip-card-content">
                    <h3 className="plog-trip-title">{trip.title}</h3>
                    <p className="plog-trip-date">{trip.date}</p>
                    <p className="plog-trip-photos-count">
                      {trip.images.length} photo{trip.images.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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