import React, { useState } from 'react';
import { useWindowSize, getEffectiveWidth } from '../../hooks/useWindowSize';
import { useZoomLevel } from '../../hooks/useZoomLevel';
import { Activity, CircleOff } from 'lucide-react';
import MajoranaWireSim from './Components/MajoranaWireSim';
import MajoranaBraidingSim from './Components/MajoranaBraidingSim';
import MajoranaDOSPlot from './Components/MajoranaDOSPlot';

export default function MajoranaApp() {
    const { width } = useWindowSize();
    const effectiveWidth = getEffectiveWidth(width);
    const isMobile = effectiveWidth < 900;
    const isCompact = effectiveWidth < 1200;
    const zoomLevel = useZoomLevel();
    const scale = zoomLevel / 100;

    const [zeeman, setZeeman] = useState(0.5);
    const [chemicalPotential, setChemicalPotential] = useState(0.0);
    const [gap] = useState(1.0);

    const themeColor = '#f97316';

    // Topological phase condition: B > sqrt(Delta^2 + mu^2)
    const isTopological = zeeman > Math.sqrt(gap * gap + chemicalPotential * chemicalPotential);

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row', 
            overflow: 'hidden',
            background: '#050505',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: `${100/scale}%`,
            height: `${100/scale}%`,
        }}>
            {/* Main Content Area */}
            <div className="custom-scrollbar" style={{ 
                flex: 1, 
                overflowY: 'auto',
                padding: isMobile ? '16px' : isCompact ? '24px' : '40px',
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? '20px' : '30px',
                minWidth: 0
            }}>
                {/* Header */}
                <div>
                    <h1 style={{ 
                        fontSize: 'clamp(1.2rem, 2.4vw, 2.2rem)', 
                        fontWeight: '900', 
                        letterSpacing: '-0.5px', 
                        marginBottom: '10px',
                        lineHeight: 1.1
                    }}>
                        MAJORANA <span style={{ color: themeColor }}>FERMIONS</span>
                    </h1>
                    <p style={{ color: '#888', fontSize: 'clamp(0.75rem, 1.1vw, 0.95rem)', maxWidth: '700px', lineHeight: '1.6' }}>
                       Enter the realm of topological superconductivity. Tune the Zeeman field and chemical potential to isolate half-fermions: <span style={{ color: themeColor, fontWeight: 'bold' }}>Majorana Zero Modes</span>, the building blocks for fault-tolerant quantum computing via <span style={{ color: themeColor, fontWeight: 'bold' }}>Non-Abelian Braiding</span>.
                    </p>
                </div>

                {/* Status Banner */}
                <div style={{ 
                    padding: isCompact ? '14px 18px' : '18px 24px',
                    borderRadius: '14px', 
                    background: isTopological ? 'rgba(249, 115, 22, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${isTopological ? themeColor : '#333'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ 
                        width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0,
                        background: isTopological ? themeColor : '#555',
                        boxShadow: isTopological ? `0 0 10px ${themeColor}` : 'none'
                    }} />
                    <div>
                        <h4 style={{ margin: 0, fontSize: 'clamp(0.75rem, 1.1vw, 1rem)', color: isTopological ? themeColor : '#aaa', fontWeight: 700 }}>
                            {isTopological ? 'TOPOLOGICAL PHASE (Majorana Modes Active)' : 'TRIVIAL PHASE (No Zero Modes)'}
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.73rem', color: '#888', marginTop: '3px' }}>
                            Condition: B &gt; √(Δ² + μ²)
                        </p>
                    </div>
                </div>

                {/* Simulations Row 1: Wire and DOS */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr', gap: '20px' }}>
                    <MajoranaWireSim zeeman={zeeman} mu={chemicalPotential} gap={gap} isTop={isTopological} themeColor={themeColor} />
                    <MajoranaDOSPlot isTop={isTopological} themeColor={themeColor} />
                </div>

                {/* Simulations Row 2: Braiding */}
                <div>
                     <MajoranaBraidingSim themeColor={themeColor} />
                </div>
            </div>

            {/* Sidebar Controls */}
            <div className="custom-scrollbar" style={{ 
                width: isMobile ? '100%' : (effectiveWidth < 1300 ? '240px' : '300px'),
                background: '#0a0a0a', 
                borderLeft: isMobile ? 'none' : '1px solid #1a1a1a', 
                padding: isMobile ? '20px' : (effectiveWidth < 1300 ? '16px' : '24px'),
                overflowY: 'auto',
                height: isMobile ? 'auto' : '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                flexShrink: 0
            }}>
                <div style={{ 
                    background: 'rgba(249, 115, 22, 0.1)', 
                    padding: '16px', 
                    borderRadius: '16px', 
                    border: `1px solid ${themeColor}`,
                    textAlign: 'center'
                }}>
                    <Activity size={20} color={themeColor} style={{ marginBottom: '8px' }} />
                    <h3 style={{ fontSize: '0.95rem', color: themeColor, textTransform: 'uppercase', margin: 0 }}>Control Panel</h3>
                    <p style={{ fontSize: '0.7rem', color: '#888', marginTop: '8px' }}>Drive the phase transition</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Zeeman Field Slider */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#aaa', fontSize: '0.72rem', fontWeight: 'bold' }}>Zeeman Field (B/Δ)</span>
                            <span style={{ color: themeColor, fontSize: '0.85rem', fontWeight: '900' }}>{zeeman.toFixed(2)}</span>
                        </div>
                        <input 
                            type="range" min="0" max="3.0" step="0.05" 
                            value={zeeman} onChange={(e) => setZeeman(parseFloat(e.target.value))} 
                            style={{ width: '100%', height: '4px', appearance: 'none', background: '#333', accentColor: themeColor }}
                        />
                        <span style={{ color: '#555', fontSize: '0.62rem' }}>Magnetic field splitting spin bands.</span>
                    </div>

                    {/* Chemical Potential Slider */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#aaa', fontSize: '0.72rem', fontWeight: 'bold' }}>Chemical Potential (μ/Δ)</span>
                            <span style={{ color: themeColor, fontSize: '0.85rem', fontWeight: '900' }}>{chemicalPotential.toFixed(2)}</span>
                        </div>
                        <input 
                            type="range" min="0" max="2.0" step="0.05" 
                            value={chemicalPotential} onChange={(e) => setChemicalPotential(parseFloat(e.target.value))} 
                            style={{ width: '100%', height: '4px', appearance: 'none', background: '#333', accentColor: themeColor }}
                        />
                        <span style={{ color: '#555', fontSize: '0.62rem' }}>Doping level of the nanowire.</span>
                    </div>

                </div>

                <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc', marginBottom: '8px' }}>
                        <CircleOff size={14} />
                        <strong style={{ fontSize: '0.75rem' }}>Majorana Property</strong>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: '#888', lineHeight: '1.5', margin: 0 }}>
                        A Majorana fermion is its own antiparticle (γ = γ†). Creating one requires zero energy, producing a distinct peak at E = 0 in the density of states.
                    </p>
                </div>
            </div>
        </div>
    );
}
