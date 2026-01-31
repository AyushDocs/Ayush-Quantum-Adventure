import { Constants } from '../constants.js';

export class Solver1D {
    constructor(grid, dx) {
        this.grid = grid;
        this.dx = dx;
        this.N = grid.length;
    }

    solve(potential) {
        // Construct Tridiagonal Hamiltonian Matrix
        // H = T + V
        // T_ij = - (hbar^2 / 2*mu*dx^2) * (-2 if i=j, 1 if |i-j|=1)
        // V_ij = V(x_i) * delta_ij

        const hbar = Constants.hbar;
        const mu = Constants.reducedMass;
        const scale = (hbar * hbar) / (2 * mu * this.dx * this.dx);

        const d = new Float64Array(this.N); // Diagonal elements
        const e = new Float64Array(this.N); // Off-diagonal elements

        for (let i = 0; i < this.N; i++) {
            d[i] = 2 * scale + potential[i];
            if (i < this.N - 1) {
                e[i] = -scale; // e[i] is element at row i, col i+1
            }
        }

        // e needs to be shifted for the solver usually, specifically e[i] connects i and i+1
        // TQL2 expects d[0..n-1] and e[0..n-1], where e[i] is subdiagonal (i, i+1). 
        // Note: TQL2 usually expects e[n-1] = 0.

        // Initialize Identity Matrix for Eigenvectors
        const z = new Array(this.N).fill(0).map(() => new Float64Array(this.N));
        for (let i = 0; i < this.N; i++) z[i][i] = 1.0;

        // Solve
        this.tql2(this.N, d, e, z);

        // Sort by eigenvalue (TQL2 might not return sorted)
        const indices = new Array(this.N).fill(0).map((_, i) => i);
        indices.sort((a, b) => d[a] - d[b]);

        const eigenvalues = new Float64Array(this.N);
        const eigenvectors = [];

        for (let i = 0; i < this.N; i++) {
            const idx = indices[i];
            eigenvalues[i] = d[idx];
            
            // Extract column idx from z
            const vec = new Float64Array(this.N);
            for (let j = 0; j < this.N; j++) {
                vec[j] = z[j][idx];
            }
            // Normalize properly just in case (mass/grid weighted? usually sum |c|^2 = 1 is fine for viz)
            this.normalize(vec);
            eigenvectors.push(vec);
        }

        return { eigenvalues, eigenvectors };
    }

    normalize(vec) {
        let sum = 0;
        for (let v of vec) sum += v * v;
        const norm = Math.sqrt(sum * this.dx); // Integral normalization
        for (let i = 0; i < vec.length; i++) vec[i] /= norm;
    }

    // Symmetric Tridiagonal QL Algorithm
    // Adapted from EISPACK/numerical recipes
    tql2(n, d, e, z) {
        for (let i = 1; i < n; i++) e[i - 1] = e[i];
        e[n - 1] = 0.0;

        let f = 0.0;
        let tst1 = 0.0;
        const eps = 2.22e-16; // Machine epsilon

        for (let l = 0; l < n; l++) {
            tst1 = Math.max(tst1, Math.abs(d[l]) + Math.abs(e[l]));
            let m = l;
            while (m < n) {
                if (Math.abs(e[m]) <= eps * tst1) break;
                m++;
            }

            if (m > l) {
                let iter = 0;
                do {
                    iter++;
                    if (iter > 30) {
                        console.warn("Too many iterations in TQL2");
                        break;
                    }; 

                    let g = d[l];
                    let p = (d[l + 1] - g) / (2.0 * e[l]);
                    let r = Math.sqrt(p * p + 1.0);
                    
                    // Sign of r same as p
                    if (p < 0) r = -r;
                    
                    d[l] = e[l] / (p + r);
                    d[l + 1] = e[l] * (p + r);
                    const dl1 = d[l + 1];
                    let h = g - d[l];
                    for (let i = l + 2; i < n; i++) d[i] -= h;
                    f = f + h;

                    p = d[m];
                    let c = 1.0;
                    let c2 = 1.0;
                    let c3 = 1.0;
                    let el1 = e[l + 1];
                    let s = 0.0;
                    let s2 = 0.0;

                    for (let i = m - 1; i >= l; i--) {
                        c3 = c2;
                        c2 = c;
                        s2 = s;
                        g = c * e[i];
                        h = c * p;
                        r = Math.sqrt(p * p + e[i] * e[i]);
                        e[i + 1] = s * r;
                        s = e[i] / r;
                        c = p / r;
                        p = c * d[i] - s * g;
                        d[i + 1] = h + s * (c * g + s * d[i]);

                        // Accumulate transformation
                        for (let k = 0; k < n; k++) {
                            h = z[k][i + 1];
                            z[k][i + 1] = s * z[k][i] + c * h;
                            z[k][i] = c * z[k][i] - s * h;
                        }
                    }
                    p = -s * s2 * c3 * el1 * e[l] / dl1;
                    e[l] = s * p;
                    d[l] = c * p;
                } while (Math.abs(e[l]) > eps * tst1);
            }
            d[l] = d[l] + f;
            e[l] = 0.0;
        }

        // Sort eigenvalues and reorder eigenvectors?
        // We do that outside in solve()
    }
}
