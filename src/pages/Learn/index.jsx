import { useWindowSize } from '../../hooks/useWindowSize';
import { NavLink } from 'react-router-dom';
import { Layers, FileText, BookOpen, ChevronRight } from 'lucide-react';

export default function LearnIndex() {
    const { width } = useWindowSize();
    const isMobile = width < 768;

    return (
        <div style={{ maxWidth: '1000px', padding: isMobile ? '1.5rem' : '4rem', margin: '0 auto' }}>
            <div style={{ marginBottom: '4rem' }}>
                <h1 style={{ 
                    fontSize: isMobile ? '2rem' : '3.5rem', 
                    fontWeight: '900',
                    letterSpacing: '-2px',
                    marginBottom: '1rem', 
                    color: 'var(--text-color)',
                }}>
                    Knowledge <span style={{ color: 'var(--accent-color)' }}>Hub</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', lineHeight: '1.6' }}>
                    Explore quantum phenomena through interactive simulations, deep mathematical derivations, and academic literature.
                </p>
            </div>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
                gap: '25px' 
            }}>
                <CategoryCard 
                    to="/learn/visualizations"
                    icon={<Layers size={32} />}
                    title="Visualizations"
                    desc="Interactive quantum labs and real-time physical simulations."
                    color="var(--accent-color)"
                />
                <CategoryCard 
                    to="/learn/formulas"
                    icon={<FileText size={32} />}
                    title="Formulas"
                    desc="Step-by-step derivations of complex quantum mechanics equations."
                    color="#3b82f6"
                />
                <CategoryCard 
                    to="/learn/papers"
                    icon={<BookOpen size={32} />}
                    title="Research Papers"
                    desc="Official academic papers with personal insights and summaries."
                    color="#ec4899"
                />
            </div>

            {/* Footer Note */}
            <div style={{ marginTop: '5rem', padding: '2rem', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <p>Welcome to the core documentation and visualization suite. These modules are designed not just to explain physics, but to <strong>model</strong> it—breaking down continuous natural phenomena into discrete, computable systems.</p>
            </div>
        </div>
    );
}

function CategoryCard({ to, icon, title, desc, color }) {
    return (
        <NavLink 
            to={to}
            style={{
                textDecoration: 'none',
                display: 'block',
                background: 'var(--card-bg)',
                padding: '35px',
                borderRadius: '24px',
                border: '1px solid var(--border-color)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden'
            }}
            className="category-card"
        >
            <div style={{ color: color, marginBottom: '20px' }}>{icon}</div>
            <h3 style={{ color: 'var(--text-color)', fontSize: '1.4rem', marginBottom: '12px', fontWeight: 'bold' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>{desc}</p>
            
            <div style={{ 
                marginTop: '25px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                color: color, 
                fontSize: '0.8rem', 
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1px'
            }}>
                Explore <ChevronRight size={14} />
            </div>

            <style>{`
                .category-card:hover {
                    transform: translateY(-10px);
                    border-color: ${color};
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                }
            `}</style>
        </NavLink>
    );
}
