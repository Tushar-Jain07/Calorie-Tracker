# MacroSnap Vite - Complete Setup & Deployment Guide

## 📋 What Was Fixed

### Original Issues:
1. ❌ No build system - just raw HTML/CSS/JS files
2. ❌ External CDN dependencies (Chart.js from CDN)
3. ❌ Inline onclick handlers in HTML
4. ❌ Global scope pollution
5. ❌ No module system
6. ❌ Hard to maintain and deploy
7. ❌ Service worker path issues

### What's Fixed:
1. ✅ Modern Vite build system with HMR
2. ✅ npm package management (Chart.js as dependency)
3. ✅ Event listeners in JavaScript modules
4. ✅ Proper module scoping
5. ✅ ES6 module system
6. ✅ Optimized production builds
7. ✅ Proper asset handling

---

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies

```bash
cd macrosnap-vite
npm install
```

This installs:
- `vite` - Build tool and dev server
- `chart.js` - Charting library

### Step 2: Run Development Server

```bash
npm run dev
```

Opens at `http://localhost:3000` with hot reload!

### Step 3: Build for Production

```bash
npm run build
```

Creates optimized build in `dist/` folder.

---

## 📦 Deploy to Vercel (2 Methods)

### Method 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to project
cd macrosnap-vite

# Deploy (first time)
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? macrosnap (or your choice)
# - Directory? ./ (just press Enter)
# - Override settings? No

# Your app is now live! 🎉
```

For subsequent deployments:
```bash
vercel --prod
```

### Method 2: GitHub + Vercel Dashboard

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - MacroSnap Vite"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/macrosnap.git
   git push -u origin main
   ```

2. **Deploy via Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Vite
   - Click "Deploy"
   - Done! Your app is live 🚀

---

## 🔧 Configuration Files Explained

### `package.json`
```json
{
  "scripts": {
    "dev": "vite",           // Development server with HMR
    "build": "vite build",   // Production build
    "preview": "vite preview" // Preview production build locally
  },
  "devDependencies": {
    "vite": "^5.0.0"         // Build tool
  },
  "dependencies": {
    "chart.js": "^4.4.1"     // Charting library
  }
}
```

### `vite.config.js`
```javascript
{
  build: {
    rollupOptions: {
      input: {
        main: './index.html',      // Main app
        login: './login.html',     // Login page
        register: './register.html' // Register page
      }
    }
  }
}
```

### `vercel.json`
```json
{
  "buildCommand": "npm run build",  // Build command
  "outputDirectory": "dist",        // Build output
  "framework": "vite"               // Auto-detected framework
}
```

---

## 📁 Project Structure

```
macrosnap-vite/
│
├── index.html              # Main app (with session check)
├── login.html              # Login page
├── register.html           # Registration page
│
├── src/                    # JavaScript modules
│   ├── main.js            # Main app logic (calculator, food log, etc.)
│   ├── login.js           # Login authentication
│   ├── register.js        # User registration
│   └── style.css          # Global styles (retro terminal theme)
│
├── public/                 # Static assets
│   ├── manifest.json      # PWA manifest
│   └── sw.js              # Service worker
│
├── vite.config.js         # Vite configuration
├── package.json           # Dependencies & scripts
├── vercel.json            # Vercel deployment config
├── .gitignore             # Git ignore rules
└── README.md              # Documentation
```

---

## ✨ Key Features

### 1. **BMR & TDEE Calculator**
- Mifflin-St Jeor equation
- Activity level multipliers
- Goal-based calorie targets (loss/maintenance/gain)
- Automatic macro calculations

### 2. **Food Logging**
- Manual food entry
- USDA API integration (optional)
- Auto-fill from food database
- Daily calorie/macro tracking

### 3. **Dashboard**
- Real-time progress tracking
- Visual progress bars
- Macro breakdown charts
- Calorie remaining display

### 4. **Progress Tracking**
- 7-day average calculations
- Compliance percentage
- Weight log history
- Interactive Chart.js visualizations

### 5. **User Management**
- Local multi-user support
- Secure profile data
- Demo account (username: demo, password: demo)

---

## 🔑 Optional: USDA API Integration

### Get API Key (Free)
1. Visit: https://fdc.nal.usda.gov/fdc-app.html#/api-key
2. Sign up for a free account
3. Copy your API key

### Add to Project
In `index.html`, add this before `<script type="module" src="/src/main.js"></script>`:

