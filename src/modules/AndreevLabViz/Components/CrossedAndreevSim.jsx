import React, { useEffect, useRef } from 'react';

export default function CrossedAndreevSim({ width: barrierWidth, gap, themeColor }) {
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

        // Base width of the S region
        const baseBarrierPx = 40; 
        const currentBarrierPx = baseBarrierPx * barrierWidth;

        const leftInterface = (width / 2) - (currentBarrierPx / 2);
        const rightInterface = (width / 2) + (currentBarrierPx / 2);

        // Probability of splitting decays exponentially with barrier width
        const splitProbability = Math.exp(-(barrierWidth - 0.2) * 2);

        const spawnPair = () => {
            particles.push({
                x: width / 2,
                y: height / 2 + (Math.random() * 40 - 20),
                type: 'cooper_source',
                phase: 0,
                timer: 0
            });
        };

        const drawInterface = () => {
            // Left Normal
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.fillRect(0, 0, leftInterface, height);
            
            // Middle Superconductor
            ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
            ctx.fillRect(leftInterface, 0, currentBarrierPx, height);
            
            // Right Normal
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.fillRect(rightInterface, 0, width - rightInterface, height);
            
            // Interface lines
            ctx.strokeStyle = themeColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(leftInterface, 0); ctx.lineTo(leftInterface, height);
            ctx.moveTo(rightInterface, 0); ctx.lineTo(rightInterface, height);
            ctx.stroke();

            // Labels
            ctx.fillStyle = '#666';
            ctx.font = '10px Inter';
            ctx.fillText('N', leftInterface / 2 - 5, 20);
            ctx.fillText('N', rightInterface + (width - rightInterface)/2 - 5, 20);
            ctx.fillStyle = themeColor;
            ctx.fillText('S', width / 2 - 5, 20);
            
            // Barrier Width Text
            ctx.fillStyle = '#aaa';
            ctx.fillText(`L = ${barrierWidth.toFixed(1)} ξ`, width / 2 - 20, height - 20);
        };

        const updateAndDrawParticles = () => {
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.phase += 0.1;

                ctx.beginPath();
                if (p.type === 'cooper_source') {
                    p.timer++;
                    ctx.fillStyle = '#10b981'; 
                    ctx.arc(p.x - 5, p.y, 5, 0, Math.PI * 2);
                    ctx.arc(p.x + 5, p.y, 5, 0, Math.PI * 2);
                    ctx.fill();
                    
                    if (p.timer > 30) {
                        // Split or Recombine
                        if (Math.random() < splitProbability) {
                            // Split: CPS
                            particles.push({ x: p.x - 5, y: p.y, vx: -2, type: 'entangled_e1', partnerId: time, phase: p.phase });
                            particles.push({ x: p.x + 5, y: p.y, vx: 2, type: 'entangled_e2', partnerId: time, phase: p.phase });
                        } else {
                            // Conventional Andreev / Stays in S
                            particles.push({ x: p.x, y: p.y, vx: (Math.random() > 0.5 ? 2 : -2), type: 'cooper_pair_move', phase: p.phase });
                        }
                        particles.splice(i, 1);
                    }
                } else if (p.type === 'entangled_e1' || p.type === 'entangled_e2') {
                    p.x += p.vx;
                    ctx.fillStyle = '#60a5fa'; // Blue electron
                    ctx.arc(p.x, p.y + Math.sin(p.phase)*3, 6, 0, Math.PI * 2);
                    ctx.fill();

                    // Draw entanglement glow
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#60a5fa';
                    ctx.strokeStyle = 'rgba(96, 165, 250, 0.5)';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                    
                    // Draw spin arrow (up for e1, down for e2)
                    ctx.fillStyle = '#fff';
                    ctx.font = '8px Arial';
                    ctx.fillText(p.type === 'entangled_e1' ? '↑' : '↓', p.x - 3, p.y + Math.sin(p.phase)*3 + 3);

                } else if (p.type === 'cooper_pair_move') {
                    p.x += p.vx;
                    ctx.fillStyle = '#10b981'; 
                    ctx.arc(p.x - 5, p.y + Math.sin(p.phase - 1)*4, 5, 0, Math.PI * 2);
                    ctx.arc(p.x + 5, p.y + Math.sin(p.phase + 1)*4, 5, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Remove out of bounds (extended a bit beyond N)
                if (p.x < -20 || p.x > width + 20) {
                    particles.splice(i, 1);
                }
            }

            // Draw entanglement lines between partners
            for (let i = 0; i < particles.length; i++) {
                if (particles[i].type === 'entangled_e1') {
                    for (let j = 0; j < particles.length; j++) {
                        if (particles[j].type === 'entangled_e2' && particles[i].partnerId === particles[j].partnerId) {
                            ctx.beginPath();
                            ctx.strokeStyle = `rgba(96, 165, 250, ${Math.max(0, 0.5 - Math.abs(particles[i].x - particles[j].x)/400)})`;
                            ctx.setLineDash([5, 5]);
                            ctx.moveTo(particles[i].x, particles[i].y + Math.sin(particles[i].phase)*3);
                            ctx.lineTo(particles[j].x, particles[j].y + Math.sin(particles[j].phase)*3);
                            ctx.stroke();
                            ctx.setLineDash([]);
                        }
                    }
                }
            }
        };

        const loop = () => {
            time++;
            ctx.clearRect(0, 0, width, height);
            drawInterface();

            if (time % 80 === 0) spawnPair();
            updateAndDrawParticles();

            // Probability gauge
            ctx.fillStyle = '#333';
            ctx.fillRect(20, height - 30, 80, 10);
            ctx.fillStyle = '#10b981';
            ctx.fillRect(20, height - 30, splitProbability * 80, 10);
            ctx.fillStyle = '#fff';
            ctx.font = '9px Inter';
            ctx.fillText('CPS Prob.', 20, height - 35);

            animationFrameId = requestAnimationFrame(loop);
        };

        spawnPair();
        loop();

        return () => cancelAnimationFrame(animationFrameId);
    }, [barrierWidth, gap, themeColor]);

    return (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
            <h4 style={{ color: themeColor, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '10px' }}>N-S-N Cooper Pair Splitting</h4>
            <canvas ref={canvasRef} width={400} height={250} style={{ width: '100%', borderRadius: '16px', background: '#0a0a0a' }} />
            <div style={{ marginTop: '15px', display: 'flex', gap: '15px', fontSize: '0.75rem', justifyContent: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '10px', height: '10px', background: '#60a5fa', borderRadius: '50%' }}></div> Entangled Electron (↑)</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '10px', height: '10px', background: '#60a5fa', borderRadius: '50%' }}></div> Entangled Electron (↓)</span>
            </div>
        </div>
    );
}
