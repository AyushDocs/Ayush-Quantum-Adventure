import { useState, useMemo } from 'react';

export function useWeylState() {
    const [nodeSeparation, setNodeSeparation] = useState(1.2);
    const [bField, setBField] = useState(0.0);
    const [tilt, setTilt] = useState(0.0);
    const [showArcs, setShowArcs] = useState(true);
    const [phi, setPhi] = useState(0);

    // Calculate Weyl Node positions in 3D Momentum Space (kx, ky, kz)
    const weylNodes = useMemo(() => {
        // Shift nodes based on magnetic field (Chiral Anomaly / Zeeman shift)
        const shift = bField * 0.5;
        return [
            { id: 'W+', pos: [0, 0, (nodeSeparation / 2) + shift], chirality: +1, color: '#8b5cf6' },
            { id: 'W-', pos: [0, 0, -(nodeSeparation / 2) - shift], chirality: -1, color: '#3b82f6' }
        ];
    }, [nodeSeparation, bField]);

    // Generate Fermi Arc path (projection on surface BZ)
    // For simplicity, we'll assume the top surface (kz = some constant)
    const fermiArcPoints = useMemo(() => {
        const points = [];
        const segments = 20;
        const [w1, w2] = weylNodes;
        
        // The arc connects the (kx, ky) projections of w1 and w2
        const start = [w1.pos[0], w1.pos[1]];
        const end = [w2.pos[0], w2.pos[1]];
        
        // Add some curvature based on the tilt
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const x = start[0] + (end[0] - start[0]) * t;
            const y = start[1] + (end[1] - start[1]) * t + Math.sin(t * Math.PI) * tilt * 0.5;
            points.push([x, y, 1.0]); // Fixed kz for surface
        }
        return points;
    }, [weylNodes, tilt]);

    return {
        nodeSeparation, setNodeSeparation,
        bField, setBField,
        tilt, setTilt,
        showArcs, setShowArcs,
        phi, setPhi,
        weylNodes,
        fermiArcPoints
    };
}
