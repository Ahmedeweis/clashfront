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
export default api;
