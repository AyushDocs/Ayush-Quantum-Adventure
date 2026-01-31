import { Activity, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWindowSize } from '../hooks/useWindowSize';

export default function Home() {
    const { width } = useWindowSize();
    return (
        <div className="container" style={{ marginTop: '5rem', maxWidth: '1000px' }}>
            {/* Hero Section */}
            <div style={{ marginBottom: '4rem', borderLeft: '2px solid var(--accent-color)', paddingLeft: '1.5rem' }}>
                <div style={{ 
                    fontFamily: 'monospace', 
                    color: 'var(--accent-color)', 
                    fontSize: '0.9rem', 
                    marginBottom: '1rem',
                    letterSpacing: '2px',
                    textTransform: 'uppercase'
                }}>
                    Engineering Log / 0x01
                </div>
                <div style={{ 
                    marginBottom: '2rem',
                    display: 'flex',
                    flexDirection: width < 768 ? 'column-reverse' : 'row',
                    gap: '2rem',
                    alignItems: 'center'
                }}>
                    <div style={{ flex: 2 }}>
                        <h1 style={{ 
                            fontSize: width < 768 ? '3.5rem' : '5rem', 
                            fontWeight: '800', 
                            lineHeight: '0.9', 
                            margin: '0 0 1.5rem 0',
                            color: 'var(--text-color)',
                            letterSpacing: '-2px'
                        }}>
                            SYSTEM<br />LOG.
                        </h1>
                        <div style={{ 
                            color: 'var(--text-secondary)', 
                            fontSize: width < 768 ? '1.1rem' : '1.25rem', 
                            maxWidth: '700px', 
                            lineHeight: '1.7',
                            marginBottom: '1rem'
                        }}>
                            <p style={{ marginBottom: '1rem' }}>
                                I design and verify high-assurance software systems, with a focus on correctness and reliability. 
                                My work spans full-stack engineering, computational physics, and formal modeling.
                            </p>
                        </div>
                    </div>
                    
                    {/* Profile Photo */}
                    <div style={{ 
                        flex: 1,
                        display: 'flex', 
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%'
                    }}>
                        <img 
                            src="/Ayush-Quantum-Adventure/ayush-profile.jpg" 
                            alt="Ayush" 
                            style={{ 
                                width: width < 768 ? '220px' : '280px',
                                height: width < 768 ? '220px' : '280px',
                                objectFit: 'cover',
                                borderRadius: '12px',
                                border: '2px solid var(--border-color)',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.08)'
                            }} 
                        />
                    </div>
                </div>
            </div>

            {/* Modules Grid */}
            <h2 style={{ fontSize:'1.5rem', borderBottom:'1px solid var(--border-color)', paddingBottom:'1rem', marginBottom:'2rem', color:'var(--text-secondary)', fontWeight:'400' }}>
                Active <span style={{ color: 'var(--accent-color)', fontWeight: '600' }}>Modules</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Active Card */}
                <Link to="/learn/diatomic-vibration" style={{ 
                    display: 'block', 
                    background: 'var(--card-bg)', 
                    padding: '2.5rem', 
                    borderRadius: '12px', 
                    border: '1px solid var(--border-color)',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.borderColor = 'var(--accent-color)';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
                >
                    <div style={{ 
                        position: 'absolute', top: 0, right: 0, 
                        background: 'var(--accent-color)', color: '#fff', 
                        padding: '5px 10px', fontSize: '0.7rem', fontWeight: 'bold',
                        borderBottomLeftRadius: '8px'
                    }}>
                        ONLINE
                    </div>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                        <Activity size={40} color="var(--accent-color)" strokeWidth={1.5} />
                    </div>
                    
                    <h2 style={{ fontSize: '1.8rem', margin: '0 0 1rem 0', color: 'var(--accent-color)' }}>Diatomic CO</h2>
                    
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                        Interactive visualization of rigid rotor and harmonic oscillator approximations for Carbon Monoxide. 
                        Explore energy eigenvalues and phase space dynamics in real-time.
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-color)', fontWeight: 'bold' }}>
                        Initialize Module <ArrowRight size={16} />
                    </div>
                </Link>

                {/* Coming Soon Card */}
                <div style={{ 
                    background: '#f9f9f9', // Slightly generic light for inactive 
                    padding: '2.5rem', 
                    borderRadius: '12px', 
                    border: '1px dashed var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    opacity: 0.8
                }}>
                    <BookOpen size={40} color="#999" strokeWidth={1.5} style={{ marginBottom: '1.5rem' }} />
                    <h2 style={{ fontSize: '1.8rem', margin: '0 0 1rem 0', color: '#999' }}>Future Systems</h2>
                    <ul style={{ paddingLeft: '1.2rem', color: '#888', lineHeight: '1.8' }}>
                        <li>Hydrogen Atom (Analytical)</li>
                        <li>Lattice Perturbation</li>
                        <li>Trotterization Errors</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
