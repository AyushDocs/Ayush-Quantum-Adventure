import React from 'react';
import { motion } from 'framer-motion';

const MBEViz = ({ isPlaying, temp, pressure }) => {
    const atoms = Array.from({ length: 15 });

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            {/* Chamber Background */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, #111 0%, #000 100%)' }} />
            
            {/* Substrate */}
            <motion.div 
                style={{ 
                    position: 'absolute', 
                    top: '20%', 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    width: '200px', 
                    height: '20px', 
                    background: temp > 800 ? '#ff4d00' : '#444',
                    borderRadius: '4px',
                    boxShadow: temp > 800 ? `0 0 40px rgba(255, 77, 0, ${ (temp - 300) / 900 })` : 'none',
                    border: '1px solid rgba(255,255,255,0.1)'
                }} 
                animate={{
                    background: temp > 800 ? '#ff4d00' : temp > 600 ? '#aa4400' : '#444',
                }}
            />

            {/* Effusion Cells (Sources) */}
            <div style={{ position: 'absolute', bottom: '10%', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '80px' }}>
                {[0, 1, 2].map(i => (
                    <div key={i} style={{ position: 'relative' }}>
                        <div style={{ width: '40px', height: '60px', background: '#222', borderRadius: '4px', border: '1px solid #333' }} />
                        <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', width: '20px', height: '20px', borderRadius: '50%', background: '#3b82f6', filter: 'blur(10px)', opacity: isPlaying ? 0.6 : 0 }} />
                        
                        {/* Molecular Beams */}
                        {isPlaying && atoms.map((_, j) => (
                            <motion.div
                                key={j}
                                initial={{ y: 0, x: 0, opacity: 0 }}
                                animate={{ 
                                    y: -600 - Math.random() * 100, 
                                    x: (Math.random() - 0.5) * 60,
                                    opacity: [0, 1, 1, 0] 
                                }}
                                transition={{ 
                                    duration: 2 + Math.random() * 2, 
                                    repeat: Infinity, 
                                    delay: j * 0.2 + i * 0.5,
                                    ease: 'linear'
                                }}
                                style={{ 
                                    position: 'absolute', 
                                    bottom: '60px', 
                                    left: '20px', 
                                    width: '4px', 
                                    height: '4px', 
                                    borderRadius: '50%', 
                                    background: '#3b82f6',
                                    boxShadow: '0 0 10px #3b82f6'
                                }}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* Labels */}
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', color: '#444', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                UHV Chamber (P ≈ {pressure.toExponential(1)} Torr)
            </div>
        </div>
    );
};

export default MBEViz;
