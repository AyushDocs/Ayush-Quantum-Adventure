import { Terminal } from 'lucide-react';
import { useWindowSize } from '../hooks/useWindowSize';

export default function About() {
    const { width } = useWindowSize();
    return (
        <div className="container" style={{ maxWidth: '1000px', marginTop: '5rem' }}>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: width < 768 ? '1fr' : '1fr 2fr', 
                gap: width < 768 ? '2rem' : '4rem',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '2rem'
            }}>
                {/* Left Column: Context */}
                <div>
                    <div style={{ 
                        fontFamily: 'monospace', 
                        color: 'var(--accent-color)', 
                        fontSize: '0.9rem',
                        marginBottom: '1rem',
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px'
                    }}>
                        <Terminal size={14} />
                        <span>usr/bin/identity</span>
                    </div>
                    <h1 style={{ 
                        fontSize: width < 768 ? '2.5rem' : '3.5rem', 
                        fontWeight: '700', 
                        lineHeight: '1',
                        margin: '0 0 1.5rem 0',
                        letterSpacing: '-1px',
                        color: 'var(--text-color)'
                    }}>
                        Ayush.
                    </h1>
                    <div style={{ 
                        fontSize: '1rem', 
                        color: 'var(--text-secondary)', 
                        fontFamily: 'monospace',
                        borderLeft: '2px solid var(--accent-color)',
                        paddingLeft: '1rem'
                    }}>
                        Systems. Verification. <br />
                        First-Principles.
                    </div>
                </div>

                {/* Right Column: The Signal */}
                <div style={{ fontSize: width < 768 ? '1.1rem' : '1.25rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                    <p style={{ marginBottom: '2rem' }}>
                        I’m interested in how complex systems are <span style={{color:'var(--text-color)', fontWeight:500}}>structured</span>, <span style={{color:'var(--text-color)', fontWeight:500}}>constrained</span>, and <span style={{color:'var(--text-color)', fontWeight:500}}>made reliable</span>.
                        I approach problems by reducing them to their essential components and building upward.
                    </p>
                    
                    <p style={{ marginBottom: '2rem' }}>
                        I work primarily in software, but I often think in terms borrowed from mathematics and physics.
                        <span style={{ 
                            background: 'rgba(184, 134, 11, 0.1)', 
                            padding: '2px 6px', 
                            borderRadius: '4px', 
                            color: 'var(--accent-color)',
                            margin: '0 4px'
                        }}>Quantum mechanics</span> 
                         is one such area—not as an identity, but as a framework that rewards precision.
                    </p>

                    <div style={{ 
                        background: 'var(--card-bg)', 
                        padding: '1.5rem', 
                        borderRadius: '4px', 
                        borderLeft: '4px solid var(--border-color)',
                        fontStyle: 'italic',
                        color: 'var(--text-secondary)',
                        fontSize: '1.1rem'
                    }}>
                        "I prefer models over metaphors and verification over confidence."
                    </div>
                </div>
            </div>

            {/* Footer / Specs */}
            <div style={{ 
                marginTop: '5rem', 
                borderTop: '1px solid var(--border-color)', 
                paddingTop: '2rem',
                display: 'flex',
                gap: '3rem',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)'
            }}>
                <div>
                    <span style={{ display:'block', color:'var(--text-secondary)', opacity:0.7, marginBottom:'5px' }}>FOCUS</span>
                    Correctness, Maintainability, Simulation
                </div>
                <div>
                    <span style={{ display:'block', color:'var(--text-secondary)', opacity:0.7, marginBottom:'5px' }}>METHOD</span>
                    Analytical, Reductionist, Deterministic
                </div>
                <div>
                    <span style={{ display:'block', color:'var(--text-secondary)', opacity:0.7, marginBottom:'5px' }}>STATUS</span>
                    Active Learning
                </div>
            </div>
        </div>
    );
}
