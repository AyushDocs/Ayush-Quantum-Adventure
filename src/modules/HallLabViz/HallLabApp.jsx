import { useWindowSize, getEffectiveWidth } from '../../hooks/useWindowSize';
import { useZoomLevel } from '../../hooks/useZoomLevel';
import useHallLabState from './useHallLabState';
import HallFlowCanvas from './Components/HallFlowCanvas';
import HallControls from './Components/HallControls';
import HallEquations from './Components/HallEquations';
import HallGraphs from './Components/HallGraphs';

const C = {
  bg: '#f4f1ea',
  text: '#1a1a2e',
  muted: '#555',
  cardBg: '#ffffff',
  border: '#ddd8ce',
  accent: '#d97706',
  sidebarBg: '#faf8f4',
};

export default function HallLabApp() {
  const { width } = useWindowSize();
  const state = useHallLabState();
  const effectiveWidth = getEffectiveWidth(width);
  const isMobile = effectiveWidth < 1024;
  const zoomLevel = useZoomLevel();
  const scale = zoomLevel / 100;

  const containerBase = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    overflow: 'hidden',
    background: C.bg,
    color: C.text,
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    width: `${100 / scale}%`,
    height: `${100 / scale}%`,
  };

  const mainArea = {
    flex: 1,
    overflowY: isMobile ? 'visible' : 'auto',
    padding: isMobile ? '16px' : '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? '16px' : '24px',
    height: isMobile ? 'auto' : '100%',
  };

  const sidebar = {
    width: isMobile ? '100%' : '340px',
    background: C.sidebarBg,
    borderLeft: isMobile ? 'none' : `1px solid ${C.border}`,
    borderTop: isMobile ? `1px solid ${C.border}` : 'none',
    padding: isMobile ? '16px' : '24px',
    overflowY: isMobile ? 'visible' : 'auto',
    height: 'auto',
    flexShrink: 0,
  };

  const card = {
    background: C.cardBg,
    borderRadius: '24px',
    padding: '24px',
    border: `1px solid ${C.border}`,
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
  };

  return (
    <div style={containerBase}>
      <div className="custom-scrollbar" style={mainArea}>
        <div>
          <h1 style={{
            fontSize: isMobile ? '1.5rem' : '2.5rem',
            fontWeight: 900,
            letterSpacing: '-1.5px',
            marginBottom: '8px',
            color: C.text,
          }}>
            HALL <span style={{ color: C.accent }}>EFFECT LAB</span>
          </h1>
          <p style={{ color: C.muted, fontSize: '0.95rem', maxWidth: '800px', lineHeight: '1.6' }}>
            Visualize carrier transport in a magnetic field. e⁻ flow LTR, h⁺ flow RTL.
            Lorentz force deflects carriers; Hall voltage builds across the sample.
          </p>
        </div>

        <div style={card}>
          <HallFlowCanvas
            carrierType={state.carrierType}
            bEff={state.bEff}
            bField={state.bField}
            bSign={state.bSign}
            current={state.current}
            showMagnetic={state.showMagnetic}
            showElectric={state.showElectric}
            animating={state.animating}
            thickness={state.thickness}
            area={state.area}
            carrierDensity={state.carrierDensity}
            mobility={state.mobility}
            hallAngle={state.hallAngle}
            omegaCtau={state.omegaCtau}
            hallBalance={state.hallBalance}
          />
        </div>

        <div style={card}>
          <HallEquations state={state} />
        </div>

        <div style={card}>
          <HallGraphs state={state} />
        </div>
      </div>

      <div className="custom-scrollbar" style={sidebar}>
        <HallControls state={state} />
      </div>
    </div>
  );
}
