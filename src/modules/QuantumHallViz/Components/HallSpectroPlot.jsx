import { useMemo } from 'react';

export default function HallSpectroPlot({ landauLevels, fermiLevel, bField }) {
    const width = 400;
    const height = 250;
    
    return (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
            <h3 style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
               Landau Level Spectroscopy
            </h3>
            
            <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
                {/* Axis */}
                <line x1="40" y1={height - 40} x2={width - 20} y2={height - 40} stroke="#444" strokeWidth="1" />
                <line x1="40" y1="20" x2="40" y2={height - 40} stroke="#444" strokeWidth="1" />
                <text x="50" y="30" fill="#666" fontSize="10" transform="rotate(-90 40 40) translate(-50, -45)">ENERGY (E)</text>
                <text x={width/2} y={height - 10} fill="#666" fontSize="10" textAnchor="middle">DENSITY OF STATES</text>

                {/* Landau Levels */}
                {landauLevels.map((E, n) => {
                    const y = height - 40 - (E * 25);
                    const isFilled = E < fermiLevel;
                    
                    return (
                        <g key={n}>
                            {/* Gaussian Broadening (Disorder) */}
                            <rect 
                                x="40" 
                                y={y - 12} 
                                width={width - 60} 
                                height="24" 
                                fill={isFilled ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.05)'} 
                                rx="4"
                            />
                            {/* The Discrete Level */}
                            <line 
                                x1="40" 
                                y1={y} 
                                x2={width - 20} 
                                y2={y} 
                                stroke={isFilled ? '#10b981' : '#3b82f6'} 
                                strokeWidth="2" 
                                strokeDasharray={isFilled ? '0' : '4,2'}
                            />
                            <text x="15" y={y + 4} fill="#888" fontSize="10">n={n}</text>
                        </g>
                    );
                })}

                {/* Fermi Level (E_F) */}
                <g style={{ transition: 'all 0.5s ease' }}>
                    <line 
                        x1="40" 
                        y1={height - 40 - (fermiLevel * 25)} 
                        x2={width - 20} 
                        y2={height - 40 - (fermiLevel * 25)} 
                        stroke="#f43f5e" 
                        strokeWidth="1.5" 
                        strokeDasharray="4,4"
                    />
                    <text x={width - 80} y={height - 40 - (fermiLevel * 25) - 8} fill="#f43f5e" fontSize="11" fontWeight="bold">FERMI LEVEL E_F</text>
                </g>
            </svg>

            <div style={{ marginTop: '15px', fontSize: '0.75rem', color: '#666' }}>
                B-Field is forcing states into tight energy peaks. The <b>Hall Plateaus</b> happen when the Fermi Level is trapped in the gap between these levels.
            </div>
        </div>
    );
}
