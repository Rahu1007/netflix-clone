const TMDB_KEY = '8265bd1679663a7ea12ac168da84d2e8'; // demo key
const RAWG_KEY = '47abf98e14fb4c7fb0a4e8a6dcf553be'; // demo key
const TMDB = 'https://api.themoviedb.org/3';
const RAWG = 'https://api.rawg.io/api';
const IMG = 'https://image.tmdb.org/t/p/w500';
const BG = 'https://image.tmdb.org/t/p/w1280';

export function normMovie(m) { return { id: 'mv_' + m.id, rawId: m.id, type: 'movie', primaryTitle: m.title || m.name, primaryImage: { url: m.poster_path ? IMG + m.poster_path : null }, backdrop: m.backdrop_path ? BG + m.backdrop_path : null, plot: m.overview, startYear: (m.release_date || m.first_air_date || '').slice(0, 4), rating: { aggregateRating: m.vote_average?.toFixed(1) }, genres: m.genre_ids || [] } }
export function normTV(t) { return { id: 'tv_' + t.id, rawId: t.id, type: 'tv', primaryTitle: t.name || t.title, primaryImage: { url: t.poster_path ? IMG + t.poster_path : null }, backdrop: t.backdrop_path ? BG + t.backdrop_path : null, plot: t.overview, startYear: (t.first_air_date || t.release_date || '').slice(0, 4), rating: { aggregateRating: t.vote_average?.toFixed(1) }, genres: t.genre_ids || [] } }
export function normGame(g) { return { id: 'gm_' + g.id, rawId: g.id, type: 'game', primaryTitle: g.name, primaryImage: { url: g.background_image }, backdrop: g.background_image, plot: 'A video game released on ' + (g.platforms?.map(p => p.platform.name).join(', ') || 'multiple platforms') + '.', startYear: (g.released || '').slice(0, 4), rating: { aggregateRating: g.rating?.toFixed(1) }, genres: [] } }

export const fetchTitles = async ({ limit = 20, pageToken = '1', type = '' }) => {
  let results = [];
  try {
     if (type === 'tv') {
        const r = await fetch(`${TMDB}/tv/popular?api_key=${TMDB_KEY}&page=${pageToken}`);
        const d = await r.json();
        results = (d.results || []).map(normTV);
     } else if (type === 'movies') {
        const r = await fetch(`${TMDB}/movie/popular?api_key=${TMDB_KEY}&page=${pageToken}`);
        const d = await r.json();
        results = (d.results || []).map(normMovie);
     } else if (type === 'games') {
        const r = await fetch(`${RAWG}/games?key=${RAWG_KEY}&page=${pageToken}&page_size=${limit}&ordering=-rating`);
        const d = await r.json();
        results = (d.results || []).map(normGame);
     } else {
        const r = await fetch(`${TMDB}/trending/all/day?api_key=${TMDB_KEY}&page=${pageToken}`);
        const d = await r.json();
        results = (d.results || []).map(x => x.media_type === 'movie' ? normMovie(x) : normTV(x));
     }
  } catch(e) { console.error(e); }
  
  // Filtering out null imagery gracefully
  return { titles: results.filter(i => i.primaryImage?.url), nextPageToken: parseInt(pageToken) + 1 + '' };
};

export const searchTitles = async (query) => {
  if (!query) return { titles: [] };
  const term = encodeURIComponent(query);
  try {
     const [tm, gm] = await Promise.all([
       fetch(`${TMDB}/search/multi?api_key=${TMDB_KEY}&query=${term}&page=1`).then(r => r.json()).then(d => (d.results || []).map(x => x.media_type === 'movie' ? normMovie(x) : normTV(x))),
       fetch(`${RAWG}/games?key=${RAWG_KEY}&search=${term}&page_size=8`).then(r => r.json()).then(d => (d.results || []).map(normGame))
     ]);
     let combined = [...tm, ...gm];
     return { titles: combined.filter(i => i.primaryImage?.url) };
  } catch(e) {
     return { titles: [] };
  }
};
