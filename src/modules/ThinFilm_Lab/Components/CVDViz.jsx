import React from 'react';
import { motion } from 'framer-motion';

const CVDViz = ({ isPlaying, temp, pressure }) => {
    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            {/* Chamber Background */}
            <div style={{ position: 'absolute', inset: 0, background: '#080808' }} />
            
            {/* Hot Wall Reactor Pipe */}
            <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '150px', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid #222', borderBottom: '1px solid #222' }} />

            {/* Substrate in Tube */}
            <motion.div 
                style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '200px', 
                    height: '10px', 
                    background: '#444',
                    borderRadius: '2px',
                    boxShadow: temp > 800 ? `0 0 30px rgba(245, 158, 11, ${ (temp-300)/900 })` : 'none'
                }}
                animate={{ background: temp > 800 ? '#f59e0b' : '#444' }}
            />

            {/* Reactant Molecules */}
            {isPlaying && [...Array(25)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ x: -50, y: "50%", opacity: 0 }}
                    animate={{ 
                        x: [0, 400, 800], 
                        y: ["50%", `${50 + (Math.random()-0.5)*10}%`, "50%"],
                        opacity: [0, 1, 0],
                        scale: [1, 1.2, 0.8]
                    }}
                    transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        delay: i * 0.3,
                        ease: 'linear'
                    }}
                    style={{
                        position: 'absolute',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#f59e0b',
                        boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)'
                    }}
                />
            ))}

            <div style={{ position: 'absolute', bottom: '20px', right: '20px', color: '#555', fontSize: '0.7rem' }}>
                Thermal CVD | Boundary Layer Flow
            </div>
        </div>
    );
};

export default CVDViz;
