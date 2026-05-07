import React, { useMemo } from 'react';

export default function LondonEquationsViz({ temp, isSuper }) {
    const Tc = 1.0;
    const lambda0 = 20; // Penetration depth at T=0 (visual pixels)
    
    const lambda = useMemo(() => {
        if (!isSuper) return Infinity;
        const ratio = temp / Tc;
        if (ratio >= 0.99) return 200; // Large but finite for visualization
        return lambda0 / Math.sqrt(1 - Math.pow(ratio, 4));
    }, [temp, isSuper, lambda0, Tc]);

    const width = 300;
    const height = 150;
    const surfaceX = 60;

    const points = useMemo(() => {
        const p = [];
        const Bext = 100; // Initial amplitude
        
        for (let x = 0; x < width - surfaceX; x++) {
            let b;
            if (!isSuper) {
                b = Bext; // Field stays constant inside normal metal
            } else {
                b = Bext * Math.exp(-x / lambda);
            }
            p.push(`${surfaceX + x},${height - 40 - b * 0.8}`);
        }
        return p.join(' ');
    }, [isSuper, lambda, width, height, surfaceX]);

    return (
        <div style={{ 
            background: 'rgba(0,0,0,0.4)', 
            padding: '20px', 
            borderRadius: '16px', 
            border: '1px solid rgba(255,255,255,0.05)',
            marginTop: '20px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h5 style={{ color: '#22d3ee', fontSize: '0.7rem', fontWeight: 'bold', margin: 0, textTransform: 'uppercase' }}>
                    London Penetration Depth (λ<sub>L</sub>)
                </h5>
                <div style={{ fontSize: '0.7rem', color: '#888', fontFamily: 'monospace' }}>
                    λ(T) = {isSuper ? lambda.toFixed(1) : '∞'} nm
                </div>
            </div>

            <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }}>
                {/* Surface of Superconductor */}
                <rect x={surfaceX} y={0} width={width - surfaceX} height={height} fill="rgba(34, 211, 238, 0.05)" />
                <line x1={surfaceX} y1={0} x2={surfaceX} y2={height} stroke="#22d3ee" strokeWidth="2" strokeDasharray={isSuper ? "" : "4 4"} />
                
                {/* Labels */}
                <text x={surfaceX - 10} y={height - 10} textAnchor="end" fill="#555" fontSize="10">VACUUM</text>
                <text x={surfaceX + 10} y={height - 10} textAnchor="start" fill="#22d3ee" fontSize="10" style={{ opacity: 0.6 }}>SUPERCONDUCTOR</text>

                {/* B-Field Curve */}
                <polyline 
                    points={points} 
                    fill="none" 
                    stroke={isSuper ? "#22d3ee" : "#f43f5e"} 
                    strokeWidth="2.5" 
                    style={{ transition: 'all 0.3s ease' }}
                />

                {/* Exponential Falloff shading */}
                {isSuper && (
                    <path 
                        d={`M ${surfaceX} ${height-40} ${points} L ${width} ${height-40} Z`} 
                        fill="rgba(34, 211, 238, 0.1)" 
                    />
                )}

                {/* Baseline */}
                <line x1={0} y1={height-40} x2={width} y2={height-40} stroke="#333" strokeWidth="1" />
                <text x={10} y={20} fill="#888" fontSize="9">B(x) = B₀ exp(-x/λ)</text>
            </svg>

            <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ fontSize: '0.65rem', color: '#666', lineHeight: '1.4' }}>
                    <b style={{ color: '#aaa' }}>Maxwell:</b> ∇ × B = μ₀ J<br/>
                    <b style={{ color: '#aaa' }}>London:</b> ∇ × J = -(n<sub>s</sub>e²/m)B
                </div>
                <div style={{ fontSize: '0.65rem', color: '#666', lineHeight: '1.4' }}>
                    <b style={{ color: '#aaa' }}>Result:</b> ∇²B = (1/λ²)B<br/>
                    <i style={{ color: '#22d3ee' }}>Exponential decay of B inside bulk.</i>
                </div>
            </div>
        </div>
    );
}
