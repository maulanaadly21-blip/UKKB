export const getImageUrl = (path?: string | null, type: 'spaces' | 'members' | 'general' = 'spaces'): string | null => {
  if (!path || typeof path !== 'string' || path.trim() === '') return null;

  const trimmed = path.trim();

  // If already full URL pointing to learn.smktelkom-mlg.sch.id without /coworking/
  if (trimmed.includes('learn.smktelkom-mlg.sch.id/uploads/')) {
    return trimmed.replace(/^http:\/\//i, 'https://').replace('learn.smktelkom-mlg.sch.id/uploads/', 'learn.smktelkom-mlg.sch.id/coworking/uploads/');
  }

  // If pointing to localhost
  if (trimmed.startsWith('http://localhost') || trimmed.startsWith('http://127.0.0.1')) {
    const relativePart = trimmed.replace(/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, '');
    const cleanRelative = relativePart.startsWith('/') ? relativePart : `/${relativePart}`;
    return `https://learn.smktelkom-mlg.sch.id/coworking${cleanRelative}`;
  }

  if (trimmed.startsWith('https://') || trimmed.startsWith('blob:') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  if (trimmed.startsWith('http://')) {
    return trimmed.replace(/^http:\/\//i, 'https://');
  }

  const backendBase = (import.meta.env.VITE_API_BASE_URL || 'https://learn.smktelkom-mlg.sch.id/coworking/api').replace(/\/api\/?$/, '');

  if (trimmed.includes('uploads/')) {
    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${backendBase}${cleanPath}`;
  }

  const cleanPath = trimmed.startsWith('/') ? trimmed.substring(1) : trimmed;
  return `${backendBase}/uploads/${type}/${cleanPath}`;
};

export const getPlaceholderImage = (type: 'desk' | 'meeting_room' | 'private_office' | string = 'desk'): string => {
  switch (type) {
    case 'meeting_room':
      return 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1000&q=80';
    case 'private_office':
      return 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=80';
    case 'desk':
    default:
      return 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1000&q=80';
  }
};
