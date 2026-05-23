# 🥑 MacroSnap — Premium Nutrition Tracker

> **Your Complete Full-Stack Health & Fitness Dashboard**

![Live](https://img.shields.io/badge/Live-Vercel-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple) ![Node](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen) ![Free](https://img.shields.io/badge/Cost-Free-green)

**🌐 Live Site → [https://calories-burn.vercel.app](https://calories-burn.vercel.app)**

## 📖 About

MacroSnap is a meticulously crafted full-stack web application designed to help fitness enthusiasts and health-conscious individuals take control of their diet. Tracking daily caloric intake, macronutrient distribution, hydration levels, and weight progression is often tedious; this platform simplifies it through an intuitive, beautifully designed interface. What makes MacroSnap special is its seamless integration of a modern frontend with a robust, secure backend, providing a premium tracking experience completely for free.

## ✨ Features

| Feature | Description |
| :--- | :--- |
| 🏠 **Smart Dashboard** | Daily overview of your remaining calories, macros, and progress. |
| 🥗 **Food Logging** | Log breakfast, lunch, dinner, and snacks with precise macro breakdowns. |
| 💧 **Hydration Tracker** | Interactive water logging to ensure you hit your daily fluid goals. |
| 📈 **Weight Tracking** | Monitor your weight fluctuations and long-term progress trends. |
| 👤 **User Profiles** | Personalized profiles calculating BMR, TDEE, and custom macro targets. |
| 🔐 **Secure Authentication** | Encrypted passwords and JWT-based session management. |
| 🎨 **Premium UI/UX** | Glassmorphism-inspired design with smooth Framer Motion animations. |

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18 + Vite |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (Mongoose ORM) |
| **Hosting** | Vercel (Static Frontend + Serverless Backend) |
| **Styling** | Custom Vanilla CSS (Glassmorphism & Variables) |
| **State Mgt** | Zustand |
| **Animations** | Framer Motion |

## 📂 Project Structure

```text
MacroSnap/
├── api/
│   └── index.js       ← Serverless function entry point for Vercel
├── client/
│   ├── public/        ← Static assets
│   └── src/           ← React app (components, pages, services)
├── server/
│   ├── config/        ← Database connection logic
│   ├── middleware/    ← Auth & error handling middlewares
│   ├── models/        ← Mongoose schemas (User, FoodEntry, etc.)
│   └── routes/        ← Express API endpoints
├── vercel.json        ← Deployment configuration
└── package.json       ← Root workspace & concurrent scripts
```

## 🔐 Database & Security

- **Authentication:** Handled via JSON Web Tokens (JWT) stored securely.
- **Passwords:** Encrypted using bcrypt before being saved to the database.
- **Environment Variables:** Sensitive data (`MONGODB_URI`, `JWT_SECRET`) is strictly stored in Vercel environment variables.
- **Safe Commits:** The `server/.env` file is gitignored and never committed to GitHub.

## 💻 Local Development

Follow these steps to run the project locally:

```bash
git clone https://github.com/Tushar-Jain07/Calorie-Tracker.git
cd Calorie-Tracker

# Install dependencies for root, client, and server
npm run install:all

# Setup Environment Variables
# Create server/.env and copy the following:
```
*(Add your `MONGODB_URI` and `JWT_SECRET` to `server/.env`)*

```bash
# Start both frontend and backend concurrently
npm run dev
```
*(Open `http://localhost:5173` in your browser)*

## 🚀 Live Demo

### 👉 **[https://calories-burn.vercel.app](https://calories-burn.vercel.app)**

The site is live, fully functional, and ready to use. 

## ⚠️ Disclaimer

<small>MacroSnap is a personal health tracking tool. The calculations for BMR, TDEE, and macronutrient targets are estimates based on standard formulas. Always consult with a certified nutritionist or healthcare provider before making significant changes to your diet or fitness routine.</small>

---
Made with ❤️ for a healthier lifestyle.
