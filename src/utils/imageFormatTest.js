// Test script to demonstrate image format fallback
// Run this in the browser console to see format support

export const testImageFormats = () => {
  console.log('🧪 Testing Image Format Support:');
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  const formats = ['heic', 'webp', 'png', 'jpeg'];
  
  formats.forEach(format => {
    try {
      const dataUrl = canvas.toDataURL(`image/${format}`);
      const supported = dataUrl.indexOf(`data:image/${format}`) === 0;
      console.log(`${supported ? '✅' : '❌'} ${format.toUpperCase()}: ${supported ? 'Supported' : 'Not supported'}`);
    } catch (e) {
      console.log(`❌ ${format.toUpperCase()}: Not supported (error)`);
    }
  });
  
  console.log('\n📁 Expected file structure for photos:');
  console.log('public/photos/highlights/highlight_1.png (preferred - lossless)');
  console.log('public/photos/highlights/highlight_1.webp (fallback 1 - smaller size)');
  console.log('public/photos/highlights/highlight_1.jpg (fallback 2 - universal)');
  
  console.log('\n🔄 Fallback behavior:');
  console.log('1. Try to load .png file first (lossless quality)');
  console.log('2. If that fails, try .webp file (better compression)');
  console.log('3. If that fails, try .jpg file (universal support)');
  console.log('4. If all fail, show placeholder icon');
  
  console.log('\n💡 HEIC Note:');
  console.log('HEIC is not supported in web browsers. Use PNG for lossless quality.');
  
  return 'Image format test complete! Check console output above.';
};

// Auto-run the test when this module is imported in development
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    console.log('🚀 Image Format Support Test Ready!');
    console.log('Run testImageFormats() in console to test browser support');
  }, 1000);
}