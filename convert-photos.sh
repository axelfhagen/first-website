#!/bin/bash

# Script to convert HEIC photos to JPG for web use with Instagram 4:5 aspect ratio
# Usage: ./convert-photos.sh

echo "Converting HEIC photos to optimized JPG (4:5 ratio)..."

# Navigate to images directory
cd "$(dirname "$0")/public/images" || exit

# Convert all HEIC files to JPG
for file in *.HEIC *.heic; do
    if [ -f "$file" ]; then
        echo "Converting $file..."
        
        # Step 1: Convert to JPG with web optimization
        temp_file="temp_${file%.*}.jpg"
        sips -s format jpeg "$file" --out "$temp_file" -s formatOptions 85
        
        # Step 2: Resize to max width of 480px (maintains aspect ratio)
        sips -Z 480 "$temp_file"
        
        # Step 3: Crop to 4:5 aspect ratio (384x480 for 480px width)
        final_file="${file%.*}.jpg"
        sips -c 480 384 "$temp_file" --out "$final_file"
        
        # Clean up temp file and original
        rm "$temp_file"
        rm "$file"
        
        echo "✅ Converted $file to ${final_file} (384x480px, 4:5 ratio)"
    fi
done

echo "🎉 All photos converted to Instagram format! Ready for web use."
echo "📐 All images are now 384x480px (4:5 aspect ratio) for consistent display."