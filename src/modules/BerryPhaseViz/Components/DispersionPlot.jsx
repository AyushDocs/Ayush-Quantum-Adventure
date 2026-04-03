import Plot from 'react-plotly.js';

export default function DispersionPlot({ data, state }) {
    const { 
        kValues, 
        energyUpTop, energyUpBottom, 
        energyDownTop, energyDownBottom 
    } = data;
    const { showVectorField, vectorFieldData } = state;

    const plotData = [
        // Spin Up Bands
        {
            x: kValues,
            y: kValues,
            z: energyUpTop,
            type: 'surface',
            colorscale: [[0, '#fbbf24'], [1, '#fbbf24']],
            showscale: false,
            opacity: 0.6,
            name: 'Spin Up (+) Conduction',
            hoverinfo: 'all',
            hovertemplate: '<b>Spin Up (+) Conduction</b><br>kx: %{x:.2f} Å⁻¹<br>ky: %{y:.2f} Å⁻¹<br>Energy: %{z:.2f} eV<extra></extra>',
        },
        {
            x: kValues,
            y: kValues,
            z: energyUpBottom,
            type: 'surface',
            colorscale: [[0, '#d97706'], [1, '#d97706']],
            showscale: false,
            opacity: 0.6,
            name: 'Spin Up (+) Valence',
            hoverinfo: 'all',
            hovertemplate: '<b>Spin Up (+) Valence</b><br>kx: %{x:.2f} Å⁻¹<br>ky: %{y:.2f} Å⁻¹<br>Energy: %{z:.2f} eV<extra></extra>',
        },
        // Spin Down Bands
        {
            x: kValues,
            y: kValues,
            z: energyDownTop,
            type: 'surface',
            colorscale: [[0, '#22d3ee'], [1, '#22d3ee']],
            showscale: false,
            opacity: 0.6,
            name: 'Spin Down (-) Conduction',
            hoverinfo: 'all',
            hovertemplate: '<b>Spin Down (-) Conduction</b><br>kx: %{x:.2f} Å⁻¹<br>ky: %{y:.2f} Å⁻¹<br>Energy: %{z:.2f} eV<extra></extra>',
        },
        {
            x: kValues,
            y: kValues,
            z: energyDownBottom,
            type: 'surface',
            colorscale: [[0, '#2563eb'], [1, '#2563eb']],
            showscale: false,
            opacity: 0.6,
            name: 'Spin Down (-) Valence',
            hoverinfo: 'all',
            hovertemplate: '<b>Spin Down (-) Valence</b><br>kx: %{x:.2f} Å⁻¹<br>ky: %{y:.2f} Å⁻¹<br>Energy: %{z:.2f} eV<extra></extra>',
        }
    ];

    // Add d-vector field if enabled
    if (showVectorField && vectorFieldData) {
        plotData.push({
            type: 'cone',
            x: vectorFieldData.x,
            y: vectorFieldData.y,
            z: vectorFieldData.z,
            u: vectorFieldData.u,
            v: vectorFieldData.v,
            w: vectorFieldData.w,
            sizemode: 'scaled',
            sizeref: 1.5,
            showscale: false,
            colorscale: 'Greys',
            opacity: 1,
            name: 'd-vector',
            hoverinfo: 'u+v+w text',
            text: 'Hamiltonian d-vector (eV)'
        });
    }

    const layout = {
        title: {
            text: '<b>ENERGY DISPERSION: E(k<sub>x</sub>, k<sub>y</sub>) [eV]</b>',
            font: { 
                size: 16, 
                color: 'var(--accent-color)',
                family: 'monospace'
            },
            y: 0.95
        },
        autosize: true,
        scene: {
            xaxis: { 
                title: { text: '<b>Momentum k<sub>x</sub> (Å⁻¹)</b>', font: { size: 10 } },
                gridcolor: 'rgba(255,255,255,0.1)',
                showbackground: false,
                range: [-Math.PI, Math.PI]
            },
            yaxis: { 
                title: { text: '<b>Momentum k<sub>y</sub> (Å⁻¹)</b>', font: { size: 10 } },
                gridcolor: 'rgba(255,255,255,0.1)',
                showbackground: false,
                range: [-Math.PI, Math.PI]
            },
            zaxis: { 
                title: { text: '<b>Energy E (eV)</b>', font: { size: 10 } },
                gridcolor: 'rgba(255,255,255,0.1)',
                showbackground: false,
                range: [-4, 4]
            },
            bgcolor: 'transparent',
            camera: {
                eye: { x: 1.5, y: 1.5, z: 1.2 }
            }
        },
        paper_bgcolor: 'transparent',
        font: { color: 'rgba(255,255,255,0.7)', family: 'monospace' },
        margin: { l: 0, r: 0, b: 0, t: 80 }
    };

    return (
        <div style={{ width: '100%', height: '450px', position: 'relative' }}>
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
                3D MOMENTUM SPACE (Å⁻¹)
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
