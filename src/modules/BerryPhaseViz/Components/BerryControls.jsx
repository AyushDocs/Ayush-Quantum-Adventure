import { Info, Map, Zap } from 'lucide-react';
import PhaseDiagram from './PhaseDiagram';

export default function BerryControls({ state }) {
    const { 
        mass, setMass, ax, setAx, ay, setAy, h, setH, 
        showVectorField, setShowVectorField, chernNumber, 
        showExchange, setShowExchange 
    } = state;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px', color: 'var(--primary-color)' }}>
                    Berry Phase & Topology
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    Explore how the geometric phase of electronic wavefunctions changes as we move across the k-space Brillouin Zones.
                </p>
            </div>

            {/* Topological Indicator */}
            <div style={{ 
                background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(79, 70, 229, 0.1))',
                padding: '20px', 
                borderRadius: '12px', 
                border: '1px solid rgba(147, 51, 234, 0.3)',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '0.8rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                    Chern Number (Wound)
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: Math.abs(chernNumber) > 0.5 ? '#10b981' : '#f43f5e' }}>
                    {Math.abs(chernNumber - Math.round(chernNumber)) < 0.1 ? Math.round(chernNumber) : chernNumber.toFixed(2)}
                </div>
                
                {/* Integral Formula Overlay */}
                <div style={{ 
                    marginTop: '12px', 
                    paddingTop: '12px', 
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    fontFamily: 'serif',
                    fontSize: '0.9rem',
                    color: '#888'
                }}>
                    C = <span style={{ fontSize: '1.1rem' }}><sup>1</sup>/<sub>2&pi;</sub></span> &oiint; &Omega;(<span style={{ color: 'var(--primary-color)' }}>k</span>) d&sup2;k &asymp; <span style={{ color: '#fff', fontWeight: 'bold' }}>{chernNumber.toFixed(2)}</span>
                </div>

                <div style={{ fontSize: '0.75rem', marginTop: '10px', opacity: 0.8, color: Math.abs(chernNumber) > 0.5 ? '#10b981' : '#f43f5e' }}>
                    {Math.abs(chernNumber) > 0.5 ? 'Topological State' : 'Trivial Phase'}
                </div>
            </div>

            {/* Phase Diagram Mini-Map */}
            <PhaseDiagram state={state} />

            {/* Main Parameters */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                {/* Mass Slider */}
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '8px' }}>
                        Effective Mass (M) [eV]
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input 
                            type="range" 
                            min="-1" 
                            max="3" 
                            step="0.05" 
                            value={mass} 
                            onChange={(e) => setMass(parseFloat(e.target.value))}
                            style={{ flex: 1, accentColor: 'var(--primary-color)' }}
                        />
                        <span style={{ minWidth: '55px', textAlign: 'right', fontWeight: 'mono', color: 'var(--primary-color)', fontSize: '0.9rem' }}>
                            {mass.toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Ax Slider */}
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '8px' }}>
                        Magnetic Potential Ax [Å⁻¹]
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input 
                            type="range" 
                            min="-3.14" 
                            max="3.14" 
                            step="0.05" 
                            value={ax} 
                            onChange={(e) => setAx(parseFloat(e.target.value))}
                            style={{ flex: 1, accentColor: '#3b82f6' }}
                        />
                        <span style={{ minWidth: '55px', textAlign: 'right', fontWeight: 'mono', color: '#3b82f6', fontSize: '0.9rem' }}>
                            {ax.toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Ay Slider */}
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '8px' }}>
                        Magnetic Potential Ay [Å⁻¹]
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input 
                            type="range" 
                            min="-3.14" 
                            max="3.14" 
                            step="0.05" 
                            value={ay} 
                            onChange={(e) => setAy(parseFloat(e.target.value))}
                            style={{ flex: 1, accentColor: '#3b82f6' }}
                        />
                        <span style={{ minWidth: '55px', textAlign: 'right', fontWeight: 'mono', color: '#3b82f6', fontSize: '0.9rem' }}>
                            {ay.toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Conditional Exchange Splitting Slider */}
                {showExchange && (
                    <div style={{ padding: '16px', background: 'rgba(251, 191, 36, 0.05)', borderRadius: '12px', border: '1px solid rgba(251, 191, 36, 0.2)', marginTop: '8px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#fbbf24', marginBottom: '8px', fontWeight: 'bold' }}>
                            Exchange Splitting (h) [eV]
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <input 
                                type="range" 
                                min="0" 
                                max="2" 
                                step="0.05" 
                                value={h} 
                                onChange={(e) => setH(parseFloat(e.target.value))}
                                style={{ flex: 1, accentColor: '#fbbf24' }}
                            />
                            <span style={{ minWidth: '55px', textAlign: 'right', fontWeight: 'mono', color: '#fbbf24', fontSize: '0.9rem' }}>
                                {h.toFixed(2)}
                            </span>
                        </div>
                    </div>
                )}

                {/* Toggles Section */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#aaa', cursor: 'pointer' }}>
                        <input 
                            type="checkbox" 
                            checked={showExchange} 
                            onChange={(e) => setShowExchange(e.target.checked)}
                            style={{ width: '16px', height: '16px', accentColor: '#fbbf24' }}
                        />
                        Enable Exchange Splitting
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#aaa', cursor: 'pointer' }}>
                        <input 
                            type="checkbox" 
                            checked={showVectorField} 
                            onChange={(e) => setShowVectorField(e.target.checked)}
                            style={{ width: '16px', height: '16px', accentColor: 'var(--accent-color)' }}
                        />
                        Show d-Vector Quivers
                    </label>
                </div>
            </div>

            {/* Quick Tips Footer */}
            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', color: '#888' }}>
                    <Info size={16} /> Quick Tips
                </h3>
                <ul style={{ fontSize: '0.85rem', color: '#666', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                    <li>Toggle <b>3D Landscape</b> on the curvature map to see the "flux mountains".</li>
                    <li>The <b>Phase Map</b> marker tells you exactly which topological island you're on.</li>
                </ul>
            </div>
        </div>
    );
}
