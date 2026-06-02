import React from 'react';
import { NavLink } from 'react-router-dom';
import { learnModules } from '../../modules/registry';
import { useWindowSize } from '../../hooks/useWindowSize';
import { ChevronLeft } from 'lucide-react';

export default function Visualizations() {
    const { width } = useWindowSize();
    const isMobile = width < 768;

    return (
        <div style={{ maxWidth: '1200px', padding: isMobile ? '1.5rem' : '4rem', margin: '0 auto' }}>
             <NavLink to="/learn" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-color)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                <ChevronLeft size={16} /> Back to Hub
            </NavLink>

            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '3rem' }}>Interactive <span style={{ color: 'var(--accent-color)' }}>Labs</span></h2>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                {learnModules.map(m => (
                    <NavLink 
                        key={m.id} 
                        to={`/learn/visualizations/${m.id}`}
                        style={{
                            textDecoration: 'none',
                            background: 'var(--card-bg)',
                            padding: '30px',
                            borderRadius: '24px',
                            border: '1px solid var(--border-color)',
                            transition: 'all 0.3s'
                        }}
                        className="module-card"
                    >
                        <div style={{ color: m.color || m.themeColor || 'var(--accent-color)', marginBottom: '15px' }}>
                            {m.icon ? <m.icon size={24} /> : <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid' }} />}
                        </div>
                        <h4 style={{ color: 'var(--text-color)', fontSize: '1.2rem', marginBottom: '10px', fontWeight: 'bold' }}>{m.name}</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>{m.description}</p>
                        
                        <style>{`
                            .module-card:hover {
                                transform: translateY(-5px);
                                border-color: ${m.color || m.themeColor || 'var(--accent-color)'};
                                box-shadow: 0 10px 25px rgba(0,0,0,0.08);
                            }
                        `}</style>
                    </NavLink>
                ))}
            </div>
        </div>
    );
}
