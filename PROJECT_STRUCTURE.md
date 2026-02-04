# MacroSnap Project Structure

## 📂 Directory Tree

```
macrosnap-vite/
│
├── 📄 index.html                    # Main application page
│   ├── → Session check (redirects to login if not authenticated)
│   └── → Imports /src/main.js
│
├── 📄 login.html                    # User login page
│   └── → Imports /src/login.js
│
├── 📄 register.html                 # User registration page
│   └── → Imports /src/register.js
│
├── 📁 src/                          # Source files (JavaScript & CSS)
│   │
│   ├── 📄 main.js                   # Main application logic
│   │   ├── User data management
│   │   ├── BMR/TDEE calculations
│   │   ├── Food logging
│   │   ├── Dashboard updates
│   │   ├── Progress tracking
│   │   ├── Chart.js integration
│   │   └── Profile management
│   │
│   ├── 📄 login.js                  # Login authentication
│   │   ├── User validation
│   │   ├── Session creation
│   │   └── Demo user setup
│   │
│   ├── 📄 register.js               # User registration
│   │   ├── Username validation
│   │   ├── User creation
│   │   └── localStorage management
│   │
│   └── 📄 style.css                 # Global styles
│       ├── CSS variables (colors, fonts)
│       ├── Retro terminal theme
│       ├── Responsive layouts
│       ├── Component styles
│       └── Login/register styles
│
├── 📁 public/                       # Static assets (copied to dist/)
│   │
│   ├── 📄 manifest.json             # PWA manifest
│   │   ├── App name & icons
│   │   ├── Display mode
│   │   └── Theme colors
│   │
│   └── 📄 sw.js                     # Service worker
│       ├── Cache management
│       ├── Offline support
│       └── Asset caching
│
├── 📄 vite.config.js                # Vite configuration
│   ├── Multi-page setup (index, login, register)
│   ├── Build options
│   └── Server configuration
│
├── 📄 package.json                  # Project dependencies
│   ├── Scripts (dev, build, preview)
│   ├── Dependencies (chart.js)
│   └── DevDependencies (vite)
│
├── 📄 vercel.json                   # Vercel deployment config
│   ├── Build command
│   ├── Output directory
│   ├── Routing rules
│   └── Headers (PWA, cache control)
│
├── 📄 .gitignore                    # Git ignore rules
│   ├── node_modules/
│   ├── dist/
│   └── Environment files
│
├── 📄 README.md                     # Project documentation
├── 📄 SETUP_GUIDE.md               # Comprehensive setup guide
├── 📄 QUICK_REFERENCE.md           # Quick reference card
└── 📄 PROJECT_STRUCTURE.md         # This file!
```

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         User Access                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Session Check   │
                    │  (index.html)    │
                    └──────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
        ┌─────────────┐           ┌─────────────┐
        │ Not Logged  │           │   Logged    │
        │     In      │           │     In      │
        └─────────────┘           └─────────────┘
                │                           │
                ▼                           ▼
        ┌─────────────┐           ┌─────────────┐
        │ login.html  │           │ index.html  │
        │             │           │  Main App   │
        │ + login.js  │           │  + main.js  │
        └─────────────┘           └─────────────┘
                │                           │
                │                           ▼
                │                   ┌──────────────┐
                │                   │ localStorage │
                │                   │  User Data   │
                │                   └──────────────┘
                │                           │
                └───────────────────────────┘
```

---

## 🎯 Component Interaction

```
┌─────────────────────────────────────────────────────────────┐
│                      Main App (main.js)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Calculator  │  │  Food Log   │  │  Dashboard  │         │
│  │             │  │             │  │             │         │
│  │ • BMR calc  │  │ • Add food  │  │ • Progress  │         │
│  │ • TDEE calc │  │ • USDA API  │  │ • Charts    │         │
│  │ • Macros    │  │ • Delete    │  │ • Macros    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│         │                 │                 │                │
│         └─────────────────┴─────────────────┘                │
│                           │                                  │
│                           ▼                                  │
│                  ┌─────────────────┐                         │
│                  │  localStorage   │                         │
│                  │  ┌───────────┐  │                         │
│                  │  │  userData │  │                         │
│                  │  │  foodLog  │  │                         │
│                  │  │ weightLog │  │                         │
│                  │  │calculationResults│                    │
│                  │  └───────────┘  │                         │
│                  └─────────────────┘                         │
│                           │                                  │
│                           ▼                                  │
│                  ┌─────────────────┐                         │
│                  │   Progress Tab  │                         │
│                  │                 │                         │
│                  │  • Chart.js     │                         │
│                  │  • 7-day avg    │                         │
│                  │  • Weight log   │                         │
│                  └─────────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ localStorage Schema

