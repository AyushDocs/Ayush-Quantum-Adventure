import React, { useMemo } from 'react';

const AVsRPlot = ({ flux }) => {
  const width = 300;
  const height = 150;
  const padding = 30;
  const R = 40; // Solenoid radius in plot units

  const points = useMemo(() => {
    const p = [];
    const steps = 100;
    const maxR = 200;
    
    for (let i = 0; i <= steps; i++) {
      const r = (i / steps) * maxR;
      let A;
      
      if (r < R) {
        // A is proportional to r inside
        A = (flux * r) / (2 * R);
      } else {
        // A is proportional to 1/r outside
        A = (flux * R) / (2 * r);
      }
      
      const px = padding + (r / maxR) * (width - 2 * padding);
      const py = height - padding - (A * 40); // Scaling for visibility
      p.push(`${px},${py}`);
    }
    return p.join(' ');
  }, [flux, width, height, padding, R]);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }}>
        {/* Axes */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" strokeWidth="1" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#334155" strokeWidth="1" />
        
        {/* Axis labels */}
        <text x={width - padding} y={height - 10} textAnchor="end" fill="#475569" style={{ fontSize: '10px', fontFamily: 'monospace' }}>r</text>
        <text x={padding - 5} y={padding} textAnchor="end" fill="#475569" style={{ fontSize: '10px', fontFamily: 'monospace' }}>A(r)</text>

        {/* Solenoid Boundary marker */}
        <line 
          x1={padding + (R / 200) * (width - 2 * padding)} 
          y1={padding} 
          x2={padding + (R / 200) * (width - 2 * padding)} 
          y2={height - padding} 
          stroke="rgba(59, 130, 246, 0.2)" 
          strokeDasharray="4 4" 
        />
        <text 
          x={padding + (R / 200) * (width - 2 * padding)} 
          y={height - 5} 
          textAnchor="middle" 
          fill="#3b82f6" 
          style={{ fontSize: '8px', fontFamily: 'monospace' }}
        >
          R (Solenoid)
        </text>

        {/* The Curve */}
        <polyline
          points={points}
          fill="none"
          stroke="#fbbf24"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transition: 'all 0.3s ease-out' }}
        />
      </svg>
      <p style={{ fontSize: '10px', color: '#9ca3af', textAlign: 'center', marginTop: '0.5rem', fontStyle: 'italic' }}>
        Note: Vector potential A exists even where B = 0 (outside R).
      </p>
    </div>
  );
};

export default AVsRPlot;
