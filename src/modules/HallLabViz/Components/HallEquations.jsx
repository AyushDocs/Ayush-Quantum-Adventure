import 'katex/dist/katex.min.css';
import { Inline, Block } from '../lib/Latex';

const C = {
  bg: '#faf8f4',
  text: '#1a1a2e',
  muted: '#555',
  border: '#e8e4db',
  accent: '#d97706',
  green: '#15803d',
  purple: '#7c3aed',
  red: '#dc2626',
  cyan: '#0891b2',
  orange: '#ea580c',
  yellow: '#ca8a04',
};

function Section({ label, borderColor, children }) {
  return (
    <div style={{
      background: C.bg,
      padding: '14px 18px',
      borderRadius: '12px',
      border: `1px solid ${borderColor || C.border}`,
      fontSize: '0.9rem',
      lineHeight: '1.9',
      marginBottom: '12px',
    }}>
      <div style={{
        color: C.muted, fontSize: '0.65rem', textTransform: 'uppercase',
        letterSpacing: '1px', marginBottom: '8px', fontFamily: "'Courier New', monospace",
      }}>{label}</div>
      {children}
    </div>
  );
}

const note = { fontSize: '0.78rem', color: C.muted, padding: '1px 0' };

const colStyle = {
  flex: 1, minWidth: 0,
  display: 'flex', flexDirection: 'column',
};

