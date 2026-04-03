import React, { useState } from 'react';
import { useWindowSize, getEffectiveWidth } from '../../hooks/useWindowSize';
import { useZoomLevel } from '../../hooks/useZoomLevel';
import { Compass, Grid, Activity } from 'lucide-react';
import CrystalLatticeSim from './Components/CrystalLatticeSim';
import AltermagnetBandsPlot from './Components/AltermagnetBandsPlot';

export default function AltermagnetApp() {
    const { width } = useWindowSize();
    // Responsive breakpoints — handles 150% zoom gracefully
    const effectiveWidth = getEffectiveWidth(width);
    const isMobile = effectiveWidth < 900;
    const isCompact = effectiveWidth < 1200;
    const zoomLevel = useZoomLevel();
    const scale = zoomLevel / 100;

    const [isAltermagnet, setIsAltermagnet] = useState(true);
    const themeColor = '#d946ef';

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
                minWidth: 0 // prevents flex overflow
            }}>
                {/* Header */}
                <div>
                    <h1 style={{ 
                        fontSize: 'clamp(1.1rem, 2.2vw, 2rem)', 
                        fontWeight: '900', 
                        letterSpacing: '-0.5px', 
                        marginBottom: '10px',
                        lineHeight: 1.1,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        ALTERMAGNETISM <span style={{ color: themeColor }}>EXPLORER</span>
                    </h1>
                    <p style={{ color: '#888', fontSize: 'clamp(0.75rem, 1.1vw, 0.9rem)', maxWidth: '700px', lineHeight: '1.6' }}>
                        The third class of collinear magnets: <span style={{ color: themeColor, fontWeight: 'bold' }}>Altermagnets</span> combine 
                        zero net magnetization with massive momentum-dependent spin splitting — driven by crystal rotation symmetry.
                    </p>
                </div>

                {/* Phase Toggle Banner */}
                <div style={{ 
                    padding: isCompact ? '14px 18px' : '18px 24px',
                    borderRadius: '14px', 
                    background: isAltermagnet ? 'rgba(217, 70, 239, 0.1)' : 'rgba(96, 165, 250, 0.1)',
                    border: `1px solid ${isAltermagnet ? themeColor : '#60a5fa'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '180px' }}>
                        <div style={{ 
                            width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0,
                            background: isAltermagnet ? themeColor : '#60a5fa',
                            boxShadow: `0 0 8px ${isAltermagnet ? themeColor : '#60a5fa'}`
                        }} />
                        <div>
                            <h4 style={{ margin: 0, fontSize: 'clamp(0.75rem, 1.1vw, 1rem)', color: isAltermagnet ? themeColor : '#60a5fa', fontWeight: 700 }}>
                                {isAltermagnet ? 'ALTERMAGNET PHASE (e.g., RuO₂)' : 'CONVENTIONAL ANTIFERROMAGNET'}
                            </h4>
                            <p style={{ margin: 0, fontSize: '0.73rem', color: '#888', marginTop: '3px' }}>
                                {isAltermagnet 
                                    ? 'Rotational symmetry connects opposite spins. Spin bands split.' 
                                    : 'Translational/Inversion symmetry. Spin bands degenerate.'}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsAltermagnet(!isAltermagnet)}
                        style={{
                            background: isAltermagnet ? themeColor : '#60a5fa',
                            border: 'none',
                            padding: '9px 18px',
                            borderRadius: '8px',
                            color: '#fff',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: '0.78rem',
                            whiteSpace: 'nowrap',
                            flexShrink: 0
                        }}
                    >
                        SWITCH PHASE
                    </button>
                </div>

                {/* Simulations Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' }}>
                    <CrystalLatticeSim isAlter={isAltermagnet} themeColor={isAltermagnet ? themeColor : '#60a5fa'} />
                    <AltermagnetBandsPlot isAlter={isAltermagnet} themeColor={isAltermagnet ? themeColor : '#60a5fa'} />
                </div>

                {/* Theory Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ color: themeColor, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <Grid size={18} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Crystal Symmetry</span>
                        </div>
                        <p style={{ color: '#888', fontSize: '0.83rem', lineHeight: '1.6', margin: 0 }}>
                            In a standard antiferromagnet, opposite-spin sublattices are connected by <span style={{ color: themeColor, fontWeight: 'bold' }}>translation</span> or <span style={{ color: themeColor, fontWeight: 'bold' }}>inversion</span>, forcing spin-band degeneracy everywhere in momentum space. In an <span style={{ color: themeColor, fontWeight: 'bold' }}>altermagnet</span>, they are instead connected by a <span style={{ color: themeColor, fontWeight: 'bold' }}>crystalline rotation</span> (e.g. 90°), breaking this protection.
                        </p>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ color: themeColor, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <Activity size={18} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>d-Wave Spin Splitting</span>
                        </div>
                        <p style={{ color: '#888', fontSize: '0.83rem', lineHeight: '1.6', margin: 0 }}>
                            The rotational symmetry imprints a <span style={{ color: themeColor, fontWeight: 'bold' }}>d-wave pattern</span> onto the spin-resolved bands: spin-up is lower energy along k<sub>x</sub>, and the splitting reverses sign along k<sub>y</sub>. Net magnetization is still exactly zero, but the spin texture in k-space is non-trivial.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Info Sidebar — hidden on compact/mobile */}
            {!isMobile && (
                <div className="custom-scrollbar" style={{ 
                    width: isCompact ? (effectiveWidth < 1300 ? '200px' : '220px') : '240px',
                    background: '#0a0a0a', 
                    borderLeft: '1px solid #1a1a1a', 
                    padding: effectiveWidth < 1300 ? '16px 12px' : '20px 16px',
                    overflowY: 'auto',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    flexShrink: 0
                }}>
                    <div style={{ 
                        background: 'rgba(217, 70, 239, 0.1)', 
                        padding: '14px 12px', 
                        borderRadius: '14px', 
                        border: `1px solid ${themeColor}`,
                        textAlign: 'center'
                    }}>
                        <Compass size={18} color={themeColor} style={{ marginBottom: '6px' }} />
                        <h3 style={{ fontSize: '0.85rem', color: themeColor, textTransform: 'uppercase', margin: 0 }}>Spintronics</h3>
                        <p style={{ fontSize: '0.68rem', color: '#888', marginTop: '6px', lineHeight: 1.4 }}>Best of both worlds for next-gen devices.</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ padding: '12px', background: '#111', borderRadius: '8px', borderLeft: `3px solid #3b82f6` }}>
                            <h5 style={{ margin: '0 0 4px', color: '#fff', fontSize: '0.75rem' }}>Antiferromagnet-like</h5>
                            <p style={{ margin: 0, color: '#888', fontSize: '0.68rem', lineHeight: 1.4 }}>Zero net magnetization, no stray fields, ultra-fast THz dynamics.</p>
                        </div>

                        <div style={{ padding: '12px', background: '#111', borderRadius: '8px', borderLeft: `3px solid #ef4444` }}>
                            <h5 style={{ margin: '0 0 4px', color: '#fff', fontSize: '0.75rem' }}>Ferromagnet-like</h5>
                            <p style={{ margin: 0, color: '#888', fontSize: '0.68rem', lineHeight: 1.4 }}>Efficient spin currents without spin-orbit coupling materials.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
