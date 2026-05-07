import React, { useState } from 'react';
import { Shield, Zap, Info, ArrowRightLeft, BookOpen, Activity, Globe } from 'lucide-react';
import HelicalEdgeSim from './Components/HelicalEdgeSim';

export default function TopologicalApp() {
    const [view, setView] = useState('edge-states');
    const [bField, setBField] = useState(0);
    const [mass, setMass] = useState(1.0); // M parameter

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
                        <Shield size={24} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Quantum Topology Lab</span>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-2px', margin: 0 }}>
                        TOPOLOGICAL <span style={{ color: '#3b82f6' }}>INSULATORS</span>
                    </h1>
                    <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '10px', maxWidth: '600px' }}>
                        Materials that are insulators in their interior but support perfectly conductive, spin-polarized states on their boundaries.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <TabButton active={view === 'edge-states'} onClick={() => setView('edge-states')} icon={<Activity size={16}/>} label="Edge Simulation" />
                    <TabButton active={view === 'theory'} onClick={() => setView('theory')} icon={<BookOpen size={16}/>} label="Z2 Theory" />
                </div>
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
                
                {/* Left Column: Primary Viz */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {view === 'edge-states' ? (
                        <div style={{ 
                            background: 'rgba(255,255,255,0.02)', 
                            borderRadius: '32px', 
                            padding: '40px', 
                            border: '1px solid rgba(255,255,255,0.05)',
                            position: 'relative'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Slab & Reciprocal Space</h3>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                         <div style={{ width: '10px', height: '10px', background: '#3b82f6', borderRadius: '50%' }}></div>
                                         <span style={{ fontSize: '0.8rem', color: '#888' }}>Spin Up (Right)</span>
                                     </div>
                                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                         <div style={{ width: '10px', height: '10px', background: '#f43f5e', borderRadius: '50%' }}></div>
                                         <span style={{ fontSize: '0.8rem', color: '#888' }}>Spin Down (Left)</span>
                                     </div>
                                </div>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#555', marginBottom: '10px' }}>REAL SPACE SLAB</div>
                                    <HelicalEdgeSim height={300} bField={bField} mass={mass} />
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#555', marginBottom: '10px' }}>RECIPROCAL SPACE E(k)</div>
                                    <FullDispersionViz bField={bField} mass={mass} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
                                <div style={{ padding: '24px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '16px', borderLeft: '4px solid #3b82f6' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                        <h4 style={{ color: '#3b82f6', fontSize: '0.8rem', fontWeight: 'bold', margin: 0 }}>TOPOLOGICAL MASS (M)</h4>
                                        <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' }}>M: {mass.toFixed(2)}</div>
                                    </div>
                                    <input 
                                        type="range" min="-1" max="1" step="0.01" value={mass} 
                                        onChange={(e) => setMass(parseFloat(e.target.value))}
                                        style={{ width: '100%', accentColor: '#3b82f6', marginBottom: '10px' }}
                                    />
                                    <p style={{ fontSize: '0.7rem', color: '#888', lineHeight: '1.5' }}>
                                        When <b>M &gt; 0</b>, the bulk is topological. When <b>M = 0</b>, the gap closes (metal). When <b>M &lt; 0</b>, the material is trivial.
                                    </p>
                                </div>

                                <div style={{ padding: '24px', background: 'rgba(244, 63, 94, 0.05)', borderRadius: '16px', borderLeft: '4px solid #f43f5e' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                        <h4 style={{ color: '#f43f5e', fontSize: '0.8rem', fontWeight: 'bold', margin: 0 }}>EXTERNAL FIELD (B)</h4>
                                        <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' }}>B<sub>ext</sub>: {bField.toFixed(2)} T</div>
                                    </div>
                                    <input 
                                        type="range" min="0" max="1" step="0.01" value={bField} 
                                        onChange={(e) => setBField(parseFloat(e.target.value))}
                                        style={{ width: '100%', accentColor: '#f43f5e', marginBottom: '10px' }}
                                    />
                                    <p style={{ fontSize: '0.7rem', color: '#888', lineHeight: '1.5' }}>
                                        <b>IMPORTANT:</b> Unlike the Quantum Hall Effect, TIs work at <b>B = 0</b>. External fields actually <i>destroy</i> the protection.
                                    </p>
                                </div>
                            </div>

                            <div style={{ marginTop: '20px', padding: '24px', background: 'rgba(0,0,0,0.4)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h4 style={{ color: '#3b82f6', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase' }}>The Hamiltonian (BHZ Model)</h4>
                                <Hamiltonian />
                                <div style={{ fontSize: '0.75rem', color: '#888', textAlign: 'center', marginBottom: '15px', fontStyle: 'italic' }}>
                                    Where <b style={{color: '#fff'}}>v<sub>f</sub></b> is the <b>Fermi Velocity</b>.
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                    <div style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                                        <div style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: 'bold', marginBottom: '5px' }}>Mass Term Expansion</div>
                                        <div style={{ fontSize: '1rem', fontFamily: 'serif', color: '#fff' }}>
                                            M(k) = M - B(k<sub>x</sub><sup>2</sup> + k<sub>y</sub><sup>2</sup>)
                                        </div>
                                        <div style={{ fontSize: '0.65rem', color: '#555', marginTop: '5px' }}>
                                            <b style={{color: '#fff'}}>M</b> is the Dirac mass (band gap). Topology requires <b>M/B &gt; 0</b>.
                                        </div>
                                    </div>
                                    <div style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                                        <div style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: 'bold', marginBottom: '5px' }}>Degree of Freedom (DOF)</div>
                                        <div style={{ fontSize: '0.7rem', color: '#888', lineHeight: '1.4' }}>
                                            <b style={{color: '#fff'}}>σ</b> : Orbital/Sublattice space<br/>
                                            <b style={{color: '#fff'}}>s</b> : Physical Spin space
                                        </div>
                                    </div>
                                </div>

                                <p style={{ fontSize: '0.75rem', color: '#666', lineHeight: '1.5' }}>
                                    This expression (Bernevig-Hughes-Zhang model) describes how the <b style={{color: '#fff'}}>spin (s)</b> is locked to the <b style={{color: '#fff'}}>momentum (k)</b> through strong spin-orbit coupling.
                                </p>
                            </div>

                            {/* Comparison Section (From Image) */}
                            <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                                <div>
                                    <BandComparison 
                                        title="Inside TI" 
                                        subtitle="Insulating" 
                                        type="bulk-ti" 
                                    />
                                    <p style={{ fontSize: '0.65rem', color: '#555', marginTop: '10px', lineHeight: '1.4' }}>
                                        The <b>Bulk</b> of the TI has a clear bandgap. Electrons are forbidden here, making the interior an insulator.
                                    </p>
                                </div>
                                <div>
                                    <BandComparison 
                                        title="Edge at TI" 
                                        subtitle="Conducting" 
                                        type="edge-ti" 
                                    />
                                    <p style={{ fontSize: '0.65rem', color: '#555', marginTop: '10px', lineHeight: '1.4' }}>
                                        At the <b>Edge</b>, gapless states cross the bulk gap. These are the <b>helical channels</b> where current flows.
                                    </p>
                                </div>
                                <div>
                                    <BandComparison 
                                        title="Normal Insulator" 
                                        subtitle="Insulating" 
                                        type="ni" 
                                    />
                                    <p style={{ fontSize: '0.65rem', color: '#555', marginTop: '10px', lineHeight: '1.4' }}>
                                        A <b>Trivial Insulator</b> (like vacuum) has a gap but no crossing edge states. It remains insulating everywhere.
                                    </p>
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
                             <h3 style={{ fontSize: '1.5rem', marginBottom: '25px' }}>The Z2 Invariant & Kramers Pairs</h3>
                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                 <TheoryCard 
                                    title="Time-Reversal Symmetry" 
                                    desc="The fundamental protection for TIs. It ensures that for every state at (k, spin), there is a partner at (-k, -spin)." 
                                 />
                                 <TheoryCard 
                                    title="Bulk-Boundary Correspondence" 
                                    desc="The topological properties of the bulk band structure mandates the existence of gapless states on the edges." 
                                 />
                                 <TheoryCard 
                                    title="Topological Protection" 
                                    desc="Edge states are immune to non-magnetic impurities. They simply flow around obstacles." 
                                 />
                                 <TheoryCard 
                                    title="Kramers Degeneracy" 
                                    desc="For Time-Reversal invariant systems, states at Time-Reversal Invariant Momenta (TRIM) must be double degenerate. This glues the edge states to the bulk bands." 
                                 />
                                 <TheoryCard 
                                    title="The Z2 Index (ν)" 
                                    desc="Calculated via the Berry parity. If ν=1, the bands are twisted in a way that cannot be undone without closing the gap." 
                                 />
                             </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Insights & Examples */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div style={{ background: '#0a0a0a', padding: '30px', borderRadius: '24px', border: '1px solid #111' }}>
                        <h4 style={{ color: '#3b82f6', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase' }}>Popular Examples</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <MaterialItem name="HgTe / CdTe" type="2D Topological Insulator" />
                            <MaterialItem name="Bi2Se3 / Bi2Te3" type="3D Topological Insulator" />
                            <MaterialItem name="WTe2" type="Higher-Order TI" />
                        </ul>
                    </div>

                    <div style={{ background: 'rgba(168, 85, 247, 0.05)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(168, 85, 247, 0.1)' }}>
                        <h4 style={{ color: '#a855f7', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase' }}>Why Scientists are Excited</h4>
                        <p style={{ fontSize: '0.85rem', color: '#888', lineHeight: '1.6' }}>
                            TIs offer a path to <b style={{color: '#fff'}}>Spintronics</b> and <b style={{color: '#fff'}}>Topological Quantum Computing</b>. By using the spin of electrons instead of their charge, we can build computers that generate almost no heat.
                        </p>
                    </div>
                </div>

            </div>
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
                background: active ? '#3b82f6' : 'rgba(255,255,255,0.03)',
                color: active ? '#fff' : '#888',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
            }}
        >
            {icon} {label}
        </button>
    );
}

function TheoryCard({ title, desc }) {
    // Process **text** into <b>text</b>
    const processText = (text) => {
        const parts = text.split('**');
        return parts.map((part, i) => i % 2 === 1 ? <b key={i} style={{ color: '#fff' }}>{part}</b> : part);
    };

    return (
        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '10px' }}>{title}</h4>
            <p style={{ fontSize: '0.8rem', color: '#666', lineHeight: '1.6' }}>{processText(desc)}</p>
        </div>
    );
}

function MaterialItem({ name, type }) {
    return (
        <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid #151515' }}>
            <span style={{ fontSize: '0.9rem', color: '#eee' }}>{name}</span>
            <span style={{ fontSize: '0.7rem', color: '#555' }}>{type}</span>
        </li>
    );
}

const Hamiltonian = () => (
    <div style={{ 
        fontSize: '1.4rem', 
        fontFamily: "'Times New Roman', serif", 
        textAlign: 'center', 
        margin: '25px 0', 
        color: '#fff',
        padding: '20px',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '16px',
        letterSpacing: '1px'
    }}>
        <i>H</i>(<b>k</b>) = <i>v<sub>f</sub></i> (<i>k<sub>x</sub>σ<sub>z</sub>s<sub>x</sub></i> - <i>k<sub>y</sub>s<sub>y</sub></i>) + <i>M</i>(<b>k</b>)<i>σ<sub>z</sub></i>
    </div>
);

function BandComparison({ title, subtitle, type }) {
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);
        
        // Draw Axes
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(10, h - 10); ctx.lineTo(w - 10, h - 10); // k
        ctx.moveTo(w / 2, 10); ctx.lineTo(w / 2, h - 10); // E
        ctx.stroke();

        ctx.fillStyle = '#555';
        ctx.font = '8px Inter';
        ctx.fillText("Energy", 5, 20);
        ctx.fillText("Wave vector (k)", w - 60, h - 2);

        // Draw Bands
        const drawBand = (offset, invert = false) => {
            ctx.beginPath();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1.5;
            for (let x = 10; x < w - 10; x++) {
                const k = (x - w/2) / 20;
                let E;
                if (type === 'bulk-ti') {
                    // M-shaped bulk bands
                    E = 0.5 * (k*k - 1) * (k*k - 1) + offset;
                } else {
                    // Parabolic bands
                    E = 0.4 * k * k + offset;
                }
                const y = invert ? h/2 + E * 15 : h/2 - E * 15;
                if (x === 10) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();
        };

        drawBand(1.5, false); // Conduction
        drawBand(1.5, true);  // Valence

        // Crossing Edge States
        if (type === 'edge-ti') {
            ctx.beginPath();
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
            // Cross 1
            ctx.moveTo(w/2 - 30, h/2 + 22); ctx.lineTo(w/2 + 30, h/2 - 22);
            // Cross 2
            ctx.moveTo(w/2 - 30, h/2 - 22); ctx.lineTo(w/2 + 30, h/2 + 22);
            ctx.stroke();
        }

    }, [type]);

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 'bold' }}>{title}</div>
            <div style={{ fontSize: '0.65rem', color: '#666', marginBottom: '10px' }}>{subtitle}</div>
            <canvas ref={canvasRef} width={150} height={120} style={{ border: '1px solid #1a1a1a', borderRadius: '8px', background: '#000' }} />
        </div>
    );
}

