import { Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function EwaldSphere3D({ state }) {
    const { ewaldRadius, rotatedPoints, autoRotate, setTheta, setPhi, theta, phi } = state;
    const groupRef = useRef();
    const { camera } = useThree();
    const lastCameraPos = useRef(new THREE.Vector3());
    
    // Initialize camera position tracking and set canvas ref
    useEffect(() => {
        lastCameraPos.current.copy(camera.position);
    }, [camera]);
    
    // Ensure canvas ref points to the actual DOM element for recording
    const { gl } = useThree();
    useEffect(() => {
        if (state.canvasRef) {
            state.canvasRef.current = gl.domElement;
        }
    }, [gl, state.canvasRef]);
    
    // Auto-rotate or sync with camera rotation
    useFrame((_, delta) => {
        if (autoRotate) {
            setTheta(prev => (prev + delta * 10) % 360);
        } else {
            // Track camera movement to update rotation angles
            const currentPos = camera.position.clone();
            
            // Only update if camera has moved significantly
            if (currentPos.distanceTo(lastCameraPos.current) > 0.01) {
                // Convert camera position to spherical coordinates
                const spherical = new THREE.Spherical();
                spherical.setFromVector3(currentPos);
                
                // Convert to degrees and update state
                const newTheta = (spherical.theta * 180 / Math.PI) % 360;
                const newPhi = (spherical.phi * 180 / Math.PI);
                
                setTheta(newTheta);
                setPhi(newPhi);
                
                lastCameraPos.current.copy(currentPos);
            }
        }
    });
    
    return (
        <group ref={groupRef}>
            {/* Ambient and directional lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
            <pointLight position={[-10, -10, -5]} intensity={0.3} />
            
            {/* Ewald Sphere - centered at origin */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[ewaldRadius, 64, 64]} />
                <meshPhysicalMaterial
                    color="#4080ff"
                    transparent
                    opacity={0.15}
                    roughness={0.1}
                    metalness={0.1}
                    side={THREE.DoubleSide}
                />
            </mesh>
            
            {/* Ewald sphere wireframe for better visibility */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[ewaldRadius, 24, 24]} />
                <meshBasicMaterial
                    color="#4080ff"
                    wireframe
                    transparent
                    opacity={0.3}
                />
            </mesh>
            
            {/* X-ray source position (at +ewaldRadius on x-axis, right side) */}
            <mesh position={[ewaldRadius, 0, 0]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={2} />
            </mesh>
            
            {/* X-ray source label */}
            <Text
                position={[ewaldRadius, 0.25, 0]}
                fontSize={0.15}
                color="#ffff00"
                anchorX="center"
                anchorY="bottom"
            >
                X-ray Source
            </Text>
            
            {/* Ewald sphere label */}
            <Text
                position={[0, ewaldRadius + 0.2, 0]}
                fontSize={0.15}
                color="#4080ff"
                anchorX="center"
                anchorY="bottom"
            >
                Ewald Sphere
            </Text>
            
            
            {/* Reciprocal lattice points */}
            {rotatedPoints.map((point, idx) => {
                const isDiffracted = point.isDiffracted;
                const scale = isDiffracted ? 1.5 : 1.0;
                
                return (
                    <group key={idx}>
                        {/* Lattice point */}
                        <mesh position={[point.rotatedX, point.rotatedY, point.rotatedZ]}>
                            <sphereGeometry args={[0.04 * scale, 16, 16]} />
                            <meshStandardMaterial
                                color={isDiffracted ? "#00ff00" : "#ff8800"}
                                emissive={isDiffracted ? "#00ff00" : "#ff4400"}
                                emissiveIntensity={isDiffracted ? 1.0 : 0.3}
                            />
                        </mesh>
                        
                        {/* Miller indices label for diffracted points */}
                        {isDiffracted && (
                            <>
                                <Text
                                    position={[point.rotatedX + 0.15, point.rotatedY + 0.15, point.rotatedZ]}
                                    fontSize={0.12}
                                    color="#00ff00"
                                    anchorX="left"
                                    anchorY="middle"
                                >
                                    ({point.h} {point.k} {point.l})
                                </Text>
                                
                                {/* Diffracted beam (from sphere center to lattice point) */}
                                <line>
                                    <bufferGeometry>
                                        <bufferAttribute
                                            attach="attributes-position"
                                            count={2}
                                            array={new Float32Array([
                                                0, 0, 0,
                                                point.rotatedX, point.rotatedY, point.rotatedZ
                                            ])}
                                            itemSize={3}
                                        />
                                    </bufferGeometry>
                                    <lineBasicMaterial color="#00ff00" linewidth={2} />
                                </line>
                            </>
                        )}
                    </group>
                );
            })}
            
            {/* Coordinate axes - uniform color with labels */}
            {(() => {
                const axisLen = ewaldRadius * 1.2;
                const axisColor = '#00ccff';
                return (
                    <>
                        {/* X axis */}
                        <line>
                            <bufferGeometry>
                                <bufferAttribute attach="attributes-position" count={2} array={new Float32Array([0,0,0, axisLen,0,0])} itemSize={3} />
                            </bufferGeometry>
                            <lineBasicMaterial color={axisColor} />
                        </line>
                        <Text position={[axisLen + 0.1, 0, 0]} fontSize={0.12} color={axisColor}>X</Text>
                        
                        {/* Y axis */}
                        <line>
                            <bufferGeometry>
                                <bufferAttribute attach="attributes-position" count={2} array={new Float32Array([0,0,0, 0,axisLen,0])} itemSize={3} />
                            </bufferGeometry>
                            <lineBasicMaterial color={axisColor} />
                        </line>
                        <Text position={[0, axisLen + 0.1, 0]} fontSize={0.12} color={axisColor}>Y</Text>
                        
                        {/* Z axis */}
                        <line>
                            <bufferGeometry>
                                <bufferAttribute attach="attributes-position" count={2} array={new Float32Array([0,0,0, 0,0,axisLen])} itemSize={3} />
                            </bufferGeometry>
                            <lineBasicMaterial color={axisColor} />
                        </line>
                        <Text position={[0, 0, axisLen + 0.1]} fontSize={0.12} color={axisColor}>Z</Text>
                    </>
                );
            })()}
        </group>
    );
}
