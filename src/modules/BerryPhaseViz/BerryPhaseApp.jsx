import { useZoomLevel, getEffectiveWidth } from '../../hooks/useZoomLevel';
import { useWindowSize } from '../../hooks/useWindowSize';
import BerryControls from './Components/BerryControls';
import DispersionPlot from './Components/DispersionPlot';
import CurvaturePlot from './Components/CurvaturePlot';
import TheorySection from './Components/TheorySection';
import { useBerryState } from './useBerryState';

export default function BerryPhaseApp() {
    const { width } = useWindowSize();
    const berryState = useBerryState();
    const effectiveWidth = getEffectiveWidth(width);
    const isMobile = effectiveWidth < 1024;
    const zoomLevel = useZoomLevel();
    const scale = zoomLevel / 100;

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row', 
            overflow: 'hidden',
            background: 'var(--bg-primary)',
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: `${100/scale}%`,
            height: `${100/scale}%`,
        }}>
            {/* Visualization Area */}
            <div className="custom-scrollbar" style={{ 
                flex: 1, 
                position: 'relative', 
                background: '#0d0d0d', 
                overflowY: 'auto',
                padding: '20px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
            }}>
                <div style={{ 
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '16px',
                    padding: '10px',
                    background: 'rgba(255,255,255,0.02)'
                }}>
                    <DispersionPlot data={berryState.data} state={berryState} />
                </div>
                
                <div style={{ 
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '16px',
                    padding: '10px',
                    background: 'rgba(255,255,255,0.02)'
                }}>
                    <CurvaturePlot data={berryState.data} state={berryState} />
                </div>
                
                {/* Theory Section below plots */}
                <TheorySection showExchange={berryState.showExchange} />
            </div>

            {/* Controls Sidebar */}
            <div className="custom-scrollbar" style={{ 
                width: isMobile ? '100%' : (effectiveWidth < 1300 ? '300px' : '360px'),
                background: 'var(--card-bg)', 
                borderLeft: isMobile ? 'none' : '1px solid var(--border-color)', 
                borderTop: isMobile ? '1px solid var(--border-color)' : 'none',
                padding: isMobile ? '20px' : (effectiveWidth < 1300 ? '24px' : '32px'), 
                overflowY: 'auto',
                height: isMobile ? 'auto' : '100%',
                boxShadow: isMobile ? 'none' : '-10px 0 30px rgba(0,0,0,0.5)',
                zIndex: 10,
                flexShrink: 0
            }}>
                <BerryControls state={berryState} />
            </div>
        </div>
    );
}
