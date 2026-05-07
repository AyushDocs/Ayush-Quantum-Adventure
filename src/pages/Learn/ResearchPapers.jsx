import React from 'react';
import { NavLink } from 'react-router-dom';
import { useWindowSize } from '../../hooks/useWindowSize';
import { ChevronLeft, BookOpen, Quote } from 'lucide-react';

const papers = [
    {
        id: 'tb-graphene',
        title: 'Unconventional superconductivity in magic-angle graphene superlattices',
        authors: 'Y. Cao et al., Nature (2018)',
        insight: 'The discovery of flat bands in twisted bilayer graphene. I understood this as a moiré-driven collapse of the Fermi velocity.'
    },
    {
        id: 'topo-insulators',
        title: 'Topological insulators in three dimensions',
        authors: 'L. Fu, C. L. Kane, and E. J. Mele, PRL (2007)',
        insight: 'Extending the 2D QSH effect to 3D crystals. The key insight for me was the Z2 invariant and the helical surface states.'
    }
];

export default function ResearchPapers() {
    const { width } = useWindowSize();
    const isMobile = width < 768;

    return (
        <div style={{ maxWidth: '1000px', padding: isMobile ? '1.5rem' : '4rem', margin: '0 auto' }}>
             <NavLink to="/learn" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ec4899', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                <ChevronLeft size={16} /> Back to Hub
            </NavLink>

            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '3rem' }}>Literature <span style={{ color: '#ec4899' }}>Analysis</span></h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                {papers.map(p => (
                    <div 
                        key={p.id}
                        style={{
                            background: 'rgba(255,255,255,0.02)',
                            padding: '40px',
                            borderRadius: '32px',
                            border: '1px solid var(--border-color)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ec4899', marginBottom: '20px' }}>
                            <BookOpen size={20} />
                            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Academic Paper</span>
                        </div>
                        <h4 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '10px', lineHeight: '1.4' }}>{p.title}</h4>
                        <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '30px', fontStyle: 'italic' }}>{p.authors}</p>
                        
                        <div style={{ padding: '25px', background: 'rgba(236, 72, 153, 0.05)', borderRadius: '20px', borderLeft: '4px solid #ec4899' }}>
                            <div style={{ display: 'flex', gap: '10px', color: '#ec4899', marginBottom: '10px' }}>
                                <Quote size={16} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>MY INTERPRETATION</span>
                            </div>
                            <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: '1.7', margin: 0 }}>{p.insight}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