```html
<script>
  window.USDA_API_KEY = 'YOUR_API_KEY_HERE';
</script>
```

**Note**: The app works perfectly without the API key - users can still manually enter food data. The API just enables autocomplete suggestions.

---

## 🧪 Testing Your Build

### Test Locally
```bash
# Build
npm run build

# Preview production build
npm run preview
```

### Test on Mobile
1. Start dev server: `npm run dev`
2. Get your local IP: `ifconfig` (Mac/Linux) or `ipconfig` (Windows)
3. On phone, visit: `http://YOUR_IP:3000`

---

## 🐛 Common Issues & Solutions

### Issue 1: "Module not found: chart.js"
**Solution**: Run `npm install`

### Issue 2: Service worker not working
**Solution**: Service workers require HTTPS (except localhost). Deploy to Vercel or use `npm run dev`.

### Issue 3: Food autocomplete not working
**Solution**: Add USDA API key to `index.html` (see section above).

### Issue 4: Build fails
**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue 5: Vercel deployment fails
**Solution**: Make sure `vercel.json` is in root directory and `npm run build` works locally first.

---

## 📊 Performance Optimizations

Vite automatically provides:
- ⚡ Code splitting
- 🗜️ Minification
- 🎯 Tree shaking
- 📦 Asset optimization
- 🔄 Lazy loading

Production build is typically **70-80% smaller** than development!

---

## 🔄 Update Workflow

### Local Changes
```bash
# Make your changes to src/ files
npm run dev    # Test locally
npm run build  # Build for production
```

### Deploy Updates
```bash
# Method 1: Vercel CLI
vercel --prod

# Method 2: Git push (if connected to Vercel)
git add .
git commit -m "Update description"
git push
# Vercel auto-deploys on push!
```

---

## 🎨 Customization Guide

### Change Theme Colors
Edit `src/style.css`:
```css
:root {
    --bg: #0a0a0a;        /* Background */
    --surface: #181818;    /* Panels */
    --accent: #00e600;     /* Primary color */
    --text: #f5f5f5;       /* Text */
}
```

### Add New Features
1. Edit `src/main.js` for app logic
2. Edit `index.html` for UI structure
3. Run `npm run dev` to test
4. Run `npm run build` when ready
5. Deploy: `vercel --prod`

---

## 📈 Production Checklist

Before deploying:
- [ ] Test all features locally (`npm run dev`)
- [ ] Test production build (`npm run build && npm run preview`)
- [ ] Remove any console.logs
- [ ] Test on mobile devices
- [ ] Add USDA API key (if using)
- [ ] Update README with your info
- [ ] Test authentication flow
- [ ] Verify charts display correctly
- [ ] Check PWA manifest
- [ ] Test offline functionality

---

## 🎯 What Makes This Better?

### Before (Old Version):
- No build process
- Manual script tags in HTML
- Global scope pollution
- Hard to maintain
- Slow load times
- Large bundle size

### After (Vite Version):
- Modern build system
- ES6 modules
- Proper scoping
- Easy to maintain
- Fast load times with HMR
- Optimized bundles

---

## 🚨 Important Notes

1. **LocalStorage**: All data stored locally in browser. Clearing browser data = losing all user data.
2. **Security**: This is a client-side only app. For production use, consider adding a backend.
3. **USDA API**: Rate limited. Consider caching results for better UX.
4. **PWA**: Service worker requires HTTPS in production.

---

## 🎓 Learning Resources

- [Vite Documentation](https://vitejs.dev/)
- [Chart.js Documentation](https://www.chartjs.org/)
- [Vercel Documentation](https://vercel.com/docs)
- [PWA Guide](https://web.dev/progressive-web-apps/)

---

## 💡 Next Steps

1. **Deploy**: Get it live on Vercel
2. **Test**: Try all features in production
3. **Share**: Send the link to friends/testers
4. **Iterate**: Gather feedback and improve
5. **Monitor**: Check Vercel Analytics for usage

---

## 🆘 Need Help?

If you encounter issues:
1. Check the console for errors (F12 in browser)
2. Review this guide
3. Check Vercel deployment logs
4. Ensure all dependencies are installed
5. Try the troubleshooting section above

---

## 🎉 You're All Set!

Your MacroSnap app is now production-ready with:
- ✅ Modern build system
- ✅ Optimized performance
- ✅ Easy deployment
- ✅ Professional structure
- ✅ Maintainable codebase

**Happy tracking! 💪📊**
