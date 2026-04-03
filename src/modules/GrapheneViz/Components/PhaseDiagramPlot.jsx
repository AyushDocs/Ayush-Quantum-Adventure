import { useEffect, useRef } from 'react';

export default function PhaseDiagramPlot({ mass, phi, t2, setMass, setPhi }) {
    const canvasRef = useRef(null);
    const width = 250;
    const height = 200;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Draw the background
        ctx.fillStyle = '#050505'; ctx.fillRect(0, 0, width, height);

        const margin = 30;
        const drawX = (p) => margin + (p / Math.PI) * (width - 2 * margin);
        const drawY = (m) => height / 2 - (m / 2.0) * (height - 2 * margin);

        // 1. Draw Phase Boundaries: |M| = 3*sqrt(3) * t2 * |sin(phi)|
        ctx.beginPath();
        ctx.strokeStyle = '#10b981'; ctx.setLineDash([2, 3]);
        for (let p = 0; p <= Math.PI; p += 0.05) {
            const mCrit = 3 * Math.sqrt(3) * t2 * Math.sin(p);
            const x = drawX(p); const y = drawY(mCrit);
            if (p === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        for (let p = Math.PI; p >= 0; p -= 0.05) {
            const mCrit = -3 * Math.sqrt(3) * t2 * Math.sin(p);
            const x = drawX(p); const y = drawY(mCrit);
            ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(16, 185, 129, 0.1)'; ctx.fill();
        ctx.stroke(); ctx.setLineDash([]);

        // 2. Axes
        ctx.strokeStyle = '#333'; ctx.beginPath();
        ctx.moveTo(margin, height / 2); ctx.lineTo(width - margin, height / 2); // X axis
        ctx.moveTo(margin, margin); ctx.lineTo(margin, height - margin); // Y axis
        ctx.stroke();

        // 3. Current Point
        const curX = drawX(phi); const curY = drawY(mass);
        ctx.shadowBlur = 10; ctx.shadowColor = '#10b981';
        ctx.fillStyle = '#10b981'; ctx.beginPath(); ctx.arc(curX, curY, 4, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;

        // Labels
        ctx.fillStyle = '#666'; ctx.font = '8px monospace';
        ctx.fillText('φ', width - 20, height / 2 + 10);
        ctx.fillText('M', margin + 5, margin + 5);
        ctx.fillText('C=1', margin + 60, height / 2);

    }, [mass, phi, t2]);

    const handleClick = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const xRaw = e.clientX - rect.left; const yRaw = e.clientY - rect.top;
        const margin = 30;
        const p = ((xRaw - margin) / (width - 2 * margin)) * Math.PI;
        const m = ((height / 2 - yRaw) / (height - 2 * margin)) * 2.0;
        if (p >= 0 && p <= Math.PI) setPhi(p);
        if (m >= -2.0 && m <= 2.0) setMass(m);
    };

    return (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(16,185,129,0.2)', cursor: 'crosshair' }} onClick={handleClick}>
             <h4 style={{ color: '#10b981', fontSize: '0.6rem', textTransform: 'uppercase', marginBottom: '8px' }}>Topological Phase Map (M vs φ)</h4>
             <canvas ref={canvasRef} width={width} height={height} style={{ width: '100%' }} />
             <p style={{ marginTop: '5px', fontSize: '0.55rem', color: '#555' }}>Click to jump to a specific phase.</p>
        </div>
    );
}
