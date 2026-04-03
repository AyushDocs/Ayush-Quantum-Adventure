import React, { useEffect, useRef } from 'react';

export default function CrystalLatticeSim({ isAlter, themeColor }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        let animationFrameId;
        let time = 0;

        const drawLattice = () => {
            time += 0.03;
            ctx.clearRect(0, 0, width, height);

            const cols = 5;
            const rows = 3;
            const cellW = width / cols;
            const cellH = height / rows;

            // Draw faint grid bonds first
            ctx.strokeStyle = 'rgba(255,255,255,0.07)';
            ctx.lineWidth = 1;
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const cx = i * cellW + cellW / 2;
                    const cy = j * cellH + cellH / 2;
                    if (i < cols - 1) {
                        const nx = (i + 1) * cellW + cellW / 2;
                        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(nx, cy); ctx.stroke();
                    }
                    if (j < rows - 1) {
                        const ny = (j + 1) * cellH + cellH / 2;
                        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, ny); ctx.stroke();
                    }
                }
            }

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const cx = i * cellW + cellW / 2;
                    const cy = j * cellH + cellH / 2;
                    const isUpSpin = (i + j) % 2 === 0;
                    const color = isUpSpin ? '#ef4444' : '#3b82f6';

                    if (isAlter) {
                        // ==== ALTERMAGNET: Perpendicular ovals ====
                        // Up-spin sublattice → HORIZONTAL oval
                        // Down-spin sublattice → VERTICAL oval (rotated 90°)
                        const pulse = 1 + Math.sin(time + i * 0.7 + j * 0.4) * 0.06;

                        if (isUpSpin) {
                            // Horizontal oval ligand cage (wide, short)
                            ctx.save();
                            ctx.translate(cx, cy);
                            ctx.strokeStyle = `rgba(239, 68, 68, 0.5)`;
                            ctx.fillStyle = `rgba(239, 68, 68, 0.08)`;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.ellipse(0, 0, 32 * pulse, 14 * pulse, 0, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.stroke();
                            ctx.restore();
                        } else {
                            // Vertical oval ligand cage (narrow, tall) — PERPENDICULAR
                            ctx.save();
                            ctx.translate(cx, cy);
                            ctx.strokeStyle = `rgba(59, 130, 246, 0.5)`;
                            ctx.fillStyle = `rgba(59, 130, 246, 0.08)`;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.ellipse(0, 0, 14 * pulse, 32 * pulse, 0, 0, Math.PI * 2); // rotated 90°
                            ctx.fill();
                            ctx.stroke();
                            ctx.restore();
                        }
                    } else {
                        // ==== ANTIFERROMAGNET: Symmetric circular cage ====
                        const pulse = 1 + Math.sin(time + i * 0.7 + j * 0.4) * 0.04;
                        ctx.save();
                        ctx.translate(cx, cy);
                        ctx.fillStyle = 'rgba(255,255,255,0.05)';
                        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.arc(0, 0, 22 * pulse, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();
                        ctx.restore();
                    }

                    // Draw magnetic atom core
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = color;
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    // Spin arrow
                    const arrowBob = Math.sin(time * 1.2 + i + j) * 2;
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 2;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    if (isUpSpin) {
                        ctx.moveTo(cx, cy + 4 + arrowBob);
                        ctx.lineTo(cx, cy - 12 + arrowBob);
                        ctx.moveTo(cx, cy - 12 + arrowBob);
                        ctx.lineTo(cx - 3.5, cy - 7 + arrowBob);
                        ctx.moveTo(cx, cy - 12 + arrowBob);
                        ctx.lineTo(cx + 3.5, cy - 7 + arrowBob);
                    } else {
                        ctx.moveTo(cx, cy - 4 + arrowBob);
                        ctx.lineTo(cx, cy + 12 + arrowBob);
                        ctx.moveTo(cx, cy + 12 + arrowBob);
                        ctx.lineTo(cx - 3.5, cy + 7 + arrowBob);
                        ctx.moveTo(cx, cy + 12 + arrowBob);
                        ctx.lineTo(cx + 3.5, cy + 7 + arrowBob);
                    }
                    ctx.stroke();
                }
            }

            // No in-canvas legend — rendered as HTML below

            animationFrameId = requestAnimationFrame(drawLattice);
        };

        drawLattice();
        return () => cancelAnimationFrame(animationFrameId);
    }, [isAlter, themeColor]);

    return (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
            <h4 style={{ color: themeColor, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '10px' }}>Real Space: Magnetic Sublattices</h4>
            <canvas ref={canvasRef} width={480} height={250} style={{ width: '100%', borderRadius: '16px', background: '#0a0a0a' }} />

            {/* HTML Legend — clear of canvas */}
            <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', fontSize: '0.75rem', color: '#aaa' }}>
                {isAlter ? (
                    <>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ display: 'inline-block', width: '22px', height: '10px', background: 'rgba(239,68,68,0.5)', border: '1px solid #ef4444', borderRadius: '50%' }} />
                            Horizontal cage (↑)
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ display: 'inline-block', width: '10px', height: '22px', background: 'rgba(59,130,246,0.5)', border: '1px solid #3b82f6', borderRadius: '50%' }} />
                            Vertical cage (↓)
                        </span>
                        <span style={{ color: themeColor, display: 'flex', alignItems: 'center' }}>
                            Cages are 90° rotated → d-wave splitting
                        </span>
                    </>
                ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-block', width: '14px', height: '14px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%' }} />
                        Symmetric cage — translation/inversion symmetry → degenerate bands
                    </span>
                )}
            </div>
        </div>
    );
}
