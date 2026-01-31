import { globalState } from '../state.js';

export function setupControls() {
    // Sliders for n/v removed. Using buttons. k remains.
    // L slider removed.
    
    // const sliderL = document.getElementById('slider-l'); // Removed from DOM
    // const dispL = document.getElementById('disp-l');     // Removed from DOM
    
    // const sliderV = document.getElementById('slider-v'); // Removed from DOM
    // const dispV = document.getElementById('disp-v');     // Removed from DOM
    
    const sliderK = document.getElementById('slider-k');
    // dispK removed or renamed? In HTML I have <span id="math-k">.
    // Previous code: const dispK = document.getElementById('disp-k');
    // HTML now: <span>k: <span id="math-k">1.0</span></span>
    // I should update sliderK to update 'math-k' immediately for responsiveness, 
    // although state update does it too via molecule.js animation loop.
    // Let's check if 'disp-k' exists. It doesn't in new HTML.
    
    const selectElec = document.getElementById('select-elec');

    const moleculeContainer = document.getElementById('molecule-container');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const plotContainers = {
        electronic: document.getElementById('plot-electronic'),
        spectra: document.getElementById('plot-spectra')
    };

    // --- Event Listeners ---

    // Removed sliderL listener
    
    // Removed sliderV listener

    if (sliderK) {
        sliderK.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            // dispK removed. The value is updated in 'math-k' via Animation Loop or we can set it here.
            // Let's set it here for instant feedback if loop is slow? Loop is 60fps.
             globalState.allowUpdate('k', val);
        });
    }

    if (selectElec) {
        selectElec.addEventListener('change', (e) => {
            const val = parseInt(e.target.value);
            globalState.allowUpdate('n', val);
        });
    }

    // --- Transitions (Buttons) ---
    const btnEmitL = document.getElementById('btn-emit-l');
    const btnAbsorbL = document.getElementById('btn-absorb-l');
    const btnEmitV = document.getElementById('btn-emit-v');
    const btnAbsorbV = document.getElementById('btn-absorb-v');

    if (btnEmitL) {
        btnEmitL.addEventListener('click', () => {
            const currentL = globalState.get('l');
            if (currentL > 0) {
                const newL = currentL - 1;
                globalState.allowUpdate('l', newL);
                // Removed slider/disp update
            }
        });
    }
    if (btnAbsorbL) {
        btnAbsorbL.addEventListener('click', () => {
            const currentL = globalState.get('l');
            if (currentL < 20) {
                const newL = currentL + 1;
                globalState.allowUpdate('l', newL);
                // Removed slider/disp update
            }
        });
    }

    if (btnEmitV) {
        btnEmitV.addEventListener('click', () => {
            const currentV = globalState.get('v');
            if (currentV > 0) {
                const newV = currentV - 1;
                globalState.allowUpdate('v', newV);
                // Removed slider/disp update
            }
        });
    }
    if (btnAbsorbV) {
        btnAbsorbV.addEventListener('click', () => {
            const currentV = globalState.get('v');
            if (currentV < 10) {
                const newV = currentV + 1;
                globalState.allowUpdate('v', newV);
                // Removed slider/disp update
            }
        });
    }

    // Tab Switching
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // UI Update
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Plot Container Update
                Object.values(plotContainers).forEach(div => {
                   if (div) div.classList.remove('active');
                });
                const tabName = btn.dataset.tab;
                if (plotContainers[tabName]) {
                    plotContainers[tabName].classList.add('active');
                }

                // Trigger Resize for Plotly through state or direct event mock
                // (Plots.js should listen to resize or state updates to redraw)
                globalState.notify('tabSwitch', tabName);
            });
        });
    }

    // Resize Observer
    new ResizeObserver(() => {
        globalState.notify('resize', null);
    }).observe(moleculeContainer);
}
