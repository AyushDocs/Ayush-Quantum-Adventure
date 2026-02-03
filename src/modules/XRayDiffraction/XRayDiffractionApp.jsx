import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useWindowSize } from '../../hooks/useWindowSize';
import EwaldSphere3D from './Components/EwaldSphere3D';
import XRayControls from './Components/XRayControls';
import { useXRayState } from './useXRayState';

export default function XRayDiffractionApp() {
    const { width } = useWindowSize();
    const xrayState = useXRayState();
    const isMobile = width < 1024;

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row', 
            height: '100%',
            overflow: 'hidden'
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
                width: isMobile ? '100%' : '340px',
                background: 'var(--card-bg)', 
                borderLeft: isMobile ? 'none' : '1px solid var(--border-color)', 
                borderTop: isMobile ? '1px solid var(--border-color)' : 'none',
                padding: '15px', 
                overflowY: 'auto',
                height: isMobile ? '50vh' : '100%'
            }}>
                <XRayControls state={xrayState} />
            </div>
        </div>
    );
}
