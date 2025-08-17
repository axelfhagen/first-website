#!/bin/bash

# Image Conversion Script - HEIC/JPEG to PNG (Lossless)
# Converts HEIC and JPEG images to PNG format with no compression loss
# Usage: ./convert-images.sh [directory] or ./convert-images.sh [single-file]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if ImageMagick is installed
check_dependencies() {
    if ! command -v magick &> /dev/null && ! command -v convert &> /dev/null; then
        print_error "ImageMagick is not installed."
        echo "Please install ImageMagick:"
        echo "  macOS: brew install imagemagick"
        echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
        echo "  CentOS/RHEL: sudo yum install ImageMagick"
        exit 1
    fi
    
    # Use 'magick' if available (ImageMagick 7+), otherwise fall back to 'convert'
    if command -v magick &> /dev/null; then
        CONVERT_CMD="magick"
    else
        CONVERT_CMD="convert"
    fi
}

# Function to convert a single image
convert_image() {
    local input_file="$1"
    local output_file="${input_file%.*}.png"
    
    # Skip if output already exists
    if [[ -f "$output_file" ]]; then
        print_warning "Skipping $input_file - PNG already exists"
        return 0
    fi
    
    print_status "Converting: $input_file"
    
    # Convert with no compression loss and auto-orient based on EXIF data
    if $CONVERT_CMD "$input_file" -auto-orient -quality 100 "$output_file"; then
        print_success "Created: $output_file"
        
        # Get file sizes for comparison
        input_size=$(du -h "$input_file" | cut -f1)
        output_size=$(du -h "$output_file" | cut -f1)
        echo "  Original: $input_size → PNG: $output_size"
        
        return 0
    else
        print_error "Failed to convert: $input_file"
        return 1
    fi
}

# Function to process directory
process_directory() {
    local dir="$1"
    local count=0
    local converted=0
    
    print_status "Processing directory: $dir"
    
    # Find all HEIC and JPEG files (case insensitive)
    while IFS= read -r -d '' file; do
        ((count++))
        if convert_image "$file"; then
            ((converted++))
        fi
    done < <(find "$dir" -type f \( -iname "*.heic" -o -iname "*.jpg" -o -iname "*.jpeg" \) -print0)
    
    if [[ $count -eq 0 ]]; then
        print_warning "No HEIC or JPEG files found in $dir"
    else
        echo
        print_success "Conversion complete: $converted/$count files converted successfully"
    fi
}

# Function to process single file
process_file() {
    local file="$1"
    
    # Check if file exists
    if [[ ! -f "$file" ]]; then
        print_error "File not found: $file"
        exit 1
    fi
    
    # Check if file is HEIC or JPEG
    file_lower=$(echo "$file" | tr '[:upper:]' '[:lower:]')
    case "$file_lower" in
        *.heic|*.jpg|*.jpeg)
            if convert_image "$file"; then
                print_success "File converted successfully"
            else
                print_error "Failed to convert file"
                exit 1
            fi
            ;;
        *)
            print_error "Unsupported file format. Only HEIC, JPG, and JPEG files are supported."
            exit 1
            ;;
    esac
}

# Main function
main() {
    echo "Image Converter - HEIC/JPEG to PNG (Lossless)"
    echo "=============================================="
    echo
    
    # Check dependencies
    check_dependencies
    
    # Parse arguments
    if [[ $# -eq 0 ]]; then
        # No arguments - process current directory
        process_directory "."
    elif [[ $# -eq 1 ]]; then
        if [[ -d "$1" ]]; then
            # Directory provided
            process_directory "$1"
        elif [[ -f "$1" ]]; then
            # File provided
            process_file "$1"
        else
            print_error "Path not found: $1"
            exit 1
        fi
    else
        echo "Usage: $0 [directory|file]"
        echo
        echo "Examples:"
        echo "  $0                    # Convert all images in current directory"
        echo "  $0 /path/to/photos    # Convert all images in specified directory"
        echo "  $0 image.heic         # Convert single image file"
        exit 1
    fi
}

# Run main function
main "$@"