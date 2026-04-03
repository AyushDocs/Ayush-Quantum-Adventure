import { useEffect, useRef } from 'react';

export default function CooperPairViz({ temp, gap, isSuper }) {
    const canvasRef = useRef(null);
    const atoms = useRef([]);
    const electrons = useRef([]);

    // Initialize Lattice and Multiple Electrons
    useEffect(() => {
        const rows = 8; const cols = 15;
        atoms.current = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                atoms.current.push({
                    x: j * 55 + 40, y: i * 50 + 40,
                    ox: j * 55 + 40, oy: i * 50 + 40,
                    vx: 0, vy: 0
                });
            }
        }
        
        // 6 electrons (3 pairs)
        electrons.current = Array.from({ length: 6 }, (_, i) => ({
            x: Math.random() * 800,
            y: Math.random() * 400,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            id: i
        }));
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const draw = () => {
            ctx.fillStyle = '#050505'; ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Time factor for pulsating aura
            const time = Date.now() * 0.002;
            const auraGlow = 0.1 + Math.sin(time) * 0.05;

            // 1. Update Physics: Lattice Vibrations (Phonons)
            atoms.current.forEach(atom => {
                const dx = atom.ox - atom.x; const dy = atom.oy - atom.y;
                atom.vx += dx * 0.1; atom.vy += dy * 0.1;
                
                // Attraction to electrons (Phonon interaction)
                electrons.current.forEach(e => {
                    const deX = e.x - atom.x; const deY = e.y - atom.y;
                    const d2 = deX*deX + deY*deY + 800;
                    if (d2 < 8000) {
                        const force = (isSuper ? 250 : 150) / d2;
                        atom.vx += (deX / Math.sqrt(d2)) * force;
                        atom.vy += (deY / Math.sqrt(d2)) * force;
                    }
                });

                // Thermal Noise (Normal phase scattering)
                atom.vx += (Math.random() - 0.5) * temp * 0.6;
                atom.vy += (Math.random() - 0.5) * temp * 0.6;

                atom.vx *= 0.8; atom.vy *= 0.8;
                atom.x += atom.vx; atom.y += atom.vy;
                
                ctx.fillStyle = isSuper ? 'rgba(34, 211, 238, 0.4)' : 'rgba(255,255,255,0.1)';
                ctx.beginPath(); ctx.arc(atom.x, atom.y, 2, 0, Math.PI * 2); ctx.fill();
            });

            // 2. State Indicators: Wavefunction Aura (Condensate)
            if (isSuper && gap > 0.1) {
                const gradient = ctx.createRadialGradient(400, 200, 50, 400, 200, 500);
                gradient.addColorStop(0, `rgba(34, 211, 238, ${auraGlow})`);
                gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // 3. Update Electrons: Coherence & Pairing
            const condensateVel = { x: 2.5, y: 0 }; // Shared velocity direction

            for (let i = 0; i < electrons.current.length; i += 2) {
                const e1 = electrons.current[i];
                const e2 = electrons.current[i+1];

                if (isSuper) {
                    // Quantum Coherence: Converge to shared drift (no scattering)
                    const coherenceLevel = gap * 0.15;
                    e1.vx += (condensateVel.x - e1.vx) * coherenceLevel;
                    e1.vy += (condensateVel.y - e1.vy) * coherenceLevel;
                    e2.vx += (condensateVel.x - e2.vx) * coherenceLevel;
                    e2.vy += (condensateVel.y - e2.vy) * coherenceLevel;

                    // Pairing Force: Extra stabilized spring (high damping)
                    const dx = e2.x - e1.x; const dy = e2.y - e1.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    const springK = gap * 0.3;
                    const force = (dist - 40) * springK;
                    const angle = Math.atan2(dy, dx);
                    
                    e1.vx += Math.cos(angle) * force; e1.vy += Math.sin(angle) * force;
                    e2.vx -= Math.cos(angle) * force; e2.vy -= Math.sin(angle) * force;

                    // Draw "Phonon Trace" (Improved visual)
                    ctx.shadowBlur = 15; ctx.shadowColor = '#22d3ee';
                    ctx.strokeStyle = `rgba(34, 211, 238, ${gap * 0.6})`;
                    ctx.lineWidth = 3;
                    ctx.beginPath(); ctx.moveTo(e1.x, e1.y); ctx.lineTo(e2.x, e2.y); ctx.stroke();
                    ctx.shadowBlur = 0;
                } else {
                    // Standard Metallic State: Random Scattering
                    e1.vx += (Math.random() - 0.5) * temp * 0.5;
                    e1.vy += (Math.random() - 0.5) * temp * 0.5;
                    e2.vx += (Math.random() - 0.5) * temp * 0.5;
                    e2.vy += (Math.random() - 0.5) * temp * 0.5;
                }
            }

            electrons.current.forEach(e => {
                e.x += e.vx; e.y += e.vy;
                
                // Wrap around with smooth transition
                if (e.x < -20) e.x = canvas.width + 20;
                if (e.x > canvas.width + 20) e.x = -20;
                if (e.y < -20) e.y = canvas.height + 20;
                if (e.y > canvas.height + 20) e.y = -20;
                
                // Global drag (simulates phonon scattering in normal phase)
                const drag = isSuper ? 0.995 : 0.96;
                e.vx *= drag; e.vy *= drag;

                // Glowing Electron
                ctx.shadowBlur = 20; ctx.shadowColor = isSuper ? '#22d3ee' : '#fbbf24';
                ctx.fillStyle = isSuper ? '#22d3ee' : '#fbbf24';
                ctx.beginPath(); ctx.arc(e.x, e.y, 6, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0;
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationFrameId);
    }, [temp, gap, isSuper]);

    return (
        <div style={{ background: '#0a0a0a', padding: '30px', borderRadius: '32px', border: '1px solid #1a1a1a', gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                    <h4 style={{ color: isSuper ? '#22d3ee' : '#fbbf24', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>
                        Lattice Coherence: Condensate State
                    </h4>
                    <p style={{ fontSize: '0.65rem', color: '#666', marginTop: '5px' }}>
                       {isSuper ? 'In the coherent state, all pairs share a single macroscopic velocity. No resistance.' : 'Normal state: Electrons scatter randomly off the vibrating lattice ions.'}
                    </p>
                </div>
                {isSuper && (
                    <div style={{ color: '#22d3ee', fontSize: '0.6rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 10px #22d3ee' }} />
                        MACROSCOPIC COHERENCE ACTIVE
                    </div>
                )}
            </div>
            <canvas ref={canvasRef} width={800} height={350} style={{ width: '100%', height: '300px', borderRadius: '24px' }} />
        </div>
    );
}


