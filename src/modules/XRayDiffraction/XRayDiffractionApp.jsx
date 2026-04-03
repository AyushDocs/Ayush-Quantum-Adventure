import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useWindowSize, getEffectiveWidth } from '../../hooks/useWindowSize';
import { useZoomLevel } from '../../hooks/useZoomLevel';
import EwaldSphere3D from './Components/EwaldSphere3D';
import XRayControls from './Components/XRayControls';
import { useXRayState } from './useXRayState';

export default function XRayDiffractionApp() {
    const { width } = useWindowSize();
    const xrayState = useXRayState();
    const effectiveWidth = getEffectiveWidth(width);
    const isMobile = effectiveWidth < 1024;
    const zoomLevel = useZoomLevel();
    const scale = zoomLevel / 100;

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row', 
            overflow: 'hidden',
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: `${100/scale}%`,
            height: `${100/scale}%`,
        }}>
            {/* Visualization Area */}
            <div style={{ 
                flex: 1, 
                position: 'relative', 
                background: '#000',
                height: isMobile ? '50vh' : '100%'
            }}>
                <Canvas 
                    camera={{ position: [0, 0, 5], fov: 50 }}
                >
                    <EwaldSphere3D state={xrayState} />
                    <OrbitControls enableDamping />
                </Canvas>
            </div>

            {/* Controls Sidebar */}
            <div className="custom-scrollbar" style={{ 
                width: isMobile ? '100%' : (effectiveWidth < 1300 ? '280px' : '340px'),
                background: 'var(--card-bg)', 
                borderLeft: isMobile ? 'none' : '1px solid var(--border-color)', 
                borderTop: isMobile ? '1px solid var(--border-color)' : 'none',
                padding: isMobile ? '15px' : (effectiveWidth < 1300 ? '16px' : '20px'), 
                overflowY: isMobile ? 'visible' : 'auto',
                height: 'auto',
                flexShrink: 0
            }}>
                <XRayControls state={xrayState} />
            </div>
        </div>
    );
}
