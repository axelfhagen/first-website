// Photo manifest - Auto-generated from actual files
// Run `npm run scan-photos` to regenerate this file

export const PHOTO_MANIFEST = {
  recent: [
    "IMG_3588.png",
    "IMG_3701.png",
    "IMG_3752.png",
    "IMG_3760.png",
    "IMG_3762.png",
    "IMG_4096.png",
    "IMG_9406.png",
    "IMG_9643.png",
    "highlight_3.png",
    "highlight_4.png",
  ],
  
  highlights: [
    "IMG_1757.png",
    "IMG_1827.png",
    "IMG_20250711_124440317_Original.png",
    "IMG_2386.png",
    "IMG_2481.png",
    "IMG_2555.png",
    "IMG_3239.png",
    "IMG_3292.png",
    "IMG_3581.png",
    "IMG_3588.png",
    "IMG_3703.png",
    "IMG_3855.png",
    "IMG_3987.png",
    "IMG_4143.png",
    "highlight_3.png",
    "highlight_4.png",
  ],
  
  trips: {
    "beijing-2025": {
      title: "Beijing Solo",
      date: "August 2025",
      folder: "beijing-2025",
      images: [
    "IMG_2493.png",
    "city_1.jpg",
      ]
    },
    "hanoi-2025": {
      title: "hanoi 2025",
      date: "",
      folder: "hanoi-2025",
      images: [
    // No photos found - add some images to this folder!
      ]
    },
    "jeju-islands-2025": {
      title: "Tokyo Summer Adventure",
      date: "August 2023",
      folder: "jeju-islands-2025",
      images: [
    "travel_2.jpg",
      ]
    },
    "kyoto-osaka-nara-2025": {
      title: "Tokyo Summer Adventure",
      date: "August 2023",
      folder: "kyoto-osaka-nara-2025",
      images: [
    "travel_2.jpg",
      ]
    },
    "mt-fuji-2025": {
      title: "Trip to Mt. Fuji",
      date: "September 8th 2025",
      folder: "mt-fuji-2025",
      images: [
    "travel_1.jpg",
      ]
    },
    "tokyo-2025": {
      title: "Tokyo Summer Adventure",
      date: "August 2023",
      folder: "tokyo-2025",
      images: [
    "travel_2.jpg",
      ]
    },
    "yakushima-2025": {
      title: "Yakushima Hiking week",
      date: "17th - 23rd November 2025",
      folder: "yakushima-2025",
      images: [
    "travel_2.jpg",
      ]
    },
    "yufu-beppu-2025": {
      title: "Mt Yufu Hike and Beppu Onsen",
      date: "October 2025",
      folder: "yufu-beppu-2025",
      images: [
    "travel_2.jpg",
      ]
    }
  }
};

// Helper function to get preview photos (first N from recent)
export const getPreviewPhotos = (count = 6) => {
  return PHOTO_MANIFEST.recent
    .slice(0, count)
    .map((filename, index) => ({
      src: `/photos/recent/${filename}`,
      alt: `Photo ${index + 1}`,
      filename: filename,
      category: 'recent'
    }));
};

// Helper function to get recent photos
export const getRecentPhotos = () => {
  return PHOTO_MANIFEST.recent.map((filename, index) => ({
    src: `/photos/recent/${filename}`,
    alt: `Photo ${index + 1}`,
    filename: filename,
    category: 'recent'
  }));
};

// Helper function to get highlight photos
export const getHighlightPhotos = () => {
  return PHOTO_MANIFEST.highlights.map((filename, index) => ({
    src: `/photos/highlights/${filename}`,
    alt: `Highlight photo ${index + 1}`,
    filename: filename,
    category: 'highlights'
  }));
};

// Helper function to get trip photos
export const getTripPhotos = (tripId) => {
  const trip = PHOTO_MANIFEST.trips[tripId];
  if (!trip) return [];
  
  return trip.images.map((filename, index) => ({
    src: `/photos/trips/${tripId}/${filename}`,
    alt: `${trip.title} photo ${index + 1}`,
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
};