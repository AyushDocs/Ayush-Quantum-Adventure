import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import DiatomicControls from './Components/DiatomicControls';
import Molecule3D from './Components/Molecule3D';
import { useDiatomicState } from './useDiatomicState';

export default function DiatomicApp() {
    const diatomState = useDiatomicState();

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', height: '100%' }}>
            {/* Visualization Area */}
            <div style={{ position: 'relative', background: '#000' }}>
                <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                    <Molecule3D physicsRef={diatomState.physicsRef} />
                    <OrbitControls enableDamping />
                </Canvas>
            </div>

            {/* Controls Sidebar */}
            <div className="custom-scrollbar" style={{ 
                background: 'var(--card-bg)', 
                borderLeft: '1px solid var(--border-color)', 
                padding: '15px', 
                overflowY: 'auto'
            }}>
                <DiatomicControls state={diatomState} />
            </div>
        </div>
    );
}
