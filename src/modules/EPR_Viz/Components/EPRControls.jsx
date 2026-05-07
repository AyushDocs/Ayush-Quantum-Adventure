import React from 'react';
import { Info, Zap, Settings2 } from 'lucide-react';

export default function EPRControls({ correlationType, setCorrelationType, entanglementStrength, setEntanglementStrength }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#60a5fa', marginBottom: '8px' }}>EPR Paradox</h2>
                <p style={{ fontSize: '0.9rem', color: '#888', lineHeight: '1.5' }}>
                    Demonstrating non-local correlations. In an entangled state, measuring one particle instantly determines the state of its partner, regardless of distance.
                </p>
            </div>

            {/* Correlation Mode */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase' }}>
                    <Zap size={16} color="#60a5fa" /> Correlation Type
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button 
                        onClick={() => setCorrelationType('parallel')}
                        style={{
                            padding: '12px',
                            borderRadius: '12px',
                            border: 'none',
                            background: correlationType === 'parallel' ? '#3b82f6' : '#1f2937',
                            color: 'white',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        PARALLEL
                    </button>
                    <button 
                        onClick={() => setCorrelationType('anti-parallel')}
                        style={{
                            padding: '12px',
                            borderRadius: '12px',
                            border: 'none',
                            background: correlationType === 'anti-parallel' ? '#a855f7' : '#1f2937',
                            color: 'white',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        ANTI-PARALLEL
                    </button>
                </div>
            </div>

            {/* Entanglement Strength */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <label style={{ fontSize: '0.8rem', color: '#888', fontWeight: 'bold' }}>Entanglement Quality</label>
                    <span style={{ color: '#60a5fa', fontSize: '0.8rem', fontWeight: 'bold' }}>{entanglementStrength}%</span>
                </div>
                <input 
                    type="range" min="0" max="100" step="1" 
                    value={entanglementStrength} onChange={(e) => setEntanglementStrength(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: '#3b82f6' }}
                />
                <p style={{ fontSize: '0.7rem', color: '#555', marginTop: '10px', lineHeight: '1.4' }}>
                    Higher quality ensures tighter synchronization between Particle A and B.
                </p>
            </div>

            {/* Quote Section */}
            <div style={{ background: 'rgba(96, 165, 250, 0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(96, 165, 250, 0.1)' }}>
                <p style={{ fontSize: '0.85rem', color: '#60a5fa', fontStyle: 'italic', margin: 0, lineHeight: '1.6' }}>
                    "I cannot seriously believe in it because the theory cannot be reconciled with the idea that physics should represent a reality in time and space, free from spooky actions at a distance."
                </p>
                <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '10px', textAlign: 'right' }}>— Albert Einstein</div>
            </div>
        </div>
    );
}
