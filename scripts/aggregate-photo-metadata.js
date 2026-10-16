#!/usr/bin/env node

/**
 * Photo Metadata Aggregation Script
 *
 * Scans all trip folders for metadata.json files and aggregates them into
 * a single file for easy querying, sorting, and filtering in the app.
 *
 * Run: npm run scan-photos
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TRIPS_DIR = path.join(__dirname, '../public/photos/trips');
const OUTPUT_FILE = path.join(__dirname, '../src/data/photoMetadata.js');

/**
 * Recursively scan trip directories for metadata.json files
 */
function scanTripMetadata() {
  const allPhotos = [];
  const tripsByDate = [];
  const photosByFilename = {};

  try {
    const tripFolders = fs.readdirSync(TRIPS_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))
      .map(dirent => dirent.name);

    console.log(`📸 Found ${tripFolders.length} trip folders`);

    for (const tripId of tripFolders) {
      const metadataPath = path.join(TRIPS_DIR, tripId, 'metadata.json');

      if (!fs.existsSync(metadataPath)) {
        console.warn(`⚠️  No metadata.json found for trip: ${tripId}`);
        continue;
      }

      try {
        const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
        const metadata = JSON.parse(metadataContent);

        // Validate metadata structure
        if (!metadata.trip || !metadata.photos) {
          console.warn(`⚠️  Invalid metadata structure in: ${tripId}`);
          continue;
        }

        // Add trip to trips array
        tripsByDate.push({
          id: tripId,
          ...metadata.trip,
          photoCount: metadata.photos.length
        });

        // Process each photo in the trip
        for (const photo of metadata.photos) {
          const photoData = {
            ...photo,
            tripId,
            tripName: metadata.trip.name,
            tripLocation: metadata.trip.location,
            tripStartDate: metadata.trip.startDate,
            tripEndDate: metadata.trip.endDate,
            tripDescription: metadata.trip.description,
            // Full path for easy access
            path: `/photos/trips/${tripId}/${photo.filename}`,
          };

          allPhotos.push(photoData);
          photosByFilename[photo.filename] = photoData;
        }

        console.log(`✅ Processed ${metadata.photos.length} photos from: ${metadata.trip.name}`);
      } catch (error) {
        console.error(`❌ Error processing metadata for ${tripId}:`, error.message);
      }
    }

    // Sort photos by date (most recent first)
    allPhotos.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Sort trips by start date (most recent first)
    tripsByDate.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    console.log(`\n📊 Summary:`);
    console.log(`   Total photos: ${allPhotos.length}`);
    console.log(`   Total trips: ${tripsByDate.length}`);

    return { allPhotos, tripsByDate, photosByFilename };
  } catch (error) {
    console.error('❌ Error scanning trip metadata:', error);
    return { allPhotos: [], tripsByDate: [], photosByFilename: {} };
  }
}

/**
 * Generate the output file with aggregated metadata
 */
function generateMetadataFile(data) {
  const { allPhotos, tripsByDate, photosByFilename } = data;

  const fileContent = `/**
 * Photo Metadata - Auto-generated from trip metadata.json files
 *
 * Run \`npm run scan-photos\` to regenerate this file
 * Last updated: ${new Date().toISOString()}
 */

/**
 * All photos sorted by date (most recent first)
 */
export const allPhotos = ${JSON.stringify(allPhotos, null, 2)};

/**
 * All trips sorted by start date (most recent first)
 */
export const tripsByDate = ${JSON.stringify(tripsByDate, null, 2)};

/**
 * Quick lookup map: filename -> photo data
 */
const photosByFilename = ${JSON.stringify(photosByFilename, null, 2)};

/**
 * Get photo metadata by filename
 * @param {string} filename - The photo filename (e.g., "IMG_2493.png")
 * @returns {Object|null} Photo metadata or null if not found
 */
export function getPhotoByFilename(filename) {
  return photosByFilename[filename] || null;
}

/**
 * Get all photos from a specific trip
 * @param {string} tripId - The trip ID (folder name)
 * @returns {Array} Array of photo objects
 */
export function getPhotosByTrip(tripId) {
  return allPhotos.filter(photo => photo.tripId === tripId);
}

/**
 * Get recent photos (most recent N photos)
 * @param {number} count - Number of photos to return (default: 10)
 * @returns {Array} Array of recent photo objects
 */
export function getRecentPhotos(count = 10) {
  return allPhotos.slice(0, count);
}

/**
 * Get photos by tag
 * @param {string} tag - Tag to filter by
 * @returns {Array} Array of photo objects with the specified tag
 */
export function getPhotosByTag(tag) {
  return allPhotos.filter(photo => photo.tags && photo.tags.includes(tag));
}

/**
 * Get all unique tags
 * @returns {Array} Array of unique tags
 */
export function getAllTags() {
  const tags = new Set();
  allPhotos.forEach(photo => {
    if (photo.tags) {
      photo.tags.forEach(tag => tags.add(tag));
    }
  });
  return Array.from(tags).sort();
}

/**
 * Search photos by text (searches in title, description, location, and tags)
 * @param {string} query - Search query
 * @returns {Array} Array of matching photo objects
 */
export function searchPhotos(query) {
  const lowerQuery = query.toLowerCase();
  return allPhotos.filter(photo => {
    const searchText = [
      photo.title,
      photo.description,
      photo.location,
      photo.tripName,
      photo.tripLocation,
      ...(photo.tags || [])
    ].join(' ').toLowerCase();

    return searchText.includes(lowerQuery);
  });
}
`;

  try {
    fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf-8');
    console.log(`\n✅ Successfully generated: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('❌ Error writing metadata file:', error);
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Starting photo metadata aggregation...\n');

  const metadata = scanTripMetadata();
  generateMetadataFile(metadata);

  console.log('\n✨ Done!\n');
}

main();
