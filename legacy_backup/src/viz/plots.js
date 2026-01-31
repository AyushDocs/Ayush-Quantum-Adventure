import { Constants } from '../constants.js';
import { generateGrid, morsePotential } from '../physics/potentials.js';
import { Solver1D } from '../physics/solver.js';
import { globalState } from '../state.js';

export class PlotManager {
    constructor() {
        this.plotElectronic = document.getElementById('plot-electronic');
        this.plotSpectra = document.getElementById('plot-spectra');
        
        console.log("PlotManager Init: ", { 
            el: this.plotElectronic, 
            sp: this.plotSpectra 
        });

        // Cache solver instance
        const { grid, dx } = generateGrid();
        this.grid = grid;
        this.dx = dx;
        this.solver = new Solver1D(grid, dx);

        this.currentMode = 'electronic';

        globalState.subscribe((key, val) => {
            if (['l', 'v', 'k', 'n'].includes(key)) { // Updated J -> l here too just in case
                this.updatePlots();
            }
            if (key === 'tabSwitch') {
                this.currentMode = val;
                this.updatePlots(true); // force relayout
            }
            if (key === 'resize') {
                this.resize();
            }
        });

        this.initPlots();
        this.updatePlots();
    }

    initPlots() {
        const layoutBase = {
            paper_bgcolor: '#1e1e1e',
            plot_bgcolor: '#1e1e1e',
            font: { color: '#e0e0e0' },
            margin: { t: 30, r: 20, l: 50, b: 40 },
            xaxis: { title: 'Bond Length (au)', showgrid: true, gridcolor: '#333' },
            yaxis: { title: 'Energy (au)', showgrid: true, gridcolor: '#333' }
        };

        if (this.plotElectronic) {
            Plotly.newPlot(this.plotElectronic, [], layoutBase);
        }
        
        if (this.plotSpectra) {
            const layoutSpectra = { ...layoutBase, xaxis: { title: 'States', showticklabels: false } };
            Plotly.newPlot(this.plotSpectra, [], layoutSpectra);
        }
    }

    resize() {
        if (this.plotElectronic && this.plotElectronic.offsetParent) {
            Plotly.Plots.resize(this.plotElectronic);
        }
        if (this.plotSpectra && this.plotSpectra.offsetParent) {
            Plotly.Plots.resize(this.plotSpectra);
        }
        if (this.plotPS && this.plotPS.offsetParent) {
            Plotly.Plots.resize(this.plotPS);
        }
    }

    updatePlots(forceRelayout = false) {
        if (this.currentMode === 'electronic') {
            this.renderElectronicVib();
        } else {
            this.renderSpectra();
        }
        // Always render phase space regardless of tab
        this.renderPhaseSpace();
    }

