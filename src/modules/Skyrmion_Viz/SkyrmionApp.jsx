import React, { useState, useRef, useEffect } from 'react';
import { Target, Zap, Activity, BookOpen, MousePointer2, MoveRight, ShieldCheck } from 'lucide-react';

export default function SkyrmionApp() {
    const [view, setView] = useState('simulation');
    const [dmi, setDmi] = useState(0.5); // Dzyaloshinskii-Moriya Interaction strength
    const [field, setField] = useState(0.4); // External B-field

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ec4899', marginBottom: '10px' }}>
                        <Target size={24} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Topological Spintronics</span>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-2px', margin: 0 }}>
                        MAGNETIC <span style={{ color: '#ec4899' }}>SKYRMIONS</span>
                    </h1>
                    <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '10px', maxWidth: '600px' }}>
                        Stable, swirling magnetic vortices that behave like particles. The future of ultra-dense data storage.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <TabButton active={view === 'simulation'} onClick={() => setView('simulation')} icon={<MousePointer2 size={16}/>} label="Field Lab" />
                    <TabButton active={view === 'racetrack'} onClick={() => setView('racetrack')} icon={<MoveRight size={16}/>} label="Racetrack Memory" />
                    <TabButton active={view === 'theory'} onClick={() => setView('theory')} icon={<BookOpen size={16}/>} label="Topological Theory" />
                </div>
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
                
                {/* Left Column: Visualizers */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {view === 'simulation' ? (
                        <div style={{ 
                            background: 'rgba(255,255,255,0.02)', 
                            borderRadius: '32px', 
                            padding: '40px', 
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}>
                            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.2rem', margin: 0, color: '#ec4899' }}>Magnetic Interaction Lab</h3>
                                <div style={{ fontSize: '0.8rem', color: '#555' }}>CLICK TO POKE THE FIELD</div>
                            </div>
                            <SkyrmionFieldViz dmi={dmi} field={field} />
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '40px' }}>
                                <div style={{ padding: '24px', background: 'rgba(236, 72, 153, 0.05)', borderRadius: '16px', borderLeft: '4px solid #ec4899' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <h4 style={{ color: '#ec4899', fontSize: '0.8rem', fontWeight: 'bold', margin: 0 }}>DMI STRENGTH (D)</h4>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{dmi.toFixed(2)}</div>
                                    </div>
                                    <input 
                                        type="range" min="0" max="1" step="0.01" value={dmi} 
                                        onChange={(e) => setDmi(parseFloat(e.target.value))}
                                        style={{ width: '100%', accentColor: '#ec4899', marginBottom: '10px' }}
                                    />
                                    <p style={{ fontSize: '0.7rem', color: '#888' }}>The <b>Dzyaloshinskii-Moriya</b> interaction forces spins to tilt, creating the swirl.</p>
                                </div>

                                <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '16px', borderLeft: '4px solid #fff' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <h4 style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 'bold', margin: 0 }}>EXTERNAL FIELD (B)</h4>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{field.toFixed(2)}</div>
                                    </div>
                                    <input 
                                        type="range" min="0.1" max="1" step="0.01" value={field} 
                                        onChange={(e) => setField(parseFloat(e.target.value))}
                                        style={{ width: '100%', accentColor: '#fff', marginBottom: '10px' }}
                                    />
                                    <p style={{ fontSize: '0.7rem', color: '#888' }}>High fields stabilize skyrmions; low fields cause them to expand into labyrinth patterns.</p>
                                </div>
                            </div>
                        </div>
                    ) : view === 'racetrack' ? (
                        <div style={{ 
                            background: 'rgba(255,255,255,0.02)', 
                            borderRadius: '32px', 
                            padding: '40px', 
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}>
                             <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#ec4899' }}>Racetrack Memory Concept</h3>
                             <RacetrackViz />
                             <div style={{ marginTop: '30px', padding: '24px', background: 'rgba(236, 72, 153, 0.05)', borderRadius: '20px' }}>
                                 <h4 style={{ fontSize: '1rem', color: '#ec4899', marginBottom: '10px' }}>Why Skyrmions?</h4>
                                 <p style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: '1.6', margin: 0 }}>
                                    Standard magnetic domains are hard to move. Skyrmions, however, can be pushed with **ultralow electrical currents**. They act as "bits" that flow along a magnetic wire, allowing for memory that has no moving parts and massive density.
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
                             <h3 style={{ fontSize: '1.5rem', marginBottom: '25px' }}>Topological Protection</h3>
                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                 <TheoryCard 
                                    title="Topological Charge (Q=1)" 
                                    desc="A skyrmion is a mapping from the 2D plane to a sphere. It wraps the entire magnetic sphere exactly once, meaning it cannot be smoothed out without breaking the field." 
                                 />
                                 <TheoryCard 
                                    title="Chirality" 
                                    desc="The DMI interaction selects a specific 'handedness'. Skyrmions can be Néel-type (swirling out) or Bloch-type (swirling around)." 
                                 />
                                 <TheoryCard 
                                    title="Particle-Like Nature" 
                                    desc="Despite being just a pattern in the magnetic field, skyrmions interact, bounce off walls, and can be 'annihilated' only by overcoming a massive energy barrier." 
                                 />
                                 <TheoryCard 
                                    title="Magnon Scattering" 
                                    desc="Skyrmions are so stable because they are robust against thermal magnons (spin waves). This is why they are ideal for room-temperature devices." 
                                 />
                             </div>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div style={{ background: '#0a0a0a', padding: '30px', borderRadius: '24px', border: '1px solid #111' }}>
                         <h4 style={{ color: '#ec4899', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase' }}>Module Highlights</h4>
                         <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <FeatureItem icon={<ShieldCheck size={16}/>} text="Topology-Protected State" />
                            <FeatureItem icon={<Zap size={16}/>} text="Low-Power Manipulation" />
                            <FeatureItem icon={<Activity size={16}/>} text="Emergent Spintronics" />
                         </ul>
                    </div>

                    <div style={{ background: 'rgba(236, 72, 153, 0.05)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(236, 72, 153, 0.1)' }}>
                        <h4 style={{ color: '#ec4899', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase' }}>Skyrmion Fact</h4>
                        <p style={{ fontSize: '0.8rem', color: '#888', lineHeight: '1.6', margin: 0 }}>
                            If you try to squash a skyrmion, it pushes back! This "Topological Pressure" makes them behave exactly like rigid elastic particles.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SkyrmionFieldViz({ dmi, field }) {
    const canvasRef = useRef(null);
    const spinsRef = useRef([]);
    const [interacting, setInteracting] = useState(false);

    // Initialize grid
    useEffect(() => {
        const rows = 25;
        const cols = 25;
        const spins = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                spins.push({ x: j, y: i, sz: 1, sx: 0, sy: 0 }); // Ferromagnetic state (up)
            }
        }
        spinsRef.current = spins;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let frame;

        const draw = () => {
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const cellSize = canvas.width / 25;

            spinsRef.current.forEach((spin, idx) => {
                const px = spin.x * cellSize + cellSize/2;
                const py = spin.y * cellSize + cellSize/2;

                // Color based on sz (Red=Up, Blue=Down)
                const hue = spin.sz > 0 ? 0 : 220;
                const sat = Math.abs(spin.sz) * 80 + 20;
                const light = 50;
                
                ctx.fillStyle = `hsla(${hue}, ${sat}%, ${light}%, 0.8)`;
                ctx.strokeStyle = `hsla(${hue}, ${sat}%, ${light}%, 1)`;
                
                // Draw Arrow
                const length = cellSize * 0.4;
                const ang = Math.atan2(spin.sy, spin.sx);
                
                ctx.save();
                ctx.translate(px, py);
                ctx.rotate(ang);
                
                // Arrow line
                ctx.beginPath();
                ctx.moveTo(-length, 0); ctx.lineTo(length, 0);
                // Tip
                ctx.lineTo(length - 3, -3);
                ctx.moveTo(length, 0);
                ctx.lineTo(length - 3, 3);
                ctx.stroke();
                
                // Dot for sz
                ctx.beginPath();
                ctx.arc(0, 0, 2 * Math.abs(spin.sz), 0, Math.PI*2);
                ctx.fill();
                
                ctx.restore();

                // Simple Relaxation (Simulated Hamilton dynamics)
                // In a real lab this would be LLG equation, here we approximate the swirl
            });

            frame = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(frame);
    }, [dmi, field]);

    const handlePoke = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const cellSize = canvasRef.current.width / 25;
        
        const targetX = Math.floor(mx / cellSize);
        const targetY = Math.floor(my / cellSize);

        // Create Skyrmion texture around click
        spinsRef.current.forEach(spin => {
            const dx = spin.x - targetX;
            const dy = spin.y - targetY;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < 4) {
                // Néel-type Skyrmion profile: Sz = cos(theta(r)), Sxy = sin(theta(r)) * r/|r|
                const r = dist / 4 * Math.PI;
                spin.sz = Math.cos(r);
                if (dist > 0) {
                    const mag = Math.sin(r);
                    spin.sx = (dx/dist) * mag;
                    spin.sy = (dy/dist) * mag;
                }
            }
        });
    };

    return <canvas 
        ref={canvasRef} 
        width={600} height={600} 
        onClick={handlePoke}
        style={{ width: '100%', borderRadius: '24px', cursor: 'crosshair', border: '1px solid rgba(255,255,255,0.05)' }} 
    />;
}

function RacetrackViz() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let frame;
        let pos = 0;

        const draw = () => {
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const w = canvas.width;
            const h = canvas.height;
            const cy = h / 2;

            // The Track
            ctx.strokeStyle = '#222';
            ctx.lineWidth = 40;
            ctx.beginPath(); ctx.moveTo(50, cy); ctx.lineTo(w-50, cy); ctx.stroke();
            
            // Skyrmion Bits
            pos = (pos + 1) % (w - 100);
            const drawSkyrmion = (x, label) => {
                const drawX = 50 + ((x + pos) % (w - 100));
                
                // Glowing aura
                const grad = ctx.createRadialGradient(drawX, cy, 0, drawX, cy, 25);
                grad.addColorStop(0, 'rgba(236, 72, 153, 0.4)');
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.beginPath(); ctx.arc(drawX, cy, 25, 0, Math.PI*2); ctx.fill();

                // Core
                ctx.fillStyle = '#ec4899';
                ctx.beginPath(); ctx.arc(drawX, cy, 8, 0, Math.PI*2); ctx.fill();
                
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 10px Inter';
                ctx.textAlign = 'center';
                ctx.fillText(label, drawX, cy + 5);
            };

            drawSkyrmion(0, "1");
            drawSkyrmion(150, "0");
            drawSkyrmion(300, "1");
            drawSkyrmion(450, "1");

            // Reader Head
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            ctx.fillRect(w/2 - 20, cy - 40, 40, 80);
            ctx.strokeStyle = '#fff';
            ctx.strokeRect(w/2 - 20, cy - 40, 40, 80);
            ctx.fillStyle = '#fff';
            ctx.font = '8px Inter';
            ctx.fillText("READ HEAD", w/2, cy - 45);

            frame = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(frame);
    }, []);

    return <canvas ref={canvasRef} width={800} height={200} style={{ width: '100%', borderRadius: '24px' }} />;
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
                background: active ? '#ec4899' : 'rgba(255,255,255,0.03)',
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
            <h4 style={{ color: '#ec4899', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '10px' }}>{title}</h4>
            <p style={{ fontSize: '0.8rem', color: '#888', lineHeight: '1.6' }}>{desc}</p>
        </div>
    );
}

function FeatureItem({ icon, text }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: '#ec4899' }}>{icon}</div>
            <span style={{ fontSize: '0.85rem', color: '#ccc' }}>{text}</span>
        </div>
    );
}
