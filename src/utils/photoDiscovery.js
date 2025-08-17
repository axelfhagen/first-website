// Simplified photo discovery utility
import { PHOTO_CONFIG } from '../config/photos.js';

// Generate a reasonable set of filename attempts
const generatePhotoAttempts = (basePath, maxCount = 20) => {
  const attempts = [];
  const formats = PHOTO_CONFIG.FORMATS;
  
  // Simple patterns that cover most common naming conventions
  for (let i = 1; i <= maxCount; i++) {
    // Try various common patterns for each number
    const patterns = [
      `highlight_${i}`,                 // highlight_1.png (existing files)
      `${i}`,                           // 1.png, 2.jpg
      `photo_${i}`,                     // photo_1.png
      `image_${i}`,                     // image_1.png
      `IMG_${String(i).padStart(4, '0')}`, // IMG_0001.png
      `DSC_${String(i).padStart(4, '0')}`, // DSC_0001.png
      `pic_${i}`,                       // pic_1.png
      `img_${i}`,                       // img_1.png
    ];
    
    patterns.forEach(pattern => {
      formats.forEach(format => {
        attempts.push(`${basePath}/${pattern}.${format}`);
      });
    });
  }
  
  return attempts;
};

// Try to load photos from common filename patterns
export const discoverPhotos = async (basePath, maxCount = 20) => {
  const attempts = generatePhotoAttempts(basePath, maxCount);
  const foundPhotos = [];
  
  // Test each potential photo URL
  for (let i = 0; i < attempts.length; i++) {
    const photoPath = attempts[i];
    
    try {
      // Try to load the image
      const canLoad = await testImageLoad(photoPath);
      if (canLoad) {
        const filename = photoPath.split('/').pop().split('.')[0];
        foundPhotos.push({
          src: photoPath,
          alt: `Photo ${filename}`,
          filename: filename,
          index: foundPhotos.length + 1
        });
      }
    } catch (error) {
      // Photo doesn't exist, continue to next
      continue;
    }
  }
  
  return foundPhotos;
};

// Helper function to test if an image can be loaded
const testImageLoad = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
};

// Discover highlights photos
export const discoverHighlights = async () => {
  return await discoverPhotos('/photos/highlights', PHOTO_CONFIG.MAX_HIGHLIGHTS);
};

// Discover section photos
export const discoverSectionPhotos = async (sectionName) => {
  return await discoverPhotos(`/photos/sections/${sectionName}`, PHOTO_CONFIG.MAX_PER_SECTION);
};

// Get preview photos (limited count for main page)
export const getPreviewPhotos = async () => {
  const allHighlights = await discoverHighlights();
  return allHighlights.slice(0, PHOTO_CONFIG.PREVIEW_COUNT);
};

// Discover all photos for all sections
export const discoverAllSections = async () => {
  const sections = {};
  
  // Initialize sections from config
  Object.keys(PHOTO_CONFIG.SECTIONS).forEach(sectionName => {
    sections[sectionName] = [];
  });
  
  const sectionPromises = Object.keys(sections).map(async (sectionName) => {
    const photos = await discoverSectionPhotos(sectionName);
    return { sectionName, photos };
  });
  
  const results = await Promise.all(sectionPromises);
  
  results.forEach(({ sectionName, photos }) => {
    sections[sectionName] = photos;
  });
  
  return sections;
};