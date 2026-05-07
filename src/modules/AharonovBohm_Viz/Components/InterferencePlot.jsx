import React, { useMemo } from 'react';

const InterferencePlot = ({ phaseShift }) => {
  const width = 300;
  const height = 150;
  const padding = 20;

  const points = useMemo(() => {
    const p = [];
    const steps = 100;
    const xRange = 10; // units
    
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * xRange - xRange / 2;
      // Pattern: 1 + cos(k*x + delta_phi)
      // We'll use k=3 for a few fringes
      const intensity = 1 + Math.cos(3 * x + phaseShift);
      
      const px = padding + (i / steps) * (width - 2 * padding);
      const py = height - padding - (intensity / 2) * (height - 2 * padding);
      p.push(`${px},${py}`);
    }
    return p.join(' ');
  }, [phaseShift, width, height, padding]);

  return (
    <div className="w-full flex flex-col items-center">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
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
        <text x={width/2} y={height - 5} textAnchor="middle" fill="#475569" className="text-[8px] font-mono">Detector Position (y)</text>
        <text x={5} y={height/2} textAnchor="middle" fill="#475569" className="text-[8px] font-mono" transform={`rotate(-90, 5, ${height/2})`}>Intensity</text>

        {/* The Pattern */}
        <polyline
          points={points}
          fill="none"
          stroke="url(#plotGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />

        {/* Reference line (optional) */}
        <line 
          x1={width/2} y1={padding} 
          x2={width/2} y2={height-padding} 
          stroke="white" strokeWidth="1" 
          strokeDasharray="2 2" 
          className="opacity-20"
        />
      </svg>
      
      <div className="mt-4 flex justify-between w-full text-[10px] text-gray-500 font-mono">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span>Maxima</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-500/30 border border-blue-500/50 rounded-full"></div>
          <span>Minima</span>
        </div>
      </div>
    </div>
  );
};

export default InterferencePlot;
