import { useZoomLevel } from './useZoomLevel';

export default function ZoomWrapper({ children, className = '' }) {
  const zoomLevel = useZoomLevel();
  
  let zoomClass = '';
  if (zoomLevel === 125) zoomClass = 'zoom-scale-125';
  else if (zoomLevel === 150) zoomClass = 'zoom-scale-150';
  else if (zoomLevel === 175) zoomClass = 'zoom-scale-175';
  else if (zoomLevel === 200) zoomClass = 'zoom-scale-200';
  
  if (!zoomClass) return <>{children}</>;
  
  return (
    <div className={`zoom-scale-container ${zoomClass} ${className}`}>
      {children}
    </div>
  );
}