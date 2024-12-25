// hooks/useBackground.ts
import { useState, useEffect } from 'react';
import { BACKGROUND_OPTIONS, getRandomBackground } from '@/lib/constants';

export function useBackground() {
  const [background, setBackground] = useState(() => {
    const saved = localStorage.getItem('background');
    return saved || BACKGROUND_OPTIONS.Random;
  });

  useEffect(() => {
    if (background === 'random') {
      const randomBg = getRandomBackground();
      document.body.style.backgroundImage = `url(${randomBg})`;
    } else {
      document.body.style.backgroundImage = `url(${background})`;
    }
    localStorage.setItem('background', background);
  }, [background]);

  return [background, setBackground] as const;
}