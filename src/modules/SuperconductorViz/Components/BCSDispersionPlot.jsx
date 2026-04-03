import { useEffect, useRef } from 'react';

export default function BCSDispersionPlot({ gap, isSuper }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = 250;
        const height = 200;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, width, height);

        const margin = 20;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Scale functions
        const drawX = (xi) => centerX + xi * (width / 2.5 - margin); // xi from -5 to 5
        const drawY = (en) => centerY - en * 15; // en from -5 to 5

        // Draw Axes
        ctx.strokeStyle = '#333'; ctx.setLineDash([2, 5]);
        ctx.beginPath(); ctx.moveTo(margin, centerY); ctx.lineTo(width - margin, centerY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(centerX, margin); ctx.lineTo(centerX, height - margin); ctx.stroke();
        ctx.setLineDash([]);

        // Normal State Dispersion (Linear Approximation near kF)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let xi = -5.0; xi <= 5.0; xi += 0.1) {
            const px = drawX(xi / 2);
            const py = drawY(xi);
            if (xi === -5.0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Superconducting Quasiparticle Dispersion: E = ±sqrt(xi^2 + Delta^2)
        ctx.beginPath();
        ctx.strokeStyle = isSuper ? '#22d3ee' : 'rgba(170, 170, 170, 0.5)';
        ctx.lineWidth = 2;
        
        // Correct Physics: E = ±sqrt(xi^2 + Delta^2)
        const renderDispersion = (sign) => {
            ctx.beginPath();
            for (let xi = -5.0; xi <= 5.0; xi += 0.1) {
                const e = sign * Math.sqrt(xi * xi + gap * gap);
                const px = drawX(xi);
                const py = drawY(e);
                if (xi === -5.0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();
        };

        renderDispersion(1);
        renderDispersion(-1);

        // Labels
        ctx.fillStyle = '#666'; ctx.font = '8px Inter';
        ctx.fillText('ENERGY (E)', centerX + 5, margin + 10);
        ctx.fillText('MOMENTUM (k)', width - 60, centerY + 15);
        ctx.fillText('kF', centerX - 12, height - margin - 5);

        // Gap Indicator
        if (isSuper && gap > 0.2) {
            ctx.strokeStyle = '#f43f5e';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([]);
            
            // Vertical arrow indicating the 2Δ gap
            const gapY1 = drawY(gap);
            const gapY2 = drawY(-gap);
            
            ctx.beginPath();
            ctx.moveTo(centerX - 5, gapY1); ctx.lineTo(centerX + 5, gapY1);
            ctx.moveTo(centerX - 5, gapY2); ctx.lineTo(centerX + 5, gapY2);
            ctx.moveTo(centerX, gapY1); ctx.lineTo(centerX, gapY2);
            ctx.stroke();
            
            ctx.fillStyle = '#f43f5e';
            ctx.fillText('2Δ GAP', centerX + 10, centerY + 3);
        }

    }, [gap, isSuper]);

    return (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
             <h4 style={{ color: '#22d3ee', fontSize: '0.6rem', textTransform: 'uppercase', marginBottom: '8px' }}>E-k Dispersion: Quasiparticles</h4>
             <canvas ref={canvasRef} width={250} height={200} style={{ width: '100%' }} />
             <p style={{ marginTop: '5px', fontSize: '0.55rem', color: '#555' }}>
                Energy E = ±√[ξ² + Δ²]. The minimum energy to create a pair of quasiparticles is 2Δ.
             </p>
        </div>
    );
}
