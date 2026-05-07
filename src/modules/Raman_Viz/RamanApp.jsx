import React, { useState, useRef, useEffect } from 'react';
import { Target, Zap, Activity, BookOpen, Sun, Waves, Search } from 'lucide-react';

export default function RamanApp() {
    const [view, setView] = useState('scattering');
    const [sample, setSample] = useState('graphene');
    const [laserPower, setLaserPower] = useState(0.5);

    const samples = {
        graphene: { name: 'Graphene', peaks: [{ pos: 1580, h: 0.8, label: 'G band' }, { pos: 2700, h: 1.2, label: '2D band' }], color: '#4ade80' },
        diamond: { name: 'Diamond', peaks: [{ pos: 1332, h: 1.5, label: 'Diamond peak' }], color: '#60a5fa' },
        silicon: { name: 'Silicon', peaks: [{ pos: 520, h: 1.0, label: 'Si optical' }], color: '#f87171' }
    };

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
                        <Search size={24} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Molecular Spectroscopy</span>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-2px', margin: 0 }}>
                        RAMAN <span style={{ color: '#f59e0b' }}>SPECTROSCOPY</span>
                    </h1>
                    <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '10px', maxWidth: '600px' }}>
                        Inelastic light scattering as a "fingerprint" for molecules. From C.V. Raman's discovery to modern material science.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <TabButton active={view === 'scattering'} onClick={() => setView('scattering')} icon={<Waves size={16}/>} label="Scattering Physics" />
                    <TabButton active={view === 'spectrum'} onClick={() => setView('spectrum')} icon={<Activity size={16}/>} label="Spectrum Analysis" />
                    <TabButton active={view === 'theory'} onClick={() => setView('theory')} icon={<BookOpen size={16}/>} label="Stokes Theory" />
                </div>
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
                
                {/* Left Column: Visualizers */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    
                    {/* Controls */}
                    <div style={{ padding: '30px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '24px', borderLeft: '4px solid #f59e0b' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                            <div>
                                <h4 style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '15px' }}>SELECT SAMPLE</h4>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {Object.keys(samples).map(s => (
                                        <button 
                                            key={s}
                                            onClick={() => setSample(s)}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '10px',
                                                background: sample === s ? '#f59e0b' : 'rgba(255,255,255,0.05)',
                                                color: sample === s ? '#000' : '#888',
                                                border: 'none',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            {samples[s].name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '15px' }}>LASER POWER</h4>
                                <input 
                                    type="range" min="0.1" max="1" step="0.01" value={laserPower} 
                                    onChange={(e) => setLaserPower(parseFloat(e.target.value))}
                                    style={{ width: '100%', accentColor: '#f59e0b' }}
                                />
                            </div>
                        </div>
                    </div>

                    {view === 'scattering' ? (
                        <div style={{ 
                            background: 'rgba(255,255,255,0.02)', 
                            borderRadius: '32px', 
                            padding: '40px', 
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#f59e0b' }}>The Raman Effect: Inelastic Scattering</h3>
                            <ScatteringViz power={laserPower} />
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '30px' }}>
                                <ProcessCard type="Rayleigh" color="#fff" desc="Elastic. Photon energy remains the same." />
                                <ProcessCard type="Stokes" color="#f59e0b" desc="Inelastic. Molecule absorbs energy. Photon is Red-shifted." />
                                <ProcessCard type="Anti-Stokes" color="#60a5fa" desc="Inelastic. Molecule loses energy. Photon is Blue-shifted." />
                            </div>
                        </div>
                    ) : view === 'spectrum' ? (
                        <div style={{ 
                            background: 'rgba(255,255,255,0.02)', 
                            borderRadius: '32px', 
                            padding: '40px', 
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}>
                             <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#f59e0b' }}>Raman Shift Spectrum (cm⁻¹)</h3>
                             <SpectrumViz data={samples[sample]} power={laserPower} />
                             <div style={{ marginTop: '30px', padding: '24px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '20px' }}>
                                 <h4 style={{ fontSize: '1rem', color: '#f59e0b', marginBottom: '10px' }}>Structural Identification</h4>
                                 <p style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: '1.6', margin: 0 }}>
                                    Each peak corresponds to a specific **vibrational mode** of the crystal lattice. For Graphene, the G-band tells us about the sp2 carbon atoms, while the 2D-band indicates the number of layers.
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
                             <h3 style={{ fontSize: '1.5rem', marginBottom: '25px' }}>Energy Level Dynamics</h3>
                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                 <TheoryCard 
                                    title="Virtual States" 
                                    desc="Unlike IR absorption, Raman involves excitation to a non-resonant 'virtual' state before immediate scattering." 
                                 />
                                 <TheoryCard 
                                    title="Polarizability" 
                                    desc="For a mode to be Raman active, the molecule's polarizability must change during the vibration." 
                                 />
                                 <TheoryCard 
                                    title="Stokes vs Anti-Stokes" 
                                    desc="Stokes transitions start from the ground state. Anti-Stokes start from an excited vibrational state (usually weaker at room temp)." 
                                 />
                                 <TheoryCard 
                                    title="Wavenumbers (cm⁻¹)" 
                                    desc="We measure the 'Shift' relative to the laser frequency. It is independent of the laser's absolute wavelength." 
                                 />
                             </div>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div style={{ background: '#0a0a0a', padding: '30px', borderRadius: '24px', border: '1px solid #111' }}>
                         <h4 style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase' }}>Sample Analysis</h4>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <MetricBox label="Sample Material" value={samples[sample].name} color={samples[sample].color} />
                            <MetricBox label="Scattering Efficiency" value="1 in 10⁷ photons" color="#888" />
                            <MetricBox label="Anti-Stokes Ratio" value="Low (e^(-ΔE/kT))" color="#888" />
                         </div>
                    </div>

                    <div style={{ background: 'rgba(245, 158, 11, 0.05)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
                        <h4 style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase' }}>Did you know?</h4>
                        <p style={{ fontSize: '0.8rem', color: '#888', lineHeight: '1.6', margin: 0 }}>
                            C.V. Raman won the Nobel Prize in 1930 for this discovery. He used sunlight and a telescope with his own eyes as a detector!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ScatteringViz({ power }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        let frame;
        let photons = [];

        const draw = () => {
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, w, h);
            const time = Date.now() * 0.001;

            // Molecule
            const cx = w/2; const cy = h/2;
            const vib = Math.sin(time * 10) * 5;
            ctx.fillStyle = '#444';
            ctx.beginPath(); ctx.arc(cx - 30 - vib, cy, 20, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(cx + 30 + vib, cy, 20, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = '#666'; ctx.lineWidth = 4;
            ctx.beginPath(); ctx.moveTo(cx - 30 - vib, cy); ctx.lineTo(cx + 30 + vib, cy); ctx.stroke();

            // Laser Beam
            const grad = ctx.createLinearGradient(0, cy, cx, cy);
            grad.addColorStop(0, 'transparent');
            grad.addColorStop(1, `rgba(245, 158, 11, ${0.2 * power})`);
            ctx.fillStyle = grad;
            ctx.fillRect(0, cy-10, cx, 20);

            // Scattering Photons
            if (Math.random() < 0.2 * power) {
                const type = Math.random() > 0.9 ? (Math.random() > 0.5 ? 'stokes' : 'antistokes') : 'rayleigh';
                photons.push({ x: cx, y: cy, vx: (Math.random()-0.5)*4, vy: (Math.random()-0.5)*4, type, life: 1 });
            }

            photons.forEach((p, i) => {
                p.x += p.vx; p.y += p.vy; p.life -= 0.01;
                const color = p.type === 'stokes' ? '#f59e0b' : (p.type === 'antistokes' ? '#60a5fa' : '#fff');
                ctx.fillStyle = color;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.type === 'rayleigh' ? 2 : 3, 0, Math.PI*2); ctx.fill();
                if(p.life <= 0) photons.splice(i, 1);
            });

            frame = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(frame);
    }, [power]);

    return <canvas ref={canvasRef} width={600} height={400} style={{ width: '100%', borderRadius: '24px' }} />;
}

function SpectrumViz({ data, power }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        let frame;

        const draw = () => {
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, w, h);

            const margin = 60;
            const plotW = w - margin * 2;
            const plotH = h - margin * 2;

            // Axis
            ctx.strokeStyle = '#333';
            ctx.beginPath(); ctx.moveTo(margin, margin); ctx.lineTo(margin, h-margin); ctx.lineTo(w-margin, h-margin); ctx.stroke();

            // Rayleigh Peak (Center/Left)
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.beginPath();
            ctx.moveTo(margin, h-margin);
            ctx.lineTo(margin + 20, h-margin - plotH * 0.9 * power);
            ctx.lineTo(margin + 40, h-margin);
            ctx.stroke();

            // Raman Peaks
            data.peaks.forEach(p => {
                const x = margin + (p.pos / 3000) * plotW;
                const height = p.h * plotH * 0.5 * power;
                
                ctx.strokeStyle = data.color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x - 10, h-margin);
                ctx.quadraticCurveTo(x, h-margin - height * 1.2, x + 10, h-margin);
                ctx.stroke();

                ctx.fillStyle = data.color;
                ctx.font = '10px Inter';
                ctx.textAlign = 'center';
                ctx.fillText(p.label, x, h-margin - height - 10);
            });

            ctx.fillStyle = '#666';
            ctx.font = '10px Inter';
            ctx.textAlign = 'center';
            ctx.fillText("Raman Shift (cm⁻¹)", w/2, h - 20);
            ctx.fillText("0", margin, h-margin + 15);
            ctx.fillText("3000", w-margin, h-margin + 15);

            frame = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(frame);
    }, [data, power]);

    return <canvas ref={canvasRef} width={600} height={400} style={{ width: '100%', borderRadius: '24px' }} />;
}

function ProcessCard({ type, color, desc }) {
    return (
        <div style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', borderTop: `4px solid ${color}` }}>
            <h5 style={{ margin: '0 0 5px 0', color: color, fontSize: '0.8rem' }}>{type}</h5>
            <p style={{ margin: 0, fontSize: '0.7rem', color: '#888', lineHeight: '1.4' }}>{desc}</p>
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
