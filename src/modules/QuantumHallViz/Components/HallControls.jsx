import { Info, Zap, Activity, Thermometer, Shield } from 'lucide-react';

export default function HallControls({ state }) {
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
                    <Shield size={24} color="#10b981" />
                </div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>
                    Hall Parameters
                </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Magnetic Field B Slider */}
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '12px' }}>
                        Magnetic Field (B) [Tesla]
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <input 
                            type="range" 
                            min="0.1" 
                            max="5.0" 
                            step="0.1" 
                            value={bField} 
                            onChange={(e) => setBField(parseFloat(e.target.value))}
                            style={{ flex: 1, accentColor: '#10b981' }}
                        />
                        <span style={{ minWidth: '45px', textAlign: 'right', fontWeight: 'bold', color: '#10b981', fontSize: '1rem' }}>
                            {bField.toFixed(1)}T
                        </span>
                    </div>
                </div>

                {/* Density Slider */}
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '12px' }}>
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
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '12px' }}>
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
                    <label style={{ fontSize: '0.8rem', color: '#888', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                        Temperature <span>(Low T required for QHE)</span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Thermometer size={16} color={temperature > 0.5 ? '#f87171' : '#60a5fa'} />
                        <input 
                            type="range" 
                            min="0.01" 
                            max="2.0" 
                            step="0.05" 
                            value={temperature} 
                            onChange={(e) => setTemperature(parseFloat(e.target.value))}
                            style={{ flex: 1, accentColor: '#aaa' }}
                        />
                        <span style={{ minWidth: '45px', textAlign: 'right', color: '#aaa', fontSize: '0.85rem' }}>
                            {temperature.toFixed(2)}K
                        </span>
                    </div>
                </div>

                {/* Edge State Toggle */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: '#aaa', cursor: 'pointer' }}>
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
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))',
                padding: '24px', 
                borderRadius: '16px', 
                border: '1px solid rgba(16, 185, 129, 0.2)',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '0.75rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                    Filling Factor (ν)
                </div>
                <div style={{ fontSize: '3rem', fontWeight: '900', color: '#fff' }}>
                    {chernNumber}
                </div>
                <div style={{ fontSize: '0.8rem', marginTop: '10px', color: '#10b981' }}>
                    Quantized Edge States Active
                </div>
            </div>

            {/* Dynamic Formula Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>
                <h3 style={{ fontSize: '0.8rem', fontWeight: '800', color: '#10b981', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={14} /> Governing Equations
                </h3>
                
                {/* Conductance Formula */}
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '8px', fontWeight: 'bold' }}>HALL CONDUCTANCE</div>
                    <div style={{ fontFamily: 'serif', fontSize: '1.2rem', color: '#fff', textAlign: 'center' }}>
                        σ<sub style={{ fontSize: '0.7rem' }}>xy</sub> = <span style={{ color: '#10b981' }}>{chernNumber}</span> · (e² / h)
                    </div>
                </div>

                {/* Filling Factor Formula */}
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '8px', fontWeight: 'bold' }}>FILLING FACTOR (ν)</div>
                    <div style={{ fontFamily: 'serif', fontSize: '1rem', color: '#fff', textAlign: 'center' }}>
                        ν = <span style={{ color: '#3b82f6' }}>{density.toFixed(1)}</span> / (<span style={{ color: '#10b981' }}>{bField.toFixed(1)}</span> · Φ₀) ≈ <span style={{ fontWeight: 'bold' }}>{state.fillingFactor.toFixed(2)}</span>
                    </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: '#888', lineHeight: '1.5', marginTop: '10px' }}>
                    As you increase the <b>Magnetic Field (B)</b>, the electrons are compressed into fewer Landau Levels, increasing the drift velocity.
                </p>
            </div>
        </div>
    );
}
