import { useEffect } from 'react';
import { getRandomBackground } from '@/lib/constants';

export function RandomBackground() {
  useEffect(() => {
    // 최초 로드시에만 배경을 설정
    const savedBackground = localStorage.getItem('background');
    if (!savedBackground) {
      const randomBg = getRandomBackground();
      document.body.style.backgroundImage = `url(${randomBg})`;
      // 초기 랜덤 배경도 저장
      localStorage.setItem('background', randomBg);
    } else {
      // 저장된 배경이 있으면 그것을 사용
      document.body.style.backgroundImage = `url(${savedBackground})`;
    }
  }, []); // 빈 dependency array로 최초 1회만 실행

  return null;
}