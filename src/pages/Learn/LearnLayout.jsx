import { NavLink, Outlet } from 'react-router-dom';
import { useWindowSize } from '../../hooks/useWindowSize';
import { learnModules } from '../../modules/registry';

const Sidebar = () => {
    const modules = [
        { name: 'Introduction', path: '/learn' },
        ...learnModules.map(m => ({ name: m.name, path: `/learn/${m.id}` }))
    ];

    const { width } = useWindowSize();
    const isMobile = width < 768;

    return (
        <aside style={{
            width: isMobile ? '100%' : '280px',
            borderRight: isMobile ? 'none' : '1px solid var(--border-color)',
            borderBottom: isMobile ? '1px solid var(--border-color)' : 'none',
            background: 'var(--card-bg)',
            height: isMobile ? 'auto' : '100%',
            padding: isMobile ? '1rem' : '2rem 1.5rem',
            overflowY: 'auto'
        }}>
            <h3 style={{ 
                marginBottom: '1rem', 
                paddingBottom: '0.5rem', 
                borderBottom: '1px solid var(--border-color)',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--text-secondary)' 
            }}>
                Modules
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {modules.map(mod => (
                    <NavLink 
                        key={mod.path} 
                        to={mod.path}
                        end={mod.path === '/learn'} // Exact match for index
                        style={({ isActive }) => ({
                            padding: isMobile ? '8px 16px' : '12px',
                            borderRadius: '6px',
                            backgroundColor: isActive ? 'var(--bg-color)' : 'transparent',
                            color: isActive ? 'var(--accent-color)' : 'var(--text-color)',
                            border: isActive ? '1px solid var(--border-color)' : '1px solid transparent',
                            fontWeight: isActive ? '600' : 'normal',
                            display: 'block',
                            textAlign: isMobile ? 'center' : 'left',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap'
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
    const { width } = useWindowSize();
    const isMobile = width < 768;

    return (
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: '100%' }}>
            {/* Sidebar only appears in Layout */}
            <div style={{ height: isMobile ? 'auto' : 'calc(100vh - 64px)' }}>
               <Sidebar />
            </div>
            
            {/* Main Content Area */}
            <div style={{ flex: 1, overflow: 'auto', height: isMobile ? 'auto' : 'calc(100vh - 64px)' }}>
                <Outlet />
            </div>
        </div>
    );
}
