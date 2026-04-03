import { Sliders, Zap, Globe, Share2 } from 'lucide-react';

export default function HaldaneControls({ state }) {
    const { 
        t1, setT1, 
        t2, setT2, 
        phi, setPhi, 
        mass, setMass, 
        showOrbitals, setShowOrbitals,
        isTopological 
    } = state;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Header */}
            <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sliders size={20} color="#10b981" /> Haldane Phase Navigator
                </h2>
                <p style={{ color: '#666', fontSize: '0.8rem', marginTop: '5px' }}>
                    Tune the Hamiltonian to drive the system from a semimetal to a Chern Insulator.
                </p>
            </div>

            {/* Main Parameters */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <ControlGroup label="Nearest Neighbor (t1)" value={t1.toFixed(2)} unit="eV">
                    <input type="range" min="0.5" max="2.0" step="0.05" value={t1} onChange={(e) => setT1(parseFloat(e.target.value))} style={rangeStyle} />
                </ControlGroup>

                <ControlGroup label="Next-Nearest (t2)" value={t2.toFixed(3)} unit="eV">
                    <input type="range" min="0" max="0.5" step="0.01" value={t2} onChange={(e) => setT2(parseFloat(e.target.value))} style={rangeStyle} />
                </ControlGroup>

                <ControlGroup label="Haldane Phase (φ)" value={(phi / Math.PI).toFixed(2)} unit="π">
                    <input type="range" min="0" max={Math.PI} step="0.05" value={phi} onChange={(e) => setPhi(parseFloat(e.target.value))} style={rangeStyle} />
                </ControlGroup>

                <ControlGroup label="Sublattice Mass (M)" value={mass.toFixed(2)} unit="eV">
                    <input type="range" min="-1.5" max="1.5" step="0.05" value={mass} onChange={(e) => setMass(parseFloat(e.target.value))} style={rangeStyle} />
                </ControlGroup>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #1a1a1a' }} />

            {/* Topological Phase Insight */}
            <div style={{ 
                background: isTopological ? 'rgba(16, 185, 129, 0.05)' : 'rgba(244, 63, 94, 0.05)', 
                padding: '20px', 
                borderRadius: '16px', 
                border: `1px solid ${isTopological ? '#10b981' : '#f43f5e'}` 
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: isTopological ? '#10b981' : '#f43f5e', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        TOPOLOGICAL STATUS
                    </span>
                    <Globe size={16} color={isTopological ? '#10b981' : '#f43f5e'} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginTop: '5px' }}>
                    {isTopological ? "CHERN INSULATOR (C=1)" : "TRIVIAL INSULATOR (C=0)"}
                </h3>
                <p style={{ color: '#888', fontSize: '0.75rem', marginTop: '8px', lineHeight: '1.4' }}>
                    {isTopological 
                        ? "The time-reversal symmetry is broken and a gap is opened, creating a robust topological phase with quantized edge states."
                        : "The inversion-breaking mass (M) is too large, unwinding the topological phase into a trivial insulator."
                    }
                </p>
            </div>

            {/* Extra Controls */}
            <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={() => setShowOrbitals(!showOrbitals)} style={{ 
                    flex: 1, 
                    padding: '12px', 
                    borderRadius: '12px', 
                    background: showOrbitals ? '#10b981' : 'transparent', 
                    color: showOrbitals ? '#fff' : '#10b981', 
                    border: '1px solid #10b981', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold', 
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}>
                    <Zap size={14} /> {showOrbitals ? "HIDE ORBITALS" : "SHOW ORBITALS"}
                </button>
            </div>
        </div>
    );
}

function ControlGroup({ label, value, unit, children }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: '600' }}>{label}</span>
                <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 'bold' }}>{value} <span style={{ fontSize: '0.65rem', color: '#444' }}>{unit}</span></span>
            </div>
            {children}
        </div>
    );
}

const rangeStyle = { 
    width: '100%', 
    height: '4px', 
    background: '#222', 
    borderRadius: '4px', 
    appearance: 'none', 
    cursor: 'pointer',
    outline: 'none'
};
