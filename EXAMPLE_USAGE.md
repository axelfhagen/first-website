# Example: Using Photo Metadata in Plog Component

Here's how to integrate the metadata system into your existing Plog.jsx component.

## Step 1: Import the metadata functions

```javascript
// In Plog.jsx - Add to existing imports
import {
  getPhotoByFilename,
  getRecentPhotos as getRecentPhotosMeta,
  allPhotos,
  tripsByDate
} from '../data/photoMetadata';
```

## Step 2: Update the lightbox to show metadata

```javascript
// Modify the openLightbox function to include metadata
const openLightbox = (photo) => {
  // Try to get metadata for this photo
  const metadata = getPhotoByFilename(photo.filename);

  if (metadata) {
    // Photo has metadata - merge it in
    setSelectedPhoto({
      ...photo,
      ...metadata
    });
  } else {
    // No metadata - show photo as-is
    setSelectedPhoto(photo);
  }
};
```

## Step 3: Display metadata in the lightbox modal

Update your lightbox JSX to show the metadata:

```javascript
{selectedPhoto && (
  <div className="lightbox" onClick={closeLightbox}>
    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
      <button className="lightbox-close" onClick={closeLightbox}>✕</button>

      <SmartImage
        src={selectedPhoto.src || selectedPhoto.path}
        alt={selectedPhoto.title || selectedPhoto.alt}
      />

      {/* Metadata display */}
      {selectedPhoto.title && (
        <div className="photo-metadata">
          <h3>{selectedPhoto.title}</h3>

          {selectedPhoto.description && (
            <p className="photo-description">{selectedPhoto.description}</p>
          )}

          <div className="photo-details">
            {selectedPhoto.location && (
              <span className="photo-location">📍 {selectedPhoto.location}</span>
            )}

            {selectedPhoto.date && (
              <span className="photo-date">
                📅 {new Date(selectedPhoto.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            )}
          </div>

          {selectedPhoto.tripName && (
            <div className="photo-trip">
              <span>From: <strong>{selectedPhoto.tripName}</strong></span>
            </div>
          )}

          {selectedPhoto.tags && selectedPhoto.tags.length > 0 && (
            <div className="photo-tags">
              {selectedPhoto.tags.map(tag => (
                <span key={tag} className="tag">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  </div>
)}
```

## Step 4: Add CSS for metadata display

Add to your Plog.css:

```css
.photo-metadata {
  padding: 20px;
  text-align: left;
  max-width: 600px;
  margin: 0 auto;
}

.photo-metadata h3 {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 600;
}

.photo-description {
  color: var(--text-secondary);
  margin: 10px 0;
  line-height: 1.6;
}

.photo-details {
  display: flex;
  gap: 20px;
  margin: 15px 0;
  flex-wrap: wrap;
}

.photo-location,
.photo-date {
  font-size: 14px;
  color: var(--text-secondary);
}

.photo-trip {
  margin: 10px 0;
  padding: 10px;
  background: var(--bg-secondary);
  border-radius: 8px;
  font-size: 14px;
}

.photo-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 15px;
}

.photo-tags .tag {
  background: var(--accent-color);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}
```

## Step 5: Show recent photos sorted by date

You can now replace the "Recent" section with photos sorted by actual capture date:

```javascript
// In your useEffect where you load photos:
useEffect(() => {
  const loadPhotos = async () => {
    try {
      setIsLoading(true);

      // Get photos from metadata (sorted by actual date)
      const metaPhotos = getRecentPhotosMeta(10);

      if (metaPhotos.length > 0) {
        // Use metadata photos if available
        setRecentPhotos(metaPhotos);
      } else {
        // Fallback to old method
        const recentData = await getRecentPhotosWithMetadata();
        setRecentPhotos(recentData);
      }

      // ... rest of your code
    } catch (error) {
      console.warn('Could not load photos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  loadPhotos();
}, []);
```

## Full Example: Minimal Integration

If you just want to quickly show photo titles and dates, here's the minimal change:

```javascript
// 1. Import at top
import { getPhotoByFilename } from '../data/photoMetadata';

// 2. Update openLightbox
const openLightbox = (photo) => {
  const metadata = getPhotoByFilename(photo.filename);
  setSelectedPhoto(metadata || photo);
};

// 3. In your lightbox JSX, just add this after the image:
{selectedPhoto.title && (
  <>
    <h3>{selectedPhoto.title}</h3>
    <p>{selectedPhoto.location}</p>
    <small>{selectedPhoto.date && new Date(selectedPhoto.date).toDateString()}</small>
  </>
)}
```

## Testing

1. Make sure you have metadata.json in at least one trip folder
2. Run `npm run scan-photos`
3. Start your dev server: `npm start`
4. Click on a photo from that trip
5. You should see the metadata displayed!

## Next Steps

- Add metadata.json files to all your other trips
- Customize the metadata display to match your design
- Add features like filtering by tag, searching by location, etc.
- Show "Related photos" from the same trip
