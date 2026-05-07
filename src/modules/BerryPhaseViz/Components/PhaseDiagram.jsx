import Plot from 'react-plotly.js';

export default function PhaseDiagram({ state }) {
    const { phaseSpaceData, mass, h, showExchange } = state;
    if (!phaseSpaceData) return null;

    const { mValues, hValues, phaseMap } = phaseSpaceData;

    const plotData = [
        {
            x: mValues,
            y: hValues,
            z: phaseMap,
            type: 'heatmap',
            colorscale: [
                [0, '#3b82f6'],      // C = -2 (Blue)
                [0.25, '#60a5fa'],   // C = -1
                [0.5, '#1e293b'],    // C = 0 (Dark)
                [0.75, '#f472b6'],   // C = 1
                [1, '#ec4899']       // C = 2 (Pink)
            ],
            showscale: false,
            hoverinfo: 'none'
        },
        // Current Position Marker
        {
            x: [mass],
            y: [showExchange ? h : 0],
            mode: 'markers',
            type: 'scatter',
            marker: {
                color: '#fff',
                size: 12,
                line: { color: 'var(--accent-color)', width: 2 },
                symbol: 'cross'
            },
            name: 'Current State'
        }
    ];

    const layout = {
        autosize: true,
        margin: { l: 40, r: 10, b: 40, t: 30 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'rgba(0,0,0,0.2)',
        xaxis: { 
            title: { text: 'Mass (M)', font: { size: 10, color: '#888' } },
            range: [-1, 3],
            tickfont: { size: 9, color: '#666' },
            gridcolor: 'rgba(255,255,255,0.05)',
            zeroline: false
        },
        yaxis: { 
            title: { text: 'Exchange (h)', font: { size: 10, color: '#888' } },
            range: [0, 2],
            tickfont: { size: 9, color: '#666' },
            gridcolor: 'rgba(255,255,255,0.05)',
            zeroline: false
        },
        showlegend: false,
        annotations: [
            {
                x: 1, y: 0.2,
                text: 'C=1',
                showarrow: false,
                font: { color: '#fff', size: 10 }
            },
            {
                x: -0.5, y: 0.2,
                text: 'C=0',
                showarrow: false,
                font: { color: '#888', size: 10 }
            }
        ]
    };

    const handlePointerAction = (data) => {
        if (!data || !data.points || data.points.length === 0) return;
        const { x, y } = data.points[0];
        
        // Update mass and h
        state.setMass(parseFloat(x));
        state.setH(parseFloat(y));
        
        // Auto-enable exchange splitting if you click away from h=0
        if (Math.abs(y) > 0.01 && !state.showExchange) {
            state.setShowExchange(true);
        }
    };

    return (
        <div style={{ 
            background: 'rgba(0,0,0,0.3)', 
            borderRadius: '12px', 
            padding: '10px',
            border: '1px solid rgba(255,255,255,0.05)',
            marginTop: '10px',
            cursor: 'crosshair'
        }}>
            <div style={{ fontSize: '0.7rem', color: '#aaa', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
                <span>Topological Phase Map</span>
                <span style={{ color: 'var(--accent-color)' }}>Interactive</span>
            </div>
            <Plot
                data={plotData}
                layout={layout}
                onClick={handlePointerAction}
                onRelayout={handlePointerAction}
                useResizeHandler={true}
                config={{ 
                    displayModeBar: false, 
                    staticPlot: false,
                    responsive: true,
                    scrollZoom: false,
                    dragmode: 'select'
                }}
                style={{ width: '100%', height: '220px', cursor: 'crosshair' }}
            />
            <p style={{ fontSize: '0.65rem', color: '#666', marginTop: '6px', textAlign: 'center', fontStyle: 'italic' }}>
                Click or drag on the map to jump between phases
            </p>
        </div>
    );
}
