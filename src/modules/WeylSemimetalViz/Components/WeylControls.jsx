import { Zap, Magnet, Target, Layers } from 'lucide-react';

export default function WeylControls({ state }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Header */}
            <div>
              <div style={{ color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <Zap size={18} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Field Manipulator</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Topological Controls</h2>
            </div>

            {/* Weyl Node Separation */}
            <ControlGroup 
                label="Weyl Node Separation" 
                sub="Separation in Momentum Space (2k₀)"
                icon={<Target size={16} color="#8b5cf6" />}
                val={state.nodeSeparation} 
                min={0.2} max={2.8} step={0.01}
                onChange={state.setNodeSeparation}
            />

            {/* Magnetic Field (B) */}
            <ControlGroup 
                label="Magnetic Field (B)" 
                sub="Chiral shift / Anomaly Strength"
                icon={<Magnet size={16} color="#3b82f6" />}
                val={state.bField} 
                min={0} max={1.0} step={0.01}
                onChange={state.setBField}
                unit=" Tesla"
            />

            {/* Fermi Arc Tilt */}
            <ControlGroup 
                label="Fermi Arc Curvature" 
                sub="Non-linear surface topology"
                icon={<Layers size={16} color="#10b981" />}
                val={state.tilt} 
                min={-2} max={2} step={0.01}
                onChange={state.setTilt}
            />

            {/* Toggles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', paddingTop: '20px', borderTop: '1px solid #1a1a1a' }}>
                 <ToggleSwitch 
                    label="Visualize Fermi Arcs" 
                    checked={state.showArcs} 
                    onChange={state.setShowArcs} 
                    color="#8b5cf6"
                />
            </div>

            {/* Theory Byte */}
            <div style={{ marginTop: 'auto', padding: '20px', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '16px', border: '1px dashed rgba(139, 92, 246, 0.2)' }}>
                <p style={{ fontSize: '0.75rem', color: '#888', fontStyle: 'italic', lineHeight: '1.6' }}>
                    "Unlike Dirac nodes in 2D which can be opened by a mass gap, Weyl nodes in 3D are **topologically protected**. They can only be destroyed by annihilating with a node of opposite chirality."
                </p>
            </div>
        </div>
    );
}

function ControlGroup({ label, sub, icon, val, min, max, step, onChange, unit = "" }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {icon}
                <span style={{ fontSize: '0.85rem', fontWeight: '500', color: '#eee' }}>{label}</span>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#8b5cf6', background: 'rgba(139,92,246,0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                {val.toFixed(2)}{unit}
            </span>
        </div>
        <p style={{ fontSize: '0.7rem', color: '#666' }}>{sub}</p>
        <input 
            type="range" min={min} max={max} step={step} value={val} 
            onChange={(e) => onChange(parseFloat(e.target.value))} 
            style={{ 
                width: '100%', 
                height: '4px', 
                background: '#1a1a1a', 
                borderRadius: '2px', 
                accentColor: '#8b5cf6' 
            }} 
        />
    </div>
  );
}

function ToggleSwitch({ label, checked, onChange, color }) {
    return (
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
            <span style={{ fontSize: '0.85rem', color: '#eee' }}>{label}</span>
            <div 
                onClick={() => onChange(!checked)}
                style={{ 
                    width: '40px', 
                    height: '20px', 
                    background: checked ? color : '#333', 
                    borderRadius: '20px', 
                    position: 'relative',
                    transition: 'all 0.3s ease'
                }}
            >
                <div style={{ 
                    width: '14px', 
                    height: '14px', 
                    background: '#fff', 
                    borderRadius: '50%', 
                    position: 'absolute', 
                    top: '3px', 
                    left: checked ? '23px' : '3px',
                    transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
                }} />
            </div>
        </label>
    );
}
