import { Atom } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
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

  return (
    <nav style={{
        borderBottom: '1px solid var(--border-color)',
        padding: '1rem 2rem',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        background: 'var(--bg-color)',
        zIndex: 10
    }}>
      {/* Left Links */}
      <div style={{ display: 'flex', gap: '2rem' }}>
         <Link 
            to="/about"
            style={{
                color: isActive('/about') ? 'var(--accent-color)' : 'var(--text-color)',
                fontWeight: isActive('/about') ? 'bold' : 'normal'
            }}
         >
            About
         </Link>
         <Link 
            to="/learn"
            style={{
                color: isActive('/learn') ? 'var(--accent-color)' : 'var(--text-color)',
                fontWeight: isActive('/learn') ? 'bold' : 'normal'
            }}
         >
            Learn
         </Link>
      </div>

      {/* Center Brand */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-color)' }}>
            <Atom color="var(--accent-color)" size={28} />
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Ayush Docs</span>
          </Link>
      </div>

      {/* Right Links */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '2rem' }}>
        <Link 
            to="/connect"
            style={{
                color: isActive('/connect') ? 'var(--accent-color)' : 'var(--text-color)',
                fontWeight: isActive('/connect') ? 'bold' : 'normal'
            }}
         >
            Connect
         </Link>
      </div>
    </nav>
  );
}
