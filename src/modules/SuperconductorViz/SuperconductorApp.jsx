import { useWindowSize, getEffectiveWidth } from '../../hooks/useWindowSize';
import { useZoomLevel } from '../../hooks/useZoomLevel';
import { useNavigate } from 'react-router-dom';
import { useSuperconductorState } from './useSuperconductorState';
import MeissnerLab from './Components/MeissnerLab';
import CooperPairViz from './Components/CooperPairViz';
import BCSGapPlot from './Components/BCSGapPlot';
import BCSDispersionPlot from './Components/BCSDispersionPlot';
import SpecificHeatPlot from './Components/SpecificHeatPlot';
import { Thermometer, Zap, Shield, RotateCcw, Info, Magnet } from 'lucide-react';

export default function SuperconductorApp() {
    const { width } = useWindowSize();
    const navigate = useNavigate();
    const state = useSuperconductorState();
    const effectiveWidth = getEffectiveWidth(width);
    const isMobile = effectiveWidth < 1024;
    const zoomLevel = useZoomLevel();
    const scale = zoomLevel / 100;

    const themeColor = state.isSuper ? '#22d3ee' : '#f43f5e';

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
                padding: isMobile ? '20px' : '40px',
                display: 'flex',
                flexDirection: 'column',
                gap: '40px'
            }}>
                {/* Header */}
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1.5px', marginBottom: '10px' }}>
                        SUPERCONDUCTIVITY <span style={{ color: themeColor }}>LAB</span>
                    </h1>
                    <p style={{ color: '#888', fontSize: '1rem', maxWidth: '800px', lineHeight: '1.6' }}>
                       Exploring the zero-resistance state, the BCS Cooper pair mechanism, and the **Meissner Effect** in quantum materials.
                    </p>
                </div>

                {/* Top Row: Cooper Pair Mechanism */}
                <CooperPairViz temp={state.temp} gap={state.gap} isSuper={state.isSuper} />

                {/* Middle Row: Meissner & Transition Plots */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: '30px' }}>
                    <MeissnerLab 
                        temp={state.temp} 
                        field={state.field} 
                        expulsion={state.expulsion} 
                        isSuper={state.isSuper} 
                        isVortex={state.isVortexState}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        <BCSGapPlot gap={state.gap} isSuper={state.isSuper} />
                        <BCSDispersionPlot gap={state.gap} isSuper={state.isSuper} />
                        <SpecificHeatPlot temp={state.temp} isSuper={state.isSuper} />
                    </div>
                </div>

                {/* Information Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' }}>
                    <div style={{ 
                        background: 'rgba(255,255,255,0.02)', 
                        padding: '30px', 
                        borderRadius: '24px', 
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <div style={{ color: themeColor, display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <Info size={20} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Research Insight: Type-II Materials</span>
                        </div>
                        <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: '1.6' }}>
                           Below <span style={{ color: themeColor }}>T<sub>c</sub></span>, a Type-II superconductor expels low magnetic fields (Meissner Phase). However, at higher fields (between H<sub>c1</sub> and H<sub>c2</sub>), it enters the <span style={{ color: themeColor, fontWeight: 'bold' }}>Vortex State</span>, where magnetic flux penetrates in quantized tubes. This allows for higher critical fields, making them essential for MRI machines.
                        </p>
                    </div>

                    <div style={{ 
                        background: 'rgba(34, 211, 238, 0.05)', 
                        padding: '30px', 
                        borderRadius: '24px', 
                        border: '1px solid rgba(34, 211, 238, 0.1)'
                    }}>
                        <div style={{ color: '#22d3ee', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <Shield size={20} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Interface Physics: Andreev Reflection</span>
                        </div>
                        <p style={{ color: '#888', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '20px' }}>
                           The energy gap is a <span style={{ color: '#22d3ee', fontWeight: 'bold' }}>forbidden zone</span>. Single electrons cannot enter the superconductor unless they have energy E &gt; Δ. At the interface, multiple electrons must pair up to enter as a <span style={{ color: '#22d3ee', fontWeight: 'bold' }}>Cooper Pair</span>, a process known as <span style={{ color: '#22d3ee', fontWeight: 'bold' }}>Andreev Reflection</span>. This is key to <span style={{ color: '#22d3ee', fontWeight: 'bold' }}>Cooper Pair Splitting</span> and quantum entanglement experiments.
                        </p>
                        <button 
                            onClick={() => navigate('/learn/andreev_reflection')}
                            style={{ 
                                background: '#22d3ee', 
                                border: 'none', 
                                color: '#000', 
                                padding: '10px 20px', 
                                borderRadius: '12px', 
                                fontSize: '0.7rem', 
                                fontWeight: '900',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            GO TO ANDREEV LAB →
                        </button>
                    </div>
                </div>
            </div>

            {/* Sidebar Controls */}
            <div className="custom-scrollbar" style={{ 
                width: isMobile ? '100%' : (effectiveWidth < 1300 ? '300px' : '360px'),
                background: '#0a0a0a', 
                borderLeft: isMobile ? 'none' : '1px solid #1a1a1a', 
                padding: isMobile ? '20px' : (effectiveWidth < 1300 ? '24px' : '32px'),
                overflowY: 'auto',
                height: isMobile ? 'auto' : '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '40px',
                flexShrink: 0
            }}>
                {/* Status Badge */}
                <div style={{ 
                    background: state.isSuper ? 'rgba(34, 211, 238, 0.1)' : 'rgba(244, 63, 94, 0.1)', 
                    padding: '24px', 
                    borderRadius: '24px', 
                    border: `1px solid ${themeColor}`,
                    textAlign: 'center'
                }}>
                    <Zap size={24} color={themeColor} style={{ marginBottom: '10px' }} />
                    <h3 style={{ fontSize: '1.3rem', color: themeColor, textTransform: 'uppercase' }}>
                        {state.isSuper ? (state.isVortexState ? 'Vortex State' : 'Superconducting') : 'Normal Phase'}
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '10px' }}>
                        {state.isSuper ? `B-Field: ${state.isVortexState ? 'Mixed Penetration' : 'Fully Expelled'}` : 'Resistivity: Metallic'}
                    </p>
                </div>

                {/* Sliders */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <ControlItem 
                        icon={<Thermometer size={18} />} 
                        label="Temperature (T/Tc)" 
                        value={state.temp.toFixed(2)} 
                        unit="K"
                        color={themeColor}
                    >
                        <input 
                            type="range" min="0" max="1.5" step="0.01" 
                            value={state.temp} onChange={(e) => state.setTemp(parseFloat(e.target.value))} 
                            style={{ width: '100%', height: '4px', appearance: 'none', background: '#333', accentColor: themeColor }}
                        />
                    </ControlItem>

                    <ControlItem 
                        icon={<Magnet size={18} />} 
                        label="Magnetic Field (B)" 
                        value={state.field.toFixed(2)} 
                        unit="T"
                        color={themeColor}
                    >
                        <input 
                            type="range" min="0" max="1.2" step="0.01" 
                            value={state.field} onChange={(e) => state.setField(parseFloat(e.target.value))} 
                            style={{ width: '100%', height: '4px', appearance: 'none', background: '#333', accentColor: themeColor }}
                        />
                    </ControlItem>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => { state.setTemp(0.2); state.setField(0.1); }} style={{ 
                            flex: 1, padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', 
                            border: '1px solid #333', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold', 
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' 
                        }}>
                            <RotateCcw size={16} /> RESET
                        </button>
                        
                        <button onClick={() => state.setField(0.5)} style={{ 
                            flex: 1, padding: '16px', borderRadius: '16px', background: themeColor, 
                            border: 'none', color: '#000', fontSize: '0.8rem', fontWeight: '900', 
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' 
                        }}>
                            <Shield size={16} /> HIGH FIELD
                        </button>
                    </div>
                </div>

                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid #222' }}>
                     <h4 style={{ fontSize: '0.75rem', color: themeColor, marginBottom: '10px' }}>CRITICAL BOUNDARIES</h4>
                     <p style={{ fontSize: '0.7rem', color: '#555', lineHeight: '1.4' }}>
                        B_c1: {state.Bc1.toFixed(2)} T (Vortex transition)<br/>
                        B_c2: {state.Bc2.toFixed(2)} T (Superconductivity breakdown)
                     </p>
                </div>
            </div>
        </div>
    );
}

function ControlItem({ icon, label, value, unit, children, color }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {icon} {label}
                </div>
                <div style={{ color: color, fontSize: '0.9rem', fontWeight: '900' }}>{value} <span style={{ color: '#444', fontSize: '0.7rem' }}>{unit}</span></div>
            </div>
            {children}
        </div>
    );
}
