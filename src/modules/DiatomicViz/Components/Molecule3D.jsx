import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { Constants } from '../Physics/constants';

const Atom = ({ position, color, scale = 1, transparent = false, opacity = 1 }) => (
  <mesh position={position} scale={[scale, scale, scale]}>
    <sphereGeometry args={[0.6, 32, 32]} />
    <meshPhongMaterial 
        color={color} 
        shininess={100} 
        transparent={transparent} 
        opacity={opacity}
        depthWrite={!transparent}
        blending={transparent ? THREE.AdditiveBlending : THREE.NormalBlending}
    />
  </mesh>
);

const Bond = ({ length, position, rotation }) => (
    <mesh position={position} rotation={rotation}>
        <cylinderGeometry args={[0.2, 0.2, length, 32]} />
        <meshPhongMaterial color="#aaaaaa" />
    </mesh>
);

export default function Molecule3D({ physicsRef }) {
    const groupRef = useRef();
    
    // Animation Loop
    useFrame((state, delta) => {
        if (!physicsRef.current) return;
        const { l, v, k } = physicsRef.current;
        
        // --- Physics Update ---
        const r_eq_viz = 3.0; 
        const omega = Math.sqrt(k) * 0.005; 
        const amplitude = 0.2 * Math.sqrt(v + 0.5);
        
        physicsRef.current.vibrationPhase += omega * (delta * 1000); // delta is Seconds
        const displacement = amplitude * Math.sin(physicsRef.current.vibrationPhase);
        const r_current = r_eq_viz + displacement;
        physicsRef.current.r_current = r_current; // Update ref for UI to read if needed

        const rotSpeed = l * 0.02; // * delta correction? legacy was per frame.
        physicsRef.current.rotationAngle += rotSpeed * (60 * delta); // Match legacy speed approx
        
        // --- Visual Update ---
        if (groupRef.current) {
            groupRef.current.rotation.z = physicsRef.current.rotationAngle;
        }
    });

    // We render based on the *latest* render cycle state for positions
    // To smooth it out, we can let React handle the structure, but animate refs.
    // However, atoms need to move relative to each other strictly.
    // In R3F, we can bind positions to refs or useFrame to update imperative positions.
    // For simplicity, let's update children in useFrame or just use simple oscillation in shader/ref.
    // ACTUALLY, strict position update in useFrame is best for "Molecule" structure.
    
    // Let's us direct ref access to atoms
    const atom1Ref = useRef();
    const atom2Ref = useRef();
    const bondRef = useRef();
    const cloud1Ref = useRef();
    const cloud2Ref = useRef();
    const arrowRef = useRef();

    useFrame(() => {
        if (!physicsRef.current || !atom1Ref.current) return;
        const r = physicsRef.current.r_current;
        const n = physicsRef.current.n;
        const l = physicsRef.current.l;

        // CM Calculation
        const mC = Constants.massC;
        const mO = Constants.massO;
        const M = mC + mO;
        const xC = -(mO / M) * r;
        const xO = (mC / M) * r;

        // Update positions
        atom1Ref.current.position.x = xC;
        atom2Ref.current.position.x = xO;
        cloud1Ref.current.position.x = xC;
        cloud2Ref.current.position.x = xO;
        
        // Bond
        bondRef.current.scale.y = r; // Scale length (Y axis)
        bondRef.current.position.x = (xC + xO) / 2;
        
        // Cloud params
        let scale = 1.0 + n * 0.3;
        let opacity = 0.2 + n * 0.1;
        let color = (n === 0) ? 0x64b5f6 : ((n === 1) ? 0xffb74d : 0xe57373);
        
        cloud1Ref.current.scale.set(scale/0.6, scale/0.6, scale/0.6); // Base sphere is 0.6 radius
        cloud2Ref.current.scale.set(scale*1.1/0.6, scale*1.1/0.6, scale*1.1/0.6);
        cloud1Ref.current.material.opacity = opacity;
        cloud1Ref.current.material.color.setHex(color);
        cloud2Ref.current.material.opacity = opacity;
        cloud2Ref.current.material.color.setHex(color);

        // Arrow L
        if (arrowRef.current) {
            arrowRef.current.visible = l > 0;
            if (l > 0) {
                 const L_mag = Math.sqrt(l * (l + 1));
                 // ArrowHelper scaling is tricky in R3F props, better imperative
                 // Or just scale the mesh group
                 arrowRef.current.scale.setScalar(L_mag * 0.5); 
            }
        }
    });

    return (
        <group ref={groupRef} rotation={[0, Math.PI / 6, 0]}>
            <AmbientLight intensity={0.5} />
            <DirectionalLight position={[5, 5, 5]} intensity={1} />
            
            {/* Atom 1 (C) */}
            <mesh ref={atom1Ref}>
                <sphereGeometry args={[0.6, 32, 32]} />
                <meshPhongMaterial color="#333333" shininess={100} />
            </mesh>
             {/* Cloud 1 */}
            <mesh ref={cloud1Ref}>
                <sphereGeometry args={[0.6, 32, 32]} />
                <meshBasicMaterial transparent opacity={0.2} depthWrite={false} blending={THREE.AdditiveBlending} />
            </mesh>

            {/* Atom 2 (O) */}
            <mesh ref={atom2Ref}>
                 <sphereGeometry args={[0.6, 32, 32]} />
                 <meshPhongMaterial color="#ff0000" shininess={100} />
            </mesh>
            {/* Cloud 2 */}
            <mesh ref={cloud2Ref}>
                <sphereGeometry args={[0.6, 32, 32]} />
                <meshBasicMaterial transparent opacity={0.2} depthWrite={false} blending={THREE.AdditiveBlending} />
            </mesh>
            
            {/* Bond (Rotated Z=90 to lie on X) */}
            <mesh ref={bondRef} rotation={[0, 0, Math.PI / 2]}>
                 <cylinderGeometry args={[0.2, 0.2, 1, 32]} />
                 <meshPhongMaterial color="#aaaaaa" />
            </mesh>

            {/* Vector L (Yellow Arrow) pointing up Z */}
            <group ref={arrowRef} visible={false}>
                <arrowHelper args={[new THREE.Vector3(0,0,1), new THREE.Vector3(0,0,0), 1, 0xffff00]} />
            </group>
        </group>
    );
}

// Helper components for lights to avoid clutter
const AmbientLight = (props) => <ambientLight {...props} />;
const DirectionalLight = (props) => <directionalLight {...props} />;
