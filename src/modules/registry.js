import diatomicConfig from './DiatomicViz/module.config';
import xrayConfig from './XRayDiffraction/module.config';
import berryConfig from './BerryPhaseViz/module.config';
import quantumHallConfig from './QuantumHallViz/module.config';
import grapheneConfig from './GrapheneViz/module.config';
import superconductorConfig from './SuperconductorViz/module.config';
import weylConfig from './WeylSemimetalViz/module.config';
import andreevConfig from './AndreevLabViz/module.config';
import majoranaConfig from './MajoranaViz/module.config';
import alterConfig from './AltermagnetViz/module.config';
import topologicalConfig from './TopologicalInsulatorViz/module.config';
import topological3DConfig from './TopologicalInsulator3D/module.config';
import twoDEGConfig from './2DEG_Viz/module.config';
import ybcoConfig from './YBCO_Viz/module.config';
import twistedGrapheneConfig from './TwistedGraphene_Viz/module.config';
import skyrmionConfig from './Skyrmion_Viz/module.config';
import superfluidConfig from './Superfluid_Viz/module.config';
import fermiLiquidConfig from './FermiLiquid_Viz/module.config';
import symmetryConfig from './Symmetry_Viz/module.config';
import thinFilmConfig from './ThinFilm_Lab/module.config';
import ramanConfig from './Raman_Viz/module.config';
import aharonovBohmConfig from './AharonovBohm_Viz/module.config';

export const learnModules = [
  // Fundamentals & Spectroscopy
  diatomicConfig,
  ramanConfig,
  xrayConfig,
  
  // Quantum Effects & Phases
  aharonovBohmConfig,
  berryConfig,
  symmetryConfig,
  
  // Low-Dimensional Systems
  twoDEGConfig,
  grapheneConfig,
  twistedGrapheneConfig,
  
  // Collective Phenomena
  fermiLiquidConfig,
  superfluidConfig,
  superconductorConfig,
  ybcoConfig,
  andreevConfig,
  
  // Topology & Advanced Materials
  quantumHallConfig,
  topologicalConfig,
  topological3DConfig,
  weylConfig,
  majoranaConfig,
  
  // Exotic States & Lab
  skyrmionConfig,
  alterConfig,
  thinFilmConfig
];
