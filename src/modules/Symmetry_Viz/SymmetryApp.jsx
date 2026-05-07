import React, { useState, useRef, useEffect } from 'react';
import { Target, Zap, Activity, BookOpen, Repeat, RotateCw, Clock, Box } from 'lucide-react';

export default function SymmetryApp() {
    const [view, setView] = useState('ssb');
    const [bField, setBField] = useState(0); // External B-field (breaks T)
    const [eField, setEField] = useState(0); // External E-field (breaks P)
    const [temperature, setTemperature] = useState(1.5); // T for spontaneous breaking

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#8b5cf6', marginBottom: '10px' }}>
                        <Repeat size={24} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Fundamental Principles</span>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-2px', margin: 0 }}>
                        SYMMETRY <span style={{ color: '#8b5cf6' }}>LAB</span>
                    </h1>
                    <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '10px', maxWidth: '600px' }}>
                        The deep rules of the universe. From conservation laws to the beauty of broken symmetries.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <TabButton active={view === 'ssb'} onClick={() => setView('ssb')} icon={<Activity size={16}/>} label="Spontaneous Breaking" />
                    <TabButton active={view === 'types'} onClick={() => setView('types')} icon={<Box size={16}/>} label="Types of Symmetry" />
                    <TabButton active={view === 'theory'} onClick={() => setView('theory')} icon={<BookOpen size={16}/>} label="Landau Theory" />
                </div>
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
                
                {/* Left Column: Visualizers */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {view === 'ssb' ? (
                        <div style={{ 
                            background: 'rgba(255,255,255,0.02)', 
                            borderRadius: '32px', 
                            padding: '40px', 
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#8b5cf6' }}>Spontaneous Symmetry Breaking (Mexican Hat)</h3>
                            <MexicanHatViz temperature={temperature} />
                            
                            <div style={{ marginTop: '40px', padding: '30px', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '24px', borderLeft: '4px solid #8b5cf6' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    <h4 style={{ color: '#8b5cf6', fontSize: '0.8rem', fontWeight: 'bold', margin: 0 }}>TEMPERATURE (ORDER PARAMETER)</h4>
                                    <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>T = {temperature.toFixed(2)}</div>
                                </div>
                                <input 
                                    type="range" min="0.5" max="2.5" step="0.01" value={temperature} 
                                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                    style={{ width: '100%', accentColor: '#8b5cf6', marginBottom: '15px' }}
                                />
                                <p style={{ fontSize: '0.8rem', color: '#888', margin: 0 }}>
                                    {temperature > 1.5 
                                        ? "At high T, the system is symmetric (ball is at center). The 'Average' state is zero." 
                                        : "Below Tc, the symmetric state becomes unstable! The system MUST choose a direction, breaking the continuous rotation symmetry."
                                    }
                                </p>
                            </div>
                        </div>
                    ) : view === 'types' ? (
                        <div style={{ 
                            background: 'rgba(255,255,255,0.02)', 
                            borderRadius: '32px', 
                            padding: '40px', 
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}>
                             <h3 style={{ fontSize: '1.5rem', marginBottom: '30px' }}>Breaking Fundamental Symmetries</h3>
                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                 <SymmetryCard 
                                    icon={<Clock size={20}/>}
                                    title="Time Reversal (T)" 
                                    desc="The physics looks the same if you run the movie backwards. Broken by: Magnetic Fields (B)."
                                    isActive={bField > 0.1}
                                    control={
                                        <input type="range" min="0" max="1" step="0.1" value={bField} onChange={e => setBField(parseFloat(e.target.value))} />
                                    }
                                 />
                                 <SymmetryCard 
                                    icon={<Repeat size={20}/>}
                                    title="Inversion / Parity (P)" 
                                    desc="Mirroring the system (r → -r). Broken by: Electric Fields (E) or Polar Crystals."
                                    isActive={eField > 0.1}
                                    control={
                                        <input type="range" min="0" max="1" step="0.1" value={eField} onChange={e => setEField(parseFloat(e.target.value))} />
                                    }
                                 />
                                 <SymmetryCard 
                                    icon={<RotateCw size={20}/>}
                                    title="Rotation (C)" 
                                    desc="Rotating the system. Broken by: Crystal Lattices or Uniaxial Strain."
                                    isActive={true}
                                 />
                                 <SymmetryCard 
                                    icon={<Box size={20}/>}
                                    title="Translation (Tᵣ)" 
                                    desc="Moving the system in space. Broken by: Atoms in a solid (Discrete Symmetry)."
                                    isActive={true}
                                 />
                             </div>
                        </div>
                    ) : (
                        <div style={{ 
                            background: 'rgba(255,255,255,0.02)', 
                            borderRadius: '32px', 
                            padding: '40px', 
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                             <h3 style={{ fontSize: '1.5rem', marginBottom: '25px' }}>Landau's Symmetry Perspective</h3>
                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                 <TheoryCard 
                                    title="Order Parameter (ψ)" 
                                    desc="A quantity that is zero in the symmetric phase and non-zero in the broken phase (e.g. Magnetization)." 
                                 />
                                 <TheoryCard 
                                    title="Goldstone Bosons" 
                                    desc="When you break a continuous symmetry, you get massless excitations (Spin waves, Phonons) that 'cost' no energy at long wavelengths." 
                                 />
                                 <TheoryCard 
                                    title="Noether's Theorem" 
                                    desc="Every continuous symmetry corresponds to a conservation law. Rotation → Angular Momentum, Translation → Momentum." 
                                 />
                                 <TheoryCard 
                                    title="Higgs Mechanism" 
                                    desc="If the symmetry is 'gauge' (like in a superconductor), the Goldstone boson 'eats' the gauge field to become massive (Meissner effect)." 
                                 />
                             </div>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div style={{ background: '#0a0a0a', padding: '30px', borderRadius: '24px', border: '1px solid #111' }}>
                         <h4 style={{ color: '#8b5cf6', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase' }}>Active States</h4>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <MetricBox label="Order Parameter" value={temperature < 1.5 ? "NON-ZERO" : "ZERO"} color={temperature < 1.5 ? "#8b5cf6" : "#444"} />
                            <MetricBox label="T-Symmetry" value={bField > 0 ? "BROKEN" : "PRESERVED"} color={bField > 0 ? "#f43f5e" : "#8b5cf6"} />
                            <MetricBox label="P-Symmetry" value={eField > 0 ? "BROKEN" : "PRESERVED"} color={eField > 0 ? "#f59e0b" : "#8b5cf6"} />
                         </div>
                    </div>

                    <div style={{ background: 'rgba(139, 92, 246, 0.05)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
                        <h4 style={{ color: '#8b5cf6', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase' }}>Symmetry Fact</h4>
                        <p style={{ fontSize: '0.8rem', color: '#888', lineHeight: '1.6', margin: 0 }}>
                            The Universe itself started in a high-symmetry state. As it cooled, symmetries "froze" out, giving us different forces and particles (The Higgs Mechanism).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MexicanHatViz({ temperature }) {
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

            const project = (x, y, z) => {
                const x1 = x * Math.cos(time * 0.2) - z * Math.sin(time * 0.2);
                const z1 = x * Math.sin(time * 0.2) + z * Math.cos(time * 0.2);
                const y1 = y * Math.cos(0.5) - z1 * Math.sin(0.5);
                const z2 = y * Math.sin(0.5) + z1 * Math.cos(0.5);
                const f = 400 / (z2 + 600);
                return { x: cx + x1 * f, y: cy + y1 * f };
            };

            // Draw Hat Surface
            const isBroken = temperature < 1.5;
            const a = (temperature - 1.5) * 20; // Potential coefficient
            const b = 0.05;

            ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
            for(let r=0; r<150; r+=15) {
                ctx.beginPath();
                for(let theta=0; theta<=Math.PI*2; theta+=0.2) {
                    const x = r * Math.cos(theta);
                    const z = r * Math.sin(theta);
                    const y = (a * r*r + b * Math.pow(r, 4)) / 200;
                    const p = project(x, y, z);
                    if(theta===0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
                }
                ctx.closePath(); ctx.stroke();
            }

            // Draw the Order Parameter "Ball"
            let ballR = 0;
            if (isBroken) {
                // Minimum is at r = sqrt(-a/b)
                ballR = Math.sqrt(Math.abs(a)/b);
            }
            
            const bx = ballR * Math.cos(time);
            const bz = ballR * Math.sin(time);
            const by = (a * ballR*ballR + b * Math.pow(ballR, 4)) / 200;
            const bp = project(bx, by, bz);

            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(bp.x, bp.y, 8, 0, Math.PI*2); ctx.fill();
            
            // Glow
            const grad = ctx.createRadialGradient(bp.x, bp.y, 0, bp.x, bp.y, 20);
            grad.addColorStop(0, 'rgba(139, 92, 246, 0.4)');
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.beginPath(); ctx.arc(bp.x, bp.y, 20, 0, Math.PI*2); ctx.fill();

            frame = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(frame);
    }, [temperature]);

    return <canvas ref={canvasRef} width={600} height={500} style={{ width: '100%', borderRadius: '24px' }} />;
}

function SymmetryCard({ icon, title, desc, isActive, control }) {
    return (
        <div style={{ 
            padding: '24px', 
            background: 'rgba(255,255,255,0.03)', 
            borderRadius: '24px', 
            border: `1px solid ${isActive ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.05)'}` 
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                <div style={{ color: isActive ? '#8b5cf6' : '#555' }}>{icon}</div>
                <h4 style={{ margin: 0, fontSize: '1rem', color: isActive ? '#fff' : '#888' }}>{title}</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#666', lineHeight: '1.5', marginBottom: '20px' }}>{desc}</p>
            {control && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '0.6rem', color: '#555', textTransform: 'uppercase' }}>External Field</div>
                    {control}
                </div>
            )}
        </div>
    );
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
                background: active ? '#8b5cf6' : 'rgba(255,255,255,0.03)',
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
            <h4 style={{ color: '#8b5cf6', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '10px' }}>{title}</h4>
            <p style={{ fontSize: '0.8rem', color: '#888', lineHeight: '1.6' }}>{desc}</p>
        </div>
    );
}
