import React, { useState, useRef, useEffect } from 'react';
import { Box, Zap, Shield, Activity, BookOpen, Layers } from 'lucide-react';

export default function TopologicalApp3D() {
    const [view, setView] = useState('surface-states');
    const [bField, setBField] = useState(0);
    const [fermiLevel, setFermiLevel] = useState(0);

    return (
        <div style={{
            background: '#050505',
            minHeight: '100vh',
            color: '#fff',
            padding: '40px',
            fontFamily: 'Inter, sans-serif'
        }}>
            {/* Header */}
            <div style={{ marginBottom: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#a855f7', marginBottom: '10px' }}>
                        <Box size={24} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Quantum Topology Lab</span>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-2px', margin: 0 }}>
                        3D TOPOLOGICAL <span style={{ color: '#a855f7' }}>INSULATOR</span>
                    </h1>
                    <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '10px', maxWidth: '600px' }}>
                        The surface of a 3D TI is a topological metal hosting a single Dirac cone where spin and momentum are inextricably locked.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <TabButton active={view === 'surface-states'} onClick={() => setView('surface-states')} icon={<Activity size={16}/>} label="Surface States" />
                    <TabButton active={view === 'theory'} onClick={() => setView('theory')} icon={<BookOpen size={16}/>} label="3D Theory" />
                </div>
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
                
                {/* Left Column: Visualizers */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {view === 'surface-states' ? (
                        <div style={{ 
                            background: 'rgba(255,255,255,0.02)', 
                            borderRadius: '32px', 
                            padding: '40px', 
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#555', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>Real Space Crystal</div>
                                    <SurfaceStateViz bField={bField} />
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#555', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>Spin-Momentum Locking</div>
                                    <DiracCone3DViz bField={bField} fermiLevel={fermiLevel} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '40px' }}>
                                <div style={{ padding: '24px', background: 'rgba(168, 85, 247, 0.05)', borderRadius: '16px', borderLeft: '4px solid #a855f7' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <h4 style={{ color: '#a855f7', fontSize: '0.8rem', fontWeight: 'bold', margin: 0 }}>FERMI LEVEL (E<sub>f</sub>)</h4>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{fermiLevel.toFixed(2)} eV</div>
                                    </div>
                                    <input 
                                        type="range" min="-1" max="1" step="0.01" value={fermiLevel} 
                                        onChange={(e) => setFermiLevel(parseFloat(e.target.value))}
                                        style={{ width: '100%', accentColor: '#a855f7', marginBottom: '10px' }}
                                    />
                                    <p style={{ fontSize: '0.7rem', color: '#888' }}>Adjusting the energy level shifts the <b>Fermi Circle</b> and changes the density of states.</p>
                                </div>

                                <div style={{ padding: '24px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '16px', borderLeft: '4px solid #3b82f6' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <h4 style={{ color: '#3b82f6', fontSize: '0.8rem', fontWeight: 'bold', margin: 0 }}>MAGNETIC FIELD (B<sub>z</sub>)</h4>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{bField.toFixed(2)} T</div>
                                    </div>
                                    <input 
                                        type="range" min="0" max="1" step="0.01" value={bField} 
                                        onChange={(e) => setBField(parseFloat(e.target.value))}
                                        style={{ width: '100%', accentColor: '#3b82f6', marginBottom: '10px' }}
                                    />
                                    <p style={{ fontSize: '0.7rem', color: '#888' }}>Applying B<sub>z</sub> opens a gap at the Dirac point: <b>E = ±√(k² + Δ²)</b>.</p>
                                </div>
                            </div>

                            <div style={{ marginTop: '40px', padding: '30px', background: 'rgba(0,0,0,0.3)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h4 style={{ color: '#a855f7', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase' }}>Surface State Dispersion</h4>
                                <div style={{ 
                                    fontSize: '1.8rem', 
                                    fontFamily: 'serif', 
                                    textAlign: 'center', 
                                    margin: '20px 0',
                                    color: '#fff',
                                    background: 'rgba(255,255,255,0.02)',
                                    padding: '30px',
                                    borderRadius: '16px'
                                }}>
                                    E = ±v<sub>f</sub> √(k<sub>x</sub>² + k<sub>y</sub>²)
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                                        <b style={{ color: '#a855f7', fontSize: '0.75rem' }}>Helical Transport</b>
                                        <p style={{ fontSize: '0.75rem', color: '#888', margin: '5px 0' }}>Both <b>Forward</b> (+k) and <b>Backward</b> (-k) modes exist, but they have opposite spins. This is a TI surface.</p>
                                    </div>
                                    <div style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                                        <b style={{ color: '#a855f7', fontSize: '0.75rem' }}>Chiral Transport</b>
                                        <p style={{ fontSize: '0.75rem', color: '#888', margin: '5px 0' }}>Only <b>one mode</b> (e.g. forward) exists at an edge. This occurs in the Quantum Hall effect.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ 
                            background: 'rgba(255,255,255,0.02)', 
                            borderRadius: '32px', 
                            padding: '40px', 
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '25px' }}>Topological Classification of 3D Bulk</h3>
                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                 <TheoryCard 
                                    title="Zero B-field Protection" 
                                    desc="TIs are 'Time-Reversal Protected.' Unlike QHE, they require NO external magnetic field to exhibit topological transport." 
                                 />
                                 <TheoryCard 
                                    title="Strong TI (ν₀ = 1)" 
                                    desc="A robust phase that hosts an odd number of Dirac cones on its surface. It is immune to any non-magnetic disorder." 
                                 />
                                 <TheoryCard 
                                    title="Helical vs Chiral" 
                                    desc="Helical states (TI) have both k and -k partners with locked spins. Chiral states (QHE) move in only one direction per edge." 
                                 />
                                 <TheoryCard 
                                    title="π Berry Phase" 
                                    desc="Moving an electron in a full circle in k-space results in a phase shift of π, leading to destructive interference for backscattering paths." 
                                 />
                             </div>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div style={{ background: '#0a0a0a', padding: '30px', borderRadius: '24px', border: '1px solid #111' }}>
                         <h4 style={{ color: '#a855f7', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase' }}>Key Characteristics</h4>
                         <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <FeatureItem icon={<Layers size={16}/>} text="Surface-Bulk Correspondence" />
                            <FeatureItem icon={<Zap size={16}/>} text="Zero Backscattering" />
                            <FeatureItem icon={<Activity size={16}/>} text="Dirac Fermions" />
                         </ul>
                         <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                            <p style={{ fontSize: '0.7rem', color: '#a855f7', margin: 0, lineHeight: '1.4' }}>
                                <b>Self-Sustaining:</b> TIs are intrinsic topological phases. They work without external magnetic fields.
                            </p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SurfaceStateViz({ bField = 0 }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let frame;

        const draw = () => {
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const time = Date.now() * 0.001;

            const project = (x, y, z) => {
                const rx = 0.5;
                const ry = time * 0.2;
                const x1 = x * Math.cos(ry) - z * Math.sin(ry);
                const z1 = x * Math.sin(ry) + z * Math.cos(ry);
                const y1 = y * Math.cos(rx) - z1 * Math.sin(rx);
                const z2 = y * Math.sin(rx) + z1 * Math.cos(rx);
                const f = 300 / (z2 + 400); // Adjusted for larger canvas
                return { x: cx + x1 * f * 150, y: cy + y1 * f * 150 }; // Scaled up to 150
            };

            const vertices = [
                [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
                [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
            ];
            const edges = [
                [0,1], [1,2], [2,3], [3,0], [4,5], [5,6], [6,7], [7,4], [0,4], [1,5], [2,6], [3,7]
            ];

            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            edges.forEach(([i, j]) => {
                const p1 = project(...vertices[i]);
                const p2 = project(...vertices[j]);
                ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
            });

            // Effect of B-field on surface current
            const surfaceOpacity = Math.max(0, 1 - bField * 2);
            const topFace = [4, 5, 6, 7];
            ctx.fillStyle = `rgba(168, 85, 247, ${0.1 * surfaceOpacity})`;
            ctx.beginPath();
            topFace.forEach((idx, i) => {
                const p = project(...vertices[idx]);
                if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
            });
            ctx.closePath(); ctx.fill();

            // Surface Particles
            if (surfaceOpacity > 0.1) {
                for(let i=0; i<10; i++) {
                    const t = (time * 0.5 + i/10) % 1;
                    const x = Math.cos(t * Math.PI * 2);
                    const z = Math.sin(t * Math.PI * 2);
                    const p = project(x, -1, z);
                    ctx.globalAlpha = surfaceOpacity;
                    ctx.fillStyle = '#a855f7';
                    ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI*2); ctx.fill(); // Larger particles
                    ctx.globalAlpha = 1;
                }
            } else {
                ctx.fillStyle = '#3b82f6';
                ctx.font = 'bold 12px Inter';
                ctx.textAlign = 'center';
                const p = project(0, -1.2, 0);
                ctx.fillText("SURFACE GAPPED (TRS BROKEN)", p.x, p.y);
            }

            frame = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(frame);
    }, [bField]);

    return <canvas ref={canvasRef} width={600} height={600} style={{ width: '100%', borderRadius: '24px' }} />;
}

function DiracCone3DViz({ bField = 0, fermiLevel = 0 }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let frame;

        const draw = () => {
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const time = Date.now() * 0.001;

            const project = (kx, ky, e) => {
                const rot = time * 0.3;
                const kx1 = kx * Math.cos(rot) - ky * Math.sin(rot);
                const ky1 = kx * Math.sin(rot) + ky * Math.cos(rot);
                const x = kx1 * 140; // Scaled up to 140
                const y = e * 100;   // Scaled up to 100
                const z = ky1 * 140; // Scaled up to 140
                const f = 300 / (z + 500); 
                return { x: cx + x * f, y: cy - y * f };
            };

            const gap = bField * 0.4;

            // Draw Cones with hyperbolic gapping
            const drawCone = (isTop) => {
                ctx.strokeStyle = isTop ? 'rgba(168, 85, 247, 0.2)' : 'rgba(59, 130, 246, 0.15)';
                for (let r = 0; r <= 1.5; r += 0.3) {
                    ctx.beginPath();
                    for (let a = 0; a <= Math.PI * 2; a += 0.2) {
                        const e = Math.sqrt(r*r + gap*gap);
                        const p = project(r * Math.cos(a), r * Math.sin(a), isTop ? e : -e);
                        if (a === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
                    }
                    ctx.closePath(); ctx.stroke();
                }
            };

            drawCone(true);
            drawCone(false);

            // LABELS
            ctx.font = 'bold 12px Inter';
            ctx.textAlign = 'center';
            
            // Conduction/Valence Labels
            const cp = project(0, 0, 1.8);
            ctx.fillStyle = '#a855f7';
            ctx.fillText("CONDUCTION BAND", cp.x, cp.y - 15);
            
            const vp = project(0, 0, -1.8);
            ctx.fillStyle = '#3b82f6';
            ctx.fillText("VALENCE BAND", vp.x, vp.y + 30);

            // Dirac Point
            const dp = project(0, 0, gap);
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(dp.x, dp.y, 4, 0, Math.PI*2); ctx.fill();
            ctx.fillText("DIRAC POINT", dp.x, dp.y - 15);

            // Draw Fermi Circle
            if (Math.abs(fermiLevel) > gap) {
                const kFermi = Math.sqrt(fermiLevel*fermiLevel - gap*gap);
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                for (let a = 0; a <= Math.PI * 2; a += 0.1) {
                    const p = project(kFermi * Math.cos(a), kFermi * Math.sin(a), fermiLevel);
                    if (a === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
                }
                ctx.closePath(); ctx.stroke();
                ctx.setLineDash([]);
                
                // Label
                const lp = project(kFermi, 0, fermiLevel);
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 12px Inter';
                ctx.fillText("Fermi Circle", lp.x + 15, lp.y);
            }

            // SPIN-MOMENTUM LOCKING PARTICLES
            const drawParticles = (isTop) => {
                const energy = isTop ? Math.max(gap + 0.2, Math.abs(fermiLevel)) : -Math.max(gap + 0.2, Math.abs(fermiLevel));
                const r = Math.sqrt(energy*energy - gap*gap);
                const particleCount = 4;
                const color = isTop ? '#a855f7' : '#3b82f6';
                
                for(let i=0; i<particleCount; i++) {
                    const angle = (time * (isTop ? 0.8 : -0.6) + (i/particleCount) * Math.PI * 2);
                    const kx = r * Math.cos(angle);
                    const ky = r * Math.sin(angle);
                    const p = project(kx, ky, energy);

                    // Electron
                    ctx.fillStyle = '#fff';
                    ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI*2); ctx.fill(); // Larger electron

                    // Spin Arrow
                    const hel = isTop ? 1 : -1;
                    const sx = ky * 45 * hel; // Longer arrows
                    const sy = -kx * 45 * hel;
                    
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 3; // Thicker arrows
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x + sx * 0.5, p.y - sy * 0.2);
                    ctx.stroke();
                    
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(p.x + sx * 0.5, p.y - sy * 0.2, 4, 0, Math.PI*2);
                    ctx.fill();
                }
            };

            drawParticles(true);
            drawParticles(false);

            frame = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(frame);
    }, [bField, fermiLevel]);

    return <canvas ref={canvasRef} width={600} height={600} style={{ width: '100%', borderRadius: '24px' }} />;
}

function TabButton({ active, onClick, icon, label }) {
    return (
        <button 
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '16px',
                background: active ? '#a855f7' : 'rgba(255,255,255,0.03)',
                color: active ? '#fff' : '#888',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
            }}
        >
            {icon}
            {label}
        </button>
    );
}

function TheoryCard({ title, desc }) {
    return (
        <div style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ color: '#a855f7', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '10px' }}>{title}</h4>
            <p style={{ fontSize: '0.8rem', color: '#888', lineHeight: '1.6' }}>{desc}</p>
        </div>
    );
}

function FeatureItem({ icon, text }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: '#a855f7' }}>{icon}</div>
            <span style={{ fontSize: '0.85rem', color: '#ccc' }}>{text}</span>
        </div>
    );
}
