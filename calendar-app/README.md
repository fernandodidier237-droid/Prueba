# Modern Calendar App

A beautiful, ultra-minimalist calendar application built with React, Vite, and Tailwind CSS featuring a deep dark mode with glassmorphism effects.

## Features

- **Interactive Monthly View**: Navigate between months with smooth transitions
- **Quick Event Addition**: Click on any day to add events instantly
- **Visual Indicators**: Elegant dot indicators for days with events
- **Fully Responsive**: Optimized for both mobile and desktop devices
- **Glassmorphism Design**: Modern aesthetic with subtle borders, backdrop blur, and transparencies
- **Deep Dark Mode**: Sober color palette with blacks, dark grays, and electric violet accent

## Tech Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd calendar-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
calendar-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          # Main calendar component
│   ├── App.css          # Custom animations and styles
│   ├── index.css        # Tailwind directives and global styles
│   └── main.jsx         # Application entry point
├── index.html
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── package.json
```

## Usage

- **Navigate Months**: Use the left/right arrows or the "Today" button
- **Add Event**: Click on any day to open the event modal
- **Delete Event**: Hover over an event in the modal and click the X button
- **View Events**: Days with events show colored dot indicators

## Design Inspiration

Inspired by Linear and Apple's design language, featuring:
- Ultra-minimalist interface
- Deep dark color scheme (#0a0a0a, #121212, #1a1a1a)
- Electric violet accent (#6366f1)
- Glassmorphism effects with backdrop blur
- Subtle borders and shadows

## License

MIT
