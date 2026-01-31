/**
 * Physical Constants (Simplified/Reduced for Visualization)
 * 
 * We use a system of units where hbar = 1, mass is of order 1, etc., 
 * to ensure numerical stability in the browser JS engine without 
 * dealing with 10^-34 floats.
 * 
 * Analogy:
 * Length: Angstroms approx
 * Energy: Effective units
 */

export const Constants = {
    hbar: 1.0,
    // Relative atomic masses (approx: C=12, O=16)
    massC: 12.0,
    massO: 16.0,
    // Equilibrium bond length (approx 1.13 Angstroms for CO)
    r_eq: 1.13, 
    // Reduced mass mu = (m1*m2)/(m1+m2)
    get reducedMass() {
        return (this.massC * this.massO) / (this.massC + this.massO);
    },
    // Rotational constant B = hbar^2 / (2 * mu * r^2)
    get B() {
        return (this.hbar ** 2) / (2 * this.reducedMass * (this.r_eq ** 2));
    }
};

export const SimulationConfig = {
    gridPoints: 200,      // Number of points for 1D finite difference
    xMin: 0.5,            // Minimum bond distance
    xMax: 2.5,            // Maximum bond distance
    timeStep: 0.01        // Animation time step
};
