/**
 * Berry Phase Physics Logic
 * Implements a 2-band Hamiltonian for a Chern Insulator (QAHI-like model)
 */

export const calculateHamiltonian = (kx, ky, mass, ax = 0, ay = 0, t1 = 1.0, t2 = 0.5) => {
    // Peierls substitution: k -> k - A
    const kx_eff = kx - ax;
    const ky_eff = ky - ay;

    const dx = t1 * Math.sin(kx_eff);
    const dy = t1 * Math.sin(ky_eff);
    const dz = mass - t2 * (2 - Math.cos(kx_eff) - Math.cos(ky_eff));

    return { dx, dy, dz };
};

export const calculateBerryCurvature = (kx, ky, mass, ax = 0, ay = 0, t1 = 1.0, t2 = 0.5) => {
    const kx_eff = kx - ax;
    const ky_eff = ky - ay;

    const { dx, dy, dz } = calculateHamiltonian(kx, ky, mass, ax, ay, t1, t2);
    const dMag = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const dMag3 = dMag * dMag * dMag;

    if (dMag3 < 1e-10) return 0;

    const ddx_dkx = t1 * Math.cos(kx_eff);
    const ddy_dky = t1 * Math.cos(ky_eff);
    const ddz_dkx = -t2 * Math.sin(kx_eff);
    const ddz_dky = -t2 * Math.sin(ky_eff);

    const crossX = -ddz_dkx * ddy_dky;
    const crossY = ddx_dkx * ddz_dky;
    const crossZ = ddx_dkx * ddy_dky;

    const omega = (dx * crossX + dy * crossY + dz * crossZ) / (2 * dMag3);
    return omega;
};

export const generateGridData = (mass, ax = 0, ay = 0, h = 0, resolution = 50) => {
    const kValues = [];
    for (let i = 0; i <= resolution; i++) {
        kValues.push(-Math.PI + (2 * Math.PI * i) / resolution);
    }

    const energyUpTop = [];
    const energyUpBottom = [];
    const energyDownTop = [];
    const energyDownBottom = [];
    const curvature = [];

    for (let i = 0; i < kValues.length; i++) {
        const rowUpTop = [];
        const rowUpBottom = [];
        const rowDownTop = [];
        const rowDownBottom = [];
        const rowCurv = [];
        for (let j = 0; j < kValues.length; j++) {
            const kx = kValues[i];
            const ky = kValues[j];
            
            // Spin Up Hamiltonian (effective mass M + h)
            const dUp = calculateHamiltonian(kx, ky, mass + h, ax, ay);
            const dMagUp = Math.sqrt(dUp.dx * dUp.dx + dUp.dy * dUp.dy + dUp.dz * dUp.dz);
            rowUpTop.push(dMagUp + h);
            rowUpBottom.push(-dMagUp + h);
            
            // Spin Down Hamiltonian (effective mass M - h)
            const dDown = calculateHamiltonian(kx, ky, mass - h, ax, ay);
            const dMagDown = Math.sqrt(dDown.dx * dDown.dx + dDown.dy * dDown.dy + dDown.dz * dDown.dz);
            rowDownTop.push(dMagDown - h);
            rowDownBottom.push(-dMagDown - h);

            // Total Curvature = Curvature(Up) + Curvature(Down)
            const curvUp = calculateBerryCurvature(kx, ky, mass + h, ax, ay);
            const curvDown = calculateBerryCurvature(kx, ky, mass - h, ax, ay);
            rowCurv.push(curvUp + curvDown);
        }
        energyUpTop.push(rowUpTop);
        energyUpBottom.push(rowUpBottom);
        energyDownTop.push(rowDownTop);
        energyDownBottom.push(rowDownBottom);
        curvature.push(rowCurv);
    }

    return { 
        kValues, 
        energyUpTop, energyUpBottom, 
        energyDownTop, energyDownBottom, 
        curvature 
    };
};

export const calculatePhaseSpace = (resolution = 40) => {
    const mRange = { min: -1, max: 3 };
    const hRange = { min: 0, max: 2 };
    
    const mValues = [];
    for (let i = 0; i <= resolution; i++) {
        mValues.push(mRange.min + (mRange.max - mRange.min) * (i / resolution));
    }
    
    const hValues = [];
    for (let i = 0; i <= resolution; i++) {
        hValues.push(hRange.min + (hRange.max - hRange.min) * (i / resolution));
    }
    
    const phaseMap = [];
    for (let i = 0; i < hValues.length; i++) {
        const row = [];
        for (let j = 0; j < mValues.length; j++) {
            const m = mValues[j];
            const h = hValues[i];
            
            // Numerical estimation of Chern number at this (M,h) point
            // For performance, we skip the full integration and use the analytical phase boundaries
            // Boundaries: M ± h = 0, M ± h = 2, M ± h = 4
            
            const getC = (mVal) => {
                if (mVal > 0 && mVal < 2) return 1;
                if (mVal > 2 && mVal < 4) return -1;
                return 0;
            };
            
            const cUp = getC(m + h);
            const cDown = getC(m - h);
            row.push(cUp + cDown);
        }
        phaseMap.push(row);
    }
    
    return { mValues, hValues, phaseMap };
};

export const generateVectorFieldData = (mass, ax = 0, ay = 0, resolution = 12) => {
    const kValues = [];
    for (let i = 0; i < resolution; i++) {
        kValues.push(-Math.PI + (2 * Math.PI * i) / resolution);
    }

    const x = [];
    const y = [];
    const z = [];
    const u = [];
    const v = [];
    const w = [];

    for (let i = 0; i < kValues.length; i++) {
        for (let j = 0; j < kValues.length; j++) {
            const kx = kValues[i];
            const ky = kValues[j];
            const { dx, dy, dz } = calculateHamiltonian(kx, ky, mass, ax, ay);
            
            x.push(kx);
            y.push(ky);
            z.push(0); // Cores are at z=0 plane between bands
            u.push(dx);
            v.push(dy);
            w.push(dz);
        }
    }

    return { x, y, z, u, v, w };
};
