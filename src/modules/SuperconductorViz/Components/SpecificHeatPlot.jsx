import { useEffect, useRef } from 'react';

export default function SpecificHeatPlot({ temp, isSuper }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, width, height);

        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Scales
        const scaleX = (t) => margin.left + (t / 2.0) * innerWidth; // Max T = 2.0
        const scaleY = (cv) => margin.top + innerHeight - (cv / 3.0) * innerHeight; // Max Cv = 3.0

        // Axes
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top);
        ctx.lineTo(margin.left, margin.top + innerHeight);
        ctx.lineTo(margin.left + innerWidth, margin.top + innerHeight);
        ctx.stroke();

        // Normal Phase Line (Linear: Cv = gamma * T)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        for (let t = 0; t <= 2.0; t += 0.05) {
            const cv = t; 
            if (t === 0) ctx.moveTo(scaleX(t), scaleY(cv)); else ctx.lineTo(scaleX(t), scaleY(cv));
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Superconducting Phase Line
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        let first = true;
        for (let t = 0.01; t <= 2.0; t += 0.02) {
            let cv;
            if (t < 1.0) {
                // BCS approximation: jump at Tc, then exponential decay
                // Simplified: Cv_s = 2.43 * t at t=1, drops to 0 at t=0
                cv = 2.43 * Math.pow(t, 3); // Qualitatively similar
            } else {
                cv = t; // Normal phase
            }
            
            const px = scaleX(t);
            const py = scaleY(cv);
            
            if (first) {
                ctx.moveTo(px, py);
                first = false;
            } else {
                // Handle the jump at Tc
                if (Math.abs(t - 1.0) < 0.01) {
                    ctx.lineTo(scaleX(1.0), scaleY(1.0));
                    ctx.moveTo(scaleX(1.0), scaleY(2.43));
                } else {
                    ctx.lineTo(px, py);
                }
            }
        }
        ctx.stroke();

        // Indicator
        const currX = scaleX(temp);
        ctx.fillStyle = isSuper ? '#f43f5e' : '#fff';
        ctx.beginPath();
        ctx.arc(currX, scaleY(temp < 1.0 ? 2.43 * Math.pow(temp, 3) : temp), 4, 0, Math.PI * 2);
        ctx.fill();

        // Labels
        ctx.fillStyle = '#666';
        ctx.font = '10px Inter';
        ctx.fillText('Specific Heat (Cv)', 10, 15);
        ctx.fillText('Temperature (T/Tc)', width - 100, height - 5);
        ctx.fillText('Tc', scaleX(1.0) - 5, height - 5);

    }, [temp, isSuper]);

    return (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ color: '#f43f5e', fontSize: '0.6rem', textTransform: 'uppercase', marginBottom: '8px' }}>Phase Transition: Heat Capacity</h4>
            <canvas ref={canvasRef} width={250} height={200} style={{ width: '100%' }} />
            <p style={{ marginTop: '5px', fontSize: '0.55rem', color: '#555' }}>
                The discontinuous jump in $C_v$ at $T_c$ identifies a second-order phase transition.
            </p>
        </div>
    );
}
