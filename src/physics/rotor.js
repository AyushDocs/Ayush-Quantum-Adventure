import { Constants } from '../constants.js';

export function calculateRotationalEnergy(l) {
    // E_l = B * l * (l + 1)
    const B = Constants.B;
    return B * l * (l + 1);
}
