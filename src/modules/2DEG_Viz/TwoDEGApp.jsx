import React, { useState, useRef, useEffect } from 'react';
import { Radio, Zap, Activity, BookOpen, Layers, MoveRight, Cpu, Shield } from 'lucide-react';

export default function TwoDEGApp() {
    const [view, setView] = useState('physics');
    const [density, setDensity] = useState(0.5); // Electron density
    const [field, setField] = useState(0.5); // Electric field / well steepness
    const [width, setWidth] = useState(0.6); // Lateral width w

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
                        <Radio size={24} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Semiconductor Physics</span>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-2px', margin: 0 }}>
                        2D ELECTRON <span style={{ color: '#10b981' }}>GAS</span>
                    </h1>
                    <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '10px', maxWidth: '600px' }}>
                        Quantization at the interface of a GaAs/AlGaAs heterostructure, forming a high-mobility 2D system.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <TabButton active={view === 'physics'} onClick={() => setView('physics')} icon={<Activity size={16}/>} label="Band Structure" />
                    <TabButton active={view === 'theory'} onClick={() => setView('theory')} icon={<BookOpen size={16}/>} label="Subband Theory" />
                </div>
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
                
                {/* Left Column: Visualizers */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {view === 'physics' ? (
                        <div style={{ 
                            background: 'rgba(255,255,255,0.02)', 
                            borderRadius: '32px', 
                            padding: '40px', 
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}>
                            {/* Top row: Lateral Profile */}
                            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.7rem', color: '#555', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>Lateral Potential E(x) & Wavefunction</div>
                                <LateralConfinementViz width={width} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#555', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>Interface Well E(z)</div>
                                    <PotentialWellViz field={field} density={density} />
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#555', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>Dispersion E(k)</div>
                                    <DispersionViz density={density} field={field} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '40px' }}>
                                <div style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '16px', borderLeft: '4px solid #10b981' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <h4 style={{ color: '#10b981', fontSize: '0.7rem', fontWeight: 'bold', margin: 0 }}>DENSITY (n<sub>s</sub>)</h4>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>{density.toFixed(2)}</div>
                                    </div>
                                    <input 
                                        type="range" min="0.1" max="1" step="0.01" value={density} 
                                        onChange={(e) => setDensity(parseFloat(e.target.value))}
                                        style={{ width: '100%', accentColor: '#10b981' }}
                                    />
                                </div>

                                <div style={{ padding: '20px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '16px', borderLeft: '4px solid #3b82f6' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <h4 style={{ color: '#3b82f6', fontSize: '0.7rem', fontWeight: 'bold', margin: 0 }}>FIELD (F)</h4>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>{field.toFixed(2)}</div>
                                    </div>
                                    <input 
                                        type="range" min="0.1" max="1" step="0.01" value={field} 
                                        onChange={(e) => setField(parseFloat(e.target.value))}
                                        style={{ width: '100%', accentColor: '#3b82f6' }}
                                    />
                                </div>

                                <div style={{ padding: '20px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '16px', borderLeft: '4px solid #f59e0b' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <h4 style={{ color: '#f59e0b', fontSize: '0.7rem', fontWeight: 'bold', margin: 0 }}>WIDTH (w)</h4>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>{width.toFixed(2)} nm</div>
                                    </div>
                                    <input 
                                        type="range" min="0.2" max="1" step="0.01" value={width} 
                                        onChange={(e) => setWidth(parseFloat(e.target.value))}
                                        style={{ width: '100%', accentColor: '#f59e0b' }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginTop: '40px', padding: '30px', background: 'rgba(0,0,0,0.3)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h4 style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase' }}>Subband Energy & Velocity</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ 
                                            fontSize: '1.4rem', 
                                            fontFamily: 'serif', 
                                            color: '#fff',
                                            background: 'rgba(255,255,255,0.02)',
                                            padding: '20px',
                                            borderRadius: '12px',
                                            marginBottom: '15px'
                                        }}>
                                            E<sub>n</sub>(k) = E<sub>n</sub> + ħ²k²/2m*
                                        </div>
                                        <div style={{ 
                                            fontSize: '1.4rem', 
                                            fontFamily: 'serif', 
                                            color: '#10b981',
                                            background: 'rgba(16, 185, 129, 0.02)',
                                            padding: '20px',
                                            borderRadius: '12px'
                                        }}>
                                            v<sub>g</sub> = (1/ħ) ∂E/∂k = ħk/m*
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#888', lineHeight: '1.6' }}>
                                        <p>Total energy is separated into a <b>quantized z-component</b> (E<sub>n</sub>) and a <b>continuous xy-component</b> (kinetic energy).</p>
                                        <p>The <b>Group Velocity (v<sub>g</sub>)</b> is linear with momentum (k) because the bands are parabolic.</p>
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
                             <h3 style={{ fontSize: '1.5rem', marginBottom: '25px' }}>Heterostructure Physics</h3>
                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                 <TheoryCard 
                                    title="Modulation Doping" 
                                    desc="Dopants are placed in the AlGaAs layer, separated from the GaAs interface by a spacer. This reduces ionized impurity scattering, leading to ultra-high mobility." 
                                 />
                                 <TheoryCard 
                                    title="Triangular Well" 
                                    desc="The interface potential is approximated as V(z) = eFz. The energy levels follow an E ~ n^{2/3} scaling (Airy function solutions)." 
                                 />
                                 <TheoryCard 
                                    title="Density of States (DOS)" 
                                    desc="In 2D, the DOS is constant: g(E) = m*/(πħ²). This results in staircase-like jumps in total DOS as subbands are occupied." 
                                 />
                                 <TheoryCard 
                                    title="Effective Mass (m*)" 
                                    desc="In GaAs, m* ≈ 0.067 m₀. This small mass makes quantization effects visible even at higher temperatures." 
                                 />
                             </div>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div style={{ background: '#0a0a0a', padding: '30px', borderRadius: '24px', border: '1px solid #111' }}>
                         <h4 style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase' }}>Module Highlights</h4>
                         <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <FeatureItem icon={<Layers size={16}/>} text="Quantized Subbands" />
                            <FeatureItem icon={<MoveRight size={16}/>} text="Velocity Mapping" />
                            <FeatureItem icon={<Shield size={16}/>} text="Trivial Phase (Not a TI)" />
                         </ul>
                         <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '12px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                            <p style={{ fontSize: '0.7rem', color: '#f43f5e', margin: 0, lineHeight: '1.4' }}>
                                <b>Note:</b> A standard 2DEG is a <b>Trivial Insulator</b>. Unlike a TI, it has no protected edge states and requires an external B-field to enter a topological phase (QHE).
                            </p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PotentialWellViz({ field, density }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let frame;

        const draw = () => {
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const w = canvas.width;
            const h = canvas.height;

            // Axis
            ctx.strokeStyle = '#333';
            ctx.beginPath(); ctx.moveTo(50, 50); ctx.lineTo(50, h-50); ctx.lineTo(w-50, h-50); ctx.stroke();

            // Potential V(z) - Triangular Well
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(50, 50);
            ctx.lineTo(50, h-100); // Barrier
            ctx.lineTo(w-50, h-100 - (w-100) * field * 0.5); // Sloping well
            ctx.stroke();

            // Energy Levels
            const levels = [0, 1, 2];
            levels.forEach((n, i) => {
                const energy = (i + 0.5) * field * 40 + (h - 100);
                const y = h - (h - energy);
                
                if (y < 50) return;

                // Level line
                ctx.strokeStyle = `rgba(16, 185, 129, ${0.8 / (i+1)})`;
                ctx.beginPath(); ctx.moveTo(50, y); ctx.lineTo(w-50, y); ctx.stroke();
                
                // Wavefunction Psi(z) - Airy function approximation (sine for simplicity)
                ctx.strokeStyle = '#10b981';
                ctx.beginPath();
                for(let x=50; x<w-50; x++) {
                    const z = (x - 50);
                    const amp = Math.sin(z * 0.05 * (i+1)) * Math.exp(-z * 0.02) * 30;
                    if(x === 50) ctx.moveTo(x, y - amp); else ctx.lineTo(x, y - amp);
                }
                ctx.stroke();
            });

            // Fermi Level
            const efY = h - 100 - density * 150;
            ctx.strokeStyle = '#fff';
            ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(50, efY); ctx.lineTo(w-50, efY); ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = '#fff';
            ctx.font = '10px Inter';
            ctx.fillText("Fermi Level (Ef)", w-120, efY - 5);

            frame = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(frame);
    }, [field, density]);

    return <canvas ref={canvasRef} width={400} height={400} style={{ width: '100%', borderRadius: '24px' }} />;
}

function DispersionViz({ density, field }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let frame;

        const draw = () => {
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const w = canvas.width;
            const h = canvas.height;
            const cx = w / 2;

            // Axis
            ctx.strokeStyle = '#333';
            ctx.beginPath(); ctx.moveTo(cx, 50); ctx.lineTo(cx, h-50); ctx.moveTo(50, h-50); ctx.lineTo(w-50, h-50); ctx.stroke();

            const ef = density * 150;
            
            // Draw Subbands (Parabolas)
            [0, 1, 2].forEach((n) => {
                const en = n * field * 40;
                ctx.strokeStyle = `rgba(16, 185, 129, ${1 - n*0.3})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                for(let k=-100; k<=100; k++) {
                    const energy = en + (k*k) * 0.02;
                    const x = cx + k;
                    const y = h - 50 - energy;
                    if (y < 50) continue;
                    if (k === -100) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.stroke();

                // Velocity Arrow at Fermi Level for this subband
                if (ef > en) {
                    const kf = Math.sqrt((ef - en) / 0.02);
                    const kf_x = cx + kf;
                    const ef_y = h - 50 - ef;
                    
                    // Velocity Vector (slope)
                    const velocity = kf * 0.5; // v proportional to k
                    ctx.strokeStyle = '#3b82f6';
                    ctx.beginPath();
                    ctx.moveTo(kf_x, ef_y);
                    ctx.lineTo(kf_x + velocity, ef_y - velocity * 0.5);
                    ctx.stroke();
                    
                    // Arrowhead
                    ctx.fillStyle = '#3b82f6';
                    ctx.beginPath(); ctx.arc(kf_x + velocity, ef_y - velocity * 0.5, 3, 0, Math.PI*2); ctx.fill();
                }
            });

            // Fermi Line
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.setLineDash([2, 2]);
            ctx.beginPath(); ctx.moveTo(50, h-50-ef); ctx.lineTo(w-50, h-50-ef); ctx.stroke();
            ctx.setLineDash([]);

            frame = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(frame);
    }, [density, field]);

    return <canvas ref={canvasRef} width={400} height={400} style={{ width: '100%', borderRadius: '24px' }} />;
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

function FeatureItem({ icon, text }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: '#10b981' }}>{icon}</div>
            <span style={{ fontSize: '0.85rem', color: '#ccc' }}>{text}</span>
        </div>
    );
}

function LateralConfinementViz({ width }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let frame;

        const draw = () => {
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const w = canvas.width;
            const h = canvas.height;
            const cx = w / 2;

            // Axis
            ctx.strokeStyle = '#333';
            ctx.beginPath(); ctx.moveTo(50, h-50); ctx.lineTo(w-50, h-50); ctx.stroke();

            const wellWidth = width * 400;
            const xStart = cx - wellWidth / 2;
            const xEnd = cx + wellWidth / 2;

            // Potential V(x) - Infinite/Finite Well
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(50, 100);
            ctx.lineTo(xStart, 100);
            ctx.lineTo(xStart, h-100);
            ctx.lineTo(xEnd, h-100);
            ctx.lineTo(xEnd, 100);
            ctx.lineTo(w-50, 100);
            ctx.stroke();

            // Ground State Wavefunction Psi(x)
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 3;
            ctx.beginPath();
            for(let x=xStart; x<xEnd; x++) {
                const relX = (x - xStart) / wellWidth;
                const amp = Math.sin(relX * Math.PI) * 80;
                if(x === xStart) ctx.moveTo(x, h-100 - amp); else ctx.lineTo(x, h-100 - amp);
            }
            ctx.stroke();

            // Labels
            ctx.fillStyle = '#888';
            ctx.font = 'bold 10px Inter';
            ctx.textAlign = 'center';
            ctx.fillText("BORDER (E high)", 100, 90);
            ctx.fillText("BOUNDARY / INTERFACE (E low)", cx, h - 80);
            ctx.fillText("BORDER (E high)", w-100, 90);

            frame = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(frame);
    }, [width]);

    return <canvas ref={canvasRef} width={800} height={300} style={{ width: '100%', height: '200px', borderRadius: '24px' }} />;
}
