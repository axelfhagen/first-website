// Photo configuration - easily modify these values
export const PHOTO_CONFIG = {
  // Main page preview - how many photos to show in the preview grid
  PREVIEW_COUNT: 6,

  // Maximum number of filename patterns to try (keeps loading fast)
  MAX_HIGHLIGHTS: 20,
  MAX_PER_SECTION: 20,

  // Supported image formats (in order of preference)
  FORMATS: ['png', 'jpg', 'jpeg', 'webp'],

  // Section names and display configuration
  SECTIONS: {
    travel: { name: 'Travel', icon: '✈️' },
    nature: { name: 'Nature', icon: '🌿' },
    city: { name: 'City', icon: '🏙️' }
  }
};

// Quick settings - modify these to change behavior
export const QUICK_SETTINGS = {
  // Change to 9 for 3x3 grid, 12 for 4x3 grid, etc.
  PREVIEW_PHOTOS: 6,
  
  // Set to true to show loading animations
  SHOW_LOADING_STATES: true,
  
  // Set to true to show helpful messages when no photos found
  SHOW_EMPTY_STATES: true
};