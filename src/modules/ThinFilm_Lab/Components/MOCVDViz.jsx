import React from 'react';
import { motion } from 'framer-motion';

const MOCVDViz = ({ isPlaying, temp, pressure }) => {
    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            {/* Chamber Background */}
            <div style={{ position: 'absolute', inset: 0, background: '#0a0a0a' }} />
            
            {/* Showerhead (Gas Inlet) */}
            <div style={{ position: 'absolute', top: '0', left: '0', right: '0', height: '60px', background: 'linear-gradient(to bottom, #222, #111)', borderBottom: '1px solid #333' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '20px' }}>
                    {[...Array(10)].map((_, i) => (
                        <div key={i} style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#444' }} />
                    ))}
                </div>
            </div>

            {/* Susceptor (Heated) */}
            <motion.div 
                style={{ 
                    position: 'absolute', 
                    bottom: '20%', 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    width: '300px', 
                    height: '30px', 
                    background: '#333',
                    borderRadius: '4px',
                    boxShadow: temp > 900 ? `0 0 50px rgba(16, 185, 129, ${ (temp-300)/900 * 0.5 })` : 'none'
                }}
                animate={{ background: temp > 900 ? '#10b981' : temp > 600 ? '#065f46' : '#333' }}
            />

            {/* Gas Flows */}
            {isPlaying && [...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ y: 60, x: Math.random() * 800, opacity: 0 }}
                    animate={{ 
                        y: [60, 600, 600], 
                        x: [null, null, 1200],
                        opacity: [0, 0.5, 0.5, 0] 
                    }}
                    transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        delay: i * 0.2,
                        ease: 'linear'
                    }}
                    style={{
                        position: 'absolute',
                        width: '2px',
                        height: '10px',
                        background: 'linear-gradient(to bottom, #10b981, transparent)',
                        filter: 'blur(1px)'
                    }}
                />
            ))}

            <div style={{ position: 'absolute', top: '80px', right: '20px', color: '#10b981', fontSize: '0.7rem', opacity: 0.6 }}>
                Precursors: TMGa, NH₃
            </div>
        </div>
    );
};

export default MOCVDViz;
