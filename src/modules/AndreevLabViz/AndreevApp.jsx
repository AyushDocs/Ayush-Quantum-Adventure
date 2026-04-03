import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWindowSize, getEffectiveWidth } from '../../hooks/useWindowSize';
import { useZoomLevel } from '../../hooks/useZoomLevel';
import { ArrowRightLeft, Split, Info, Activity } from 'lucide-react';
import AndreevSim from './Components/AndreevSim';
import CrossedAndreevSim from './Components/CrossedAndreevSim';

export default function AndreevApp() {
    const { width } = useWindowSize();
    const effectiveWidth = getEffectiveWidth(width);
    const isMobile = effectiveWidth < 1024;
    const navigate = useNavigate();
    const zoomLevel = useZoomLevel();
    const scale = zoomLevel / 100;

    const [energy, setEnergy] = useState(0.5); // relative to gap, so 0.5 means < Delta
    const [barrierWidth, setBarrierWidth] = useState(1.0); // For CPS
    const [barrierZ, setBarrierZ] = useState(0.0); // BTK Z parameter (transparency)
    const [gap] = useState(1.0);

    const themeColor = '#10b981';

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
                overflowY: isMobile ? 'visible' : 'auto',
                padding: isMobile ? '20px' : '40px',
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? '20px' : '40px',
                height: isMobile ? 'auto' : '100%',
                flexShrink: 0
            }}>
                {/* Header */}
                <div>
                    <h1 style={{ fontSize: isMobile ? '1.5rem' : '2.5rem', fontWeight: '900', letterSpacing: '-1.5px', marginBottom: '10px' }}>
                        ANDREEV <span style={{ color: themeColor }}>LAB</span>
                    </h1>
                    <p style={{ color: '#888', fontSize: '1rem', maxWidth: '800px', lineHeight: '1.6' }}>
                       Explore the boundary between normal metals and superconductors: <span style={{ color: themeColor, fontWeight: 'bold' }}>Andreev Reflection</span> and <span style={{ color: themeColor, fontWeight: 'bold' }}>Cooper Pair Splitting</span> (Crossed Andreev Reflection).
                    </p>
                </div>

                {/* Simulations */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '30px' }}>
                    <AndreevSim energy={energy} gap={gap} barrierZ={barrierZ} themeColor={themeColor} />
                    <CrossedAndreevSim width={barrierWidth} gap={gap} themeColor={themeColor} />
                </div>

                {/* Theory Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '20px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ color: themeColor, display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <ArrowRightLeft size={20} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Andreev Reflection</span>
                        </div>
                        <p style={{ color: '#888', fontSize: '0.85rem', lineHeight: '1.6' }}>
                           An incident electron with energy E &lt; Δ cannot enter the superconductor as a single particle. Instead, it reflects as a <span style={{ color: themeColor, fontWeight: 'bold' }}>hole</span> of opposite momentum and spin, creating a <span style={{ color: themeColor, fontWeight: 'bold' }}>Cooper pair</span> in the superconductor. This process transfers charge 2e across the interface.
                        </p>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ color: themeColor, display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <Info size={20} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>The BTK Condition</span>
                        </div>
                        <p style={{ color: '#888', fontSize: '0.85rem', lineHeight: '1.6' }}>
                           <span style={{ color: themeColor, fontWeight: 'bold' }}>Normal tunneling</span> and <span style={{ color: themeColor, fontWeight: 'bold' }}>Andreev reflection</span> are competing processes at the interface. For Andreev reflection to dominate over normal elastic reflection, the <span style={{ color: themeColor, fontWeight: 'bold' }}>interface barrier transparency must be extremely high</span> (BTK parameter Z → 0). If a high insulating barrier exists (Z ≫ 1), normal reflection takes over.
                        </p>
                    </div>

                    <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '25px', borderRadius: '24px', border: `1px solid rgba(16, 185, 129, 0.2)` }}>
                        <div style={{ color: themeColor, display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <Split size={20} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Cooper Pair Splitting</span>
                        </div>
                        <p style={{ color: '#888', fontSize: '0.85rem', lineHeight: '1.6' }}>
                           Also known as <span style={{ color: themeColor, fontWeight: 'bold' }}>Crossed Andreev Reflection (CAR)</span>. In an N-S-N junction, if the superconductor width is comparable to the coherence length ξ, a Cooper pair can split. This emits two <span style={{ color: themeColor, fontWeight: 'bold' }}>spatially separated, spin-entangled electrons</span> into the normal leads—a crucial mechanism for quantum entanglement generation.
                        </p>
                    </div>
                </div>

                {/* Continue Navigation */}
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                        onClick={() => navigate('/learn/majorana_fermions')}
                        style={{ 
                            background: '#f97316', 
                            border: 'none', 
                            color: '#000', 
                            padding: '12px 24px', 
                            borderRadius: '12px', 
                            fontSize: '0.8rem', 
                            fontWeight: '900',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)'
                        }}
                    >
                        NEXT: MAJORANA ZERO MODES →
                    </button>
                </div>
            </div>

            {/* Sidebar Controls */}
            <div className="custom-scrollbar" style={{ 
                width: isMobile ? '100%' : (effectiveWidth < 1300 ? '300px' : '360px'),
                background: '#0a0a0a', 
                borderLeft: isMobile ? 'none' : '1px solid #1a1a1a', 
                padding: isMobile ? '20px' : (effectiveWidth < 1300 ? '24px' : '32px'), 
                overflowY: isMobile ? 'visible' : 'auto',
                height: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '40px',
                flexShrink: 0
            }}>
                <div style={{ 
                    background: 'rgba(16, 185, 129, 0.1)', 
                    padding: '24px', 
                    borderRadius: '24px', 
                    border: `1px solid ${themeColor}`,
                    textAlign: 'center'
                }}>
                    <Activity size={24} color={themeColor} style={{ marginBottom: '10px' }} />
                    <h3 style={{ fontSize: '1.2rem', color: themeColor, textTransform: 'uppercase' }}>Control Panel</h3>
                    <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '10px' }}>Tune the scattering parameters</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#aaa', fontSize: '0.75rem', fontWeight: 'bold' }}>Incident Energy (E/Δ)</span>
                            <span style={{ color: themeColor, fontSize: '0.9rem', fontWeight: '900' }}>{energy.toFixed(2)}</span>
                        </div>
                        <input 
                            type="range" min="0" max="2.0" step="0.05" 
                            value={energy} onChange={(e) => setEnergy(parseFloat(e.target.value))} 
                            style={{ width: '100%', height: '4px', appearance: 'none', background: '#333', accentColor: themeColor }}
                        />
                        <span style={{ color: '#555', fontSize: '0.65rem' }}>E &gt; 1: Quasiparticle Transmission</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#aaa', fontSize: '0.75rem', fontWeight: 'bold' }}>Interface Opacity (Z)</span>
                            <span style={{ color: themeColor, fontSize: '0.9rem', fontWeight: '900' }}>{barrierZ.toFixed(1)}</span>
                        </div>
                        <input 
                            type="range" min="0" max="3.0" step="0.1" 
                            value={barrierZ} onChange={(e) => setBarrierZ(parseFloat(e.target.value))} 
                            style={{ width: '100%', height: '4px', appearance: 'none', background: '#333', accentColor: themeColor }}
                        />
                        <span style={{ color: '#555', fontSize: '0.65rem' }}>Z=0 (Transparent) vs Z&gt;1 (Tunneling)</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#aaa', fontSize: '0.75rem', fontWeight: 'bold' }}>Barrier Width (N-S-N)</span>
                            <span style={{ color: themeColor, fontSize: '0.9rem', fontWeight: '900' }}>{barrierWidth.toFixed(2)} ξ</span>
                        </div>
                        <input 
                            type="range" min="0.2" max="3.0" step="0.1" 
                            value={barrierWidth} onChange={(e) => setBarrierWidth(parseFloat(e.target.value))} 
                            style={{ width: '100%', height: '4px', appearance: 'none', background: '#333', accentColor: themeColor }}
                        />
                        <span style={{ color: '#555', fontSize: '0.65rem' }}>Width compared to coherence length ξ</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
