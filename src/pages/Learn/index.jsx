export default function LearnIndex() {
    return (
        <div style={{ maxWidth: '800px', padding: '2rem 0' }}>
            <h1 style={{ 
                fontSize: '2.5rem', 
                marginBottom: '1.5rem', 
                color: 'var(--text-color)',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '1rem'
            }}>
                System Modules
            </h1>
            
            <div style={{ lineHeight: '1.8', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                <p style={{ marginBottom: '1.5rem' }}>
                    Welcome to the core documentation and visualization suite. 
                    These modules are designed not just to explain physics, but to <strong>model</strong> it—breaking down continuous natural phenomena into discrete, computable systems.
                </p>

                <p style={{ marginBottom: '2rem' }}>
                    Each module represents a distinct physical system, built from first principles. 
                    The goal is to explore how mathematical constraints (like the Schrödinger equation) shape physical reality, and how we can represent these constraints in code.
                </p>

                <div style={{ 
                    background: 'var(--card-bg)', 
                    padding: '2rem', 
                    borderRadius: '8px', 
                    borderLeft: '4px solid var(--accent-color)' 
                }}>
                    <h3 style={{ marginTop: 0, color: 'var(--text-color)' }}>Current Focus: Diatomic Vibration</h3>
                    <p style={{ margin: 0 }}>
                        The first module (Diatomic CO) focuses on the <strong>Rigid Rotor</strong> and <strong>Harmonic Oscillator</strong> approximations. 
                        It visualizes the interplay between angular momentum (l) and vibrational energy (v) in a simple two-body system.
                    </p>
                </div>

                <h3 style={{ marginTop: '2.5rem', color: 'var(--text-color)' }}>Navigation</h3>
                <p>
                    Select a module from the sidebar to initialize the simulation environment. 
                    Controls are provided to manipulate system parameters (quantum numbers, bond stiffness) in real-time.
                </p>
            </div>
        </div>
    );
}
