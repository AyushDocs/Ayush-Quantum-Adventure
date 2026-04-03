import { useMemo } from 'react';

export default function HallPlateauPlot({ bField, density, chernNumber, rxx, temperature = 0.1 }) {
    const width = 450;
    const height = 300;
    
    // Calculate the paths for Rxy and Rxx
    const paths = useMemo(() => {
        let dRxy = `M 40 ${height - 40}`;
        let dRxx = `M 40 ${height - 40}`;
        const B_STEP = 0.05;
        
        for (let b = 0.1; b <= 5.0; b += B_STEP) {
            const filling = (density * 5.0) / b;
            const smearFactor = Math.min(1.0, temperature * 1.5);
            
            // Hall Resistance (Rxy)
            const nu = Math.max(1, Math.floor(filling));
            const R_quantum = (1 / nu) * 200;
            const R_classical = (b / 5.0) * 200;
            const currentRxy = R_quantum * (1 - smearFactor) + R_classical * smearFactor;
            const yRxy = height - 40 - currentRxy;
            dRxy += ` L ${40 + (b / 5.0) * (width - 60)} ${yRxy}`;

            // Longitudinal Resistance (Rxx)
            const dist = Math.abs(filling - Math.round(filling));
            const peakWidth = 0.1 + temperature * 0.4;
            const peak = Math.exp(-Math.pow(dist - 0.5, 2) / (2 * peakWidth * peakWidth));
            const currentRxx = peak * 80 + temperature * 20;
            const yRxx = height - 40 - currentRxx;
            dRxx += ` L ${40 + (b / 5.0) * (width - 60)} ${yRxx}`;
        }
        return { dRxy, dRxx };
    }, [density, height, width, temperature]);

    const currentX = 40 + (bField / 5.0) * (width - 60);

    return (
        <div style={{ 
            background: 'rgba(255,255,255,0.02)', 
            padding: '20px', 
            borderRadius: '16px', 
            border: '1px solid rgba(255,255,255,0.05)', 
            position: 'relative'
        }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                   Resistivity Tensor: R<sub>xy</sub> (Hall) & R<sub>xx</sub> (Long)
                </h3>
                <div style={{ display: 'flex', gap: '15px', fontSize: '0.7rem' }}>
                    <span style={{ color: '#10b981' }}>● R<sub>xy</sub></span>
                    <span style={{ color: '#f43f5e' }}>● R<sub>xx</sub></span>
                </div>
             </div>
            
            <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
                {/* Horizontal Level Markers */}
                {[1, 2, 3].map(nuMarker => {
                    const py = height - 40 - (1 / nuMarker) * 200;
                    return <line key={nuMarker} x1="40" y1={py} x2={width - 20} y2={py} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="2,2" />;
                })}

                {/* Rxx Path (Peaks) */}
                <path d={paths.dRxx} fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3,2" />
                
                {/* Rxy Path (Staircase) */}
                <path d={paths.dRxy} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* Current Marker Rxy */}
                <circle cx={currentX} cy={height - 40 - (1/Math.max(1, chernNumber))*200} r="4" fill="#10b981" />
                {/* Current Marker Rxx */}
                <circle cx={currentX} cy={height - 40 - (rxx || 0)} r="4" fill="#f43f5e" />

                <line x1={currentX} y1="20" x2={currentX} y2={height - 40} stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2,2" />

                {/* Axis Labels */}
                <line x1="40" y1={height - 40} x2={width - 10} y2={height - 40} stroke="#444" strokeWidth="1" />
                <line x1="40" y1="20" x2="40" y2={height - 40} stroke="#444" strokeWidth="1" />
                <text x={width/2} y={height - 10} fill="#666" fontSize="10" textAnchor="middle">MAGNETIC FIELD (B)</text>
            </svg>

            <div style={{ marginTop: '15px', fontSize: '0.75rem', color: '#888', lineHeight: '1.4' }}>
                <b>Experiment:</b> The red peaks in R<sub>xx</sub> occur during the phase transitions where energy gaps are closing.
            </div>
        </div>
    );
}
