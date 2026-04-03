import { Activity, ArrowRight, BookOpen, Layers, Zap, Layers as LayersIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWindowSize, getEffectiveWidth } from '../hooks/useWindowSize';
import { learnModules } from '../modules/registry';

export default function Home() {
    const { width } = useWindowSize();
    const effectiveWidth = getEffectiveWidth(width);
    const isMobile = effectiveWidth < 768;

    return (
        <div className="container" style={{ marginTop: isMobile ? '3rem' : '5rem', maxWidth: '1200px', paddingBottom: '5rem' }}>
            {/* Hero Section */}
            <div style={{ marginBottom: isMobile ? '3rem' : '5rem', borderLeft: '4px solid var(--accent-color)', paddingLeft: isMobile ? '1.5rem' : '2.5rem' }}>
                <div style={{ 
                    fontFamily: 'monospace', 
                    color: 'var(--accent-color)', 
                    fontSize: '0.9rem', 
                    marginBottom: '1rem',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    fontWeight: 'bold'
                }}>
                    Engineering Log / 0x02 — Global Deployment
                </div>
                <div style={{ 
                    marginBottom: '2.5rem',
                    display: 'flex',
                    flexDirection: isMobile ? 'column-reverse' : 'row',
                    gap: isMobile ? '2.5rem' : '4rem',
                    alignItems: 'center'
                }}>
                    <div style={{ flex: 2 }}>
                        <h1 style={{ 
                            fontSize: isMobile ? '3rem' : '5.5rem', 
                            fontWeight: '900', 
                            lineHeight: '0.85', 
                            margin: '0 0 1.5rem 0',
                            color: 'var(--text-color)',
                            letterSpacing: '-4px'
                        }}>
                            QUANTUM<br /><span style={{ color: 'var(--accent-color)' }}>ADVENTURE</span>.
                        </h1>
                        <div style={{ 
                            color: 'var(--text-secondary)', 
                            fontSize: isMobile ? '1.05rem' : '1.3rem', 
                            maxWidth: '750px', 
                            lineHeight: '1.6',
                            fontWeight: '400',
                            marginBottom: '2rem'
                        }}>
                            <p style={{ marginBottom: '1.2rem' }}>
                                Interactive lab systems focused on computational symmetry, topological matter, and high-assurance scientific modeling. 
                                Designed by <span style={{ color: 'var(--text-color)', fontWeight: 'bold' }}>Ayush</span> to explore the correctness and beauty of physics.
                            </p>
                            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                <div style={{ padding: '6px 12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '6px', color: '#10b981', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                    10 ACTIVE MODULES
                                </div>
                                <div style={{ padding: '6px 12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '6px', color: '#3b82f6', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                    PWA CAPABLE
                                </div>
                                <div style={{ padding: '6px 12px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '6px', color: '#8b5cf6', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                    THREE.JS VISUALS
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Profile Photo - Integrated seamlessly */}
                    <div style={{ flex: 0.8, position: 'relative' }}>
                        <div style={{ 
                            position: 'absolute', top: '-10px', right: '-10px', bottom: '-10px', left: '-10px',
                            border: '1px solid var(--accent-color)', borderRadius: '16px', opacity: 0.3
                        }} />
                        <img 
                            src={`${import.meta.env.BASE_URL}ayush-profile.jpg`} 
                            alt="Ayush" 
                            style={{ 
                                width: '100%',
                                aspectRatio: '1/1',
                                objectFit: 'cover',
                                borderRadius: '12px',
                                border: '1px solid var(--border-color)',
                                display: 'block',
                                position: 'relative',
                                zIndex: 1
                            }} 
                        />
                    </div>
                </div>
            </div>

            {/* Modules Grid Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.2rem', marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.8rem', margin: 0, color: 'var(--text-color)', fontWeight: '800', letterSpacing: '-1px' }}>
                    Interactive <span style={{ color: 'var(--accent-color)' }}>Labs</span>
                </h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LayersIcon size={14} /> Total: {learnModules.length}
                </div>
            </div>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))', 
                gap: '2.5rem' 
            }}>
                {learnModules.map((module) => {
                    const Icon = module.icon || Activity;
                    return (
                        <Link 
                            key={module.id}
                            to={`/learn/${module.id}`} 
                            style={{ 
                                display: 'flex',
                                flexDirection: 'column',
                                background: 'var(--card-bg)', 
                                padding: '2rem', 
                                borderRadius: '16px', 
                                border: '1px solid var(--border-color)',
                                textDecoration: 'none',
                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.05)'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                                e.currentTarget.style.borderColor = module.themeColor || 'var(--accent-color)';
                                e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.1)`;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
                            }}
                        >
                            <div style={{ 
                                position: 'absolute', top: '15px', right: '15px', 
                                color: module.themeColor || 'var(--accent-color)', 
                                opacity: 0.8
                            }}>
                                <Zap size={18} />
                            </div>
                            
                            <div style={{ 
                                width: '50px', 
                                height: '50px', 
                                borderRadius: '12px', 
                                background: module.themeColor ? `${module.themeColor}15` : 'rgba(16, 185, 129, 0.1)', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                marginBottom: '1.5rem'
                            }}>
                                <Icon size={28} color={module.themeColor || 'var(--accent-color)'} strokeWidth={2} />
                            </div>
                            
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                    {module.category || 'Physics Lab'} — {module.difficulty || 'Advanced'}
                                </div>
                                <h3 style={{ fontSize: '1.7rem', margin: '0 0 1rem 0', color: 'var(--text-color)', fontWeight: '800', lineHeight: 1.1 }}>
                                    {module.name}
                                </h3>
                                
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '2rem' }}>
                                    {module.description}
                                </p>
                            </div>

                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px', 
                                color: module.themeColor || 'var(--accent-color)', 
                                fontWeight: '900',
                                fontSize: '0.85rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                INITIALIZE SYSTEM <ArrowRight size={14} />
                            </div>
                        </Link>
                    );
                })}

                {/* Coming Soon Integrated as a standard-sized card */}
                <div style={{ 
                    background: 'rgba(255,255,255,0.02)', 
                    padding: '2rem', 
                    borderRadius: '16px', 
                    border: '1px dashed var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    opacity: 0.6,
                    height: '100%'
                }}>
                    <BookOpen size={30} color="#666" strokeWidth={1.5} style={{ marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.4rem', margin: '0 0 1rem 0', color: '#666', fontWeight: '700' }}>Future Models</h3>
                    <ul style={{ paddingLeft: '1.2rem', color: '#888', fontSize: '0.85rem', lineHeight: '1.8', margin: 0 }}>
                        <li>Quantum Computing (Trotterization)</li>
                        <li>Lattice Perturbations</li>
                        <li>Analytic Hydrogen Model</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
