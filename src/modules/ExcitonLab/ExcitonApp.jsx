import React, { useState } from 'react';
import ExcitonVisualizer from './Components/ExcitonVisualizer';
import { Layers, Zap, Info, Activity } from 'lucide-react';

const modes = [
    { id: 'exciton', name: 'Exciton', desc: 'Bound state of an electron and a hole. The building block of optoelectronics in 2D materials.' },
    { id: 'trion', name: 'Trion', desc: 'A charged exciton consisting of three carriers (e.g., 2e + 1h). Observed in doped semiconductors.' },
    { id: 'biexciton', name: 'Biexciton', desc: 'A molecule-like state formed by two excitons. Crucial for non-linear optics and quantum emitters.' },
    { id: 'charged-biexciton', name: 'Charged Biexciton', desc: 'A complex five-body state (e.g., 3e + 2h). A rare but significant many-body correlation.' }
];

export default function ExcitonApp() {
    const [activeMode, setActiveMode] = useState('exciton');

    const currentMode = modes.find(m => m.id === activeMode);

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: '#050505', 
            color: '#fff', 
            padding: '40px', 
            fontFamily: 'Inter, sans-serif' 
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#f43f5e', marginBottom: '10px' }}>
                        <Layers size={24} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Excitonic Spectroscopy Lab</span>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-2px', margin: 0 }}>
                        MANY-BODY <span style={{ color: '#f43f5e' }}>QUASIPARTICLES</span>
                    </h1>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px' }}>
                    {/* Interaction Area */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <ExcitonVisualizer mode={activeMode} />
                        
                        <div style={{ padding: '30px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ fontSize: '1.2rem', color: '#f43f5e', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Info size={20} /> Physics of {currentMode.name}s
                            </h3>
                            <p style={{ fontSize: '0.95rem', color: '#aaa', lineHeight: '1.6', marginBottom: '20px' }}>
                                {currentMode.desc}
                            </p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <StatCard label="Binding Energy" value={activeMode === 'exciton' ? '300-500 meV' : '20-40 meV'} />
                                <StatCard label="Bohr Radius" value="~1-2 nm" />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Controls */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ background: '#111', padding: '24px', borderRadius: '24px', border: '1px solid #222' }}>
                            <h4 style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#666', marginBottom: '20px', textTransform: 'uppercase' }}>Select Quasiparticle State</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {modes.map(mode => (
                                    <button 
                                        key={mode.id}
                                        onClick={() => setActiveMode(mode.id)}
                                        style={{
                                            padding: '16px',
                                            borderRadius: '16px',
                                            border: '1px solid',
                                            borderColor: activeMode === mode.id ? '#f43f5e' : 'transparent',
                                            background: activeMode === mode.id ? 'rgba(244, 63, 94, 0.1)' : 'rgba(255,255,255,0.02)',
                                            color: activeMode === mode.id ? '#f43f5e' : '#888',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <span style={{ fontWeight: 'bold' }}>{mode.name}</span>
                                        {activeMode === mode.id && <Activity size={16} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ background: 'rgba(244, 63, 94, 0.05)', padding: '24px', borderRadius: '24px', border: '1px solid rgba(244, 63, 94, 0.1)' }}>
                            <h4 style={{ color: '#f43f5e', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '15px' }}>EXPERIMENTAL CONTEXT</h4>
                            <p style={{ fontSize: '0.85rem', color: '#888', lineHeight: '1.6' }}>
                                These states are primarily detected via <b>Photoluminescence (PL)</b> spectroscopy. In 2D materials like MoS₂ or WSe₂, the reduced screening leads to exceptionally high binding energies.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value }) {
    return (
        <div style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.7rem', color: '#555', textTransform: 'uppercase', marginBottom: '5px' }}>{label}</div>
            <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#eee' }}>{value}</div>
        </div>
    );
}
