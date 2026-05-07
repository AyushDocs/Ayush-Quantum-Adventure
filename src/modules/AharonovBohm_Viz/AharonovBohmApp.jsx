import React, { useState, useMemo } from 'react';
import ABVisualizer from './Components/ABVisualizer';
import ABControls from './Components/ABControls';
import InterferencePlot from './Components/InterferencePlot';

const AharonovBohmApp = () => {
  const [flux, setFlux] = useState(0.5);
  const [splitDistance, setSplitDistance] = useState(0.4);
  const [showAField, setShowAField] = useState(true);
  const [isQuantum, setIsQuantum] = useState(true);

  // Constants
  const phi0 = 1.0; // Flux quantum in our units

  const phaseShift = useMemo(() => {
    if (!isQuantum) return 0;
    return (2 * Math.PI * flux) / phi0;
  }, [flux, isQuantum]);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Aharonov-Bohm Effect
            </h1>
            <p className="text-gray-400 mt-2">
              Exploring the non-local nature of the vector potential $\mathbf{A}$.
            </p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsQuantum(!isQuantum)}
              className={`px-4 py-2 rounded-lg transition-all ${isQuantum ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-gray-800'}`}
            >
              {isQuantum ? 'Quantum Mode' : 'Classical Mode'}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Visualization */}
          <div className="lg:col-span-8 bg-[#121215] rounded-2xl border border-gray-800/50 overflow-hidden shadow-2xl relative">
            <ABVisualizer 
              flux={flux} 
              splitDistance={splitDistance} 
              showAField={showAField} 
              phaseShift={phaseShift}
            />
            
            {/* Legend / Overlay */}
            <div className="absolute bottom-6 left-6 p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-xs space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_5px_#3b82f6]"></div>
                <span>Electron Path 1 (Top)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_5px_#a855f7]"></div>
                <span>Electron Path 2 (Bottom)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500/50 border border-yellow-500/80"></div>
                <span>Vector Potential $\mathbf{A}$</span>
              </div>
              <div className="mt-2 pt-2 border-t border-white/5">
                <span className="text-blue-400 font-mono">Δφ = {phaseShift.toFixed(2)} rad</span>
              </div>
            </div>
          </div>

          {/* Controls and Plot */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-[#121215] p-6 rounded-2xl border border-gray-800/50 shadow-xl">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                Simulation Parameters
              </h2>
              <ABControls 
                flux={flux} 
                setFlux={setFlux}
                splitDistance={splitDistance}
                setSplitDistance={setSplitDistance}
                showAField={showAField}
                setShowAField={setShowAField}
              />
            </div>

            <div className="bg-[#121215] p-6 rounded-2xl border border-gray-800/50 shadow-xl flex-grow">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
                Interference Pattern
              </h2>
              <InterferencePlot phaseShift={phaseShift} />
              <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 text-sm leading-relaxed text-blue-200">
                {isQuantum ? (
                  "In quantum mechanics, the phase shift occurs even though the electron never enters the region with the B-field. This is because the vector potential A is non-zero along the paths."
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
