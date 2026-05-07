import React from 'react';
import { motion } from 'framer-motion';

const PLDViz = ({ isPlaying, temp, pressure }) => {
    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            {/* Chamber Background */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000 100%)' }} />
            
            {/* Substrate */}
            <motion.div 
                style={{ 
                    position: 'absolute', 
                    top: '20%', 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    width: '180px', 
                    height: '15px', 
                    background: '#444',
                    borderRadius: '2px',
                    boxShadow: temp > 700 ? `0 0 30px rgba(239, 68, 68, ${ (temp-300)/900 })` : 'none'
                }}
                animate={{ background: temp > 700 ? '#ef4444' : '#444' }}
            />

            {/* Target Carousel */}
            <div style={{ position: 'absolute', bottom: '15%', left: '50%', transform: 'translateX(-50%)' }}>
                <div style={{ width: '100px', height: '30px', background: '#333', borderRadius: '4px', border: '1px solid #444' }}>
                    {/* Active Target Area */}
                    <div style={{ width: '40px', height: '10px', background: '#555', margin: '10px auto', borderRadius: '2px' }} />
                </div>
            </div>

            {/* Laser Beam */}
            {isPlaying && (
                <motion.div
                    initial={{ x: -200, y: 500, opacity: 0 }}
                    animate={{ x: [null, 0], y: [null, 400], opacity: [0, 1, 0] }}
                    transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 1 }}
                    style={{
                        position: 'absolute',
                        bottom: '15%',
                        left: '50%',
                        width: '2px',
                        height: '200px',
                        background: '#00ffff',
                        boxShadow: '0 0 20px #00ffff',
                        transform: 'rotate(-45deg)',
                        transformOrigin: 'bottom'
                    }}
                />
            )}

            {/* Plasma Plume */}
            {isPlaying && (
                <motion.div
                    initial={{ scale: 0, opacity: 0, y: 0 }}
                    animate={{ 
                        scale: [0, 2, 3], 
                        opacity: [0, 0.8, 0],
                        y: -250
                    }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.1 }}
                    style={{
                        position: 'absolute',
                        bottom: '18%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '40px',
                        height: '60px',
                        background: 'radial-gradient(ellipse at bottom, #ef4444 0%, transparent 70%)',
                        filter: 'blur(10px)',
                        borderRadius: '50%'
                    }}
                />
            )}

            <div style={{ position: 'absolute', top: '20px', left: '20px', color: '#555', fontSize: '0.7rem' }}>
                Excimer Laser (λ=248nm)
            </div>
        </div>
    );
};

export default PLDViz;
