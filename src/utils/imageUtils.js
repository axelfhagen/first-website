// Image format utilities for web browsers
export const SUPPORTED_FORMATS = ['png', 'jpg', 'webp'];

// Check if browser supports WebP format
export const supportsWebP = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  try {
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  } catch (e) {
    return false;
  }
};

// Get the best supported image format for the browser
export const getBestImageFormat = () => {
  // Prefer PNG for lossless quality, WebP if supported for smaller file size
  if (supportsWebP()) {
    return 'webp';
  }
  return 'png'; // PNG as primary format for lossless quality
};

// Generate image source with fallback
export const getImageSrc = (basePath, index, category = '') => {
  const format = getBestImageFormat();
  const categoryPath = category ? `${category}/` : '';
  
  if (category) {
    return `/photos/sections/${categoryPath}${category}_${index}.${format}`;
  } else {
    return `/photos/highlights/highlight_${index}.${format}`;
  }
};

// Create image element with fallback support
export const createImageWithFallback = (baseSrc, alt, onLoad = null, onError = null) => {
  const img = new Image();
  
  // Extract base path and info from src
  const pathParts = baseSrc.split('.');
  const basePath = pathParts[0];
  
  // Try formats in order: HEIC -> PNG -> JPG
  const tryFormats = ['heic', 'png', 'jpg'];
  let currentFormatIndex = 0;
  
  const attemptLoad = () => {
    if (currentFormatIndex >= tryFormats.length) {
      if (onError) onError(new Error('All image formats failed to load'));
      return;
    }
    
    const format = tryFormats[currentFormatIndex];
    img.src = `${basePath}.${format}`;
    
    img.onload = () => {
      if (onLoad) onLoad(img);
    };
    
    img.onerror = () => {
      currentFormatIndex++;
      attemptLoad();
    };
  };
  
  img.alt = alt;
  attemptLoad();
  
  return img;
};