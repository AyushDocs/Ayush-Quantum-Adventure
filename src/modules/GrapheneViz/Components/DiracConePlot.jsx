import { useEffect, useRef } from 'react';

export default function DiracConePlot({ calculateEnergy, mass }) {
    const canvasRef = useRef(null);
    const rotationRef = useRef({ x: 0.6, y: 0.5 });

    const gridRes = 32;
    // k_x for K point is ~2.42. kRange=3.5 captures all 6 K points.
    const kRange = 3.5;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const rx = rotationRef.current.x;
            const ry = rotationRef.current.y + Math.sin(Date.now() * 0.0003) * 0.2;

            const project = (kx, ky, e) => {
                const scale = 100;
                const dist = 6.0;
                const cosX = Math.cos(rx), sinX = Math.sin(rx);
                const cosY = Math.cos(ry), sinY = Math.sin(ry);
                
                let x = kx * cosY - ky * sinY;
                let z = kx * sinY + ky * cosY;
                let y = e * 0.8; // Scale Energy for better visibility

                let xRot = x;
                let yRot = y * cosX - z * sinX;
                let zRot = y * sinX + z * cosX;

                const factor = scale / (zRot + dist);
                return {
                    x: canvas.width / 2 + xRot * factor * 1.5,
                    y: canvas.height / 2 - yRot * factor * 1.5,
                    z: zRot
                };
            };

            // 1. Draw BZ Floor
            ctx.strokeStyle = 'rgba(255,255,255,0.03)';
            ctx.lineWidth = 0.5;
            for (let i = -3; i <= 3; i += 1) {
                const p1 = project(i, -3, -2.5); const p2 = project(i, 3, -2.5);
                ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
                const p3 = project(-3, i, -2.5); const p4 = project(3, i, -2.5);
                ctx.beginPath(); ctx.moveTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y); ctx.stroke();
            }

            // 2. Draw 6 Dirac Points (K-points)
            const kPoints = [
                {x: 2.42, y: 0}, {x: -2.42, y: 0},
                {x: 1.21, y: 2.1}, {x: -1.21, y: 2.1},
                {x: 1.21, y: -2.1}, {x: -1.21, y: -2.1}
            ];

            // 3. Draw Surfaces
            for (let i = 0; i <= gridRes; i++) {
                ctx.beginPath();
                ctx.lineWidth = 0.8;
                for (let j = 0; j <= gridRes; j++) {
                    const kx = (i / gridRes - 0.5) * kRange * 2;
                    const ky = (j / gridRes - 0.5) * kRange * 2;
                    const e = calculateEnergy(kx, ky);
                    const p = project(kx, ky, e.conduction);
                    if (j === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
                }
                ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)'; // High-visibility green
                ctx.stroke();

                ctx.beginPath();
                for (let j = 0; j <= gridRes; j++) {
                    const kx = (i / gridRes - 0.5) * kRange * 2;
                    const ky = (j / gridRes - 0.5) * kRange * 2;
                    const e = calculateEnergy(kx, ky);
                    const p = project(kx, ky, e.valence);
                    if (j === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
                }
                ctx.strokeStyle = 'rgba(59, 130, 246, 0.35)'; // High-visibility blue
                ctx.stroke();
            }

            // Dirac Point Glow (only if mass is low)
            if (Math.abs(mass) < 0.2) {
                const glow = (0.2 - Math.abs(mass)) * 50;
                kPoints.forEach(kp => {
                    const p = project(kp.x, kp.y, 0);
                    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glow);
                    grad.addColorStop(0, 'rgba(16, 185, 129, 0.6)'); grad.addColorStop(1, 'rgba(16, 185, 129, 0)');
                    ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(p.x, p.y, glow, 0, Math.PI * 2); ctx.fill();
                });
            }

            animationFrameId = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(animationFrameId);
    }, [calculateEnergy, mass]);

    return (
        <div style={{ background: '#050505', padding: '20px', borderRadius: '16px', border: '1px solid #1a1a1a', position: 'relative', overflow: 'hidden' }}>
            <h4 style={{ color: '#aaa', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px', fontWeight: '800' }}>
                Extended Momentum Space E(kx, ky) [Full BZ]
            </h4>
            <canvas ref={canvasRef} width={500} height={400} style={{ width: '100%', height: '380px' }} />
            <div style={{ position: 'absolute', bottom: '20px', right: '20px', color: '#fff', fontSize: '0.85rem', fontWeight: 'bold' }}>
                K-points: VISIBLE
            </div>
        </div>
    );
}
