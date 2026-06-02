import { useMemo } from 'react';

export default function BerryMiniMap({ fillingFactor, bField }) {
    const width = 160;
    const height = 160;
    const isBZero = bField < 0.05;
    const chern = isBZero ? 0 : Math.floor(fillingFactor);

    // Calculate the d-vector winding loop (simplistic mapping for viz)
    const points = useMemo(() => {
        const pts = [];
        const resolution = 50;
        for (let i = 0; i <= resolution; i++) {
            const phi = (i / resolution) * Math.PI * 2;
            const r = 40 + Math.sin(phi * 3) * 5;
            // Winding relies on Chern number
            const winding = isBZero ? 0 : chern;
            const x = 80 + r * Math.cos(phi * winding);
            const y = 80 + r * Math.sin(phi * winding);
            pts.push(`${x},${y}`);
        }
        return pts.join(' ');
    }, [chern, isBZero]);

    return (
        <div style={{ 
            background: '#ffffff', 
            padding: '16px', 
            borderRadius: '24px', 
            border: '1px solid #ddd8ce', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)', 
            width: width + 32 
        }}>
            <h4 style={{ fontSize: '0.68rem', color: '#9333ea', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '1.2px', textAlign: 'center' }}>
                Momentum Space Winding
            </h4>
            
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                {/* Bloch Sphere background */}
                <circle cx={width/2} cy={height/2} r="60" fill="rgba(147, 51, 234, 0.03)" stroke="rgba(147, 51, 234, 0.15)" strokeDasharray="2,2" />
                <ellipse cx={width/2} cy={height/2} rx="60" ry="20" fill="none" stroke="rgba(147, 51, 234, 0.08)" strokeDasharray="1,2" />
                
                {/* Winding Loop */}
                <polyline 
                    points={points} 
                    fill="none" 
                    stroke="#a855f7" 
                    strokeWidth="2" 
                    strokeLinejoin="round"
                />

                {/* The Origin (Monopole) */}
                <circle cx={width/2} cy={height/2} r="4" fill="#ef4444" />
                
                <text x={width/2} y={height - 5} fill="#a855f7" fontSize="10" textAnchor="middle" fontWeight="bold">
                    CHERN INDEX: {isBZero ? "-" : chern}
                </text>
            </svg>

            <div style={{ fontSize: '0.65rem', color: '#555555', marginTop: '8px', lineHeight: '1.4' }}>
                The <b>Chern Number</b> is the number of times this momentum-loop wraps around the red monopole. Each wrap adds a conductivity of <b>e²/h</b>.
            </div>
        </div>
    );
}
