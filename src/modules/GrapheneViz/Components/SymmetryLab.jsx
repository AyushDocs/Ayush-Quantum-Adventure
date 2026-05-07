import React, { useState } from 'react';
import { RefreshCw, Shield, Zap, AlertTriangle, Lightbulb, Magnet, Move } from 'lucide-react';

export default function SymmetryLab({ mass, phi, setMass, setPhi }) {
    const [activeTab, setActiveTab] = useState('normal');

    const sections = {
        normal: {
            title: "Normal State: PT Protection",
            icon: <Shield size={20} color="#10b981" />,
            description: "In pristine graphene, Time-Reversal (T) and Inversion (P) symmetries are both intact. Their combination (PT) forces the bands to touch at the K-points.",
            details: "This is why graphene is a semimetal. The Dirac points are 'topologically protected' as long as these symmetries exist.",
            impact: "Zero gap, massless carriers, ultra-high mobility.",
            color: "#10b981"
        },
        brokenT: {
            title: "Breaking T: Magnetic Topology",
            icon: <Magnet size={20} color="#3b82f6" />,
            description: "Adding a magnetic field or internal magnetic order breaks Time-Reversal symmetry. This is modeled by the Haldane Phase (φ).",
            details: "Breaking T without breaking P leads to a Chern Insulator. Electrons flow only along the edges, like a highway with no traffic jams.",
            impact: "Quantized Hall Effect, dissipationless edge states.",
            color: "#3b82f6"
        },
        brokenP: {
            title: "Breaking P: The Mass Gap",
            icon: <Move size={20} color="#f43f5e" />,
            description: "Breaking Spatial Symmetry (Inversion) happens when the two carbon sublattices (A and B) become unequal. This is the Mass term (M).",
            details: "This creates a 'trivial' gap. It turns the semimetal into a standard semiconductor like Silicon, but without topological protection.",
            impact: "Opens an energy gap, makes transistors possible but lose 'magic' transport.",
            color: "#f43f5e"
        }
    };

    const current = sections[activeTab];

    return (
        <div style={{
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '32px',
            padding: '40px',
            border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
            marginTop: '40px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '900', letterSpacing: '-1px' }}>
                        SYMMETRY & <span style={{ color: '#a855f7' }}>TOPOLOGY LAB</span>
                    </h2>
                    <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '5px' }}>
                        Explore how breaking the fundamental laws of T and P changes the quantum landscape.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {Object.keys(sections).map(key => (
                        <button 
                            key={key}
                            onClick={() => setActiveTab(key)}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '12px',
                                border: '1px solid',
                                borderColor: activeTab === key ? sections[key].color : 'rgba(255,255,255,0.1)',
                                background: activeTab === key ? `${sections[key].color}1a` : 'transparent',
                                color: activeTab === key ? sections[key].color : '#666',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {sections[key].title.split(':')[0]}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
                {/* Content Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                        <div style={{ padding: '15px', background: `${current.color}1a`, borderRadius: '16px', color: current.color }}>
                            {current.icon}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '10px', color: '#fff' }}>{current.title}</h3>
                            <p style={{ color: '#ccc', lineHeight: '1.7', fontSize: '0.95rem' }}>{current.description}</p>
                        </div>
                    </div>

                    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.03)' }}>
                        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#666', marginBottom: '10px', letterSpacing: '1px' }}>The Physics Detail</h4>
                        <p style={{ fontSize: '0.9rem', color: '#aaa', lineHeight: '1.6' }}>{current.details}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ flex: 1, padding: '15px', background: 'rgba(168, 85, 247, 0.05)', borderRadius: '16px', border: '1px solid rgba(168, 85, 247, 0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a855f7', marginBottom: '8px' }}>
                                <Zap size={14} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>OBSERVABLE IMPACT</span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#ccc' }}>{current.impact}</p>
                        </div>
                        <div style={{ flex: 1, padding: '15px', background: 'rgba(251, 191, 36, 0.05)', borderRadius: '16px', border: '1px solid rgba(251, 191, 36, 0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', marginBottom: '8px' }}>
                                <Lightbulb size={14} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>WHY SCIENTISTS CARE</span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#ccc' }}>
                                This enables **dissipationless electronics** and the next generation of **topological quantum computers**.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Interactive Interaction Area */}
                <div style={{ background: '#000', borderRadius: '24px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '25px', justifyContent: 'center' }}>
                    <h4 style={{ fontSize: '0.8rem', color: '#555', textAlign: 'center', textTransform: 'uppercase' }}>Live Symmetry Injector</h4>
                    
                    {/* Mini Simple Cone Canvas */}
                    <div style={{ height: '150px', background: 'radial-gradient(circle, #0a0a0a 0%, #000 100%)', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
                        <SimpleCone mass={mass} phi={phi} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.75rem', color: '#aaa' }}>Sublattice Imbalance (M)</span>
                                <span style={{ fontSize: '0.75rem', color: '#f43f5e' }}>{mass.toFixed(2)}</span>
                            </div>
                            <input 
                                type="range" min="-1" max="1" step="0.01" value={mass} 
                                onChange={(e) => setMass(parseFloat(e.target.value))}
                                style={{ width: '100%', accentColor: '#f43f5e' }}
                            />
                            <div style={{ fontSize: '0.6rem', color: '#444', marginTop: '5px' }}>{Math.abs(mass) > 0.1 ? '⚠️ Breaking Spatial Symmetry (P)' : '✓ Inversion Symmetry Intact'}</div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.75rem', color: '#aaa' }}>Haldane Phase (φ)</span>
                                <span style={{ fontSize: '0.75rem', color: '#3b82f6' }}>{(phi / Math.PI).toFixed(2)}π</span>
                            </div>
                            <input 
                                type="range" min="0" max={Math.PI * 2} step="0.01" value={phi} 
                                onChange={(e) => setPhi(parseFloat(e.target.value))}
                                style={{ width: '100%', accentColor: '#3b82f6' }}
                            />
                            <div style={{ fontSize: '0.6rem', color: '#444', marginTop: '5px' }}>{Math.abs(Math.sin(phi)) > 0.1 ? '⚠️ Breaking Time-Reversal (T)' : '✓ Time-Reversal Intact'}</div>
                        </div>
                    </div>

                    <div style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.7rem', color: '#888' }}>Resulting Topology:</span>
                        <div style={{ fontSize: '1rem', fontWeight: '900', color: '#fff', marginTop: '5px' }}>
                            {Math.abs(mass) < 0.1 && Math.abs(Math.sin(phi)) < 0.1 ? 'PT-PROTECTED SEMIMETAL' : 
                             Math.abs(mass) > Math.abs(Math.sin(phi)) ? 'TRIVIAL INSULATOR' : 'CHERN INSULATOR'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Popular Examples Footer */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', display: 'flex', gap: '30px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#555', textTransform: 'uppercase', fontWeight: 'bold' }}>Real-world Examples:</span>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <ExampleBadge text="Haldane Model" />
                    <ExampleBadge text="Bi2Se3 (Topological Insulator)" />
                    <ExampleBadge text="Magnetic Weyl Semimetals" />
                    <ExampleBadge text="Quantum Hall Systems" />
                </div>
            </div>
        </div>
    );
}

function ExampleBadge({ text }) {
    return (
        <div style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '0.7rem', color: '#888', border: '1px solid rgba(255,255,255,0.05)' }}>
            {text}
        </div>
    );
}

function SimpleCone({ mass, phi }) {
    const canvasRef = React.useRef(null);
    
    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let frame;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Effective gap at Dirac point
            const mEff = mass - 3 * 0.15 * Math.sin(phi); // Simplified t2=0.15
            const res = 12;
            const range = 1.0;
            const scale = 40;

            const project = (kx, ky, e) => {
                const rx = 0.8, ry = 0.5 + Math.sin(Date.now() * 0.001) * 0.1;
                const cosX = Math.cos(rx), sinX = Math.sin(rx);
                const cosY = Math.cos(ry), sinY = Math.sin(ry);
                let x = kx * cosY - ky * sinY;
                let z = kx * sinY + ky * cosY;
                let y = e * 2; // Reduced energy scale factor
                let xRot = x;
                let yRot = y * cosX - z * sinX;
                let zRot = y * sinX + z * cosX;
                const f = scale / (zRot + 4);
                return { 
                    x: canvas.width / 2 + xRot * f * 10, // Reduced multiplier to fit 200px
                    y: canvas.height / 2 - yRot * f * 10 
                };
            };

            for(let i=0; i<=res; i++) {
                ctx.beginPath();
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = i % 2 === 0 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(59, 130, 246, 0.8)';
                for(let j=0; j<=res; j++) {
                    const kx = (i/res - 0.5) * range;
                    const ky = (j/res - 0.5) * range;
                    const mag = Math.sqrt(kx*kx + ky*ky + mEff*mEff);
                    const p1 = project(kx, ky, mag);
                    if (j === 0) { ctx.moveTo(p1.x, p1.y); } else { ctx.lineTo(p1.x, p1.y); }
                }
                ctx.stroke();

                ctx.beginPath();
                ctx.strokeStyle = i % 2 === 0 ? 'rgba(59, 130, 246, 0.8)' : 'rgba(16, 185, 129, 0.8)';
                for(let j=0; j<=res; j++) {
                    const kx = (i/res - 0.5) * range;
                    const ky = (j/res - 0.5) * range;
                    const mag = Math.sqrt(kx*kx + ky*ky + mEff*mEff);
                    const p2 = project(kx, ky, -mag);
                    if (j === 0) { ctx.moveTo(p2.x, p2.y); } else { ctx.lineTo(p2.x, p2.y); }
                }
                ctx.stroke();
            }

            frame = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(frame);
    }, [mass, phi]);

    return <canvas ref={canvasRef} width={200} height={150} style={{ width: '100%', height: '100%' }} />;
}
