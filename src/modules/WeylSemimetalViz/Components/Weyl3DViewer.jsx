import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text, Float, Line, Sphere, Backdrop } from '@react-three/drei';
import * as THREE from 'three';

function WeylNode({ position, chirality, color }) {
    const mesh = useRef();
    
    useFrame((state) => {
        mesh.current.scale.x = mesh.current.scale.y = mesh.current.scale.z = 
            1 + Math.sin(state.clock.getElapsedTime() * 3) * 0.1;
    });

    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <Sphere ref={mesh} args={[0.15, 32, 32]}>
                    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
                </Sphere>
            </Float>
            <Text position={[0, 0.4, 0]} fontSize={0.2} color="white">
                {chirality > 0 ? "W+" : "W-"}
            </Text>
        </group>
    );
}

function BrillouinZone() {
    return (
        <group>
            {/* 3D Cube representing the 1st BZ */}
            <mesh>
                <boxGeometry args={[3, 3, 3]} />
                <meshStandardMaterial 
                    color="#111" 
                    transparent 
                    opacity={0.1} 
                    side={THREE.DoubleSide} 
                />
            </mesh>
            <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(3, 3, 3)]} />
                <lineBasicMaterial color="#ffffff" transparent opacity={0.3} />
            </lineSegments>
            
            {/* Coordinate Axes */}
            <primitive object={new THREE.AxesHelper(2)} />
            <Text position={[2.2, 0, 0]} fontSize={0.2} color="#888">kx</Text>
            <Text position={[0, 2.2, 0]} fontSize={0.2} color="#888">ky</Text>
            <Text position={[0, 0, 2.2]} fontSize={0.2} color="#888">kz</Text>
        </group>
    );
}

function FermiArc({ points, color = "#8b5cf6" }) {
    const curvePoints = useMemo(() => 
        points.map(p => new THREE.Vector3(p[0], p[1], 1.5)), // Z = 1.5 is the top surface of the 3x3x3 BZ
    [points]);

    return (
        <group>
            <Line
                points={curvePoints}
                color={color}
                lineWidth={3}
                dashed={false}
            />
            {/* Projection Lines from bulk to surface */}
            {points[0] && (
                <Line 
                    points={[new THREE.Vector3(points[0][0], points[0][1], curvePoints[0].z), new THREE.Vector3(points[0][0], points[0][1], 0)]}
                    color="rgba(255,255,255,0.1)"
                    lineWidth={1}
                />
            )}
             {points[points.length-1] && (
                <Line 
                    points={[new THREE.Vector3(points[points.length-1][0], points[points.length-1][1], curvePoints[curvePoints.length-1].z), new THREE.Vector3(points[points.length-1][0], points[points.length-1][1], 0)]}
                    color="rgba(255,255,255,0.1)"
                    lineWidth={1}
                />
            )}
        </group>
    );
}

export default function Weyl3DViewer({ nodes, fermiArcPoints, showArcs }) {
    return (
        <div style={{ width: '100%', height: '500px', background: '#050505', borderRadius: '32px', overflow: 'hidden', border: '1px solid #1a1a1a' }}>
            <Canvas gl={{ antialias: true }} shadows>
                <color attach="background" args={['#050505']} />
                <fog attach="fog" args={['#050505', 5, 15]} />
                
                <PerspectiveCamera makeDefault position={[5, 4, 5]} fov={50} />
                <OrbitControls enableDamping dampingFactor={0.05} />
                
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <spotLight position={[0, 10, 0]} intensity={2} angle={0.3} penumbra={1} castShadow />

                <group rotation={[0.4, 0.4, 0]}>
                    <BrillouinZone />
                    {nodes.map(node => (
                        <WeylNode 
                            key={node.id} 
                            position={node.pos} 
                            chirality={node.chirality} 
                            color={node.color} 
                        />
                    ))}
                    {showArcs && (
                        <>
                            <FermiArc points={fermiArcPoints} color="#8b5cf6" />
                            {/* Mirror reflection on the bottom surface */}
                            <group scale={[1, 1, -1]}>
                                <FermiArc points={fermiArcPoints} color="#3b82f6" />
                            </group>
                        </>
                    )}
                </group>

                {/* Aesthetic Background */}
                <Backdrop
                    receiveShadow
                    floor={2}
                    segments={20}
                    scale={[15, 10, 10]}
                    position={[0, -2, -5]}
                >
                    <meshStandardMaterial color="#0a0a0a" />
                </Backdrop>

            </Canvas>
        </div>
    );
}
