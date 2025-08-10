# Photo Structure Guide

This guide explains how to manage photos in the plog section of your portfolio.

## Folder Structure

```
public/photos/
├── highlights/          # 9 featured photos displayed prominently
│   ├── highlight_1.jpg
│   ├── highlight_2.jpg
│   └── ... (up to highlight_9.jpg)
└── sections/           # Organized photo categories
    ├── travel/         # Travel photos
    ├── nature/         # Nature photos
    ├── city/           # City photos
    └── [custom]/       # Add any new category folder
```

## How to Add Photos

### Highlights Section (9 photos max)
1. Replace any of the files in `public/photos/highlights/`
2. Keep filenames as `highlight_1.jpg` through `highlight_9.jpg`
3. These photos will be displayed in the "✨ Highlights" tab

### Section Categories
1. Add photos to existing category folders:
   - `public/photos/sections/travel/` (✈️ Travel)
   - `public/photos/sections/nature/` (🌿 Nature) 
   - `public/photos/sections/city/` (🏙️ City)

2. To create a new category:
   - Create a new folder: `public/photos/sections/[category-name]/`
   - Add photos with naming: `[category-name]_1.jpg`, `[category-name]_2.jpg`, etc.
   - Update `App.jsx` to include the new category in the `sectionConfig` object

## Automatic Detection

The photo system automatically:
- Detects all photos in the highlights folder (1-9)
- Scans section folders and counts photos
- Generates navigation tabs for each section
- Updates the display when you add/remove photos

## Technical Details

- Photos are loaded dynamically based on folder structure
- Supports JPG format (easily extendable to PNG, WEBP, etc.)
- Uses responsive grid layout
- Includes lightbox modal for full-size viewing
- Navigation tabs switch between different photo categories

## Example Usage

To add 5 travel photos:
1. Place files in `public/photos/sections/travel/`
2. Name them: `travel_1.jpg`, `travel_2.jpg`, ..., `travel_5.jpg`
3. Update the count in `App.jsx` sectionConfig: `travel: { count: 5, name: 'Travel' }`