#!/usr/bin/env node

/**
 * Auto-extract Photo Metadata Script
 *
 * Automatically extracts metadata from photos using:
 * - EXIF data (capture date, GPS location, camera info)
 * - File modification dates (fallback)
 * - Trip folder structure (trip name, folder name)
 *
 * Run: npm run extract-metadata [trip-folder-name]
 * Example: npm run extract-metadata tokyo-2025
 * Or extract all: npm run extract-metadata --all
 */

import ExifReader from 'exifreader';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TRIPS_DIR = path.join(__dirname, '../public/photos/trips');
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.heic', '.HEIC', '.PNG', '.JPG', '.JPEG'];

/**
 * Check if file is an image
 */
function isImageFile(filename) {
  const ext = path.extname(filename);
  return IMAGE_EXTENSIONS.includes(ext);
}

/**
 * Extract EXIF data from image file
 */
async function extractExifData(filePath) {
  try {
    const tags = await ExifReader.load(filePath, { expanded: true });

    const exifData = {
      // Date taken
      dateTaken: null,
      // GPS coordinates
      latitude: null,
      longitude: null,
      // Camera info
      camera: null,
      lens: null,
      // Image details
      width: null,
      height: null,
      orientation: null
    };

    // Extract date taken
    if (tags.exif?.DateTimeOriginal?.description) {
      exifData.dateTaken = parseExifDate(tags.exif.DateTimeOriginal.description);
    } else if (tags.exif?.DateTime?.description) {
      exifData.dateTaken = parseExifDate(tags.exif.DateTime.description);
    }

    // Extract GPS coordinates
    if (tags.gps) {
      if (tags.gps.Latitude && tags.gps.Longitude) {
        exifData.latitude = tags.gps.Latitude;
        exifData.longitude = tags.gps.Longitude;
      }
    }

    // Extract camera info
    if (tags.exif?.Make?.description && tags.exif?.Model?.description) {
      exifData.camera = `${tags.exif.Make.description} ${tags.exif.Model.description}`.trim();
    } else if (tags.exif?.Model?.description) {
      exifData.camera = tags.exif.Model.description;
    }

    // Extract lens info
    if (tags.exif?.LensModel?.description) {
      exifData.lens = tags.exif.LensModel.description;
    }

    // Extract image dimensions
    if (tags.file?.['Image Width']?.value && tags.file?.['Image Height']?.value) {
      exifData.width = tags.file['Image Width'].value;
      exifData.height = tags.file['Image Height'].value;
    }

    return exifData;
  } catch (error) {
    console.warn(`  ⚠️  Could not read EXIF data: ${error.message}`);
    return null;
  }
}

/**
 * Parse EXIF date string to ISO format
 * EXIF format: "2025:08:13 14:30:00"
 * ISO format: "2025-08-13T14:30:00"
 */
function parseExifDate(exifDateString) {
  try {
    const [datePart, timePart] = exifDateString.split(' ');
    const date = datePart.replace(/:/g, '-');
    return `${date}T${timePart}`;
  } catch (error) {
    return null;
  }
}

/**
 * Get file modification date as fallback
 */
function getFileDate(filePath) {
  try {
    const stats = fs.statSync(filePath);
    // Use birthtime (creation) if available, otherwise mtime (modification)
    const timestamp = stats.birthtime || stats.mtime;
    return timestamp.toISOString();
  } catch (error) {
    return new Date().toISOString();
  }
}

/**
 * Convert GPS coordinates to location name (reverse geocoding)
 * Note: This requires an API. For now, just return coordinates
 */
function formatGPSLocation(latitude, longitude) {
  if (!latitude || !longitude) return null;
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
}

/**
 * Parse trip name from folder structure
 */
function parseTripInfo(tripFolderName) {
  // Try to extract location and year from folder name
  // Examples: "tokyo-2025", "mt-fuji-2025", "beijing-2025"

  const parts = tripFolderName.split('-');
  const year = parts.find(part => /^\d{4}$/.test(part));
  const location = parts
    .filter(part => part !== year)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    name: location + (year ? ` ${year}` : ''),
    location: location,
    year: year
  };
}

/**
 * Extract metadata for all photos in a trip folder
 */
