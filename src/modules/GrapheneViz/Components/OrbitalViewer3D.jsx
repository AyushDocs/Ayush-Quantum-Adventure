import { useEffect, useRef, useMemo, useState } from 'react';
import { ZoomIn, Rotate3d, Compass } from 'lucide-react';

export default function OrbitalViewer3D({ t1 }) {
    const canvasRef = useRef(null);
    const [zoom, setZoom] = useState(300);
    const [rotationY, setRotationY] = useState(0.5);
    const [rotationX, setRotationX] = useState(0.8);
    
    // 1. Define Lattice Points (Honeycombs)
    const lattice = useMemo(() => {
        const pts = [];
        const a = 0.8; // bond length
        for (let i = -2; i <= 2; i++) {
            for (let j = -2; j <= 2; j++) {
                const x0 = i * 1.5 * a;
                const y0 = (j * Math.sqrt(3) + (i % 2) * (Math.sqrt(3)/2)) * a;
                // Atom A
                pts.push({ x: x0, y: y0, id: pts.length });
                // Atom B
                pts.push({ x: x0 + a, y: y0, id: pts.length });
            }
        }
        return pts;
    }, []);

    // 2. Define Neighbors
    const neighbors = useMemo(() => {
        const nMap = {};
        lattice.forEach(p1 => {
            nMap[p1.id] = lattice
                .filter(p2 => {
                    const d = Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
                    return d > 0.1 && d < 0.9; // Tight neighbors
                })
                .map(p2 => p2.id);
        });
        return nMap;
    }, [lattice]);

    const electronsRef = useRef([...Array(8)].map(() => ({
        currentId: Math.floor(Math.random() * lattice.length),
        targetId: null,
        progress: 1.0
    })));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const project = (x, y, z) => {
            const dist = 6.0;
            const cosX = Math.cos(rotationX), sinX = Math.sin(rotationX);
            const cosY = Math.cos(rotationY), sinY = Math.sin(rotationY);
            
            let x1 = x * cosY - z * sinY;
            let z1 = x * sinY + z * cosY;
            let x2 = x1;
            let y2 = y * cosX - z1 * sinX;
            let z2 = y * sinX + z1 * cosX;
            
            const f = zoom / (z2 + dist);
            return { x: canvas.width / 2 + x2 * f, y: canvas.height / 2 - y2 * f };
        };

        const drawDumbbell = (cx, cz, color) => {
            const points = 15;
            const len = 0.45;
            [1, -1].forEach(dir => {
                ctx.beginPath();
                for (let i = 0; i <= points; i++) {
                    const phi = (i / points) * Math.PI * 2;
                    const r = Math.pow(Math.sin(phi/2), 2) * len;
                    const lx = cx + r * Math.sin(phi * 0.5) * 0.3;
                    const lz = cz + r * Math.sin(phi * 0.5) * 0.3;
                    const ly = r * dir * Math.cos(phi * 0.5);
                    const p = project(lx, ly, lz);
                    if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
                }
                ctx.fillStyle = color; ctx.fill();
            });
        };

        const updatePhysics = () => {
            const jumpChance = t1 * 0.015;
            electronsRef.current.forEach(e => {
                if (e.progress >= 1.0) {
                    if (Math.random() < jumpChance) {
                        const possibilities = neighbors[e.currentId];
                        if (possibilities && possibilities.length > 0) {
                            e.targetId = possibilities[Math.floor(Math.random() * possibilities.length)];
                            e.progress = 0;
                        }
                    }
                } else {
                    e.progress += 0.04 + (t1 * 0.01);
                    if (e.progress >= 1.0) {
                        e.currentId = e.targetId; e.targetId = null; e.progress = 1.0;
                    }
                }
            });
        };

        const draw = () => {
            updatePhysics();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // 1. BONDS (Hexagonal Structure)
            ctx.strokeStyle = 'rgba(255,255,255,0.2)'; // Brighter bonds
            ctx.lineWidth = 1.5;
            lattice.forEach(p1 => {
                neighbors[p1.id].forEach(id2 => {
                    if (id2 > p1.id) {
                        const p2 = lattice[id2];
                        const proj1 = project(p1.x, 0, p1.y);
                        const proj2 = project(p2.x, 0, p2.y);
                        ctx.beginPath(); ctx.moveTo(proj1.x, proj1.y); ctx.lineTo(proj2.x, proj2.y); ctx.stroke();
                    }
                });
            });

            // 2. ORBITALS
            lattice.forEach(p => {
                drawDumbbell(p.x, p.y, 'rgba(59, 130, 246, 0.45)');
                const nucleus = project(p.x, 0, p.y);
                ctx.fillStyle = '#10b981'; ctx.beginPath(); ctx.arc(nucleus.x, nucleus.y, 2, 0, Math.PI * 2); ctx.fill();
            });

            // 3. ELECTRONS
            electronsRef.current.forEach(e => {
                let ex, ey, ez;
                const p1 = lattice[e.currentId];
                if (e.targetId !== null) {
                    const p2 = lattice[e.targetId];
                    ex = p1.x + (p2.x - p1.x) * e.progress;
                    ez = p1.y + (p2.y - p1.y) * e.progress;
                    ey = Math.sin(e.progress * Math.PI) * 0.5;
                } else {
                    ex = p1.x; ez = p1.y; ey = 0;
                }
                const ep = project(ex, ey, ez);
                ctx.shadowBlur = 15; ctx.shadowColor = '#fbbf24';
                ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(ep.x, ep.y, 5, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0;
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationFrameId);
    }, [lattice, neighbors, t1, zoom, rotationX, rotationY]);

    return (
        <div style={{ background: '#050505', padding: '30px', borderRadius: '32px', border: '1px solid #1a1a1a', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <div>
                  <h4 style={{ color: '#10b981', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>
                      Hybridization Viewer (sp² + pᶻ)
                  </h4>
                  <p style={{ fontSize: '0.65rem', color: '#666', marginTop: '4px' }}>
                      Visualizing the 1s², 2s², 2p² transition to the conductively active pᶻ highway.
                  </p>
                </div>
                {/* Visual Controls */}
                <div style={{ display: 'flex', gap: '25px' }}>
                   <OverlaySlider icon={<ZoomIn size={14}/>} val={zoom} setVal={setZoom} min={100} max={800} />
                   <OverlaySlider icon={<Rotate3d size={14}/>} val={rotationY} setVal={setRotationY} min={0} max={Math.PI * 2} />
                   <OverlaySlider icon={<Compass size={14}/>} val={rotationX} setVal={setRotationX} min={0} max={Math.PI / 2} />
                </div>
            </div>
            <canvas ref={canvasRef} width={700} height={400} style={{ width: '100%', borderRadius: '16px', background: 'radial-gradient(circle at center, #0a0a0a 0%, #050505 100%)' }} />
        </div>
    );
}

function OverlaySlider({ icon, val, setVal, min, max }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#444' }}>{icon}</span>
            <input type="range" min={min} max={max} step={0.01} value={val} 
                   onChange={(e) => setVal(parseFloat(e.target.value))} 
                   style={{ width: '60px', height: '3px', accentColor: '#10b981' }} />
        </div>
    );
}
