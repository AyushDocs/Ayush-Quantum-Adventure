import { useEffect, useRef, useState, useCallback } from 'react';
import { Zap, RotateCcw, MousePointer2, Play, Pause, Info } from 'lucide-react';

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

const WAYPOINTS = [
    { x: 58, y: 103 },
    { x: 247, y: 103 },
    { x: 247, y: 67 },
    { x: 273, y: 67 },
    { x: 273, y: 103 },
    { x: 527, y: 103 },
    { x: 527, y: 67 },
    { x: 553, y: 67 },
    { x: 553, y: 103 },
    { x: 742, y: 103 },
    { x: 742, y: 247 },
    { x: 553, y: 247 },
    { x: 553, y: 283 },
    { x: 527, y: 283 },
    { x: 527, y: 247 },
    { x: 273, y: 247 },
    { x: 273, y: 283 },
    { x: 247, y: 283 },
    { x: 247, y: 247 },
    { x: 58, y: 247 }
];

const segments = [];
let totalLength = 0;
for (let i = 0; i < WAYPOINTS.length; i++) {
    const p1 = WAYPOINTS[i];
    const p2 = WAYPOINTS[(i + 1) % WAYPOINTS.length];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    segments.push({
        p1,
        p2,
        dx,
        dy,
        length,
        ux: dx / length,
        uy: dy / length,
        startS: totalLength
    });
    totalLength += length;
}

const getPathState = (s) => {
    const sWrapped = ((s % totalLength) + totalLength) % totalLength;
    let seg = segments[0];
    for (let i = 0; i < segments.length; i++) {
        if (sWrapped >= segments[i].startS && sWrapped < segments[i].startS + segments[i].length + 0.001) {
            seg = segments[i];
            break;
        }
    }
    const localS = sWrapped - seg.startS;
    const x_path = seg.p1.x + seg.ux * localS;
    const y_path = seg.p1.y + seg.uy * localS;

    const targetW = 32;
    const numArches = Math.max(1, Math.round(seg.length / targetW));
    const archW = seg.length / numArches;
    
    const archPhase = (localS / archW) * Math.PI;
    const bounce = Math.abs(Math.sin(archPhase));
    
    const vx = -seg.uy;
    const vy = seg.ux;

    return { x_path, y_path, vx, vy, bounce };
};

const generateInitialParticles = (bField, showEdgeStates) => {
    const isZeroB = bField < 0.05;
    const effectiveB = Math.max(0.2, bField * 0.45);
    const driftV = 0.07 / effectiveB;
    
    return [...Array(24)].map((_, i) => {
        const isEdge = i < 16; // 16 edge particles, 8 bulk particles
        
        if (showEdgeStates && !isZeroB) {
            if (isEdge) {
                // Edge particle: even spacing along the closed loop
                const s = (i / 16) * totalLength;
                const state = getPathState(s);
                const bounceAmp = Math.max(6, 17 - bField * 1.5);
                const x = state.x_path + state.vx * state.bounce * bounceAmp;
                const y = state.y_path + state.vy * state.bounce * bounceAmp;
                return {
                    isEdge: true,
                    s,
                    x_path: state.x_path,
                    y_path: state.y_path,
                    x,
                    y,
                    vx: 0,
                    vy: 0,
                    phase: 0,
                    x0: x,
                    y0: y,
                    trail: [],
                    color: '#f43f5e' // Red for edge states
                };
            } else {
                // Bulk particle: spawn in the middle doing full circular motion
                const x0 = 100 + Math.random() * 600;
                const y0 = 135 + Math.random() * 80;
                const phase = Math.random() * Math.PI * 2;
                const Rc = Math.max(6, 15 - bField * 1.5);
                const x = x0 + Rc * Math.cos(phase);
                const y = y0 + Rc * Math.sin(phase);
                return {
                    isEdge: false,
                    s: 0,
                    x_path: x,
                    y_path: y,
                    x,
                    y,
                    vx: 0,
                    vy: 0,
                    phase,
                    x0,
                    y0,
                    trail: [],
                    color: '#3b82f6' // Blue for bulk states
                };
            }
        } else {
            // Normal mode
            const x = 50 + Math.random() * 700;
            const y = 100 + Math.random() * 150;
            return {
                isEdge: false,
                s: 0,
                x_path: x,
                y_path: y,
                x,
                y,
                vx: 0,
                vy: driftV,
                phase: 0,
                x0: x,
                y0: y,
                trail: [],
                color: '#0891b2' // Cyan for normal mode
            };
        }
    });
};

