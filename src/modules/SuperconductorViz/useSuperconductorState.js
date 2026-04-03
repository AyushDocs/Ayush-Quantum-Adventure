import { useState, useMemo } from 'react';

export function useSuperconductorState() {
    const [temp, setTemp] = useState(0.8); // T/Tc
    const [field, setField] = useState(0.1); // B field (arbitrary units)
    
    // Critical Fields (simplified Type-II)
    const Bc1 = useMemo(() => 0.2 * (1 - Math.pow(temp, 2)), [temp]);
    const Bc2 = useMemo(() => 0.8 * (1 - Math.pow(temp, 2)), [temp]);

    // BCS Energy Gap: Delta(T)
    const gap = useMemo(() => {
        if (temp >= 1.0) return 0;
        return 1.74 * Math.sqrt(Math.max(0, 1 - temp));
    }, [temp]);

    // Meissner Expulsion (Magnetic exclusion)
    const expulsion = useMemo(() => {
        if (temp >= 1.0 || field >= Bc2) return 0;
        if (field < Bc1) return 1 - Math.pow(temp, 4);
        // Vortex state: partial exclusion
        const ratio = (Bc2 - field) / (Bc2 - Bc1);
        return Math.max(0, ratio * (1 - Math.pow(temp, 4)));
    }, [temp, field, Bc1, Bc2]);

    const isSuper = temp < 1.0 && field < Bc2;
    const isVortexState = isSuper && field > Math.max(0, Bc1);

    return {
        temp, setTemp,
        field, setField,
        gap,
        expulsion,
        isSuper,
        isVortexState,
        Bc1, Bc2
    };
}

