// hooks/useRandomBackground.ts
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BACKGROUND_IMAGES } from '@/lib/constants';

export function useRandomBackground() {
  const [isRandom, setIsRandom] = useState(() => 
    localStorage.getItem('isRandomBackground') === 'true'
  );
  const location = useLocation();

  useEffect(() => {
    if (isRandom) {
      const randomBg = BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)];
      document.body.style.backgroundImage = `url(${randomBg})`;
    }
  }, [isRandom, location.pathname]); // location.pathname이 변경될 때마다 새로운 배경 설정

  const setIsRandomWithStorage = (value: boolean) => {
    setIsRandom(value);
    localStorage.setItem('isRandomBackground', value.toString());
  };

  return [isRandom, setIsRandomWithStorage] as const;
}