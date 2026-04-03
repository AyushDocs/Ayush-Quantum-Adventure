import React, { useEffect, useRef } from 'react';

export default function AndreevSim({ energy, gap, barrierZ = 0, themeColor }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        let animationFrameId;
        const particles = [];
        let time = 0;

        // BTK Approximation: Andreev Reflection Probability at E=0
        // A = 1 / (1 + Z^2)^2
        const andreevProb = 1 / Math.pow(1 + barrierZ * barrierZ, 2);

        const spawnParticle = () => {
            particles.push({
                x: 10,
                y: height / 2 + (Math.random() * 20 - 10),
                vx: 2,
                type: 'electron_in',
                phase: 0
            });
        };

        const drawInterface = () => {
            // Normal metal (left)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.fillRect(0, 0, width / 2, height);
            
            // Superconductor (right)
            ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
            ctx.fillRect(width / 2, 0, width / 2, height);
            
            // Interface line (Opacity represents Z)
            ctx.strokeStyle = `rgba(244, 63, 94, ${Math.min(barrierZ / 3.0, 1.0)})`;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(width / 2, 0);
            ctx.lineTo(width / 2, height);
            ctx.stroke();

            // Default interface glow
            ctx.strokeStyle = themeColor;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Labels
            ctx.fillStyle = '#666';
            ctx.font = '12px Inter';
            ctx.fillText('Normal Metal (N)', 20, 20);
            ctx.fillStyle = themeColor;
            ctx.fillText('Superconductor (S)', width / 2 + 20, 20);
        };

        const updateAndDrawParticles = () => {
            const interfaceX = width / 2;

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.phase += 0.1;

                // Draw Particle
                ctx.beginPath();
                if (p.type === 'electron_in' || p.type === 'electron_reflected') {
                    ctx.fillStyle = '#60a5fa'; // Blue electron
                    ctx.arc(p.x, p.y + Math.sin(p.phase)*5, 6, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Collision with interface for incoming electron
                    if (p.type === 'electron_in' && p.x > interfaceX - 5 && p.vx > 0) {
                        if (energy < gap) {
                            if (Math.random() < andreevProb) {
                                // Andreev Reflection -> Hole reflects
                                particles.push({ x: interfaceX, y: p.y, vx: -2, type: 'hole_out', phase: p.phase });
                                // Cooper pair transmits
                                particles.push({ x: interfaceX, y: p.y, vx: 1, type: 'cooper_pair', phase: 0 });
                            } else {
                                // Normal elastic reflection -> Electron reflects
                                particles.push({ x: interfaceX, y: p.y, vx: -2, type: 'electron_reflected', phase: p.phase });
                            }
                        } else {
                            // Quasiparticle transmission (simplified: decreases with Z)
                            if (Math.random() < andreevProb * 1.5) {
                                particles.push({ x: interfaceX, y: p.y, vx: 2, type: 'quasiparticle', phase: p.phase });
                            } else {
                                particles.push({ x: interfaceX, y: p.y, vx: -2, type: 'electron_reflected', phase: p.phase });
                            }
                        }
                        particles.splice(i, 1);
                    }
                } else if (p.type === 'hole_out') {
                    ctx.fillStyle = '#f43f5e'; // Red hole
                    ctx.arc(p.x, p.y - Math.sin(p.phase)*5, 6, 0, Math.PI * 2);
                    ctx.fill();
                    // Hole has a + sign inside
                    ctx.fillStyle = '#fff';
                    ctx.fillText('+', p.x - 3, p.y - Math.sin(p.phase)*5 + 3);
                } else if (p.type === 'cooper_pair') {
                    ctx.fillStyle = '#10b981'; // Green pair
                    ctx.arc(p.x - 5, p.y + Math.sin(p.phase - 1)*8, 5, 0, Math.PI * 2);
                    ctx.arc(p.x + 5, p.y + Math.sin(p.phase + 1)*8, 5, 0, Math.PI * 2);
                    ctx.fill();
                    // Connecting glue
                    ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
                    ctx.moveTo(p.x - 5, p.y + Math.sin(p.phase - 1)*8);
                    ctx.lineTo(p.x + 5, p.y + Math.sin(p.phase + 1)*8);
                    ctx.stroke();
                } else if (p.type === 'quasiparticle') {
                    ctx.fillStyle = '#8b5cf6'; // Purple quasiparticle
                    ctx.arc(p.x, p.y + Math.sin(p.phase)*5, 6, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Remove out of bounds
                if (p.x < 0 || p.x > width) {
                    particles.splice(i, 1);
                }
            }
        };

        const loop = () => {
            time++;
            ctx.clearRect(0, 0, width, height);
            drawInterface();

            if (time % 100 === 0) spawnParticle();
            updateAndDrawParticles();

            // Energy diagram
            ctx.fillStyle = '#333';
            ctx.fillRect(width / 2 + 10, height - 60, 40, 50);
            ctx.fillStyle = energy < gap ? '#f43f5e' : '#10b981';
            const eh = Math.min((energy / gap) * 50, 50); // E relative to gap visually
            ctx.fillRect(width / 2 + 10, height - 10 - eh, 40, eh);
            ctx.strokeStyle = '#fff';
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            ctx.moveTo(width / 2 + 5, height - 60); // Delta line
            ctx.lineTo(width / 2 + 55, height - 60);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = '#fff';
            ctx.font = '10px Inter';
            ctx.fillText('Δ', width / 2 + 60, height - 55);
            ctx.fillText('E', width / 2 + 20, height - 10 - eh - 5);

            animationFrameId = requestAnimationFrame(loop);
        };

        spawnParticle();
        loop();

        return () => cancelAnimationFrame(animationFrameId);
    }, [energy, gap, barrierZ, themeColor]);

    return (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
            <h4 style={{ color: themeColor, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '10px' }}>N-S Interface Simulation</h4>
            <canvas ref={canvasRef} width={400} height={250} style={{ width: '100%', borderRadius: '16px', background: '#0a0a0a' }} />
            <div style={{ marginTop: '15px', display: 'flex', gap: '15px', fontSize: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '10px', height: '10px', background: '#60a5fa', borderRadius: '50%' }}></div> Electron (In)</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '10px', height: '10px', background: '#60a5fa', borderRadius: '50%', border: '1px solid #fff' }}></div> Electron (Out)</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '10px', height: '10px', background: '#f43f5e', borderRadius: '50%' }}></div> Hole (Out)</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '20px', height: '10px', background: '#10b981', borderRadius: '10px' }}></div> Cooper Pair</span>
            </div>
        </div>
    );
}
