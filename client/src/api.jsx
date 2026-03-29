export const fetchPOIs = async () => {
  const response = await fetch('http://localhost:3001/api/pois');
  return await response.json();
};