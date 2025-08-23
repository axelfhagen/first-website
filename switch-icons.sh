#!/bin/bash

if [ "$1" != "monogram" ] && [ "$1" != "frog" ] && [ "$1" != "frog-emoji" ]; then
    echo "Usage: ./switch-icons.sh [monogram|frog|frog-emoji]"
    echo ""
    echo "Available options:"
    echo "  monogram   - Professional AH monogram"
    echo "  frog       - Crazy frog (for the bold)"
    echo "  frog-emoji - Clean frog emoji (cute & professional)"
    exit 1
fi

ICON_SET=$1
echo "Switching to $ICON_SET icons..."

# Copy the selected icons to the main locations
cp public/icons/$ICON_SET/favicon.ico public/favicon.ico
cp public/icons/$ICON_SET/logo192.png public/logo192.png
cp public/icons/$ICON_SET/logo512.png public/logo512.png

# Update manifest.json based on the icon set
if [ "$ICON_SET" = "monogram" ]; then
    cat > public/manifest.json << 'EOF'
{
  "short_name": "Axel Hagen",
  "name": "Axel Hagen - Portfolio",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#667eea",
  "background_color": "#f5f7fa"
}
EOF
elif [ "$ICON_SET" = "frog" ]; then
    cat > public/manifest.json << 'EOF'
{
  "short_name": "🐸 Axel Hagen",
  "name": "Axel Hagen - Portfolio (Frog Mode)",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#4ade80",
  "background_color": "#dcfce7"
}
EOF
elif [ "$ICON_SET" = "frog-emoji" ]; then
    cat > public/manifest.json << 'EOF'
{
  "short_name": "🐸 Axel Hagen",
  "name": "Axel Hagen - Portfolio (Frog Emoji)",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#4ade80",
  "background_color": "#dcfce7"
}
EOF
fi

echo "✅ Icons switched to $ICON_SET!"
echo "🔄 Refresh your browser to see the changes"
echo ""
echo "Files updated:"
echo "  - public/favicon.ico"
echo "  - public/logo192.png" 
echo "  - public/logo512.png"
echo "  - public/manifest.json"