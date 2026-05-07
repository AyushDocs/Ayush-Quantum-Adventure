import React from 'react';

const ABControls = ({ flux, setFlux, splitDistance, setSplitDistance, showAField, setShowAField }) => {
  return (
    <div className="space-y-8">
      {/* Flux Control */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-300">Magnetic Flux ($\Phi$)</label>
          <span className="text-blue-400 font-mono font-bold bg-blue-500/10 px-2 py-1 rounded">
            {flux.toFixed(2)} $\Phi_0$
          </span>
        </div>
        <input 
          type="range" 
          min="-2" 
          max="2" 
          step="0.01" 
          value={flux} 
          onChange={(e) => setFlux(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-[10px] text-gray-500 font-mono">
          <span>-2.0</span>
          <span>0.0</span>
          <span>+2.0</span>
        </div>
      </div>

      {/* Path Split Control */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-300">Path Separation</label>
          <span className="text-purple-400 font-mono font-bold bg-purple-500/10 px-2 py-1 rounded">
            {(splitDistance * 10).toFixed(1)} a.u.
          </span>
        </div>
        <input 
          type="range" 
          min="0.1" 
          max="0.8" 
          step="0.01" 
          value={splitDistance} 
          onChange={(e) => setSplitDistance(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
      </div>

      {/* Toggles */}
      <div className="pt-4 border-t border-gray-800 space-y-4">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Visualize Vector Potential ($\mathbf{A}$)</span>
          <div className="relative inline-flex items-center">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={showAField}
              onChange={() => setShowAField(!showAField)}
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </div>
        </label>
      </div>

      {/* Presets */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => setFlux(0)}
          className="px-3 py-2 text-xs bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
        >
          Zero Flux
        </button>
        <button 
          onClick={() => setFlux(1.0)}
          className="px-3 py-2 text-xs bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
        >
          $\Phi = \Phi_0$
        </button>
      </div>
    </div>
  );
};

export default ABControls;
