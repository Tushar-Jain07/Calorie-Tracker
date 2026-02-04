# MacroSnap – Nutrition Tracker (Vite Edition)

A lightweight, offline-capable PWA for daily macro and calorie tracking, now powered by Vite for modern development and optimized builds.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The app will open automatically at `http://localhost:3000`

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📦 Deploy to Vercel

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: Deploy via Vercel Dashboard

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your repository
4. Vercel auto-detects Vite configuration
5. Click **Deploy**

---

## 🔑 USDA FoodData Central API (Optional)

Food-name autocomplete uses the USDA FoodData Central API. To enable it:

1. Get a free API key at <https://fdc.nal.usda.gov/fdc-app.html#/api-key>
2. Copy `.env.example` to `.env`
3. Add your API key to the `.env` file:

```env
VITE_USDA_API_KEY=your_api_key_here
```

Without an API key, users can still log food manually - only the autocomplete suggestions won't work.

**Note:** The `.env` file is git-ignored for security.

---

## 📁 Project Structure

```
macrosnap/
├── index.html              # Main app page
├── login.html              # Login page
├── register.html           # Registration page
├── src/
│   ├── main.js             # Main app logic
│   ├── login.js            # Login logic
│   ├── register.js         # Registration logic
│   └── style.css           # Global styles (retro-terminal theme)
├── public/
│   ├── manifest.json       # PWA manifest
│   └── sw.js               # Service worker (offline support)
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies and scripts
└── vercel.json             # Vercel deployment config
```

---

## ✨ Features

- **Macro Calculator**: Calculate BMR, TDEE, and personalized macro targets
- **Food Logging**: Track daily food intake with macro breakdown
- **USDA Integration**: Optional food database autocomplete
- **Dashboard**: Real-time progress tracking with visual charts
- **Weight Tracking**: Monitor weight trends over time
- **PWA Support**: Installable app with offline capabilities
- **Multi-user**: Local authentication with profile management
- **Responsive**: Works on desktop, tablet, and mobile

---

## 🔧 Tech Stack

- **Vite** - Fast build tool and dev server
- **Chart.js** - Interactive charts and visualizations
- **Vanilla JavaScript** - No framework overhead
- **CSS3** - Retro terminal-style design
- **LocalStorage** - Client-side data persistence
- **Service Workers** - Offline functionality

---

## 🎨 Demo Credentials

The app automatically creates a demo account:
- Username: `demo`
- Password: `demo`

---

## 📝 Development Notes

### Why Vite?

- ⚡ Lightning fast HMR (Hot Module Replacement)
- 📦 Optimized production builds with code splitting
- 🔧 Simple configuration
- 🎯 Better ES modules support
- 🚀 Faster development experience

### Key Improvements

- Converted to ES6 modules
- Removed inline onclick handlers
- Properly scoped global functions
- Optimized asset loading
- Better build optimization

---

## 🐛 Troubleshooting

**Issue**: Food autocomplete not working  
**Solution**: Make sure you've added a valid USDA API key to `index.html`

**Issue**: Service worker not registering  
**Solution**: Service workers only work over HTTPS (or localhost). Deploy to Vercel or use `npm run dev`

**Issue**: Charts not displaying  
**Solution**: Make sure Chart.js is installed: `npm install`

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 🌟 Future Enhancements

- [ ] Backend API for cloud sync
- [ ] Meal planning and recipes
- [ ] Export data to CSV/PDF
- [ ] Dark/light theme toggle
- [ ] Barcode scanner integration
- [ ] Social features and challenges

---

**Built with ❤️ for the fitness community**
