import { useState, useEffect } from 'react';

const SmartImage = ({ 
  baseSrc, 
  alt, 
  className, 
  onClick, 
  loading = "lazy",
  style = {},
  ...props 
}) => {
  const [currentSrc, setCurrentSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Extract base path from src (remove extension)
    const basePath = baseSrc.replace(/\.(heic|png|jpg|jpeg|webp)$/i, '');
    
    // Try formats in order: PNG (lossless) -> WebP (smaller) -> JPG (universal)
    const tryFormats = ['png', 'webp', 'jpg'];
    let currentFormatIndex = 0;
    
    const attemptLoad = () => {
      if (currentFormatIndex >= tryFormats.length) {
        setHasError(true);
        setIsLoading(false);
        return;
      }
      
      const format = tryFormats[currentFormatIndex];
      const testSrc = `${basePath}.${format}`;
      
      const img = new Image();
      
      img.onload = () => {
        setCurrentSrc(testSrc);
        setIsLoading(false);
        setHasError(false);
      };
      
      img.onerror = () => {
        currentFormatIndex++;
        attemptLoad();
      };
      
      img.src = testSrc;
    };
    
    setIsLoading(true);
    setHasError(false);
    attemptLoad();
  }, [baseSrc]);

  if (hasError) {
    return (
      <div 
        className={`${className} image-placeholder`} 
        style={{ 
          ...style, 
          backgroundColor: 'var(--bg-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          color: 'var(--text-muted)',
          border: '2px dashed var(--border-glass)'
        }}
      >
        📷
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div 
          className={`${className} image-loading`}
          style={{
            ...style,
            backgroundColor: 'var(--bg-glass)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            color: 'var(--text-muted)',
            animation: 'pulse 1.5s ease-in-out infinite alternate'
          }}
        >
          ⏳
        </div>
      )}
      {currentSrc && (
        <img
          src={currentSrc}
          alt={alt}
          className={className}
          onClick={onClick}
          loading={loading}
          style={{
            ...style,
            display: isLoading ? 'none' : 'block'
          }}
          {...props}
        />
      )}
    </>
  );
};

export default SmartImage;