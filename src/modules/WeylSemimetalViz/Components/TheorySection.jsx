import { BookOpen, HelpCircle, AlertTriangle } from 'lucide-react';

export default function TheorySection() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* Main Theory Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                <TheoryCard 
                    title="What are Weyl Nodes?"
                    icon={<HelpCircle size={24} color="#8b5cf6" />}
                    content="In 3D crystals, band crossings can occur at discrete points called Weyl nodes. Unlike 2D Dirac points (like in Graphene), Weyl nodes are 'source' or 'sink' for Berry curvature. They have a topological charge (Chirality) and always appear in pairs of opposite signs."
                    color="#8b5cf6"
                />
                <TheoryCard 
                    title="Fermi Arcs & Topology"
                    icon={<AlertTriangle size={24} color="#10b981" />}
                    content="Fermi Arcs are anomalous surface states. On the surface of a Weyl semimetal, the projection of bulk nodes creates starting and ending points for 'open' Fermi surfaces. These arcs connect the projections of $W^+$ and $W^-$ nodes in the surface Brillouin Zone."
                    color="#10b981"
                />
            </div>

            {/* Chiral Anomaly section */}
            <div style={{ padding: '40px', borderRadius: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', color: '#ff4444' }}>
                    <BookOpen size={24} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>The Chiral Anomaly</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' }}>
                    <div style={{ color: '#888', fontSize: '0.95rem', lineHeight: '1.7' }}>
                        <p>One of the most profound effects in Weyl semimetals is the <b>Chiral Anomaly</b>. When parallel electric (E) and magnetic (B) fields are applied, electrons can be pumped from one Weyl node to another.</p>
                        <p style={{ marginTop: '15px' }}>This results in an apparent non-conservation of charge for each chirality separately, but total charge remains conserved. This leads to <b>Negative Magnetoresistance</b>, a key experimental signature of Weyl physics.</p>
                    </div>
                    <div style={{ background: '#0a0a0a', padding: '24px', borderRadius: '20px', border: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <span style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase' }}>Physics Insight</span>
                        <h4 style={{ fontSize: '1rem', color: '#fff' }}>Weyl Hamiltonian</h4>
                        <div style={{ fontSize: '1.2rem', fontFamily: 'serif', padding: '15px 0', color: '#8b5cf6' }}>
                           H = ±v<sub>F</sub> σ · (k - k₀)
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#666' }}>The momentum space separation 2k₀ is controlled by time-reversal or inversion symmetry breaking.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TheoryCard({ title, icon, content, color }) {
    return (
        <div style={{ 
            background: 'rgba(255,255,255,0.02)', 
            padding: '32px', 
            borderRadius: '24px', 
            border: `1px solid rgba(255,255,255,0.05)`,
            borderTop: `4px solid ${color}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {icon}
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>{title}</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#888', lineHeight: '1.6' }}>{content}</p>
        </div>
    );
}
