import { useEffect, useState } from 'react';

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export function getEffectiveWidth(width) {
  if (typeof window === 'undefined') return width;
  const screenAvailWidth = window.screen.availWidth;
  const outerWidth = window.outerWidth;
  if (outerWidth > 0 && screenAvailWidth > 0) {
    const zoomLevel = Math.round((screenAvailWidth / outerWidth) * 100);
    if (zoomLevel > 100) {
      return Math.round(width * (100 / zoomLevel));
    }
  }
  return width;
}
