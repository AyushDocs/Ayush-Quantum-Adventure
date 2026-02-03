import { useState } from 'react';

export default function XRayControls({ state }) {
    const {
        theta, setTheta,
        phi, setPhi,
        psi, setPsi,
        latticeParam, setLatticeParam,
        latticeType, setLatticeType,
        wavelength, setWavelength,
        autoRotate, setAutoRotate,
        ewaldRadius,
        diffractedIndices,
        isRecording, setIsRecording,
        isPaused, setIsPaused,
        recordedFrames,
        mediaRecorderRef,
        canvasRef
    } = state;
    
    const [isCustomWavelength, setIsCustomWavelength] = useState(false);

    const presetWavelengths = {
        'Cu Kα': 1.5418,
        'Mo Kα': 0.7107,
        'Cr Kα': 2.2909
    };
    
    const handleWavelengthPreset = (e) => {
        const key = e.target.value;
        if (key === 'Custom') {
            setIsCustomWavelength(true);
        } else {
            setIsCustomWavelength(false);
            const value = presetWavelengths[key];
            if (value) setWavelength(value);
        }
    };
    
    const handleRecord = () => {
        if (!isRecording) {
            // Start Recording
            const canvas = canvasRef.current;
            if (!canvas) return;
            
            recordedFrames.current = [];
            const stream = canvas.captureStream(30); // 30 FPS
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    recordedFrames.current.push(e.data);
                }
            };
            
            mediaRecorder.start();
            mediaRecorderRef.current = mediaRecorder;
            
            setIsRecording(true);
            setIsPaused(false);
        } else {
            // Stop Recording
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
            }
            setIsRecording(false);
            setIsPaused(false);
        }
    };
    
    const handlePlayPause = () => {
        if (!autoRotate) {
            setAutoRotate(true);
        } else {
            setAutoRotate(false);
        }
    };
    
    const handleDownload = async () => {
        if (recordedFrames.current.length === 0) {
            alert('No frames recorded. Click Record and rotate the crystal first.');
            return;
        }
        
        const blob = new Blob(recordedFrames.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `xray-diffraction-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
    };
    
    return (
        <div>
            <h2 style={{ 
                fontSize: '1.3rem', 
                marginBottom: '1rem', 
                color: 'var(--text-color)',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '0.5rem'
            }}>
                X-ray Diffraction Controls
            </h2>
            
            {/* Media Controls */}
            <div style={{ 
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap'
            }}>
                <button
                    onClick={handlePlayPause}
                    style={{
                        flex: 1,
                        minWidth: '70px',
                        padding: '0.6rem',
                        background: autoRotate ? 'var(--accent-color)' : 'var(--bg-color)',
                        color: autoRotate ? '#fff' : 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                    }}
                >
                    {autoRotate ? '⏸ Pause' : '▶ Play'}
                </button>
                
                <button
                    onClick={handleRecord}
                    style={{
                        flex: 1,
                        minWidth: '70px',
                        padding: '0.6rem',
                        background: isRecording ? '#ff4444' : 'var(--bg-color)',
                        color: isRecording ? '#fff' : 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                    }}
                >
                    {isRecording ? '⏹ Stop' : '⏺ Record'}
                </button>
                
                <button
                    onClick={handleDownload}
                    style={{
                        flex: 1,
                        minWidth: '70px',
                        padding: '0.6rem',
                        background: 'var(--bg-color)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                    }}
                >
                    ⬇ Download
                </button>
            </div>
            
            {isRecording && (
                <div style={{
                    marginBottom: '1rem',
                    padding: '0.5rem',
                    background: 'rgba(255, 68, 68, 0.1)',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    color: '#ff4444',
                    textAlign: 'center',
                    fontWeight: '600'
                }}>
                    🔴 Recording in progress...
                </div>
            )}
            
            {/* Crystal Rotation */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.8rem', color: 'var(--text-color)' }}>
                    Crystal Orientation
                </h3>
                
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    θ (Theta): {theta.toFixed(1)}°
                </label>
                <input
                    type="range"
                    min="0"
                    max="360"
                    step="1"
                    value={theta}
                    onChange={(e) => setTheta(parseFloat(e.target.value))}
                    style={{ width: '100%', marginBottom: '1rem' }}
                />
                
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    φ (Phi): {phi.toFixed(1)}°
                </label>
                <input
                    type="range"
                    min="0"
                    max="180"
                    step="1"
                    value={phi}
                    onChange={(e) => setPhi(parseFloat(e.target.value))}
                    style={{ width: '100%', marginBottom: '1rem' }}
                />
                
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    ψ (Psi): {psi.toFixed(1)}°
                </label>
                <input
                    type="range"
                    min="0"
                    max="360"
                    step="1"
                    value={psi}
                    onChange={(e) => setPsi(parseFloat(e.target.value))}
                    style={{ width: '100%', marginBottom: '1rem' }}
                />
                
                <button
                    onClick={() => {
                        setTheta(0);
                        setPhi(90);
                        setPsi(0);
                    }}
                    style={{
                        width: '100%',
                        padding: '0.6rem',
                        background: 'var(--bg-color)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                    }}
                >
                    🔄 Reset Rotation
                </button>
            </div>
            
            {/* X-ray Parameters */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.8rem', color: 'var(--text-color)' }}>
                    X-ray Parameters
                </h3>
                
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Wavelength Preset
                </label>
                <select
                    onChange={handleWavelengthPreset}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        marginBottom: '1rem',
                        background: 'var(--bg-color)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px'
                    }}
                >
                    <option value="Cu Kα">Cu Kα (1.5418 Å)</option>
                    <option value="Mo Kα">Mo Kα (0.7107 Å)</option>
                    <option value="Cr Kα">Cr Kα (2.2909 Å)</option>
                    <option value="Custom">Custom</option>
                </select>
                
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Wavelength: {wavelength.toFixed(4)} Å
                </label>
                <input
                    type="range"
                    min="0.5"
                    max="3.0"
                    step="0.01"
                    value={wavelength}
                    onChange={(e) => {
                         if (isCustomWavelength) {
                             setWavelength(parseFloat(e.target.value));
                         }
                    }}
                    disabled={!isCustomWavelength}
                    style={{ 
                        width: '100%', 
                        marginBottom: '1rem',
                        opacity: isCustomWavelength ? 1 : 0.5,
                        cursor: isCustomWavelength ? 'pointer' : 'not-allowed'
                    }}
                />
                
                <div style={{ 
                    padding: '0.5rem', 
                    background: 'rgba(64, 128, 255, 0.1)', 
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)'
                }}>
                    Ewald radius: {ewaldRadius.toFixed(3)} Å⁻¹
                </div>
            </div>
            
            {/* Crystal Lattice */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.8rem', color: 'var(--text-color)' }}>
                    Crystal Lattice
                </h3>
                
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Structure Type
                </label>
                <select
                    value={latticeType}
                    onChange={(e) => setLatticeType(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        marginBottom: '1rem',
                        background: 'var(--bg-color)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px'
                    }}
                >
                    <option value="SC">Simple Cubic (SC)</option>
                    <option value="BCC">Body Centered Cubic (BCC)</option>
                    <option value="FCC">Face Centered Cubic (FCC)</option>
                    <option value="Diamond">Diamond Cubic</option>
                </select>
                
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Lattice Parameter (a): {latticeParam.toFixed(2)} Å
                </label>
                <input
                    type="range"
                    min="3.0"
                    max="8.0"
                    step="0.1"
                    value={latticeParam}
                    onChange={(e) => setLatticeParam(parseFloat(e.target.value))}
                    style={{ width: '100%', marginBottom: '0.5rem' }}
                />
                
                <div style={{ 
                    padding: '0.5rem', 
                    background: 'rgba(255, 136, 0, 0.1)', 
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)'
                }}>
                    {latticeType === 'SC' && 'Simple Cubic'}
                    {latticeType === 'BCC' && 'Body-Centered Cubic'}
                    {latticeType === 'FCC' && 'Face-Centered Cubic'}
                    {latticeType === 'Diamond' && 'Diamond Cubic'}
                </div>
            </div>
            
            {/* Diffracted Reflections */}
            <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.8rem', color: 'var(--text-color)' }}>
                    Diffracted Reflections
                </h3>
                
                {diffractedIndices.length > 0 ? (
                    <div style={{ 
                        padding: '0.8rem', 
                        background: 'rgba(0, 255, 0, 0.1)', 
                        borderRadius: '4px',
                        border: '1px solid rgba(0, 255, 0, 0.3)'
                    }}>
                        {diffractedIndices.map((indices, idx) => (
                            <div key={idx} style={{ 
                                fontSize: '0.9rem', 
                                color: '#00ff00',
                                fontFamily: 'monospace',
                                marginBottom: idx < diffractedIndices.length - 1 ? '0.3rem' : 0
                            }}>
                                {indices}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ 
                        padding: '0.8rem', 
                        background: 'rgba(128, 128, 128, 0.1)', 
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        fontStyle: 'italic'
                    }}>
                        No reflections in diffraction condition
                    </div>
                )}
            </div>
            
            {/* Info */}
            <div style={{ 
                marginTop: '1.5rem',
                padding: '0.8rem', 
                background: 'rgba(64, 128, 255, 0.05)', 
                borderRadius: '4px',
                borderLeft: '3px solid var(--accent-color)',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.5'
            }}>
                <strong>Tip:</strong> Rotate the crystal to bring reciprocal lattice points onto the Ewald sphere (blue). 
                When a point touches the sphere, it satisfies the Bragg condition and diffracts (shown in green).
            </div>
        </div>
    );
}