    renderElectronicVib() {
        const state = globalState.state;
        const k = state.k;
        const n = state.n; // Electronic state (0, 1, 2)
        const v_selected = state.v;

        // Define Potential based on electronic state
        // For educational purposes:
        // n=0: Deep well (Ground)
        // n=1: Higher energy, slightly shifted x0, wider
        // n=2: Even higher, approaching dissociation
        
        let V;
        let x0;
        let title;

        if (n === 0) {
            // Ground: Harmonic-ish or deep Morse
            x0 = Constants.r_eq;
            // Use Harmonic for pure SHM viz as requested by "Vibration" requirement
            // But user also wants "Effective Electronic 1D".
            // Let's overlay Harmonic approximation for current k, OR use Morse.
            // Requirement says: "Model vibration as 1D QHO... around equilibrium".
            // Requirement also says: "Plot effective potential V(x) ... Model electronic structure as effective 1D".
            // Let's use Morse as the "Real" V(x) and show wavefunctions for it.
            // AND we simulate the "Vibration" sliders using the QHO approximation in the 3D view.
            // To be consistent, let's plot the potential relevant to the current "Electronic State".
            
            // Ground State Parameters
            V = morsePotential(this.grid, 10.0, 1.5, x0);
            title = 'Ground Electronic State (n=0)';
        } else if (n === 1) {
            x0 = Constants.r_eq + 0.3;
            V = morsePotential(this.grid, 7.0, 1.2, x0); // Shallower, shifted
            title = 'Excited Electronic State (n=1)';
        } else {
            x0 = Constants.r_eq + 0.6;
            V = morsePotential(this.grid, 4.0, 1.0, x0); // Very shallow
            title = 'Excited Electronic State (n=2)';
        }

        // Add Rotation contribution to potential? V_eff = V(x) + hbar^2 l(l+1) / (2 mu x^2)
        // This is important for showing centrifugal distortion!
        // But might confuse basic users. Let's add it if l > 0.
        const l = state.l;
        const centrifugal = this.grid.map(x => {
            return (Constants.hbar**2 * l * (l+1)) / (2 * Constants.reducedMass * x * x);
        });
        
        const V_eff = V.map((v, i) => v + centrifugal[i]);

        // Solve
        const sol = this.solver.solve(V_eff);
        
        console.log("Solver Result:", { evals: sol.eigenvalues.slice(0, 5), evecs: sol.eigenvectors.length });

        // Traces
        const traces = [];

        // 1. Potential
        traces.push({
            x: this.grid,
            y: V_eff,
            type: 'scatter',
            mode: 'lines',
            name: 'V_eff(x)',
            line: { color: '#64b5f6', width: 3 }
        });

        // 2. Wavefunction for vibrational state v
        // We need to find the v-th eigenstate (if it exists / is bound)
        if (v_selected < sol.eigenvalues.length) {
            const E = sol.eigenvalues[v_selected];
            const psi = sol.eigenvectors[v_selected];
            
            // Scale psi for visibility and add to E
            // prob density |psi|^2
            const dens = psi.map(val => val * val);
            const scale = 5.0; // Arbitrary scale for visibility
            const y_dens = dens.map(d => E + d * scale);
            
            // Fill area ?
            traces.push({
                x: this.grid,
                y: y_dens,
                type: 'scatter',
                mode: 'lines',
                fill: 'tozeroy', // This fills to y=0, we want to fill to y=E. Plotly doesn't do "fill to line" easily without stacking.
                // Simple workaround: just line for density
                name: `|ψ_v=${v_selected}|²`,
                line: { color: '#ffeb3b', width: 2 }
            });

            // Energy Level Line
            traces.push({
                x: [this.grid[0], this.grid[this.grid.length-1]],
                y: [E, E],
                type: 'scatter',
                mode: 'lines',
                line: { color: '#ffeb3b', dash: 'dash', width: 1 },
                showlegend: false
            });
        }

        // 3. Draw other levels lightly
        const maxLevels = Math.min(10, sol.eigenvalues.length);
        for(let i=0; i<maxLevels; i++) {
             if (i === v_selected) continue;
             const E = sol.eigenvalues[i];
             // Cutoff if E > V_max roughly (unbound)
             if (E > 15) continue; 
             
             traces.push({
                x: [this.grid[0], this.grid[this.grid.length-1]],
                y: [E, E],
                type: 'scatter',
                mode: 'lines',
                line: { color: '#ffffff', opacity: 0.3, width: 1 },
                showlegend: false,
                hoverinfo: 'y',
                name: `v=${i}`
             });
        }

        const layout = {
            title: title + (l > 0 ? ` (+ Centrifugal l=${l})` : ''),
            autosize: true,
            paper_bgcolor: '#1e1e1e',
            plot_bgcolor: '#1e1e1e',
            font: { color: '#e0e0e0' },
            xaxis: { title: 'Bond Length (au)', color: '#aaa' },
            yaxis: { title: 'Energy (au)', color: '#aaa', range: [-1, 15] },
            margin: { t: 40, r: 20, l: 50, b: 40 },
            showlegend: true,
            legend: { x: 0.8, y: 1 }
        };

        if (this.plotElectronic) {
            console.log("Rendering Electronic Plot with traces:", traces.length, traces); // Debug
            Plotly.react(this.plotElectronic, traces, layout);
        }
    }

