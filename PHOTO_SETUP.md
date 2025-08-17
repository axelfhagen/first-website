# 📸 Easy Photo System Setup

## 🎯 Super Quick Start

1. **Drop ANY photos** in `/public/photos/highlights/` (any filename works!)
2. **Run**: `npm run scan-photos` 
3. **Refresh page** - first 6 photos appear automatically!

✅ **No renaming required!** Works with IMG_1234.png, vacation.jpg, whatever.png, etc.

## 📁 Folder Structure

```
public/photos/
├── highlights/          # Main page preview photos
│   ├── IMG_0001.png
│   ├── photo_1.jpg
│   ├── DSC_0123.png
│   └── ... (any filename works!)
└── sections/
    ├── travel/          # Travel photos
    ├── nature/          # Nature photos
    └── city/            # City photos
```

## 🔧 Easy Configuration

**Change number of preview photos:**
```javascript
// In /src/config/photos.js
PREVIEW_COUNT: 9,  // Change from 6 to 9 for 3x3 grid
```

**The scanner found your photos:**
- ✅ 14 photos in highlights folder
- ✅ First 6 will show on main page: IMG_3588.png, IMG_3701.png, IMG_3703.png, etc.
- ✅ All 14 available in full Plog collection

## 📝 Supported Filename Patterns

The system automatically recognizes these naming patterns:

- **Camera formats**: `IMG_0001.png`, `DSC_0123.jpg`
- **Simple numbers**: `1.png`, `2.jpg`, `photo_5.png`
- **Common prefixes**: `pic_1.jpg`, `image_1.png`, `photo1.jpg`
- **Padded numbers**: `P001.png`, `P002.jpg`

**No renaming required!** Just dump your photos in the folders.

## 🎨 Quality Recommendations

1. **PNG** - Best quality, lossless compression
2. **WebP** - Modern format, smaller files, good quality
3. **JPG** - Universal compatibility, smaller files

## 🚀 Adding Photos

1. Copy photos to `/public/photos/highlights/` for main page
2. Copy photos to `/public/photos/sections/[travel|nature|city]/` for full collection
3. Refresh page - photos appear automatically!

## 🎛️ Customization Options

### Change Preview Count
```javascript
// In /src/config/photos.js
PREVIEW_COUNT: 9,  // For 3x3 grid instead of 2x3
```

### Add New Sections
```javascript
// In /src/config/photos.js
SECTIONS: {
  travel: { name: 'Travel', icon: '✈️' },
  nature: { name: 'Nature', icon: '🌿' },
  city: { name: 'City', icon: '🏙️' },
  portfolio: { name: 'Portfolio', icon: '🎨' },  // New section
  street: { name: 'Street', icon: '🌆' }        // Another section
}
```

Then create folders:
```
public/photos/sections/
├── portfolio/
└── street/
```

## 🔍 How It Works

1. **Auto-discovery**: Scans folders for common filename patterns
2. **Format fallback**: Tries PNG → WebP → JPG in order
3. **Smart loading**: Shows loading states and graceful fallbacks
4. **Performance**: Lazy loading and optimized image handling

## 🐛 Troubleshooting

- **Photos not showing?** Check browser console for loading errors
- **Wrong order?** System sorts by filename naturally
- **Missing sections?** Verify folder names match config exactly
- **Slow loading?** Consider converting large images to WebP format

## 📊 Browser Support

- **PNG**: ✅ All browsers
- **WebP**: ✅ Modern browsers (Chrome, Firefox, Safari 14+)
- **HEIC**: ❌ Not supported in browsers (convert to PNG/WebP)

---

**🎉 That's it!** Just drop photos in folders and they'll appear automatically. No filename management needed!