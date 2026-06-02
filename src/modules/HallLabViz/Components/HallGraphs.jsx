import { useMemo } from 'react';
import Plot from 'react-plotly.js';

const CHARGE = 1.602e-19;

function makeTrace(x, y, name, color, dash) {
  return {
    x, y, type: 'scatter', mode: 'lines',
    name,
    line: { color, width: 2.5, dash: dash || 'solid' },
    hovertemplate: `${name}<br>%{x}: %{y:.3e}<extra></extra>`,
  };
}

const C = {
  bg: '#faf8f4',
  text: '#1a1a2e',
  muted: '#555',
  border: '#e8e4db',
};

export default function HallGraphs({ state }) {
  const fontColor = C.muted;
  const gridColor = '#e0dcd2';

  const axis = {
    gridcolor: gridColor,
    zerolinecolor: gridColor,
    color: fontColor,
    tickfont: { size: 11, color: fontColor },
    title: { standoff: 16, font: { size: 13, color: C.text } },
    showline: true,
    linecolor: gridColor,
    linewidth: 1,
    mirror: false,
    exponentformat: 'power',
    showexponent: 'first',
    tickformat: '.1e',
    tickangle: 0,
  };

  const baseLayout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: { color: fontColor, size: 11, family: 'monospace' },
    margin: { l: 80, r: 40, t: 55, b: 65 },
    showlegend: true,
    legend: {
      font: { size: 10, color: fontColor },
      orientation: 'h',
      y: 1.15,
      x: 0.5,
      xanchor: 'center',
    },
    xaxis: { ...axis },
    yaxis: { ...axis },
  };

  const bRange = useMemo(() => {
    const points = 80;
    const bVals = [];
    const vH = [];
    const angle = [];
    const sigma_xx = [];
    const sigma_xy = [];
    const omegaTau = [];
    const mEff = state.effectiveMass;
    const tau = state.meanFreeTime;
    const s0 = state.sigma0;
    for (let i = 0; i < points; i++) {
      const b = 0.01 + i * (2.0 / points);
      bVals.push(b);
      const wc = CHARGE * b / mEff;
      const wct = wc * tau;
      sigma_xx.push(s0);
      sigma_xy.push(s0 * wct);
      const q = state.carrierType === 'electron' ? -CHARGE : CHARGE;
      vH.push(Math.abs((state.current * b) / (state.carrierDensity * q * state.thickness)));
      angle.push(wct * 180 / Math.PI);
      omegaTau.push(wct);
    }
    return { bVals, vH, angle, sigma_xx, sigma_xy, omegaTau };
  }, [state.carrierType, state.current, state.carrierDensity, state.thickness, state.effectiveMass, state.meanFreeTime, state.sigma0]);

  const muRange = useMemo(() => {
    const points = 80;
    const muVals = [];
    const vdVals = [];
    const mu_ref = 1.0;
    const E_long = state.current / (state.carrierDensity * CHARGE * state.area * mu_ref);
    for (let i = 0; i < points; i++) {
      const mu = 0.01 + i * (2.0 / points);
      muVals.push(mu);
      vdVals.push(mu * E_long);
    }
    return { muVals, vdVals };
  }, [state.current, state.carrierDensity, state.area]);

  const makeYAxis = (title) => ({
    ...axis,
    title: { text: title, standoff: 16, font: { size: 13, color: C.text } },
  });

  const makeXAxis = (title) => ({
    ...axis,
    title: { text: title, standoff: 16, font: { size: 13, color: C.text } },
  });

  const makePlot = (data, title, xTitle, yTitle, height = 240) => (
    <Plot
      data={data}
      layout={{
        ...baseLayout,
        title: {
          text: title,
          font: { size: 12, color: C.text, family: 'monospace' },
          x: 0.5,
          xanchor: 'center',
          y: 0.97,
        },
        xaxis: makeXAxis(xTitle),
        yaxis: makeYAxis(yTitle),
        height,
      }}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: '100%' }}
    />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{
        background: C.bg,
        borderRadius: '16px',
        padding: '12px 16px 8px',
        border: `1px solid ${C.border}`,
      }}>
        {makePlot(
          [
            makeTrace(bRange.bVals, bRange.sigma_xx, '\u03c3<sub>xx</sub> (longitudinal)', '#0891b2'),
            makeTrace(bRange.bVals, bRange.sigma_xy, '\u03c3<sub>xy</sub> (transverse/Hall)', '#7c3aed'),
          ],
          'Conductivity vs Magnetic Field B',
          'Magnetic Field B (T)',
          '\u03c3 (\u03a9\u00b7m)\u207b\u00b9',
        )}
      </div>

      <div style={{
        background: C.bg,
        borderRadius: '16px',
        padding: '12px 16px 8px',
        border: `1px solid ${C.border}`,
      }}>
        {makePlot(
          [
            makeTrace(bRange.bVals, bRange.vH, 'V<sub>H</sub> (Hall Voltage)', '#d97706'),
          ],
          'Hall Voltage vs Magnetic Field B',
          'Magnetic Field B (T)',
          'V<sub>H</sub> (V)',
        )}
      </div>

      <div style={{
        background: C.bg,
        borderRadius: '16px',
        padding: '12px 16px 8px',
        border: `1px solid ${C.border}`,
      }}>
        {makePlot(
          [
            makeTrace(bRange.bVals, bRange.angle, '\u03b8<sub>H</sub> (Hall Angle)', '#7c3aed'),
          ],
          'Hall Angle vs Magnetic Field B',
          'Magnetic Field B (T)',
          '\u03b8<sub>H</sub> (\u00b0)',
        )}
      </div>

      <div style={{
        background: C.bg,
        borderRadius: '16px',
        padding: '12px 16px 8px',
        border: `1px solid ${C.border}`,
      }}>
        {makePlot(
          [
            makeTrace(bRange.bVals, bRange.omegaTau, '\u03c9<sub>c</sub>\u03c4', '#dc2626'),
          ],
          '\u03c9<sub>c</sub>\u03c4 vs Magnetic Field \u2014 Transport Regime',
          'Magnetic Field B (T)',
          '\u03c9<sub>c</sub>\u03c4 (dimensionless)',
        )}
      </div>

      <div style={{
        background: C.bg,
        borderRadius: '16px',
        padding: '12px 16px 8px',
        border: `1px solid ${C.border}`,
      }}>
        {makePlot(
          [
            makeTrace(muRange.muVals, muRange.vdVals, 'Drift Velocity v<sub>d</sub>', '#d97706'),
            {
              x: [state.mobility],
              y: [state.driftVelocity],
              type: 'scatter',
              mode: 'markers',
              name: 'Operating Point',
              marker: { color: '#dc2626', size: 10, symbol: 'circle' },
              hovertemplate: `Current μ: %{x:.3f}<br>Current v_d: %{y:.3e}<extra></extra>`,
            },
          ],
          'Drift Velocity v<sub>d</sub> vs Mobility \u03bc',
          'Mobility \u03bc (m\u00b2/V\u00b7s)',
          'Drift Velocity v<sub>d</sub> (m/s)',
        )}
      </div>

    </div>
  );
}
