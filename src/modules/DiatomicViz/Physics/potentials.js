import { SimulationConfig } from './constants';

/**
 * Harmonic Potential V(x) = 0.5 * k * (x - x0)^2
 */
export function harmonicPotential(grid, k, x0) {
    return grid.map(x => 0.5 * k * Math.pow(x - x0, 2));
}

/**
 * Toy "Effective" Electronic Potential
 * Uses a Morse potential form: V(x) = D_e * (1 - exp(-a*(x-x0)))^2
 * D_e: Well depth
 * a: Width parameter
 * x0: Equilibrium position
 */
export function morsePotential(grid, De, a, x0) {
    return grid.map(x => {
        const term = 1 - Math.exp(-a * (x - x0));
        return De * Math.pow(term, 2);
    });
}

/**
 * Generates the x-grid based on config
 */
export function generateGrid() {
    const { gridPoints, xMin, xMax } = SimulationConfig;
    const dx = (xMax - xMin) / (gridPoints - 1);
    const grid = [];
    for (let i = 0; i < gridPoints; i++) {
        grid.push(xMin + i * dx);
    }
    return { grid, dx };
}
