import { useWindowSize, getEffectiveWidth } from '../../hooks/useWindowSize';
import { useZoomLevel } from '../../hooks/useZoomLevel';
import HallControls from './Components/HallControls';
import HallEffectSim from './Components/HallEffectSim';
import HallSpectroPlot from './Components/HallSpectroPlot';
import HallPlateauPlot from './Components/HallPlateauPlot';
import BerryMiniMap from './Components/BerryMiniMap';
import { useHallState } from './useHallState';

export default function QuantumHallApp() {
    const { width } = useWindowSize();
    const state = useHallState();
    const effectiveWidth = getEffectiveWidth(width);
    const isMobile = effectiveWidth < 1024;
    const zoomLevel = useZoomLevel();
    const scale = zoomLevel / 100;

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row', 
            overflow: 'hidden',
            background: '#050505',
            color: '#fff',
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: `${100/scale}%`,
            height: `${100/scale}%`,
        }}>
            {/* Main Content Area */}
            <div className="custom-scrollbar" style={{ 
                flex: 1, 
                overflowY: 'auto',
                padding: isMobile ? '20px' : '40px',
                display: 'flex',
                flexDirection: 'column',
                gap: '40px'
            }}>
                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1.5px', marginBottom: '10px' }}>
                            TOPOLOGICAL <span style={{ color: '#10b981' }}>HALL BAR LAB</span>
                        </h1>
                        <p style={{ color: '#888', fontSize: '1rem', maxWidth: '800px', lineHeight: '1.6' }}>
                           Experiment with 6-probe transport, Shubnikov-de Haas oscillations, and the topological protection of edge states in a 2D electron gas.
                        </p>
                    </div>
                    {/* Floating Mini-Map */}
                    <BerryMiniMap fillingFactor={state.fillingFactor} />
                </div>

                {/* Top Row: Main Simulation (The Hall Bar) */}
                <div style={{ 
                    background: 'rgba(0,0,0,0.5)',
                    borderRadius: '24px',
                    padding: '24px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    position: 'relative'
                }}>
                    <HallEffectSim 
                        bField={state.bField} 
                        chernNumber={state.chernNumber}
                        disorderStrength={state.disorderStrength}
                        temperature={state.temperature}
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
            </div>

            {/* Sidebar Controls */}
            <div className="custom-scrollbar" style={{ 
                width: isMobile ? '100%' : (effectiveWidth < 1300 ? '300px' : '340px'),
                background: '#0a0a0a', 
                borderLeft: isMobile ? 'none' : '1px solid #1a1a1a', 
                padding: isMobile ? '20px' : (effectiveWidth < 1300 ? '24px' : '32px'),
                overflowY: 'auto',
                height: isMobile ? 'auto' : '100%',
                flexShrink: 0
            }}>
                <HallControls state={state} />
            </div>
        </div>
    );
}
