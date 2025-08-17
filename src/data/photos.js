// Photo manifest - Auto-generated from actual files
// Run `npm run scan-photos` to regenerate this file

export const PHOTO_MANIFEST = {
  highlights: [
    "IMG_3588.png",
    "IMG_3701.png",
    "IMG_3703.png",
    "IMG_3733.png",
    "IMG_3736.png",
    "IMG_3752.png",
    "IMG_3755.png",
    "IMG_3760.png",
    "IMG_3762.png",
    "IMG_4096.png",
    "IMG_9406.png",
    "IMG_9643.png",
    "highlight_3.png",
    "highlight_4.png",
  ],
  
  sections: {
    travel: [
    "travel_1.jpg",
    "travel_2.jpg",
    ],
    nature: [
    "nature_1.jpg",
    "nature_2.jpg",
    ],
    city: [
    "city_1.jpg",
    "city_2.jpg",
    ]
  }
};

// Helper function to get preview photos (first N from highlights)
export const getPreviewPhotos = (count = 6) => {
  return PHOTO_MANIFEST.highlights
    .slice(0, count)
    .map((filename, index) => ({
      src: `/photos/highlights/${filename}`,
      alt: `Photo ${index + 1}`,
      filename: filename,
      category: 'highlights'
    }));
};

// Helper function to get section photos
export const getSectionPhotos = (sectionName) => {
  const photos = PHOTO_MANIFEST.sections[sectionName] || [];
  return photos.map((filename, index) => ({
    src: `/photos/sections/${sectionName}/${filename}`,
    alt: `${sectionName} photo ${index + 1}`,
    filename: filename, 
    category: sectionName
  }));
};

// Helper function to get all highlights
export const getAllHighlights = () => {
  return PHOTO_MANIFEST.highlights.map((filename, index) => ({
    src: `/photos/highlights/${filename}`,
    alt: `Photo ${index + 1}`,
    filename: filename,
    category: 'highlights'
  }));
};