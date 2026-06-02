import { useMemo } from 'react';
import Plot from 'react-plotly.js';

const C = {
  bg: '#ffffff',
  text: '#1a1a2e',
  muted: '#555555',
  border: '#ddd8ce',
};

export default function HallSpectroPlot({ landauLevels, fermiLevel }) {
    const height = 250;

    // Build the line data arrays
    const { filledX, filledY, emptyX, emptyY } = useMemo(() => {
        const filledX = [];
        const filledY = [];
        const emptyX = [];
        const emptyY = [];

        landauLevels.forEach((E) => {
            const isFilled = E < fermiLevel;
            if (isFilled) {
                filledX.push(0, 1, null);
                filledY.push(E, E, null);
            } else {
                emptyX.push(0, 1, null);
                emptyY.push(E, E, null);
            }
        });

        return { filledX, filledY, emptyX, emptyY };
    }, [landauLevels, fermiLevel]);

    const data = [
        {
            x: filledX,
            y: filledY,
            type: 'scatter',
            mode: 'lines',
            name: 'Filled Landau Levels',
            line: { color: '#10b981', width: 2.5 }
        },
        {
            x: emptyX,
            y: emptyY,
            type: 'scatter',
            mode: 'lines',
            name: 'Empty Landau Levels',
            line: { color: '#3b82f6', width: 1.5, dash: 'dash' }
        },
        {
            x: [0, 1],
            y: [fermiLevel, fermiLevel],
            type: 'scatter',
            mode: 'lines',
            name: 'Fermi Level E<sub>F</sub>',
            line: { color: '#f43f5e', width: 1.5, dash: 'dash' }
        }
    ];

    // Broadening shapes around each Landau level
    const shapes = useMemo(() => {
        return landauLevels.map((E) => {
            const isFilled = E < fermiLevel;
            return {
                type: 'rect',
                x0: 0,
                x1: 1,
                y0: E - 0.2,
                y1: E + 0.2,
                fillcolor: isFilled ? 'rgba(16, 185, 129, 0.12)' : 'rgba(59, 130, 246, 0.06)',
                line: { width: 0 }
            };
        });
    }, [landauLevels, fermiLevel]);

    const layout = {
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { color: C.muted, size: 10, family: 'sans-serif' },
        margin: { l: 75, r: 20, t: 40, b: 50 },
        height: height,
        showlegend: true,
        legend: {
            orientation: 'h',
            x: 0.5,
            xanchor: 'center',
            y: 1.25,
            font: { size: 9, color: C.muted }
        },
        xaxis: {
            title: { text: 'Density of States (DOS)', font: { size: 11, color: C.text, weight: 'bold' } },
            gridcolor: 'rgba(0,0,0,0.06)',
            zerolinecolor: 'rgba(0,0,0,0.06)',
            color: C.muted,
            linecolor: 'rgba(0,0,0,0.1)',
            linewidth: 1,
            range: [0, 1.0],
            showticklabels: false
        },
        yaxis: {
            title: { text: 'Energy (E)', font: { size: 11, color: C.text, weight: 'bold' } },
            gridcolor: 'rgba(0,0,0,0.06)',
            zerolinecolor: 'rgba(0,0,0,0.06)',
            color: C.muted,
            linecolor: 'rgba(0,0,0,0.1)',
            linewidth: 1,
            tickvals: landauLevels,
            ticktext: landauLevels.map((E, n) => `n=${n} (${E.toFixed(2)})`),
            range: [0, Math.max(2.5, ...landauLevels) + 0.3]
        },
        shapes: shapes,
        annotations: [
            {
                x: 0.85,
                y: fermiLevel,
                text: `E<sub>F</sub>: ${fermiLevel.toFixed(2)}`,
                showarrow: false,
                font: { color: '#f43f5e', size: 9, weight: 'bold' },
                bgcolor: '#ffffff',
                bordercolor: '#ddd8ce',
                borderwidth: 1,
                borderpad: 4
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
                Landau Level Spectroscopy
            </h3>

            <Plot 
                data={data}
                layout={layout}
                config={{ displayModeBar: false, responsive: true }}
                style={{ width: '100%' }}
            />

            <div style={{ marginTop: '15px', fontSize: '0.75rem', color: '#555555', lineHeight: '1.4' }}>
                B-Field is forcing states into tight energy peaks. The <b>Hall Plateaus</b> happen when the Fermi Level is trapped in the gap between these levels.
            </div>
        </div>
    );
}
