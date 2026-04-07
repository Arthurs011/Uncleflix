# 🎬 UncleFlix

A Netflix-style streaming platform with YouTube-style discovery, featuring a unique dark blue cinematic UI. Supports both Movies and TV Series with advanced player features.

## ✨ Features

- **Dual Content Support** - Movies & TV Series
- **TMDB Integration** - Trending, Popular, Top Rated
- **Dynamic Hero Banner** - Featured content with backdrop
- **Smart Search** - Debounced multi-type search (movies + TV)
- **Recently Viewed** - localStorage tracking (max 10 items)
- **My List / Watchlist** - Save favorites for later
- **TV Series Player** - Season & Episode selectors
- **Multiple Streaming Sources**:
  - YouTube Trailers
  - VidSrc (multiple domain fallbacks: vsembed.ru, vsembed.su)
- **Fully Responsive** - Mobile-first design, works on all devices
- **Android Optimized** - PWA, touch-friendly, offline-capable
- **iOS Optimized** - Safe area support, standalone mode
- **PWA Ready** - Installable, offline cache, native app feel
- **Smooth Animations** - GPU-accelerated Framer Motion
- **Glassmorphism UI** - Modern neon-blue (#0B0F1A, #3B82F6, #22D3EE)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Dev Server:** http://localhost:5173/

## 🎯 Tech Stack

- **React 18** + Vite
- **React Router DOM** v6
- **Tailwind CSS** (custom theme)
- **Axios** (API client)
- **Framer Motion** (animations)
- **Lucide React** (icons)
- **TMDB API** (content data)

## 📱 Mobile & PWA Features

### Progressive Web App (PWA)
- **Installable** on Android/iOS: "Add to Home Screen"
- **Offline Support** via service worker caching
- **Standalone Mode** - runs like native app without browser UI
- **App Icons** - multiple sizes (72px to 512px)

### Android Optimizations
- **Touch-friendly UI** - All targets ≥44×44px
- **Hamburger menu** for small screens
- **Safe area support** for notched devices
- **Native scrolling** with momentum
- **Reduced motion** support for accessibility
- **Fast loading** with preconnect hints

### iOS Support
- `apple-mobile-web-app-capable` meta tags
- `apple-touch-icon` for home screen icon
- Status bar style: black-translucent
- Safe area insets for notch/Chemie

### Performance
- **Code splitting** - automatic route-based chunks
- **Lazy loading** images on scroll
- **GPU animations** - Framer Motion uses transform
- **Optimized bundle**: 349KB (113KB gzipped)
- **No layout shift** - reserved image aspect ratios

### Instructions
See **[MOBILE-OPTIMIZATION.md](MOBILE-OPTIMIZATION.md)** for:
- PWA setup guide
- Icon generation (`npm run generate-icons`)
- Android testing checklist
- Remote debugging

## 🎨 Theme & Styling

### Color Palette

- **Primary Background:** `#0B0F1A` (deep navy)
- **Secondary Background:** `#121826` (dark slate)
- **Accent:** `#3B82F6` (bright blue)
- **Glow:** `#22D3EE` (cyan neon)

### Custom CSS Classes

- `.glow` - Neon box shadow
- `.text-glow` - Glowing text effect
- `.glass` - Glassmorphism card
- `.scrollbar-hide` - Hide scrollbars in rows

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx         - Navigation bar
│   ├── HeroBanner.jsx     - Featured content hero
│   ├── Card.jsx          - Movie/TV card with hover effects
│   ├── Row.jsx           - Horizontal scrolling row
│   ├── SeasonSelector.jsx - TV season dropdown
│   └── EpisodeSelector.jsx - TV episode grid
├── pages/
│   ├── Home.jsx          - Landing page with all rows
│   ├── Movies.jsx        - Movies-only view
│   ├── TV.jsx            - TV-only view
│   ├── Search.jsx        - Search page (debounced)
│   ├── Watch.jsx         - Player page (movies + TV)
│   └── MyList.jsx        - Watchlist page
├── hooks/
│   └── useLocalStorage.js - Recent + Watchlist management
├── utils/
│   └── tmdb.js           - API configuration & endpoints
├── App.jsx               - Router setup
├── main.jsx              - Entry point
└── index.css             - Tailwind + custom styles
```

## 🔧 API Configuration

The app uses **TMDB (The Movie Database)** API.

- **API Key:** `06b3db8d25d0fc3c7fe63120d58c4594`
- **Base URL:** `https://api.themoviedb.org/3`
- **Image Base:** `https://image.tmdb.org/t/p/original`

### Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `/trending/{type}/{time}` | Trending content |
| `/{type}/popular` | Popular movies/TV |
| `/{type}/top_rated` | Top rated content |
| `/search/multi` | Search across types |
| `/{type}/{id}` | Get details |
| `/{type}/{id}/videos` | Get trailers |
| `/tv/{tvId}/season/{seasonNum}` | Get episodes |
| `/movie/upcoming` | Upcoming releases |

## 🎬 Streaming System

### Sources

1. **YouTube Trailers**
   - URL: `https://www.youtube.com/embed/{key}`
   - Used when mode=trailer

2. **VidSrc/VSEmbed** (Full Content)
   - Movies: `https://vsembed.ru/embed/movie/{tmdbId}`
   - TV: `https://vsembed.ru/embed/tv/{tvId}/{season}/{episode}`
   - Note: vidsrc.xyz is deprecated, vsembed.ru/su are the working domains

### Domain Fallback System

The player automatically tries multiple domains in order:
1. `https://vsembed.ru` (primary)
2. `https://vsembed.su` (backup)
3. `https://vidsrc.xyz` (legacy)
4. `https://vidsrc.to` (legacy)

If one domain fails, click the alternative links in the error UI.

### TV Series Playback

- Default: Season 1, Episode 1
- User can change season/episode
- Dynamic URL updates

## 🧠 localStorage Keys

- **`uncleflix_recent`** - Recently viewed items (max 10)
- **`uncleflix_watchlist`** - Saved items

### Data Structure

```javascript
{
  id: Number,
  type: "movie" | "tv",
  title: String,
  poster_path: String,
  backdrop_path: String,
  vote_average: Number
}
```

## 🐛 Troubleshooting Streaming Issues

If the player shows a **blank screen**, follow these steps:

### 1. Check Browser Console

Open DevTools (F12) → Console tab

Look for:
- ✅ `[UncleFlix] Embed URL:` - Shows the URL being used
- ❌ Errors about blocked iframes
- ❌ Mixed content warnings

### 2. Verify TMDB ID

The debug panel in dev mode shows:
- Type (movie/tv)
- TMDB ID (should be a number like 550)
- Full embed URL

Paste the embed URL directly into browser:
- If it loads → your code is fine
- If blank → VidSrc issue

### 3. Test VidSrc Directly

Try these URLs in a new tab:

- **Movie:** https://vidsrc.xyz/embed/movie/550 (Fight Club)
- **TV:** https://vidsrc.xyz/embed/tv/1399/1/1 (Game of Thrones S01E01)

If both fail → VidSrc is blocked or down

### 4. Disable Ad Blocker

VidSrc is commonly blocked by:
- Brave Shields
- uBlock Origin
- AdBlock Plus
- Ghostery

**Fixes:**
- Disable ad blocker for localhost
- Use Chrome Incognito (no extensions)
- Try a different browser

### 5. Try Alternative Domains

The app includes fallback links when streaming fails:
- vidsrc.to
- vidsrc.me
- vidsrc.unblocked.llc

Click any "Open in X" link to test.

### 6. HTTPS / Mixed Content

All sources use HTTPS. If you see:
```
Blocked loading mixed active content
```

Ensure your dev server uses HTTPS (Vite defaults to HTTP on localhost). This is usually fine, but if you configured HTTPS manually, ensure all sources match.

### 7. Check Iframe Permissions

Our iframe includes all required permissions:
```jsx
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
```

If you modified this, restore it.

### 8. Geographic Restrictions

Some content may be geo-blocked. Try:
- VPN (connect to US/UK server)
- Different VidSrc domain

### 9. Clear Cache & Cookies

Sometimes browser cache interferes:
- Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R)
- Clear site data in DevTools → Application → Storage

