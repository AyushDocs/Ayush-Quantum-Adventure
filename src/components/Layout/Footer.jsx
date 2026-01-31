import { ExternalLink, Github, Globe } from 'lucide-react';
import { useWindowSize } from '../../hooks/useWindowSize';

export default function Footer() {
    const { width } = useWindowSize();
    const isSmall = width < 768;
    return (
        <footer style={{
            borderTop: '1px solid var(--border-color)',
            marginTop: 'auto',
            padding: '2rem',
            background: 'var(--card-bg)',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem'
        }}>
            <div className="container" style={{ 
                padding: isSmall ? '0 1rem' : '0'
            }}>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: isSmall ? '1fr' : '1fr auto', 
                    alignItems: 'center', 
                    gap: isSmall ? '2rem' : '1rem' 
                }}>
                    
                    {/* Brand / Copy */}
                    <div style={{ textAlign: isSmall ? 'center' : 'left' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--text-color)' }}>Ayush Docs</span> / System Log
                        <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.7 }}>
                            &copy; {new Date().getFullYear()} Ayush. All constraints satisfied.
                        </div>
                    </div>

                    {/* Links */}
                    <div style={{ 
                        display: 'grid', 
                        gridAutoFlow: 'column', 
                        gap: isSmall ? '1.5rem' : '2rem', 
                        justifyContent: isSmall ? 'center' : 'end',
                        alignItems: 'center' 
                    }}>
                        <a href="https://ayushdocs.github.io" target="_blank" rel="noopener noreferrer" style={{ display: 'grid', gridAutoFlow: 'column', alignItems: 'center', gap: '6px', color: 'var(--text-color)', textDecoration: 'none' }}>
                            <Globe size={16} />
                            <span>Main Portfolio</span>
                            <ExternalLink size={12} style={{ opacity: 0.5 }} />
                        </a>
                        
                        <a href="https://github.com/AyushDocs" target="_blank" rel="noopener noreferrer" style={{ display: 'grid', gridAutoFlow: 'column', alignItems: 'center', gap: '6px', color: 'var(--text-color)', textDecoration: 'none' }}>
                            <Github size={16} />
                            <span>GitHub</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
