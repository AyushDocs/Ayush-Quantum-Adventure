import React, { useState } from 'react';
import EntangledParticles from './Components/EntangledParticles';
import EPRControls from './Components/EPRControls';
import { Share2, Lock, Activity, ArrowRightLeft } from 'lucide-react';

export default function EPRApp() {
    const [correlationType, setCorrelationType] = useState('parallel');
    const [entanglementStrength, setEntanglementStrength] = useState(100);

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#60a5fa', marginBottom: '10px' }}>
                        <Share2 size={24} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Entanglement Lab</span>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-2px', margin: 0 }}>
                        EPR <span style={{ color: '#60a5fa' }}>PARADOX</span>
                    </h1>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
                    {/* Main Interaction Area */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <EntangledParticles correlationType={correlationType} />
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', color: '#60a5fa', marginBottom: '15px' }}>
                                    <Lock size={18} /> Bell's Inequality
                                </h3>
                                <p style={{ fontSize: '0.85rem', color: '#888', lineHeight: '1.6' }}>
                                    The correlations observed here cannot be explained by "local hidden variables." Bell proved that quantum mechanics violates inequalities that any local theory must satisfy.
                                </p>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', color: '#a855f7', marginBottom: '15px' }}>
                                    <Activity size={18} /> State Collapse
                                </h3>
                                <p style={{ fontSize: '0.85rem', color: '#888', lineHeight: '1.6' }}>
                                    Measurement of Particle A instantly forces Particle B into a specific state, even if they are light-years apart. This happens without any signal traveling between them.
                                </p>
                            </div>
                        </div>

                        <div style={{ padding: '30px', background: 'rgba(96, 165, 250, 0.03)', borderRadius: '24px', border: '1px solid rgba(96, 165, 250, 0.1)' }}>
                            <h4 style={{ color: '#60a5fa', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px' }}>How it Works</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <div style={{ minWidth: '32px', height: '32px', borderRadius: '50%', background: '#60a5fa', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#aaa' }}>Two particles are created in a combined quantum state (e.g., from a single photon decay).</p>
                                </div>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <div style={{ minWidth: '32px', height: '32px', borderRadius: '50%', background: '#60a5fa', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</div>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#aaa' }}>They are separated by a large distance. In our lab, dragging A moves its entangled partner B.</p>
                                </div>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <div style={{ minWidth: '32px', height: '32px', borderRadius: '50%', background: '#60a5fa', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</div>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#aaa' }}>Measurement (or interaction) with A affects B's properties <b>instantly</b>.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <EPRControls 
                        correlationType={correlationType} 
                        setCorrelationType={setCorrelationType}
                        entanglementStrength={entanglementStrength}
                        setEntanglementStrength={setEntanglementStrength}
                    />
                </div>
            </div>
        </div>
    );
}
