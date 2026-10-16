# Auto-Extraction Photo Metadata System

## ✨ What's New

You can now **automatically extract metadata** from your photos using EXIF data!

## 🚀 Quick Start

```bash
# Extract metadata for all trips (recommended)
npm run extract-metadata -- --all

# Or extract for a specific trip
npm run extract-metadata tokyo-2025

# Then aggregate all metadata
npm run scan-photos
```

## 📸 What Gets Extracted Automatically

### From EXIF Data (Camera Metadata)
- ✅ **Date taken** - Actual capture date/time (e.g., "2025-03-15T14:30:00")
- ✅ **GPS coordinates** - Latitude/longitude if photo was geotagged
- ✅ **Camera model** - e.g., "Apple iPhone 15"
- ✅ **Lens info** - e.g., "iPhone 15 back camera 4.2mm f/1.6"
- ✅ **Image dimensions** - Width and height

### From File System
- ✅ **File creation date** - Used as fallback if no EXIF date
- ✅ **Trip name** - Parsed from folder name (e.g., "tokyo-2025" → "Tokyo 2025")

### From Existing Files
- ✅ **Trip description** - Imported from trip.md if it exists

## 📝 Example

**Before:** You have photos in `public/photos/trips/tokyo-2025/`

**After running extraction:**
```bash
npm run extract-metadata tokyo-2025
```

**Result:** Creates `metadata.json`:
```json
{
  "trip": {
    "name": "Tokyo 2025",
    "location": "Tokyo",
    "startDate": "2025-03-15",
    "endDate": "2025-03-22",
    "description": "Trip to Tokyo"
  },
  "photos": [
    {
      "filename": "shibuya-crossing.jpg",
      "date": "2025-03-15T20:30:00",  // ✅ From camera EXIF
      "location": "35.659517, 139.700565",  // ✅ GPS from photo
      "camera": "Apple iPhone 15",  // ✅ From EXIF
      "gps": {
        "latitude": 35.659517,
        "longitude": 139.700565
      }
    }
  ]
}
```

## 🔧 Commands

### Extract Metadata
```bash
# All trips at once
npm run extract-metadata -- --all

# Single trip
npm run extract-metadata tokyo-2025

# Overwrite existing metadata.json
npm run extract-metadata tokyo-2025 --overwrite
```

### Aggregate Metadata
After extraction, always run:
```bash
npm run scan-photos
```

This aggregates all metadata into `src/data/photoMetadata.js` for use in your app.

## 🎯 Workflow

1. **Add photos** to trip folder: `public/photos/trips/your-trip-name/`
2. **Extract metadata**: `npm run extract-metadata -- --all`
3. **Edit metadata.json** - Add better titles, descriptions, and tags
4. **Aggregate**: `npm run scan-photos`
5. **Use in app**: Import from `src/data/photoMetadata.js`

## 💡 Pro Tips

### 1. GPS Coordinates
If your photos have GPS data, it will be extracted automatically! Perfect for:
- Showing photo locations on a map
- Filtering photos by region
- Displaying exact capture location

### 2. Camera Info
Camera and lens info is extracted, so you can:
- Show camera settings on photo detail page
- Group photos by camera
- Create a "Shot on iPhone" section

### 3. Accurate Dates
The script uses **actual capture date** from EXIF, not file modification date. This means photos are sorted by when they were actually taken, even if you copied them later.

### 4. Batch Processing
Use `--all` to extract metadata for all trips at once, then edit the generated files to add titles and descriptions.

### 5. Safe by Default
The script won't overwrite existing metadata.json files unless you use `--overwrite`.

## 🔍 Example: Check Extracted Data

After extraction, check what was found:

```bash
cat public/photos/trips/tokyo-2025/metadata.json
```

You'll see all the auto-extracted data. Edit this file to improve:
- Photo titles (change "IMG 1234" to "Shibuya Crossing at Night")
- Descriptions (add context about the photo)
- Tags (add ["city", "night", "tokyo"])

## 📊 Using Extracted Metadata in Your App

```javascript
import { getPhotoByFilename, allPhotos } from '../data/photoMetadata';

// Get photo with all metadata
const photo = getPhotoByFilename('shibuya-crossing.jpg');

console.log(photo.date);      // "2025-03-15T20:30:00" (from EXIF)
console.log(photo.camera);    // "Apple iPhone 15" (from EXIF)
console.log(photo.gps);       // { latitude: 35.659517, longitude: 139.700565 }
console.log(photo.tripName);  // "Tokyo 2025"

// All photos sorted by actual capture date
const recent = allPhotos.slice(0, 10);
```

## 🆚 Auto vs Manual

| Feature | Auto-Extract | Manual |
|---------|--------------|--------|
| Speed | ⚡ Instant | 🐌 Slow |
| EXIF data | ✅ Yes | ❌ No |
| GPS | ✅ Yes | ❌ No |
| Camera info | ✅ Yes | ❌ No |
| Accuracy | ✅ High | ⚠️ Manual entry |
| Titles/descriptions | ⚠️ Generic | ✅ Custom |

**Best approach:** Auto-extract first, then edit the generated files to add custom titles and descriptions!

## 🎨 Supported Formats

- ✅ JPEG (.jpg, .jpeg)
- ✅ PNG (.png)
- ✅ HEIC (.heic) - iPhone format
- ✅ HEIF formats

## 📚 More Info

See `PHOTO_METADATA_GUIDE.md` for complete documentation.
