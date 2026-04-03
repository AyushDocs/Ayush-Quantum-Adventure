import { useState, useMemo } from 'react';
import { generateGridData, generateVectorFieldData, calculatePhaseSpace } from './Physics/berryLogic';

export const useBerryState = () => {
    const [mass, setMass] = useState(1.0);
    const [ax, setAx] = useState(0);
    const [ay, setAy] = useState(0);
    const [h, setH] = useState(0); // Exchange Splitting
    const [showExchange, setShowExchange] = useState(false);
    const [showVectorField, setShowVectorField] = useState(false);
    const [isCurvature3D, setIsCurvature3D] = useState(false);
    const [resolution, setResolution] = useState(40);

    const phaseSpaceData = useMemo(() => calculatePhaseSpace(50), []);

    const data = useMemo(() => {
        const h_eff = showExchange ? h : 0;
        return generateGridData(mass, ax, ay, h_eff, resolution);
    }, [mass, ax, ay, h, showExchange, resolution]);

    const vectorFieldData = useMemo(() => {
        if (!showVectorField) return null;
        return generateVectorFieldData(mass, ax, ay, 12);
    }, [mass, ax, ay, showVectorField]);

    // Calculate Chern number (numerical integration)
    const chernNumber = useMemo(() => {
        const { curvature } = data;
        let sum = 0;
        const dk = (2 * Math.PI) / resolution;
        const area = dk * dk;

        for (let i = 0; i < curvature.length - 1; i++) {
            for (let j = 0; j < curvature[i].length - 1; j++) {
                sum += curvature[i][j];
            }
        }
        
        return (sum * area) / (2 * Math.PI);
    }, [data, resolution]);

    return {
        mass,
        setMass,
        ax,
        setAx,
        ay,
        setAy,
        h,
        setH,
        showExchange,
        setShowExchange,
        showVectorField,
        setShowVectorField,
        isCurvature3D,
        setIsCurvature3D,
        phaseSpaceData,
        vectorFieldData,
        resolution,
        setResolution,
        data,
        chernNumber: Math.round(chernNumber * 100) / 100
    };
};
