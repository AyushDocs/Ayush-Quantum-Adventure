import { useMemo } from 'react';

export default function BerryMiniMap({ fillingFactor }) {
    const width = 160;
    const height = 160;
    const chern = Math.floor(fillingFactor);

    // Calculate the d-vector winding loop (simplistic mapping for viz)
    const points = useMemo(() => {
        const pts = [];
        const resolution = 50;
        for (let i = 0; i <= resolution; i++) {
            const phi = (i / resolution) * Math.PI * 2;
            const r = 40 + Math.sin(phi * 3) * 5;
            // Winding relies on Chern number
            const x = 80 + r * Math.cos(phi * chern);
            const y = 80 + r * Math.sin(phi * chern);
            pts.push(`${x},${y}`);
        }
        return pts.join(' ');
    }, [chern]);

    return (
        <div style={{ background: 'rgba(0,0,0,0.8)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(147, 51, 234, 0.3)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', width: width + 30 }}>
            <h4 style={{ fontSize: '0.65rem', color: '#9333ea', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '1px', textAlign: 'center' }}>
                Momentum Space Winding
            </h4>
            
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                {/* Bloch Sphere background */}
                <circle cx={width/2} cy={height/2} r="60" fill="rgba(147, 51, 234, 0.05)" stroke="rgba(147, 51, 234, 0.2)" strokeDasharray="2,2" />
                <ellipse cx={width/2} cy={height/2} rx="60" ry="20" fill="none" stroke="rgba(147, 51, 234, 0.1)" strokeDasharray="1,2" />
                
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
                    CHERN INDEX: {chern}
                </text>
            </svg>

            <div style={{ fontSize: '0.6rem', color: '#666', marginTop: '8px', lineHeight: '1.3' }}>
                The **Chern Number** is the number of times this momentum-loop wraps around the red monopole. Each wrap adds a conductivity of **e²/h**.
            </div>
        </div>
    );
}
