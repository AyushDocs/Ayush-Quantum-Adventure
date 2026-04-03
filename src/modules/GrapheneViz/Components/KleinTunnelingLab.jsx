import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { RotateCcw, Play, Pause, Zap } from 'lucide-react';

export default function KleinTunnelingLab({ mass }) {
    const canvasRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [barrierHeight, setBarrierHeight] = useState(2.5); // V0
    const [incidenceAngle, setIncidenceAngle] = useState(0); 

    const particles = useRef([]);
    const dt = 0.6;
    const barW = 80;

    // Calculate Theoretical Transmission Probability T(phi)
    // For simplicity in sim units: qx * D depends on (V0 - E)
    const transmissionProb = useMemo(() => {
        const phi = (incidenceAngle * Math.PI) / 180;
        if (Math.abs(phi) < 0.01) return 1.0;
        
        // Klein Resonant Formula: T = cos^2(phi) / (1 - sin^2(qx*D) * sin^2(phi))
        // We use qx*D proportional to V0 for visual resonance effects
        const phase = barrierHeight * 5.0; // Fabry-Perot phase factor
        const numerator = Math.pow(Math.cos(phi), 2);
        const denominator = 1 - Math.pow(Math.sin(phase), 2) * Math.pow(Math.sin(phi), 2);
        
        // If there's a mass gap, transmission drops drastically at angles
        const massSuppression = Math.exp(-Math.abs(mass) * 5 * Math.sin(Math.abs(phi)));
        
        return Math.max(0, Math.min(1, (numerator / denominator) * massSuppression));
    }, [incidenceAngle, barrierHeight, mass]);

    const initPackets = useCallback(() => {
        particles.current = [...Array(12)].map((_, i) => ({
            x: -50 - i * 70,
            y: 120 + Math.random() * 110,
            vx: 3.5, 
            vy: Math.tan(incidenceAngle * Math.PI / 180) * 3.5,
            trail: [],
            hasInteracted: false,
            opacity: 1
        }));
    }, [incidenceAngle]);

    useEffect(() => {
        const newVx = 3.5;
        const newVy = Math.tan(incidenceAngle * Math.PI / 180) * 3.5;
        particles.current.forEach(p => {
            p.vx = p.vx > 0 ? newVx : -newVx;
            p.vy = newVy;
        });
        if (particles.current.length === 0) initPackets();
    }, [incidenceAngle, initPackets]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const draw = () => {
            if (!isPlaying) { animationFrameId = requestAnimationFrame(draw); return; }
            ctx.fillStyle = '#050505'; ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barX = canvas.width / 2 - barW/2;
            
            // 1. Draw Barrier
            const intensity = 0.1 + barrierHeight * 0.05;
            const grad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
            grad.addColorStop(0, `rgba(147, 51, 234, ${intensity * 0.2})`);
            grad.addColorStop(0.5, `rgba(147, 51, 234, ${intensity})`);
            grad.addColorStop(1, `rgba(147, 51, 234, ${intensity * 0.2})`);
            ctx.fillStyle = grad; ctx.fillRect(barX, 0, barW, canvas.height);
            ctx.strokeStyle = `rgba(147, 51, 234, ${intensity * 2})`; ctx.strokeRect(barX, 0, barW, canvas.height);

            // 1.5 Incidence Guide
            ctx.setLineDash([5, 5]); ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.beginPath(); ctx.moveTo(0, 175); ctx.lineTo(canvas.width, 175 + Math.tan((incidenceAngle * Math.PI) / 180) * (canvas.width)); ctx.stroke();
            ctx.setLineDash([]);

            // 2. Wave Packets Loop
            particles.current.forEach(p => {
                p.x += p.vx * dt; p.y += p.vy * dt;
                
                // Stochastic Interaction at the barrier boundary
                if (!p.hasInteracted && p.x > barX && p.vx > 0) {
                    p.hasInteracted = true;
                    // Quantum Coin Toss!
                    if (Math.random() > transmissionProb) {
                        p.vx *= -1; // Reflect
                    }
                }

                // Loop reset
                if (p.x > canvas.width + 50 || p.x < -150 || p.y < -50 || p.y > canvas.height + 50) { 
                    p.x = -100; p.y = 100 + Math.random() * 150; p.hasInteracted = false; p.vx = 3.5; p.trail = []; 
                }

                p.trail.push({ x: p.x, y: p.y }); if (p.trail.length > 12) p.trail.shift();
                ctx.beginPath(); p.trail.forEach((t, i) => {
                    ctx.globalAlpha = i / p.trail.length * 0.4; ctx.strokeStyle = '#10b981';
                    if (i === 0) ctx.moveTo(t.x, t.y); else ctx.lineTo(t.x, t.y);
                }); ctx.stroke();
                ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#10b981'; ctx.shadowBlur = 8; ctx.shadowColor = '#10b981'; ctx.fill(); ctx.shadowBlur = 0;
            });

            // 3. UI Overlay
            const meterW = 120;
            ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(20, 40, meterW, 6);
            ctx.fillStyle = transmissionProb > 0.8 ? '#10b981' : '#f43f5e';
            ctx.fillRect(20, 40, meterW * transmissionProb, 6);
            ctx.font = '10px Inter'; ctx.fillText(`TRANSMISSION PROBABILITY (T): ${(transmissionProb * 100).toFixed(1)}%`, 20, 32);

            animationFrameId = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(animationFrameId);
    }, [isPlaying, barrierHeight, incidenceAngle, mass, transmissionProb]);

    return (
        <div style={{ background: '#0a0a0a', padding: '25px', borderRadius: '24px', border: '1px solid #1a1a1a', gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ fontSize: '0.85rem', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                    <Zap size={16} /> Dirac Tunneling Lab
                </h3>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <span style={{ fontSize: '0.7rem', color: '#666' }}>V₀:</span>
                       <input type="range" min="0" max="5.0" step="0.01" value={barrierHeight} onChange={(e) => setBarrierHeight(parseFloat(e.target.value))} style={{ width: '100px' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <span style={{ fontSize: '0.7rem', color: '#666' }}>Angle:</span>
                       <input type="range" min="-45" max="45" step="1" value={incidenceAngle} onChange={(e) => setIncidenceAngle(parseInt(e.target.value))} style={{ width: '100px' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => setIsPlaying(!isPlaying)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}>
                          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                      <button onClick={initPackets} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#666', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}>
                          <RotateCcw size={16} />
                      </button>
                    </div>
                </div>
            </div>
            <canvas ref={canvasRef} width={800} height={350} style={{ width: '100%', height: '300px', borderRadius: '16px', border: '1px solid #111' }} />
            <div style={{ marginTop: '20px', padding: '18px', background: 'rgba(168, 85, 247, 0.05)', borderRadius: '16px', borderLeft: '4px solid #a855f7' }}>
                <p style={{ fontSize: '0.8rem', color: '#ccc', lineHeight: '1.6' }}>
                    <span style={{ color: '#a855f7', fontWeight: 'bold' }}>PHYSICS NOTE:</span> In Graphene, normal incidence (θ = 0°) always results in **100% Transmission** due to pseudospin conservation. At other angles, the transmission probability oscillates based on the barrier height **V₀** (Fabry-Pérot resonance). Try moving the **V₀ slider** slowly while the angle is at 30° to see the probability bar "bounce" during resonance.
                </p>
            </div>
        </div>
    );
}
