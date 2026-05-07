import { useEffect, useRef } from 'react';
import { Target, Maximize2, Shrink } from 'lucide-react';

export default function DiracPointSimulator({ mass, phi, t1, t2 }) {
    const canvasRef = useRef(null);
    const rotationRef = useRef({ x: 0.8, y: 0.4 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const project = (kx, ky, e) => {
            const scale = 140;
            const dist = 5.0;
            const rx = rotationRef.current.x;
            const ry = rotationRef.current.y + Math.sin(Date.now() * 0.0005) * 0.1;
            
            const cosX = Math.cos(rx), sinX = Math.sin(rx);
            const cosY = Math.cos(ry), sinY = Math.sin(ry);
            
            let x = kx * cosY - ky * sinY;
            let z = kx * sinY + ky * cosY;
            let y = e;

            let xRot = x;
            let yRot = y * cosX - z * sinX;
            let zRot = y * sinX + z * cosX;

            const factor = scale / (zRot + dist);
            return {
                x: canvas.width / 2 + xRot * factor,
                y: canvas.height / 2 - yRot * factor
            };
        };

        const draw = () => {
            // 0. Background Glow
            const bgGrad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, 200);
            bgGrad.addColorStop(0, 'rgba(251, 191, 36, 0.03)');
            bgGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Wait, clearRect will remove the glow. I should use fillRect with clear color if needed, or just draw bg after clear.
            
            ctx.fillStyle = '#050505'; ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Effective Mass at K point
            // M_eff = M - 3*sqrt(3)*t2*sin(phi)
            const mEff = mass - 3 * Math.sqrt(3) * t2 * Math.sin(phi);
            const gridRes = 24;
            const kRange = 1.2;

            // Draw Grid lines for Conduction and Valence bands
            ctx.lineWidth = 1;
            
            // Function to draw a band surface
            const drawSurface = (type, color) => {
                for (let i = 0; i <= gridRes; i++) {
                    ctx.beginPath();
                    ctx.strokeStyle = color;
                    for (let j = 0; j <= gridRes; j++) {
                        const kx = (i / gridRes - 0.5) * kRange * 2;
                        const ky = (j / gridRes - 0.5) * kRange * 2;
                        
                        // H = v*k.sigma + m*sigma_z
                        // E = +/- sqrt( (v*kx)^2 + (v*ky)^2 + m^2 )
                        const v = 1.5;
                        const mag = Math.sqrt(Math.pow(v * kx, 2) + Math.pow(v * ky, 2) + Math.pow(mEff, 2));
                        const e = type === 'conduction' ? mag : -mag;
                        
                        const p = project(kx, ky, e);
                        if (j === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
                    }
                    ctx.stroke();
                }

                // Cross lines
                for (let j = 0; j <= gridRes; j++) {
                    ctx.beginPath();
                    ctx.strokeStyle = color;
                    for (let i = 0; i <= gridRes; i++) {
                        const kx = (i / gridRes - 0.5) * kRange * 2;
                        const ky = (j / gridRes - 0.5) * kRange * 2;
                        const v = 1.5;
                        const mag = Math.sqrt(Math.pow(v * kx, 2) + Math.pow(v * ky, 2) + Math.pow(mEff, 2));
                        const e = type === 'conduction' ? mag : -mag;
                        const p = project(kx, ky, e);
                        if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
                    }
                    ctx.stroke();
                }
            };

            // Draw Bounding Box (Verification)
            ctx.strokeStyle = 'rgba(255,255,255,0.05)';
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            // Draw Valence Band (Blue)
            ctx.lineWidth = 1.5;
            drawSurface('valence', 'rgba(59, 130, 246, 0.8)');
            
            // Draw Conduction Band (Green)
            drawSurface('conduction', 'rgba(16, 185, 129, 0.8)');

            // Draw Gap Label
            const top = project(0, 0, Math.abs(mEff));
            const bottom = project(0, 0, -Math.abs(mEff));
            
            if (Math.abs(mEff) > 0.05) {
                ctx.setLineDash([2, 2]);
                ctx.strokeStyle = '#fff';
                ctx.beginPath(); ctx.moveTo(top.x, top.y); ctx.lineTo(bottom.x, bottom.y); ctx.stroke();
                ctx.setLineDash([]);
                
                ctx.fillStyle = '#fff';
                ctx.font = '10px Inter';
                ctx.fillText(`Gap: ${(Math.abs(mEff) * 2).toFixed(2)} eV`, top.x + 10, (top.y + bottom.y) / 2);
            } else {
                // Dirac Point indicator
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath(); ctx.arc(top.x, top.y, 4, 0, Math.PI * 2); ctx.fill();
                ctx.font = 'bold 10px Inter';
                ctx.fillText("DIRAC POINT", top.x + 10, top.y);
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationFrameId);
    }, [mass, phi, t1, t2]);

    return (
        <div style={{
            background: 'rgba(0,0,0,0.5)',
            borderRadius: '24px',
            padding: '24px',
            border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24' }}>
                    <Target size={18} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Dirac Point Zoom-In
                    </span>
                </div>
            </div>

            <canvas ref={canvasRef} width={400} height={400} style={{ width: '100%', height: '320px', borderRadius: '16px' }} />

            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: '0.7rem', color: '#888', margin: 0, textAlign: 'center' }}>
                    Visualizing the effective Hamiltonian <i style={{color: '#fff'}}>H = v(k·σ) + mσᶻ</i> at the K-point.
                </p>
            </div>
        </div>
    );
}
