const BASE_URL = 'https://api.imdbapi.dev';

export const fetchTitles = async ({ limit = 20, pageToken = '', type = '' }) => {
  let url = `${BASE_URL}/titles?limit=${limit}`;
  if (pageToken) url += `&pageToken=${pageToken}`;
  if (type) {
     if (type === 'tv') url += `&types=TV_SERIES&types=TV_MINI_SERIES`;
     else if (type === 'movies') url += `&types=MOVIE`;
     else if (type === 'games') url += `&types=VIDEO_GAME`;
  }
  url += `&sortBy=SORT_BY_POPULARITY&sortOrder=DESC`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  
  // Filter out any results that do NOT have a working primary image URL to ensure Netflix-like visual aesthetics
  if (data && data.titles) {
      data.titles = data.titles.filter(item => item.primaryImage?.url);
  }
  return data;
};

export const searchTitles = async (query) => {
  if (!query) return { titles: [] };
  const res = await fetch(`${BASE_URL}/search/titles?query=${encodeURIComponent(query)}&limit=20`);
  if (!res.ok) throw new Error("Failed to search");
  const data = await res.json();
  if (data && data.titles) {
      data.titles = data.titles.filter(item => item.primaryImage?.url);
  }
  return data;
};
