import SuperconductorApp from './SuperconductorApp';
import { Snowflake } from 'lucide-react';

export default {
    id: 'superconductivity',
    name: 'Superconductivity Lab',
    description: 'Explore zero resistance, Cooper pairs, and the Meissner Effect.',
    icon: Snowflake,
    component: SuperconductorApp,
    path: '/learn/superconductivity',
    color: '#22d3ee',
    category: 'Quantum Phases'
};
