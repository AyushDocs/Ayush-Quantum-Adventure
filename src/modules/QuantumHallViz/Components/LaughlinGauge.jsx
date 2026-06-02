import { useState, useEffect, useRef, useMemo } from 'react';
import { HelpCircle, Play, Pause, RotateCcw } from 'lucide-react';

export default function LaughlinGauge({ chernNumber, bField }) {
    const [flux, setFlux] = useState(0.0); // ranges from 0.0 to 1.0 (in units of Phi_0)
    const [isPlaying, setIsPlaying] = useState(true);
    const lastTimeRef = useRef(null);
    const animationFrameRef = useRef(null);

    const isBZero = bField < 0.05;

    // Parse Chern number as integer for number of pumped charges
    const nu = useMemo(() => {
        if (isBZero) return 0;
        const val = Math.floor(parseFloat(chernNumber));
        return isNaN(val) ? 1 : Math.max(1, val);
    }, [chernNumber, isBZero]);

    useEffect(() => {
        if (!isPlaying) {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            return;
        }

        const animate = (time) => {
            if (!lastTimeRef.current) lastTimeRef.current = time;
            const delta = time - lastTimeRef.current;
            lastTimeRef.current = time;

            setFlux((prev) => {
                const next = prev + delta * 0.0004; // slow transition
                return next > 1.0 ? 0.0 : next;
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            lastTimeRef.current = null;
        };
    }, [isPlaying]);

    const spacing = 45;
    const basePositions = [80, 125, 170, 215, 260, 305, 350, 395];

    // Compute the positions of the orbital rings
    const rings = useMemo(() => {
        return basePositions.map((pos) => {
            const currentX = pos + flux * spacing;
            const isFadingIn = pos === basePositions[0];
            const isFadingOut = pos === basePositions[basePositions.length - 1];

            // Fade opacity at the boundaries
            let opacity = 1.0;
            if (isFadingIn) opacity = flux;
            if (isFadingOut) opacity = 1.0 - flux;

            return { x: currentX, opacity };
        });
    }, [flux]);

    // Positions for electrons on each ring based on Chern Number (nu)
    const electronOffsets = useMemo(() => {
        if (nu === 1) return [Math.PI / 2]; // front-center
        if (nu === 2) return [Math.PI / 4, (3 * Math.PI) / 4];
        return [Math.PI / 6, Math.PI / 2, (5 * Math.PI) / 6]; // nu >= 3
    }, [nu]);

    const cylinderY = 110;
    const cylinderH = 70;
    const rx = 12;
    const ry = cylinderH / 2;

    return (
        <div style={{
            background: '#ffffff',
            padding: '24px',
            borderRadius: '24px',
            border: '1px solid #ddd8ce',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr',
            gap: '30px',
            alignItems: 'center'
        }}>
            {/* Visual Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h3 style={{ fontSize: '0.85rem', color: '#1a1a2e', fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HelpCircle size={16} color="#7c3aed" /> Laughlin Cylinder Pump
                </h3>

                <div style={{ 
                    background: '#faf8f4', 
                    borderRadius: '16px', 
                    border: '1px solid #ddd8ce', 
                    position: 'relative', 
                    overflow: 'hidden', 
                    height: '220px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                }}>
                    <svg width="100%" height="200" viewBox="0 0 500 200" style={{ overflow: 'visible' }}>
                        <defs>
                            {/* Cylinder body gradient */}
                            <linearGradient id="cylGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                                <stop offset="40%" stopColor="#f4f1ea" stopOpacity="0.9" />
                                <stop offset="100%" stopColor="#e4e2db" stopOpacity="0.85" />
                            </linearGradient>
                            {/* Magnetic flux thread gradient */}
                            <linearGradient id="fluxGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#fbbf24" />
                                <stop offset="50%" stopColor="#f59e0b" />
                                <stop offset="100%" stopColor="#d97706" />
                            </linearGradient>
                            {/* Solenoid core glow gradient */}
                            <linearGradient id="solGlow" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#9ca3af" />
                                <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#9ca3af" />
                            </linearGradient>
                        </defs>

                        {/* Central Magnetic Flux Thread */}
                        <line x1="30" y1={cylinderY} x2="470" y2={cylinderY} stroke="url(#fluxGrad)" strokeWidth="2" strokeLinecap="round" />
                        
                        {/* Solenoid Back Turns */}
                        {Array.from({ length: 19 }).map((_, idx) => {
                            const sx = 110 + idx * 15;
                            return (
                                <line
                                    key={`sol-back-${idx}`}
                                    x1={sx}
                                    y1={cylinderY + 6}
                                    x2={sx + 5}
                                    y2={cylinderY - 6}
                                    stroke="#b45309"
                                    strokeWidth="1.5"
                                    opacity="0.8"
                                />
                            );
                        })}

                        {/* Solenoid Core */}
                        <rect 
                            x="105" 
                            y={cylinderY - 6} 
                            width="290" 
                            height="12" 
                            fill={flux > 0.05 ? "url(#solGlow)" : "#9ca3af"} 
                            opacity="0.9" 
                            rx="1" 
                            stroke="#78716c" 
                            strokeWidth="0.5" 
                        />
                        <text x="250" y={cylinderY + 4} fill={flux > 0.05 ? "#b45309" : "#4b5563"} fontSize="6.5" fontWeight="bold" textAnchor="middle" opacity="0.8">
                            INTERNAL SOLENOID
                        </text>

                        {/* Solenoid Front Turns */}
                        {Array.from({ length: 19 }).map((_, idx) => {
                            const sx = 110 + idx * 15;
                            return (
                                <line
                                    key={`sol-front-${idx}`}
                                    x1={sx + 5}
                                    y1={cylinderY - 6}
                                    x2={sx + 15}
                                    y2={cylinderY + 6}
                                    stroke="#f59e0b"
                                    strokeWidth="2"
                                />
                            );
                        })}

                        <text x="250" y="55" fill="#ca8a04" fontSize="10" fontWeight="bold" textAnchor="middle">
                            Threaded Flux Φ = {(flux).toFixed(2)} Φ₀
                        </text>

                        {/* Cylinder Back End (Dashed for 3D effect) */}
                        {rings.map((ring, idx) => (
                            <path
                                key={`back-${idx}`}
                                d={`M ${ring.x} ${cylinderY - ry} A ${rx} ${ry} 0 0 0 ${ring.x} ${cylinderY + ry}`}
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="1.5"
                                strokeDasharray="3,2"
                                opacity={ring.opacity * 0.3}
                            />
                        ))}

                        {/* Cylinder Base 3D Shell */}
                        <rect x="100" y={cylinderY - ry} width="300" height={cylinderH} fill="url(#cylGrad)" stroke="#ddd8ce" strokeWidth="1" />
                        <ellipse cx="100" cy={cylinderY} rx={rx} ry={ry} fill="#e4e2db" stroke="#ddd8ce" strokeWidth="1" />
                        <ellipse cx="400" cy={cylinderY} rx={rx} ry={ry} fill="#d5d2c9" stroke="#ddd8ce" strokeWidth="1" />

                        {/* Cylinder Front End (Solid loops) */}
                        {rings.map((ring, idx) => (
                            <path
                                key={`front-${idx}`}
                                d={`M ${ring.x} ${cylinderY + ry} A ${rx} ${ry} 0 0 0 ${ring.x} ${cylinderY - ry}`}
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                opacity={ring.opacity}
                            />
                        ))}

                        {/* Orbiting Electrons (on the front face of each loop) */}
                        {rings.map((ring, rIdx) => 
                            electronOffsets.map((angle, eIdx) => {
                                const elX = ring.x + rx * Math.cos(angle);
                                const elY = cylinderY + ry * Math.sin(angle);
                                return (
                                    <g key={`e-${rIdx}-${eIdx}`} opacity={ring.opacity}>
                                        <circle cx={elX} cy={elY} r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1" />
                                        <text x={elX} y={elY + 1.5} fill="#ffffff" fontSize="7" fontWeight="black" textAnchor="middle">-</text>
                                    </g>
                                );
                            })
                        )}

                        {/* Charge pumping indicators */}
                        {flux > 0.8 && !isBZero && (
                            <g transform="translate(420, 110)">
                                <text x="0" y="-15" fill="#3b82f6" fontSize="9" fontWeight="bold" textAnchor="middle">
                                    +{nu}e pumped
                                </text>
                                <path d="M -10,-5 L 5,0 L -10,5 Z" fill="#3b82f6" transform="translate(5, 0) scale(0.8)" />
                            </g>
                        )}
                    </svg>

                    <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', gap: '8px' }}>
                        <button 
                            onClick={() => setIsPlaying(!isPlaying)} 
                            style={{ 
                                background: '#ffffff', 
                                border: '1px solid #ddd8ce', 
                                padding: '6px 12px', 
                                borderRadius: '8px', 
                                fontSize: '0.7rem', 
                                cursor: 'pointer', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '4px',
                                color: '#1a1a2e',
                                fontWeight: 'bold'
                            }}
                        >
                            {isPlaying ? <Pause size={10} /> : <Play size={10} />} {isPlaying ? 'PAUSE' : 'PLAY'}
                        </button>
                        <button 
                            onClick={() => { setFlux(0); setIsPlaying(false); }} 
                            style={{ 
                                background: '#ffffff', 
                                border: '1px solid #ddd8ce', 
                                padding: '6px 12px', 
                                borderRadius: '8px', 
                                fontSize: '0.7rem', 
                                cursor: 'pointer', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '4px',
                                color: '#1a1a2e',
                                fontWeight: 'bold'
                            }}
                        >
                            <RotateCcw size={10} /> RESET
                        </button>
                    </div>
                </div>
            </div>

            {/* Educational Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h4 style={{ fontSize: '0.8rem', color: '#7c3aed', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Laughlin's Gedankenexperiment
                </h4>

                <p style={{ fontSize: '0.85rem', color: '#1a1a2e', lineHeight: '1.6', margin: 0 }}>
                    In 1981, Robert Laughlin proposed a brilliant gauge argument explaining the exact quantization of the Hall conductance. 
                </p>
                
                <p style={{ fontSize: '0.8rem', color: '#555555', lineHeight: '1.6', margin: 0 }}>
                    Imagine a 2D electron gas rolled into a <b>cylinder</b>. An <b>internal solenoid</b> runs down the center of the cylinder. Threading magnetic flux <b>Φ</b> through the solenoid creates a non-zero magnetic vector potential <b>A<sub>θ</sub> = Φ / 2πr</b> on the cylinder surface, even though the magnetic field <b>B</b> is zero outside the solenoid.
                </p>
                
                <p style={{ fontSize: '0.8rem', color: '#555555', lineHeight: '1.6', margin: 0 }}>
                    Increasing the flux adiabatically by exactly one flux quantum (<b>Φ₀ = h/e</b>) shifts the vector potential, mapping the system's Hamiltonian back to a gauge-equivalent state.
                </p>

                <p style={{ fontSize: '0.8rem', color: '#555555', lineHeight: '1.6', margin: 0 }}>
                    However, during this cycle, the localized states (represented by the green rings) shift axially. In a filled Landau level, this shifts exactly <b>{isBZero ? "-" : nu} electron(s)</b> (for ν={isBZero ? "-" : nu}) from the left edge to the right edge.
                </p>

                {/* Slider control */}
                <div style={{ borderTop: '1px solid #ddd8ce', paddingTop: '15px', marginTop: '5px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#555555', marginBottom: '8px', fontWeight: 'bold' }}>
                        Manual Flux Control (Φ / Φ₀)
                    </label>
                    <input 
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={flux}
                        onChange={(e) => {
                            setIsPlaying(false);
                            setFlux(parseFloat(e.target.value));
                        }}
                        style={{ width: '100%', accentColor: '#7c3aed' }}
                    />
                </div>
            </div>
        </div>
    );
}
