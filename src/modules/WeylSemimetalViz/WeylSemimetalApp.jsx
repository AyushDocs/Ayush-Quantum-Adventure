import { useWindowSize, getEffectiveWidth } from '../../hooks/useWindowSize';
import { useZoomLevel } from '../../hooks/useZoomLevel';
import Weyl3DViewer from './Components/Weyl3DViewer';
import WeylControls from './Components/WeylControls';
import TheorySection from './Components/TheorySection';
import { useWeylState } from './useWeylState';
import { Globe, Box, Layers, Zap } from 'lucide-react';

export default function WeylSemimetalApp() {
    const { width } = useWindowSize();
    const state = useWeylState();
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
            fontFamily: 'Inter, sans-serif',
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1.5px', marginBottom: '10px' }}>
                            WEYL SEMIMETAL <span style={{ color: '#8b5cf6' }}>EXPLORER</span>
                        </h1>
                        <p style={{ color: '#888', fontSize: '1rem', maxWidth: '800px', lineHeight: '1.6' }}>
                           Moving from 2D to 3D Topological Matter. Visualize the bulk Brillouin Zone nodes and the mysterious open-ended surface **Fermi Arcs**.
                        </p>
                    </div>
                    {/* Visual Badge */}
                    <div style={{ padding: '8px 16px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '20px', border: '1px solid rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', gap: '8px', color: '#8b5cf6', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        <Box size={14} /> 3D Topology Lab
                    </div>
                </div>

                {/* Main 3D Visualization */}
                <div style={{ 
                    background: 'rgba(0,0,0,0.5)',
                    borderRadius: '32px',
                    padding: '24px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}>
                    <Weyl3DViewer 
                        nodes={state.weylNodes} 
                        fermiArcPoints={state.fermiArcPoints} 
                        showArcs={state.showArcs} 
                    />
                </div>

                {/* Highlights */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '20px' }}>
                    <HighlightCard 
                        icon={<Globe size={20} color="#8b5cf6" />} 
                        title="Bulk Brillouin Zone"
                        desc="The 3D momentum space where Weyl nodes act as sources and sinks of Berry Curvature (monopoles)."
                    />
                     <HighlightCard 
                        icon={<Layers size={20} color="#10b981" />} 
                        title="Surface Fermi Arcs"
                        desc="Unique surface states that connect the projections of nodes—unlike closed loops in normal metals."
                    />
                     <HighlightCard 
                        icon={<Zap size={20} color="#fbbf24" />} 
                        title="Chiral Anomaly"
                        desc="Non-conservation of charge of a given chirality in parallel E and B fields."
                    />
                </div>

                {/* Theory Section */}
                <TheorySection />
            </div>

            {/* Sidebar Controls */}
            <div className="custom-scrollbar" style={{ 
                width: isMobile ? '100%' : (effectiveWidth < 1300 ? '300px' : '360px'),
                background: '#0a0a0a', 
                borderLeft: isMobile ? 'none' : '1px solid #1a1a1a', 
                padding: isMobile ? '20px' : (effectiveWidth < 1300 ? '24px' : '32px'),
                overflowY: 'auto',
                height: isMobile ? 'auto' : '100%',
                flexShrink: 0
            }}>
                <WeylControls state={state} />
            </div>
        </div>
    );
}

function HighlightCard({ icon, title, desc }) {
    return (
        <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                {icon}
                <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{title}</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#666', lineHeight: '1.6' }}>{desc}</p>
        </div>
    );
}
