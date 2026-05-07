import React, { useMemo, useState, useEffect } from 'react';

export default function ExcitonVisualizer({ mode = 'exciton' }) {
    const [time, setTime] = useState(0);

    useEffect(() => {
        let frame;
        const animate = () => {
            setTime(t => t + 0.05);
            frame = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(frame);
    }, []);

    // Physics constants for animation
    const orbitRadius = 40;
    const speed = 1.5;

    const particles = useMemo(() => {
        const p = [];
        const t = time * speed;

        switch(mode) {
            case 'exciton':
                // 1 Electron, 1 Hole orbiting each other
                p.push({ type: 'hole', x: Math.cos(t), y: Math.sin(t), r: 15 });
                p.push({ type: 'electron', x: Math.cos(t + Math.PI), y: Math.sin(t + Math.PI), r: 10 });
                break;
            case 'trion':
                // Exciton + 1 extra electron (negative trion)
                p.push({ type: 'hole', x: 0, y: 0, r: 15 });
                p.push({ type: 'electron', x: Math.cos(t), y: Math.sin(t), r: 10 });
                p.push({ type: 'electron', x: Math.cos(t + Math.PI), y: Math.sin(t + Math.PI), r: 10 });
                break;
            case 'biexciton':
                // 2 Electrons, 2 Holes
                // Two orbiting pairs
                const offset = 60;
                p.push({ type: 'hole', x: Math.cos(t) - 1, y: Math.sin(t), r: 15, group: 1 });
                p.push({ type: 'electron', x: Math.cos(t + Math.PI) - 1, y: Math.sin(t + Math.PI), r: 10, group: 1 });
                p.push({ type: 'hole', x: Math.cos(t + 0.5) + 1, y: Math.sin(t + 0.5), r: 15, group: 2 });
                p.push({ type: 'electron', x: Math.cos(t + Math.PI + 0.5) + 1, y: Math.sin(t + Math.PI + 0.5), r: 10, group: 2 });
                break;
            case 'charged-biexciton':
                // 2 Holes, 3 Electrons (or vice versa)
                p.push({ type: 'hole', x: -0.5, y: -0.5, r: 15 });
                p.push({ type: 'hole', x: 0.5, y: 0.5, r: 15 });
                p.push({ type: 'electron', x: Math.cos(t), y: Math.sin(t), r: 10 });
                p.push({ type: 'electron', x: Math.cos(t + 2), y: Math.sin(t + 2), r: 10 });
                p.push({ type: 'electron', x: Math.cos(t + 4), y: Math.sin(t + 4), r: 10 });
                break;
        }
        return p;
    }, [mode, time]);

    return (
        <div style={{ 
            width: '100%', 
            height: '400px', 
            background: '#08080a', 
            borderRadius: '24px', 
            border: '1px solid #1a1a1a',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {/* Background Glow */}
            <div style={{ 
                position: 'absolute', 
                width: '300px', 
                height: '300px', 
                background: 'radial-gradient(circle, rgba(96, 165, 250, 0.05) 0%, transparent 70%)',
                filter: 'blur(50px)'
            }} />

            <svg viewBox="-150 -150 300 300" style={{ width: '100%', height: '100%' }}>
                {/* Bonds/Links */}
                {particles.map((p1, i) => 
                    particles.slice(i + 1).map((p2, j) => {
                        const dist = Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2);
                        if (dist < 3.5) { // Visual threshold for bonding
                            return (
                                <line 
                                    key={`link-${i}-${j}`}
                                    x1={p1.x * orbitRadius} y1={p1.y * orbitRadius}
                                    x2={p2.x * orbitRadius} y2={p2.y * orbitRadius}
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth="1"
                                    strokeDasharray="4 2"
                                />
                            );
                        }
                        return null;
                    })
                )}

                {/* Particles */}
                {particles.map((p, i) => (
                    <g key={i}>
                        {/* Glow */}
                        <circle 
                            cx={p.x * orbitRadius} cy={p.y * orbitRadius} 
                            r={p.r + 5} 
                            fill={p.type === 'electron' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(244, 63, 94, 0.2)'}
                        />
                        {/* Core */}
                        <circle 
                            cx={p.x * orbitRadius} cy={p.y * orbitRadius} 
                            r={p.r} 
                            fill={p.type === 'electron' ? '#3b82f6' : '#f43f5e'} 
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="2"
                        />
                        {/* Charge Symbol */}
                        <text 
                            x={p.x * orbitRadius} y={p.y * orbitRadius + 4} 
                            textAnchor="middle" 
                            fill="white" 
                            fontSize="12" 
                            fontWeight="bold"
                            style={{ pointerEvents: 'none' }}
                        >
                            {p.type === 'electron' ? '−' : '+'}
                        </text>
                    </g>
                ))}
            </svg>

            {/* Labels */}
            <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%' }} />
                    <span style={{ fontSize: '0.65rem', color: '#888' }}>Electron</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '8px', height: '8px', background: '#f43f5e', borderRadius: '50%' }} />
                    <span style={{ fontSize: '0.65rem', color: '#888' }}>Hole</span>
                </div>
            </div>
        </div>
    );
}
