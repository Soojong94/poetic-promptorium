export const CARD_BACKGROUNDS = {
  'Random': 'random',
  'Slate Black': 'bg-slate-900/10',    // backdrop-blur 제거, 투명도 75%로 조정
  'Deep Ocean': 'bg-blue-900/15',
  'Dark Forest': 'bg-green-900/15',
  'Rich Purple': 'bg-purple-900/15',
  'Wine Red': 'bg-red-900/15',
  'Dark Amber': 'bg-amber-900/15',
  'Royal Navy': 'bg-indigo-900/15',
  'Deep Rose': 'bg-rose-900/15',
  'Dark Teal': 'bg-teal-900/15',
  'Coffee Brown': 'bg-brown-900/15',
  'Dark Violet': 'bg-violet-900/15',
  'Deep Crimson': 'bg-crimson-900/15',
  'Dark Emerald': 'bg-emerald-900/15',
  'Midnight Blue': 'bg-blue-950/15',
  'Dark Bronze': 'bg-yellow-950/15',
  'Deep Burgundy': 'bg-red-950/15',
  'Dark Moss': 'bg-green-950/15',
  'Deep Space': 'bg-slate-950/15',
  'Dark Berry': 'bg-purple-950/15',
  'Rich Mahogany': 'bg-orange-950/15'
} as const;

export const BACKGROUND_OPTIONS = {
  'Random': 'random',
  'Background 1': '/background1.jpg',
  'Background 2': '/background2.jpg',
  'Background 3': '/background3.jpg',
  'Background 4': '/background4.jpg',
  'Background 5': '/background5.jpg',
  'Background 6': '/background6.jpg',
  'Background 7': '/background7.jpg',
  'Background 8': '/background8.jpg',
  'Background 9': '/background9.jpg',
  'Background 10': '/background10.jpg',
} as const;

export const BACKGROUND_IMAGES = [
  '/background1.jpg',
  '/background2.jpg',
  '/background3.jpg',
  '/background4.jpg',
  '/background5.jpg',
  '/background6.jpg',
  '/background7.jpg',
  '/background8.jpg',
  '/background9.jpg',
  '/background10.jpg',
];

export const getRandomBackground = () => {
  const randomIndex = Math.floor(Math.random() * BACKGROUND_IMAGES.length);
  return BACKGROUND_IMAGES[randomIndex];
};