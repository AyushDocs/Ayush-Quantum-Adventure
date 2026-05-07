import { useState, useMemo, useCallback } from 'react';

export function useGrapheneState() {
    const [t1, setT1] = useState(1.0); // Nearest neighbor hopping
    const [t2, setT2] = useState(0.15); // Next-nearest neighbor
    const [phi, setPhi] = useState(Math.PI / 2); // Haldane Phase
    const [mass, setMass] = useState(0.0); // Semimetal to Insulator mass (M)
    const [showOrbitals, setShowOrbitals] = useState(true);

    const a1 = { x: Math.sqrt(3)/2, y: 3/2 };
    const a2 = { x: -Math.sqrt(3)/2, y: 3/2 };
    
    // Calculate Energy Bands E(k) for the Haldane Model
    const calculateEnergy = useCallback((kx, ky) => {
        // Nearest neighbor terms (d_x, d_y)
        const arg1 = kx * a1.x + ky * a1.y;
        const arg2 = kx * a2.x + ky * a2.y;
        const dx = t1 * (1 + Math.cos(arg1) + Math.cos(arg2));
        const dy = t1 * (Math.sin(arg1) + Math.sin(arg2));
        
        // Next-nearest neighbor term (d_z)
        const sinPhi = Math.sin(phi);
        const b1 = { x: Math.sqrt(3), y: 0 };
        const b2 = { x: -Math.sqrt(3)/2, y: 1.5 };
        const b3 = { x: -Math.sqrt(3)/2, y: -1.5 };
        
        const sumSin = Math.sin(kx * b1.x) + Math.sin(kx * b2.x + ky * b2.y) + Math.sin(kx * b3.x + ky * b3.y);
        const dz = mass - 2 * t2 * sinPhi * sumSin;
        
        const magnitude = Math.sqrt(dx*dx + dy*dy + dz*dz) + 1e-9;
        return { conduction: magnitude, valence: -magnitude, dx, dy, dz };
    }, [t1, t2, phi, mass, a1.x, a1.y, a2.x, a2.y]);

    const calculateBerryCurvature = useCallback((kx, ky) => {
        const h = 0.001;
        const e0 = calculateEnergy(kx, ky);
        const ex = calculateEnergy(kx + h, ky);
        const ey = calculateEnergy(kx, ky + h);

        const d = [e0.dx, e0.dy, e0.dz];
        const dkX = [(ex.dx - e0.dx)/h, (ex.dy - e0.dy)/h, (ex.dz - e0.dz)/h];
        const dkY = [(ey.dx - e0.dx)/h, (ey.dy - e0.dy)/h, (ey.dz - e0.dz)/h];

        // Cross product dkX x dkY
        const cross = [
            dkX[1] * dkY[2] - dkX[2] * dkY[1],
            dkX[2] * dkY[0] - dkX[0] * dkY[2],
            dkX[0] * dkY[1] - dkX[1] * dkY[0]
        ];

        // Dot product d . (dkX x dkY)
        const dot = d[0] * cross[0] + d[1] * cross[1] + d[2] * cross[2];
        const mag = Math.sqrt(d[0]**2 + d[1]**2 + d[2]**2);
        
        return 0.5 * dot / (mag**3 + 1e-6);
    }, [calculateEnergy]);

    const isTopological = useMemo(() => {
        // Haldane criterion: |M| < 3*sqrt(3) * t2 * |sin(phi)|
        return Math.abs(mass) < (3 * Math.sqrt(3) * t2 * Math.abs(Math.sin(phi)));
    }, [mass, t2, phi]);

    return {
        t1, setT1,
        t2, setT2,
        phi, setPhi,
        mass, setMass,
        showOrbitals, setShowOrbitals,
        calculateEnergy,
        calculateBerryCurvature,
        isTopological
    };
}
