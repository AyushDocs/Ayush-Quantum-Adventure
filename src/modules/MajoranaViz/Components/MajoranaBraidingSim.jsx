import React, { useEffect, useRef, useState } from 'react';

export default function MajoranaBraidingSim({ themeColor }) {
    const canvasRef = useRef(null);
    const [isBraiding, setIsBraiding] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        let animationFrameId;
        const duration = 300; // frames for braiding
        let frame = 0;

        const drawPlot = () => {
            ctx.clearRect(0, 0, width, height);

            // T-junction geometry
            ctx.fillStyle = 'rgba(60, 60, 60, 0.8)';
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 2;
            
            // Horizontal wire
            ctx.fillRect(50, 80, width - 100, 20);
            ctx.strokeRect(50, 80, width - 100, 20);
            
            // Vertical wire (the T part)
            ctx.fillRect(width / 2 - 10, 100, 20, 80);
            ctx.strokeRect(width / 2 - 10, 100, 20, 80);

            // Removing internal lines to make it seamless
            ctx.fillStyle = 'rgba(60, 60, 60, 1)';
            ctx.fillRect(width / 2 - 9, 81, 18, 20);

            // Base positions of Gamma 1, 2, 3, 4
            // Let's say Gamma 1 & 2 are the active ones we want to braid on the top wire
            // And there are Gamma 3 & 4 on the vertical? For a T-junction we assume it's just wires.
            
            let p1 = { x: 60, y: 90 }; // Left Majorana
            let p2 = { x: width - 60, y: 90 }; // Right Majorana

            // Braiding path parametric equations
            if (isBraiding) {
                frame++;
                if (frame > duration) setIsBraiding(false); // End

                let t = frame / duration;
                
                // P1 moves to center, then down, then right
                if (t < 0.25) {
                    p1.x = 60 + (width / 2 - 60) * (t / 0.25);
                } else if (t < 0.5) {
                    p1.x = width / 2;
                    p1.y = 90 + 80 * ((t - 0.25) / 0.25);
                } else if (t < 0.75) {
                    // P2 has moved left. P1 moves from bottom to center.
                    p1.x = width / 2;
                    p1.y = 170 - 80 * ((t - 0.5) / 0.25);
                } else {
                    p1.x = width / 2 + (width / 2 - 60) * ((t - 0.75) / 0.25);
                    p1.y = 90;
                }

                // P2 moves to left directly while P1 is parked.
                if (t < 0.5) {
                    // stays parked on the right
                } else if (t < 0.75) {
                    // moves left
                    p2.x = (width - 60) - (width - 120) * ((t - 0.5) / 0.25);
                } else {
                    // stays parked on the left
                    p2.x = 60;
                }
            } else {
                frame = 0; // Reset
            }

            // Draw Majoranas
            ctx.shadowColor = themeColor;
            ctx.shadowBlur = 15;
            ctx.fillStyle = themeColor;

            // Draw P1
            ctx.beginPath();
            ctx.arc(p1.x, p1.y, 8, 0, Math.PI * 2);
            ctx.fill();

            // Draw P2
            ctx.beginPath();
            ctx.arc(p2.x, p2.y, 8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#fff';
            ctx.font = '12px Inter';
            // Determine labels based on final parked state for visual continuity
            if (!isBraiding && frame === 0) {
                 ctx.fillText('γ₁', 55, 85);
                 ctx.fillText('γ₂', width - 65, 85);
            } else {
                ctx.fillText('γ₁', p1.x - 5, p1.y - 12);
                ctx.fillText('γ₂', p2.x - 5, p2.y - 12);
            }

            animationFrameId = requestAnimationFrame(drawPlot);
        };

        drawPlot();

        return () => cancelAnimationFrame(animationFrameId);
    }, [isBraiding, themeColor]);

    return (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ color: themeColor, fontSize: '0.8rem', textTransform: 'uppercase', margin: 0 }}>Non-Abelian Braiding (T-Junction)</h4>
                <button 
                    onClick={() => setIsBraiding(true)} 
                    disabled={isBraiding}
                    style={{ 
                        background: isBraiding ? '#333' : themeColor, 
                        border: 'none', 
                        color: isBraiding ? '#888' : '#000', 
                        padding: '6px 12px', 
                        borderRadius: '8px', 
                        fontSize: '0.7rem', 
                        fontWeight: 'bold',
                        cursor: isBraiding ? 'default' : 'pointer',
                        transition: '0.2s'
                    }}
                >
                    {isBraiding ? 'BRAIDING...' : 'EXCHANGE (BRAID)'}
                </button>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#888', marginBottom: '15px' }}>
                Exchanging two Majoranas produces a non-trivial unitary transformation U₁₂ = exp(±i(π/4)γ₁γ₂), updating the global quantum state depending on the path taken.
            </p>
            <canvas ref={canvasRef} width={600} height={200} style={{ width: '100%', borderRadius: '16px', background: '#0a0a0a' }} />
        </div>
    );
}
