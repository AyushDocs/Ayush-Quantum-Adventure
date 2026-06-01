import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const CHARGE = 1.602e-19;
const M0 = 9.11e-31;

const DEFAULTS = {
  B: 0.5, I: 1.0, n: 1.0, mu: 1.0, t: 1.0, w: 10, type: 'e', bsign: 1,
};

export default function useHallLabState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const p = (key, def) => {
    const v = searchParams.get(key);
    if (v === null) return def;
    const n = parseFloat(v);
    return isNaN(n) ? v : n;
  };

  const [bField, setBField] = useState(() => p('B', DEFAULTS.B));
  const [bSign, setBSign] = useState(() => p('bsign', DEFAULTS.bsign));
  const [current, setCurrent] = useState(() => p('I', DEFAULTS.I));
  const [thickness, setThickness] = useState(() => p('t', DEFAULTS.t) * 1e-3);
  const [width, setWidth] = useState(() => p('w', DEFAULTS.w) * 1e-3);
  const [carrierDensity, setCarrierDensity] = useState(() => p('n', DEFAULTS.n) * 1e23);
  const [carrierType, setCarrierType] = useState(() => p('type', DEFAULTS.type) === 'h' ? 'hole' : 'electron');
  const [mobility, setMobility] = useState(() => p('mu', DEFAULTS.mu));
  const [showMagnetic, setShowMagnetic] = useState(true);
  const [showElectric, setShowElectric] = useState(true);
  const [animating, setAnimating] = useState(true);
  const [hallBalance, setHallBalance] = useState(1.0);
  const [autoBalance, setAutoBalance] = useState(true);

  // Trigger transient on B field or current change
  useEffect(() => {
    if (!autoBalance) return;
    setHallBalance(0);
    let startTime = performance.now();
    let frameId;
    const duration = 1500; // 1.5 seconds to reach steady-state balance
    
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1.0);
      
      // Smooth charge buildup profile: 1 - exp(-4 * progress)
      const chargeBuildup = 1 - Math.exp(-4 * progress);
      setHallBalance(chargeBuildup);
      
      if (progress < 1.0) {
        frameId = requestAnimationFrame(animate);
      } else {
        setHallBalance(1.0);
      }
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [bField, bSign, current, autoBalance]);

  const toggleCarrierType = useCallback(() => {
    setCarrierType(t => t === 'electron' ? 'hole' : 'electron');
  }, []);

  const toggleBSign = useCallback(() => {
    setBSign(s => s === 1 ? -1 : 1);
  }, []);

  useEffect(() => {
    const q = new URLSearchParams();
    const f = (v, d, key, prec) => {
      if (Math.abs(v - d) > 1e-9) q.set(key, v.toFixed(prec));
    };
    f(bField, DEFAULTS.B, 'B', 2);
    f(current, DEFAULTS.I, 'I', 1);
    f(carrierDensity / 1e23, DEFAULTS.n, 'n', 2);
    f(mobility, DEFAULTS.mu, 'mu', 2);
    f(thickness * 1000, DEFAULTS.t, 't', 1);
    f(width * 1000, DEFAULTS.w, 'w', 1);
    if (carrierType !== 'electron') q.set('type', 'h');
    if (bSign !== 1) q.set('bsign', String(bSign));
    const qstr = q.toString();
    const cur = searchParams.toString();
    if (qstr !== cur) setSearchParams(q, { replace: true });
  }, [bField, current, carrierDensity, mobility, thickness, width, carrierType, bSign]);

  const direction = useMemo(() => carrierType === 'electron' ? 'ltr' : 'rtl', [carrierType]);

  const effectiveMass = useMemo(() => {
    return (carrierType === 'electron' ? 0.2 : 0.5) * M0;
  }, [carrierType]);

  const meanFreeTime = useMemo(() => {
    return mobility * effectiveMass / CHARGE;
  }, [mobility, effectiveMass]);

  const bEff = useMemo(() => bField * bSign, [bField, bSign]);

  const cyclotronFreq = useMemo(() => {
    return CHARGE * bEff / effectiveMass;
  }, [bEff, effectiveMass]);

  const q = useMemo(() => carrierType === 'electron' ? -CHARGE : CHARGE, [carrierType]);

  const hallVoltage = useMemo(() => {
    const maxVH = (current * bEff) / (carrierDensity * q * thickness);
    return maxVH * hallBalance;
  }, [current, bEff, carrierDensity, thickness, q, hallBalance]);

  const hallCoeff = useMemo(() => {
    return 1 / (carrierDensity * q);
  }, [carrierDensity, q]);

  const sigma0 = useMemo(() => {
    return carrierDensity * CHARGE * CHARGE * meanFreeTime / effectiveMass;
  }, [carrierDensity, meanFreeTime, effectiveMass]);

  const conductivity = sigma0;

  const resistivity = useMemo(() => {
    return 1 / conductivity;
  }, [conductivity]);

  const hallAngle = useMemo(() => {
    return cyclotronFreq * meanFreeTime;
  }, [cyclotronFreq, meanFreeTime]);

  const lorentzForce = useMemo(() => {
    const driftV = current / (carrierDensity * CHARGE * thickness * width);
    return q * driftV * bEff;
  }, [current, bEff, carrierDensity, thickness, width, q]);

  const driftVelocity = useMemo(() => {
    return current / (carrierDensity * CHARGE * thickness * width);
  }, [current, carrierDensity, thickness, width]);

  const sheetDensity = useMemo(() => {
    return carrierDensity * thickness;
  }, [carrierDensity, thickness]);

  const detectedType = useMemo(() => {
    return hallCoeff > 0 ? 'Hole (p-type)' : 'Electron (n-type)';
  }, [hallCoeff]);

  const hallMobility = useMemo(() => {
    return Math.abs(hallCoeff) * conductivity;
  }, [hallCoeff, conductivity]);

  const omegaCtau = useMemo(() => Math.abs(cyclotronFreq * meanFreeTime), [cyclotronFreq, meanFreeTime]);

  const sigma_xx = useMemo(() => sigma0, [sigma0]);
  const sigma_xy = useMemo(() => sigma0 * omegaCtau, [sigma0, omegaCtau]);

  const rho_xx = useMemo(() => 1 / sigma0, [sigma0]);
  const rho_xy = useMemo(() => -omegaCtau / sigma0, [sigma0, omegaCtau]);

  const cyclotronRadius = useMemo(() => {
    const v = current / (carrierDensity * CHARGE * thickness * width);
    return effectiveMass * Math.abs(v) / (CHARGE * bField);
  }, [current, carrierDensity, thickness, width, effectiveMass, bField]);

  const kineticEnergy = useMemo(() => {
    const v = current / (carrierDensity * CHARGE * thickness * width);
    return 0.5 * effectiveMass * v * v;
  }, [current, carrierDensity, thickness, width, effectiveMass]);

  const regime = useMemo(() => {
    if (omegaCtau < 0.3) return 'scattering-dominated (ω_cτ ≪ 1) — carriers scatter before completing a cyclotron orbit';
    if (omegaCtau < 0.8) return 'intermediate (ω_cτ ~ 1) — onset of cyclotron motion';
    return 'high-field (ω_cτ ≫ 1) — electrons complete many cyclotron orbits before scattering';
  }, [omegaCtau]);

  return {
    direction,
    bField, setBField, bSign, setBSign, toggleBSign,
    current, setCurrent,
    thickness, setThickness,
    width, setWidth,
    carrierDensity, setCarrierDensity,
    carrierType, setCarrierType, toggleCarrierType,
    mobility, setMobility,
    showMagnetic, setShowMagnetic,
    showElectric, setShowElectric,
    animating, setAnimating,
    hallBalance, setHallBalance,
    autoBalance, setAutoBalance,
    effectiveMass, meanFreeTime, cyclotronFreq, cyclotronRadius, kineticEnergy,
    hallVoltage, hallCoeff, conductivity, resistivity,
    hallAngle, lorentzForce, driftVelocity,
    sheetDensity, detectedType, hallMobility,
    omegaCtau, bEff, sigma0,
    sigma_xx, sigma_xy, rho_xx, rho_xy, regime,
  };
}
