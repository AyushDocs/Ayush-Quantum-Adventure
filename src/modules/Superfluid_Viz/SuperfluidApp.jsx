import React, { useState, useRef, useEffect } from 'react';
import { Target, Zap, Activity, BookOpen, Waves, Thermometer, Wind } from 'lucide-react';

export default function SuperfluidApp() {
    const [view, setView] = useState('vortices');
    const [temperature, setTemperature] = useState(2.17); // Transition T of He4
    const [rotation, setRotation] = useState(0.5);

    const isSuperfluid = temperature < 2.17;
    const superfluidFraction = isSuperfluid ? 1 - Math.pow(temperature / 2.17, 4) : 0;

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#06b6d4', marginBottom: '10px' }}>
                        <Waves size={24} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Low Temperature Physics</span>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-2px', margin: 0 }}>
                        SUPERFLUID <span style={{ color: '#06b6d4' }}>LAB</span>
                    </h1>
                    <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '10px', maxWidth: '600px' }}>
                        Zero viscosity, infinite thermal conductivity, and quantized whirlpools. Welcome to the world of Liquid Helium.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <TabButton active={view === 'vortices'} onClick={() => setView('vortices')} icon={<Wind size={16}/>} label="Quantized Vortices" />
                    <TabButton active={view === 'fountain'} onClick={() => setView('fountain')} icon={<Thermometer size={16}/>} label="Fountain Effect" />
                    <TabButton active={view === 'theory'} onClick={() => setView('theory')} icon={<BookOpen size={16}/>} label="Two-Fluid Model" />
                </div>
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
                
                {/* Left Column: Visualizers */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    
                    {/* Temperature Slider (Universal) */}
                    <div style={{ padding: '30px', background: 'rgba(6, 182, 212, 0.05)', borderRadius: '24px', borderLeft: '4px solid #06b6d4' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <h4 style={{ color: '#06b6d4', fontSize: '0.8rem', fontWeight: 'bold', margin: 0 }}>SYSTEM TEMPERATURE (T)</h4>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{temperature.toFixed(2)} K</div>
                                <div style={{ color: isSuperfluid ? '#06b6d4' : '#666', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                    {isSuperfluid ? "❄️ SUPERFLUID PHASE" : "NORMAL LIQUID"}
                                </div>
                            </div>
                        </div>
                        <input 
                            type="range" min="1" max="4.2" step="0.01" value={temperature} 
                            onChange={(e) => setTemperature(parseFloat(e.target.value))}
                            style={{ width: '100%', accentColor: '#06b6d4', marginBottom: '10px' }}
                        />
                        <div style={{ fontSize: '0.7rem', color: '#888' }}>
                            The transition occurs at the <b>Lambda Point (2.17 K)</b> for ⁴He.
                        </div>
                    </div>

                    {view === 'vortices' ? (
                        <div style={{ 
                            background: 'rgba(255,255,255,0.02)', 
                            borderRadius: '32px', 
                            padding: '40px', 
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#06b6d4' }}>Rotating Superfluid</h3>
                            <VortexViz rotation={rotation} isSuperfluid={isSuperfluid} />
                            
                            <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                                <h4 style={{ fontSize: '0.8rem', color: '#06b6d4', marginBottom: '10px' }}>ROTATION SPEED (Ω)</h4>
                                <input 
                                    type="range" min="0" max="2" step="0.01" value={rotation} 
                                    onChange={(e) => setRotation(parseFloat(e.target.value))}
                                    style={{ width: '100%', accentColor: '#06b6d4' }}
                                />
                                <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '10px' }}>
                                    Unlike a normal fluid, a superfluid cannot rotate uniformly. It creates a lattice of <b>Quantized Vortices</b>. As Ω increases, more vortices appear.
                                </p>
                            </div>
                        </div>
                    ) : view === 'fountain' ? (
                        <div style={{ 
                            background: 'rgba(255,255,255,0.02)', 
                            borderRadius: '32px', 
                            padding: '40px', 
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}>
                             <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#06b6d4' }}>The Fountain Effect</h3>
                             <FountainViz isSuperfluid={isSuperfluid} fraction={superfluidFraction} />
                             <div style={{ marginTop: '30px', padding: '24px', background: 'rgba(6, 182, 212, 0.05)', borderRadius: '20px' }}>
                                 <h4 style={{ fontSize: '1rem', color: '#06b6d4', marginBottom: '10px' }}>Entropy & Flow</h4>
                                 <p style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: '1.6', margin: 0 }}>
                                    Superfluids have zero entropy. When you heat one side of a tube, the superfluid component rushes *towards* the heat to restore equilibrium, creating a high-pressure jet that can spray several inches high.
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
                             <h3 style={{ fontSize: '1.5rem', marginBottom: '25px' }}>Landau's Two-Fluid Model</h3>
                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                 <TheoryCard 
                                    title="ρₙ + ρₛ = ρ" 
                                    desc="The liquid behaves as two interpenetrating fluids: a 'Normal' part (with viscosity) and a 'Superfluid' part (zero viscosity and entropy)." 
                                 />
                                 <TheoryCard 
                                    title="Zero Viscosity" 
                                    desc="The superfluid component can flow through tiny cracks (pores) where normal fluids are blocked. It will even creep up the walls of a container (Rollin Film)." 
                                 />
                                 <TheoryCard 
                                    title="Quantized Circulation" 
                                    desc="The velocity field is the gradient of a phase: v = (ħ/m) ∇φ. This forces any whirlpool to have a quantized strength (h/m)." 
                                 />
                                 <TheoryCard 
                                    title="Second Sound" 
                                    desc="In superfluids, heat doesn't diffuse; it travels as a wave. This is a local oscillation of the normal vs superfluid density." 
                                 />
                             </div>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div style={{ background: '#0a0a0a', padding: '30px', borderRadius: '24px', border: '1px solid #111' }}>
                         <h4 style={{ color: '#06b6d4', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase' }}>Superfluid Metrics</h4>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <MetricBox label="Superfluid Fraction" value={`${(superfluidFraction * 100).toFixed(1)}%`} color="#06b6d4" />
                            <MetricBox label="Entropy" value={isSuperfluid ? "Zero (ideal)" : "High"} color="#888" />
                            <MetricBox label="Viscosity" value={isSuperfluid ? "ZERO" : "Low (classical)"} color={isSuperfluid ? "#06b6d4" : "#888"} />
                         </div>
                    </div>

                    <div style={{ background: 'rgba(6, 182, 212, 0.05)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(6, 182, 212, 0.1)' }}>
                        <h4 style={{ color: '#06b6d4', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase' }}>He4 vs He3</h4>
                        <p style={{ fontSize: '0.8rem', color: '#888', lineHeight: '1.6', margin: 0 }}>
                            ⁴He is a <b>Boson</b> and undergoes BEC. ³He is a <b>Fermion</b> and only becomes a superfluid at much lower temperatures (mK) by forming Cooper pairs, like a superconductor.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function VortexViz({ rotation, isSuperfluid }) {
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

            if (!isSuperfluid) {
                // Classical rotation
                ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                for(let r=20; r<150; r+=20) {
                    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.stroke();
                }
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.fillText("CLASSICAL UNIFORM ROTATION", cx, cy + 180);
            } else {
                // Quantized Vortices
                const numVortices = Math.floor(rotation * 20);
                for(let i=0; i<numVortices; i++) {
                    const angle = (i / numVortices) * Math.PI * 2 + Date.now() * 0.001 * rotation;
                    const r = 50 + (i % 3) * 30;
                    const vx = cx + Math.cos(angle) * r;
                    const vy = cy + Math.sin(angle) * r;
                    
                    // Vortex core
                    const grad = ctx.createRadialGradient(vx, vy, 0, vx, vy, 15);
                    grad.addColorStop(0, 'rgba(6, 182, 212, 0.8)');
                    grad.addColorStop(1, 'transparent');
                    ctx.fillStyle = grad;
                    ctx.beginPath(); ctx.arc(vx, vy, 15, 0, Math.PI*2); ctx.fill();
                    
                    ctx.fillStyle = '#fff';
                    ctx.beginPath(); ctx.arc(vx, vy, 2, 0, Math.PI*2); ctx.fill();
                }
                ctx.fillStyle = '#06b6d4';
                ctx.textAlign = 'center';
                ctx.font = 'bold 12px Inter';
                ctx.fillText(`ABRIKOSOV LATTICE: ${numVortices} VORTICES`, cx, cy + 180);
            }

            // Bucket
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 5;
            ctx.beginPath(); ctx.arc(cx, cy, 200, 0, Math.PI*2); ctx.stroke();

            frame = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(frame);
    }, [rotation, isSuperfluid]);

    return <canvas ref={canvasRef} width={600} height={500} style={{ width: '100%', borderRadius: '24px' }} />;
}

function FountainViz({ isSuperfluid, fraction }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        let frame;
        let particles = [];

        const draw = () => {
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, w, h);

            // Container
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 4;
            ctx.strokeRect(w/2 - 100, h - 100, 200, 80);
            
            // Central Tube
            ctx.strokeRect(w/2 - 10, h - 300, 20, 220);

            if (isSuperfluid) {
                // Fountain Spray
                if (particles.length < 100) {
                    particles.push({ 
                        x: w/2, 
                        y: h - 300, 
                        vx: (Math.random() - 0.5) * 4, 
                        vy: -5 - Math.random() * 10 * fraction 
                    });
                }
                
                ctx.fillStyle = '#06b6d4';
                particles.forEach((p, i) => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.5; // Gravity
                    
                    ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI*2); ctx.fill();
                    
                    if (p.y > h) particles.splice(i, 1);
                });
            }

            ctx.fillStyle = '#888';
            ctx.font = '10px Inter';
            ctx.textAlign = 'center';
            ctx.fillText("HEAT SOURCE", w/2, h - 50);

            frame = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(frame);
    }, [isSuperfluid, fraction]);

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
                background: active ? '#06b6d4' : 'rgba(255,255,255,0.03)',
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
            <h4 style={{ color: '#06b6d4', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '10px' }}>{title}</h4>
            <p style={{ fontSize: '0.8rem', color: '#888', lineHeight: '1.6' }}>{desc}</p>
        </div>
    );
}
