import { useMemo } from 'react';
import Plot from 'react-plotly.js';

const C = {
  bg: '#ffffff',
  text: '#1a1a2e',
  muted: '#555555',
  border: '#ddd8ce',
};

export default function HallPlateauPlot({ bField, density, chernNumber, rxx, temperature = 0.1 }) {
    
    // Calculate the data arrays for Plotly
    const { bVals, rxyVals, rxxVals, currentRxy, currentRxx } = useMemo(() => {
        const bVals = [];
        const rxyVals = [];
        const rxxVals = [];
        const B_STEP = 0.05;
        const smearFactor = Math.min(1.0, temperature * 1.5);

        for (let b = 0.1; b <= 5.0; b += B_STEP) {
            const filling = density / b;
            
            // Hall Resistance (Rxy)
            const nu = Math.max(1, Math.floor(filling));
            const R_quantum = 1 / nu;
            const R_classical = b / 5.0;
            const rxy = R_quantum * (1 - smearFactor) + R_classical * smearFactor;
            
            // Longitudinal Resistance (Rxx)
            const dist = Math.abs(filling - Math.round(filling));
            const peakWidth = 0.1 + temperature * 0.4;
            const peak = Math.exp(-Math.pow(dist - 0.5, 2) / (2 * peakWidth * peakWidth));
            const rxxVal = (peak + temperature * 0.5) * 0.4; // scaled to 0.4 max peak

            bVals.push(b);
            rxyVals.push(rxy);
            rxxVals.push(rxxVal);
        }

        // Calculate operating point values
        const isBZero = bField < 0.05;
        const currentFilling = isBZero ? 0 : density / bField;
        const currentNu = isBZero ? 1 : Math.max(1, Math.floor(currentFilling));
        const currentR_quantum = 1 / currentNu;
        const currentR_classical = bField / 5.0;
        const oRxy = isBZero ? 0 : currentR_quantum * (1 - smearFactor) + currentR_classical * smearFactor;
        const oRxx = isBZero ? 0 : (rxx || 0) * (0.4 / 50); // scaled identically

        return { bVals, rxyVals, rxxVals, currentRxy: oRxy, currentRxx: oRxx };
    }, [density, temperature, bField, rxx]);

    const data = [
        {
            x: bVals,
            y: rxyVals,
            type: 'scatter',
            mode: 'lines',
            name: 'R<sub>xy</sub> (Hall Resistance)',
            line: { color: '#10b981', width: 2.5 }
        },
        {
            x: bVals,
            y: rxxVals,
            type: 'scatter',
            mode: 'lines',
            name: 'R<sub>xx</sub> (Longitudinal)',
            line: { color: '#f43f5e', width: 1.5, dash: 'dashdot' }
        },
        {
            x: [bField],
            y: [currentRxy],
            type: 'scatter',
            mode: 'markers',
            name: 'Operating R<sub>xy</sub>',
            marker: { color: '#10b981', size: 10, symbol: 'circle' }
        },
        {
            x: [bField],
            y: [currentRxx],
            type: 'scatter',
            mode: 'markers',
            name: 'Operating R<sub>xx</sub>',
            marker: { color: '#f43f5e', size: 10, symbol: 'circle' }
        }
    ];

    const layout = {
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { color: C.muted, size: 10, family: 'sans-serif' },
        margin: { l: 65, r: 20, t: 40, b: 50 },
        height: 250,
        showlegend: true,
        legend: {
            orientation: 'h',
            x: 0.5,
            xanchor: 'center',
            y: 1.25,
            font: { size: 9, color: C.muted }
        },
        xaxis: {
            title: { text: 'Magnetic Field B (Tesla)', font: { size: 11, color: C.text, weight: 'bold' } },
            gridcolor: 'rgba(0,0,0,0.06)',
            zerolinecolor: 'rgba(0,0,0,0.06)',
            color: C.muted,
            linecolor: 'rgba(0,0,0,0.1)',
            linewidth: 1,
            range: [0, 5.0]
        },
        yaxis: {
            title: { text: 'Resistivity (h/e²)', font: { size: 11, color: C.text, weight: 'bold' } },
            gridcolor: 'rgba(0,0,0,0.06)',
            zerolinecolor: 'rgba(0,0,0,0.06)',
            color: C.muted,
            linecolor: 'rgba(0,0,0,0.1)',
            linewidth: 1,
            tickvals: [0.2, 0.25, 0.333, 0.5, 1.0],
            ticktext: ['h/5e²', 'h/4e²', 'h/3e²', 'h/2e²', 'h/e²'],
            range: [0, 1.2]
        },
        shapes: [
            {
                type: 'line',
                x0: bField,
                y0: 0,
                x1: bField,
                y1: 1.2,
                line: { color: 'rgba(0,0,0,0.15)', width: 1, dash: 'dash' }
            }
        ]
    };

    return (
        <div style={{ 
            background: '#ffffff', 
            padding: '24px', 
            borderRadius: '24px', 
            border: '1px solid #ddd8ce', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            position: 'relative'
        }}>
            <h3 style={{ fontSize: '0.85rem', color: '#1a1a2e', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px' }}>
                Resistivity Tensor: R<sub>xy</sub> & R<sub>xx</sub>
            </h3>

            <Plot 
                data={data}
                layout={layout}
                config={{ displayModeBar: false, responsive: true }}
                style={{ width: '100%' }}
            />

            <div style={{ marginTop: '15px', fontSize: '0.75rem', color: '#555555', lineHeight: '1.4' }}>
                <b>Experiment:</b> The red peaks in R<sub>xx</sub> occur during the phase transitions where energy gaps are closing.
            </div>
        </div>
    );
}
