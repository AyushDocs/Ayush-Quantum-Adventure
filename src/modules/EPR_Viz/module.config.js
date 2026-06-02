import React from 'react';
import { Share2 } from 'lucide-react';

export default {
  id: 'epr-paradox',
  name: 'EPR Paradox & Entanglement',
  icon: Share2,
  color: '#ec4899',
  path: '/visualizations/epr-paradox',
  category: 'Quantum Effects & Phases',
  component: React.lazy(() => import('./EPRApp')),
  description: 'Demonstrating quantum entanglement and non-local correlations.'
};
