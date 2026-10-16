# Photo Metadata System

This guide explains how to add and use metadata for your photos.

## Quick Start

### Option 1: Auto-Extract (Recommended)
1. **Extract metadata automatically**: `npm run extract-metadata -- --all`
2. **Review and edit** the generated `metadata.json` files
3. **Run the scanner**: `npm run scan-photos`
4. **Use in your app**: Import from `src/data/photoMetadata.js`

### Option 2: Manual Creation
1. **Create metadata.json** manually in your trip folder
2. **Run the scanner**: `npm run scan-photos`
3. **Use in your app**: Import from `src/data/photoMetadata.js`

## Auto-Extraction Features

The auto-extraction script (`npm run extract-metadata`) automatically extracts:

### From EXIF Data
- ✅ **Date taken** - Actual capture date/time from camera
- ✅ **GPS coordinates** - Latitude/longitude if available
- ✅ **Camera info** - Camera model (e.g., "Apple iPhone 15")
- ✅ **Lens info** - Lens details if available
- ✅ **Image dimensions** - Width and height

### From File System
- ✅ **File dates** - Creation/modification time as fallback
- ✅ **Trip info** - Parsed from folder name (e.g., "tokyo-2025" → "Tokyo 2025")

### From Existing trip.md
- ✅ **Trip description** - Automatically imported from your trip.md file

## Usage Commands

```bash
# Extract metadata for one trip
npm run extract-metadata tokyo-2025

# Extract metadata for all trips
npm run extract-metadata -- --all

# Overwrite existing metadata.json
npm run extract-metadata tokyo-2025 --overwrite

# After extraction, aggregate all metadata
npm run scan-photos
```

## Structure

### metadata.json Template

Create this file in each trip folder (e.g., `public/photos/trips/tokyo-2025/metadata.json`):

```json
{
  "trip": {
    "name": "Tokyo 2025",
    "location": "Tokyo, Japan",
    "startDate": "2025-03-15",
    "endDate": "2025-03-22",
    "description": "Spring cherry blossom season in Tokyo"
  },
  "photos": [
    {
      "filename": "shibuya-crossing.jpg",
      "title": "Shibuya Crossing at Night",
      "description": "The iconic scramble crossing during rush hour",
      "date": "2025-03-15T20:30:00",
      "location": "Shibuya, Tokyo",
      "tags": ["city", "night", "urban"]
    }
  ]
}
```

### Date Format

- **Trip dates**: `YYYY-MM-DD` (e.g., `"2025-03-15"`)
- **Photo dates**: ISO 8601 with time `YYYY-MM-DDTHH:mm:ss` (e.g., `"2025-03-15T20:30:00"`)

## Usage in Code

After running `npm run scan-photos`, use the generated functions:

```javascript
import {
  allPhotos,           // All photos sorted by date (newest first)
  tripsByDate,         // All trips sorted by date (newest first)
  getPhotoByFilename,  // Get specific photo metadata
  getPhotosByTrip,     // Get all photos from a trip
  getRecentPhotos,     // Get N most recent photos
  getPhotosByTag,      // Filter photos by tag
  searchPhotos         // Search photos by text
} from '../data/photoMetadata';

// Examples:

// Get 10 most recent photos
const recent = getRecentPhotos(10);

// Get specific photo info
const photo = getPhotoByFilename('IMG_2493.png');
console.log(photo.title); // "Great Wall of China"
console.log(photo.tripName); // "Beijing Solo"

// Get all city photos
const cityPhotos = getPhotosByTag('city');

// Search for photos
const results = searchPhotos('temple');
```

## Example: metadata.json for Beijing Trip

```json
{
  "trip": {
    "name": "Beijing Solo",
    "location": "Beijing, China",
    "startDate": "2025-08-12",
    "endDate": "2025-08-17",
    "description": "My first solo trip in Asia"
  },
  "photos": [
    {
      "filename": "IMG_2493.png",
      "title": "Great Wall of China",
      "description": "Standing on the Great Wall - a dream come true",
      "date": "2025-08-13T14:30:00",
      "location": "Great Wall of China, Beijing",
      "tags": ["landmark", "travel", "unesco"]
    }
  ]
}
```

