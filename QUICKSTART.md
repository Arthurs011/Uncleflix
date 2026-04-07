# 🚀 UncleFlix - Quick Start Guide

## Installation & Running

```bash
# 1. Install all dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
http://localhost:5173/
```

## 🎯 Testing the Streaming Feature

### Step 1: Browse Content

1. Home page auto-loads trending content in hero
2. Scroll down to see rows:
   - Trending Movies
   - Popular Movies
   - Top Rated Movies
   - Trending TV Shows
   - Popular TV Shows
   - Top Rated TV
   - Recently Viewed (initially empty)

### Step 2: Click a Movie/TV Show

- Click any card to go to the **Watch page**
- URL format: `/watch/movie/550` or `/watch/tv/1399`
- Item automatically added to **Recently Viewed**

### Step 3: Test the Player

#### For Movies:
- Click "Play" → loads full movie via vsembed.ru
- Click "Trailer" → loads YouTube trailer
- Use the embed URL shown in **DEBUG INFO** (top of player)

#### For TV Shows:
1. Select a **Season** from dropdown
2. Select an **Episode** from grid
3. Player updates automatically

### Step 4: If Player is Blank

1. **Check debug info** (yellow panel at top of player)
   - Shows the exact TMDB ID
   - Shows the full embed URL

2. **Copy the embed URL** and paste in a new browser tab
   - If it loads → your browser is blocking it in iframe
   - If blank → vsembed.ru might be blocked or down

3. **Disable ad blocker** (most common fix)
   - Brave users: Turn off Shields
   - Chrome/Firefox: Disable extensions temporarily
   - Or use Incognito mode

4. **Try alternative domains** (click links if error appears)
   - vsembed.su (backup)
   - vidsrc.to (legacy)
   - vidsrc.me (legacy)

### Step 5: Test My List

1. On Watch page, click **+** icon (top-right of poster)
2. Navigate to **My List** in navbar
3. Item should appear with ability to remove

### Step 6: Test Search

1. Click **Search** in navbar
2. Type "Breaking Bad"
3. Results appear debounced after 500ms
4. Both movies and TV shows mixed

## 📱 Key Routes

| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/movies` | Movies only |
| `/tv` | TV shows only |
| `/search` | Search page |
| `/watch/movie/:id` | Movie player |
| `/watch/tv/:id` | TV series player |
| `/my-list` | Watchlist page |

## 📲 PWA Installation (Android/iOS)

### Before Installing
1. Generate icons (one-time):
   ```bash
   npm run generate-icons
   ```
   Or use online generator (see MOBILE-OPTIMIZATION.md)

2. Deploy to HTTPS hosting (Vercel, Netlify, etc.)
   - PWA requires HTTPS (except localhost)

### Install on Android
1. Open app in Chrome
2. Tap Chrome menu (⋮)
3. Tap "Add to Home screen"
4. App launches in standalone mode

### Install on iOS
1. Open in Safari
2. Tap Share button (□↑)
3. Tap "Add to Home Screen"
4. App icon added to home screen

### Verify PWA
- Open DevTools → Application → Manifest
- Service Worker should be "activated"
- App runs without browser URL bar

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Blank video player | 1. Disable ad blocker 2. Try incognito |
| "Content not found" | Invalid TMDB ID, refresh page |
| No images loading | Check internet connection, TMDB API key |
| 404 on routes | Ensure React Router is working |
| Styles broken | Tailwind CSS not compiled, restart dev server |
| RecentlyViewed not saving | localStorage enabled (check privacy mode) |

## 🔧 Developer Tools

### Console Debug Output

Player logs:
```
[UncleFlix] Loading movie with ID: 550, mode: full
[UncleFlix] Embed URL: https://vsembed.ru/embed/movie/550
[UncleFlix] iframe loaded successfully
```

### localStorage Inspection

In DevTools Console:
```javascript
// View recently viewed
JSON.parse(localStorage.getItem('uncleflix_recent'))

// View watchlist
JSON.parse(localStorage.getItem('uncleflix_watchlist'))

// Clear data
localStorage.clear()
```

## 🎨 Customization

### Change Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#0B0F1A',   // Background
  secondary: '#121826', // Cards
  accent: '#3B82F6',    // Highlights
  glow: '#22D3EE',      // Neon effect
}
```

### Change API

Edit `src/utils/tmdb.js`:
```javascript
const API_KEY = 'YOUR_TMDB_API_KEY';
```

Get free API key: https://www.themoviedb.org/settings/api

### Add More Rows

Edit `src/pages/Home.jsx`:
```jsx
// Add after existing rows
<Row title="Upcoming Movies" items={movies.upcoming} type="movie" />
```

Fetch data in `fetchData()` function.

## 📦 Build for Production

```bash
# Create optimized production build
npm run build

# Output in dist/ folder
ls -la dist/

# Preview locally (production-like)
npm run preview
```

### Deployment Checklist

- [ ] Build succeeds (`npm run build`)
- [ ] Preview works (`npm run preview`)
- [ ] API key is valid
- [ ] All routes work (test /watch/movie/550)
- [ ] Images load correctly
- [ ] Player loads (test with ad blocker off)
- [ ] localStorage works (test recently viewed)

## 🆘 Need Help?

1. **Check README.md** - Full documentation
2. **Check browser console** - Look for errors
3. **Test direct URL** - Copy embed URL from debug panel
4. **Disable extensions** - Especially ad blockers
5. **Try incognito** - Rules out extension conflicts

## 📊 Features Overview

| Feature | Status | Loc/Ref |
|---------|--------|---------|
| Dark blue theme | ✅ | tailwind.config.js |
| Movies + TV | ✅ | Card.jsx, Row.jsx |
| Hero banner | ✅ | HeroBanner.jsx |
| Horizontal rows | ✅ | Row.jsx |
| Search (debounced) | ✅ | Search.jsx |
| Recently viewed | ✅ | useLocalStorage.js |
| Watchlist | ✅ | useLocalStorage.js |
| Player (iframe) | ✅ | Watch.jsx |
| TV seasons/episodes | ✅ | SeasonSelector.jsx |
- Multiple VidSrc domains | ✅ | Watch.jsx |
| Debug panel | ✅ | Watch.jsx (DEV mode) |
- Glassmorphism | ✅ | index.css |
- Neon glow | ✅ | index.css |

---

**Happy streaming!** 🎬
