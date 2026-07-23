export const getFileUrl = (path) => {
  const normalized = path.replace(/\\/g, '/');
  return `${import.meta.env.VITE_API_URL}/${normalized}`;
};
