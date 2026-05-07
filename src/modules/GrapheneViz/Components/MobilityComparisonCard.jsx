import React from 'react';
import { Zap, Cpu, TrendingUp, ShieldAlert } from 'lucide-react';

export default function MobilityComparisonCard({ isMobile }) {
    return (
        <div style={{
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '24px',
            padding: '30px',
            border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fbbf24' }}>
                <Zap size={20} />
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Mobility & Transistor Engineering
                </span>
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Graphene vs. Silicon</h3>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' }}>
                {/* Mobility Stats */}
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <span style={{ fontSize: '0.75rem', color: '#888' }}>Silicon Mobility</span>
                            <span style={{ fontSize: '0.75rem', color: '#fff' }}>~1,400 cm²/Vs</span>
                        </div>
                        <div style={{ height: '4px', background: '#333', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: '5%', height: '100%', background: '#3b82f6' }}></div>
                        </div>
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <span style={{ fontSize: '0.75rem', color: '#888' }}>Graphene Mobility</span>
                            <span style={{ fontSize: '0.75rem', color: '#10b981' }}>~200,000 cm²/Vs</span>
                        </div>
                        <div style={{ height: '4px', background: '#333', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: '100%', height: '100%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                        </div>
                    </div>
                    <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '15px', lineHeight: '1.4' }}>
                        Graphene's charge carriers behave as massless Dirac fermions, allowing them to travel at 1/300 the speed of light without scattering.
                    </p>
                </div>

                {/* Transistor Comparison */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', color: '#3b82f6' }}>
                            <Cpu size={16} />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '0.9rem', marginBottom: '4px' }}>Standard MOSFETs</h4>
                            <p style={{ fontSize: '0.75rem', color: '#888', lineHeight: '1.4' }}>
                                Excellent <b style={{color: '#fff'}}>control</b> (on/off ratio) due to the bandgap. Perfect for digital logic but limited by switching speed.
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: '#10b981' }}>
                            <TrendingUp size={16} />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '0.9rem', marginBottom: '4px' }}>Graphene RF Transistors</h4>
                            <p style={{ fontSize: '0.75rem', color: '#888', lineHeight: '1.4' }}>
                                Ultra-<b style={{color: '#fff'}}>fast</b> switching frequencies (THz range). Hard to "turn off" due to zero bandgap, making them better for analog/RF than logic.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ 
                marginTop: '10px', 
                padding: '15px', 
                background: 'rgba(239, 68, 68, 0.05)', 
                borderRadius: '12px', 
                border: '1px solid rgba(239, 68, 68, 0.1)',
                display: 'flex',
                gap: '10px',
                alignItems: 'center'
            }}>
                <ShieldAlert size={16} color="#ef4444" />
                <p style={{ fontSize: '0.75rem', color: '#ef4444', margin: 0 }}>
                    The "Bandgap Problem": Without a bandgap, graphene transistors cannot be fully switched off, leading to high leakage current.
                </p>
            </div>
        </div>
    );
}
