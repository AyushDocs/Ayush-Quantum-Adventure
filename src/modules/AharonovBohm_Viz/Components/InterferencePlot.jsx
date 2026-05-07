import React, { useMemo } from 'react';

const InterferencePlot = ({ phaseShift, splitDistance }) => {
  const width = 300;
  const height = 150;
  const padding = 20;

  const points = useMemo(() => {
    const p = [];
    const steps = 100;
    const xRange = 10;
    
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * xRange - xRange / 2;
      // Frequency k increases with splitDistance (d)
      // Pattern: 1 + cos(k*d*x + phase)
      const k = 10 * splitDistance;
      const intensity = 1 + Math.cos(k * x + phaseShift);
      
      const px = padding + (i / steps) * (width - 2 * padding);
      const py = height - padding - (intensity / 2) * (height - 2 * padding);
      p.push(`${px},${py}`);
    }
    return p.join(' ');
  }, [phaseShift, width, height, padding]);

  // Wave function visualization
  const [time, setTime] = React.useState(0);
  React.useEffect(() => {
    let frame;
    const animate = () => {
      setTime(t => t + 0.05);
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  const wave1 = useMemo(() => {
    const p = [];
    for (let i = 0; i <= 50; i++) {
      const x = i;
      const y = Math.sin(x * 0.4 - time);
      p.push(`${padding + i * 5},${height/4 + y * 20}`);
    }
    return p.join(' ');
  }, [time, padding, height]);

  const wave2 = useMemo(() => {
    const p = [];
    for (let i = 0; i <= 50; i++) {
      const x = i;
      const y = Math.sin(x * 0.4 - time + phaseShift);
      p.push(`${padding + i * 5},${height/4 + y * 20}`);
    }
    return p.join(' ');
  }, [time, phaseShift, padding, height]);

  const sumWave = useMemo(() => {
    const p = [];
    for (let i = 0; i <= 50; i++) {
      const x = i;
      // The sum of two waves: sin(A) + sin(A + d)
      const y = Math.sin(x * 0.4 - time) + Math.sin(x * 0.4 - time + phaseShift);
      p.push(`${padding + i * 5},${height/4 + y * 20}`);
    }
    return p.join(' ');
  }, [time, phaseShift, padding, height]);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
      {/* Wave Meeting Visualization */}
      <div style={{ width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase' }}>Wave Phase Overlap</div>
          <div style={{ fontSize: '10px', color: '#60a5fa', fontWeight: 'bold', fontFamily: 'monospace' }}>
            Δφ = {(phaseShift / Math.PI).toFixed(2)}π
          </div>
        </div>
        <svg viewBox={`0 0 ${width} ${height/2}`} style={{ width: '100%', height: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
          {/* Baseline */}
          <line x1={padding} y1={height/4} x2={width-padding} y2={height/4} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          
          <polyline points={wave1} fill="none" stroke="#3b82f6" strokeWidth="1.5" style={{ opacity: 0.4 }} />
          <polyline points={wave2} fill="none" stroke="#a855f7" strokeWidth="1.5" style={{ opacity: 0.4 }} />
          
          {/* Sum Wave */}
          <polyline points={sumWave} fill="none" stroke="#fff" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.5))' }} />
        </svg>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem', fontSize: '8px', color: '#666' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '0.5rem', height: '2px', backgroundColor: '#3b82f6' }}></div>
            <span>Path 1</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '0.5rem', height: '2px', backgroundColor: '#a855f7' }}></div>
            <span>Path 2</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '0.5rem', height: '2px', backgroundColor: '#fff' }}></div>
            <span>Combined</span>
          </div>
        </div>
      </div>

      {/* Intensity Pattern */}
      <div style={{ width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '10px', color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Fringe Intensity Profile</div>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }}>
          <defs>
            <linearGradient id="plotGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Axes */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" strokeWidth="1" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#334155" strokeWidth="1" />
          
          {/* Fringe labels (visual only) */}
          <text x={width/2} y={height - 5} textAnchor="middle" fill="#475569" style={{ fontSize: '8px', fontFamily: 'monospace' }}>Detector Position (y)</text>
          <text x={5} y={height/2} textAnchor="middle" fill="#475569" style={{ fontSize: '8px', fontFamily: 'monospace' }} transform={`rotate(-90, 5, ${height/2})`}>Intensity</text>

          {/* The Pattern */}
          <polyline
            points={points}
            fill="none"
            stroke="url(#plotGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ transition: 'all 0.3s ease-out' }}
          />

          {/* Reference line (optional) */}
          <line 
            x1={width/2} y1={padding} 
            x2={width/2} y2={height-padding} 
            stroke="white" strokeWidth="1" 
            strokeDasharray="2 2" 
            style={{ opacity: 0.2 }}
          />
        </svg>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '10px', color: '#6b7280', fontFamily: 'monospace' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <div style={{ width: '0.5rem', height: '0.5rem', backgroundColor: '#a855f7', borderRadius: '50%' }}></div>
          <span>Maxima</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <div style={{ width: '0.5rem', height: '0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.3)', border: '1px solid rgba(59, 130, 246, 0.5)', borderRadius: '50%' }}></div>
          <span>Minima</span>
        </div>
      </div>
      <div style={{ 
        marginTop: '0.5rem', 
        padding: '0.75rem', 
        backgroundColor: 'rgba(0,0,0,0.2)', 
        borderRadius: '0.5rem', 
        fontSize: '0.75rem', 
        color: '#94a3b8',
        lineHeight: '1.4'
      }}>
        <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '0.25rem' }}>Effect Breakdown:</div>
        • <span style={{ color: '#60a5fa' }}>Current (I):</span> Shifts the <strong>Purple Wave</strong> relative to the <strong>Blue Wave</strong>. This shifts the peaks of the <strong>White Pattern</strong>.<br/>
        • <span style={{ color: '#a855f7' }}>Separation:</span> Changing the path distance alters the "fringe density". Closer paths create wider fringes; farther paths create narrower, denser fringes.
      </div>
    </div>
  );
};

export default InterferencePlot;
