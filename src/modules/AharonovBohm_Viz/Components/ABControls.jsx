import React from 'react';

const ABControls = ({ flux, setFlux, splitDistance, setSplitDistance, showAField, setShowAField, currentMode, setCurrentMode }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Flux Control */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#d1d5db' }}>Solenoid Current / Flux (Φ)</label>
          <span style={{ 
            color: '#60a5fa', 
            fontFamily: 'monospace', 
            fontWeight: 'bold', 
            backgroundColor: 'rgba(59, 130, 246, 0.1)', 
            padding: '0.25rem 0.5rem', 
            borderRadius: '0.25rem' 
          }}>
            {flux.toFixed(2)} Φ₀
          </span>
        </div>
        <input 
          type="range" 
          min="-2" 
          max="2" 
          step="0.01" 
          value={flux} 
          onChange={(e) => setFlux(parseFloat(e.target.value))}
          style={{ 
            width: '100%', 
            height: '0.5rem', 
            backgroundColor: '#1f2937', 
            borderRadius: '0.5rem', 
            appearance: 'none', 
            cursor: 'pointer',
            accentColor: '#3b82f6'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#6b7280', fontFamily: 'monospace' }}>
          <span>-2.0</span>
          <span>0.0</span>
          <span>+2.0</span>
        </div>
      </div>

      {/* Current Profile Control */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#d1d5db' }}>Current Profile</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
          {['dc', 'ac', 'pulsed'].map(mode => (
            <button 
              key={mode}
              onClick={() => setCurrentMode(mode)}
              style={{
                padding: '0.5rem',
                fontSize: '0.75rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: currentMode === mode ? '#2563eb' : '#1f2937',
                color: 'white',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Path Split Control */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#d1d5db' }}>Path Separation</label>
          <span style={{ 
            color: '#a855f7', 
            fontFamily: 'monospace', 
            fontWeight: 'bold', 
            backgroundColor: 'rgba(168, 85, 247, 0.1)', 
            padding: '0.25rem 0.5rem', 
            borderRadius: '0.25rem' 
          }}>
            {(splitDistance * 10).toFixed(1)} a.u.
          </span>
        </div>
        <input 
          type="range" 
          min="0.1" 
          max="0.8" 
          step="0.01" 
          value={splitDistance} 
          onChange={(e) => setSplitDistance(parseFloat(e.target.value))}
          style={{ 
            width: '100%', 
            height: '0.5rem', 
            backgroundColor: '#1f2937', 
            borderRadius: '0.5rem', 
            appearance: 'none', 
            cursor: 'pointer',
            accentColor: '#a855f7'
          }}
        />
      </div>

      {/* Toggles */}
      <div style={{ paddingTop: '1rem', borderTop: '1px solid #1f2937', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>Visualize Vector Potential (A)</span>
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <input 
              type="checkbox" 
              style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
              checked={showAField}
              onChange={() => setShowAField(!showAField)}
            />
            <div style={{ 
              width: '2.75rem', 
              height: '1.5rem', 
              backgroundColor: showAField ? '#2563eb' : '#374151', 
              borderRadius: '9999px',
              transition: 'all 0.2s',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '2px',
                left: showAField ? 'calc(100% - 1.25rem - 2px)' : '2px',
                backgroundColor: 'white',
                borderRadius: '50%',
                height: '1.25rem',
                width: '1.25rem',
                transition: 'all 0.2s'
              }}></div>
            </div>
          </div>
        </label>
      </div>

      {/* Presets */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <button 
          onClick={() => setFlux(0)}
          style={{ 
            padding: '0.5rem 0.75rem', 
            fontSize: '0.75rem', 
            backgroundColor: '#1f2937', 
            color: 'white', 
            borderRadius: '0.5rem', 
            border: '1px solid #374151', 
            cursor: 'pointer' 
          }}
        >
          Zero Flux
        </button>
        <button 
          onClick={() => setFlux(1.0)}
          style={{ 
            padding: '0.5rem 0.75rem', 
            fontSize: '0.75rem', 
            backgroundColor: '#1f2937', 
            color: 'white', 
            borderRadius: '0.5rem', 
            border: '1px solid #374151', 
            cursor: 'pointer' 
          }}
        >
          Φ = Φ₀
        </button>
      </div>
    </div>
  );
};

export default ABControls;
