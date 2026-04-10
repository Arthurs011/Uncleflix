# UncleFlix

A Netflix-style streaming PWA built with React and Vite, featuring a YouTube-style player and cinematic browsing UI.

## Tech Stack

- **Frontend:** React 18.3 + Vite 5
- **Styling:** Tailwind CSS with custom neon/glassmorphism theme
- **Routing:** React Router DOM v6
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **APIs:** TMDB (The Movie Database) for metadata, VidSrc/VSEmbed for streaming

## Project Structure

```
src/
  components/
    Navbar.jsx          # Navigation bar
    HeroBanner.jsx      # Auto-cycling hero with arrows/dots, accepts items[] or single item
    Card.jsx            # Movie/TV card with glassmorphism hover, glow border, play button
    Row.jsx             # Horizontal scrolling row with snap scrolling
    VideoFrame.jsx      # 16:9 iframe player with back/title overlays and error state
    Recommendations.jsx # YouTube-style "Up Next" sidebar with trending content
    SeasonSelector.jsx  # Season dropdown for TV shows
    EpisodeSelector.jsx # Styled episode list for TV shows
  pages/
    Home.jsx            # Homepage with auto-cycling hero + categorized rows + continue watching
    Movies.jsx          # Movies browsing page
    TV.jsx              # TV shows browsing page
    Search.jsx          # Search with debouncing
    Watch.jsx           # YouTube-style watch page: player + metadata + sidebar recommendations
    MyList.jsx          # Saved watchlist
  hooks/
    useLocalStorage.js  # useRecentlyViewed + useWatchlist hooks (all callbacks memoized)
  utils/
    tmdb.js             # TMDB API helpers
  App.jsx               # Root with router
  main.jsx              # Entry point
public/                 # Static assets, PWA manifest, service worker
```

## Key UI Features

### Watch Page (YouTube-style)
- 16:9 rounded video player with back button and title overlay
- Mode toggle: Watch Now / Trailer
- Title, rating, year, runtime, genre metadata
- Like, Share, Save action buttons
- Expandable description
- "Up Next" sidebar with clickable recommendations
- TV: Season dropdown + styled episode list

### Homepage (Netflix-style)
- Auto-cycling hero banner (8 items, every 6s) with navigation arrows + dot indicators
- Continue Watching row (recently viewed)
- Categorized rows: Trending, Popular, Top Rated for Movies and TV

### Cards
- Glassmorphism poster with rating badge + type badge
- Hover: glow cyan border, scale, play button overlay, title reveal
- Optional progress bar for continue watching

## Configuration

- **Dev server:** Vite on `0.0.0.0:5000`
- **TMDB API key:** Hardcoded in `src/utils/tmdb.js`
- **Theme colors:** Primary `#0B0F1A`, Accent `#3B82F6`, Glow `#22D3EE`
- **Deployment:** Static site — builds to `dist/` via `npm run build`

## Running

```bash
npm install
npm run dev       # Development server on port 5000
npm run build     # Production build to dist/
```
