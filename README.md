# Axel Hagen - Portfolio Website

A modern, minimalistic personal portfolio website with smooth macOS-like design elements. Built with React 19 and Vite, featuring glassmorphism UI, dark mode support, and polished animations.

## 🚀 Built With

- **React 19.1.0** - Latest React with functional components and hooks
- **Vite 7.1.1** - Ultra-fast build tool and development server
- **CSS3** - Custom properties (CSS variables) for theming
- **Modern JavaScript** - ES6+ features and modules

## ✨ Features

- **🌓 Dark Mode**: Toggle with system preference detection and localStorage persistence  
- **🎨 Glassmorphism Design**: CSS backdrop blur effects and translucent cards
- **📱 Responsive Layout**: Works beautifully on all screen sizes
- **⚡ Lightning Fast**: Vite provides near-instant hot module replacement
- **🖼️ Photography Lightbox**: Click to expand photos in modal view
- **🎯 Smooth Navigation**: Fixed floating navigation with smooth scrolling
- **♿ Accessible**: Proper ARIA labels and semantic HTML

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

### 📁 Project Structure

```
my-portfolio/
├── public/                 # Static assets
│   ├── images/            # Photography portfolio images  
│   ├── *.pdf             # Resume files
│   └── favicon.ico       # Site favicon
├── src/
│   ├── App.jsx           # Main application component
│   ├── App.css           # Application styles with CSS variables
│   ├── index.jsx         # Application entry point
│   └── index.css         # Global styles
├── index.html            # HTML template (moved from public/ for Vite)
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies and scripts
```

## 🎨 Design System

### Color Themes
CSS custom properties enable seamless light/dark mode switching:
- **Light Mode**: Gradient background (#f5f7fa to #c3cfe2), white glass cards
- **Dark Mode**: Dark gradient (#1a1a1a to #2d2d30), semi-transparent cards

### Key Design Elements
- `backdrop-filter: blur(10px)` for glassmorphism effects
- Rounded corners (12px-20px) throughout the interface
- Subtle shadows and inset highlights
- Apple system fonts (-apple-system, BlinkMacSystemFont)
- Smooth transitions (0.3s ease) on all interactive elements

## 🖼️ Adding Photography

To add new photos to the portfolio:

1. Add image files to `public/images/`
2. Update the `photos` array in `src/App.jsx`:
   ```jsx
   const photos = [
     { src: '/images/your-photo.jpg', alt: 'Description' },
     // Add more photos here
   ];
   ```

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
- Moved `index.html` from `public/` to root directory
- Updated package.json scripts to use Vite commands
- Renamed `.js` files to `.jsx` for proper JSX handling

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/axelhagen/my-portfolio/issues).

---

**Built with ❤️ by Axel Hagen**