async function extractTripMetadata(tripId) {
  const tripPath = path.join(TRIPS_DIR, tripId);

  if (!fs.existsSync(tripPath)) {
    console.error(`❌ Trip folder not found: ${tripId}`);
    return null;
  }

  console.log(`\n🔍 Extracting metadata for: ${tripId}`);

  const files = fs.readdirSync(tripPath);
  const imageFiles = files.filter(isImageFile);

  if (imageFiles.length === 0) {
    console.log(`  ⚠️  No images found in ${tripId}`);
    return null;
  }

  console.log(`  Found ${imageFiles.length} images`);

  const photos = [];
  const tripInfo = parseTripInfo(tripId);

  // Read existing trip.md if available
  let tripDescription = '';
  const mdPath = path.join(tripPath, 'trip.md');
  if (fs.existsSync(mdPath)) {
    const mdContent = fs.readFileSync(mdPath, 'utf-8');
    // Extract description (everything after the date line)
    const lines = mdContent.split('\n');
    const descStart = lines.findIndex(line => line.trim() === '') + 1;
    tripDescription = lines.slice(descStart).join('\n').trim();
  }

  // Process each image
  for (const filename of imageFiles) {
    const filePath = path.join(tripPath, filename);
    console.log(`  📸 Processing: ${filename}`);

    const exifData = await extractExifData(filePath);
    const fileDate = getFileDate(filePath);

    // Build photo metadata
    const photoMeta = {
      filename: filename,
      title: filename.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '), // Remove extension and replace _ with space
      description: '', // User should fill this in
      date: (exifData?.dateTaken) || fileDate,
      location: exifData?.latitude ? formatGPSLocation(exifData.latitude, exifData.longitude) : tripInfo.location,
      tags: []
    };

    // Add optional fields if available
    if (exifData?.camera) {
      photoMeta.camera = exifData.camera;
    }
    if (exifData?.lens) {
      photoMeta.lens = exifData.lens;
    }
    if (exifData?.latitude && exifData?.longitude) {
      photoMeta.gps = {
        latitude: exifData.latitude,
        longitude: exifData.longitude
      };
    }

    photos.push(photoMeta);

    console.log(`    ✅ Date: ${photoMeta.date}`);
    if (exifData?.camera) console.log(`    📷 Camera: ${exifData.camera}`);
    if (exifData?.latitude) console.log(`    📍 GPS: ${formatGPSLocation(exifData.latitude, exifData.longitude)}`);
  }

  // Sort photos by date
  photos.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Determine trip date range from photos
  const dates = photos.map(p => new Date(p.date));
  const startDate = new Date(Math.min(...dates)).toISOString().split('T')[0];
  const endDate = new Date(Math.max(...dates)).toISOString().split('T')[0];

  // Build complete metadata object
  const metadata = {
    trip: {
      name: tripInfo.name,
      location: tripInfo.location,
      startDate: startDate,
      endDate: endDate,
      description: tripDescription || `Trip to ${tripInfo.location}`
    },
    photos: photos
  };

  return metadata;
}

/**
 * Save metadata to file
 */
function saveMetadata(tripId, metadata, options = {}) {
  const metadataPath = path.join(TRIPS_DIR, tripId, 'metadata.json');

  // Check if file already exists
  if (fs.existsSync(metadataPath) && !options.overwrite) {
    console.log(`  ⚠️  metadata.json already exists. Use --overwrite to replace it.`);
    return false;
  }

  try {
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
    console.log(`  ✅ Saved: ${metadataPath}`);
    return true;
  } catch (error) {
    console.error(`  ❌ Error saving metadata:`, error.message);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
📸 Photo Metadata Extractor

Usage:
  npm run extract-metadata <trip-folder>          Extract metadata for one trip
  npm run extract-metadata --all                   Extract for all trips
  npm run extract-metadata <trip-folder> --overwrite   Overwrite existing metadata.json

Examples:
  npm run extract-metadata tokyo-2025
  npm run extract-metadata mt-fuji-2025 --overwrite
  npm run extract-metadata --all
    `);
    return;
  }

  const overwrite = args.includes('--overwrite');
  const extractAll = args.includes('--all');

  console.log('🚀 Starting metadata extraction...\n');

  if (extractAll) {
    // Extract for all trips
    const tripFolders = fs.readdirSync(TRIPS_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))
      .map(dirent => dirent.name);

    console.log(`Found ${tripFolders.length} trip folders\n`);

    for (const tripId of tripFolders) {
      const metadata = await extractTripMetadata(tripId);
      if (metadata) {
        saveMetadata(tripId, metadata, { overwrite });
      }
    }
  } else {
    // Extract for specific trip
    const tripId = args.find(arg => !arg.startsWith('--'));

    if (!tripId) {
      console.error('❌ Please specify a trip folder name');
      return;
    }

    const metadata = await extractTripMetadata(tripId);
    if (metadata) {
      saveMetadata(tripId, metadata, { overwrite });
    }
  }

  console.log('\n✨ Done!');
  console.log('\n💡 Next steps:');
  console.log('   1. Review and edit the generated metadata.json files');
  console.log('   2. Add descriptions and better titles to your photos');
  console.log('   3. Add tags like ["city", "nature", "food"] to categorize photos');
  console.log('   4. Run: npm run scan-photos');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
