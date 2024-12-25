import { useEffect } from 'react';
import { getRandomBackground } from '@/lib/randomStyles';

export function RandomBackground() {
  useEffect(() => {
    const randomBackground = getRandomBackground();
    document.body.style.backgroundImage = `url('${randomBackground}')`;

    return () => {
      document.body.style.backgroundImage = '';
    };
  }, []);

  return null;
}