import { useEffect, useState } from 'react';

export function useZoomLevel() {
  const [zoomLevel, setZoomLevel] = useState(100);

  useEffect(() => {
    function getZoomLevel() {
      if (typeof window === 'undefined') return 100;
      
      const screenAvailWidth = window.screen.availWidth;
      const outerWidth = window.outerWidth;
      
      if (outerWidth > 0 && screenAvailWidth > 0) {
        return Math.round((screenAvailWidth / outerWidth) * 100);
      }
      return 100;
    }

    function handleResize() {
      setZoomLevel(getZoomLevel());
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return zoomLevel;
}

export function getEffectiveWidth(width) {
  return width;
}