```javascript
{
  // Session management
  "macrosnap_session": "username",
  
  // User database
  "macrosnap_users": {
    "username1": {
      "password": "hashed_password",
      "data": {
        "userData": {
          "age": 25,
          "sex": "male",
          "weight_kg": 70,
          "height_cm": 175,
          "activity": 1.55,
          "goal": "loss"
        },
        "calculationResults": {
          "bmr": 1650,
          "tdee": 2558,
          "target": 2046,
          "macros": {
            "protein": 126,
            "fat": 57,
            "carbs": 256
          }
        },
        "foodLog": [
          {
            "id": 1675432123456,
            "date": "2026-02-03",
            "name": "Chicken Breast",
            "serving": 100,
            "calories": 165,
            "protein": 31,
            "fat": 3.6,
            "carbs": 0
          }
        ],
        "weightLog": [
          {
            "date": "2026-02-03",
            "weight": 70.5
          }
        ]
      }
    },
    "demo": {
      "password": "demo",
      "data": {}
    }
  }
}
```

---

## 🔀 Build Process

```
┌─────────────────────────────────────────────────────────────┐
│                    npm run build                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   Vite Process   │
                    └──────────────────┘
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
            ▼                 ▼                 ▼
    ┌─────────────┐   ┌─────────────┐  ┌─────────────┐
    │ HTML files  │   │  JS modules │  │  CSS files  │
    │             │   │             │  │             │
    │ • index     │   │ • Bundled   │  │ • Minified  │
    │ • login     │   │ • Minified  │  │ • Prefixed  │
    │ • register  │   │ • Tree-shaken│ │ • Optimized │
    └─────────────┘   └─────────────┘  └─────────────┘
            │                 │                 │
            └─────────────────┼─────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   dist/ folder   │
                    │                  │
                    │ Ready to deploy! │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │     Vercel       │
                    │                  │
                    │  your-app.vercel.app │
                    └──────────────────┘
```

---

## 🎨 Style Organization

```
style.css
├── CSS Variables
│   ├── Colors (bg, surface, accent, text)
│   ├── Fonts (mono, display)
│   └── Spacing
│
├── Base Styles
│   ├── * (reset)
│   ├── body
│   └── Scan line effect
│
├── Layout Components
│   ├── .container
│   ├── header
│   ├── .nav-tabs
│   └── .grid
│
├── UI Components
│   ├── .panel
│   ├── .btn
│   ├── input, select
│   ├── .metric
│   ├── .progress-bar
│   └── .food-log-entry
│
├── Specialized Components
│   ├── .unit-toggle
│   ├── .macro-breakdown
│   ├── .chart-container
│   └── .terminal-output
│
├── Responsive Styles
│   └── @media (max-width: 900px)
│
└── Login/Register Styles
    ├── .login-container
    ├── .login-error
    └── .switch-link
```

---

## 🔌 Module Dependencies

```
main.js
├── chart.js (npm package)
│   └── Used for progress charts
├── style.css
│   └── Global styles
└── localStorage API
    └── Data persistence

login.js
├── style.css
│   └── Login styles
└── localStorage API
    └── User authentication

register.js
├── style.css
│   └── Register styles
└── localStorage API
    └── User creation
```

---

## 🌐 Page Routing

```
URL Structure:
├── / or /index.html          → Main app (requires auth)
├── /login.html               → Login page
├── /register.html            → Registration page
└── /login.html?registered=1  → Login with success message

Vercel Routing (vercel.json):
└── rewrites: "/(.*)" → "/$1"  (SPA-style routing)
```

---

## 🔒 Authentication Flow

```
1. User visits /
   ↓
2. Check localStorage['macrosnap_session']
   ↓
3a. Session exists → Load main app
   ↓
3b. No session → Redirect to /login.html
   ↓
4. User logs in → Set session → Redirect to /
   ↓
5. User logs out → Remove session → Redirect to /login.html
```

---

## 📦 Build Output (dist/)

```
dist/
├── index.html           (processed)
├── login.html           (processed)
├── register.html        (processed)
├── assets/
│   ├── index-[hash].js      (bundled main.js)
│   ├── login-[hash].js      (bundled login.js)
│   ├── register-[hash].js   (bundled register.js)
│   └── index-[hash].css     (bundled style.css)
├── manifest.json
└── sw.js
```

---

This structure provides:
- ✅ Clean separation of concerns
- ✅ Modular architecture
- ✅ Easy maintenance
- ✅ Scalable design
- ✅ Production-ready build

**Understanding this structure helps you:**
- Navigate the codebase efficiently
- Add new features correctly
- Debug issues faster
- Deploy with confidence
