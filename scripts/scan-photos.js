#!/usr/bin/env node

// Photo scanner script - automatically generates photo manifest from your actual files
const fs = require('fs');
const path = require('path');

const PHOTO_DIR = path.join(__dirname, '..', 'public', 'photos');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'photos.js');

// Supported image extensions
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.PNG', '.JPG', '.JPEG', '.WEBP'];

// Check if file is an image
const isImageFile = (filename) => {
  const ext = path.extname(filename);
  return IMAGE_EXTENSIONS.includes(ext);
};

// Check if file is markdown
const isMarkdownFile = (filename) => {
  return filename.endsWith('.md');
};

// Read and parse markdown file
const readMarkdownFile = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const title = lines.find(line => line.startsWith('# '))?.substring(2)?.trim() || 'Untitled Trip';
    const date = lines.find(line => line.startsWith('*'))?.replace(/\*/g, '').trim() || '';
    return { title, date, content };
  } catch (error) {
    console.log(`Error reading markdown file ${filePath}:`, error.message);
    return { title: 'Untitled Trip', date: '', content: '' };
  }
};

// Scan a directory for image files
const scanDirectory = (dirPath) => {
  try {
    if (!fs.existsSync(dirPath)) {
      console.log(`Directory doesn't exist: ${dirPath}`);
      return [];
    }
    
    const files = fs.readdirSync(dirPath);
    const imageFiles = files
      .filter(isImageFile)
      .sort(); // Alphabetical order, like Finder
    
    console.log(`Found ${imageFiles.length} images in ${dirPath}:`);
    imageFiles.forEach(file => console.log(`  - ${file}`));
    
    return imageFiles;
  } catch (error) {
    console.log(`Error scanning ${dirPath}:`, error.message);
    return [];
  }
};

// Scan trips directory for trip folders
const scanTrips = (tripsDir) => {
  try {
    if (!fs.existsSync(tripsDir)) {
      console.log(`Trips directory doesn't exist: ${tripsDir}`);
      return {};
    }
    
    const tripFolders = fs.readdirSync(tripsDir)
      .filter(item => fs.statSync(path.join(tripsDir, item)).isDirectory())
      .sort();
    
    const trips = {};
    
    tripFolders.forEach(tripFolder => {
      const tripPath = path.join(tripsDir, tripFolder);
      const files = fs.readdirSync(tripPath);
      
      // Get images
      const images = files.filter(isImageFile).sort();
      
      // Get markdown content
      const markdownFile = files.find(isMarkdownFile);
      let tripData = { title: tripFolder.replace(/-/g, ' '), date: '', content: '' };
      
      if (markdownFile) {
        tripData = readMarkdownFile(path.join(tripPath, markdownFile));
      }
      
      trips[tripFolder] = {
        ...tripData,
        images,
        folder: tripFolder
      };
      
      console.log(`Found trip "${tripData.title}" with ${images.length} images`);
    });
    
    return trips;
  } catch (error) {
    console.log(`Error scanning trips:`, error.message);
    return {};
  }
};

// Generate the photos.js file content
const generatePhotosFile = (recent, highlights, trips) => {
  const formatFileList = (files) => {
    if (files.length === 0) return '    // No photos found - add some images to this folder!';
    
    return files.map(file => `    "${file}",`).join('\n');
  };

  const formatTrips = (trips) => {
    const tripEntries = Object.entries(trips).map(([folder, tripData]) => {
      const imagesStr = formatFileList(tripData.images);
      return `    "${folder}": {
      title: "${tripData.title}",
      date: "${tripData.date}",
      folder: "${folder}",
      images: [
${imagesStr}
      ]
    }`;
    });
    
    return tripEntries.join(',\n');
  };

  return `// Photo manifest - Auto-generated from actual files
// Run \`npm run scan-photos\` to regenerate this file

export const PHOTO_MANIFEST = {
  recent: [
${formatFileList(recent)}
  ],
  
  highlights: [
${formatFileList(highlights)}
  ],
  
  trips: {
${formatTrips(trips)}
  }
};

// Helper function to get preview photos (first N from recent)
export const getPreviewPhotos = (count = 6) => {
  return PHOTO_MANIFEST.recent
    .slice(0, count)
    .map((filename, index) => ({
      src: \`/photos/recent/\${filename}\`,
      alt: \`Photo \${index + 1}\`,
      filename: filename,
      category: 'recent'
    }));
};

// Helper function to get recent photos
export const getRecentPhotos = () => {
  return PHOTO_MANIFEST.recent.map((filename, index) => ({
    src: \`/photos/recent/\${filename}\`,
    alt: \`Photo \${index + 1}\`,
    filename: filename,
    category: 'recent'
  }));
};

// Helper function to get highlight photos
export const getHighlightPhotos = () => {
  return PHOTO_MANIFEST.highlights.map((filename, index) => ({
    src: \`/photos/highlights/\${filename}\`,
    alt: \`Highlight photo \${index + 1}\`,
    filename: filename,
    category: 'highlights'
  }));
};

// Helper function to get trip photos
export const getTripPhotos = (tripId) => {
  const trip = PHOTO_MANIFEST.trips[tripId];
  if (!trip) return [];
  
  return trip.images.map((filename, index) => ({
    src: \`/photos/trips/\${tripId}/\${filename}\`,
    alt: \`\${trip.title} photo \${index + 1}\`,
    filename: filename,
    category: tripId,
    tripTitle: trip.title,
    tripDate: trip.date
  }));
};

// Helper function to get trip metadata
export const getTripMetadata = (tripId) => {
  return PHOTO_MANIFEST.trips[tripId] || null;
};

// Helper function to get all trips
export const getAllTrips = () => {
  return Object.entries(PHOTO_MANIFEST.trips).map(([id, trip]) => ({
    id,
    ...trip
  }));
};`;
};

// Main scanner function
const scanPhotos = () => {
  console.log('🔍 Scanning for photos...\n');
  
  // Scan recent folder
  const recentPath = path.join(PHOTO_DIR, 'recent');
  const recent = scanDirectory(recentPath);
  
  // Scan highlights folder
  const highlightsPath = path.join(PHOTO_DIR, 'highlights');
  const highlights = scanDirectory(highlightsPath);
  
  // Scan trips folders
  const tripsPath = path.join(PHOTO_DIR, 'trips');
  const trips = scanTrips(tripsPath);
  
  // Generate the file content
  const fileContent = generatePhotosFile(recent, highlights, trips);
  
  // Write the file
  try {
    fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf8');
    console.log(`\n✅ Photo manifest generated: ${OUTPUT_FILE}`);
    console.log(`📸 Found ${recent.length} recent photos`);
    console.log(`⭐ Found ${highlights.length} highlight photos`);
    console.log(`🧳 Found ${Object.keys(trips).length} trips with ${Object.values(trips).reduce((total, trip) => total + trip.images.length, 0)} photos total`);
    
    if (recent.length > 0) {
      console.log(`\n🎯 Preview will show first 6 photos:`);
      recent.slice(0, 6).forEach((file, i) => {
        console.log(`  ${i + 1}. ${file}`);
      });
    }
    
    if (Object.keys(trips).length > 0) {
      console.log(`\n🗺️  Available trips:`);
      Object.entries(trips).forEach(([id, trip]) => {
        console.log(`  - ${trip.title} (${trip.images.length} photos)`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error writing photos.js:', error);
  }
};

// Run the scanner
if (require.main === module) {
  scanPhotos();
}

module.exports = { scanPhotos };