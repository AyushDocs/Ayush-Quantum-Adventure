import React, { useState, useRef, useEffect } from 'react';
import { Target, Zap, Activity, BookOpen, Layers, Shield, FlaskConical } from 'lucide-react';

export default function YBCOApp() {
    const [view, setView] = useState('structure');
    const [doping, setDoping] = useState(0.15); // Hole doping p
    const [temperature, setTemperature] = useState(50); // Temperature in Kelvin

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#3b82f6', marginBottom: '10px' }}>
                        <Target size={24} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>High-Tc Superconductivity</span>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-2px', margin: 0 }}>
                        YBCO <span style={{ color: '#3b82f6' }}>LAB</span>
                    </h1>
                    <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '10px', maxWidth: '600px' }}>
                        YBa₂Cu₃O₇₋ₓ: The first superconductor to break the liquid nitrogen barrier (77K).
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <TabButton active={view === 'structure'} onClick={() => setView('structure')} icon={<Layers size={16}/>} label="Crystal Structure" />
                    <TabButton active={view === 'phase'} onClick={() => setView('phase')} icon={<Activity size={16}/>} label="Phase Diagram" />
                    <TabButton active={view === 'theory'} onClick={() => setView('theory')} icon={<BookOpen size={16}/>} label="High-Tc Theory" />
                </div>
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
                
                {/* Left Column: Visualizers */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {view === 'structure' ? (
                        <div style={{ 
                            background: 'rgba(255,255,255,0.02)', 
                            borderRadius: '32px', 
                            padding: '40px', 
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#3b82f6' }}>The Layered Perovskite Structure</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'center' }}>
                                <Structure3DViz />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ padding: '20px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '16px', borderLeft: '4px solid #3b82f6' }}>
                                        <b style={{ color: '#3b82f6', fontSize: '0.9rem' }}>CuO₂ Planes</b>
                                        <p style={{ fontSize: '0.8rem', color: '#888', margin: '5px 0' }}>Superconductivity is strictly 2D, occurring in these copper-oxide sheets.</p>
                                    </div>
                                    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                                        <b style={{ color: '#fff', fontSize: '0.9rem' }}>Cu-O Chains</b>
                                        <p style={{ fontSize: '0.8rem', color: '#888', margin: '5px 0' }}>Act as charge reservoirs, donating holes to the planes based on oxygen content.</p>
                                    </div>
                                    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                                        <b style={{ color: '#fff', fontSize: '0.9rem' }}>Yttrium / Barium</b>
                                        <p style={{ fontSize: '0.8rem', color: '#888', margin: '5px 0' }}>Spacer layers that maintain structural stability.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : view === 'phase' ? (
                        <div style={{ 
                            background: 'rgba(255,255,255,0.02)', 
                            borderRadius: '32px', 
                            padding: '40px', 
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#3b82f6' }}>Phase Diagram: T vs Doping (p)</h3>
                            <PhaseDiagramViz doping={doping} temperature={temperature} />
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
                                <div style={{ padding: '20px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '16px', borderLeft: '4px solid #3b82f6' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <h4 style={{ color: '#3b82f6', fontSize: '0.7rem', fontWeight: 'bold', margin: 0 }}>HOLE DOPING (p)</h4>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{doping.toFixed(2)}</div>
                                    </div>
                                    <input 
                                        type="range" min="0" max="0.3" step="0.01" value={doping} 
                                        onChange={(e) => setDoping(parseFloat(e.target.value))}
                                        style={{ width: '100%', accentColor: '#3b82f6' }}
                                    />
                                </div>
                                <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '16px', borderLeft: '4px solid #fff' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <h4 style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', margin: 0 }}>TEMPERATURE (T)</h4>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{temperature.toFixed(0)} K</div>
                                    </div>
                                    <input 
                                        type="range" min="0" max="300" step="1" value={temperature} 
                                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                        style={{ width: '100%', accentColor: '#fff' }}
                                    />
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
                             <h3 style={{ fontSize: '1.5rem', marginBottom: '25px' }}>Beyond BCS Theory</h3>
                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                 <TheoryCard 
                                    title="Mott Insulator Roots" 
                                    desc="At zero doping (p=0), YBCO is an Antiferromagnetic Mott Insulator. Electrons are localized due to strong Coulomb repulsion, not because the band is full." 
                                 />
                                 <TheoryCard 
                                    title="d-wave Symmetry" 
                                    desc="Unlike standard s-wave BCS superconductors, YBCO has a d(x²-y²) gap symmetry. This means the gap has 'nodes' where it vanishes entirely." 
                                 />
                                 <TheoryCard 
                                    title="The Pseudogap" 
                                    desc="A mysterious phase in underdoped samples where a gap exists even above Tc. Its origin remains one of the biggest mysteries in physics." 
                                 />
                                 <TheoryCard 
                                    title="Non-Phononic Pairing" 
                                    desc="Conventional phonons aren't strong enough to explain 93K superconductivity. Spin fluctuations or more exotic mechanisms are likely responsible." 
                                 />
                             </div>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div style={{ background: '#0a0a0a', padding: '30px', borderRadius: '24px', border: '1px solid #111' }}>
                         <h4 style={{ color: '#3b82f6', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase' }}>Module Highlights</h4>
                         <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <FeatureItem icon={<FlaskConical size={16}/>} text="93K Transition (Liquid N₂)" />
                            <FeatureItem icon={<Zap size={16}/>} text="Strongly Correlated Physics" />
                            <FeatureItem icon={<Shield size={16}/>} text="Type-II Superconductivity" />
                         </ul>
                    </div>

                    <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                        <h4 style={{ color: '#3b82f6', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase' }}>Structure Fact</h4>
                        <p style={{ fontSize: '0.8rem', color: '#888', lineHeight: '1.6', margin: 0 }}>
                            YBCO is "orthorhombic". The oxygen atoms in the <b>Cu-O chains</b> align along one axis, breaking the symmetry and significantly affecting Tc.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Structure3DViz() {
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
                const rot = time * 0.2;
                const x1 = x * Math.cos(rot) - z * Math.sin(rot);
                const z1 = x * Math.sin(rot) + z * Math.cos(rot);
                const y1 = y * Math.cos(0.4) - z1 * Math.sin(0.4);
                const z2 = y * Math.sin(0.4) + z1 * Math.cos(0.4);
                const f = 400 / (z2 + 600);
                return { x: cx + x1 * f, y: cy + y1 * f };
            };

            // Draw Layers
            const drawLayer = (y, color, label) => {
                ctx.strokeStyle = color;
                ctx.lineWidth = 1;
                ctx.beginPath();
                for(let i=0; i<=4; i++) {
                    const p1 = project(-150, y, -150 + i * 75);
                    const p2 = project(150, y, -150 + i * 75);
                    ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
                    
                    const p3 = project(-150 + i * 75, y, -150);
                    const p4 = project(-150 + i * 75, y, 150);
                    ctx.moveTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y);
                }
                ctx.stroke();

                // Atoms on the grid
                ctx.fillStyle = color;
                for(let i=0; i<=4; i++) {
                    for(let j=0; j<=4; j++) {
                        const p = project(-150 + i*75, y, -150 + j*75);
                        ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI*2); ctx.fill();
                    }
                }

                if(label) {
                    const lp = project(170, y, 0);
                    ctx.fillStyle = color;
                    ctx.font = '10px Inter';
                    ctx.fillText(label, lp.x, lp.y);
                }
            };

            drawLayer(-150, 'rgba(255,255,255,0.1)', "Cu-O Chains");
            drawLayer(-50, '#3b82f6', "CuO₂ Plane 1");
            drawLayer(50, '#3b82f6', "CuO₂ Plane 2");
            drawLayer(150, 'rgba(255,255,255,0.1)', "Cu-O Chains");

            frame = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(frame);
    }, []);

    return <canvas ref={canvasRef} width={500} height={500} style={{ width: '100%', borderRadius: '24px' }} />;
}

function PhaseDiagramViz({ doping, temperature }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        const draw = () => {
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, w, h);

            // Axis
            ctx.strokeStyle = '#333';
            ctx.beginPath(); ctx.moveTo(50, 50); ctx.lineTo(50, h-50); ctx.lineTo(w-50, h-50); ctx.stroke();

            // Superconducting Dome
            ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
            ctx.strokeStyle = '#3b82f6';
            ctx.beginPath();
            ctx.moveTo(50 + 0.05 * 1500, h - 50);
            for(let p=0.05; p<=0.27; p+=0.01) {
                const tc = 93 * (1 - 82.6 * Math.pow(p - 0.16, 2));
                const x = 50 + p * 1500;
                const y = h - 50 - Math.max(0, tc) * 1.5;
                ctx.lineTo(x, y);
            }
            ctx.lineTo(50 + 0.27 * 1500, h-50);
            ctx.fill(); ctx.stroke();

            // Antiferromagnetic Phase
            ctx.fillStyle = 'rgba(244, 63, 94, 0.2)';
            ctx.beginPath();
            ctx.moveTo(50, h-50);
            ctx.lineTo(50, h-250);
            ctx.quadraticCurveTo(80, h-200, 100, h-50);
            ctx.fill();
            ctx.fillStyle = '#f43f5e';
            ctx.font = '10px Inter';
            ctx.fillText("AFM", 60, h-100);

            // Pseudogap Line
            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(50, h-400);
            ctx.lineTo(250, h-50);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = '#888';
            ctx.fillText("Pseudogap (T*)", 100, h-300);

            // Labels
            ctx.fillStyle = '#fff';
            ctx.fillText("Liquid N₂ (77K)", 60, h - 50 - 77 * 1.5);
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.beginPath(); ctx.moveTo(50, h - 50 - 77 * 1.5); ctx.lineTo(w-50, h - 50 - 77 * 1.5); ctx.stroke();

            // Current State Pointer
            const px = 50 + doping * 1500;
            const py = h - 50 - temperature * 1.5;
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI*2); ctx.stroke();

            // State Label
            let state = "Strange Metal";
            const tc = 93 * (1 - 82.6 * Math.pow(doping - 0.16, 2));
            if (temperature < tc) state = "SUPERCONDUCTING";
            else if (doping < 0.05 && temperature < 200) state = "Antiferromagnet";
            else if (temperature < (400 - doping * 1500)) state = "Pseudogap Region";

            ctx.font = 'bold 14px Inter';
            ctx.fillStyle = state === "SUPERCONDUCTING" ? '#3b82f6' : '#fff';
            ctx.fillText(`STATE: ${state}`, px + 15, py);
        };
        draw();
    }, [doping, temperature]);

    return <canvas ref={canvasRef} width={600} height={500} style={{ width: '100%', borderRadius: '24px' }} />;
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
                background: active ? '#3b82f6' : 'rgba(255,255,255,0.03)',
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
            <h4 style={{ color: '#3b82f6', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '10px' }}>{title}</h4>
            <p style={{ fontSize: '0.8rem', color: '#888', lineHeight: '1.6' }}>{desc}</p>
        </div>
    );
}

function FeatureItem({ icon, text }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: '#3b82f6' }}>{icon}</div>
            <span style={{ fontSize: '0.85rem', color: '#ccc' }}>{text}</span>
        </div>
    );
}
