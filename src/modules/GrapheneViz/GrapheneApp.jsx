import { useWindowSize, getEffectiveWidth } from '../../hooks/useWindowSize';
import { useZoomLevel } from '../../hooks/useZoomLevel';
import LatticeViz from './Components/LatticeViz';
import DiracConePlot from './Components/DiracConePlot';
import BerryCurvaturePlot from './Components/BerryCurvaturePlot';
import KleinTunnelingLab from './Components/KleinTunnelingLab';
import PhaseDiagramPlot from './Components/PhaseDiagramPlot';
import OrbitalViewer3D from './Components/OrbitalViewer3D';
import HaldaneControls from './Components/HaldaneControls';
import BrillouinZoneViz from './Components/BrillouinZoneViz';
import SymmetryLab from './Components/SymmetryLab';
import TopologicalLab from './Components/TopologicalLab';
import { useGrapheneState } from './useGrapheneState';
import { BookOpen, Zap, Globe, Atom } from 'lucide-react';
import MobilityComparisonCard from './Components/MobilityComparisonCard';

export default function GrapheneApp() {
    const { width } = useWindowSize();
    const state = useGrapheneState();
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
                overflowY: isMobile ? 'visible' : 'auto',
                padding: isMobile ? '20px' : '40px',
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? '20px' : '40px',
                height: isMobile ? 'auto' : '100%'
            }}>
                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ fontSize: isMobile ? '1.55rem' : '2.5rem', fontWeight: '900', letterSpacing: '-1.5px', marginBottom: '10px' }}>
                            GRAPHENE & <span style={{ color: '#10b981' }}>DIRAC LAB</span>
                        </h1>
                        <p style={{ color: '#888', fontSize: '1rem', maxWidth: '800px', lineHeight: '1.6' }}>
                           Exploration of the Honeycomb lattice, Berry curvature topology, and the <b style={{color: '#fff'}}>Klein Paradox</b> in Dirac fermion transport.
                        </p>
                    </div>
                </div>

                {/* Top Row: LatticeViz & PhaseDiagram */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2.5fr 1fr', gap: '30px' }}>
                    <div style={{ 
                        background: 'rgba(0,0,0,0.5)',
                        borderRadius: '24px',
                        padding: '24px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>
                        <LatticeViz t1={state.t1} mass={state.mass} showOrbitals={state.showOrbitals} />
                    </div>
                    <PhaseDiagramPlot 
                        mass={state.mass} phi={state.phi} t2={state.t2}
                        setMass={state.setMass} setPhi={state.setPhi} 
                    />
                </div>

                {/* New Feature: Atomic Hybridization Lab */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 2fr', gap: '30px' }}>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center' }}>
                         <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', borderLeft: '4px solid #10b981' }}>
                                <Atom size={18} color="#10b981" />
                                <h3 style={{ fontSize: '1.1rem', color: '#10b981', margin: 0 }}>The Atomic Root (1s², 2s², 2p²)</h3>
                            <p style={{ fontSize: '0.8rem', color: '#ccc', lineHeight: '1.6', marginTop: '10px' }}>
                                Carbon starts with <b style={{color: '#10b981'}}>1s², 2s², 2p²</b>. In graphene, these hybridize to <b style={{color: '#10b981'}}>sp²</b>. Three electrons form strong σ-bonds, while the 4th electron stays in the <b style={{color: '#3b82f6'}}>pᶻ orbital</b> for "jumping" (hopping).
                            </p>
                         </div>
                         <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', borderLeft: '4px solid #3b82f6' }}>
                            <h3 style={{ fontSize: '1.1rem', color: '#3b82f6', marginBottom: '10px' }}>The Pi Highway (pᶻ)</h3>
                            <p style={{ fontSize: '0.8rem', color: '#888', lineHeight: '1.6' }}>
                                The leftover pz orbital sticks out vertically. These dumbbells overlap to form the "electric highway" where electrons hop between atoms, creating the Dirac spectrum.
                            </p>
                         </div>
                     </div>
                     <OrbitalViewer3D t1={state.t1} />
                </div>

                {/* Mobility & Transistor Comparison Section */}
                <MobilityComparisonCard isMobile={isMobile} />

                {/* Middle Row: Klein Tunneling Lab (Spans full width) */}
                <KleinTunnelingLab mass={state.mass} />

                {/* Bottom Row: 3D Dispersion & Berry Topology */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', 
                    gap: '30px' 
                }}>
                    <DiracConePlot calculateEnergy={state.calculateEnergy} mass={state.mass} />
                    <BrillouinZoneViz />
                    <BerryCurvaturePlot calculateBerryCurvature={state.calculateBerryCurvature} />
                </div>

                {/* Symmetry & Topology Lab Section */}
                <SymmetryLab 
                    mass={state.mass} phi={state.phi} 
                    setMass={state.setMass} setPhi={state.setPhi} 
                />

                {/* Advanced Theory Card */}
                <div style={{ 
                    background: 'rgba(255,255,255,0.02)', 
                    padding: '30px', 
                    borderRadius: '24px', 
                    border: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <div style={{ color: '#a855f7', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                        <Globe size={20} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Quantum Topology Insights</span>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Dirac Fermions & Symmetries</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <p style={{ color: '#888', fontSize: '0.92rem', lineHeight: '1.7' }}>
                           Graphene's low-energy excitations are <b style={{color: '#fff'}}>massless Dirac fermions</b>. The Dirac points are protected by the combination of <b style={{color: '#fff'}}>Time-Reversal (T)</b> and <b style={{color: '#fff'}}>Spatial/Inversion (P)</b> symmetry. 
                           <br/><br/>
                           In the absence of a mass term, the product <i style={{color: '#fff'}}>PT</i> ensures the bands touch at the K-points. Breaking <b style={{color: '#10b981'}}>P</b> (Inversion) by creating a sublattice imbalance (Mass <i style={{color: '#10b981'}}>M</i>) or breaking <b style={{color: '#3b82f6'}}>T</b> (Time-Reversal) by adding a complex phase (Haldane Phase <i style={{color: '#3b82f6'}}>φ</i>) opens a topological gap.
                        </p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '20px' }}>
                            <div style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h4 style={{ fontSize: '0.75rem', color: '#fff', marginBottom: '8px', textTransform: 'uppercase' }}>Fundamental State</h4>
                                <p style={{ fontSize: '0.7rem', color: '#888', margin: 0 }}>
                                    Graphene is naturally a <b style={{color: '#fff'}}>Dirac Semimetal</b>. It acts as a relativistic 2DEG where the valence and conduction bands touch at discrete points.
                                </p>
                            </div>
                            <div style={{ padding: '15px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                                <h4 style={{ fontSize: '0.75rem', color: '#10b981', marginBottom: '8px', textTransform: 'uppercase' }}>Condition: Broken T</h4>
                                <p style={{ fontSize: '0.7rem', color: '#888', margin: 0 }}>
                                    If Time-Reversal symmetry is broken (via the Haldane Phase), it becomes a <b style={{color: '#fff'}}>Chern Insulator</b> with a non-zero Chern number.
                                </p>
                            </div>
                            <div style={{ padding: '15px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                                <h4 style={{ fontSize: '0.75rem', color: '#3b82f6', marginBottom: '8px', textTransform: 'uppercase' }}>Condition: Add SOC</h4>
                                <p style={{ fontSize: '0.7rem', color: '#888', margin: 0 }}>
                                    If Spin-Orbit Coupling is included, it becomes a <b style={{color: '#fff'}}>Topological Insulator</b> (Quantum Spin Hall phase).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Controls */}
            <div className="custom-scrollbar" style={{ 
                width: isMobile ? '100%' : (effectiveWidth < 1300 ? '300px' : '360px'),
                background: '#0a0a0a', 
                borderLeft: isMobile ? 'none' : '1px solid #1a1a1a', 
                padding: isMobile ? '20px' : (effectiveWidth < 1300 ? '24px' : '32px'),
                overflowY: isMobile ? 'visible' : 'auto',
                height: 'auto',
                flexShrink: 0
            }}>
                <HaldaneControls state={state} />
                <TopologicalLab />
            </div>
        </div>
    );
}
