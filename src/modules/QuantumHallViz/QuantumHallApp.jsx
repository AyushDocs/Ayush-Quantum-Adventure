import { useState } from 'react';
import { useWindowSize, getEffectiveWidth } from '../../hooks/useWindowSize';
import { useZoomLevel } from '../../hooks/useZoomLevel';
import HallControls from './Components/HallControls';
import HallEffectSim from './Components/HallEffectSim';
import HallSpectroPlot from './Components/HallSpectroPlot';
import HallPlateauPlot from './Components/HallPlateauPlot';
import BerryMiniMap from './Components/BerryMiniMap';
import LaughlinGauge from './Components/LaughlinGauge';
import { useHallState } from './useHallState';

const C = {
  bg: '#f4f1ea',
  text: '#1a1a2e',
  muted: '#555555',
  cardBg: '#ffffff',
  border: '#ddd8ce',
  accent: '#10b981',
  sidebarBg: '#faf8f4',
};

export default function QuantumHallApp() {
    const { width } = useWindowSize();
    const state = useHallState();
    const [resetTrigger, setResetTrigger] = useState(0);
    const effectiveWidth = getEffectiveWidth(width);
    const isMobile = effectiveWidth < 1024;
    const zoomLevel = useZoomLevel();
    const scale = zoomLevel / 100;

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row', 
            overflow: 'hidden',
            background: C.bg,
            color: C.text,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: `${100/scale}%`,
            height: `${100/scale}%`,
        }}>
            {/* Main Content Area */}
            <div className="custom-scrollbar" style={{ 
                flex: 1, 
                overflowY: isMobile ? 'visible' : 'auto',
                padding: isMobile ? '16px' : '20px 40px 30px',
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? '16px' : '20px',
                height: isMobile ? 'auto' : '100%'
            }}>
                {/* Header Section */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h1 style={{ 
                        fontSize: isMobile ? '1.5rem' : '2.5rem', 
                        fontWeight: '900', 
                        letterSpacing: '-1.5px', 
                        marginTop: '0',
                        marginBottom: '6px', 
                        color: C.text 
                    }}>
                        TOPOLOGICAL <span style={{ color: C.accent }}>HALL BAR LAB</span>
                    </h1>
                    <p style={{ color: C.muted, fontSize: '0.95rem', maxWidth: '800px', lineHeight: '1.5', margin: '0' }}>
                       Experiment with 6-probe transport, Shubnikov-de Haas oscillations, and the topological protection of edge states in a 2D electron gas.
                    </p>
                </div>

                {/* Top Row: Main Simulation (The Hall Bar) */}
                <div style={{ 
                    background: C.cardBg,
                    borderRadius: '24px',
                    padding: '24px',
                    border: `1px solid ${C.border}`,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    position: 'relative'
                }}>
                    <HallEffectSim 
                        bField={state.bField} 
                        chernNumber={state.chernNumber}
                        temperature={state.temperature}
                        resetTrigger={resetTrigger}
                        density={state.density}
                        fillingFactor={state.fillingFactor}
                    />
                </div>

                {/* Bottom Row: Spectroscopy & Plateaus */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1.2fr', 
                    gap: '30px' 
                }}>
                    <HallSpectroPlot 
                        landauLevels={state.landauLevels} 
                        fermiLevel={state.fermiLevel} 
                    />
                    <HallPlateauPlot 
                        bField={state.bField} 
                        density={state.density} 
                        chernNumber={state.chernNumber} 
                        rxx={state.rxx}
                        temperature={state.temperature}
                    />
                </div>

                {/* Bottom Section: Laughlin Pump & Momentum Winding */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: isMobile ? '1fr' : '1fr auto', 
                    gap: '30px',
                    alignItems: 'start'
                }}>
                    <LaughlinGauge chernNumber={state.chernNumber} bField={state.bField} />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <BerryMiniMap fillingFactor={state.fillingFactor} bField={state.bField} />
                    </div>
                </div>
            </div>

            {/* Sidebar Controls */}
            <div className="custom-scrollbar" style={{ 
                width: isMobile ? '100%' : (effectiveWidth < 1300 ? '300px' : '340px'),
                background: C.sidebarBg, 
                borderLeft: isMobile ? 'none' : `1px solid ${C.border}`, 
                padding: isMobile ? '20px' : (effectiveWidth < 1300 ? '24px' : '32px'),
                overflowY: isMobile ? 'visible' : 'auto',
                height: 'auto',
                flexShrink: 0
            }}>
                <HallControls state={state} onReset={() => setResetTrigger(prev => prev + 1)} />
            </div>
        </div>
    );
}
