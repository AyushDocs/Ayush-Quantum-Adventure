import React, { useEffect, useRef } from 'react';

export default function MajoranaWireSim({ zeeman, mu, gap, isTop, themeColor }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        let animationFrameId;
        let time = 0;

        const loop = () => {
            time += 0.05;
            ctx.clearRect(0, 0, width, height);

            // Draw Superconductor Base
            ctx.fillStyle = 'rgba(16, 185, 129, 0.15)'; // Greenish base
            ctx.fillRect(40, height / 2 + 10, width - 80, 40);
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
            ctx.lineWidth = 2;
            ctx.strokeRect(40, height / 2 + 10, width - 80, 40);
            ctx.fillStyle = 'rgba(16, 185, 129, 0.5)';
            ctx.font = '10px Inter';
            ctx.fillText('s-wave Superconductor', width / 2 - 50, height / 2 + 35);

            // Draw Semiconductor Nanowire
            ctx.fillStyle = 'rgba(60, 60, 60, 0.8)';
            ctx.fillRoundRect = function(x, y, w, h, r) {
                this.beginPath();
                this.moveTo(x + r, y);
                this.lineTo(x + w - r, y);
                this.quadraticCurveTo(x + w, y, x + w, y + r);
                this.lineTo(x + w, y + h - r);
                this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
                this.lineTo(x + r, y + h);
                this.quadraticCurveTo(x, y + h, x, y + h - r);
                this.lineTo(x, y + r);
                this.quadraticCurveTo(x, y, x + r, y);
                this.closePath();
                this.fill();
                this.stroke();
            }
            
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 2;
            ctx.fillRoundRect(50, height / 2 - 10, width - 100, 20, 10);
            
            ctx.fillStyle = '#fff';
            ctx.fillText('Semiconductor Nanowire (Strong SOC)', width / 2 - 90, height / 2 - 20);

            // Draw Wavefunctions based on Phase
            if (isTop) {
                // Topological Phase: Majorana Zero Modes at ends
                const endR = 20 + Math.sin(time * 3) * 5;
                const endL = 20 + Math.sin(time * 3 + Math.PI) * 5;

                ctx.shadowColor = themeColor;

                // Left Majorana
                ctx.shadowBlur = endL;
                ctx.fillStyle = themeColor;
                ctx.beginPath();
                ctx.arc(60, height / 2, 8, 0, Math.PI * 2);
                ctx.fill();
                
                // Right Majorana
                ctx.shadowBlur = endR;
                ctx.beginPath();
                ctx.arc(width - 60, height / 2, 8, 0, Math.PI * 2);
                ctx.fill();

                ctx.shadowBlur = 0; // Reset
                ctx.fillStyle = '#fff';
                ctx.font = '12px Inter';
                ctx.fillText('γ₁', 55, height / 2 + 5);
                ctx.fillText('γ₂', width - 65, height / 2 + 5);

            } else {
                // Trivial Phase: Bulk wavefunctions
                ctx.fillStyle = 'rgba(96, 165, 250, 0.4)'; // Blueish bulk electrons
                
                for (let i = 0; i < 10; i++) {
                    const x = 70 + (width - 140) * (i / 9);
                    const yOffset = Math.sin(time * 2 + i) * 5;
                    ctx.beginPath();
                    ctx.arc(x, height / 2 + yOffset, 6, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                ctx.fillStyle = 'rgba(96, 165, 250, 0.8)';
                ctx.font = '10px Inter';
                ctx.fillText('Bulk States (Gapped)', width / 2 - 50, height / 2 + 5);
            }

            animationFrameId = requestAnimationFrame(loop);
        };

        loop();
        return () => cancelAnimationFrame(animationFrameId);
    }, [zeeman, mu, gap, isTop, themeColor]);

    return (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
            <h4 style={{ color: themeColor, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '10px' }}>1D Kitaev Chain (Nanowire)</h4>
            <canvas ref={canvasRef} width={500} height={200} style={{ width: '100%', borderRadius: '16px', background: '#0a0a0a' }} />
        </div>
    );
}
