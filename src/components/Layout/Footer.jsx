import { ExternalLink, Github, Globe } from 'lucide-react';

export default function Footer() {
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
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1.5rem',
                padding: '0' // Override container padding for alignment inside footer
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    
                    {/* Brand / Copy */}
                    <div>
                        <span style={{ fontWeight: 'bold', color: 'var(--text-color)' }}>Ayush Docs</span> / System Log
                        <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.7 }}>
                            &copy; {new Date().getFullYear()} Ayush. All constraints satisfied.
                        </div>
                    </div>

                    {/* Links */}
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <a href="https://ayushdocs.github.io" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-color)', textDecoration: 'none' }}>
                            <Globe size={16} />
                            <span>Main Portfolio</span>
                            <ExternalLink size={12} style={{ opacity: 0.5 }} />
                        </a>
                        
                        <a href="https://github.com/AyushDocs" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-color)', textDecoration: 'none' }}>
                            <Github size={16} />
                            <span>GitHub</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
