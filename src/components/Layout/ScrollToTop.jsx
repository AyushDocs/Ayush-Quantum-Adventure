import { useState, useEffect } from 'react';
import { ChevronsUp } from 'lucide-react';
import { useWindowSize } from '../../hooks/useWindowSize';

export default function ScrollToTop({ containerRef }) {
    const [isVisible, setIsVisible] = useState(false);
    const { width } = useWindowSize();
    const isMobile = width < 768;

    useEffect(() => {
        const toggleVisibility = () => {
            if (containerRef?.current) {
                if (containerRef.current.scrollTop > 300) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            } else {
                // If no containerRef, check window scroll
                if (window.pageYOffset > 300) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            }
        };

        const container = containerRef?.current || window;
        container.addEventListener('scroll', toggleVisibility);
        return () => container.removeEventListener('scroll', toggleVisibility);
    }, [containerRef]);

    const scrollToTop = () => {
        if (containerRef?.current) {
            containerRef.current.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            style={{
                position: 'fixed',
                bottom: isMobile ? '90px' : '30px', // Above the mobile menu button
                right: '25px',
                width: '45px',
                height: '45px',
                borderRadius: '12px',
                background: 'rgba(30, 30, 30, 0.8)',
                backdropFilter: 'blur(10px)',
                color: 'var(--accent-color)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 1500,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: 'fadeInUp 0.3s ease-out'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--accent-color)';
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(30, 30, 30, 0.8)';
                e.currentTarget.style.color = 'var(--accent-color)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            <ChevronsUp size={24} strokeWidth={2.5} />
            <style>{`
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </button>
    );
}
