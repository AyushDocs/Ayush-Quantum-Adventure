import { BookOpen, Globe, Magnet, Layers,Info,Zap } from 'lucide-react';

export default function TheorySection({ showExchange = false }) {
    return (
        <div style={{ 
            marginTop: '20px', 
            padding: '30px', 
            background: 'var(--card-bg)', 
            borderRadius: '16px', 
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
            color: '#ccc',
            lineHeight: '1.7'
        }}>
            {/* Introduction */}
            <section>
                <h3 style={{ color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', fontSize: '1.2rem' }}>
                    <Globe size={24} /> What is this Simulation?
                </h3>
                <p>
                    This visualization represents the electronic structure of a <strong>2D Topological Insulator</strong> (specifically, a Chern Insulator model). 
                    While a normal insulator simply blocks electricity, a topological insulator is a unique state of matter that is an 
                    insulator in its interior but can possess guaranteed conducting states on its edges.
                </p>
                <p style={{ marginTop: '10px' }}>
                    The 3D graph shows the <strong>Energy Dispersion</strong> of an electron moving through a crystalline lattice. 
                    The two surfaces are the valence (lower) and conduction (upper) bands.
                </p>
            </section>

            {/* Chern Number Deep Dive */}
            <section style={{ borderTop: '1px solid #333', paddingTop: '20px' }}>
                <h3 style={{ color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', fontSize: '1.2rem' }}>
                    <Magnet size={24} /> The Chern Number: Topological DNA
                </h3>
                <p>
                    In topology, we distinguish shapes by their holes (a donut vs. a ball). In quantum mechanics, we distinguish materials 
                    by their <strong>Chern Number (C)</strong>. This number is an "invariant"—it cannot change unless the energy gap between the bands 
                    completely closes.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px' }}>
                        <strong style={{ color: '#fff' }}>C = 0 (Trivial)</strong>
                        <p style={{ fontSize: '0.85rem' }}>The wavefunctions are "flat." The material behaves like a standard piece of glass or plastic.</p>
                    </div>
                    <div style={{ background: 'rgba(147, 51, 234, 0.05)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(147, 51, 234, 0.2)' }}>
                        <strong style={{ color: 'var(--accent-color)' }}>C = 1 (Topological)</strong>
                        <p style={{ fontSize: '0.85rem' }}>The wavefunctions are "knotted." This state is mathematically guaranteed to have a Quantum Anomalous Hall Effect.</p>
                    </div>
                </div>
            </section>

            {/* Spin Splitting Section (Conditional) */}
            {showExchange && (
                <section style={{ borderTop: '1px solid #333', paddingTop: '20px' }}>
                    <h3 style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', fontSize: '1.2rem' }}>
                        <Info size={24} /> Exchange Splitting (Spin Polarization)
                    </h3>
                    <p>
                        In a typical material, Spin-Up and Spin-Down electrons are "degenerate"—they have the exact same energy. However, in a magnet, an <strong>Exchange Field (h)</strong> splits them apart.
                    </p>
                    <p style={{ marginTop: '10px' }}>
                        In this simulation, moving the <strong>h</strong> slider separates the 
                        <span style={{ color: '#fbbf24' }}> Gold (Up)</span> and <span style={{ color: '#22d3ee' }}> Cyan (Down)</span> bands. 
                        This is crucial because topological effects often only happen to <em>one</em> spin species at a time. By splitting them, we can create a <strong>Half-Metal</strong> or a <strong>Quantum Anomalous Hall Insulator</strong> where only one spin channel conducts on the edge.
                    </p>
                </section>
            )}

            {/* Magnetic Field Section */}
            <section style={{ borderTop: '1px solid #333', paddingTop: '20px' }}>
                <h3 style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', fontSize: '1.2rem' }}>
                    <Magnet size={24} /> Magnetic Potential & Momentum
                </h3>
                <p>
                    When a magnetic field is present, it is described by a <strong>Vector Potential (A)</strong>. 
                    In a crystal, this shifts the momentum of the electrons: <strong>k &rarr; k - A</strong>. 
                    This is known as the <strong>Peierls Substitution</strong>.
                </p>
                <p style={{ marginTop: '10px' }}>
                    Moving the <strong>Ax</strong> and <strong>Ay</strong> sliders physically "slides" the 
                    entire electronic structure and Berry curvature peaks across the Brillouin Zone. 
                    While the <em>global</em> topology (Chern Number) remains the same, the <em>local</em> distribution 
                    of the Berry curvature shifts, which is exactly how a magnetic field exerts force on a topological electron.
                </p>
            </section>

            {/* d-Vector Field Section */}
            <section style={{ borderTop: '1px solid #333', paddingTop: '20px' }}>
                <h3 style={{ color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', fontSize: '1.2rem' }}>
                    <BookOpen size={24} /> The Winding d-Vector Field
                </h3>
                <p>
                    The Hamiltonian of this system is defined by a 3D vector <strong>d(k)</strong>. 
                    The direction of these arrows tells us the "orientation" of the electron's spin at each momentum point.
                </p>
                <p style={{ marginTop: '10px' }}>
                    <strong>How to see the Topology:</strong> 
                    When you turn on the <em>d-Vector Field</em>, look at how the arrows behave as you move from the center 
                    to the edges of the zone.
                </p>
                <ul style={{ marginTop: '10px', fontSize: '0.9rem', paddingLeft: '20px' }}>
                    <li><strong>If C = 1:</strong> The arrows "wrap" around a sphere. It's like trying to comb a hairy ball—you can't do it without leaving a cowlick (the "knot").</li>
                    <li><strong>If C = 0:</strong> The arrows all point mostly in the same direction or pull back, failing to complete a full wrap.</li>
                </ul>
            </section>

            {/* Heatmap Guide Section */}
            <section style={{ borderTop: '1px solid #333', paddingTop: '20px' }}>
                <h3 style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', fontSize: '1.2rem' }}>
                    <Globe size={24} /> Reading the Heatmap: "Hot Spots"
                </h3>
                <p>
                    The "Hot Spots" (bright yellow/red areas) on the 2D map represent where the <strong>Berry Curvature [Å²]</strong> is highest.
                </p>
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                    <div style={{ background: 'rgba(245, 158, 11, 0.05)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #f59e0b' }}>
                        <strong>The "Topological Eye":</strong> These spots occur where the energy gap is narrowest. As the gap closes (Mass &rarr; 0), the flux is "squeezed," making the spot sharper and more intense.
                    </div>
                    <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #3b82f6' }}>
                        <strong>Hall Effect Source:</strong> Electrons "passing through" these hot spots get a massive "push" sideways. This is the origin of the Quantum Hall Effect and the Chern Number.
                    </div>
                </div>
            </section>

            {/* Quantum Hall Effect Section */}
            <section style={{ borderTop: '1px solid #333', paddingTop: '20px' }}>
                <h3 style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', fontSize: '1.2rem' }}>
                    <Zap size={24} /> The Hall Effect: Real-Space Drift
                </h3>
                <p>
                    The <strong>Quantum Anomalous Hall Effect (QAHE)</strong> is the physical "real world" result of the Berry Curvature.
                </p>
                <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #10b981', marginTop: '10px' }}>
                    <p style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>
                        "When an electric field pushes an electron forward, the Berry Curvature acts like a 'Magnetic Wind,' pushing it sideways."
                    </p>
                </div>
                <p style={{ marginTop: '15px' }}>
                    In the simulation above, the electron starts moving in a straight line. 
                    If the <strong>Chern Number</strong> is non-zero, you will see it drift vertically. This "Anomalous Velocity" 
                    is proportional to the Berry Flux—the more "knotted" the bands, the stronger the sideways current!
                </p>
            </section>

            {/* Brillouin Zone and Shapes */}
            <section style={{ borderTop: '1px solid #333', paddingTop: '20px' }}>
                <h3 style={{ color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', fontSize: '1.2rem' }}>
                    <Layers size={24} /> Brillouin Zones & Geometry
                </h3>
                <p>
                    The square grids you see represent the <strong>1st Brillouin Zone (BZ)</strong>. Because a crystal is periodic, 
                    the momentum space wraps around itself like a donut (a torus).
                </p>
                <p style={{ marginTop: '10px' }}>
                    Changing the <strong>Effective Mass</strong> essentially "strains" the donut. If the mass becomes zero, the bands 
                    touch at the center of the zone—the Dirac Point. This "gap closure" is the only way for the system to 
                    tie or untie its topological knot, changing the Chern number. 
                </p>
            </section>

            {/* Physical Units Section */}
            <section style={{ borderTop: '1px solid #333', paddingTop: '20px', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px' }}>
                <h3 style={{ color: '#aaa', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', fontSize: '1rem', textTransform: 'uppercase' }}>
                    <BookOpen size={20} /> Physical Scales & Units
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '0.85rem' }}>
                    <div>
                        <strong style={{ color: 'var(--accent-color)' }}>Energy (E, M):</strong> Electron Volts (eV)
                    </div>
                    <div>
                        <strong style={{ color: 'var(--accent-color)' }}>Momentum (k, A):</strong> Inverse Angstroms (Å⁻¹)
                    </div>
                    <div>
                        <strong style={{ color: 'var(--accent-color)' }}>Berry Curvature (Ω):</strong> Square Angstroms (Å²)
                    </div>
                    <div style={{ fontStyle: 'italic', color: '#666' }}>
                        Note: 1 Å = 10⁻¹⁰ meters (Atomic scale)
                    </div>
                </div>
            </section>
        </div>
    );
}
