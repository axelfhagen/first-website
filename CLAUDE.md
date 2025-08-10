# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Axel Hagen's personal portfolio website - a modern, minimalistic site with smooth macOS-like design elements. Built with React 19.1.0 and Vite 7.1.1, featuring glassmorphism UI, dark mode support, and polished animations.

**Project Goal**: Create a professional yet personal showcase featuring projects, photography, and contact information with an emphasis on smooth UX and macOS-inspired aesthetics.

## Development Commands

- **Start development server**: `npm run dev` or `npm start` - Runs on http://localhost:3000 with instant hot reload
- **Run tests**: `npm test` - Launches Vitest test runner in watch mode  
- **Build for production**: `npm run build` - Creates optimized production build in `build/` folder using Rollup
- **Preview build**: `npm run preview` - Preview production build locally

## Architecture & Features

- **Frontend Framework**: React 19.1.0 with functional components and hooks
- **Build Tool**: Vite 7.1.1 with lightning-fast hot module replacement and optimized builds
- **Styling**: CSS3 with custom properties (CSS variables) for theming
- **Dark Mode**: Toggle with system preference detection and localStorage persistence
- **Animations**: CSS keyframes with staggered entrance effects and smooth transitions
- **Layout**: Responsive design with glassmorphism cards and backdrop blur effects
- **Navigation**: Fixed floating navigation with smooth scrolling between sections

## Current Sections

1. **Hero/Intro** - Name, introduction, availability status with pulsing indicator
2. **Projects** - GitHub project showcase with placeholder links and tech stacks  
3. **Photography** - Grid layout for photo placeholders (ready for real images)
4. **Contact** - Email and resume download with styled buttons
5. **Navigation** - Floating pill navigation with dark mode toggle

## Design System

**Color Themes**: CSS custom properties switch between light/dark modes
- Light: Gradient background (#f5f7fa to #c3cfe2), white glass cards
- Dark: Dark gradient (#1a1a1a to #2d2d30), semi-transparent glass cards

**Key Design Elements**:
- `backdrop-filter: blur(10px)` for glassmorphism effect
- Rounded corners (12px-20px) throughout
- Subtle shadows and inset highlights
- Apple system fonts (-apple-system, BlinkMacSystemFont)
- Smooth transitions (0.3s ease) on interactive elements

## Placeholder Content

- Project links point to `https://github.com/axelhagen/[project-name]`
- Social links use placeholder URLs (GitHub, LinkedIn, Email)
- Photography section has emoji placeholders
- Resume link points to `/resume.pdf`

## Migration from Create React App

This project was successfully migrated from Create React App to Vite for better performance and modern tooling:

### Key Benefits
- **⚡ 10x faster development server** with instant hot module replacement
- **🏗️ Modern build pipeline** using Rollup and ESBuild  
- **📦 Smaller bundle sizes** with better tree-shaking
- **🔮 Future-proof** with active development and modern standards

### Changes Made
- Removed deprecated `react-scripts` dependency
- Added Vite 7.1.1 and @vitejs/plugin-react
- Moved `index.html` from `public/` to root directory for Vite
- Updated all package.json scripts to use Vite commands
- Renamed `.js` files to `.jsx` for proper JSX handling
- Updated import paths and build configuration

## Future Enhancement Ideas

- Live GitHub API integration for real project data
- Real photography with lightbox/modal functionality  
- Skills/technologies section with animated icons
- Blog/writing section
- "Now playing" Spotify widget
- Command palette (⌘K) for navigation
- Intersection Observer animations
- Cursor following effects