import emailjs from '@emailjs/browser';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Mail, MessageSquare, Send, Terminal, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useWindowSize } from '../hooks/useWindowSize';

export default function Connect() {
    const { width } = useWindowSize();
    const [status, setStatus] = useState("idle"); // idle, sending, success, error
    const [errorMessage, setErrorMessage] = useState("");
    const formRef = useRef();

    useEffect(() => {
        emailjs.init('OYVS88f1t935G1y1e');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const serviceID = 'default_service';
        const templateID = 'emailjs_template_profile';
        
        setStatus("sending");

        try {
            await emailjs.sendForm(serviceID, templateID, formRef.current);
            setStatus("success");
            e.target.reset();
            setTimeout(() => setStatus("idle"), 5000);
        } catch (error) {
            setErrorMessage(error?.text || "Transmission failed. Systems unreachable.");
            setStatus("error");
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            className="container" 
            style={{ maxWidth: '1000px', marginTop: width < 768 ? '2rem' : '5rem', marginLeft: 'auto', marginRight: 'auto', padding: '0 1.5rem' }}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: width < 768 ? '1fr' : 'minmax(300px, 1fr) 2fr', 
                gap: width < 768 ? '2rem' : '4rem',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '2rem'
            }}>
                {/* Left Column: Context */}
                <motion.div variants={itemVariants}>
                    <div style={{ 
                        fontFamily: 'monospace', 
                        color: 'var(--accent-color)', 
                        fontSize: '0.9rem',
                        marginBottom: '1rem',
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px'
                    }}>
                        <Terminal size={14} />
                        <span>usr/bin/transmit</span>
                    </div>
                    <h1 style={{ 
                        fontSize: width < 768 ? '2.5rem' : '3.5rem', 
                        fontWeight: '700', 
                        lineHeight: '1',
                        margin: '0 0 1.5rem 0',
                        letterSpacing: '-1px',
                        color: 'var(--text-color)'
                    }}>
                        Connect.
                    </h1>
                    <div style={{ 
                        fontSize: '1rem', 
                        color: 'var(--text-secondary)', 
                        fontFamily: 'monospace',
                        borderLeft: '2px solid var(--accent-color)',
                        paddingLeft: '1rem',
                        lineHeight: '1.6'
                    }}>
                        Open channel for technical inquiry, <br />
                        collaboration, or model verification.
                    </div>

                    <div style={{ marginTop: '3rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <Mail size={14} color="var(--accent-color)" />
                            <span>ayush@example.com</span>
                        </p>
                        <p style={{ opacity: 0.6, fontSize: '0.8rem', fontStyle: 'italic' }}>
                            Note: Requires EmailJS configuration for active transmission.
                        </p>
                    </div>
                </motion.div>

                {/* Right Column: Interactive Form */}
                <motion.div variants={itemVariants}>
                    <form 
                        ref={formRef}
                        onSubmit={handleSubmit}
                        style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '1.5rem',
                            padding: width < 768 ? '1.5rem' : '2rem',
                            background: 'var(--card-bg)',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                        }}
                    >
                        <div style={{ display: 'grid', gridTemplateColumns: width < 480 ? '1fr' : '1fr 1fr', gap: '1.5rem' }}>
                            <div style={{ position: 'relative' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>
                                    <User size={14} /> NAME
                                </label>
                                <input 
                                    type="text" name="name" required
                                    placeholder="Identity"
                                    style={{ 
                                        width: '100%', padding: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', 
                                        color: 'var(--text-color)', borderRadius: '4px', outline: 'none', transition: 'border-color 0.2s',
                                        fontSize: '1rem'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>
                                    <Mail size={14} /> EMAIL
                                </label>
                                <input 
                                    type="email" name="email" required
                                    placeholder="contact@origin.com"
                                    style={{ 
                                        width: '100%', padding: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', 
                                        color: 'var(--text-color)', borderRadius: '4px', outline: 'none', transition: 'border-color 0.2s',
                                        fontSize: '1rem'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>
                                <MessageSquare size={14} /> SIGNAL
                            </label>
                            <textarea 
                                name="message" rows="6" required
                                placeholder="Describe the system constraints or inquiry..."
                                style={{ 
                                    width: '100%', padding: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', 
                                    color: 'var(--text-color)', borderRadius: '4px', outline: 'none', transition: 'border-color 0.2s',
                                    fontFamily: 'inherit', resize: 'vertical', fontSize: '1rem'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                            ></textarea>
                        </div>

                        <AnimatePresence mode="wait">
                            {status === "success" ? (
                                <motion.div 
                                    key="success"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '10px', 
                                        color: '#4caf50', 
                                        background: 'rgba(76, 175, 80, 0.1)',
                                        padding: '12px',
                                        borderRadius: '4px',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <CheckCircle2 size={18} />
                                    <span>Transmission successful. Signal received.</span>
                                </motion.div>
                            ) : status === "error" ? (
                                <motion.div 
                                    key="error"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '10px', 
                                        color: '#f44336', 
                                        background: 'rgba(244, 67, 54, 0.1)',
                                        padding: '12px',
                                        borderRadius: '4px',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <AlertCircle size={18} />
                                    <span>{errorMessage}</span>
                                </motion.div>
                            ) : null}
                        </AnimatePresence>

                        <motion.button 
                            type="submit" 
                            disabled={status === "sending"}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn" 
                            style={{ 
                                alignSelf: 'flex-start', 
                                padding: '12px 40px', 
                                background: 'var(--accent-color)', 
                                color: '#000', 
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                fontWeight: '600',
                                opacity: status === "sending" ? 0.7 : 1,
                                cursor: status === "sending" ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {status === "sending" ? "TRANSMITTING..." : (
                                <>
                                    <span>SEND SIGNAL</span>
                                    <Send size={16} />
                                </>
                            )}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </motion.div>
    );
}

