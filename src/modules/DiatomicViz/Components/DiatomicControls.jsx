import { useEffect, useState } from 'react';

export default function DiatomicControls({ state }) {
    const { 
        l, updateL, 
        v, updateV, 
        k, updateK, 
        n, updateN, 
        getEnergies,
        physicsRef 
    } = state;

    // Local state for live values (updated via requestAnimationFrame loop usually, 
    // or we can just poll the ref in a component)
    const [liveData, setLiveData] = useState({ r: 3.0, omegaRot: 0 });
    
    // We need a loop to update live data if we want "Live Dynamics" panel to be smooth
    // interacting with the physics engine. 
    // Since this component is outside the Canvas, we can't use useFrame directly.
    // We use a RAF loop.
    useEffect(() => {
        let handle;
        const tick = () => {
            if (physicsRef.current) {
                // approximate speed from last frame logic or just show static
                // legacy: rotSpeed = l * 0.02
                const rotSpeed = physicsRef.current.l * 0.02;
                setLiveData({
                    r: physicsRef.current.r_current,
                    omegaRot: rotSpeed
                });
            }
            handle = requestAnimationFrame(tick);
        };
        tick();
        return () => cancelAnimationFrame(handle);
    }, [physicsRef]);

    const energies = getEnergies();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
                <h1 style={{ color: 'var(--text-color)', margin: '0 0 5px 0', fontSize: '1.8rem' }}>Diatomic CO</h1>
                <p className="subtitle" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>Rigid Rotor • Harmonic Oscillator</p>
            </div>

            {/* Rigid Rotor */}
            <div className="card-compact" style={{background:'var(--bg-color)', padding:'15px', borderRadius:'8px', border:'1px solid var(--border-color)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'}}>
                <h3 style={{color:'var(--accent-color)', margin:'0 0 12px 0', borderBottom:'1px solid var(--border-color)', paddingBottom:'8px', fontSize:'0.95rem', fontWeight:'600'}}>
                    Rigid Rotor (Rotation)
                </h3>
                <div style={{fontFamily:'monospace', fontSize:'0.85rem', color:'var(--text-secondary)', textAlign:'center', marginBottom:'12px', background: 'var(--card-bg)', padding: '5px', borderRadius: '4px'}}>
                    E = B · l(l+1)
                </div>
                <div className="stat-row" style={{display:'flex', justifyContent:'space-between', fontFamily:'monospace', fontSize:'0.9rem', marginBottom:'8px', color:'var(--text-color)'}}>
                    <span>l: {l}</span>
                    <span>E: {energies.E_rot.toFixed(2)}</span>
                </div>
                <div className="stat-row" style={{fontFamily:'monospace', fontSize:'0.9rem', color:'var(--text-color)', marginBottom:'12px'}}>
                    <span>ω: {liveData.omegaRot.toFixed(4)}</span>
                </div>
                <div style={{display:'flex', gap:'8px', marginTop:'5px'}}>
                    <button className="btn-mini" onClick={() => updateL(l-1)} style={{flex:1, background:'var(--card-bg)', border:'1px solid var(--border-color)', color:'var(--text-color)', cursor:'pointer', padding: '6px', borderRadius: '4px', fontWeight: '500', transition: 'all 0.2s'}}>Emit</button>
                    <button className="btn-mini" onClick={() => updateL(l+1)} style={{flex:1, background:'var(--card-bg)', border:'1px solid var(--border-color)', color:'var(--text-color)', cursor:'pointer', padding: '6px', borderRadius: '4px', fontWeight: '500', transition: 'all 0.2s'}}>Absorb</button>
                </div>
            </div>

             {/* Harmonic Oscillator */}
             <div className="card-compact" style={{background:'var(--bg-color)', padding:'15px', borderRadius:'8px', border:'1px solid var(--border-color)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'}}>
                <h3 style={{color:'var(--accent-color)', margin:'0 0 12px 0', borderBottom:'1px solid var(--border-color)', paddingBottom:'8px', fontSize:'0.95rem', fontWeight:'600'}}>
                    Harmonic Oscillator
                </h3>
                <div style={{fontFamily:'monospace', fontSize:'0.85rem', color:'var(--text-secondary)', textAlign:'center', marginBottom:'12px', background: 'var(--card-bg)', padding: '5px', borderRadius: '4px'}}>
                    E = (v+½)ℏω
                </div>
                <div className="stat-row" style={{display:'flex', justifyContent:'space-between', fontFamily:'monospace', fontSize:'0.9rem', marginBottom:'8px', color:'var(--text-color)'}}>
                    <span>v: {v}</span>
                    <span>E: {energies.E_vib.toFixed(2)}</span>
                </div>
                 <div className="stat-row" style={{display:'flex', justifyContent:'space-between', fontFamily:'monospace', fontSize:'0.9rem', marginBottom:'12px', color:'var(--text-color)'}}>
                    <span>r: {liveData.r.toFixed(2)} au</span>
                    <span>k: {k.toFixed(1)}</span>
                </div>
                
                <div style={{display:'flex', gap:'8px', marginTop:'5px', marginBottom: '15px'}}>
                    <button className="btn-mini" onClick={() => updateV(v-1)} style={{flex:1, background:'var(--card-bg)', border:'1px solid var(--border-color)', color:'var(--text-color)', cursor:'pointer', padding: '6px', borderRadius: '4px', fontWeight: '500'}}>Emit</button>
                    <button className="btn-mini" onClick={() => updateV(v+1)} style={{flex:1, background:'var(--card-bg)', border:'1px solid var(--border-color)', color:'var(--text-color)', cursor:'pointer', padding: '6px', borderRadius: '4px', fontWeight: '500'}}>Absorb</button>
                </div>

                <div style={{marginTop:'8px'}}>
                     <label style={{fontSize:'0.85rem', display:'block', marginBottom: '5px', color:'var(--text-secondary)'}}>Bond Stiffness (k):</label>
                     <input 
                        type="range" min="0.5" max="3.0" step="0.1" value={k} 
                        onChange={(e) => updateK(parseFloat(e.target.value))}
                        style={{width:'100%', margin:'4px 0', accentColor: 'var(--accent-color)'}}
                     />
                </div>
            </div>

            {/* Electronic */}
             <div className="card-compact" style={{background:'var(--bg-color)', padding:'15px', borderRadius:'8px', border:'1px solid var(--border-color)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'}}>
                <h3 style={{color:'var(--accent-color)', margin:'0 0 12px 0', borderBottom:'1px solid var(--border-color)', paddingBottom:'8px', fontSize:'0.95rem', fontWeight:'600'}}>
                    Electronic State
                </h3>
                 <div className="stat-row" style={{fontFamily:'monospace', fontSize:'0.9rem', color:'var(--text-color)', marginBottom: '8px'}}>
                    <span>State (n): {n}</span>
                </div>
                <div className="stat-row" style={{fontFamily:'monospace', fontSize:'0.9rem', color:'var(--text-color)', marginBottom:'12px'}}>
                    <span>Total E: {energies.E_total.toFixed(2)}</span>
                </div>
                
                <label style={{fontSize:'0.85rem', display:'block', marginBottom: '5px', color:'var(--text-secondary)'}}>Select State:</label>
                <select 
                    value={n} onChange={(e) => updateN(parseInt(e.target.value))}
                    style={{
                        width:'100%', marginTop:'5px', 
                        background:'var(--card-bg)', color:'var(--text-color)', 
                        border:'1px solid var(--border-color)', padding:'8px',
                        outline: 'none', borderRadius: '4px', fontSize: '0.9rem'
                    }}
                >
                    <option value="0">Ground (n=0)</option>
                    <option value="1">Excited (n=1)</option>
                    <option value="2">Excited (n=2)</option>
                </select>
            </div>
            
             <p style={{fontSize:'0.75rem', color:'var(--text-secondary)', textAlign:'center', marginTop:'auto', opacity: 0.7}}>
                Simplified Model. BO approx.
            </p>
        </div>
    );
}
