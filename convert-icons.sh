#!/bin/bash

echo "Converting icons for both monogram and crazy frog..."

# Check if ImageMagick is available
if ! command -v convert &> /dev/null; then
    echo "ImageMagick not found. Please install it first:"
    echo "  brew install imagemagick"
    exit 1
fi

# Create directories for different icon sets
mkdir -p public/icons/monogram
mkdir -p public/icons/frog

echo "Creating monogram icons..."
# Convert SVG monogram to different sizes
convert public/monogram.svg -resize 16x16 public/icons/monogram/favicon-16x16.png
convert public/monogram.svg -resize 32x32 public/icons/monogram/favicon-32x32.png
convert public/monogram.svg -resize 192x192 public/icons/monogram/logo192.png
convert public/monogram.svg -resize 512x512 public/icons/monogram/logo512.png

# Create ICO file for monogram
convert public/monogram.svg -resize 64x64 -colors 256 public/icons/monogram/favicon.ico

echo "Creating crazy frog icons..."
# Convert crazy frog to different sizes
convert public/crazy_frog_original.png -resize 16x16 public/icons/frog/favicon-16x16.png
convert public/crazy_frog_original.png -resize 32x32 public/icons/frog/favicon-32x32.png
convert public/crazy_frog_original.png -resize 192x192 public/icons/frog/logo192.png
convert public/crazy_frog_original.png -resize 512x512 public/icons/frog/logo512.png

# Create ICO file for crazy frog
convert public/crazy_frog_original.png -resize 64x64 -colors 256 public/icons/frog/favicon.ico

echo "Icon conversion complete!"
echo ""
echo "Available icon sets:"
echo "  - Monogram: public/icons/monogram/"
echo "  - Crazy Frog: public/icons/frog/"