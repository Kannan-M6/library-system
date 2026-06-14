# 🚀 Frontend Setup & Running Guide

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Backend running on `http://localhost:5000`

## Installation

```bash
cd frontend
npm install
```

## Environment Setup (Optional)

Create `.env` file in `frontend/` directory:

```
REACT_APP_API_URL=http://localhost:5000/api
```

Default is `http://localhost:5000/api`

## Running the Frontend

```bash
npm start
```

The app will open at `http://localhost:3000`

## Building for Production

```bash
npm run build
```

Creates optimized production build in `build/` folder

## 🎨 Design Highlights

### Color Scheme
- **Night Sky**: Deep blues, purples, and navy
- **Accents**: Pastel rose, pink, emerald
- **Text**: White, purple-200 for readability
- **Backgrounds**: Slate-800 with transparency

### Components
- **NightSkyBackground.js**: Canvas-based animated starfield with moon and shooting stars
- **LoginPage.js**: Beautiful authentication with role selector
- **LandingPage.js**: Hero landing with feature showcase
- **Layout.js**: Shared navigation and structure

### Animations
- 🌙 Blooming moon effect
- ✨ Flickering stars throughout the night sky
- 🌠 Shooting stars with particle trails
- 💫 Smooth transitions and hover effects
- 🎯 Focus animations on inputs

## 📚 Key Features

✅ **Authentication**: JWT-based with role-based access (Librarian, Student, Staff)
✅ **Responsive**: Mobile-first design that works on all devices
✅ **Beautiful UI**: Glass morphism, gradients, and smooth animations
✅ **API Integration**: Connected to Flask backend
✅ **State Management**: React Context for global auth state
✅ **Error Handling**: Toast notifications with react-hot-toast

## 🎮 Quick Test

### Login Credentials

**Librarian** (Full Access):
- Email: `librarian@library.edu`
- Password: `lib@1234`

**Student** (Limited Access):
- Email: `arjun@student.edu`
- Password: `student@123`

**Staff** (Mixed Access):
- Email: `suresh@staff.edu`
- Password: `staff@123`

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html          # Updated with pastel theme
├── src/
│   ├── pages/
│   │   ├── LoginPage.js         ✅ Beautiful login with animations
│   │   ├── LandingPage.js        ✅ Hero landing page
│   │   ├── StudentDashboard.js  ⏳ Student portal
│   │   ├── LibrarianDashboard.js ⏳ Admin portal
│   │   ├── BooksPage.js         ⏳ Book management
│   │   ├── TransactionsPage.js  ⏳ Transaction history
│   │   ├── ChatbotPage.js       ⏳ AI chatbot
│   │   ├── CameraPage.js        ⏳ Barcode scanner
│   │   └── RegisterPage.js      ⏳ User registration
│   ├── components/
│   │   ├── NightSkyBackground.js ✅ Canvas starfield
│   │   ├── Layout.js             ⏳ Navigation layout
│   │   ├── Sidebar.js            ⏳ Dashboard sidebar
│   │   └── BookCard.js           ⏳ Book card component
│   ├── context/
│   │   └── AuthContext.js        ✅ Auth state management
│   ├── api/
│   │   └── client.js             ✅ API client with interceptors
│   ├── App.js                    ✅ Main app with routing
│   ├── index.js                  ✅ React entry point
│   └── index.css                 ✅ Global styles with animations
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## 🎨 Customization

### Colors
Edit `src/index.css` to modify color scheme:
```css
/* Change primary color */
.btn-primary {
  @apply bg-gradient-to-r from-your-color-400 to-your-color-500 ...
}
```

### Animations
Edit `src/components/NightSkyBackground.js` to customize:
- Star count (line 35)
- Shooting star frequency (line 98)
- Moon size (line 85)
- Animation speed (various requestAnimationFrame calls)

### Fonts
Change fonts in `public/index.html`:
```html
<!-- Currently using: Poppins, Playfair Display, Space Mono -->
```

## 🐛 Troubleshooting

### Port 3000 already in use?
```bash
npm start -- --port 3001
```

### Backend connection error?
1. Verify backend is running on `http://localhost:5000`
2. Check `.env` file has correct API URL
3. Check CORS settings in backend

### Styles not loading?
```bash
npm run build
# or
npm start -- --reset-cache
```

## 📦 Dependencies

- **react**: 18.3.1 - UI library
- **react-dom**: 18.3.1 - DOM rendering
- **react-router-dom**: 6.24.0 - Client-side routing
- **axios**: 1.7.2 - HTTP client
- **react-hot-toast**: 2.4.1 - Toast notifications
- **lucide-react**: 0.400.0 - Beautiful icons
- **date-fns**: 3.6.0 - Date utilities
- **tailwindcss**: 3.4.4 - CSS framework
- **react-scripts**: 5.0.1 - Build scripts

## 🚢 Deployment

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy the 'build' folder
```

### Docker
```bash
docker build -t library-frontend .
docker run -p 3000:3000 library-frontend
```

## 💡 Tips

- Use browser DevTools to inspect animations
- Check Console for API errors
- Use Network tab to debug API calls
- Clear localStorage if auth issues occur

## ✨ What's Included

✅ Fully responsive beautiful UI
✅ Working authentication
✅ Night sky animations
✅ Pastel color scheme
✅ Glass morphism design
✅ API integration
✅ Error handling
✅ Toast notifications
✅ Protected routes
✅ Role-based access control

---

**Ready to build something amazing! 🚀**
