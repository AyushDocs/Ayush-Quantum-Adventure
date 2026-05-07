import React from 'react';
import { NavLink } from 'react-router-dom';
import { useWindowSize } from '../../hooks/useWindowSize';
import { ChevronLeft, FileText } from 'lucide-react';

const formulaDerivations = [
    {
        id: 'schrodinger-1d',
        title: '1D Schrödinger Equation',
        desc: 'Deriving the time-independent equation from wave-particle duality and conservation of energy.',
        difficulty: 'Intermediate'
    },
    {
        id: 'landau-levels',
        title: 'Landau Quantization',
        desc: 'Derivation of discrete energy levels for an electron in a uniform magnetic field.',
        difficulty: 'Advanced'
    },
    {
        id: 'tight-binding',
        title: 'Tight-Binding Model',
        desc: 'Deriving the band structure of a crystal starting from atomic orbitals.',
        difficulty: 'Advanced'
    }
];

export default function Formulas() {
    const { width } = useWindowSize();
    const isMobile = width < 768;

    return (
        <div style={{ maxWidth: '1000px', padding: isMobile ? '1.5rem' : '4rem', margin: '0 auto' }}>
             <NavLink to="/learn" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                <ChevronLeft size={16} /> Back to Hub
            </NavLink>

            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '3rem' }}>Mathematical <span style={{ color: '#3b82f6' }}>Derivations</span></h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {formulaDerivations.map(f => (
                    <div 
                        key={f.id}
                        style={{
                            background: 'rgba(255,255,255,0.02)',
                            padding: '30px',
                            borderRadius: '24px',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#3b82f6', marginBottom: '10px' }}>
                                <FileText size={18} />
                                <span style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{f.difficulty}</span>
                            </div>
                            <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '8px' }}>{f.title}</h4>
                            <p style={{ color: '#666', fontSize: '0.85rem', lineHeight: '1.6', margin: 0, maxWidth: '600px' }}>{f.desc}</p>
                        </div>
                        <button style={{ background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6', padding: '10px 20px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}>
                            View Derivation
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
