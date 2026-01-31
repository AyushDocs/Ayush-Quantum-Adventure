import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useWindowSize } from '../../hooks/useWindowSize';
import DiatomicControls from './Components/DiatomicControls';
import Molecule3D from './Components/Molecule3D';
import { useDiatomicState } from './useDiatomicState';

export default function DiatomicApp() {
    const { width } = useWindowSize();
    const diatomState = useDiatomicState();
    const isMobile = width < 1024; // Use a larger breakpoint for the simulator because it needs space

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
                <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                    <Molecule3D physicsRef={diatomState.physicsRef} />
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
                <DiatomicControls state={diatomState} />
            </div>
        </div>
    );
}
