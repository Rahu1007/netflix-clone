# Netflix UI Clone Assessment

A fully responsive, production-ready Netflix UI clone developed in React.js (Vite) following ES6 paradigms. The app dynamically fetches over 10,000+ movie and TV show selections using a REST API and features intelligent offline capabilities seamlessly merged with UI animations.

## Included Features

- **Dynamic REST API Integration**: Pulls live entertainment data from the free IMDb API.
- **Infinite Scrolling & Lazy Loading**: Smart memory leak management via `react-intersection-observer` filtering active DOM elements. Added robust null-link mapping to ensure broken API images never render.
- **Debounced Search System**: Fast, responsive title searching optimized to minimize unnecessary server requests. 
- **Premium Animations**: Sleek view transitions and modal hover mechanics rendered perfectly with `framer-motion`.
- **User Progression**: Save entries to a Watchlist and automatically track Watch Histories mapped to persistent state.
- **Firebase Authentication**: Full Sign In/Sign Up logic module setup via Context APIs. Handled gracefully with a Guest Mode fallback for assessment purposes.
- **Offline Functionality Support**: A local background Service Worker automatically catches and proxies standard API requests, caching them for future seamless network toggles.

## Running Locally

1. Ensure you have Node.js installed, then install all module dependencies:
   ```bash
   npm install
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:5173/` in your browser.

*(Note: To utilize full cloud-based authentication profiles, rename `.env.example` to `.env` or use the generated `.env` file to apply your true Firebase credentials. Otherwise, use Guest Mode!)*