export default function HallEquations({ state }) {
  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <div style={colStyle}>
        <Section label="Applied Longitudinal Field">
          <Block math={"E_{\\text{long}} = \\frac{V}{L}"} />
          <div style={note}>Drives current I along the bar; establishes drift velocity</div>
        </Section>

        <Section label="Drude Equation of Motion" borderColor={C.red}>
          <Block math={"m^* \\frac{d\\mathbf{v}}{dt} = -e(\\mathbf{E} + \\mathbf{v} \\times \\mathbf{B}) - \\frac{m^*\\mathbf{v}}{\\tau}"} />
          <div style={note}>
            The term <Inline math={"-m^*\\mathbf{v}/\\tau"} color={C.red} /> represents momentum relaxation due to scattering
          </div>
          <div style={note}>At steady state (dv/dt = 0):</div>
          <Block math={"-e(\\mathbf{E} + \\mathbf{v} \\times \\mathbf{B}) = \\frac{m^*\\mathbf{v}}{\\tau}"} />
        </Section>

        <Section label="Drude DC Conductivity">
          <Block math={"\\sigma_0 = \\frac{n e^2 \\tau}{m^*}"} />
          <div style={note}><Inline math={"\\sigma_0"} /> = <Inline math={state.sigma0.toExponential(3) + '\\,(\\Omega\\cdot\\text{m})^{-1}'} /></div>
          <div style={note}><Inline math={"\\tau"} /> = <Inline math={state.meanFreeTime.toExponential(3) + '\\,\\text{s}'} /> | <Inline math={"m^*"} /> = <Inline math={(state.effectiveMass / 9.11e-31).toFixed(2) + '\\,m_e'} /></div>
          <div style={note}><Inline math={"\\sigma_0"} /> is constant with B — <Inline math={"\\rho_{xx} = 1/\\sigma_0"} /> is flat</div>
        </Section>

        <Section label="Conductivity Tensor" borderColor={C.cyan}>
          <div style={note}><Inline math={"\\mathbf{J} = \\sigma \\cdot \\mathbf{E}"} /> →</div>
          <Block math={"\\begin{bmatrix} \\sigma_{xx} & \\sigma_{xy} \\\\ \\sigma_{yx} & \\sigma_{yy} \\end{bmatrix}"} />
          <div style={note}><Inline math={"\\sigma_{xx} = \\sigma_{yy} = \\sigma_0"} /></div>
          <div style={note}><Inline math={"\\sigma_{xy} = -\\sigma_{yx} = \\sigma_0\\,\\omega_c\\tau"} /></div>
          <div style={note}><Inline math={"\\sigma_{xx}"} /> = <Inline math={state.sigma_xx.toExponential(3)} /> | <Inline math={"\\sigma_{xy}"} /> = <Inline math={state.sigma_xy.toExponential(3)} /></div>
        </Section>

        <Section label="Resistivity Tensor" borderColor={C.green}>
          <Block math={"\\begin{bmatrix} \\rho_{xx} & \\rho_{xy} \\\\ \\rho_{yx} & \\rho_{yy} \\end{bmatrix}"} />
          <div style={note}><Inline math={"\\rho_{xx}"} color={C.green} /> = <Inline math={"1/\\sigma_0"} /> — constant, independent of B</div>
          <div style={note}><Inline math={"\\rho_{xy}"} color={C.accent} /> = <Inline math={"B/(ne) = R_H B"} /> — linear in B</div>
          <div style={note}><Inline math={"\\rho_{xx}"} /> = <Inline math={state.rho_xx.toExponential(3) + '\\,\\Omega\\cdot\\text{m}'} /> (longitudinal)</div>
          <div style={note}><Inline math={"\\rho_{xy}"} /> = <Inline math={state.rho_xy.toExponential(3) + '\\,\\Omega\\cdot\\text{m}'} /> (transverse)</div>
          <div style={{ height: '4px' }} />
          <div style={note}><span style={{ fontWeight: 'bold' }}>Why is <Inline math={"\\rho_{xx}"} /> constant?</span></div>
          <div style={note}>Carriers deflect but longitudinal current through any cross-section is unchanged — Hall field cancels transverse force.</div>
        </Section>

        <Section label="Energy & Work" borderColor={C.purple}>
          <div><Inline math={"KE = \\frac12 m^* v^2"} color={C.accent} /> = <Inline math={state.kineticEnergy.toExponential(3) + '\\,\\text{J}'} /></div>
          <div style={note}>Energy from battery via <Inline math={"E_{\\text{long}}"} /> — drift kinetic energy</div>
          <div style={note}><span style={{ color: C.purple, fontWeight: 'bold' }}>B does NO work</span> (<Inline math={"\\mathbf{F} \\cdot \\mathbf{v} = 0"} />) — only deflects</div>
          <div style={note}><span style={{ color: C.red, fontWeight: 'bold' }}>Dissipation via scattering:</span> <Inline math={"-m^*\\mathbf{v}/\\tau"} /> → Joule heating <Inline math={"I^2R"} /></div>
        </Section>
      </div>

      <div style={colStyle}>
        <Section label="Hall Voltage">
          <Block math={"V_H = \\frac{I\\,B}{n\\,e\\,t}"} />
          <div style={note}><Inline math={"V_H"} color={C.green} /> = <Inline math={state.hallVoltage.toExponential(3) + '\\,\\text{V}'} /> | <Inline math="E_H = V_H / w" /></div>
        </Section>

        <Section label="Hall Coefficient" borderColor={C.accent}>
          <Block math={"R_H = \\frac{1}{nq} = \\frac{E_H}{jB}"} />
          <div style={note}><Inline math={"R_H"} /> = <Inline math={state.hallCoeff.toExponential(3) + '\\,\\text{m}^3/\\text{C}'} /></div>
          <div style={note}><Inline math={"R_H < 0"} /> → <span style={{ color: C.cyan }}>n-type</span> (electrons) &nbsp;|&nbsp; <Inline math={"R_H > 0"} /> → <span style={{ color: C.orange }}>p-type</span> (holes)</div>
          <div style={note}><Inline math={"n = 1/(e|R_H|)"} /> → n = <Inline math={state.carrierDensity.toExponential(3) + '\\,\\text{m}^{-3}'} /></div>
          <div style={note}>Detected: <span style={{ color: C.green, fontWeight: 'bold' }}>{state.detectedType}</span></div>
        </Section>

        <Section label={'\u03c9c\u03c4 — Transport Regime'} borderColor={C.accent}>
          <div><Inline math={"\\omega_c\\tau = \\mu B"} color={C.accent} /> = <Inline math={state.omegaCtau.toExponential(3)} /></div>
          <div style={{ height: '4px' }} />
          <div style={note}><span style={{ color: C.red, fontWeight: 'bold' }}><Inline math={"\\omega_c\\tau \\ll 1"} /></span> — scattering dominates, negligible Hall effect</div>
          <div style={note}><span style={{ color: C.green, fontWeight: 'bold' }}><Inline math={"\\omega_c\\tau \\approx 1"} /></span> — cyclotron onset, <Inline math={"\\sigma_{xx}"} /> drops</div>
          <div style={note}><span style={{ color: C.purple, fontWeight: 'bold' }}><Inline math={"\\omega_c\\tau \\gg 1"} /></span> — cyclotron orbits, <Inline math={"\\sigma_{xx} \\to 0"} /></div>
          <div style={{ height: '4px' }} />
          <div style={note}><Inline math={"\\omega_c = eB/m^*"} /> = <Inline math={state.cyclotronFreq.toExponential(3) + '\\,\\text{rad/s}'} /></div>
          <div style={note}><Inline math={"r_c = m^*v/(eB)"} /> = <Inline math={state.cyclotronRadius.toExponential(3) + '\\,\\text{m}'} /></div>
          <div style={{ ...note, color: C.accent, fontWeight: 'bold' }}>Regime: {state.regime}</div>
        </Section>

        <Section label="Hall Angle">
          <Block math={"\\tan\\theta_H = \\omega_c\\tau = \\mu B"} />
          <div style={note}><Inline math={"\\theta_H"} /> = <Inline math={(state.hallAngle * 180 / Math.PI).toFixed(1) + '^\\circ'} color={C.accent} /></div>
          <div style={note}>Net E-field rotates by <Inline math={"\\theta_H"} /> — carriers drift diagonally</div>
        </Section>

        <Section label="Cyclotron Motion" borderColor={C.cyan}>
          <div><Inline math={"\\omega_c = \\frac{eB}{m^*}"} color={C.accent} /> = <Inline math={state.cyclotronFreq.toExponential(3) + '\\,\\text{rad/s}'} /></div>
          <div><Inline math={"r_c = \\frac{m^*v}{eB}"} color={C.accent} /> = <Inline math={state.cyclotronRadius.toExponential(3) + '\\,\\text{m}'} /></div>
          <div style={note}>Circular orbit in perpendicular B field. When <Inline math={"r_c"} /> ≪ sample size → quantum Hall regime.</div>
        </Section>

        <Section label="Drude Limitations" borderColor={C.red}>
          <div style={note}>Classical Drude model fails where quantum effects dominate:</div>
          <div style={{ height: '4px' }} />
          <div style={note}><span style={{ color: C.red }}>Low T:</span> Phonon scattering freezes out; Fermi sea, Landau quantization</div>
          <div style={note}><span style={{ color: C.red }}>High B:</span> SdH oscillations, integer/fractional QHE — <Inline math={"\\rho_{xx}"} /> no longer flat</div>
          <div style={note}><span style={{ color: C.red }}>High μ:</span> Ballistic transport; scattering picture breaks down</div>
          <div style={note}><span style={{ color: C.red }}>2DEG:</span> Quantized Hall plateaus <Inline math={"R_{xy} = h/(\\nu e^2)"} /></div>
        </Section>
      </div>
    </div>
  );
}
