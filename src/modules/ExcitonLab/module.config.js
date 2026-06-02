import React from 'react';
import { Layers } from 'lucide-react';

export default {
  id: 'exciton-lab',
  name: 'Many-Body Quasiparticles',
  icon: Layers,
  color: '#f97316',
  path: '/visualizations/excitons',
  category: 'Collective Phenomena',
  component: React.lazy(() => import('./ExcitonApp')),
  description: 'Visualizing excitons, trions, and many-body complexes in semiconductors.'
};
