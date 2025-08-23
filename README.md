# Axel Hagen - Portfolio Website

A modern, minimalistic personal portfolio website with smooth macOS-like design elements. Built with React 19 and Vite, featuring glassmorphism UI, dark mode support, multilingual support, and polished animations.

## 🚀 Built With

- **React 19.1.0** - Latest React with functional components and hooks
- **React Router DOM 7.8.1** - Client-side routing for multi-page experience
- **Vite 7.1.1** - Ultra-fast build tool and development server
- **Vitest 3.2.4** - Modern testing framework
- **CSS3** - Custom properties (CSS variables) for theming
- **Modern JavaScript** - ES6+ features and modules

## ✨ Features

- **🌐 Multilingual Support**: English/Norwegian language toggle with context-based translations
- **🌓 Dark Mode**: Toggle with system preference detection and localStorage persistence  
- **🎨 Glassmorphism Design**: CSS backdrop blur effects and translucent cards with green accent color
- **📱 Responsive Layout**: Works beautifully on all screen sizes
- **⚡ Lightning Fast**: Vite provides near-instant hot module replacement
- **🖼️ Smart Photo Gallery**: Organized photo sections with lightbox modal viewing
- **📝 Photo Blog (Plog)**: Dedicated photography showcase with curated highlights
- **🎯 Smooth Navigation**: Fixed floating navigation with smooth scrolling
- **🔗 Routing**: Multi-page experience with React Router
- **♿ Accessible**: Proper ARIA labels and semantic HTML
- **🤖 AI Integration**: Hugging Face profile integration

## 🛠️ Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/axelhagen/my-portfolio.git
   cd my-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   npm start
   ```
   
   Opens [http://localhost:3000](http://localhost:3000) with hot reload enabled.

### Available Scripts

- **`npm run dev`** or **`npm start`** - Start development server with hot reload
- **`npm run build`** - Create optimized production build in `build/` folder  
- **`npm run preview`** - Preview production build locally
- **`npm test`** - Run tests with Vitest
- **`npm run scan-photos`** - Automatically discover and organize photos in the gallery

### 📁 Project Structure

```
my-portfolio/
├── public/                 # Static assets
│   ├── photos/            # Photography portfolio organized by sections
│   │   ├── highlights/    # Curated highlight photos for Plog
│   │   └── sections/      # Categorized photos (nature, city, travel)
│   ├── icons/             # Favicon and logo variations 
│   ├── resume/            # Resume files in multiple languages
│   └── manifest.json      # PWA manifest
├── src/
│   ├── App.jsx           # Main application component
│   ├── Router.jsx        # React Router configuration
│   ├── components/       # Reusable components
│   │   └── SmartImage.jsx # Smart image loading component
│   ├── pages/            # Page components
│   │   └── Plog.jsx      # Photography blog page
│   ├── contexts/         # React contexts
│   │   └── LanguageContext.jsx # Language/translation context
│   ├── hooks/            # Custom React hooks
│   │   └── useTranslation.js # Translation hook
│   ├── config/           # Configuration files
│   ├── data/             # Static data
│   ├── translations/     # Translation files
│   ├── utils/            # Utility functions
│   └── styles/           # Component-specific styles
├── scripts/              # Build and utility scripts
│   └── scan-photos.js    # Photo discovery script
├── index.html            # HTML template (moved from public/ for Vite)
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies and scripts
```

## 🎨 Design System

### Color Themes
CSS custom properties enable seamless light/dark mode switching with green accent colors:
- **Light Mode**: Gradient background with green accents, white glass cards with green highlights
- **Dark Mode**: Dark gradient with green accents, semi-transparent cards with green borders

### Key Design Elements
- `backdrop-filter: blur(10px)` for glassmorphism effects
- Rounded corners (12px-20px) throughout the interface
- Subtle shadows and inset highlights
- Apple system fonts (-apple-system, BlinkMacSystemFont)
- Smooth transitions (0.3s ease) on all interactive elements

## 🖼️ Photography Management

### Automated Photo Discovery
The portfolio includes an automated photo discovery system:

```bash
npm run scan-photos
```

This script automatically scans the `public/photos/` directory and generates the photo configuration.

### Photo Organization Structure
```
public/photos/
├── highlights/          # Featured photos for the Plog page
├── sections/           # Categorized gallery photos
│   ├── nature/         # Nature photography
│   ├── city/           # Urban/city photography  
│   └── travel/         # Travel photography
```

### Manual Photo Management
Photos are configured in `src/config/photos.js` and support multiple image formats (JPG, PNG, WEBP). The SmartImage component automatically handles format detection and optimization.

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

This creates a `build/` directory with optimized static files ready for deployment.

### Deploy Options
- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `build/` folder or connect via Git
- **GitHub Pages**: Use GitHub Actions with the build files
- **Any static host**: Upload contents of `build/` directory

## 🔧 Migration from Create React App

This project was migrated from Create React App to Vite for better performance:

- **⚡ 10x faster development server** with instant hot module replacement
- **🏗️ Modern build tools** using Rollup and ESBuild  
- **📦 Smaller bundle sizes** with better tree-shaking
- **🔮 Future-proof** with continued active development

Key changes made during migration:
- Removed `react-scripts` dependency
- Added Vite and @vitejs/plugin-react
- Added Vitest for modern testing
- Moved `index.html` from `public/` to root directory
- Updated package.json scripts to use Vite commands
- Renamed `.js` files to `.jsx` for proper JSX handling
- Enhanced with React Router for multi-page experience

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/axelhagen/my-portfolio/issues).

---

**Built with ❤️ by Axel Hagen**