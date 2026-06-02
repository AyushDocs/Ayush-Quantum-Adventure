import { Info, Zap, Activity, Thermometer, Shield } from 'lucide-react';

const C = {
  text: '#1a1a2e',
  muted: '#555555',
  border: '#ddd8ce',
  accent: '#10b981',
};

export default function HallControls({ state, onReset }) {
    const { 
        bField, setBField, 
        density, setDensity, 
        temperature, setTemperature, 
        showEdgeStates, setShowEdgeStates,
        chernNumber 
    } = state;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
                    <Shield size={24} color={C.accent} />
                </div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: C.text }}>
                    Hall Parameters
                </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Magnetic Field B Slider */}
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: C.muted, marginBottom: '12px' }}>
                        Magnetic Field (B) [Tesla]
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <input 
                            type="range" 
                            min="0.0" 
                            max="5.0" 
                            step="0.1" 
                            value={bField} 
                            onChange={(e) => setBField(parseFloat(e.target.value))}
                            onMouseUp={onReset}
                            onTouchEnd={onReset}
                            style={{ flex: 1, accentColor: '#10b981' }}
                        />
                        <span style={{ minWidth: '45px', textAlign: 'right', fontWeight: 'bold', color: '#10b981', fontSize: '1rem' }}>
                            {bField.toFixed(1)}T
                        </span>
                    </div>
                </div>

                {/* Density Slider */}
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: C.muted, marginBottom: '12px' }}>
                        Electron Density (n) [10¹¹ cm⁻²]
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <input 
                            type="range" 
                            min="0.5" 
                            max="5.0" 
                            step="0.1" 
                            value={density} 
                            onChange={(e) => setDensity(parseFloat(e.target.value))}
                            style={{ flex: 1, accentColor: '#3b82f6' }}
                        />
                        <span style={{ minWidth: '45px', textAlign: 'right', fontWeight: 'bold', color: '#3b82f6', fontSize: '1rem' }}>
                            {density.toFixed(1)}
                        </span>
                    </div>
                </div>

                {/* Disorder Slider */}
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: C.muted, marginBottom: '12px' }}>
                        Disorder Strength (W)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.05" 
                            value={state.disorderStrength} 
                            onChange={(e) => state.setDisorderStrength(parseFloat(e.target.value))}
                            style={{ flex: 1, accentColor: '#f43f5e' }}
                        />
                        <span style={{ minWidth: '45px', textAlign: 'right', fontWeight: 'bold', color: '#f43f5e', fontSize: '1rem' }}>
                            {(state.disorderStrength * 100).toFixed(0)}%
                        </span>
                    </div>
                </div>

                {/* Temperature Slider */}
                <div>
                    <label style={{ fontSize: '0.8rem', color: C.muted, marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                        Temperature <span>(Low T required for QHE)</span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <WarmthIcon temperature={temperature} />
                        <input 
                            type="range" 
                            min="0.01" 
                            max="2.0" 
                            step="0.05" 
                            value={temperature} 
                            onChange={(e) => setTemperature(parseFloat(e.target.value))}
                            style={{ flex: 1, accentColor: '#aaa' }}
                        />
                        <span style={{ minWidth: '45px', textAlign: 'right', color: C.muted, fontSize: '0.85rem' }}>
                            {temperature.toFixed(2)}K
                        </span>
                    </div>
                </div>

                {/* Edge State Toggle */}
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '15px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: C.muted, cursor: 'pointer' }}>
                        <input 
                            type="checkbox" 
                            checked={showEdgeStates} 
                            onChange={(e) => setShowEdgeStates(e.target.checked)}
                            style={{ width: '16px', height: '16px', accentColor: '#10b981' }}
                        />
                        Highlight Edge Percolation
                    </label>

                </div>
            </div>

            {/* Results Card */}
            <div style={{ 
                background: bField < 0.05 ? 'rgba(0, 0, 0, 0.02)' : 'linear-gradient(135deg, rgba(16, 185, 129, 0.06), rgba(59, 130, 246, 0.06))',
                padding: '24px', 
                borderRadius: '16px', 
                border: bField < 0.05 ? '1px solid #ddd8ce' : '1px solid rgba(16, 185, 129, 0.15)',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '0.75rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                    Filling Factor (ν)
                </div>
                <div style={{ fontSize: '3rem', fontWeight: '900', color: C.text }}>
                    {bField < 0.05 ? "-" : chernNumber}
                </div>
                <div style={{ fontSize: '0.8rem', marginTop: '10px', color: bField < 0.05 ? '#666666' : '#10b981', fontWeight: 'bold' }}>
                    {bField < 0.05 ? "Classical Transport (B=0)" : "Quantized Edge States Active"}
                </div>
            </div>

            {/* Dynamic Formula Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>
                <h3 style={{ fontSize: '0.8rem', fontWeight: '800', color: C.accent, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={14} /> Governing Equations
                </h3>
                
                {/* Conductance Formula */}
                <div style={{ background: '#ffffff', padding: '15px', borderRadius: '12px', border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: '0.7rem', color: C.muted, marginBottom: '8px', fontWeight: 'bold' }}>HALL CONDUCTANCE</div>
                    <div style={{ fontFamily: 'serif', fontSize: '1.2rem', color: C.text, textAlign: 'center' }}>
                        σ<sub style={{ fontSize: '0.7rem' }}>xy</sub> = <span style={{ color: '#10b981' }}>{bField < 0.05 ? "-" : chernNumber}</span> · (e² / h)
                    </div>
                </div>

                {/* Filling Factor Formula */}
                <div style={{ background: '#ffffff', padding: '15px', borderRadius: '12px', border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: '0.7rem', color: C.muted, marginBottom: '8px', fontWeight: 'bold' }}>FILLING FACTOR (ν)</div>
                    <div style={{ fontFamily: 'serif', fontSize: '1rem', color: C.text, textAlign: 'center' }}>
                        ν = <span style={{ color: '#3b82f6' }}>{density.toFixed(1)}</span> / (<span style={{ color: '#10b981' }}>{bField.toFixed(1)}</span> · Φ₀) ≈ <span style={{ fontWeight: 'bold' }}>{bField < 0.05 ? "-" : state.fillingFactor.toFixed(2)}</span>
                    </div>
                </div>

                {/* Landau Quantization Formula */}
                <div style={{ background: '#ffffff', padding: '15px', borderRadius: '12px', border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: '0.7rem', color: C.muted, marginBottom: '8px', fontWeight: 'bold' }}>LANDAU LEVEL QUANTIZATION</div>
                    <div style={{ fontFamily: 'serif', fontSize: '0.95rem', color: C.text, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ textAlign: 'center' }}>
                            Spacing: ΔE = ħω<sub>c</sub> ≈ <span style={{ color: '#10b981', fontWeight: 'bold' }}>{bField < 0.05 ? "-" : `${(bField * 0.5).toFixed(2)} meV`}</span>
                        </div>
                        <div style={{ borderTop: `1px dashed ${C.border}`, paddingTop: '6px', textAlign: 'center' }}>
                            Energy: E<sub>n</sub> = ΔE · (n + ½) ≈ <span style={{ color: '#9333ea', fontWeight: 'bold' }}>{bField < 0.05 ? "-" : `${(bField * 0.5).toFixed(2)} · (n + ½) meV`}</span>
                        </div>
                    </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: C.muted, lineHeight: '1.5', marginTop: '10px' }}>
                    As you increase the <b>Magnetic Field (B)</b>, the energy spacing ΔE between Landau Levels increases, compressing electrons into fewer, highly degenerate states.
                </p>
            </div>
        </div>
    );
}

function WarmthIcon({ temperature }) {
    return <Thermometer size={16} color={temperature > 0.5 ? '#f87171' : '#60a5fa'} />;
}
