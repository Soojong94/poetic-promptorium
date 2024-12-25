// Available background images
const backgroundImages = [
  '/trees.jpg',
  'https://images.unsplash.com/photo-1472396961693-142e6e269027',
  'https://images.unsplash.com/photo-1439886183900-e79ec0057170',
  'https://images.unsplash.com/photo-1485833077593-4278bba3f11f',
  'https://images.unsplash.com/photo-1438565434616-3ef039228b15'
];

// Card background colors with similar shades
const cardBackgrounds = [
  'bg-purple-100/80',
  'bg-purple-50/80',
  'bg-amber-50/80',
  'bg-rose-50/80',
  'bg-blue-50/80'
];

export const getRandomBackground = () => {
  const randomIndex = Math.floor(Math.random() * backgroundImages.length);
  return backgroundImages[randomIndex];
};

export const getRandomCardBackground = () => {
  const randomIndex = Math.floor(Math.random() * cardBackgrounds.length);
  return cardBackgrounds[randomIndex];
};