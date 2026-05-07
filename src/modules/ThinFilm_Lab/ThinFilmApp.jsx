import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Info, Play, Pause, RefreshCw, Zap, Beaker, Radio, Wind } from 'lucide-react';
import MBEViz from './Components/MBEViz';
import PLDViz from './Components/PLDViz';
import MOCVDViz from './Components/MOCVDViz';
import CVDViz from './Components/CVDViz';

const techniques = [
    { id: 'mbe', name: 'MBE', fullName: 'Molecular Beam Epitaxy', icon: Radio, color: '#3b82f6', component: MBEViz },
    { id: 'pld', name: 'PLD', fullName: 'Pulsed Laser Deposition', icon: Zap, color: '#ef4444', component: PLDViz },
    { id: 'mocvd', name: 'MOCVD', fullName: 'Metal-Organic CVD', icon: Wind, color: '#10b981', component: MOCVDViz },
    { id: 'cvd', name: 'CVD', fullName: 'Chemical Vapor Deposition', icon: Beaker, color: '#f59e0b', component: CVDViz },
];

const ThinFilmApp = () => {
    const [activeTech, setActiveTech] = useState('mbe');
    const [isPlaying, setIsPlaying] = useState(true);
    const [temp, setTemp] = useState(600);
    const [pressure, setPressure] = useState(1e-7);

    const activeData = techniques.find(t => t.id === activeTech);
    const VizComponent = activeData.component;

    return (
        <div style={{ 
            height: '100%', 
            width: '100%', 
            background: '#050505', 
            color: '#fff', 
            display: 'flex', 
            flexDirection: 'column',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Header */}
            <div style={{ 
                padding: '20px 40px', 
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.02)',
                backdropFilter: 'blur(10px)'
            }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
                        Thin Film <span style={{ color: activeData.color }}>Synthesis Lab</span>
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>{activeData.fullName}</p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    {techniques.map(tech => (
                        <button
                            key={tech.id}
                            onClick={() => setActiveTech(tech.id)}
                            style={{
                                background: activeTech === tech.id ? tech.color : 'rgba(255,255,255,0.05)',
                                color: activeTech === tech.id ? '#000' : '#fff',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <tech.icon size={14} />
                            {tech.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Left Panel - Visualization */}
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#000' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTech}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.4, ease: 'circOut' }}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <VizComponent isPlaying={isPlaying} temp={temp} pressure={pressure} />
                        </motion.div>
                    </AnimatePresence>

                    {/* Playback Controls Overlay */}
                    <div style={{ 
                        position: 'absolute', 
                        bottom: '20px', 
                        left: '50%', 
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: '15px',
                        background: 'rgba(0,0,0,0.6)',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <button onClick={() => setIsPlaying(!isPlaying)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                        </button>
                        <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                            <RefreshCw size={20} />
                        </button>
                    </div>
                </div>

                {/* Right Panel - Controls & Info */}
                <div style={{ 
                    width: '350px', 
                    borderLeft: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(255,255,255,0.01)'
                }}>
                    {/* Parameters */}
                    <div style={{ padding: '30px', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '25px', color: activeData.color }}>
                            <Settings size={18} />
                            <h3 style={{ margin: 0, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Parameters</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#888' }}>Substrate Temp (K)</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{temp} K</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="300" 
                                    max="1200" 
                                    value={temp} 
                                    onChange={(e) => setTemp(Number(e.target.value))}
                                    style={{ width: '100%', accentColor: activeData.color }}
                                />
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#888' }}>Base Pressure (Torr)</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{pressure.toExponential(1)}</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="-9" 
                                    max="-1" 
                                    step="0.1"
                                    value={Math.log10(pressure)} 
                                    onChange={(e) => setPressure(Math.pow(10, Number(e.target.value)))}
                                    style={{ width: '100%', accentColor: activeData.color }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Info & Progress */}
                    <div style={{ 
                        padding: '30px', 
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.02)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                            <Info size={18} color="#888" />
                            <h3 style={{ margin: 0, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888' }}>Deposition Status</h3>
                        </div>
                        
                        {/* Deposition Progress */}
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#666', marginBottom: '5px' }}>
                                <span>LAYER THICKNESS</span>
                                <span>{(isPlaying ? (temp/500 * 10).toFixed(1) : 0)} nm</span>
                            </div>
                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                                <motion.div 
                                    animate={{ width: isPlaying ? '100%' : '0%' }}
                                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                                    style={{ height: '100%', background: activeData.color }}
                                />
                            </div>
                        </div>

                        <p style={{ fontSize: '0.85rem', color: '#aaa', lineHeight: '1.6' }}>
                            {activeTech === 'mbe' && "MBE is used for growing high-purity semiconductor layers with atomic precision. Essential for quantum wells and lasers."}
                            {activeTech === 'pld' && "PLD allows for the stoichiometric transfer of complex oxides like YBCO superconductors from a target to a substrate."}
                            {activeTech === 'mocvd' && "Industry standard for mass production of LEDs and solar cells. Uses metal-organic precursors in a gas phase."}
                            {activeTech === 'cvd' && "Widely used in the semiconductor industry for depositing thin films via chemical reactions on heated surfaces."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThinFilmApp;
