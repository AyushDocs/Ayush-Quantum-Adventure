import React, { useState, useRef, useEffect } from 'react';

export default function EntangledParticles({ correlationType = 'parallel' }) {
    const [pos1, setPos1] = useState({ x: 150, y: 150 });
    const [pos2, setPos2] = useState({ x: 450, y: 150 });
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!isDragging || !containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        const newX = e.clientX - rect.left;
        const newY = e.clientY - rect.top;

        // Particle 1 is the leader
        setPos1({ x: newX, y: newY });

        // Particle 2 mimics Particle 1 but shifted by 300px (or anti-parallel)
        if (correlationType === 'parallel') {
            setPos2({ x: newX + 300, y: newY });
        } else {
            // Anti-parallel (Mirroring)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            setPos2({ 
                x: centerX + (centerX - newX), 
                y: centerY + (centerY - newY) 
            });
        }
    };

    const handleMouseUp = () => setIsDragging(false);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, correlationType]);

    return (
        <div 
            ref={containerRef}
            style={{ 
                width: '100%', 
                height: '400px', 
                background: 'radial-gradient(circle at center, #0a0a0f 0%, #050505 100%)', 
                borderRadius: '24px', 
                border: '1px solid rgba(255,255,255,0.05)',
                position: 'relative',
                overflow: 'hidden',
                cursor: isDragging ? 'grabbing' : 'grab'
            }}
        >
            {/* Quantum Background Pattern */}
            <svg style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.1 }}>
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="20" cy="20" r="1" fill="#fff" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Entanglement Link */}
            <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
                <line 
                    x1={pos1.x} y1={pos1.y} 
                    x2={pos2.x} y2={pos2.y} 
                    stroke="rgba(96, 165, 250, 0.3)" 
                    strokeWidth="2" 
                    strokeDasharray="10 5"
                />
                {/* Glow effect on the link */}
                <line 
                    x1={pos1.x} y1={pos1.y} 
                    x2={pos2.x} y2={pos2.y} 
                    stroke="rgba(96, 165, 250, 0.1)" 
                    strokeWidth="8"
                />
            </svg>

            {/* Particle 1 (Leader) */}
            <div 
                onMouseDown={() => setIsDragging(true)}
                style={{
                    position: 'absolute',
                    left: pos1.x - 25,
                    top: pos1.y - 25,
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 30% 30%, #60a5fa, #2563eb)',
                    boxShadow: '0 0 30px rgba(37, 99, 235, 0.6), inset -5px -5px 15px rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    userSelect: 'none',
                    zIndex: 2
                }}
            >
                A
            </div>

            {/* Particle 2 (Ghost/Mimic) */}
            <div 
                style={{
                    position: 'absolute',
                    left: pos2.x - 25,
                    top: pos2.y - 25,
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 30% 30%, #a855f7, #7c3aed)',
                    boxShadow: '0 0 30px rgba(124, 58, 237, 0.6), inset -5px -5px 15px rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    userSelect: 'none',
                    opacity: 0.9,
                    zIndex: 2
                }}
            >
                B
            </div>

            {/* Overlay Text */}
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Drag Particle A to observe Spooky Action
            </div>
        </div>
    );
}
