import React, { useState, useRef, useEffect } from 'react';
import { Target, Zap, Activity, BookOpen, Layers, Shield, RefreshCw } from 'lucide-react';

export default function TwistedGrapheneApp() {
    const [view, setView] = useState('moire');
    const [angle, setAngle] = useState(3.0); // Twist angle in degrees
    const [showSuperlattice, setShowSuperlattice] = useState(true);

    const magicAngle = 1.08;
    const isMagic = Math.abs(angle - magicAngle) < 0.1;

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#f59e0b', marginBottom: '10px' }}>
                        <RefreshCw size={24} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Moiré Quantum Materials</span>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-2px', margin: 0 }}>
                        TWISTED <span style={{ color: '#f59e0b' }}>GRAPHENE</span>
                    </h1>
                    <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '10px', maxWidth: '600px' }}>
                        The "Magic Angle" of 1.1° creates flat bands where electrons lose their kinetic energy and start dancing together.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <TabButton active={view === 'moire'} onClick={() => setView('moire')} icon={<Layers size={16}/>} label="Moiré Pattern" />
                    <TabButton active={view === 'bands'} onClick={() => setView('bands')} icon={<Activity size={16}/>} label="Flat Bands" />
                    <TabButton active={view === 'theory'} onClick={() => setView('theory')} icon={<BookOpen size={16}/>} label="Magic Theory" />
                </div>
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
                
                {/* Left Column: Visualizers */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {view === 'moire' ? (
                        <div style={{ 
                            background: 'rgba(255,255,255,0.02)', 
                            borderRadius: '32px', 
                            padding: '40px', 
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}>
                            <MoireViz angle={angle} />
                            <AngleControls angle={angle} setAngle={setAngle} isMagic={isMagic} />
                        </div>
                    ) : view === 'bands' ? (
                        <div style={{ 
                            background: 'rgba(255,255,255,0.02)', 
                            borderRadius: '32px', 
                            padding: '40px', 
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}>
                             <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#f59e0b' }}>Band Structure Folding</h3>
                             <FlatBandViz angle={angle} />
                             <AngleControls angle={angle} setAngle={setAngle} isMagic={isMagic} />
                             <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '16px' }}>
                                 <p style={{ fontSize: '0.8rem', color: '#888', lineHeight: '1.6', margin: 0 }}>
                                     {isMagic 
                                        ? "At 1.1°, the Fermi velocity vanishes. The bands become almost perfectly horizontal (Flat Bands). Without kinetic energy, electron-electron repulsion dominates, leading to Superconductivity." 
                                        : "At large angles, the Dirac cones of the two layers are separated in k-space. They behave like two independent sheets of graphene."
                                     }
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
                             <h3 style={{ fontSize: '1.5rem', marginBottom: '25px' }}>The Moiré Revolution</h3>
                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                 <TheoryCard 
                                    title="Vanishing Velocity" 
                                    desc="Interlayer tunneling (w) interferes with the Dirac dispersion. At the magic angle, the slope (v_f) of the cone drops to exactly zero." 
                                 />
                                 <TheoryCard 
                                    title="Strong Correlations" 
                                    desc="In flat bands, electrons move so slowly that their mutual repulsion (Coulomb interaction) becomes the strongest force in the system." 
                                 />
                                 <TheoryCard 
                                    title="Moiré Superlattice" 
                                    desc="The twist creates a huge 'Super-Atom' structure with a period of ~13nm. This acts as a new periodic potential for the electrons." 
                                 />
                                 <TheoryCard 
                                    title="Tunable Superconductivity" 
                                    desc="Unlike YBCO, TBG superconductivity is tunable by a simple voltage gate. You can switch from insulator to superconductor in real-time." 
                                 />
                             </div>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div style={{ background: '#0a0a0a', padding: '30px', borderRadius: '24px', border: '1px solid #111' }}>
                         <h4 style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase' }}>Module Highlights</h4>
                         <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <FeatureItem icon={<RefreshCw size={16}/>} text="Moiré Interference" />
                            <FeatureItem icon={<Zap size={16}/>} text="Flat Band Emergence" />
                            <FeatureItem icon={<Target size={16}/>} text="Magic Angle (1.1°)" />
                         </ul>
                         {isMagic && (
                            <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                <p style={{ fontSize: '0.7rem', color: '#10b981', margin: 0, lineHeight: '1.4' }}>
                                    <b>SUPERCONDUCTIVITY ACTIVE:</b> The system is now in a correlated state due to flat-band physics.
                                </p>
                            </div>
                         )}
                    </div>

                    <div style={{ background: 'rgba(245, 158, 11, 0.05)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
                        <h4 style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase' }}>Observation</h4>
                        <p style={{ fontSize: '0.8rem', color: '#888', lineHeight: '1.6', margin: 0 }}>
                            Watch how the large hexagonal "super-atoms" (the dark regions) get bigger as the angle decreases. This is the **Moiré Period** $L_m \approx a / (2 \sin(\theta/2))$.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MoireViz({ angle }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;

        const draw = () => {
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, w, h);

            const drawLattice = (rot, color, opacity) => {
                ctx.strokeStyle = color;
                ctx.globalAlpha = opacity;
                ctx.lineWidth = 1;
                
                const size = 6; // Atom spacing
                const rad = angle * Math.PI / 180;
                
                for(let i=-30; i<30; i++) {
                    for(let j=-30; j<30; j++) {
                        // Hexagonal coordinates
                        let x = i * size * 1.5;
                        let y = j * size * Math.sqrt(3) + (i % 2) * size * Math.sqrt(3)/2;
                        
                        // Rotate
                        const rx = x * Math.cos(rot) - y * Math.sin(rot);
                        const ry = x * Math.sin(rot) + y * Math.cos(rot);
                        
                        // Only draw if within bounds
                        if (Math.abs(rx) < 250 && Math.abs(ry) < 250) {
                            ctx.beginPath();
                            ctx.arc(cx + rx, cy + ry, 1, 0, Math.PI*2);
                            ctx.stroke();
                        }
                    }
                }
            };

            // Fixed Layer
            drawLattice(0, '#333', 0.5);
            // Rotated Layer
            drawLattice(angle * Math.PI / 180, '#f59e0b', 0.8);
            
            ctx.globalAlpha = 1;
        };
        draw();
    }, [angle]);

    return <canvas ref={canvasRef} width={600} height={600} style={{ width: '100%', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }} />;
}

function FlatBandViz({ angle }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;

        const draw = () => {
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, w, h);

            // Axis
            ctx.strokeStyle = '#333';
            ctx.beginPath(); ctx.moveTo(50, cy); ctx.lineTo(w-50, cy); ctx.stroke();

            const magicAngle = 1.08;
            const diff = Math.abs(angle - magicAngle);
            const flatFactor = Math.max(0.05, Math.min(1, diff / 5)); // Lower slope near magic angle

            // Band drawing
            ctx.strokeStyle = isMagic(angle) ? '#10b981' : '#f59e0b';
            ctx.lineWidth = 3;
            ctx.beginPath();
            
            for(let k=-200; k<=200; k++) {
                // Two hybridized Dirac cones
                const k1 = k - 20 * (angle/ magicAngle);
                const k2 = k + 20 * (angle/ magicAngle);
                
                // Simple hybridization model: sqrt(E1^2 + Delta^2)
                const e1 = Math.abs(k) * flatFactor;
                const oscillation = Math.sin(k * 0.1) * (1 - flatFactor) * 20;
                
                const y = cy - (e1 + oscillation);
                if (k === -200) ctx.moveTo(cx + k, y); else ctx.lineTo(cx + k, y);
            }
            ctx.stroke();

            // Lower Band
            ctx.beginPath();
            for(let k=-200; k<=200; k++) {
                const e1 = Math.abs(k) * flatFactor;
                const oscillation = Math.sin(k * 0.1) * (1 - flatFactor) * 20;
                const y = cy + (e1 + oscillation);
                if (k === -200) ctx.moveTo(cx + k, y); else ctx.lineTo(cx + k, y);
            }
            ctx.stroke();

            ctx.fillStyle = '#888';
            ctx.font = '10px Inter';
            ctx.fillText("MOMENTUM (k)", w-100, cy + 20);
            ctx.fillText("ENERGY (E)", 60, 40);
        };

        const isMagic = (a) => Math.abs(a - 1.08) < 0.2;
        draw();
    }, [angle]);

    return <canvas ref={canvasRef} width={600} height={400} style={{ width: '100%', borderRadius: '24px' }} />;
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
                background: active ? '#f59e0b' : 'rgba(255,255,255,0.03)',
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
            <h4 style={{ color: '#f59e0b', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '10px' }}>{title}</h4>
            <p style={{ fontSize: '0.8rem', color: '#888', lineHeight: '1.6' }}>{desc}</p>
        </div>
    );
}

