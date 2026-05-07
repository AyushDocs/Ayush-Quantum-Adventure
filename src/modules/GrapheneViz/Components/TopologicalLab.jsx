import React, { useState, useEffect, useRef } from 'react';
import { Shield, Zap, Activity, Info, ArrowRightLeft } from 'lucide-react';

export default function TopologicalLab() {
    const [activeTab, setActiveTab] = useState('theory');

    return (
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '24px',
            padding: '24px',
            border: '1px solid rgba(255,255,255,0.05)',
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#3b82f6' }}>
                <Shield size={20} />
                <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Topological Lab</h3>
            </div>

            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '4px' }}>
                {['theory', 'simulation'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            flex: 1,
                            padding: '8px',
                            border: 'none',
                            background: activeTab === tab ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                            color: activeTab === tab ? '#3b82f6' : '#666',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        {tab.toUpperCase()}
                    </button>
                ))}
            </div>

            {activeTab === 'theory' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <TheoryItem 
                        title="Z2 Invariant" 
                        desc="TIs are classified by a binary 'Z2' index. 0 is trivial, 1 is topological." 
                    />
                    <TheoryItem 
                        title="Time-Reversal Symmetry" 
                        desc="TIs require T-symmetry. It ensures edge states are 'helical' and protected from backscattering." 
                    />
                    <TheoryItem 
                        title="Bulk-Boundary Correspondence" 
                        desc="The topological properties of the bulk force conductive states to exist on the edges." 
                    />
                </div>
            ) : (
                <HelicalEdgeSim />
            )}
        </div>
    );
}

function TheoryItem({ title, desc }) {
    return (
        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>{title}</div>
            <div style={{ fontSize: '0.7rem', color: '#888', lineHeight: '1.4' }}>{desc}</div>
        </div>
    );
}

function HelicalEdgeSim() {
    const canvasRef = useRef(null);
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let frame;

        // Init helical particles
        const initial = [];
        for (let i = 0; i < 10; i++) {
            initial.push({ x: Math.random() * 200, spin: 'up', speed: 1.5 });
            initial.push({ x: Math.random() * 200, spin: 'down', speed: -1.5 });
        }

        const draw = () => {
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Bulk (Insulating)
            ctx.fillStyle = 'rgba(59, 130, 246, 0.05)';
            ctx.fillRect(0, 20, canvas.width, 60);
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(0, 20, canvas.width, 60);
            ctx.setLineDash([]);

            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            ctx.font = '8px Inter';
            ctx.fillText("INSULATING BULK", 70, 55);

            // Helical Edge Channels
            initial.forEach(p => {
                p.x += p.speed;
                if (p.x > canvas.width) p.x = 0;
                if (p.x < 0) p.x = canvas.width;

                const y = p.spin === 'up' ? 10 : 90;
                const color = p.spin === 'up' ? '#3b82f6' : '#f43f5e';

                // Trail
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.globalAlpha = 0.3;
                ctx.moveTo(p.x - p.speed * 10, y);
                ctx.lineTo(p.x, y);
                ctx.stroke();

                // Particle
                ctx.globalAlpha = 1;
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(p.x, y, 3, 0, Math.PI * 2);
                ctx.fill();
                
                // Spin Arrow
                ctx.strokeStyle = '#fff';
                ctx.beginPath();
                if (p.spin === 'up') {
                    ctx.moveTo(p.x, y - 5); ctx.lineTo(p.x, y + 5);
                    ctx.moveTo(p.x - 2, y - 3); ctx.lineTo(p.x, y - 5); ctx.lineTo(p.x + 2, y - 3);
                } else {
                    ctx.moveTo(p.x, y - 5); ctx.lineTo(p.x, y + 5);
                    ctx.moveTo(p.x - 2, y + 3); ctx.lineTo(p.x, y + 5); ctx.lineTo(p.x + 2, y + 3);
                }
                ctx.stroke();
            });

            frame = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.7rem', color: '#aaa', textAlign: 'center', marginBottom: '5px' }}>
                Helical Edge Transport Simulation
            </div>
            <canvas ref={canvasRef} width={200} height={100} style={{ width: '100%', borderRadius: '12px', border: '1px solid #1a1a1a' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
                <div style={{ fontSize: '0.6rem', color: '#3b82f6' }}>Spin Up →</div>
                <div style={{ fontSize: '0.6rem', color: '#f43f5e' }}>← Spin Down</div>
            </div>
            <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', fontSize: '0.65rem', color: '#888', lineHeight: '1.4' }}>
                <ArrowRightLeft size={10} style={{ marginBottom: '4px' }} />
                <br/>
                Notice how electrons with opposite spins move in opposite directions. This prevents backscattering even if there are impurities!
            </div>
        </div>
    );
}
