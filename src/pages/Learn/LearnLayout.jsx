import { NavLink, Outlet } from 'react-router-dom';

const Sidebar = () => {
    const modules = [
        { name: 'Introduction', path: '/learn' },
        { name: 'Diatomic Vibration', path: '/learn/diatomic-vibration' },
    ];

    return (
        <aside style={{
            width: '280px',
            borderRight: '1px solid var(--border-color)',
            background: 'var(--card-bg)',
            height: '100%',
            padding: '2rem 1.5rem',
            overflowY: 'auto'
        }}>
            <h3 style={{ 
                marginBottom: '1.5rem', 
                paddingBottom: '0.5rem', 
                borderBottom: '1px solid var(--border-color)',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--text-secondary)' 
            }}>
                Modules
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {modules.map(mod => (
                    <NavLink 
                        key={mod.path} 
                        to={mod.path}
                        end={mod.path === '/learn'} // Exact match for index
                        style={({ isActive }) => ({
                            padding: '12px',
                            borderRadius: '6px',
                            backgroundColor: isActive ? 'var(--bg-color)' : 'transparent',
                            color: isActive ? 'var(--accent-color)' : 'var(--text-color)',
                            border: isActive ? '1px solid var(--border-color)' : '1px solid transparent',
                            fontWeight: isActive ? '600' : 'normal',
                            display: 'block',
                            transition: 'all 0.2s'
                        })}
                    >
                        {mod.name}
                    </NavLink>
                ))}
            </div>
        </aside>
    );
};

export default function LearnLayout() {
    return (
        <div style={{ display: 'flex', height: '100%' }}>
            {/* Sidebar only appears in Layout */}
            <div style={{ height: 'calc(100vh - 64px)' }}> {/* Navbar height approx 64px */}
               <Sidebar />
            </div>
            
            {/* Main Content Area */}
            <div style={{ flex: 1, overflow: 'auto', height: 'calc(100vh - 64px)', padding: '2rem' }}>
                <Outlet />
            </div>
        </div>
    );
}
