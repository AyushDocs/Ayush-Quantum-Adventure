import { setupControls } from './ui/controls.js';
import { MoleculeViz } from './viz/molecule.js';
import { PlotManager } from './viz/plots.js';

window.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing Diatomic CO Visualization...");

    // 1. Setup UI Events
    setupControls();

    // 2. Setup 3D Visualization
    const moleculeViz = new MoleculeViz('molecule-container');

    // 3. Setup Plots
    // PlotManager subscribes to state itself
    const plotManager = new PlotManager();

    console.log("Initialization complete.");
});