## Displaying Metadata in Your App

### Show photo info in lightbox/modal:

```javascript
const PhotoModal = ({ photo }) => {
  // If photo has metadata (from photoMetadata.js)
  const metadata = getPhotoByFilename(photo.filename);

  return (
    <div>
      <img src={metadata.path} alt={metadata.title} />
      <h3>{metadata.title}</h3>
      <p>{metadata.description}</p>
      <small>{metadata.location} • {new Date(metadata.date).toLocaleDateString()}</small>
      <p>From: {metadata.tripName}</p>
    </div>
  );
};
```

### Update Recent section to show dates:

```javascript
// In Plog.jsx - modify openLightbox to include metadata
const openLightbox = (photo) => {
  const metadata = getPhotoByFilename(photo.filename);
  setSelectedPhoto({
    ...photo,
    ...metadata  // Merge metadata into photo object
  });
};
```

## Available Fields

### Trip Object
- `name` - Trip name
- `location` - Location/country
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)
- `description` - Trip description

### Photo Object
- `filename` - Original filename
- `title` - Photo title
- `description` - Photo description
- `date` - When photo was taken (ISO 8601)
- `location` - Specific location
- `tags` - Array of tags
- `tripId` - Trip folder name (auto-added)
- `tripName` - Trip name (auto-added)
- `tripLocation` - Trip location (auto-added)
- `path` - Full path to photo (auto-added)

## Tips

1. **Keep it simple**: Start with just title and date, add more later
2. **Use consistent tags**: Reuse tags like "city", "nature", "food", etc.
3. **Regenerate after changes**: Always run `npm run scan-photos` after editing metadata.json
4. **Example file**: Check `public/photos/trips/beijing-2025/metadata.json` for reference

## Workflow

### Automated Workflow (Recommended)
1. Take photos on your trip
2. Add photos to `public/photos/trips/your-trip-name/`
3. (Optional) Write a `trip.md` with trip description
4. Run `npm run extract-metadata -- --all` (extracts EXIF data automatically)
5. Edit the generated `metadata.json` to add titles, descriptions, and tags
6. Run `npm run scan-photos` (aggregates all metadata)
7. Your app now has access to all metadata via `photoMetadata.js`

### Manual Workflow
1. Take photos on your trip
2. Add photos to `public/photos/trips/your-trip-name/`
3. Manually create `metadata.json` in that folder
4. Run `npm run scan-photos`
5. Your app now has access to all metadata via `photoMetadata.js`

## What Gets Auto-Extracted?

When you run `npm run extract-metadata`, here's what happens:

1. **Scans your photos** for EXIF data (works with JPEG, PNG, HEIC)
2. **Extracts date taken** from camera metadata (not file modification date!)
3. **Finds GPS coordinates** if your photos were geotagged
4. **Gets camera/lens info** from EXIF
5. **Parses trip name** from folder structure
6. **Imports trip description** from trip.md if it exists
7. **Generates metadata.json** with all extracted data
8. **You can then edit** the file to add better titles, descriptions, and tags

### Example Auto-Extraction Output

Before running the script, you just have photos in a folder. After running:

```json
{
  "trip": {
    "name": "Tokyo 2025",
    "location": "Tokyo",
    "startDate": "2025-03-15",  // Auto-extracted from first photo
    "endDate": "2025-03-22",     // Auto-extracted from last photo
    "description": "Trip to Tokyo"  // Or from trip.md
  },
  "photos": [
    {
      "filename": "IMG_1234.jpg",
      "title": "IMG 1234",  // You should edit this
      "description": "",     // You should add this
      "date": "2025-03-15T14:30:00",  // ✅ Auto-extracted from EXIF
      "location": "35.689487, 139.691711",  // ✅ Auto-extracted GPS
      "tags": [],  // You should add tags
      "camera": "Apple iPhone 15",  // ✅ Auto-extracted
      "lens": "iPhone 15 back camera 4.2mm f/1.6",  // ✅ Auto-extracted
      "gps": {  // ✅ Auto-extracted
        "latitude": 35.689487,
        "longitude": 139.691711
      }
    }
  ]
}
```
