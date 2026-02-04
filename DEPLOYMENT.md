# Deployment Guide

This guide covers deploying MacroSnap to Vercel and other platforms.

## Vercel Deployment (Recommended)

Vercel provides the best experience for Vite apps with automatic builds, CDN, and HTTPS.

### Method 1: GitHub Integration (Easiest)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click **"New Project"**
   - Import your GitHub repository
   - Vercel will auto-detect the Vite framework
   - Click **"Deploy"**
   - Done! Your app is live 🎉

3. **Automatic Updates**
   - Every push to `main` branch triggers automatic deployment
   - Preview deployments for pull requests
   - Instant rollbacks available

### Method 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # First deployment (follow prompts)
   vercel
   
   # Deploy to production
   vercel --prod
   ```

4. **Configuration**
   The `vercel.json` file is already configured with:
   - SPA routing (all routes → index.html)
   - Security headers
   - Cache optimization
   - PWA support

### Environment Variables (Optional)

If you want to add the USDA API key as an environment variable:

1. In Vercel dashboard, go to **Settings** → **Environment Variables**
2. Add: `VITE_USDA_API_KEY` = `your-api-key`
3. Update `index.html` to use:
   ```html
   <script>
       window.USDA_API_KEY = import.meta.env.VITE_USDA_API_KEY || '';
   </script>
   ```

## Netlify Deployment

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Build the app**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod --dir=dist
   ```

4. **Or use Netlify UI**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder
   - Or connect your GitHub repo

### netlify.toml (Optional)

Create a `netlify.toml` file:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## GitHub Pages Deployment

1. **Install gh-pages**
   ```bash
   npm i -D gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/macrosnap"
   }
   ```

3. **Update vite.config.js**
   ```javascript
   export default defineConfig({
     base: '/macrosnap/', // Your repo name
     // ... rest of config
   });
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**
   - Go to repository **Settings** → **Pages**
   - Select `gh-pages` branch
   - Save

## Cloudflare Pages

1. **Connect GitHub Repository**
   - Go to [pages.cloudflare.com](https://pages.cloudflare.com)
   - Connect your GitHub repo

2. **Build Settings**
   - Framework: Vite
   - Build command: `npm run build`
   - Build output: `dist`

3. **Deploy**
   - Click **"Save and Deploy"**
   - Automatic deployments on push

## Railway

1. **Create account** at [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub**
3. Select your repository
4. Railway auto-detects Node.js/Vite
5. Deploy! 🚀

## Self-Hosting (VPS/Server)

### Using Nginx

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Copy dist folder to server**
   ```bash
   scp -r dist/* user@server:/var/www/macrosnap/
   ```

3. **Nginx configuration** (`/etc/nginx/sites-available/macrosnap`)
   ```nginx
   server {
       listen 80;
       server_name macrosnap.yourdomain.com;
       root /var/www/macrosnap;
       index index.html;

       # Security headers
       add_header X-Frame-Options "DENY" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header X-XSS-Protection "1; mode=block" always;

       # SPA routing
       location / {
           try_files $uri $uri/ /index.html;
       }

       # Cache static assets
       location /assets/ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

4. **Enable site and restart Nginx**
   ```bash
   sudo ln -s /etc/nginx/sites-available/macrosnap /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **Setup SSL with Let's Encrypt**
   ```bash
   sudo certbot --nginx -d macrosnap.yourdomain.com
   ```

## Docker Deployment

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Build and run:

```bash
docker build -t macrosnap .
docker run -p 8080:80 macrosnap
```

## Post-Deployment Checklist

- [ ] Test all routes (login, register, dashboard, etc.)
- [ ] Verify PWA installation works
- [ ] Test offline functionality
- [ ] Check responsive design on mobile
- [ ] Verify USDA API (if configured)
- [ ] Test localStorage persistence
- [ ] Check security headers (use [securityheaders.com](https://securityheaders.com))
- [ ] Setup monitoring/analytics (optional)
- [ ] Configure custom domain (if applicable)
- [ ] Setup SSL/HTTPS
- [ ] Test performance (Lighthouse audit)

## Performance Tips

1. **Enable gzip/brotli compression** (most platforms do this automatically)
2. **Use CDN** (Vercel/Netlify include this)
3. **Optimize images** (already using CDN for icons)
4. **Monitor bundle size** (`npm run build -- --report`)
5. **Consider code splitting** for larger apps

## Monitoring

### Vercel Analytics
```bash
npm i @vercel/analytics
```

Add to `main.js`:
```javascript
import { inject } from '@vercel/analytics';
inject();
```

### Google Analytics

Add to `index.html` `<head>`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Troubleshooting

### Issue: Routes not working (404 on refresh)

**Solution:** Ensure SPA routing is configured (see platform-specific configs above)

### Issue: PWA not installing

**Solution:** 
- Check HTTPS is enabled
- Verify `manifest.json` is accessible
- Check service worker registration in browser DevTools

### Issue: Build fails on deployment

**Solution:**
- Check Node.js version (should be 16+)
- Verify `package-lock.json` is committed
- Check build logs for specific errors

### Issue: Environment variables not working

**Solution:**
- Prefix with `VITE_` for Vite to expose them
- Rebuild after adding new variables
- Check platform-specific env var syntax

## Need Help?

- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Netlify: [docs.netlify.com](https://docs.netlify.com)
- Vite: [vitejs.dev](https://vitejs.dev)
- PWA: [web.dev/progressive-web-apps](https://web.dev/progressive-web-apps/)

---

Happy deploying! 🚀
