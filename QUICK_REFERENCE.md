# MacroSnap - Quick Reference Card

## 🚀 Common Commands

### Development
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:3000)
npm run build        # Build for production
npm run preview      # Preview production build
```

### Deployment (Vercel)
```bash
npm install -g vercel    # Install Vercel CLI (one time)
vercel                   # Deploy to preview
vercel --prod            # Deploy to production
```

### Git Workflow
```bash
git init
git add .
git commit -m "message"
git push
```

## 📁 File Structure

```
index.html          → Main app
login.html          → Login page
register.html       → Register page
src/main.js         → App logic
src/login.js        → Login logic
src/register.js     → Register logic
src/style.css       → Styles
public/             → Static files
```

## 🔑 Demo Account

- Username: `demo`
- Password: `demo`

## 🌐 Vercel URLs

- Production: `your-app.vercel.app`
- Preview: `your-app-hash.vercel.app`

## 🎨 Main Features

1. **Calculator Tab**
   - Enter age, sex, height, weight
   - Select activity level & goal
   - Click "CALCULATE"
   - View BMR, TDEE, Target, Macros

2. **Food Log Tab**
   - Enter food name
   - Add serving size & macros
   - Click "ADD TO LOG"
   - View today's entries

3. **Dashboard Tab**
   - View calorie progress
   - Track macro consumption
   - Monitor daily targets

4. **Progress Tab**
   - 7-day averages
   - Compliance percentage
   - Weight tracking
   - Visual charts

## 🔧 Quick Fixes

### Charts not showing?
```bash
npm install chart.js
```

### Service worker errors?
Deploy to HTTPS (Vercel) or use localhost

### Food autocomplete not working?
Add USDA API key to index.html:
```html
<script>
  window.USDA_API_KEY = 'YOUR_KEY';
</script>
```

### Build errors?
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📊 Tech Stack

- **Vite** - Build tool
- **Chart.js** - Charts
- **LocalStorage** - Data storage
- **Service Worker** - Offline support
- **Vanilla JS** - No framework

## 🎯 Deployment Checklist

- [ ] `npm install` completed
- [ ] `npm run build` works
- [ ] Tested locally with `npm run dev`
- [ ] USDA API key added (optional)
- [ ] Git repository created
- [ ] Vercel account ready
- [ ] Deploy with `vercel --prod`

## 💡 Pro Tips

1. **Data Persistence**: Uses localStorage - data stays in browser
2. **Multi-user**: Each username has separate data
3. **PWA**: Can be installed as app on mobile
4. **Offline**: Works without internet after first load
5. **Responsive**: Works on all screen sizes

## 🐛 Common Errors

| Error | Solution |
|-------|----------|
| "Module not found: chart.js" | Run `npm install` |
| "Cannot find module './style.css'" | Check file paths |
| Service worker not registering | Use HTTPS or localhost |
| Vercel build fails | Check `vercel.json` exists |
| Charts blank | Make sure Chart.js imported |

## 📞 Support

Need help? Check:
1. SETUP_GUIDE.md (detailed guide)
2. README.md (project overview)
3. Console errors (F12 in browser)
4. Vercel deployment logs

---

**Quick Start**: `npm install` → `npm run dev` → `vercel --prod`

**That's it! You're ready to track macros! 💪**
