import { Constants } from '../constants.js';
import { calculateRotationalEnergy } from '../physics/rotor.js';
import { globalState } from '../state.js';

export class MoleculeViz {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;

        // Init Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);

        // Init Camera
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
        this.camera.position.set(0, 0, 8);

        // Init Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.width, this.height);
        this.container.appendChild(this.renderer.domElement);

        // Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        this.scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(5, 5, 5);
        this.scene.add(dirLight);

        // Molecule Objects
        this.group = new THREE.Group();
        this.scene.add(this.group);

        this.atom1 = null; // Carbon
        this.atom2 = null; // Oxygen
        this.bond = null;

        this.createMolecule();

        // Animation State
        this.rotationAngle = 0;
        this.vibrationPhase = 0;

        // Subscribe to state changes (mostly for resizing or immediate updates)
        globalState.subscribe((key, val) => {
            if (key === 'resize') this.onResize();
        });

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    createMolecule() {
        // Materials
        const carbonMat = new THREE.MeshPhongMaterial({ color: 0x333333, shininess: 100 });
        const oxygenMat = new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 100 });
        const bondMat = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });

        // Geometry
        const atomGeo = new THREE.SphereGeometry(0.6, 32, 32); // Scaled up for viz
        const bondGeo = new THREE.CylinderGeometry(0.2, 0.2, 1, 32);

        // Meshes
        this.atom1 = new THREE.Mesh(atomGeo, carbonMat);
        this.atom2 = new THREE.Mesh(atomGeo, oxygenMat);
        
        // Bond needs to be capable of stretching.
        // Easiest is to scale the cylinder in Y, but we need to pivot correctly.
        // Instead, we'll separate the atoms and scale the bond mesh.
        // Bond
        this.bond = new THREE.Mesh(bondGeo, bondMat);
        this.bond.rotation.z = Math.PI / 2; // Align along X axis initially

        // --- Electron Clouds (Visual Enhancement) ---
        const cloudGeo = new THREE.SphereGeometry(1.0, 32, 32); // Larger than atoms (0.6)
        const cloudMat = new THREE.MeshBasicMaterial({ 
            color: 0x64b5f6, 
            transparent: true, 
            opacity: 0.2,
            depthWrite: false,
            blending: THREE.AdditiveBlending 
        });

        this.cloud1 = new THREE.Mesh(cloudGeo, cloudMat.clone());
        this.cloud2 = new THREE.Mesh(cloudGeo, cloudMat.clone());
        
        // --- Angular Momentum Vector L ---
        // Direction is Z axis (since we rotate around Z)
        const dir = new THREE.Vector3(0, 0, 1);
        const origin = new THREE.Vector3(0, 0, 0);
        const length = 1;
        const hex = 0xffff00; // Yellow for L vector
        this.vectorL = new THREE.ArrowHelper(dir, origin, length, hex, 0.5, 0.3);
        
        this.group.add(this.atom1);
        this.group.add(this.atom2);
        this.group.add(this.cloud1);
        this.group.add(this.cloud2);
        this.group.add(this.bond);
        this.group.add(this.vectorL);
    }

    onResize() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }

    animate(time) {
        requestAnimationFrame(this.animate);

        const state = globalState.state;
        const l = state.l;
        const v = state.v;
        const k = state.k;
        const n = state.n;

        // --- Physics for Animation ---
        
        // Equilibrium length (scaled for viz)
        const r_eq_viz = 3.0; 
        
        // Vibration
        // Frequency proportional to sqrt(k/mu). Let's just use sqrt(k) * factor for viz speed.
        const omega = Math.sqrt(k) * 0.005; // Time scaling
        // Amplitude depends on v (highly simplified: A ~ sqrt(v+0.5))
        // We add a base amplitude so v=0 still has ZPE motion visible
        const amplitude = 0.2 * Math.sqrt(v + 0.5); 
        
        this.vibrationPhase += omega * 16; // approx 60fps * 16ms
        const displacement = amplitude * Math.sin(this.vibrationPhase);
        const r_current = r_eq_viz + displacement;

        // Rotation
        // Speed proportional to sqrt(E_rot) ~ sqrt(l(l+1))
        // Or simply proportional to l for clarity.
        // Let's use l * const.
        const rotSpeed = l * 0.02;
        this.rotationAngle += rotSpeed;

        // --- Update Meshes ---

        // Position atoms around center (center of mass approx)
        // Carbon is lighter (12) vs Oxygen (16). CM is closer to Oxygen.
        // x_c = - (m_o / M) * r, x_o = (m_c / M) * r
        const mC = Constants.massC;
        const mO = Constants.massO;
        const M = mC + mO;
        
        const xC = -(mO / M) * r_current;
        const xO = (mC / M) * r_current;

        if (this.atom1 && this.atom2 && this.bond) {
            this.atom1.position.set(xC, 0, 0);
            this.atom2.position.set(xO, 0, 0);
            
            // Clouds follow atoms
            this.cloud1.position.copy(this.atom1.position);
            this.cloud2.position.copy(this.atom2.position);

            // Update Cloud Appearance based on Electronic State (n)
            // n=0: tight, blueish
            // n=1: larger, reddish?
            let scale = 1.0 + n * 0.3;
            let opacity = 0.2 + n * 0.1;
            let color = (n === 0) ? 0x64b5f6 : ((n === 1) ? 0xffb74d : 0xe57373); // Blue -> Orange -> Red
            
            this.cloud1.scale.set(scale, scale, scale);
            this.cloud2.scale.set(scale*1.1, scale*1.1, scale*1.1); // Oxygen slightly larger cloud? or just same
            
            this.cloud1.material.opacity = opacity;
            this.cloud1.material.color.setHex(color);
            this.cloud2.material.opacity = opacity;
            this.cloud2.material.color.setHex(color);


            // Scale bond
            const bondLen = r_current; // Distance between centers
            // Cylinder height is 1 by default. We scale x to fit (bond geometry is rotated Z=90)
            // Wait, cylinder along Y default. Rotated Z=90 puts it along X. 
            // We scale Y-axis of the geometry (which is now X-axis of world).
            this.bond.scale.set(1, bondLen, 1);
            this.bond.position.set( (xC+xO)/2, 0, 0 );

            // Apply global rotation
            this.group.rotation.z = this.rotationAngle;
            
            // Also add some 3D rotation so it doesn't look flat
            this.group.rotation.y = Math.PI / 6; 
            
            // Update Angular Momentum Vector
            if (l > 0) {
                this.vectorL.visible = true;
                // Length proportional to magnitude L = sqrt(l(l+1))
                // Scale factor for viz
                const L_mag = Math.sqrt(l * (l + 1));
                this.vectorL.setLength(L_mag * 0.8, L_mag * 0.2, L_mag * 0.1); 
                // Always point up/down along z-axis of the group (which rotates)
                // wait, if we add vectorL TO THE GROUP, it will rotate WITH the group.
                // The angular momentum vector L is perpendicular to the plane of rotation.
                // If the molecule rotates in X-Y plane (around Z), L is along Z.
                // As the molecule rotates, L is constant (in absence of external torque).
                // So L should point along Z local axis.
                // Since this.vectorL is in this.group, and this.group rotates around Z, 
                // A vector pointing along Z (0,0,1) will effectively spin around its own axis, looking stationary.
                // Correct.
            } else {
                this.vectorL.visible = false;
            }
        }

        this.renderer.render(this.scene, this.camera);
        this.controls.update();

        // Update Info Overlay (Safeguard IDs)
        const elValL = document.getElementById('val-l'); // assumes rename
        const elValV = document.getElementById('val-v');
        if (elValL) elValL.textContent = l;
        if (elValV) elValV.textContent = v;
        
        // Calculate simplified energies for display
        const E_rot = calculateRotationalEnergy(l);
        // E_vib = (v + 1/2) * hbar * omega. (Using k for omega)
        // omega_phys = sqrt(k/mu)
        const omega_phys = Math.sqrt(k / Constants.reducedMass);
        const E_vib = (v + 0.5) * Constants.hbar * omega_phys;
        const E_total = E_rot + E_vib; // Simplified total (rigid rotor + harmonic)

        const elEnergyL = document.getElementById('energy-l'); // assumes rename
        const elEnergyV = document.getElementById('energy-v');
        if (elEnergyL) elEnergyL.textContent = E_rot.toFixed(2);
        if (elEnergyV) elEnergyV.textContent = E_vib.toFixed(2);

        // --- Live Math Updates ---
        // We do this every frame. DOM access is fast enough for this simple text.
        
        // 1. Rigid Rotor
        const elMathL = document.getElementById('math-l'); // assumes rename
        const elOmega = document.getElementById('math-omegaRot');
        const elTheta = document.getElementById('math-theta');

        if (elMathL) elMathL.textContent = l;
        if (elOmega) elOmega.textContent = rotSpeed.toFixed(4);
        if (elTheta) {
            let thetaNorm = this.rotationAngle % (2 * Math.PI);
            if (thetaNorm < 0) thetaNorm += 2 * Math.PI;
            elTheta.textContent = thetaNorm.toFixed(2);
        }



        // 2. Harmonic Oscillator
        document.getElementById('math-k').textContent = k.toFixed(1);
        document.getElementById('math-xeq').textContent = r_eq_viz.toFixed(2);
        document.getElementById('math-r').textContent = r_current.toFixed(2);
        
        // Calculate V(r) = 0.5 * k * (r - req)^2 based on VIZ units for consistency in this panel
        // (Note: The phys engine uses different units, but we want to show the 'math' matching the animation)
        const displacement_viz = r_current - r_eq_viz;
        const V_viz = 0.5 * k * displacement_viz * displacement_viz; // Using k directly as proxy
        document.getElementById('math-Vr').textContent = V_viz.toFixed(3);

        // 3. Electronic / Total
        document.getElementById('math-n').textContent = state.n;
        document.getElementById('math-Etotal').textContent = E_total.toFixed(2);
    }
}
