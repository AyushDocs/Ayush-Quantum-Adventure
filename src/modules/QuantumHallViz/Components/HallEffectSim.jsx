import { useEffect, useRef, useState, useCallback } from 'react';
import { Zap, RotateCcw, MousePointer2, Play, Pause } from 'lucide-react';

const LANDSCAPE_RES = 30;
const generateLandscape = () => {
    const grid = [];
    for (let x = 0; x <= LANDSCAPE_RES; x++) {
        grid[x] = [];
        for (let y = 0; y <= LANDSCAPE_RES / 2; y++) {
            grid[x][y] = (Math.random() - 0.5) * 1.5;
        }
    }
    return grid;
};
const STATIC_LANDSCAPE = generateLandscape();

export default function HallEffectSim({ bField, chernNumber, disorderStrength, temperature = 0.1 }) {
    const canvasRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [hallFieldY, setHallFieldY] = useState(0); 
    const [impurities, setImpurities] = useState([]);
    
    const dt = 0.45;
    const E_FIELD_X = 0.07; 
    const TAU = 12.0; 

    const particles = useRef([]);

    const initParticles = useCallback((forceRender = false) => {
        const effectiveB = Math.max(0.2, bField * 0.45);
        const driftV = E_FIELD_X / effectiveB;
        particles.current = [...Array(24)].map((_, i) => ({
            x: 50 + Math.random() * 700,
            y: 100 + Math.random() * 150,
            vx: 0, vy: driftV,
            trail: [],
            color: i % 2 === 0 ? '#10b981' : '#3b82f6'
        }));
        
        // Force a single draw frame if paused so the user sees the reset
        if (forceRender && !isPlaying && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            const barW = canvasRef.current.width - 100, barH = 160;
            const barY = (canvasRef.current.height - barH) / 2;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
            ctx.fillRect(50, barY, barW, barH);
            particles.current.forEach(p => {
                ctx.beginPath(); ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = p.color; ctx.fill();
            });
        }
    }, [bField, isPlaying]);

    useEffect(() => {
        if (particles.current.length === 0) initParticles(false);
    }, [initParticles]);

    const handleCanvasClick = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setImpurities(prev => [...prev.slice(-4), { x, y, r: 25 }]); 
    };

    const getPotentialForce = useCallback((px, py) => {
        let fx = 0, fy = 0;
        const gx = (px / 800) * LANDSCAPE_RES;
        const gy = (py / 350) * (LANDSCAPE_RES / 2);
        const ix = Math.floor(gx), iy = Math.floor(gy);
        if (ix >= 0 && ix < LANDSCAPE_RES && iy >= 0 && iy < LANDSCAPE_RES / 2) {
            const u00 = STATIC_LANDSCAPE[ix][iy], u10 = STATIC_LANDSCAPE[ix+1][iy], u01 = STATIC_LANDSCAPE[ix][iy+1];
            fx -= (u10 - u00) * disorderStrength * 4.5;
            fy -= (u01 - u00) * disorderStrength * 4.5;
        }
        impurities.forEach(imp => {
            const dx = px - imp.x, dy = py - imp.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < 2500) { 
                const dist = Math.sqrt(distSq) + 0.1;
                const f = 5.0 / dist;
                fx += (dx / dist) * f;
                fy += (dy / dist) * f;
            }
        });
        return { fx, fy };
    }, [disorderStrength, impurities]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const draw = () => {
            if (!isPlaying) { animationFrameId = requestAnimationFrame(draw); return; }
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barW = canvas.width - 100, barH = 160;
            const barBox = { x: 50, y: (canvas.height - barH) / 2, w: barW, h: barH };
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.01)'; ctx.fillRect(barBox.x, barBox.y, barBox.w, barBox.h);
            ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.strokeRect(barBox.x, barBox.y, barBox.w, barBox.h);

            ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
            ctx.fillRect(0, barBox.y, 50, barH); ctx.fillRect(canvas.width - 50, barBox.y, 50, barH);
            const px1 = barBox.x + barBox.w * 0.3, px2 = barBox.x + barBox.w * 0.7;
            const pw = 30, ph = 40;
            ctx.fillRect(px1 - pw/2, barBox.y - ph, pw, ph); ctx.fillRect(px2 - pw/2, barBox.y - ph, pw, ph);
            ctx.fillRect(px1 - pw/2, barBox.y + barH, pw, ph); ctx.fillRect(px2 - pw/2, barBox.y + barH, pw, ph);

            impurities.forEach(imp => {
                const grad = ctx.createRadialGradient(imp.x, imp.y, 0, imp.x, imp.y, imp.r);
                grad.addColorStop(0, 'rgba(244, 63, 94, 0.4)'); grad.addColorStop(1, 'rgba(244, 63, 94, 0)');
                ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(imp.x, imp.y, imp.r, 0, Math.PI * 2); ctx.fill();
            });

            let netDisplacementY = 0;
            const B = bField * 0.45;
            const EX = E_FIELD_X, EY = hallFieldY;

            particles.current.forEach(p => {
                const { fx, fy } = getPotentialForce(p.x, p.y);
                const noise = temperature * 1.5;
                const ax = (EX - p.vy*B + fx + (Math.random()-0.5)*noise) - p.vx/TAU;
                const ay = (EY + p.vx*B + fy + (Math.random()-0.5)*noise) - p.vy/TAU;
                p.vx += ax * dt; p.vy += ay * dt;
                p.x += p.vx * dt; p.y += p.vy * dt;
                netDisplacementY += (p.y - canvas.height/2) / 8000;

                if (p.y < barBox.y + 5 || p.y > barBox.y + barBox.h - 5) {
                    p.vy *= -0.85; p.y = p.y < barBox.y + 5 ? barBox.y + 5 : barBox.y + barBox.h - 5;
                }
                if (p.x < 5 || p.x > canvas.width - 5) {
                    p.x = p.x < 5 ? canvas.width - 10 : 10; p.trail = [];
                }

                p.trail.push({ x: p.x, y: p.y }); if (p.trail.length > 20) p.trail.shift();
                ctx.beginPath(); p.trail.forEach((t, i) => {
                    ctx.globalAlpha = i / p.trail.length * 0.3; ctx.strokeStyle = p.color;
                    if (i === 0) ctx.moveTo(t.x, t.y); else ctx.lineTo(t.x, t.y);
                }); ctx.stroke();
                ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = p.color; ctx.fill();
            });

            setHallFieldY(prev => prev + ((-netDisplacementY * 0.2) - prev) * 0.1);

            ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(10, 10, 190, 80);
            ctx.fillStyle = '#10b981'; ctx.font = '10px Inter';
            ctx.fillText(`GEOMETRY: 6-PROBE HALL BAR`, 20, 25);
            ctx.fillText(`TOPOLOGY: 注入 (Injection)`, 20, 40);
            ctx.fillStyle = '#f43f5e'; ctx.fillText(`OBSTACLES: ${impurities.length}`, 20, 55);
            ctx.fillStyle = '#888'; ctx.fillText(`STATUS: QUANTIZED ν=${chernNumber}`, 20, 70);

            animationFrameId = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(animationFrameId);
    }, [isPlaying, bField, chernNumber, temperature, hallFieldY, impurities, getPotentialForce]);

    return (
        <div style={{ position: 'relative', width: '100%', cursor: 'crosshair' }} onClick={handleCanvasClick}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ fontSize: '0.9rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MousePointer2 size={16} /> Interactive Hall Bar Geometry
                </h3>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={(e) => { e.stopPropagation(); setImpurities([]); }} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.7rem' }}>
                        <RotateCcw size={14} /> CLEAR OBSTACLES
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); initParticles(true); }} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <RotateCcw size={14} /> RESET LAB
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                </div>
            </div>
            <canvas ref={canvasRef} width={800} height={350} style={{ width: '100%', height: '380px', background: '#050505', borderRadius: '16px', border: '1px solid #1a1a1a' }} />
        </div>
    );
}
