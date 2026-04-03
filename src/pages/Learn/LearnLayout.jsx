import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useWindowSize, getEffectiveWidth } from '../../hooks/useWindowSize';
import { useZoomLevel } from '../../hooks/useZoomLevel';
import { learnModules } from '../../modules/registry';
import { Search, Menu, X, ChevronRight, ChevronsUp } from 'lucide-react';

const Sidebar = () => {
    const modules = [
        { name: 'Introduction', path: '/learn' },
        ...learnModules.map(m => ({ name: m.name, path: `/learn/${m.id}` }))
    ];

    const { width } = useWindowSize();
    const effectiveWidth = getEffectiveWidth(width);
    const isMobile = effectiveWidth < 768;
    const [searchTerm, setSearchTerm] = useState('');

    const filteredModules = modules.filter(m => 
        m.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <aside style={{
            width: isMobile ? '100%' : '280px',
            borderRight: isMobile ? 'none' : '1px solid var(--border-color)',
            borderBottom: isMobile ? '1px solid var(--border-color)' : 'none',
            background: 'var(--card-bg)',
            height: isMobile ? 'auto' : '100%',
            maxHeight: isMobile ? '300px' : 'none',
            padding: isMobile ? '1rem' : '1.5rem 1.2rem',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            <h3 style={{ 
                marginBottom: '1rem', 
                paddingBottom: '0.5rem', 
                borderBottom: '1px solid var(--border-color)',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--text-secondary)',
                flexShrink: 0
            }}>
                Modules
            </h3>

            {/* Search Bar */}
            <div style={{ position: 'relative', marginBottom: '1rem', flexShrink: 0 }}>
                <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', display: 'flex' }}>
                    <Search size={13} />
                </div>
                <input 
                    type="text" 
                    placeholder="Search modules..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '5px 10px 5px 30px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-color)',
                        color: 'var(--text-color)',
                        outline: 'none',
                        fontSize: '0.75rem',
                        transition: 'all 0.2s',
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
                    }}
                />
            </div>

            <div className="custom-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto' }}>
                {filteredModules.length > 0 ? (
                    filteredModules.map(mod => (
                        <NavLink 
                            key={mod.path} 
                            to={mod.path}
                            end={mod.path === '/learn'}
                            style={({ isActive }) => ({
                                padding: isMobile ? '8px 16px' : '10px 12px',
                                borderRadius: '6px',
                                backgroundColor: isActive ? 'var(--bg-color)' : 'transparent',
                                color: isActive ? 'var(--accent-color)' : 'var(--text-color)',
                                border: isActive ? '1px solid var(--border-color)' : '1px solid transparent',
                                fontWeight: isActive ? '600' : 'normal',
                                display: 'block',
                                textAlign: isMobile ? 'center' : 'left',
                                transition: 'all 0.2s',
                                fontSize: '0.9rem',
                                lineHeight: '1.4'
                            })}
                        >
                            {mod.name}
                        </NavLink>
                    ))
                ) : (
                    <div style={{ padding: '20px 10px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        No modules found.
                    </div>
                )}
            </div>
        </aside>
    );
};

export default function LearnLayout() {
    const { width } = useWindowSize();
    const effectiveWidth = getEffectiveWidth(width);
    const isMobile = effectiveWidth < 768;
    const zoomLevel = useZoomLevel();
    const scale = zoomLevel / 100;
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <div 
            style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row', 
                overflow: isMobile ? 'auto' : 'hidden',
                height: isMobile ? 'auto' : '100%',
                width: '100%',
                position: 'relative'
            }}
        >
            {/* Sidebar (Desktop only) */}
            {!isMobile && (
                <div style={{ minHeight: '100%', overflow: 'hidden', flexShrink: 0 }}>
                    <Sidebar />
                </div>
            )}
            
            {/* Mobile Drawer Toggle Button */}
            {isMobile && (
                <button 
                    onClick={() => setIsDrawerOpen(true)}
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        width: '56px',
                        height: '56px',
                        borderRadius: '28px',
                        background: 'var(--accent-color)',
                        color: '#000',
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        cursor: 'pointer'
                    }}
                >
                    <Menu size={24} strokeWidth={3} />
                </button>
            )}

            {/* Mobile Drawer Overlay */}
            {isMobile && isDrawerOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 2000,
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div style={{ 
                        width: '85%', 
                        maxWidth: '320px', 
                        height: '100%', 
                        background: 'var(--card-bg)',
                        boxShadow: '10px 0 30px rgba(0,0,0,0.5)',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        <button 
                            onClick={() => setIsDrawerOpen(false)}
                            style={{
                                position: 'absolute',
                                right: '-50px',
                                top: '20px',
                                background: 'transparent',
                                border: 'none',
                                color: '#fff',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={32} />
                        </button>
                        
                        <div style={{ flex: 1, padding: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid var(--border-color)' }}>
                                <Menu size={20} color="var(--accent-color)" />
                                <span style={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>Module Menu</span>
                            </div>
                            
                            {/* Inner scroll container for Sidebar */}
                            <div style={{ flex: 1, overflow: 'auto' }} onClick={() => setIsDrawerOpen(false)}>
                                <Sidebar />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
            `}</style>
            
            <div className="custom-scrollbar" style={{ 
                flex: 1, 
                overflow: 'auto', 
                minHeight: isMobile ? 'auto' : '100%',
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                width: isMobile ? '100%' : `${100/scale}%`,
                height: `${100/scale}%`,
            }}>
                <Outlet />
            </div>
        </div>
    );
}
