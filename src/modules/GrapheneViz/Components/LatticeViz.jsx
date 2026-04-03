import { useEffect, useRef, useMemo } from 'react';

export default function LatticeViz({ t1, mass, showOrbitals }) {
    const canvasRef = useRef(null);
    const timeRef = useRef(0);

    const a = 42; // bond length
    const rows = 12;
    const cols = 16;

    const lattice = useMemo(() => {
        const sites = [];
        const bonds = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const xBase = c * a * Math.sqrt(3);
                const yBase = r * a * 1.5;
                const offset = (r % 2 === 1) ? (a * Math.sqrt(3) / 2) : 0;

                const ax = xBase + offset;
                const ay = yBase;
                sites.push({ x: ax, y: ay, type: 'A' });

                const bx = xBase + offset;
                const by = yBase + a;
                sites.push({ x: bx, y: by, type: 'B' });

                bonds.push({ x1: ax, y1: ay, x2: bx, y2: by });
                if (r > 0) {
                    const bxUp = xBase + offset - (a * Math.sqrt(3)/2);
                    const byUp = yBase - a * 0.5;
                    bonds.push({ x1: ax, y1: ay, x2: bxUp, y2: byUp });
                    const bxUpRight = xBase + offset + (a * Math.sqrt(3)/2);
                    bonds.push({ x1: ax, y1: ay, x2: bxUpRight, y2: byUp });
                }
            }
        }
        return { sites, bonds };
    }, [a]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const draw = () => {
            timeRef.current += 0.04;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(50, 40);

            // 1. Draw Sub-grid Bonds (Darker)
            ctx.strokeStyle = 'rgba(255,255,255,0.06)';
            ctx.lineWidth = Math.min(2.5, t1 * 1.8);
            lattice.bonds.forEach(b => {
                ctx.beginPath(); ctx.moveTo(b.x1, b.y1); ctx.lineTo(b.x2, b.y2); ctx.stroke();
            });

            // 2. Draw Orbitals (The p_z clouds)
            if (showOrbitals) {
                lattice.sites.forEach(s => {
                    const phase = (s.x + s.y) * 0.01;
                    const pulse = Math.sin(timeRef.current + phase) * 3;
                    const r = 14 + pulse;
                    
                    const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * 2);
                    const rgb = s.type === 'A' ? '16, 185, 129' : '59, 130, 246';
                    grad.addColorStop(0, `rgba(${rgb}, 0.25)`);
                    grad.addColorStop(0.5, `rgba(${rgb}, 0.08)`);
                    grad.addColorStop(1, `rgba(${rgb}, 0)`);
                    
                    ctx.fillStyle = grad;
                    ctx.beginPath(); ctx.arc(s.x, s.y, r * 2, 0, Math.PI * 2); ctx.fill();
                });
            }

            // 3. Draw Atomic Sites (The Cores)
            lattice.sites.forEach(s => {
                // High contrast core
                const coreColor = s.type === 'A' ? '#10b981' : '#3b82f6';
                const shadowColor = s.type === 'A' ? 'rgba(16,185,129,0.8)' : 'rgba(59,130,246,0.8)';
                
                ctx.shadowBlur = 15;
                ctx.shadowColor = shadowColor;
                ctx.fillStyle = coreColor;
                
                const dotSize = 3.5;
                const massScale = s.type === 'A' ? (1 + Math.max(0, mass) * 0.4) : (1 + Math.max(0, -mass) * 0.4);
                
                ctx.beginPath();
                ctx.arc(s.x, s.y, dotSize * massScale, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
                
                // Ring for clarity
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 0.5;
                ctx.beginPath(); ctx.arc(s.x, s.y, dotSize * massScale + 1, 0, Math.PI * 2); ctx.stroke();
            });

            ctx.restore();
            animationFrameId = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(animationFrameId);
    }, [lattice, showOrbitals, mass, t1]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '420px', background: '#050505', borderRadius: '24px', border: '1px solid #1a1a1a', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }}>
                <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 'bold', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: '4px', marginRight: '10px' }}>A-SITE</span>
                <span style={{ fontSize: '0.65rem', color: '#3b82f6', fontWeight: 'bold', background: 'rgba(59,130,246,0.1)', padding: '4px 10px', borderRadius: '4px' }}>B-SITE</span>
            </div>
            <canvas ref={canvasRef} width={800} height={450} style={{ width: '100%', height: '100%' }} />
        </div>
    );
}
