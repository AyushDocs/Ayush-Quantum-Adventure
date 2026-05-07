import React, { useState, useMemo } from 'react';
import ABVisualizer from './Components/ABVisualizer';
import ABControls from './Components/ABControls';
import InterferencePlot from './Components/InterferencePlot';
import AVsRPlot from './Components/AVsRPlot';

const AharonovBohmApp = () => {
  const [flux, setFlux] = useState(0.5);
  const [splitDistance, setSplitDistance] = useState(0.4);
  const [showAField, setShowAField] = useState(true);
  const [isQuantum, setIsQuantum] = useState(true);
  const [currentMode, setCurrentMode] = useState('dc'); // 'dc', 'ac', 'pulsed'
  const [baseFlux, setBaseFlux] = useState(0.5);

  // Constants
  const phi0 = 1.0; 

  // Variation Logic
  React.useEffect(() => {
    if (currentMode === 'dc') {
      setFlux(baseFlux);
      return;
    }

    let frame;
    const start = Date.now();
    
    const update = () => {
      const t = (Date.now() - start) / 1000;
      if (currentMode === 'ac') {
        setFlux(baseFlux * Math.cos(t * 2));
      } else if (currentMode === 'pulsed') {
        const pulse = Math.abs(Math.sin(t * 2)) > 0.8 ? baseFlux : 0;
        setFlux(pulse);
      }
      frame = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(frame);
  }, [currentMode, baseFlux]);

  const phaseShift = useMemo(() => {
    if (!isQuantum) return 0;
    return (2 * Math.PI * flux) / phi0;
  }, [flux, isQuantum]);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0c',
      color: '#ffffff',
      padding: '2rem',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              margin: 0,
              background: 'linear-gradient(to right, #60a5fa, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Aharonov-Bohm Effect
            </h1>
            <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>
              Exploring the non-local nature of the vector potential A.
            </p>
          </div>
          <div>
            <button 
              onClick={() => setIsQuantum(!isQuantum)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: isQuantum ? '#2563eb' : '#1f2937',
                color: 'white',
                boxShadow: isQuantum ? '0 0 15px rgba(37, 99, 235, 0.5)' : 'none'
              }}
            >
              {isQuantum ? 'Quantum Mode' : 'Classical Mode'}
            </button>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
          {/* Top Row: Visualizer and Controls */}
          <div style={{ 
            gridColumn: 'span 8',
            backgroundColor: '#121215', 
            borderRadius: '1rem', 
            border: '1px solid rgba(255, 255, 255, 0.05)', 
            overflow: 'hidden', 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            minHeight: '500px'
          }}>
            <ABVisualizer 
              flux={flux} 
              splitDistance={splitDistance} 
              showAField={showAField} 
              phaseShift={phaseShift}
            />
            
            {/* Legend / Overlay */}
            <div style={{ 
              position: 'absolute', 
              bottom: '1.5rem', 
              left: '1.5rem', 
              padding: '1rem', 
              backgroundColor: 'rgba(0, 0, 0, 0.4)', 
              backdropFilter: 'blur(8px)', 
              borderRadius: '0.75rem', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              fontSize: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '50%', backgroundColor: '#3b82f6', boxShadow: '0 0 5px #3b82f6' }}></div>
                <span>Electron Path 1 (Top)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '50%', backgroundColor: '#a855f7', boxShadow: '0 0 5px #a855f7' }}></div>
                <span>Electron Path 2 (Bottom)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '50%', backgroundColor: 'rgba(234, 179, 8, 0.5)', border: '1px solid rgba(234, 179, 8, 0.8)' }}></div>
                <span>Vector Potential A</span>
              </div>
              <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ color: '#60a5fa', fontFamily: 'monospace' }}>Δφ = {phaseShift.toFixed(2)} rad</span>
              </div>
            </div>
          </div>

          <div style={{ gridColumn: 'span 4' }}>
            <div style={{ backgroundColor: '#121215', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', height: '100%' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'semibold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <span style={{ width: '0.5rem', height: '1.5rem', backgroundColor: '#3b82f6', borderRadius: '9999px' }}></span>
                Simulation Parameters
              </h2>
              <ABControls 
                flux={baseFlux} 
                setFlux={setBaseFlux}
                currentMode={currentMode}
                setCurrentMode={setCurrentMode}
                splitDistance={splitDistance}
                setSplitDistance={setSplitDistance}
                showAField={showAField}
                setShowAField={setShowAField}
              />
            </div>
          </div>

          {/* Bottom Row: Plots */}
          <div style={{ gridColumn: 'span 5' }}>
            <div style={{ backgroundColor: '#121215', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', height: '100%' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'semibold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <span style={{ width: '0.5rem', height: '1.5rem', backgroundColor: '#fbbf24', borderRadius: '9999px' }}></span>
                Vector Potential A(r)
              </h2>
              <AVsRPlot flux={flux} />
            </div>
          </div>

          <div style={{ gridColumn: 'span 7' }}>
            <div style={{ backgroundColor: '#121215', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', height: '100%' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'semibold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <span style={{ width: '0.5rem', height: '1.5rem', backgroundColor: '#a855f7', borderRadius: '9999px' }}></span>
                Interference Pattern
              </h2>
              <InterferencePlot phaseShift={phaseShift} splitDistance={splitDistance} />
              <div style={{ 
                marginTop: '1.5rem', 
                padding: '1rem', 
                backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                borderRadius: '0.75rem', 
                border: '1px solid rgba(59, 130, 246, 0.2)', 
                fontSize: '0.875rem', 
                lineHeight: '1.5', 
                color: '#bfdbfe' 
              }}>
                {isQuantum ? (
                  <>
                    <strong>Quantum Interference:</strong> The relative phase Δφ = ∫ A·dl / (ħ/e) causes the pattern to shift. Maxima occur when Δφ = 2πn. 
                    <br/><br/>
                    <em>Current Flow:</em> The flux Φ is proportional to the current in the solenoid. Increasing current shifts the fringe pattern.
                  </>
                ) : (
                  "In classical physics, since the Lorentz force is zero along the paths (B=0), the particle's trajectory and phase remain unaffected by the flux inside the solenoid."
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default AharonovBohmApp;
