# 🚀 Quick Start Guide

Get MacroSnap running in 5 minutes!

## Prerequisites

- Node.js 16+ ([Download](https://nodejs.org))
- A code editor (VS Code recommended)
- Git (optional, for version control)

## Installation

### Option 1: Using Setup Script (Easiest)

**Windows:**
```cmd
setup.bat
```

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

## First Steps

### 1. Login with Demo Account

- **Username:** `demo`
- **Password:** `demo`

Or create your own account using the registration page.

### 2. Calculate Your Macros

1. Go to **Calculator** tab
2. Enter your details:
   - Age, sex, height, weight
   - Activity level
   - Goal (fat loss, maintenance, or muscle gain)
3. Click **CALCULATE**
4. Your BMR, TDEE, and macro targets will appear

### 3. Log Your Food

1. Go to **Food Log** tab
2. Enter food name, serving size, and nutritional info
3. Click **ADD TO LOG**
4. View your entries in today's log

**💡 Tip:** Add your USDA API key for food autocomplete (see below)

### 4. Track Progress

1. Go to **Dashboard** to see today's consumption
2. Go to **Progress** tab for weekly trends
3. Log your weight to track changes over time

## Adding USDA API Key (Optional)

For food name autocomplete:

1. Get a free API key at https://fdc.nal.usda.gov/api-guide.html
2. Open `index.html`
3. Find this line:
   ```javascript
   window.USDA_API_KEY = '';
   ```
4. Add your key:
   ```javascript
   window.USDA_API_KEY = 'your-key-here';
   ```
5. Save and refresh

## Building for Production

```bash
# Build the app
npm run build

# Preview the build
npm run preview
```

The built files will be in the `dist` folder.

## Deploy to Vercel

### Quick Deploy (1 minute)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Click **Deploy**
5. Done! Your app is live 🎉

### Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

## Common Commands

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Build for production
npm run preview  # Preview production build (port 4173)
```

## Troubleshooting

### Port 3000 already in use?

Edit `vite.config.js`:
```javascript
server: {
  port: 3001, // Change port here
  open: true
}
```

### Dependencies not installing?

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build errors?

```bash
# Check Node.js version (should be 16+)
node -v

# Update npm
npm install -g npm@latest

# Try building again
npm run build
```

## Project Structure

```
macrosnap/
├── index.html          # Main app page
├── login.html          # Login page
├── register.html       # Registration page
├── main.js             # Main app logic
├── auth.js             # Authentication
├── storage.js          # Data storage
├── login.js            # Login handler
├── register.js         # Registration handler
├── styles.css          # All styles
├── vite.config.js      # Build configuration
├── package.json        # Dependencies
├── README.md           # Full documentation
└── DEPLOYMENT.md       # Deployment guide
```

## Features at a Glance

✅ **Calculator** - BMR, TDEE, macro targets  
✅ **Food Log** - Track daily intake  
✅ **Dashboard** - Real-time progress  
✅ **Charts** - Weekly visualization  
✅ **Weight Tracking** - Monitor changes  
✅ **PWA** - Install as app, works offline  
✅ **Multi-User** - Local authentication  
✅ **Dark Theme** - Retro terminal design  

## Tips & Tricks

### 1. Keyboard Shortcuts

- `Tab` - Navigate between fields
- `Enter` - Submit forms
- `Ctrl+Shift+I` - Open DevTools (to test PWA)

### 2. Mobile Usage

- Install as PWA for native app experience
- Works offline after first load
- Swipe to refresh

### 3. Data Backup

Your data is stored locally. To backup:

1. Open DevTools (F12)
2. Go to Application → Local Storage
3. Right-click → Export
4. Save the JSON file

To restore:

1. Open DevTools
2. Application → Local Storage
3. Paste your backup JSON

### 4. Multiple Users

Each user account is isolated:
- Separate food logs
- Independent calculations
- Individual progress tracking

## What's Next?

1. ✅ Complete the calculator with your info
2. ✅ Log your first meal
3. ✅ Track weight daily/weekly
4. ✅ Deploy to Vercel (if you want to access from anywhere)
5. 📖 Read DEPLOYMENT.md for deployment options
6. 📖 Read README.md for full documentation
7. 📖 Read CHANGELOG.md for all fixes and improvements

## Getting Help

- 📖 Read the full README.md
- 📖 Check DEPLOYMENT.md for deployment issues
- 🐛 Report bugs on GitHub Issues
- 💬 Ask questions in Discussions

## Demo Credentials

**Username:** demo  
**Password:** demo

Try it out before creating your own account!

## One-Line Deploy

```bash
# Install, build, and deploy to Vercel
npm install && npm run build && vercel --prod
```

---

**You're all set!** Start tracking your macros and achieving your fitness goals with MacroSnap 🎯

For more details, see [README.md](README.md) and [DEPLOYMENT.md](DEPLOYMENT.md).
