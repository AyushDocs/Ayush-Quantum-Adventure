import React, { useEffect, useRef } from 'react';

export default function AltermagnetBandsPlot({ isAlter, themeColor }) {
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
            time += 0.02;
            ctx.clearRect(0, 0, width, height);

            // Dividing canvas into two panels: kx axis and ky axis
            const midX = width / 2;

            // Draw panel separators
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(midX, 20); ctx.lineTo(midX, height - 20); // Center divider
            ctx.moveTo(20, height / 2); ctx.lineTo(width - 20, height / 2); // E=0 axis
            ctx.stroke();

            ctx.fillStyle = '#888';
            ctx.font = '10px Inter';
            ctx.fillText('k_x Direction', midX / 2 - 20, height - 10);
            ctx.fillText('k_y Direction', midX + midX / 2 - 20, height - 10);
            ctx.fillText('Energy (E)', 10, 15);

            // Function to draw a parabola
            const drawBand = (panelOffset, widthScale, energyOffset, color, isDashed = false) => {
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.lineWidth = 3;
                if (isDashed) ctx.setLineDash([5, 5]);
                
                for (let x = -80; x <= 80; x++) {
                    // Parabola: E = (k^2) / widthScale + energyOffset
                    const k = x / 80; // normalized k from -1 to 1
                    const E = (k * k) * 100 - energyOffset;
                    
                    const drawX = panelOffset + x;
                    const drawY = height / 2 - E;
                    
                    if (x === -80) {
                        ctx.moveTo(drawX, drawY);
                    } else {
                        ctx.lineTo(drawX, drawY);
                    }
                }
                ctx.stroke();
                ctx.setLineDash([]); // Reset
            };

            const kxCenter = midX / 2;
            const kyCenter = midX + midX / 2;

            // Adding a slight breathing animation to the bands
            const breath = Math.sin(time) * 5;

            if (isAlter) {
                // Altermagnet: d-wave splitting
                // Along kx: Spin Up is lower energy (shifted down), Spin Down is higher (shifted up)
                drawBand(kxCenter, 100, 20 + breath, '#ef4444'); // Spin UP (Red)
                drawBand(kxCenter, 100, -20 - breath, '#3b82f6', true); // Spin DOWN (Blue dashed)

                // Along ky: Split sign reverses! Spin Down is lower, Spin Up is higher.
                drawBand(kyCenter, 100, -20 - breath, '#ef4444'); // Spin UP (Red)
                drawBand(kyCenter, 100, 20 + breath, '#3b82f6', true); // Spin DOWN (Blue dashed)

                ctx.fillStyle = themeColor;
                ctx.fillText('Massive Spin Splitting (Reverses Sign)', midX / 2 - 50, 40);

            } else {
                // Conventional Antiferromagnet: Kramer's degeneracy forces bands to overlap exactly
                // We draw them slightly offset visually just to show they are both there, but functionally degenerate.
                // Or just draw one purple band to represent overlap
                
                // Spin UP
                drawBand(kxCenter, 100, 0, '#ef4444');
                // Spin DOWN exactly on top
                drawBand(kxCenter, 100, 0, '#3b82f6', true); 

                // Spin UP
                drawBand(kyCenter, 100, 0, '#ef4444');
                // Spin DOWN exactly on top
                drawBand(kyCenter, 100, 0, '#3b82f6', true);

                ctx.fillStyle = '#60a5fa';
                ctx.fillText('Bands Exactly Degenerate (E↑ = E↓)', midX / 2 - 50, 40);
            }

            // Legend
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(width - 80, 20, 10, 10);
            ctx.fillStyle = '#fff';
            ctx.fillText('Spin Up', width - 65, 29);

            ctx.fillStyle = '#3b82f6';
            ctx.fillRect(width - 80, 40, 10, 10);
            ctx.fillStyle = '#fff';
            ctx.fillText('Spin Down', width - 65, 49);

            animationFrameId = requestAnimationFrame(drawPlot);
        };

        drawPlot();

        return () => cancelAnimationFrame(animationFrameId);
    }, [isAlter, themeColor]);

    return (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
            <h4 style={{ color: themeColor, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '10px' }}>Momentum Space: Band Structure</h4>
            <canvas ref={canvasRef} width={400} height={250} style={{ width: '100%', borderRadius: '16px', background: '#0a0a0a' }} />
        </div>
    );
}
