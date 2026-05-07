import { useEffect, useRef } from 'react';
import { Hexagon, Target, Compass } from 'lucide-react';

export default function BrillouinZoneViz() {
    const canvasRef = useRef(null);
    const rotationRef = useRef(0);

    const kPoints = [
        { x: 2.42, y: 0, label: 'K' },
        { x: 1.21, y: 2.1, label: "K'" },
        { x: -1.21, y: 2.1, label: 'K' },
        { x: -2.42, y: 0, label: "K'" },
        { x: -1.21, y: -2.1, label: 'K' },
        { x: 1.21, y: -2.1, label: "K'" },
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            rotationRef.current += 0.005;
            const cosR = Math.cos(rotationRef.current);
            const sinR = Math.sin(rotationRef.current);

            const project = (kx, ky) => {
                const scale = 60;
                // Rotate for 3D feel
                let x = kx * cosR - ky * sinR;
                let y = kx * sinR + ky * cosR;
                return {
                    x: canvas.width / 2 + x * scale,
                    y: canvas.height / 2 + y * scale
                };
            };

            // 1. Draw Hexagon Boundary
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)';
            ctx.lineWidth = 2;
            kPoints.forEach((p, i) => {
                const proj = project(p.x, p.y);
                if (i === 0) ctx.moveTo(proj.x, proj.y); else ctx.lineTo(proj.x, proj.y);
            });
            ctx.closePath();
            ctx.stroke();

            // Fill Hexagon
            ctx.fillStyle = 'rgba(168, 85, 247, 0.05)';
            ctx.fill();

            // 2. Draw Dirac Points
            kPoints.forEach(p => {
                const proj = project(p.x, p.y);
                
                // Outer Glow
                const grad = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, 15);
                grad.addColorStop(0, p.label === 'K' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(59, 130, 246, 0.4)');
                grad.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = grad;
                ctx.beginPath(); ctx.arc(proj.x, proj.y, 15, 0, Math.PI * 2); ctx.fill();

                // Core
                ctx.fillStyle = p.label === 'K' ? '#10b981' : '#3b82f6';
                ctx.beginPath(); ctx.arc(proj.x, proj.y, 4, 0, Math.PI * 2); ctx.fill();

                // Label
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 12px Inter';
                ctx.fillText(p.label, proj.x + 8, proj.y - 8);
            });

            // 3. Draw Origin (Gamma Point)
            const origin = project(0, 0);
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.beginPath(); ctx.arc(origin.x, origin.y, 2, 0, Math.PI * 2); ctx.fill();
            ctx.font = '10px Inter';
            ctx.fillText('Γ', origin.x + 5, origin.y + 12);

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <div style={{ 
            background: '#050505', 
            padding: '24px', 
            borderRadius: '24px', 
            border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#a855f7' }}>
                    <Hexagon size={18} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Reciprocal Space (Brillouin Zone)
                    </span>
                </div>
            </div>

            <canvas ref={canvasRef} width={400} height={300} style={{ width: '100%', height: '240px', background: 'radial-gradient(circle at center, #0a0a0a 0%, #050505 100%)', borderRadius: '16px' }} />

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                    <span style={{ fontSize: '0.7rem', color: '#888' }}>K Point</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%' }}></div>
                    <span style={{ fontSize: '0.7rem', color: '#888' }}>K' Point</span>
                </div>
            </div>
        </div>
    );
}
