const C = {
  bg: '#faf8f4',
  text: '#1a1a2e',
  muted: '#555',
  border: '#e8e4db',
  accent: '#d97706',
};

const sliderStyle = {
  width: '100%', height: '5px',
  WebkitAppearance: 'none',
  background: '#ddd8ce',
  borderRadius: '3px',
  outline: 'none',
  cursor: 'pointer',
};

function SliderGroup({ label, value, onChange, min, max, step, format }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ color: C.muted, fontSize: '0.78rem' }}>{label}</span>
        <span style={{ color: C.text, fontSize: '0.78rem', fontFamily: "'Courier New', monospace", fontWeight: 'bold' }}>
          {format ? format(value) : value}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))} style={sliderStyle} />
    </div>
  );
}

function ToggleGroup({ label, value, onToggle, trueLabel, falseLabel, accent, disabled }) {
  const handleClick = (val) => {
    if (!disabled) onToggle(val);
  };
  return (
    <div style={{ marginBottom: '14px', opacity: disabled ? 0.5 : 1 }}>
      <div style={{ color: C.muted, fontSize: '0.78rem', marginBottom: '5px' }}>{label}</div>
      <div style={{
        display: 'flex', background: '#eeeae2',
        borderRadius: '8px', overflow: 'hidden',
        border: `1px solid ${C.border}`,
      }}>
        <button onClick={() => handleClick(true)} disabled={disabled}
          style={{
            flex: 1, padding: '8px', border: 'none',
            background: value ? (accent || '#15803d') : 'transparent',
            color: value ? '#fff' : C.muted, cursor: disabled ? 'not-allowed' : 'pointer',
            fontSize: '0.78rem', fontWeight: value ? 'bold' : 'normal',
            transition: 'all 0.2s',
          }}>{trueLabel}</button>
        <button onClick={() => handleClick(false)} disabled={disabled}
          style={{
            flex: 1, padding: '8px', border: 'none',
            background: !value ? (accent || '#7c3aed') : 'transparent',
            color: !value ? '#fff' : C.muted, cursor: disabled ? 'not-allowed' : 'pointer',
            fontSize: '0.78rem', fontWeight: !value ? 'bold' : 'normal',
            transition: 'all 0.2s',
          }}>{falseLabel}</button>
      </div>
    </div>
  );
}

export default function HallControls({ state }) {
  return (
    <div>
      <h3 style={{ color: C.accent, fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '20px', letterSpacing: '1px' }}>
        ⚡ HALL LAB CONTROLS
      </h3>

      <div style={{
        background: C.bg,
        padding: '16px', borderRadius: '12px',
        border: `1px solid ${C.border}`,
        marginBottom: '14px',
      }}>
        <div style={{ color: C.muted, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
          Carrier & Field
        </div>
        <ToggleGroup label="Carrier Type" value={state.carrierType === 'electron'}
          onToggle={v => state.setCarrierType(v ? 'electron' : 'hole')}
          trueLabel="e⁻ ⟶ LTR" falseLabel="h⁺ ⟵ RTL" accent="#0891b2" />
        <ToggleGroup label="B Field Direction" value={state.bSign === 1}
          onToggle={v => state.setBSign(v ? 1 : -1)}
          trueLabel="⊙ Into Page" falseLabel="⊗ Out of Page" accent="#7c3aed" />

        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <button onClick={() => state.setAnimating(a => !a)}
            style={{
              flex: 1, padding: '8px', border: `1px solid ${C.border}`,
              borderRadius: '8px', background: state.animating ? C.accent : 'transparent',
              color: state.animating ? '#fff' : C.muted, cursor: 'pointer',
              fontSize: '0.78rem', fontWeight: state.animating ? 'bold' : 'normal',
            }}>
            {state.animating ? '⏸ Pause' : '▶ Play'}
          </button>
        </div>
      </div>

      <div style={{
        background: C.bg,
        padding: '16px', borderRadius: '12px',
        border: `1px solid ${C.border}`,
        marginBottom: '14px',
      }}>
        <div style={{ color: C.muted, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
          Field & Current
        </div>
        <SliderGroup label="Magnetic Field B (T)" value={state.bField}
          onChange={state.setBField} min={0} max={2} step={0.01} />
        <SliderGroup label="Current I (A)" value={state.current}
          onChange={state.setCurrent} min={0.1} max={10} step={0.1} />
        <ToggleGroup label="Hall Voltage Feedback" value={state.autoBalance}
          onToggle={state.setAutoBalance} trueLabel="Auto Build-up" falseLabel="Manual Control" accent="#ca8a04" />
        {!state.autoBalance && (
          <SliderGroup label="Hall Voltage Balance" value={state.hallBalance}
            onChange={state.setHallBalance} min={0} max={1} step={0.01}
            format={v => `${(v * 100).toFixed(0)}%`} />
        )}
      </div>

      <div style={{
        background: C.bg,
        padding: '16px', borderRadius: '12px',
        border: `1px solid ${C.border}`,
        marginBottom: '14px',
      }}>
        <div style={{ color: C.muted, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
          Sample Properties
        </div>
        <SliderGroup label="Carrier Density n (×10²³ m⁻³)" value={state.carrierDensity / 1e23}
          onChange={v => state.setCarrierDensity(v * 1e23)} min={0.01} max={10} step={0.01}
          format={v => (v * 1e23).toExponential(2)} />
        <SliderGroup label="Mobility μ (m²/V·s)" value={state.mobility}
          onChange={state.setMobility} min={0.01} max={2} step={0.01} />
        <SliderGroup label="Thickness t (mm)" value={state.thickness * 1000}
          onChange={v => state.setThickness(v / 1000)} min={0.1} max={5} step={0.1}
          format={v => (v / 1000).toExponential(2)} />
        <SliderGroup label="Area A (mm²)" value={state.area * 1e6}
          onChange={v => state.setArea(v / 1e6)} min={1} max={20} step={0.5}
          format={v => (v / 1e6).toExponential(2)} />
      </div>

      <div style={{
        background: C.bg,
        padding: '16px', borderRadius: '12px',
        border: `1px solid ${C.border}`,
      }}>
        <div style={{ color: C.muted, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
          Display Options
        </div>
        <ToggleGroup label="Show Magnetic Force" value={state.bField <= 0.01 ? false : state.showMagnetic}
          onToggle={state.setShowMagnetic} trueLabel="Show" falseLabel="Hide" accent="#7c3aed"
          disabled={state.bField <= 0.01} />
        <ToggleGroup label="Show Electric Force" value={state.showElectric}
          onToggle={state.setShowElectric} trueLabel="Show" falseLabel="Hide" accent="#15803d" />
      </div>
    </div>
  );
}
