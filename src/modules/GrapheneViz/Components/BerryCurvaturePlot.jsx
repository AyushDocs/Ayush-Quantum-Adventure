import { useEffect, useRef } from 'react';

export default function BerryCurvaturePlot({ calculateBerryCurvature }) {
    const canvasRef = useRef(null);
    const rotationRef = useRef({ x: 0.8, y: 0.1 });

    const gridRes = 24;
    const kRange = 3.5;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const rx = rotationRef.current.x;
            const ry = rotationRef.current.y + Math.cos(Date.now() * 0.0001) * 0.15;

            const project = (kx, ky, e) => {
                const scale = 120;
                const dist = 5.0;
                const cosX = Math.cos(rx), sinX = Math.sin(rx);
                const cosY = Math.cos(ry), sinY = Math.sin(ry);
                
                let x = kx * cosY - ky * sinY;
                let z = kx * sinY + ky * cosY;
                let y = e * 2.0; // Scale Berry curvature for dramatic peaks

                let xRot = x;
                let yRot = y * cosX - z * sinX;
                let zRot = y * sinX + z * cosX;

                const factor = scale / (zRot + dist);
                return {
                    x: canvas.width / 2 + xRot * factor,
                    y: canvas.height / 2 - yRot * factor,
                    z: zRot
                };
            };

            // Surfaces
            ctx.lineWidth = 1.0;
            for (let i = 0; i <= gridRes; i++) {
                ctx.beginPath();
                for (let j = 0; j <= gridRes; j++) {
                    const kx = (i / gridRes - 0.5) * kRange * 2;
                    const ky = (j / gridRes - 0.5) * kRange * 2;
                    const omega = calculateBerryCurvature(kx, ky);
                    const p = project(kx, ky, omega);
                    if (j === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
                }
                ctx.strokeStyle = 'rgba(147, 51, 234, 0.4)'; // Purple for Berry curvature
                ctx.stroke();
            }

            // Cross-lines
            for (let j = 0; j <= gridRes; j += 4) {
               ctx.beginPath();
               for (let i = 0; i <= gridRes; i++) {
                   const kx = (i / gridRes - 0.5) * kRange * 2;
                   const ky = (j / gridRes - 0.5) * kRange * 2;
                   const omega = calculateBerryCurvature(kx, ky);
                   const p = project(kx, ky, omega);
                   if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
               }
               ctx.strokeStyle = 'rgba(147, 51, 234, 0.15)';
               ctx.stroke();
            }

            animationFrameId = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(animationFrameId);
    }, [calculateBerryCurvature]);

    return (
        <div style={{ background: '#050505', padding: '20px', borderRadius: '16px', border: '1px solid #1a1a1a', position: 'relative', overflow: 'hidden' }}>
            <h4 style={{ color: '#aaa', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px', fontWeight: '800' }}>
                Berry Curvature Field Ω(kx, ky)
            </h4>
            <canvas ref={canvasRef} width={500} height={400} style={{ width: '100%', height: '380px' }} />
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', color: '#a855f7', fontSize: '0.7rem' }}>
                Topology Concentration (Peaks at K-points)
            </div>
        </div>
    );
}
