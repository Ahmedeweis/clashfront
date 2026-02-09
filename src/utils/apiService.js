import axios from 'axios';
// إنشاء instance ثابت
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
// --- دوال للتعامل مع الباك --- //
// جلب بيانات الكلان
export const getClan = (tag) => {
  const encodedTag = encodeURIComponent(tag);
  return api.get(`/api/clan/${encodedTag}`);
};
// جلب بيانات لاعب
export const getPlayer = (tag) => {
  return api.get(`/api/player/${tag.replace('#', '')}`);
};
// جلب CWL League Group لكلان ثابت أو ممرر
export const getCWL = (clanTag = '2PYCUY8RG') => {
  return api.get(`/api/clan/${clanTag}/cwl`)
}
// CWL War by Tag
export const getCWLWar = (tag) => {
  const encodedTag = encodeURIComponent(tag);
  return api.get(`/api/cwl/war/${encodedTag}`);
};

// جلب سجل Wars للكلان (War Log)
export const getClanWarLog = (tag, params = {}) => {
  const encodedTag = encodeURIComponent(tag);
  return api.get(`/api/clan/${encodedTag}/warlog`, { params });
};

// --- League & Rankings (2026 Logic) --- //

// Get League Info
export const getLeague = (leagueId) => {
  return api.get(`/api/league/${leagueId}`);
};

// Get League Season Rankings (Specific Season)
export const getLeagueSeasonRankings = (leagueId, seasonId) => {
  return api.get(`/api/league/${leagueId}/seasons/${seasonId}`);
};

// Get League Seasons List
export const getLeagueSeasons = (leagueId) => {
  return api.get(`/api/league/${leagueId}/seasons`);
};

// Get Global League Rankings (Real-time / Current)
export const getLeagueRankings = (leagueId) => {
  // Attempting singular 'location' to match pattern, though 'locations' is standard in API.
  // If /api/player maps to /players, /api/location might map to /locations.
  return api.get(`/api/location/global/rankings/leagues/${leagueId}`);
};
export default api;
