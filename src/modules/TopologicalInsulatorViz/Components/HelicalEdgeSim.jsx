import React, { useEffect, useRef } from 'react';

export default function HelicalEdgeSim({ height = 300, bField = 0, mass = 1.0 }) {
    const canvasRef = useRef(null);
    const bulkParticlesRef = useRef([...Array(15)].map(() => ({
        x: (Math.random() - 0.5) * 350,
        y: (Math.random() - 0.5) * 150,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
    })));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let frame;

        const draw = () => {
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const slabW = 400;
            const slabH = 200;
            const slabDepth = 20;

            const iso = (x, y, z) => ({
                x: centerX + (x - y) * 0.8,
                y: centerY + (x + y) * 0.4 - z
            });

            // 1. Draw Slab
            const p1 = iso(-slabW/2, -slabH/2, 0);
            const p2 = iso(slabW/2, -slabH/2, 0);
            const p3 = iso(slabW/2, slabH/2, 0);
            const p4 = iso(-slabW/2, slabH/2, 0);

            ctx.fillStyle = '#1a1a1a';
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y); ctx.lineTo(p1.x, p1.y + slabDepth);
            ctx.lineTo(p4.x, p4.y + slabDepth); ctx.lineTo(p4.x, p4.y);
            ctx.closePath(); ctx.fill();

            ctx.fillStyle = '#151515';
            ctx.beginPath();
            ctx.moveTo(p3.x, p3.y); ctx.lineTo(p3.x, p3.y + slabDepth);
            ctx.lineTo(p4.x, p4.y + slabDepth); ctx.lineTo(p4.x, p4.y);
            ctx.closePath(); ctx.fill();

            // Top Face
            ctx.fillStyle = '#222';
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y);
            ctx.closePath(); ctx.fill();

            // 2. Determine State
            const isTopological = mass > 0.05;
            const isMetallic = Math.abs(mass) <= 0.05;
            const fieldEffect = Math.max(0, 1 - bField * 1.5);

            if (isTopological) {
                // Draw Helical Edge States
                const drawEdge = (color, path, isUp) => {
                    const opacityMult = fieldEffect;
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 1.5;
                    ctx.globalAlpha = 0.2 * opacityMult;
                    ctx.beginPath();
                    path.forEach((pt, i) => {
                        const p = iso(pt.x, pt.y, 2);
                        if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
                    });
                    ctx.stroke();
                    ctx.globalAlpha = 1;

                    const particleCount = 8;
                    for (let i = 0; i < particleCount; i++) {
                        const tOffset = i / particleCount;
                        const t = (Date.now() * 0.0001 * Math.pow(fieldEffect, 2) * (isUp ? 1 : -1) + tOffset) % 1;
                        const progress = t < 0 ? 1 + t : t;
                        const totalIdx = progress * (path.length - 1);
                        const idx = Math.floor(totalIdx);
                        const nextIdx = (idx + 1) % path.length;
                        const subT = totalIdx - idx;
                        const pt1 = path[idx];
                        const pt2 = path[nextIdx];
                        const p = iso(pt1.x + (pt2.x - pt1.x) * subT, pt1.y + (pt2.y - pt1.y) * subT, 5);

                        ctx.globalAlpha = opacityMult;
                        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 8);
                        grad.addColorStop(0, color); grad.addColorStop(1, 'transparent');
                        ctx.fillStyle = grad;
                        ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI * 2); ctx.fill();

                        ctx.strokeStyle = '#fff';
                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        if (isUp) {
                            ctx.moveTo(p.x, p.y - 6); ctx.lineTo(p.x, p.y + 6);
                            ctx.moveTo(p.x - 3, p.y - 4); ctx.lineTo(p.x, p.y - 6); ctx.lineTo(p.x + 3, p.y - 4);
                        } else {
                            ctx.moveTo(p.x, p.y - 6); ctx.lineTo(p.x, p.y + 6);
                            ctx.moveTo(p.x - 3, p.y + 4); ctx.lineTo(p.x, p.y + 6); ctx.lineTo(p.x + 3, p.y + 4);
                        }
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                };

                const edgePath = [{x: -slabW/2, y: -slabH/2}, {x: slabW/2, y: -slabH/2}, {x: slabW/2, y: slabH/2}, {x: -slabW/2, y: slabH/2}, {x: -slabW/2, y: -slabH/2}];
                drawEdge('#3b82f6', edgePath, true);
                drawEdge('#f43f5e', edgePath.map(p => ({ x: p.x * 0.9, y: p.y * 0.9 })), false);
            } else if (isMetallic) {
                // Draw Metallic Random Bulk Scattering
                bulkParticlesRef.current.forEach(p => {
                    p.x += p.vx; p.y += p.vy;
                    if (Math.abs(p.x) > slabW/2 - 10) p.vx *= -1;
                    if (Math.abs(p.y) > slabH/2 - 10) p.vy *= -1;

                    const pos = iso(p.x, p.y, 5);
                    ctx.fillStyle = '#fff';
                    ctx.globalAlpha = 0.6;
                    ctx.beginPath(); ctx.arc(pos.x, pos.y, 3, 0, Math.PI*2); ctx.fill();
                });
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.fillText("METAL: RANDOM BULK SCATTERING", centerX, centerY + 50);
                ctx.globalAlpha = 1;
            } else {
                // Trivial Insulator
                ctx.fillStyle = '#444';
                ctx.textAlign = 'center';
                ctx.fillText("TRIVIAL INSULATOR: NO CURRENT", centerX, centerY + 50);
            }

            frame = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(frame);
    }, [bField, mass]);

    return <canvas ref={canvasRef} width={800} height={height} style={{ width: '100%', height: `${height}px`, borderRadius: '16px', background: '#000' }} />;
}