### 10. Server-Side Issues

VidSrc may be temporarily down. Check:
- Status page (if available)
- Social media for reports
- Try again in 10-15 minutes

## 📱 Browser Compatibility

- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

**Note:** Brave browser often blocks VidSrc by default.

## 🎯 Performance

- **Bundle Size:** ~345KB (unzipped) | 112KB (gzipped)
- **Image Optimization:** Lazy loading on cards
- **Animations:** GPU-accelerated Framer Motion
- **Route-based Code Splitting:** Automatic with Vite

## 📦 Deployment

### Vercel

```bash
npm i -g vercel
vercel --prod
```

### Netlify

```bash
npm run build
# Drag & drop dist/ folder to Netlify
```

### Other Static Hosts

1. Run `npm run build`
2. Upload `dist/` folder to:
   - GitHub Pages
   - Cloudflare Pages
   - AWS S3 + CloudFront
   - Firebase Hosting

## 📝 Environment Variables

No `.env` needed. API key is hardcoded (for demo purposes). For production:

Create `.env`:
```
VITE_TMDB_API_KEY=your_key_here
```

Update `tmdb.js`:
```js
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
```

## 🧪 Testing Checklist

- [ ] Home page loads with hero + rows
- [ ] Movies page shows all movie categories
- [ ] TV page shows all TV categories
- [ ] Search returns both movies and TV
- [ ] Clicking a card goes to Watch page
- [ ] Recently Viewed appears on Home
- [ ] My List saves/removes items
- [ ] Trailer plays (YouTube)
- [ ] Full movie plays (VidSrc)
- [ ] TV series: season/episode switching works
- [ ] Back navigation works
- [ ] Mobile menu works

## 🔐 Known Limitations

- **VidSrc reliability varies** - third-party streaming service, may be blocked by ISPs or ad blockers
- **No user accounts** - watchlist/recent stored locally per browser
- **No authentication** - no subscriptions/parental controls
- **Single TMDB API key** - rate-limited for public use
- **No server-side rendering** - SPA only

## 🙏 Credits

- **TMDB API** - Content data and images
- **VidSrc** - Streaming source aggregation
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide** - Beautiful icons

## 📄 License

Educational project - Not for commercial redistribution.

---

**Enjoy your streaming platform, UncleFlix!** 🎥🍿
