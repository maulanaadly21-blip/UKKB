export const getImageUrl = (path?: string | null): string | null => {
  if (!path || typeof path !== 'string') return null;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:') || path.startsWith('data:')) {
    return path;
  }
  const backendBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api').replace(/\/api\/?$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${backendBase}${cleanPath}`;
};
