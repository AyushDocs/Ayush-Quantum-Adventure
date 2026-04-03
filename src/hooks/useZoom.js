import { useZoomLevel } from '../../hooks/useZoomLevel';

export function useZoom() {
  const zoomLevel = useZoomLevel();
  const isZoomed = zoomLevel > 100;
  const zoomFactor = zoomLevel / 100;
  
  return { zoomLevel, isZoomed, zoomFactor };
}

export function getZoomAdjustedValue(value, zoomLevel) {
  return value * (zoomLevel / 100);
}