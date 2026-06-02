import { Inline } from '../lib/Latex';

const C = {
  bg: '#faf8f4',
  text: '#1a1a2e',
  muted: '#555',
  border: '#e8e4db',
  accent: '#d97706',
};

export default function CarrierAnalysis({ state }) {
  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '7px 0',
    borderBottom: `1px solid ${C.border}`,
    fontSize: '0.8rem',
  };

  const labelStyle = { color: C.muted };
  const valueStyle = { color: C.text, fontFamily: "'Courier New', monospace", fontWeight: 'bold' };

  const data = [
    { label: 'Carrier Type', value: state.carrierType === 'electron' ? 'Electrons (n-type)' : 'Holes (p-type)', color: state.carrierType === 'electron' ? '#0891b2' : '#ea580c', plain: true },
    { label: 'Detected Type (from R_H)', value: state.detectedType, color: '#15803d', plain: true },
    { label: 'Carrier Density (n)', value: state.carrierDensity.toExponential(3) + ' m⁻³', plain: true },
    { label: 'Sheet Density (n_s)', value: state.sheetDensity.toExponential(3) + ' m⁻²', plain: true },
    { label: 'Cross-sectional Area (A)', value: state.area.toExponential(3) + ' m²', plain: true },
    { label: 'Calculated Width (w = A/t)', value: state.width.toExponential(3) + ' m', plain: true },
    { label: 'Effective Mass (m*)', value: (state.effectiveMass / 9.11e-31).toFixed(2) + ' m_e', plain: true },
    { label: 'Mean Free Time (τ)', value: state.meanFreeTime.toExponential(3) + ' s', plain: true },
    { label: 'Hall Coefficient (R_H)', value: state.hallCoeff.toExponential(3) + ' m³/C', plain: true },
    { label: 'Hall Voltage (V_H)', value: state.hallVoltage.toExponential(3) + ' V', plain: true },
    { label: 'DC Conductivity (σ₀)', value: state.sigma0.toExponential(3) + ' (Ω·m)⁻¹', plain: true },
    { label: 'σ_xx (diagonal)', value: state.sigma_xx.toExponential(3) + ' (Ω·m)⁻¹', plain: true },
    { label: 'σ_xy (Hall)', value: state.sigma_xy.toExponential(3) + ' (Ω·m)⁻¹', plain: true },
    { label: 'ρ_xx (longitudinal)', value: state.rho_xx.toExponential(3) + ' Ω·m', color: '#15803d', plain: true },
    { label: 'ρ_xy (transverse/Hall)', value: state.rho_xy.toExponential(3) + ' Ω·m', color: '#d97706', plain: true },
    { label: 'Resistivity (ρ = 1/σ₀)', value: state.resistivity.toExponential(3) + ' Ω·m', plain: true },
    { label: 'Mobility (μ = eτ/m*)', value: state.mobility.toExponential(3) + ' m²/V·s', plain: true },
    { label: 'Hall Mobility (μ_H)', value: state.hallMobility.toExponential(3) + ' m²/V·s', plain: true },
    { label: 'Cyclotron Freq (ω_c)', value: state.cyclotronFreq.toExponential(3) + ' rad/s', plain: true },
    { label: 'Cyclotron Radius (r_c)', value: state.cyclotronRadius.toExponential(3) + ' m', plain: true },
    { label: 'ω_c τ', value: state.omegaCtau.toExponential(3), plain: true },
    { label: 'Kinetic Energy (½m*v²)', value: state.kineticEnergy.toExponential(3) + ' J', plain: true },
    { label: 'Hall Angle (θ_H)', value: (state.hallAngle * 180 / Math.PI).toFixed(2) + '°', plain: true },
    { label: 'Drift Velocity (v_d)', value: state.driftVelocity.toExponential(3) + ' m/s', plain: true },
    { label: 'Longitudinal Field (E_long)', value: state.E_long.toExponential(3) + ' V/m', plain: true },
    { label: 'Transport Regime', value: state.omegaCtau < 0.3 ? 'Scattering-dominated' : state.omegaCtau < 0.8 ? 'Intermediate' : 'High-field (cyclotron)', color: state.omegaCtau < 0.3 ? '#dc2626' : state.omegaCtau < 0.8 ? '#ca8a04' : '#7c3aed', plain: true },
  ];

  return (
    <div style={{
      background: C.bg,
      borderRadius: '16px',
      padding: '20px',
      border: `1px solid ${C.border}`,
    }}>
      <div style={{
        color: C.accent, fontSize: '0.7rem', textTransform: 'uppercase',
        letterSpacing: '1px', marginBottom: '16px', fontWeight: 'bold',
      }}>
        Hall Analysis Report
      </div>
      {data.map(d => (
        <div key={d.label} style={rowStyle}>
          <span style={labelStyle}>{d.label}</span>
          <span style={{ ...valueStyle, color: d.color || valueStyle.color }}>{d.value}</span>
        </div>
      ))}
    </div>
  );
}
