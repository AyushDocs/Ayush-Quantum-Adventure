import { useState, useMemo } from 'react';

export function useHallState() {
    const [bField, setBField] = useState(1.5); 
    const [density, setDensity] = useState(2.0); 
    const [disorderStrength, setDisorderStrength] = useState(0.2); 
    const [temperature, setTemperature] = useState(0.1); 
    const [showEdgeStates, setShowEdgeStates] = useState(true);
    const [isFractional, setIsFractional] = useState(false);

    // nu = n * h / (e * B)
    const fillingFactor = useMemo(() => {
        if (Math.abs(bField) < 0.1) return 10;
        const rawNu = (density * 5.0) / bField;
        
        if (isFractional) {
            // Snap to common fractions: 1/3, 2/5, 3/7, 2/3, etc.
            const fractions = [1/3, 2/5, 3/7, 1/2, 2/3, 3/5, 1];
            let closest = fractions[0];
            let minDiff = Math.abs(rawNu - closest);
            fractions.forEach(f => {
                if (Math.abs(rawNu - f) < minDiff) {
                    minDiff = Math.abs(rawNu - f);
                    closest = f;
                }
            });
            return minDiff < 0.15 ? closest : rawNu;
        }
        return rawNu;
    }, [bField, density, isFractional]);

    const chernNumber = useMemo(() => {
        if (isFractional) return fillingFactor.toFixed(2);
        return Math.max(1, Math.floor(fillingFactor));
    }, [fillingFactor, isFractional]);

    // Rxx Peaks Logic: Peaks during transitions (when fillingFactor is near an integer + 0.5)
    // Rxx is zero on plateaus (near integer fillingFactor)
    const rxx = useMemo(() => {
        const distFromInteger = Math.abs(fillingFactor - Math.round(fillingFactor));
        // Peak width increases with temperature
        const peakWidth = 0.1 + temperature * 0.4;
        const peak = Math.exp(-Math.pow(distFromInteger - 0.5, 2) / (2 * peakWidth * peakWidth));
        
        // Base Rxx increases with temperature (thermal Smearing)
        return (peak + temperature * 0.5) * 50; 
    }, [fillingFactor, temperature]);

    // Energy levels
    const landauLevels = useMemo(() => {
        const spacing = bField * 0.5;
        return [...Array(8)].map((_, n) => spacing * (n + 0.5));
    }, [bField]);

    const fermiLevel = useMemo(() => {
        const spacing = bField * 0.5;
        // Fermi level follows density
        return (density * 0.6); 
    }, [density]);

    return {
        bField, setBField,
        density, setDensity,
        disorderStrength, setDisorderStrength,
        temperature, setTemperature,
        showEdgeStates, setShowEdgeStates,
        isFractional, setIsFractional,
        fillingFactor, 
        chernNumber, 
        rxx,
        landauLevels,
        fermiLevel
    };
}
