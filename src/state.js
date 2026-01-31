export class AppState {
    constructor() {
        this.state = {
            l: 0,             // Rotational quantum number (renamed from J)
            v: 0,             // Vibrational quantum number
            n: 0,             // Electronic state index
            k: 1.0,           // Bond stiffness (effective spring constant)
            isRunning: true
        };
        this.listeners = [];
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify(key, value) {
        this.listeners.forEach(fn => fn(key, value, this.state));
    }

    allowUpdate(key, value) {
        // Validate inputs if necessary
        if (this.state[key] === value) return;
        this.state[key] = value;
        this.notify(key, value);
    }

    get(key) {
        return this.state[key];
    }
}

export const globalState = new AppState();
