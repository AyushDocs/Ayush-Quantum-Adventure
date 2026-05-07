import React, { useState, useRef, useEffect } from 'react';
import { Target, Zap, Activity, BookOpen, Circle, Maximize2, Minimize2 } from 'lucide-react';

export default function FermiLiquidApp() {
    const [view, setView] = useState('surface');
    const [density, setDensity] = useState(0.5); // Electron density -> Fermi level
    const [interaction, setInteraction] = useState(0.2); // Landau F0 parameter

    const fermiRadius = Math.pow(density * 1000, 1/3) * 5;

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#10b981', marginBottom: '10px' }}>
                        <Circle size={24} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Quantum Statistics</span>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-2px', margin: 0 }}>
                        FERMI <span style={{ color: '#10b981' }}>LIQUIDS</span>
                    </h1>
                    <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '10px', maxWidth: '600px' }}>
                        From the non-interacting Fermi Gas to Landau's Quasiparticles. Why electrons in a metal still behave like free particles.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <TabButton active={view === 'surface'} onClick={() => setView('surface')} icon={<Maximize2 size={16}/>} label="Fermi Surface" />
                    <TabButton active={view === 'exclusion'} onClick={() => setView('exclusion')} icon={<Minimize2 size={16}/>} label="Pauli Exclusion" />
                    <TabButton active={view === 'theory'} onClick={() => setView('theory')} icon={<BookOpen size={16}/>} label="Landau Theory" />
                </div>
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
                
                {/* Left Column: Visualizers */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {view === 'surface' ? (
                        <div style={{ 
                            background: 'rgba(255,255,255,0.02)', 
                            borderRadius: '32px', 
                            padding: '40px', 
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#10b981' }}>The Fermi Sphere (k-space)</h3>
                            <FermiSurfaceViz radius={fermiRadius} interaction={interaction} />
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '40px' }}>
                                <div style={{ padding: '24px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '16px', borderLeft: '4px solid #10b981' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <h4 style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 'bold', margin: 0 }}>DENSITY (n)</h4>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{density.toFixed(2)}</div>
                                    </div>
                                    <input 
                                        type="range" min="0.1" max="1" step="0.01" value={density} 
                                        onChange={(e) => setDensity(parseFloat(e.target.value))}
                                        style={{ width: '100%', accentColor: '#10b981', marginBottom: '10px' }}
                                    />
                                    <p style={{ fontSize: '0.7rem', color: '#888' }}>Increasing density grows the <b>Fermi Radius</b> (k<sub>F</sub>).</p>
                                </div>

                                <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '16px', borderLeft: '4px solid #fff' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <h4 style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 'bold', margin: 0 }}>LANDAU INTERACTION (F₀)</h4>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{interaction.toFixed(2)}</div>
                                    </div>
                                    <input 
                                        type="range" min="0" max="1" step="0.01" value={interaction} 
                                        onChange={(e) => setInteraction(parseFloat(e.target.value))}
                                        style={{ width: '100%', accentColor: '#fff', marginBottom: '10px' }}
                                    />
                                    <p style={{ fontSize: '0.7rem', color: '#888' }}>Interactions renormalize the <b>Effective Mass</b> (m*) of the quasiparticles.</p>
                                </div>
                            </div>
                        </div>
                    ) : view === 'exclusion' ? (
                        <div style={{ 
                            background: 'rgba(255,255,255,0.02)', 
                            borderRadius: '32px', 
                            padding: '40px', 
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}>
                             <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#10b981' }}>Pauli Exclusion: Energy Filling</h3>
                             <ExclusionViz radius={fermiRadius} />
                             <div style={{ marginTop: '30px', padding: '24px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '20px' }}>
                                 <h4 style={{ fontSize: '1rem', color: '#10b981', marginBottom: '10px' }}>Why Metals are Stable</h4>
                                 <p style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: '1.6', margin: 0 }}>
                                    Fermions (like electrons) are forbidden from occupying the same quantum state. As we add electrons, they are forced into higher and higher energy levels, even at absolute zero. The highest energy level is the **Fermi Energy ($E_F$)**.
                                 </p>
                             </div>
                        </div>
                    ) : (
                        <div style={{ 
                            background: 'rgba(255,255,255,0.02)', 
                            borderRadius: '32px', 
                            padding: '40px', 
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                             <h3 style={{ fontSize: '1.5rem', marginBottom: '25px' }}>Landau's Fermi Liquid Theory</h3>
                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                 <TheoryCard 
                                    title="Quasiparticles" 
                                    desc="A quasiparticle is an electron 'dressed' by its interactions with others. It has the same charge and spin, but a different (effective) mass m*." 
                                 />
                                 <TheoryCard 
                                    title="Adiabatic Continuity" 
                                    desc="Landau's big insight: as you slowly turn on interactions, the states of a free Fermi Gas transform 1-to-1 into the states of a Fermi Liquid." 
                                 />
                                 <TheoryCard 
                                    title="Specific Heat (Cᵥ ∝ T)" 
                                    desc="In a Fermi Liquid, only electrons near the Fermi surface can be excited. This leads to a linear temperature dependence of specific heat." 
                                 />
                                 <TheoryCard 
                                    title="Fermi Surface Stability" 
                                    desc="The Fermi surface is a topological feature. It remains sharp even with strong interactions, as long as the system doesn't undergo a phase transition." 
                                 />
                             </div>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div style={{ background: '#0a0a0a', padding: '30px', borderRadius: '24px', border: '1px solid #111' }}>
                         <h4 style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase' }}>Fermi Stats</h4>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <MetricBox label="Effective Mass (m*/m)" value={(1 + interaction * 2.5).toFixed(2)} color="#10b981" />
                            <MetricBox label="Fermi Momentum (k_F)" value={fermiRadius.toFixed(1)} color="#888" />
                            <MetricBox label="Compressibility" value={(1 / (1 + interaction)).toFixed(2)} color="#888" />
                         </div>
                    </div>

                    <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                        <h4 style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase' }}>Beyond the Liquid</h4>
                        <p style={{ fontSize: '0.8rem', color: '#888', lineHeight: '1.6', margin: 0 }}>
                            When Fermi Liquid theory fails, we get <b>Non-Fermi Liquids</b> (like in YBCO) or <b>Luttinger Liquids</b> (in 1D), where quasiparticles don't exist at all!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FermiSurfaceViz({ radius, interaction }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        const cx = w/2;
        const cy = h/2;
        let frame;

        const draw = () => {
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, w, h);
            const time = Date.now() * 0.001;

            const project = (kx, ky, kz) => {
                const rot = time * 0.2;
                const x1 = kx * Math.cos(rot) - kz * Math.sin(rot);
                const z1 = kx * Math.sin(rot) + kz * Math.cos(rot);
                const y1 = ky * Math.cos(0.5) - z1 * Math.sin(0.5);
                const z2 = ky * Math.sin(0.5) + z1 * Math.cos(0.5);
                const f = 400 / (z2 + 600);
                return { x: cx + x1 * f, y: cy + y1 * f };
            };

            // Draw Fermi Sphere Grid
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
            ctx.lineWidth = 1;
            
            // Interaction effect: distorts the sphere slightly
            const distort = 1 + Math.sin(time) * 0.05 * interaction;

            for(let i=0; i<12; i++) {
                const phi = (i / 12) * Math.PI * 2;
                ctx.beginPath();
                for(let j=0; j<=20; j++) {
                    const theta = (j / 20) * Math.PI;
                    const r = radius * distort;
                    const p = project(
                        r * Math.sin(theta) * Math.cos(phi),
                        r * Math.sin(theta) * Math.sin(phi),
                        r * Math.cos(theta)
                    );
                    if(j===0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
                }
                ctx.stroke();
            }

            // Glow
            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.7);
            grad.addColorStop(0, 'rgba(16, 185, 129, 0.1)');
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.beginPath(); ctx.arc(cx, cy, radius * 0.7, 0, Math.PI*2); ctx.fill();

            frame = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(frame);
    }, [radius, interaction]);

    return <canvas ref={canvasRef} width={600} height={500} style={{ width: '100%', borderRadius: '24px' }} />;
}

function ExclusionViz({ radius }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        const cx = w/2;
        const cy = h/2;

        const draw = () => {
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, w, h);

            // Potential Well
            ctx.strokeStyle = '#333';
            ctx.beginPath(); ctx.moveTo(100, 100); ctx.lineTo(100, h-100); ctx.lineTo(w-100, h-100); ctx.lineTo(w-100, 100); ctx.stroke();

            // Energy Levels
            const numLevels = Math.floor(radius / 2);
            for(let i=0; i<numLevels; i++) {
                const y = h - 100 - (i+1) * 20;
                ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                ctx.beginPath(); ctx.moveTo(100, y); ctx.lineTo(w-100, y); ctx.stroke();
                
                // Electrons (spin up/down)
                ctx.fillStyle = '#10b981';
                ctx.beginPath(); ctx.arc(cx - 20, y, 4, 0, Math.PI*2); ctx.fill(); // Spin up
                ctx.beginPath(); ctx.arc(cx + 20, y, 4, 0, Math.PI*2); ctx.fill(); // Spin down
                
                if (i === numLevels - 1) {
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 10px Inter';
                    ctx.fillText("FERMI LEVEL (Ef)", w - 90, y);
                }
            }

            ctx.fillStyle = '#555';
            ctx.font = '10px Inter';
            ctx.textAlign = 'center';
            ctx.fillText("STATES FILLED DUE TO PAULI EXCLUSION", cx, h - 50);
        };
        draw();
    }, [radius]);

    return <canvas ref={canvasRef} width={600} height={500} style={{ width: '100%', borderRadius: '24px' }} />;
}

function MetricBox({ label, value, color }) {
    return (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '0.65rem', color: '#555', textTransform: 'uppercase', marginBottom: '5px' }}>{label}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: color }}>{value}</div>
        </div>
    );
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
                background: active ? '#10b981' : 'rgba(255,255,255,0.03)',
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
            <h4 style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '10px' }}>{title}</h4>
            <p style={{ fontSize: '0.8rem', color: '#888', lineHeight: '1.6' }}>{desc}</p>
        </div>
    );
}
