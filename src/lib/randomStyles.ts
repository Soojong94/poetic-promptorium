const cardBackgrounds = [
  'bg-slate-900/95',  // 진한 슬레이트 블랙
  'bg-gray-900/95',   // 진한 그레이 블랙
  'bg-zinc-900/95',   // 진한 징크 블랙
  'bg-neutral-900/95', // 진한 뉴트럴 블랙
  'bg-stone-900/95'   // 진한 스톤 블랙
];

// Available background images
const backgroundImages = [
  // '/trees.jpg',
  // '/background (1).jpg',
];

export const getRandomBackground = () => {
  const randomIndex = Math.floor(Math.random() * backgroundImages.length);
  return backgroundImages[randomIndex];
};

export const getRandomCardBackground = () => {
  const randomIndex = Math.floor(Math.random() * cardBackgrounds.length);
  return cardBackgrounds[randomIndex];
};