function FullDispersionViz({ bField = 0, mass = 1.0 }) {
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let frame;

        const draw = () => {
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const rx = 0.8;
            const ry = 0.5 + Math.sin(Date.now() * 0.0005) * 0.3;
            const cosX = Math.cos(rx), sinX = Math.sin(rx);
            const cosY = Math.cos(ry), sinY = Math.sin(ry);

            const project = (kx, ky, e) => {
                let x = kx * cosY - ky * sinY;
                let z = kx * sinY + ky * cosY;
                let y = e * 20;
                let xRot = x;
                let yRot = y * cosX - z * sinX;
                let zRot = y * sinX + z * cosX;
                const f = 150 / (zRot + 8);
                return { x: canvas.width/2 + xRot * f * 10, y: canvas.height/2 - yRot * f * 10 };
            };

            // 1. Draw Bulk Surfaces
            const res = 15;
            const range = 2.5;
            for(let i=0; i<=res; i++) {
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(255,255,255,0.05)';
                for(let j=0; j<=res; j++) {
                    const kx = (i/res - 0.5) * range;
                    const ky = (j/res - 0.5) * range;
                    const M = mass; const B = 0.5;
                    const Mk = M - B * (kx*kx + ky*ky);
                    const e = Math.sqrt(kx*kx + ky*ky + Mk*Mk);
                    const p1 = project(kx, ky, e + 1);
                    if (j === 0) ctx.moveTo(p1.x, p1.y); else ctx.lineTo(p1.x, p1.y);
                }
                ctx.stroke();

                ctx.beginPath();
                ctx.strokeStyle = 'rgba(255,255,255,0.05)';
                for(let j=0; j<=res; j++) {
                    const kx = (i/res - 0.5) * range;
                    const ky = (j/res - 0.5) * range;
                    const M = mass; const B = 0.5;
                    const Mk = M - B * (kx*kx + ky*ky);
                    const e = Math.sqrt(kx*kx + ky*ky + Mk*Mk);
                    const p2 = project(kx, ky, -(e + 1));
                    if (j === 0) ctx.moveTo(p2.x, p2.y); else ctx.lineTo(p2.x, p2.y);
                }
                ctx.stroke();
            }

            // 2. Draw Crossing Edge States (Only if mass > 0)
            if (mass > 0.05) {
                ctx.lineWidth = 2;
                // Up Spin
                ctx.beginPath(); ctx.strokeStyle = '#3b82f6';
                for(let kx = -1.5; kx <= 1.5; kx += 0.1) {
                    const e = Math.sqrt(kx*kx*4 + bField*bField*25);
                    const p = project(kx, 0, e);
                    if (kx === -1.5) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
                }
                ctx.stroke();

                // Down Spin
                ctx.beginPath(); ctx.strokeStyle = '#f43f5e';
                for(let kx = -1.5; kx <= 1.5; kx += 0.1) {
                    const e = -Math.sqrt(kx*kx*4 + bField*bField*25);
                    const p = project(kx, 0, e);
                    if (kx === -1.5) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
                }
                ctx.stroke();
            }

            frame = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(frame);
    }, [bField, mass]);

    return <canvas ref={canvasRef} width={300} height={300} style={{ width: '100%', height: '300px', borderRadius: '16px', background: '#000' }} />;
}