    renderSpectra() {
        // Visualizing energy hierarchy: Electronic >> Vibrational >> Rotational
        // We'll create three columns: Rotational (J), Vibrational (v), Electronic (n)
        
        const xRot = 1, xVib = 2, xElec = 3;
        
        const traces = [];

        // 1. Electronic Levels (Schematic)
        // Just show E_n ~ n * large_gap
        const gapElec = 100;
        const gapVib = 10;
        const gapRot = 0.5;

        // Current state
        const state = globalState.state;

        // Electronic
        for (let n=0; n<3; n++) {
            const E = n * gapElec;
            const color = (n === state.n) ? '#64b5f6' : '#555';
            traces.push({
                x: [xElec-0.2, xElec+0.2],
                y: [E, E],
                type: 'scatter', mode: 'lines', line: { color: color, width: 3 },
                showlegend: false,
                text: `n=${n}`, hoverinfo: 'text'
            });
        }

        // Vibrational (in current electronic state n)
        const E_elec_curr = state.n * gapElec;
        for (let v=0; v<10; v++) {
            // Harmonic approx E_v = (v+0.5)*hbar*omega
            // Scale for viz
            const E = E_elec_curr + v * gapVib;
            const color = (v === state.v) ? '#ffeb3b' : '#555';
             traces.push({
                x: [xVib-0.2, xVib+0.2],
                y: [E, E],
                type: 'scatter', mode: 'lines', line: { color: color, width: (v===state.v ? 3 : 1) },
                showlegend: false,
                text: `v=${v}`, hoverinfo: 'text'
            });
        }

        // Rotational (in current vib state v)
        const E_vib_curr = E_elec_curr + state.v * gapVib;
        for (let l=0; l<20; l++) {
            const E_rot = Constants.B * l * (l + 1) * 20; // Scale B big for visibility
            const E = E_vib_curr + E_rot;
             const color = (l === state.l) ? '#ff9800' : '#555';
             traces.push({
                x: [xRot-0.2, xRot+0.2],
                y: [E, E],
                type: 'scatter', mode: 'lines', line: { color: color, width: (l===state.l ? 3 : 1) },
                showlegend: false,
                text: `l=${l}`, hoverinfo: 'text'
            });
        }

        const layout = {
            title: 'Energy Hierarchy (Schematic)',
            autosize: true,
            paper_bgcolor: '#1e1e1e',
            plot_bgcolor: '#1e1e1e',
            font: { color: '#e0e0e0' },
            xaxis: { 
                tickvals: [1, 2, 3], 
                ticktext: ['Rotational (l)', 'Vibrational (v)', 'Electronic (n)'],
                color: '#aaa',
                range: [0.5, 3.5]
            },
            yaxis: { title: 'Energy (arbitrary)', showticklabels: false, color: '#aaa', 
                     range: [E_vib_curr - 5, E_vib_curr + 50] // Zoom on current Rotation
            },
            margin: { t: 40, r: 20, l: 50, b: 40 }
        };

        if (this.plotSpectra) {
            Plotly.react(this.plotSpectra, traces, layout);
        }
    }

    renderPhaseSpace() {
        if (!this.plotPS) {
             this.plotPS = document.getElementById('plot-phase');
             if (!this.plotPS) return;
        }

        const state = globalState.state;
        const v = state.v;
        const k = state.k;

        // Classical Phase Space for Harmonic Oscillator
        // E = (v + 0.5)hbar*omega
        const omega = Math.sqrt(k / Constants.reducedMass); // phys units
        const E = (v + 0.5) * Constants.hbar * omega;
        
        // x(t) = A cos(wt), p(t) = -m w A sin(wt)
        // E = 0.5 k A^2 => A = sqrt(2E/k)
        const A = Math.sqrt(2 * E / k);
        const maxMomentum = Constants.reducedMass * omega * A; // p_max = sqrt(2mE)

        // Generate points for ellipse
        const nPoints = 100;
        const x = [];
        const p = [];
        // Center around x_eq = 0 for phase space plot (displacement)
        // Or around x_eq = 1.13? Usually phase space is x-x_eq vs p.
        // Let's do (x - x_eq) for clarity.
        
        for (let i = 0; i <= nPoints; i++) {
            const theta = (i / nPoints) * 2 * Math.PI;
            x.push(A * Math.cos(theta));
            p.push(-maxMomentum * Math.sin(theta));
        }

        const traces = [{
            x: x,
            y: p,
            type: 'scatter',
            mode: 'lines',
            line: { color: '#ffeb3b', width: 2 },
            name: `v=${v}`
        }];

        const layout = {
            title: `Phase Space (v=${v})`,
            autosize: true,
            paper_bgcolor: '#1e1e1e',
            plot_bgcolor: '#1e1e1e',
            font: { color: '#e0e0e0' },
            xaxis: { title: 'Displacement (x - x_eq)', color: '#aaa' },
            yaxis: { title: 'Momentum (p)', color: '#aaa' },
            margin: { t: 40, r: 20, l: 50, b: 40 },
            showlegend: false
        };

        Plotly.react(this.plotPS, traces, layout);
    }
}
