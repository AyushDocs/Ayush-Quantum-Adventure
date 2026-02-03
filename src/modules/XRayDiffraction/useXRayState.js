import { useMemo, useRef, useState } from 'react';

export function useXRayState() {
    // Crystal orientation (Euler angles in degrees)
    const [theta, setTheta] = useState(0);
    const [phi, setPhi] = useState(0);
    const [psi, setPsi] = useState(0);
    
    // Lattice parameter (Angstroms)
    const [latticeParam, setLatticeParam] = useState(5.0);
    // Lattice Type
    const [latticeType, setLatticeType] = useState('SC'); // SC, BCC, FCC, Diamond
    
    // X-ray wavelength (Angstroms) - default Cu Kα
    const [wavelength, setWavelength] = useState(1.5418);
    
    // Auto-rotate toggle
    const [autoRotate, setAutoRotate] = useState(false);

    // Recording state
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const recordedFrames = useRef([]); // Stores video chunks
    const mediaRecorderRef = useRef(null);
    const canvasRef = useRef(null);

    // Ewald sphere radius (1/wavelength in reciprocal space)
    const ewaldRadius = useMemo(() => 1 / wavelength, [wavelength]);
    
    // Generate reciprocal lattice points based on selection rules (Structure Factor)
    // All are based on Cubic unit cell, filtering reflections that are forbidden
    const reciprocalLatticePoints = useMemo(() => {
        const points = [];
        const b = (2 * Math.PI) / latticeParam;
        
        // Increased range for "Disco" effect (more points)
        for (let h = -4; h <= 4; h++) {
            for (let k = -4; k <= 4; k++) {
                for (let l = -4; l <= 4; l++) {
                    // Skip origin
                    if (h === 0 && k === 0 && l === 0) continue;
                    
                    // Structure Factor Rules for Cubic Systems
                    let allowed = false;
                    
                    if (latticeType === 'SC') {
                        // All (h,k,l) allowed (Primitive)
                        allowed = true;
                    } else if (latticeType === 'BCC') {
                        // Allowed if h + k + l is even
                        allowed = (h + k + l) % 2 === 0;
                    } else if (latticeType === 'FCC') {
                        // Allowed if h, k, l are all odd or all even (unmixed)
                        const hEven = h % 2 === 0;
                        const kEven = k % 2 === 0;
                        const lEven = l % 2 === 0;
                        allowed = (hEven === kEven) && (kEven === lEven);
                    } else if (latticeType === 'Diamond') {
                        // FCC rules + basis selection
                        // 1. Must be FCC (unmixed)
                        const hEven = h % 2 === 0;
                        const kEven = k % 2 === 0;
                        const lEven = l % 2 === 0;
                        const isFCC = (hEven === kEven) && (kEven === lEven);
                        
                        if (isFCC) {
                            // 2. Additional Diamond rule:
                            // If all even: h+k+l must be divisible by 4
                            // If all odd: always allowed
                            if (hEven && kEven && lEven) {
                                allowed = (h + k + l) % 4 === 0;
                            } else {
                                allowed = true;
                            }
                        }
                    } else if (latticeType === 'Rhombohedral') {
                         // Approximating as Rhombohedral setup in hexagonal indexing usually,
                         // but for simple visual we can use Reverse Obverse setting -r h + k + l = 3n
                         // Let's stick to a simple Cubic approximation for now or leave it generic
                         // Actually, standard rhombohedral condition in hexagonal axes is -h+k+l=3n etc.
                         // But here we are generating points on orthogonal axes.
                         // Let's treat it as "Simple Cubic" geometry for now but maybe filtered?
                         // Actually, best to act like SC with a note, or restrict to cubic types.
                         // User asked for "SC, Rhombohedral etc", let's enable it as "SC-like" for now
                         // or maybe just omit selection rules if they differ significantly from cubic metric.
                         allowed = true; // Placeholder
                    }
                    
                    if (allowed) {
                        points.push({
                            h, k, l,
                            // Position in reciprocal space (unrotated)
                            x: h * b,
                            y: k * b,
                            z: l * b
                        });
                    }
                }
            }
        }
        
        return points;
    }, [latticeParam, latticeType]);
    
    // Rotate a point using Euler angles
    const rotatePoint = (x, y, z, thetaDeg, phiDeg, psiDeg) => {
        const toRad = Math.PI / 180;
        const th = thetaDeg * toRad;
        const ph = phiDeg * toRad;
        const ps = psiDeg * toRad;
        
        // Rotation matrix (ZYZ convention)
        const costh = Math.cos(th), sinth = Math.sin(th);
        const cosph = Math.cos(ph), sinph = Math.sin(ph);
        const cosps = Math.cos(ps), sinps = Math.sin(ps);
        
        // Apply rotation
        const x1 = x * (costh * cosps - sinth * cosph * sinps) +
                   y * (-costh * sinps - sinth * cosph * cosps) +
                   z * (sinth * sinph);
        
        const y1 = x * (sinth * cosps + costh * cosph * sinps) +
                   y * (-sinth * sinps + costh * cosph * cosps) +
                   z * (-costh * sinph);
        
        const z1 = x * (sinph * sinps) +
                   y * (sinph * cosps) +
                   z * (cosph);
        
        return { x: x1, y: y1, z: z1 };
    };
    
    // Calculate rotated positions and check diffraction condition
    const rotatedPoints = useMemo(() => {
        return reciprocalLatticePoints.map(point => {
            const rotated = rotatePoint(point.x, point.y, point.z, theta, phi, psi);
            
            // Diffraction condition: point must lie on Ewald sphere
            // Ewald sphere: centered at (-ewaldRadius, 0, 0), radius = ewaldRadius
            // THIS IS THE CORRECT GEOMETRY:
            // Lattice rotates around (0,0,0). Sphere is offset.
            // Distance check: from Sphere Center (-ewaldRadius, 0, 0)
            const dx = rotated.x + ewaldRadius; 
            const distSq = dx * dx + rotated.y * rotated.y + rotated.z * rotated.z;
            const radiusSq = ewaldRadius * ewaldRadius;
            
            // Tolerance for "touching" (3% of radius - tighter for better accuracy)
            const tolerance = ewaldRadius * 0.03;
            const isDiffracted = Math.abs(Math.sqrt(distSq) - ewaldRadius) < tolerance;
            
            return {
                ...point,
                rotatedX: rotated.x,
                rotatedY: rotated.y,
                rotatedZ: rotated.z,
                isDiffracted
            };
        });
    }, [reciprocalLatticePoints, theta, phi, psi, ewaldRadius]);
    
    // Get list of currently diffracted Miller indices
    const diffractedIndices = useMemo(() => {
        return rotatedPoints
            .filter(p => p.isDiffracted)
            .map(p => `(${p.h} ${p.k} ${p.l})`);
    }, [rotatedPoints]);
    
    return {
        theta, setTheta,
        phi, setPhi,
        psi, setPsi,
        latticeParam, setLatticeParam,
        latticeType, setLatticeType,
        wavelength, setWavelength,
        autoRotate, setAutoRotate,
        ewaldRadius,
        rotatedPoints,
        diffractedIndices,
        isRecording, setIsRecording,
        isPaused, setIsPaused,
        recordedFrames,
        mediaRecorderRef,
        canvasRef
    };
}
