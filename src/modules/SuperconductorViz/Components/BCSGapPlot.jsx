import { useEffect, useRef } from 'react';

export default function BCSGapPlot({ gap, isSuper }) {
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
        const centerY = height / 2;
        const drawX = (e) => margin + ((e + 5.0) / 10.0) * (width - 2 * margin);
        const drawY = (n) => centerY - n * 15;

        // Draw Axes
        ctx.strokeStyle = '#333'; ctx.setLineDash([2, 5]);
        ctx.beginPath(); ctx.moveTo(margin, centerY); ctx.lineTo(width - margin, centerY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(width / 2, margin); ctx.lineTo(width / 2, height - margin); ctx.stroke(); ctx.setLineDash([]);

        // Plot DOS: N(E) = N(0) * |E| / sqrt(E^2 - Delta^2) for |E| > Delta
        ctx.beginPath();
        ctx.strokeStyle = isSuper ? '#22d3ee' : '#aaa';
        ctx.lineWidth = 2;

        for (let e = -5.0; e <= 5.0; e += 0.05) {
            let n = 2.0; // Normal DOS
            if (isSuper) {
               if (Math.abs(e) < gap) {
                  n = 0;
               } else {
                  n = 2.0 * (Math.abs(e) / Math.sqrt(e*e - gap*gap));
                  if (n > 5.0) n = 5.0; // Cap at singularity
               }
            }
            const px = drawX(e); const py = drawY(n);
            if (e === -5.0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Fill forbidden gap
        if (isSuper) {
           ctx.fillStyle = 'rgba(244, 63, 94, 0.1)';
           ctx.fillRect(drawX(-gap), margin, drawX(gap) - drawX(-gap), height - 2*margin);
           ctx.fillStyle = '#f43f5e'; ctx.font = '8px Inter';
           ctx.fillText('ENERGY GAP', drawX(0) - 25, centerY - 5);
        }

        ctx.fillStyle = '#666'; ctx.font = '8px monospace';
        ctx.fillText('N(E)', width / 2 + 10, margin + 10);
        ctx.fillText('E', width - 15, centerY + 10);
        
        // Fermi Level & State Labels
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = '7px Inter';
        ctx.fillText('FERMI LEVEL (EF)', width / 2 - 30, height - margin + 10);
        ctx.textAlign = 'left';
        ctx.fillText('← OCCUPIED', margin, centerY + 20);
        ctx.textAlign = 'right';
        ctx.fillText('EXCITATIONS →', width - margin, centerY + 20);
        ctx.textAlign = 'left';

    }, [gap, isSuper]);

    return (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
             <h4 style={{ color: '#22d3ee', fontSize: '0.6rem', textTransform: 'uppercase', marginBottom: '8px' }}>BCS Density of States</h4>
             <canvas ref={canvasRef} width={250} height={200} style={{ width: '100%' }} />
             <p style={{ marginTop: '5px', fontSize: '0.55rem', color: '#555' }}>
                Energy ($E$) is measured relative to the Fermi Level. Negative values represent the occupied ground state, while positive values are quasiparticle excitations.
             </p>
        </div>
    );
}
