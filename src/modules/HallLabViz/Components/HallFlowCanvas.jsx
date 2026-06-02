import { useMemo, useState, useEffect, useRef } from 'react';

function Carrier({ x, y, type, radius, stuck }) {
  const isElectron = type === 'electron';
  const color = isElectron ? '#0891b2' : '#ea580c';
  const sign = isElectron ? '-' : '+';
  return (
    <g>
      <circle cx={x} cy={y} r={radius} fill={color} opacity={stuck ? 0.3 : 0.75}
        stroke={stuck ? 'transparent' : isElectron ? '#06b6d4' : '#f97316'} strokeWidth={1} />
      <text x={x} y={y - radius - 4} textAnchor="middle" fill={stuck ? '#999' : '#555'} fontSize={8}>{sign}</text>
    </g>
  );
}

const C = {
  barGrad1: '#e8e4db',
  barGrad2: '#f5f2ec',
  barStroke: '#ccc6ba',
  text: '#555',
  muted: '#888',
  accent: '#d97706',
  green: '#15803d',
  purple: '#7c3aed',
  yellow: '#ca8a04',
};

export default function HallFlowCanvas({
  carrierType, bField, bSign, current,
  showMagnetic, showElectric, animating,
  thickness, area, carrierDensity,
  mobility,
  hallAngle, omegaCtau, hallBalance = 1.0,
}) {
  const timeRef = useRef(0);
  const lastRef = useRef(0);
  const [t, setT] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!animating) return;
    let running = true;
    lastRef.current = performance.now();
    const tick = (now) => {
      if (!running) return;
      const dt = now - lastRef.current;
      lastRef.current = now;
      timeRef.current += dt * 0.06;
      setT(timeRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, [animating]);

  const W = 700, H = 320;
  const barLeft = 50, barRight = W - 50;
  const barMidX = (barLeft + barRight) / 2;
  const barMidY = H / 2;

  const areaNormalized = area / 10e-6; // 1.0 at default (10 mm²)
  const barH = 150 + 50 * areaNormalized;
  const barTop = barMidY - barH / 2;
  const barBottom = barMidY + barH / 2;

  const staticCarriers = useMemo(() => {
    const maxCount = 100;
    return Array.from({ length: maxCount }, (_, i) => {
      const hash1 = Math.abs(Math.sin(i * 12.9898 + 78.233) * 43758.5453) % 1;
      const hash2 = Math.abs(Math.sin(i * 4.1414 + 13.3713) * 23147.21) % 1;
      return {
        offset: hash1,
        col: i % 8,
        speed: 0.7 + hash2 * 0.6,
      };
    });
  }, []);

  const nNormalized = carrierDensity / 1e23;
  const count = Math.max(5, Math.min(100, Math.round(40 * Math.sqrt(nNormalized))));
  const carriers = useMemo(() => {
    return staticCarriers.slice(0, count);
  }, [staticCarriers, count]);

  const dir = carrierType === 'electron' ? 1 : -1;
  const span = barRight - barLeft - 40;
  const speedNorm = (current / (carrierDensity / 1e23) / (area * 1e6)) * mobility;
  const baseSpeed = 1.5 + speedNorm * 3.0;
  const isElectron = carrierType === 'electron';

  const theta = hallAngle;
  const wct = omegaCtau;

  // Drift: amplified so slope is clearly visible, capped to keep particles in-bar
  const driftScale = 300;
  const maxDriftPx = barH * 0.4;
  const rawTotalDrift = theta * driftScale;
  const totalDrift = Math.min(rawTotalDrift, maxDriftPx);

  const deflectDir = bSign * (bField > 0.01 ? 1 : 0);
  const bOut = bSign > 0;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', background: 'transparent' }}>
      <defs>
        <linearGradient id="hallBarGradLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.barGrad1} />
          <stop offset="50%" stopColor={C.barGrad2} />
          <stop offset="100%" stopColor={C.barGrad1} />
        </linearGradient>
      </defs>
      <rect x={barLeft} y={barTop} width={barRight - barLeft} height={barH}
        fill="url(#hallBarGradLight)" stroke={C.barStroke} strokeWidth={1} rx={4} />

      {/* Hall voltage probes */}
      <rect x={barMidX - 8} y={barTop - 15} width={16} height={15}
        fill={C.green} opacity={0.2} rx={2} />
      <text x={barMidX} y={barTop - 7} textAnchor="middle" alignmentBaseline="central" fill={C.green} fontSize={9} fontWeight="bold">+</text>
      <rect x={barMidX - 8} y={barBottom} width={16} height={15}
        fill={C.green} opacity={0.2} rx={2} />
      <text x={barMidX} y={barBottom + 8} textAnchor="middle" alignmentBaseline="central" fill={C.green} fontSize={9} fontWeight="bold">−</text>

      <text x={barMidX} y={barTop - 22} textAnchor="middle" fill={C.green} fontSize={10} fontWeight="bold">
        V<tspan baselineShift="sub" fontSize="6.5">H</tspan>
      </text>
      <text x={barMidX} y={barTop - 34} textAnchor="middle" fill={C.muted} fontSize={8}>
        E<tspan baselineShift="sub" fontSize="5.5">H</tspan> (transverse Hall field)
      </text>

      <text x={dir > 0 ? barLeft - 45 : barRight + 45} y={barMidY - 16}
        textAnchor="middle" fill={C.yellow} fontSize={9} fontWeight="bold">E</text>
      {dir > 0 ? (
        <polygon points={`${barLeft - 30},${barMidY - 20} ${barLeft - 18},${barMidY - 15} ${barLeft - 30},${barMidY - 10}`} fill={C.yellow} opacity={0.7} />
      ) : (
        <polygon points={`${barRight + 30},${barMidY - 20} ${barRight + 18},${barMidY - 15} ${barRight + 30},${barMidY - 10}`} fill={C.yellow} opacity={0.7} />
      )}
      <text x={barLeft - 35} y={barMidY + 28} textAnchor="middle" fill={C.yellow} fontSize={7}>
        E<tspan baselineShift="sub" fontSize="5">long</tspan>
      </text>

      <text x={dir > 0 ? barLeft - 35 : barRight + 35} y={barMidY + 4}
        textAnchor="middle" fill={C.text} fontSize={11} fontWeight="bold">I</text>
      <polygon points={dir > 0
        ? `${barLeft - 18},${barMidY - 5} ${barLeft - 5},${barMidY} ${barLeft - 18},${barMidY + 5}`
        : `${barRight + 18},${barMidY - 5} ${barRight + 5},${barMidY} ${barRight + 18},${barMidY + 5}`}
        fill={C.text} />

      {carriers.map((c, i) => {
        const raw = c.offset * span + dir * t * baseSpeed * c.speed;
        const xPos = barLeft + 20 + ((raw % span) + span) % span;
        const nx = (xPos - barLeft - 20) / span;

        // Flow progress from 0 (entry) to 1 (exit)
        const pFlow = dir > 0 ? nx : 1 - nx;
        const yBase = barMidY + ((c.col) / 7 - 0.5) * barH * 0.5;

        // Target edge based on deflection direction
        const yEdge = deflectDir > 0 ? barBottom - 5 : barTop + 5;

        // Bending strength based on B field
        const bendStrength = Math.min(bField * 1.5, 2.5);

        // 1. Unbalanced circular trajectory (hallBalance = 0)
        // Parabolic arc approximating a circular bend towards the edge
        const p2 = pFlow * pFlow;
        const yUnbalanced = yBase + (yEdge - yBase) * Math.min(1, bendStrength * p2);

        // 2. Balanced diagonal trajectory (hallBalance > 0)
        // Levels off near the edge due to charge repulsion
        const repulsionZone = 18 * hallBalance;
        const yStableTarget = yEdge - deflectDir * repulsionZone;
        const yBalanced = yBase + (yStableTarget - yBase) * (1 - Math.exp(-3 * pFlow * bendStrength));

        // Blend based on hallBalance
        let finalY = yUnbalanced * (1 - hallBalance) + yBalanced * hallBalance;

        // If B is zero, flow straight
        if (bField <= 0.01) {
          finalY = yBase;
        }

        const guidingX = xPos;
        const guidingY = finalY;

        // Cyclotron motion: visible orbits at high ω_cτ
        const cyclotronActive = Math.min(Math.max((wct - 0.3) / 1.5, 0), 1);
        const rc = cyclotronActive * Math.max(Math.min(22 / (bField + 0.1), 24), 5);
        const orbitFreq = 0.04 + wct * 0.06;
        const phase = t * orbitFreq + c.offset * Math.PI * 4;
        const cx = rc * Math.cos(phase);
        const cy = rc * Math.sin(phase) * (bSign * (isElectron ? 1 : -1));

        let finalX = guidingX + cx;
        let finalYWithCyclotron = guidingY + cy;

        // Dynamically stable edge skidding
        const atEdge = finalYWithCyclotron < barTop + 3 || finalYWithCyclotron > barBottom - 3;
        if (finalYWithCyclotron < barTop + 3) finalYWithCyclotron = barTop + 3;
        if (finalYWithCyclotron > barBottom - 3) finalYWithCyclotron = barBottom - 3;

        // Velocity direction indicator (shows diagonal flow angle)
        const vLen = 10;
        let angle = 0;
        if (bField > 0.01) {
          const dy_dp = (1 - hallBalance) * (yEdge - yBase) * 2 * pFlow * bendStrength
                      + hallBalance * (yStableTarget - yBase) * 3 * bendStrength * Math.exp(-3 * pFlow * bendStrength);
          angle = Math.atan2(dy_dp / span, 1) * dir;
        }
        const vx = vLen * Math.cos(angle) * dir;
        const vy = vLen * Math.sin(angle);

        return (
          <g key={i}>
            {cyclotronActive > 0.15 && (
              <circle cx={guidingX} cy={guidingY} r={rc}
                fill="none" stroke={C.accent} strokeWidth={0.6}
                opacity={0.2 + cyclotronActive * 0.25}
                strokeDasharray="3,3" />
            )}
            {!atEdge && bField > 0.01 && (
              <line x1={finalX - vx} y1={finalY - vy}
                x2={finalX + vx} y2={finalY + vy}
                stroke={carrierType === 'electron' ? '#06b6d4' : '#f97316'}
                strokeWidth={0.8} opacity={0.35} />
            )}
            <Carrier
              x={finalX}
              y={finalYWithCyclotron}
              type={carrierType}
              radius={cyclotronActive > 0.15 ? 3 + cyclotronActive * 2.5 : 5}
              stuck={atEdge}
            />
          </g>
        );
      })}

      {(showElectric || showMagnetic) && (
        <g transform={`translate(${barMidX - 60}, ${barBottom + 18})`}>
          <rect x={0} y={0} width={200} height={18} rx={3}
            fill={C.barGrad1} stroke={C.barStroke} strokeWidth={0.5} opacity={0.85} />
          <text x={100} y={12} textAnchor="middle" fill={C.text} fontSize={8}>
            {wct < 0.3 ? 'Drift regime ' : wct < 0.8 ? 'Hall angle drift ' : 'Cyclotron regime '}
            (ω<tspan fontSize={6} baselineShift="sub">c</tspan>τ
            {wct < 0.3 ? ' ≪ 1)' : wct < 0.8 ? ' ~ 1)' : ' ≫ 1)'}
          </text>
        </g>
      )}

      {bField > 0.01 && deflectDir !== 0 && (
        <g transform={`translate(${dir > 0 ? barLeft + 60 : barRight - 60}, ${barMidY + 30})`}>
          <line x1={0} y1={0} x2={55 * dir} y2={55 * (totalDrift / span) * deflectDir * (1 - hallBalance)}
            stroke={C.accent} strokeWidth={1.5} opacity={0.6} />
          <polygon points={`0,-3 6,0 0,3`} fill={C.accent} opacity={0.6}
            transform={`translate(${55 * dir}, ${55 * (totalDrift / span) * deflectDir * (1 - hallBalance)}) rotate(${Math.atan2(55 * (totalDrift / span) * deflectDir * (1 - hallBalance), 55 * dir) * 180 / Math.PI})`} />
          <text x={28 * dir} y={55 * (totalDrift / span) * deflectDir * (1 - hallBalance) + (deflectDir > 0 ? 10 : -6)}
            textAnchor="middle" fill={C.accent} fontSize={7}>drift</text>
        </g>
      )}

      {showElectric && deflectDir !== 0 && hallBalance > 0.02 && (
        <g>
          <line x1={barMidX - 40} y1={barMidY - 15} x2={barMidX - 40}
            y2={barMidY - 15 - deflectDir * 25 * hallBalance}
            stroke={C.green} strokeWidth={2} opacity={0.8} />
          <polygon points={`0,-2 6,0 0,2`} fill={C.green} opacity={0.8}
            transform={`translate(${barMidX - 40}, ${barMidY - 15 - deflectDir * 25 * hallBalance}) rotate(${deflectDir > 0 ? -90 : 90})`} />
          <text x={barMidX - 55} y={barMidY - 20} fill={C.green} fontSize={9} fontWeight="bold">
            F<tspan baselineShift="sub" fontSize="6.5">E</tspan>
          </text>
        </g>
      )}
      {showMagnetic && deflectDir !== 0 && (
        <g>
          <line x1={barMidX + 40} y1={barMidY - 15} x2={barMidX + 40}
            y2={barMidY - 15 + deflectDir * 25}
            stroke={C.purple} strokeWidth={2} opacity={0.8} />
          <polygon points={`0,-2 6,0 0,2`} fill={C.purple} opacity={0.8}
            transform={`translate(${barMidX + 40}, ${barMidY - 15 + deflectDir * 25}) rotate(${deflectDir > 0 ? 90 : -90})`} />
          <text x={barMidX + 48} y={barMidY - 20} fill={C.purple} fontSize={9} fontWeight="bold">
            F<tspan baselineShift="sub" fontSize="6.5">B</tspan>
          </text>
        </g>
      )}

      <g transform={`translate(${barRight + 25}, ${barMidY})`}>
        <text textAnchor="middle" fill={C.purple} fontSize={11} fontWeight="bold">B</text>
        {bField > 0 && (
          <>
            <circle cx={0} cy={-18} r={8} fill="none" stroke={C.purple} strokeWidth={1} opacity={0.5} />
            <text x={0} y={-15} textAnchor="middle" fill={C.purple} fontSize={8}>{bOut ? '⊙' : '⊗'}</text>
          </>
        )}
      </g>

      <g transform="translate(20, 12)">
        <circle r={4} fill="#0891b2" />
        <text x={10} y={4} fill={C.text} fontSize={9}>e⁻ LTR</text>
        <circle cx={90} r={4} fill="#ea580c" />
        <text x={100} y={4} fill={C.text} fontSize={9}>h⁺ RTL</text>
      </g>
    </svg>
  );
}
