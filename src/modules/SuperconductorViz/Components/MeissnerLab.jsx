import { useEffect, useRef } from 'react';
import LondonEquationsViz from './LondonEquationsViz';

export default function MeissnerLab({ temp, field, expulsion, isSuper, isVortex }) {
    const canvasRef = useRef(null);
    const rotationRef = useRef({ x: 0.5, y: 0.1 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const project = (x, y, z) => {
            const scale = 180;
            const dist = 6.0;
            const rx = rotationRef.current.x;
            const ry = rotationRef.current.y + Math.sin(Date.now() * 0.0002) * 0.15;
            const cosX = Math.cos(rx), sinX = Math.sin(rx);
            const cosY = Math.cos(ry), sinY = Math.sin(ry);
            let x1 = x * cosY - z * sinY;
            let z1 = x * sinY + z * cosY;
            let y1 = y * cosX - z1 * sinX;
            let z2 = y * sinX + z1 * cosX;
            const f = scale / (z2 + dist);
            return { x: canvas.width / 2 + x1 * f, y: canvas.height / 2 - y1 * f, z: z2 };
        };

        const drawFieldLine = (angle, offset, isMeissner) => {
            const points = 40;
            ctx.beginPath();
            ctx.strokeStyle = isSuper ? 'rgba(34, 211, 238, 0.4)' : 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 1.2;
            
            for (let i = 0; i <= points; i++) {
                const t = i / points;
                const r = 1.0 + offset; 
                let lx = Math.cos(angle) * r * Math.sin(t * Math.PI);
                let lz = Math.sin(angle) * r * Math.sin(t * Math.PI);
                let ly = Math.cos(t * Math.PI) * 2.0;

                // Meissner Field Bending logic
                if (isMeissner) {
                    const distToCenter = Math.sqrt(lx * lx + ly * ly + lz * lz);
                    if (distToCenter < 2.5) {
                        // Push field lines away from the sphere center
                        const push = (2.5 - distToCenter) * expulsion;
                        const factor = 1 + push / Math.max(0.1, distToCenter);
                        lx *= factor;
                        ly *= factor;
                        lz *= factor;
                    }
                }

                const p = project(lx, ly, lz);
                if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
            }
            ctx.stroke();
        };

        const drawVortex = (vx, vz) => {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.8)'; // Golden flux lines
            ctx.lineWidth = 2;
            const p1 = project(vx, -0.6, vz);
            const p2 = project(vx, 0.6, vz);
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            // Glow around the core
            ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
            ctx.beginPath();
            const cp = project(vx, 0, vz);
            ctx.arc(cp.x, cp.y, 4, 0, Math.PI * 2);
            ctx.fill();
        };

        const draw = () => {
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // 1. Superconductor Sphere
            const sphereRadius = 2.0;
            const lambda_pix = isSuper ? (0.2 + (temp / 1.0) * 0.5) : sphereRadius; // Scaled penetration depth
            
            // Draw Sphere Surface
            ctx.fillStyle = isSuper ? 'rgba(34, 211, 238, 0.05)' : 'rgba(255,255,255,0.02)';
            ctx.strokeStyle = isSuper ? '#22d3ee' : '#333';
            ctx.setLineDash(isSuper ? [] : [5, 5]);
            ctx.lineWidth = 2;
            
            // Draw multiple rings for a 3D sphere effect
            for (let rOffset = 0; rOffset < 3; rOffset++) {
                ctx.beginPath();
                const r = sphereRadius;
                for (let i = 0; i <= 60; i++) {
                    const a = (i / 60) * Math.PI * 2;
                    let p;
                    if (rOffset === 0) p = project(Math.cos(a) * r, Math.sin(a) * r, 0); // XY
                    else if (rOffset === 1) p = project(Math.cos(a) * r, 0, Math.sin(a) * r); // XZ
                    else p = project(0, Math.cos(a) * r, Math.sin(a) * r); // YZ
                    
                    if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
                }
                ctx.stroke();
            }

            // Draw Penetration Glow (Exponential Decay)
            if (isSuper) {
                for (let i = 0; i < 10; i++) {
                    const r = sphereRadius - (i * 0.1);
                    const opacity = Math.exp(-i * 0.5) * 0.2; // Exponential falloff
                    ctx.fillStyle = `rgba(34, 211, 238, ${opacity})`;
                    ctx.beginPath();
                    for (let a = 0; a <= Math.PI * 2; a += 0.2) {
                        const p = project(Math.cos(a) * r, 0, Math.sin(a) * r);
                        if (a === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
                    }
                    ctx.fill();
                }
            }
            ctx.setLineDash([]);

            // 2. The Magnet (Levitating)
            const levitation = isSuper ? 0.8 + expulsion * 0.7 : 0.4;
            const magY = -levitation - 1.5;

            // Field Lines
            const count = 12;
            for (let i = 0; i < count; i++) {
                drawFieldLine((i / count) * Math.PI * 2, 0, isSuper && !isVortex);
            }

            // 3. Vortices (Abrikosov Lattice)
            if (isVortex) {
               const vRows = 3; 
               const vCols = 3;
               for (let i = -vRows; i <= vRows; i++) {
                   for (let j = -vCols; j <= vCols; j++) {
                       if (Math.sqrt(i*i + j*j) < 2.5) {
                           drawVortex(i * 0.4, j * 0.4);
                       }
                   }
               }
            }

            // Draw Magnet
            const m = project(0, magY, 0);
            const size = 30;
            ctx.fillStyle = '#f43f5e'; ctx.fillRect(m.x - size, m.y - size, size*2, size);
            ctx.fillStyle = '#3b82f6'; ctx.fillRect(m.x - size, m.y, size*2, size);
            ctx.fillStyle = '#fff'; ctx.font = 'bold 12px Inter'; ctx.textAlign = 'center';
            ctx.fillText('N', m.x, m.y - size/2 + 5);
            ctx.fillText('S', m.x, m.y + size/2 + 5);

            // 4. Lab Status Overlay
            ctx.textAlign = 'left';
            ctx.fillStyle = isSuper ? '#22d3ee' : '#f43f5e';
            ctx.font = 'bold 10px monospace';
            const statusText = isSuper 
                ? (isVortex ? "PHASE: MIXED VORTEX STATE (PENETRATION)" : "PHASE: FULL MEISSNER STATE (EXCLUSION)")
                : "PHASE: NORMAL METALLIC (NO LEVITATION)";
            ctx.fillText(statusText, 25, 30);

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationFrameId);
    }, [temp, expulsion, isSuper, isVortex, field]);

    return (
        <div style={{ background: '#050505', padding: '30px', borderRadius: '32px', border: '1px solid #1a1a1a', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px', alignItems: 'start' }}>
                <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '0px', left: '0px', zIndex: 10 }}>
                        <h4 style={{ color: '#22d3ee', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>
                            Mag-Lev & Flux Lab
                        </h4>
                    </div>
                    <canvas ref={canvasRef} width={600} height={450} style={{ width: '100%', cursor: 'crosshair', borderRadius: '24px', background: '#080808' }} />
                    {isVortex && (
                        <div style={{ position: 'absolute', bottom: '20px', right: '30px', background: 'rgba(251,191,36,0.1)', padding: '10px 15px', borderRadius: '12px', border: '1px solid #fbbf24' }}>
                           <span style={{ color: '#fbbf24', fontSize: '0.65rem', fontWeight: 'bold' }}>QUANTIZED VORTICES DETECTED</span>
                        </div>
                    )}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '24px', border: '1px solid #1a1a1a' }}>
                        <h4 style={{ color: '#aaa', fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: '10px' }}>Quick Stats</h4>
                        <div style={{ fontSize: '0.8rem', color: isSuper ? '#22d3ee' : '#f43f5e', fontWeight: 'bold' }}>
                            {isSuper ? 'B-Field Expelled' : 'B-Field Penetrating'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '5px' }}>
                            Levitation Force: {isSuper ? (expulsion * 100).toFixed(0) : 0}%
                        </div>
                    </div>
                    <LondonEquationsViz temp={temp} isSuper={isSuper} />
                </div>
            </div>
        </div>
    );
}

