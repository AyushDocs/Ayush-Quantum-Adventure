import React, { useMemo } from 'react';

const ABVisualizer = ({ flux, splitDistance, showAField, phaseShift }) => {
  const width = 800;
  const height = 600;
  
  // Solenoid params
  const solenoidRadius = 40;
  const centerX = width / 2;
  const centerY = height / 2;

  // Path params
  const startX = 100;
  const endX = 700;
  const splitY = splitDistance * 200; // scaling

  const path1 = useMemo(() => {
    return `M ${startX} ${centerY} 
            C ${startX + 100} ${centerY}, ${centerX - 100} ${centerY - splitY}, ${centerX} ${centerY - splitY}
            C ${centerX + 100} ${centerY - splitY}, ${endX - 100} ${centerY}, ${endX} ${centerY}`;
  }, [centerX, centerY, splitY]);

  const path2 = useMemo(() => {
    return `M ${startX} ${centerY} 
            C ${startX + 100} ${centerY}, ${centerX - 100} ${centerY + splitY}, ${centerX} ${centerY + splitY}
            C ${centerX + 100} ${centerY + splitY}, ${endX - 100} ${centerY}, ${endX} ${centerY}`;
  }, [centerX, centerY, splitY]);

  // A-field lines (circular around solenoid)
  const aFieldLines = useMemo(() => {
    const lines = [];
    if (!showAField) return lines;
    for (let r = solenoidRadius + 20; r < 250; r += 30) {
      lines.push(r);
    }
    return lines;
  }, [showAField, solenoidRadius]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      minHeight: '500px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom right, #0a0a0c, #1a1a20)'
    }}>
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: '600px',
          filter: 'drop-shadow(0 25px 25px rgba(0, 0, 0, 0.5))'
        }}
      >
        <defs>
          <linearGradient id="solenoidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <radialGradient id="solenoidInner">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.2" />
          </radialGradient>
        </defs>

        {/* A-field background lines */}
        {aFieldLines.map((r, i) => (
          <circle
            key={i}
            cx={centerX}
            cy={centerY}
            r={r}
            fill="none"
            stroke="rgba(234, 179, 8, 0.15)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            className="animate-[spin_20s_linear_infinite]"
            style={{ transformOrigin: 'center', animationDirection: i % 2 === 0 ? 'normal' : 'reverse' }}
          />
        ))}

        {/* Paths */}
        <path 
          d={path1} 
          fill="none" 
          stroke="#3b82f6" 
          strokeWidth="3" 
          strokeLinecap="round"
          filter="url(#glow)"
          className="opacity-80"
        />
        <path 
          d={path2} 
          fill="none" 
          stroke="#a855f7" 
          strokeWidth="3" 
          strokeLinecap="round"
          filter="url(#glow)"
          className="opacity-80"
        />

        {/* Waves traveling along paths */}
        <g>
          <circle r="6" fill="#60a5fa" filter="url(#glow)">
            <animateMotion dur="3s" repeatCount="indefinite" path={path1} />
          </circle>
          <circle r="6" fill="#c084fc" filter="url(#glow)">
            <animateMotion dur="3s" repeatCount="indefinite" path={path2} />
          </circle>
        </g>

        {/* Solenoid */}
        <g transform={`translate(${centerX}, ${centerY})`}>
          {/* External Magnetic field lines indicator (inside solenoid only) */}
          <circle r={solenoidRadius} fill="url(#solenoidInner)" stroke="#3b82f6" strokeWidth="2" />
          
          {/* Flux cross/dot symbols */}
          {flux > 0 ? (
             <g stroke="#60a5fa" strokeWidth="2" strokeLinecap="round">
                {[-10, 10].map(x => [-10, 10].map(y => (
                  <g key={`${x}-${y}`} transform={`translate(${x},${y})`}>
                    <line x1="-4" y1="-4" x2="4" y2="4" />
                    <line x1="4" y1="-4" x2="-4" y2="4" />
                  </g>
                )))}
             </g>
          ) : flux < 0 ? (
            <g fill="#60a5fa">
              {[-10, 10].map(x => [-10, 10].map(y => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r="2" />
              )))}
            </g>
          ) : null}

          {/* Solenoid coils (stylized) */}
          {[...Array(6)].map((_, i) => (
            <ellipse 
              key={i} 
              cx="0" cy="0" 
              rx={solenoidRadius + 5} 
              ry={(solenoidRadius + 5) * 0.3} 
              fill="none" 
              stroke="rgba(59, 130, 246, 0.4)" 
              strokeWidth="2"
              transform={`rotate(${i * 30})`}
            />
          ))}
        </g>

        {/* Source and Detector */}
        <g transform={`translate(${startX}, ${centerY})`}>
          <rect x="-40" y="-20" width="40" height="40" rx="4" fill="#1e293b" stroke="#334155" />
          <text x="-20" y="5" textAnchor="middle" fill="white" className="text-[10px] font-mono">SOURCE</text>
        </g>

        <g transform={`translate(${endX}, ${centerY})`}>
          <rect x="0" y="-80" width="10" height="160" rx="2" fill="#1e293b" stroke="#334155" />
          <text x="20" y="5" fill="white" className="text-[10px] font-mono">DETECTOR</text>
        </g>

        {/* Flux label */}
        <text 
          x={centerX} 
          y={centerY + solenoidRadius + 25} 
          textAnchor="middle" 
          fill="#60a5fa" 
          style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace' }}
        >
          Φ = {flux.toFixed(2)} Φ₀
        </text>
        <text 
          x={centerX} 
          y={centerY + solenoidRadius + 45} 
          textAnchor="middle" 
          fill="#3b82f6" 
          style={{ fontSize: '12px', fontFamily: 'monospace', opacity: 0.6 }}
        >
          B {flux !== 0 ? '≠' : '='} 0 (INSIDE)
        </text>
         <text 
          x={centerX + 150} 
          y={centerY - 150} 
          textAnchor="middle" 
          fill="#fbbf24" 
          style={{ fontSize: '12px', fontFamily: 'monospace', opacity: 0.8 }}
        >
          B = 0 (OUTSIDE)
        </text>
      </svg>
    </div>
  );
};

export default ABVisualizer;
