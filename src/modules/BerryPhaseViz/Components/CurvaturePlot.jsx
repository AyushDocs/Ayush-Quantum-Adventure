import Plot from 'react-plotly.js';
import { Maximize2, Minimize2 } from 'lucide-react';

export default function CurvaturePlot({ data, state }) {
    const { kValues, curvature } = data;
    const { isCurvature3D = false, setIsCurvature3D = () => {} } = state || {};

    const plotData = [
        {
            x: kValues,
            y: kValues,
            z: curvature,
            type: isCurvature3D ? 'surface' : 'heatmap',
            colorscale: 'Portland',
            showscale: true,
            colorbar: {
                title: 'Ω(k) (Å²)',
                titleside: 'right',
                tickfont: { color: '#fff' }
            },
            hovertemplate: 'kx: %{x:.2f} Å⁻¹<br>ky: %{y:.2f} Å⁻¹<br>Curvature: %{z:.2f} Å²<extra></extra>'
        }
    ];

    const heatmapLayout = {
        xaxis: { 
            title: { text: '<b>Momentum k<sub>x</sub> (Å⁻¹)</b>', font: { size: 11, color: '#888' } },
            gridcolor: 'rgba(255,255,255,0.05)',
            zerolinecolor: 'rgba(255,255,255,0.2)',
            tickfont: { color: '#666' }
        },
        yaxis: { 
            title: { text: '<b>Momentum k<sub>y</sub> (Å⁻¹)</b>', font: { size: 11, color: '#888' } },
            gridcolor: 'rgba(255,255,255,0.05)',
            zerolinecolor: 'rgba(255,255,255,0.2)',
            tickfont: { color: '#666' }
        }
    };

    const surfaceLayout = {
        scene: {
            xaxis: { title: 'kx', gridcolor: '#333', tickfont: { color: '#666' } },
            yaxis: { title: 'ky', gridcolor: '#333', tickfont: { color: '#666' } },
            zaxis: { title: 'Ω', gridcolor: '#333', tickfont: { color: '#666' } },
            camera: {
                eye: { x: 1.5, y: 1.5, z: 1.2 }
            },
            backgroundColor: 'transparent'
        }
    };

    const layout = {
        title: {
            text: `<b>${isCurvature3D ? '3D TOPOLOGICAL LANDSCAPE' : 'TOPOLOGICAL FLUX MAP'}</b>`,
            font: { 
                size: 16, 
                color: 'var(--accent-color)',
                family: 'monospace'
            },
            y: 0.95
        },
        autosize: true,
        ...(isCurvature3D ? surfaceLayout : heatmapLayout),
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { color: '#fff', family: 'monospace' },
        margin: { l: 60, r: 20, b: 60, t: 70 },
        hovermode: 'closest'
    };

    return (
        <div style={{ width: '100%', height: '450px', position: 'relative' }}>
            {/* Toggle Button */}
            <button 
                onClick={() => setIsCurvature3D(!isCurvature3D)}
                style={{
                    position: 'absolute',
                    top: '15px',
                    right: '100px',
                    zIndex: 10,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--accent-color)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.7rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backdropFilter: 'blur(5px)',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
            >
                {isCurvature3D ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                {isCurvature3D ? '2D HEATMAP' : '3D LANDSCAPE'}
            </button>

            {/* Context Label Overlay */}
            <div style={{ 
                position: 'absolute', 
                top: '15px', 
                left: '15px', 
                background: 'rgba(255,255,255,0.05)', 
                padding: '4px 10px', 
                borderRadius: '4px',
                fontSize: '0.65rem',
                borderLeft: '2px solid var(--accent-color)',
                zIndex: 5,
                color: '#888',
                letterSpacing: '1px'
            }}>
                {isCurvature3D ? '3D BERRY CURVATURE' : '2D CURVATURE HEATMAP'}
            </div>
            <Plot
                data={plotData}
                layout={layout}
                useResizeHandler={true}
                style={{ width: '100%', height: '100%' }}
                config={{ displayModeBar: false }}
            />
        </div>
    );
}
