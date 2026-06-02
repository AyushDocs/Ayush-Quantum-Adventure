import { useState, useMemo } from 'react';

export function useHallState() {
    const [bField, setBField] = useState(1.5); 
    const [density, setDensity] = useState(2.0); 
    const [disorderStrength, setDisorderStrength] = useState(0.2); 
    const [temperature, setTemperature] = useState(0.1); 
    const [showEdgeStates, setShowEdgeStates] = useState(true);

    // nu = n * h / (e * B)
    const fillingFactor = useMemo(() => {
        if (bField < 0.05) return 0;
        return density / bField;
    }, [bField, density]);

    const chernNumber = useMemo(() => {
        if (bField < 0.05) return 0;
        return Math.max(1, Math.floor(fillingFactor));
    }, [fillingFactor, bField]);

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
        fillingFactor, 
        chernNumber, 
        rxx,
        landauLevels,
        fermiLevel
    };
}
