import { Atom } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useWindowSize } from '../../hooks/useWindowSize';

export default function Navbar() {
  const { width } = useWindowSize();
  const location = useLocation();

  const isActive = (path) => {
      // Simple strict check for home, starter check for others
      if (path === '/' && location.pathname !== '/') return false;
      return location.pathname.startsWith(path);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Learn', path: '/learn' },
    { name: 'About', path: '/about' },
    { name: 'Connect', path: '/connect' },
  ];

  const isSmall = width < 768;

  return (
    <nav style={{
        borderBottom: '1px solid var(--border-color)',
        padding: isSmall ? '0.75rem 1rem' : '1rem 2rem',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--bg-color)',
        zIndex: 10,
        gap: '1rem'
    }}>
      {/* Brand - Center on mobile, Left on Desktop */}
      <div style={{ 
          display: 'flex', 
          justifyContent: isSmall ? 'center' : 'flex-start', 
          order: isSmall ? 1 : 2, 
          flex: isSmall ? '1 0 100%' : 'unset' 
      }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-color)' }}>
            <Atom color="var(--accent-color)" size={24} />
            <span style={{ fontSize: '1.1rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Ayush Docs</span>
          </Link>
      </div>

      {/* Nav Links */}
      <div style={{ 
          display: 'flex', 
          gap: isSmall ? '1rem' : '2rem', 
          order: isSmall ? 2 : 1,
          flex: isSmall ? 1 : 'unset',
          justifyContent: isSmall ? 'center' : 'flex-start'
      }}>
         <Link 
            to="/about"
            style={{
                color: isActive('/about') ? 'var(--accent-color)' : 'var(--text-color)',
                fontWeight: isActive('/about') ? 'bold' : 'normal',
                fontSize: '0.9rem'
            }}
         >
            About
         </Link>
         <Link 
            to="/learn"
            style={{
                color: isActive('/learn') ? 'var(--accent-color)' : 'var(--text-color)',
                fontWeight: isActive('/learn') ? 'bold' : 'normal',
                fontSize: '0.9rem'
            }}
         >
            Learn
         </Link>
         {isSmall && (
            <Link 
                to="/connect"
                style={{
                    color: isActive('/connect') ? 'var(--accent-color)' : 'var(--text-color)',
                    fontWeight: isActive('/connect') ? 'bold' : 'normal',
                    fontSize: '0.9rem'
                }}
            >
                Connect
            </Link>
         )}
      </div>

      {/* Connect Link - Desktop only */}
      {!isSmall && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1.5rem', order: 3 }}>
            <Link 
                to="/connect"
                style={{
                    color: isActive('/connect') ? 'var(--accent-color)' : 'var(--text-color)',
                    fontWeight: isActive('/connect') ? 'bold' : 'normal',
                    fontSize: '0.9rem'
                }}
            >
                Connect
            </Link>
        </div>
      )}
    </nav>
  );
}
