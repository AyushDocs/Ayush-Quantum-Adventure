import React, { useEffect, useRef } from 'react';

export default function MajoranaDOSPlot({ isTop, themeColor }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        let animationFrameId;
        let time = 0;

        const drawPlot = () => {
            time += 0.05;
            ctx.clearRect(0, 0, width, height);

            // Draw Axes
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(width / 2, 20); ctx.lineTo(width / 2, height - 20); // E (y-axis)
            ctx.moveTo(20, height / 2); ctx.lineTo(width - 20, height / 2); // DOS (x-axis)
            ctx.stroke();

            // Labels
            ctx.fillStyle = '#666';
            ctx.font = '10px Inter';
            ctx.fillText('E = 0', width / 2 + 10, 15);
            ctx.fillText('Density of States (DOS)', 20, height / 2 - 10);

            // The gap magnitude
            const gapPixels = 40;

            if (isTop) {
                // Topological Phase: Re-opened effective p-wave gap + ZBCP

                // Draw p-wave bulk DOS
                ctx.strokeStyle = '#555';
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let y = 20; y < height - 20; y++) {
                    const E = (height / 2 - y) / gapPixels;
                    if (Math.abs(E) < 1.0) {
                        ctx.lineTo(width / 2, y); // gap
                    } else {
                        const dos = Math.abs(E) / Math.sqrt(E*E - 1) * 30;
                        ctx.lineTo(width / 2 + Math.min(dos, 100), y);
                    }
                }
                ctx.stroke();

                // Draw ZBCP (Majorana Peak at E=0)
                const pulse = 100 + Math.sin(time*5)*20;
                
                ctx.shadowColor = themeColor;
                ctx.shadowBlur = 10;
                ctx.strokeStyle = themeColor;
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(width / 2, height / 2);
                ctx.lineTo(width / 2 + pulse, height / 2);
                ctx.stroke();
                ctx.shadowBlur = 0;

                ctx.fillStyle = themeColor;
                ctx.fillText('Zero-Bias Conductance Peak (ZBCP)', width / 2 + 10, height / 2 + 15);

            } else {
                // Trivial Phase: Standard s-wave-like gapped DOS
                ctx.strokeStyle = 'rgba(96, 165, 250, 0.8)'; // Blueish DOS
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let y = 20; y < height - 20; y++) {
                    const E = (height / 2 - y) / gapPixels;
                    if (Math.abs(E) < 1.2) {
                        ctx.lineTo(width / 2, y); // wide trivial gap
                    } else {
                        const dos = Math.abs(E) / Math.sqrt(E*E - 1.44) * 30;
                        ctx.lineTo(width / 2 + Math.min(dos, 100), y);
                    }
                }
                ctx.stroke();

                ctx.fillStyle = '#666';
                ctx.fillText('Hard Gap (No states at E=0)', width / 2 + 10, height / 2 + 15);
            }

            animationFrameId = requestAnimationFrame(drawPlot);
        };

        drawPlot();

        return () => cancelAnimationFrame(animationFrameId);
    }, [isTop, themeColor]);

    return (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
            <h4 style={{ color: themeColor, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '10px' }}>Density of States Plot</h4>
            <canvas ref={canvasRef} width={300} height={200} style={{ width: '100%', borderRadius: '16px', background: '#0a0a0a' }} />
        </div>
    );
}