// ─── Lecture-Style Landau Level Diagram ──────────────────────────────────────
function LandauDiagram({ bField, fillingFactor, isZeroB }) {
    const numLevels = 4;
    const baseRx = isZeroB ? 36 : Math.max(12, 38 - bField * 4);
    const baseRy = isZeroB ? 14 : Math.max(5, 15 - bField * 1.5);
    const deltaE = isZeroB ? '-' : `${(bField * 0.5).toFixed(2)} meV`;
    const nu = isZeroB ? '-' : fillingFactor.toFixed(2);
    const nPhi = isZeroB ? '-' : `${(bField * 2.4).toFixed(1)} \u00d7 10\u00b9\u00b9 cm\u207b\u00b2`;
    const levelColours = ['#e85d04', '#f77f00', '#fcbf49', '#b5c4b1'];
    const filledLevels = isZeroB ? 0 : Math.min(numLevels, Math.ceil(fillingFactor));
    const latticeRows = 4, latticeCols = 5;

    return (
        <div style={{ marginTop: '28px', paddingTop: '22px', borderTop: '1px solid #ddd8ce', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'flex', alignItems: 'center', gap: '7px', margin: 0 }}>
                    <Info size={14} /> Electrons in B-field — Landau Levels
                </h4>
                <div style={{ background: isZeroB ? '#f3f4f6' : 'linear-gradient(135deg,#10b981,#3b82f6)', color: isZeroB ? '#888' : '#fff', borderRadius: '20px', padding: '4px 16px', fontSize: '0.9rem', fontWeight: '800', fontFamily: 'serif', boxShadow: isZeroB ? 'none' : '0 2px 10px rgba(16,185,129,0.3)' }}>
                    ν = {nu}
                </div>
            </div>

            {/* Main 3-column diagram */}
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 190px', gap: '16px', alignItems: 'stretch' }}>

                {/* LEFT: Orbital ellipses SVG */}
                <div style={{ background: '#ffffff', border: '1px solid #ddd8ce', borderRadius: '14px', padding: '12px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.68rem', color: '#555', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>Landau Levels</div>
                    <svg width="184" height="215" viewBox="0 0 184 215">
                        <defs>
                            <marker id="llArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                                <polygon points="0 0, 6 3, 0 6" fill="#777" />
                            </marker>
                            <marker id="llArrowRed" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                                <polygon points="0 0, 6 3, 0 6" fill="#e85d04" />
                            </marker>
                        </defs>
                        {/* B-field arrow */}
                        <line x1="14" y1="200" x2="14" y2="12" stroke="#777" strokeWidth="1.5" markerEnd="url(#llArrow)" />
                        <text x="6" y="210" fontSize="12" fill="#555" fontFamily="serif" fontStyle="italic">B</text>

                        {[0,1,2,3].map(n => {
                            const rx = baseRx * (1 + n * 0.52);
                            const ry = baseRy * (1 + n * 0.48);
                            const cy = 190 - n * 47;
                            const colour = levelColours[n];
                            const filled = n < filledLevels;
                            return (
                                <g key={n}>
                                    {/* depth shadow */}
                                    <ellipse cx={96} cy={cy + 5} rx={rx} ry={ry * 0.35} fill="rgba(0,0,0,0.06)" />
                                    {/* orbit ellipse */}
                                    <ellipse cx={96} cy={cy} rx={rx} ry={ry}
                                        fill={filled ? colour + '44' : colour + '18'}
                                        stroke={colour} strokeWidth={filled ? 2 : 1}
                                        strokeDasharray={filled ? '' : '4 3'} />
                                    {/* spin-down (left) */}
                                    <line x1={96 - rx*0.38} y1={cy + ry*0.5}
                                          x2={96 - rx*0.38} y2={cy - ry*0.5}
                                        stroke={colour} strokeWidth="1.5" opacity={filled ? 1 : 0.3}
                                        markerEnd={filled ? "url(#llArrowRed)" : ""} />
                                    {/* spin-up (right) */}
                                    <line x1={96 + rx*0.38} y1={cy - ry*0.5}
                                          x2={96 + rx*0.38} y2={cy + ry*0.5}
                                        stroke={colour} strokeWidth="1.5" opacity={filled ? 1 : 0.3}
                                        markerEnd={filled ? "url(#llArrowRed)" : ""} />
                                    {/* level label */}
                                    <text x={96 + rx + 5} y={cy + 4} fontSize="10" fill={colour} fontFamily="serif" fontWeight="bold">l={n}</text>
                                </g>
                            );
                        })}
                        {/* cyclotron r annotation */}
                        {!isZeroB && (
                            <g>
                                <line x1={96} y1={190} x2={96 + baseRx} y2={190} stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 2" />
                                <text x={96 + baseRx/2 - 2} y={204} fontSize="9" fill="#3b82f6" fontFamily="serif" textAnchor="middle">r</text>
                            </g>
                        )}
                    </svg>
                </div>

                {/* MIDDLE: Formula block */}
                <div style={{ background: '#ffffff', border: '1px solid #ddd8ce', borderRadius: '14px', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
                    {[
                        { label: 'Energy Quantization', lhs: <span>E<sub>n</sub> = ℏω<sub>c</sub>(n + ½)</span>, rhs: <span>ΔE = <strong style={{color:'#10b981'}}>{deltaE}</strong></span> },
                        { label: 'Flux Quantum', lhs: <span>Φ₀ = h / e</span>, rhs: <strong style={{color:'#10b981'}}>≈ 4.14×10⁻¹⁵ Wb</strong> },
                        { label: 'Degeneracy per Level', lhs: <span>n<sub>Φ</sub> = eB / h</span>, rhs: <strong style={{color:'#3b82f6'}}>{nPhi}</strong> },
                        { label: 'Filling Factor', lhs: <span>ν = n<sub>e</sub> / n<sub>Φ</sub></span>, rhs: <strong style={{color:'#e85d04'}}>{nu}</strong> },
                        { label: 'Magnetic Length', lhs: <span>l<sub>B</sub> = √(ℏ/eB)</span>, rhs: <strong style={{color:'#9333ea'}}>{isZeroB ? '-' : `${(25.6/Math.sqrt(bField)).toFixed(1)} nm`}</strong> },
                        { label: 'Hamiltonian', lhs: <span>H = <span style={{fontFamily:'serif'}}>[(p<sub>x</sub> + eA<sub>x</sub>)<sup>2</sup> + (p<sub>y</sub> + eA<sub>y</sub>)<sup>2</sup>] / 2m + g&thinsp;&mu;<sub>B</sub>&thinsp;B&thinsp;S<sub>z</sub></span></span>, rhs: <span style={{fontFamily:'serif'}}>H = (&Pi;<sub>x</sub><sup>2</sup> + &Pi;<sub>y</sub><sup>2</sup>)/2m + g&mu;<sub>B</sub>B S<sub>z</sub></span> }
                    ].map(({ label, lhs, rhs }, _) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 12px', background: '#fff', borderRadius: '8px', border: '1px solid #ede9e0' }}>
                            <span style={{ fontSize: '0.67rem', color: '#888', minWidth: '128px' }}>{label}</span>
                            <span style={{ fontFamily: 'serif', fontSize: '0.92rem', color: '#1a1a2e', flex: 1, textAlign: 'center' }}>{lhs}</span>
                            <span style={{ fontSize: '0.8rem', color: '#555', minWidth: '110px', textAlign: 'right' }}>{rhs}</span>
                        </div>
                    ))}
                </div>

                {/* RIGHT: Electron spin lattice */}
                <div style={{ background: '#ffffff', border: '1px solid #ddd8ce', borderRadius: '14px', padding: '12px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <div style={{ fontSize: '0.68rem', color: '#555', fontWeight: 'bold', textTransform: 'uppercase' }}>Electron Lattice</div>
                    <svg width="160" height="175" viewBox="0 0 160 175">
                        <defs>
                            <marker id="spinArrow" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
                                <polygon points="0 0, 5 2.5, 0 5" fill="#e85d04" />
                            </marker>
                            <marker id="spinArrowGray" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
                                <polygon points="0 0, 5 2.5, 0 5" fill="#aaa" />
                            </marker>
                        </defs>
                        {Array.from({length: latticeRows}).map((_,row) =>
                            Array.from({length: latticeCols}).map((_,col) => {
                                const cx = 18 + col * 28;
                                const cy = 22 + row * 38;
                                const spinUp = (row + col) % 2 === 0;
                                const filled = !isZeroB && row < filledLevels;
                                const fill = filled ? '#fcbf49' : '#e5e7eb';
                                const stroke = filled ? '#e85d04' : '#bbb';
                                const ay1 = spinUp ? cy + 12 : cy - 12;
                                const ay2 = spinUp ? cy - 12 : cy + 12;
                                return (
                                    <g key={`${row}-${col}`}>
                                        <circle cx={cx} cy={cy} r={10} fill={fill} stroke={stroke} strokeWidth="1.3" />
                                        <line x1={cx} y1={ay1} x2={cx} y2={ay2}
                                            stroke={stroke} strokeWidth="1.5"
                                            markerEnd={filled ? "url(#spinArrow)" : "url(#spinArrowGray)"} />
                                        <text x={cx} y={cy+3.5} fontSize="7" fill={filled ? '#7c2d12':'#aaa'} textAnchor="middle" fontFamily="sans-serif">e⁻</text>
                                    </g>
                                );
                            })
                        )}
                        {Array.from({length: latticeRows}).map((_,row) => (
                            <text key={row} x={152} y={22+row*38+4} fontSize="9" fill={!isZeroB && row < filledLevels ? '#e85d04':'#ccc'} fontFamily="serif">l={row}</text>
                        ))}
                        <line x1={55} y1={166} x2={105} y2={166} stroke="#888" strokeWidth="0.8" />
                        <text x={80} y={174} fontSize="9" fill="#666" fontFamily="serif" textAnchor="middle">gμ₀B</text>
                    </svg>
                    <div style={{ fontSize: '0.68rem', color: '#888', textAlign: 'center', lineHeight: 1.4 }}>
                        {isZeroB ? 'No quantization at B = 0' : <span>Filled levels: <strong style={{color:'#e85d04'}}>{filledLevels}</strong> / {numLevels}</span>}
                    </div>
                </div>

            </div>

            {/* ── Bottom row: E-vs-k graph + extra formulas ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '4px' }}>

                {/* E-vs-k: flat equally-spaced Landau levels */}
                <div style={{ background: '#ffffff', border: '1px solid #ddd8ce', borderRadius: '14px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#555', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        Energy vs. Wave-vector k
                    </div>
                    <svg width="100%" height="180" viewBox="0 0 320 180" style={{ overflow: 'visible' }}>
                        <defs>
                            <marker id="axArrow" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
                                <polygon points="0 0, 7 3.5, 0 7" fill="#555" />
                            </marker>
                        </defs>
                        {/* Axes */}
                        <line x1="40" y1="160" x2="300" y2="160" stroke="#555" strokeWidth="1.4" markerEnd="url(#axArrow)" />
                        <line x1="40" y1="160" x2="40"  y2="10"  stroke="#555" strokeWidth="1.4" markerEnd="url(#axArrow)" />
                        <text x="305" y="164" fontSize="11" fill="#555" fontFamily="serif" fontStyle="italic">k</text>
                        <text x="43"  y="8"   fontSize="11" fill="#555" fontFamily="serif" fontStyle="italic">E</text>

                        {/* Equally-spaced flat energy levels */}
                        {[0,1,2,3].map(n => {
                            const y = 145 - n * 33;
                            const colour = levelColours[n];
                            const filled = !isZeroB && n < filledLevels;
                            const En = isZeroB ? '?' : `${(bField * 0.5 * (n + 0.5)).toFixed(2)} meV`;
                            return (
                                <g key={n}>
                                    {/* flat line spanning full k range */}
                                    <line x1="50" y1={y} x2="290" y2={y}
                                        stroke={colour}
                                        strokeWidth={filled ? 2.5 : 1.4}
                                        strokeDasharray={filled ? '' : '6 3'}
                                        opacity={filled ? 1 : 0.5} />
                                    {/* level label */}
                                    <text x="14" y={y + 4} fontSize="10" fill={colour} fontFamily="serif" fontWeight="bold">n={n}</text>
                                    {/* energy value */}
                                    <text x="292" y={y + 4} fontSize="8.5" fill={colour} fontFamily="serif">{En}</text>
                                </g>
                            );
                        })}

                        {/* spacing brace annotation */}
                        {!isZeroB && (
                            <g>
                                <line x1="32" y1="145" x2="32" y2="112" stroke="#aaa" strokeWidth="1" />
                                <line x1="29" y1="145" x2="35" y2="145" stroke="#aaa" strokeWidth="1" />
                                <line x1="29" y1="112" x2="35" y2="112" stroke="#aaa" strokeWidth="1" />
                                <text x="2" y="130" fontSize="8" fill="#888" fontFamily="serif">ℏω_c</text>
                            </g>
                        )}
                    </svg>
                    {/* Note: E independent of k */}
                    <div style={{ background: 'linear-gradient(90deg,#fef9c3,#fff)', border: '1px solid #fde68a', borderRadius: '8px', padding: '7px 10px', fontSize: '0.72rem', color: '#92400e', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                        <span style={{ fontWeight: '800', fontSize: '0.9rem', lineHeight: 1 }}>★</span>
                        <span><strong>E<sub>n</sub> is independent of k</strong> — each Landau level is a flat, dispersion-free line. The degeneracy comes from the many k-states that all map to the same energy ℏω<sub>c</sub>(n + ½).</span>
                    </div>
                </div>

                {/* Extra formulas: orbital centre, total states, radius */}
                <div style={{ background: '#ffffff', border: '1px solid #ddd8ce', borderRadius: '14px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: '#555', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '2px' }}>
                        Key Landau-Level Relations
                    </div>
                    {[
                        {
                            label: 'Orbital Centre (guiding centre)',
                            formula: <span>x<sub>0</sub> = k<sub>y</sub> l<sub>B</sub>²</span>,
                            note: 'Centre of cyclotron orbit shifts with k_y',
                            colour: '#0891b2',
                        },
                        {
                            label: 'Total States per Level',
                            formula: <span>N = eBA / h = A / (2π l<sub>B</sub>²)</span>,
                            note: isZeroB
                                ? 'N → 0 at B = 0'
                                : `≈ ${((bField * 2.4)).toFixed(1)} × 10¹¹ states / cm²`,
                            colour: '#10b981',
                        },
                        {
                            label: 'Cyclotron Radius (nth level)',
                            formula: <span>R<sub>n</sub> = l<sub>B</sub> √(2n + 1)</span>,
                            note: isZeroB
                                ? 'l_B → ∞ at B = 0'
                                : `l_B = ${(25.6/Math.sqrt(bField)).toFixed(1)} nm  →  R₀ = ${(25.6/Math.sqrt(bField)).toFixed(1)} nm`,
                            colour: '#9333ea',
                        },
                    ].map(({ label, formula, note, colour }, i) => (
                        <div key={i} style={{ padding: '9px 12px', background: i%2===0 ? '#faf8f4' : '#fff', borderRadius: '10px', border: `1px solid ${colour}33` }}>
                            <div style={{ fontSize: '0.66rem', color: '#888', marginBottom: '4px' }}>{label}</div>
                            <div style={{ fontFamily: 'serif', fontSize: '1rem', color: '#1a1a2e', marginBottom: '4px' }}>{formula}</div>
                            <div style={{ fontSize: '0.72rem', color: colour, fontWeight: '600' }}>{note}</div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default function HallEffectSim({ 
    bField, 
    chernNumber, 
    disorderStrength, 
    temperature = 0.1, 
    showEdgeStates = true, 
    resetTrigger,
    density = 2.0,
    fillingFactor = 0.0
}) {
    const canvasRef = useRef(null);
    const isZeroB = bField < 0.05;
    const [isPlaying, setIsPlaying] = useState(true);
    const [hallFieldY, setHallFieldY] = useState(0); 
    const timeRef = useRef(0);
    
    const dt = 0.45;
    const E_FIELD_X = 0.07; 
    const TAU = 12.0; 

    const particles = useRef(generateInitialParticles(bField, showEdgeStates));

    const initParticles = useCallback(() => {
        particles.current = generateInitialParticles(bField, showEdgeStates);
    }, [bField, showEdgeStates]);

    const resetLab = () => {
        setHallFieldY(0);
        initParticles();
    };

    useEffect(() => {
        if (resetTrigger > 0) {
            setHallFieldY(0);
            particles.current = generateInitialParticles(bField, showEdgeStates);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetTrigger]);

    useEffect(() => {
        initParticles();
    }, [showEdgeStates]);

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
        return { fx, fy };
    }, [disorderStrength]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const draw = () => {
            if (isPlaying) {
                timeRef.current += 0.05;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barW = canvas.width - 100, barH = 160;
            const barBox = { x: 50, y: (canvas.height - barH) / 2, w: barW, h: barH };
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.02)'; ctx.fillRect(barBox.x, barBox.y, barBox.w, barBox.h);
            ctx.strokeStyle = '#ddd8ce'; ctx.strokeRect(barBox.x, barBox.y, barBox.w, barBox.h);

            ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
            ctx.fillRect(0, barBox.y, 50, barH); ctx.fillRect(canvas.width - 50, barBox.y, 50, barH);
            const px1 = barBox.x + barBox.w * 0.3, px2 = barBox.x + barBox.w * 0.7;
            const pw = 30, ph = 40;
            ctx.fillRect(px1 - pw/2, barBox.y - ph, pw, ph); ctx.fillRect(px2 - pw/2, barBox.y - ph, pw, ph);
            ctx.fillRect(px1 - pw/2, barBox.y + barH, pw, ph); ctx.fillRect(px2 - pw/2, barBox.y + barH, pw, ph);



            let netDisplacementY = 0;
            const isZeroB = bField < 0.05;
            const B = bField * 0.45;
            const EX = isZeroB ? 0.0 : E_FIELD_X;
            const EY = isZeroB ? 0.0 : hallFieldY;
            const noise = isZeroB ? 4.5 : temperature * 1.5;

            particles.current.forEach((p) => {
                if (isPlaying) {
                    if (showEdgeStates && !isZeroB) {
                        if (p.isEdge) {
                            // Edge state: skipping orbits along boundary
                            const edgeSpeed = 0.8 + bField * 0.8;
                            p.s = (p.s + edgeSpeed * dt) % totalLength;
                            
                            const state = getPathState(p.s);
                            const bounceAmp = Math.max(6, 17 - bField * 1.5);
                            
                            p.x = state.x_path + state.vx * state.bounce * bounceAmp;
                            p.y = state.y_path + state.vy * state.bounce * bounceAmp;
                            
                            p.x_path = state.x_path;
                            p.y_path = state.y_path;
                        } else {
                            // Bulk state: localized full cyclotron circle
                            const bulkRotationSpeed = 0.03 + bField * 0.03;
                            p.phase = (p.phase + bulkRotationSpeed) % (Math.PI * 2);
                            const Rc = Math.max(6, 15 - bField * 1.5);
                            p.x = p.x0 + Rc * Math.cos(p.phase);
                            p.y = p.y0 + Rc * Math.sin(p.phase);
                            
                            p.x_path = p.x;
                            p.y_path = p.y;
                        }
                    } else {
                        const { fx, fy } = getPotentialForce(p.x, p.y);
                        const ax = (EX - p.vy*B + fx + (Math.random()-0.5)*noise) - p.vx/TAU;
                        const ay = (EY + p.vx*B + fy + (Math.random()-0.5)*noise) - p.vy/TAU;
                        p.vx += ax * dt; p.vy += ay * dt;
                        p.x += p.vx * dt; p.y += p.vy * dt;

                        p.x_path = p.x;
                        p.y_path = p.y;
                        p.x0 = p.x;
                        p.y0 = p.y;

                        if (p.y < barBox.y + 5 || p.y > barBox.y + barBox.h - 5) {
                            p.vy *= -0.85; p.y = p.y < barBox.y + 5 ? barBox.y + 5 : barBox.y + barBox.h - 5;
                        }
                        if (p.x < 5 || p.x > canvas.width - 5) {
                            p.x = p.x < 5 ? canvas.width - 10 : 10; p.trail = [];
                        }
                    }

                    p.trail.push({ x: p.x, y: p.y }); if (p.trail.length > 20) p.trail.shift();
                }
                netDisplacementY += (p.y - canvas.height/2) / 8000;

                ctx.beginPath(); p.trail.forEach((t, i) => {
                    ctx.globalAlpha = (i / p.trail.length) * 0.45; ctx.strokeStyle = p.color;
                    if (i === 0) ctx.moveTo(t.x, t.y); else ctx.lineTo(t.x, t.y);
                }); ctx.stroke();
                ctx.globalAlpha = 1;
                // Outer Glow
                ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
                let glowStyle = 'rgba(6, 182, 212, 0.15)';
                if (p.color === '#f43f5e') glowStyle = 'rgba(244, 63, 94, 0.2)';
                else if (p.color === '#3b82f6') glowStyle = 'rgba(59, 130, 246, 0.2)';
                ctx.fillStyle = glowStyle; ctx.fill();

                // Core Circle
                ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
                ctx.fillStyle = p.color; ctx.fill();
                let strokeStyle = '#06b6d4';
                if (p.color === '#f43f5e') strokeStyle = '#fda4af';
                else if (p.color === '#3b82f6') strokeStyle = '#93c5fd';
                ctx.strokeStyle = strokeStyle; ctx.lineWidth = 1; ctx.stroke();

                // Minus sign
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 8px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('-', p.x, p.y - 0.5);
            });

            if (isPlaying) {
                setHallFieldY(prev => prev + ((-netDisplacementY * 0.2) - prev) * 0.1);
            }

            animationFrameId = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(animationFrameId);
    }, [isPlaying, bField, chernNumber, temperature, getPotentialForce, showEdgeStates]);

    return (
        <div style={{ position: 'relative', width: '100%', cursor: 'default' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ fontSize: '0.9rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                    <Zap size={16} /> Hall Bar Transport Simulation
                </h3>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={(e) => { e.stopPropagation(); resetLab(); }} style={{ background: 'none', border: 'none', color: '#1a1a2e', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <RotateCcw size={14} /> RESET LAB
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }} style={{ background: 'none', border: 'none', color: '#1a1a2e', cursor: 'pointer' }}>
                        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                </div>
            </div>
            <canvas ref={canvasRef} width={800} height={350} style={{ width: '100%', height: '380px', background: '#faf8f4', borderRadius: '16px', border: '1px solid #ddd8ce' }} />

            {/* Lecture-Style Landau Level Visual Diagram */}
            <LandauDiagram bField={bField} fillingFactor={fillingFactor} chernNumber={chernNumber} density={density} isZeroB={isZeroB} />
        </div>
    );
}
