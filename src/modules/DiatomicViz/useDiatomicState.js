import { useEffect, useRef, useState } from 'react';
import { Constants } from './Physics/constants';
import { calculateRotationalEnergy } from './Physics/rotor';

export const useDiatomicState = () => {
    // Core State
    const [l, setL] = useState(0); // Angular momentum
    const [v, setV] = useState(0); // Vibrational level
    const [k, setK] = useState(1.0); // Stiffness
    const [n, setN] = useState(0); // Electronic state

    // Derived Physical Values (calculated on fly or memoized)
    // We use a ref for values updated in the animation loop to avoid re-renders
    // if we don't need to display them in React UI every frame.
    // However, for the "Math Panel", we might want periodic updates.
    
    // Animation Refs (for the visualizer to consume without reacting)
    const physicsRef = useRef({
        rotationAngle: 0,
        vibrationPhase: 0,
        r_current: 3.0,
        l, v, k, n
    });

    // Sync refs when state changes
    useEffect(() => {
        physicsRef.current.l = l;
        physicsRef.current.v = v;
        physicsRef.current.k = k;
        physicsRef.current.n = n;
    }, [l, v, k, n]);

    // Helpers
    const updateL = (newL) => {
        if (newL >= 0 && newL <= 20) setL(newL);
    };
    const updateV = (newV) => {
        if (newV >= 0 && newV <= 10) setV(newV);
    };
    const updateK = (newK) => setK(newK);
    const updateN = (newN) => setN(newN);

    // Energy Calcs for UI
    const getEnergies = () => {
        const E_rot = calculateRotationalEnergy(l);
        const omega_phys = Math.sqrt(k / Constants.reducedMass);
        const E_vib = (v + 0.5) * Constants.hbar * omega_phys;
        const E_total = E_rot + E_vib; // + Electronic E_n approximation
        // electronic gap?
        const gapElec = 100; 
        const E_elec = n * gapElec;
        return { E_rot, E_vib, E_elec, E_total: E_total + E_elec };
    };

    return {
        l, v, k, n,
        updateL, updateV, updateK, updateN,
        getEnergies,
        physicsRef
    };
};
