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

// Generate the photos.js file content
const generatePhotosFile = (highlights, sections) => {
  const formatFileList = (files) => {
    if (files.length === 0) return '    // No photos found - add some images to this folder!';
    
    return files.map(file => `    "${file}",`).join('\n');
  };

  return `// Photo manifest - Auto-generated from actual files
// Run \`npm run scan-photos\` to regenerate this file

export const PHOTO_MANIFEST = {
  highlights: [
${formatFileList(highlights)}
  ],
  
  sections: {
    travel: [
${formatFileList(sections.travel)}
    ],
    nature: [
${formatFileList(sections.nature)}
    ],
    city: [
${formatFileList(sections.city)}
    ]
  }
};

// Helper function to get preview photos (first N from highlights)
export const getPreviewPhotos = (count = 6) => {
  return PHOTO_MANIFEST.highlights
    .slice(0, count)
    .map((filename, index) => ({
      src: \`/photos/highlights/\${filename}\`,
      alt: \`Photo \${index + 1}\`,
      filename: filename,
      category: 'highlights'
    }));
};

// Helper function to get section photos
export const getSectionPhotos = (sectionName) => {
  const photos = PHOTO_MANIFEST.sections[sectionName] || [];
  return photos.map((filename, index) => ({
    src: \`/photos/sections/\${sectionName}/\${filename}\`,
    alt: \`\${sectionName} photo \${index + 1}\`,
    filename: filename, 
    category: sectionName
  }));
};

// Helper function to get all highlights
export const getAllHighlights = () => {
  return PHOTO_MANIFEST.highlights.map((filename, index) => ({
    src: \`/photos/highlights/\${filename}\`,
    alt: \`Photo \${index + 1}\`,
    filename: filename,
    category: 'highlights'
  }));
};`;
};

// Main scanner function
const scanPhotos = () => {
  console.log('🔍 Scanning for photos...\n');
  
  // Scan highlights folder
  const highlightsPath = path.join(PHOTO_DIR, 'highlights');
  const highlights = scanDirectory(highlightsPath);
  
  // Scan section folders
  const sections = {
    travel: scanDirectory(path.join(PHOTO_DIR, 'sections', 'travel')),
    nature: scanDirectory(path.join(PHOTO_DIR, 'sections', 'nature')),
    city: scanDirectory(path.join(PHOTO_DIR, 'sections', 'city'))
  };
  
  // Generate the file content
  const fileContent = generatePhotosFile(highlights, sections);
  
  // Write the file
  try {
    fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf8');
    console.log(`\n✅ Photo manifest generated: ${OUTPUT_FILE}`);
    console.log(`📸 Found ${highlights.length} highlight photos`);
    console.log(`🗂️  Found ${Object.values(sections).flat().length} section photos total`);
    
    if (highlights.length > 0) {
      console.log(`\n🎯 Preview will show first 6 photos:`);
      highlights.slice(0, 6).forEach((file, i) => {
        console.log(`  ${i + 1}. ${file}`);
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