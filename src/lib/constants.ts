// src/lib/constants.ts
const SUPABASE_URL = "https://ceptvxbkyatsyrpttwbj.supabase.co";

export const BACKGROUND_OPTIONS = {
  'Background 1': `${SUPABASE_URL}/storage/v1/object/public/poems/background/background1.jpg`,
  'Background 2': `${SUPABASE_URL}/storage/v1/object/public/poems/background/background2.jpg`,
  'Background 3': `${SUPABASE_URL}/storage/v1/object/public/poems/background/background3.jpg`,
  'Background 4': `${SUPABASE_URL}/storage/v1/object/public/poems/background/background4.jpg`,
  'Background 5': `${SUPABASE_URL}/storage/v1/object/public/poems/background/background5.jpg`,
  'Background 6': `${SUPABASE_URL}/storage/v1/object/public/poems/background/background6.jpg`,
  'Background 7': `${SUPABASE_URL}/storage/v1/object/public/poems/background/background7.jpg`,
  'Background 8': `${SUPABASE_URL}/storage/v1/object/public/poems/background/background8.jpg`,
  'Background 9': `${SUPABASE_URL}/storage/v1/object/public/poems/background/background9.jpg`,
  'Background 10': `${SUPABASE_URL}/storage/v1/object/public/poems/background/background10.jpg`,
} as const;

export const CARD_BACKGROUNDS = {
  'Slate Black': 'bg-slate-800',
  'Deep Ocean': 'bg-blue-800',
  'Dark Forest': 'bg-green-800',
  'Rich Purple': 'bg-purple-800',
  'Wine Red': 'bg-red-800',
  'Dark Amber': 'bg-amber-800',
  'Royal Navy': 'bg-indigo-800',
  'Deep Rose': 'bg-rose-800',
  'Dark Teal': 'bg-teal-800',
  'Coffee Brown': 'bg-yellow-900',
  'Dark Violet': 'bg-violet-800',
  'Deep Crimson': 'bg-red-900',
  'Dark Emerald': 'bg-emerald-800',
  'Midnight Blue': 'bg-blue-900',
  'Dark Bronze': 'bg-yellow-800',
  'Deep Burgundy': 'bg-red-950',
  'Dark Moss': 'bg-green-900',
  'Deep Space': 'bg-slate-950',
  'Dark Berry': 'bg-purple-900',
  'Rich Mahogany': 'bg-orange-900'
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