function FeatureItem({ icon, text }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: '#f59e0b' }}>{icon}</div>
            <span style={{ fontSize: '0.85rem', color: '#ccc' }}>{text}</span>
        </div>
    );
}

function AngleControls({ angle, setAngle, isMagic }) {
    return (
        <div style={{ marginTop: '40px', padding: '30px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '24px', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <h4 style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 'bold', margin: 0 }}>TWIST ANGLE (θ)</h4>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{angle.toFixed(2)}°</div>
                    {isMagic && <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.8rem' }}>✨ MAGIC ANGLE REACHED</div>}
                </div>
            </div>
            <input 
                type="range" min="0.5" max="10" step="0.01" value={angle} 
                onChange={(e) => setAngle(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#f59e0b', marginBottom: '15px' }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                    onClick={() => setAngle(1.08)}
                    style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid #10b981', padding: '5px 12px', borderRadius: '8px', fontSize: '0.7rem', cursor: 'pointer' }}
                >
                    Jump to 1.08°
                </button>
                <button 
                    onClick={() => setAngle(5.0)}
                    style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#888', border: '1px solid #444', padding: '5px 12px', borderRadius: '8px', fontSize: '0.7rem', cursor: 'pointer' }}
                >
                    Large Angle
                </button>
            </div>
        </div>
    );
}
