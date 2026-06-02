import { useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Layout/Footer';
import Navbar from './components/Layout/Navbar';
import { useWindowSize } from './hooks/useWindowSize';
import ScrollToTop from './components/Layout/ScrollToTop';
import { learnModules } from './modules/registry';
import About from './pages/About';
import Connect from './pages/Connect';
import Home from './pages/Home';
import LearnLayout from './pages/Learn/LearnLayout';
import LearnIndex from './pages/Learn/index';
import Visualizations from './pages/Learn/Visualizations';
import Formulas from './pages/Learn/Formulas';
import ResearchPapers from './pages/Learn/ResearchPapers';

function App() {
  const { width } = useWindowSize();
  const location = useLocation();
  const mainScrollRef = useRef(null);
  
  useEffect(() => {
    // Static page titles
    const staticTitles = {
      '/': 'System Log | Ayush Docs',
      '/about': 'About | Ayush Docs',
      '/connect': 'Connect | Ayush Docs',
      '/learn': 'Modules | Ayush Docs',
    };
    
    // Dynamic module titles from registry
    const moduleTitles = Object.fromEntries(
      learnModules.map(m => [`/learn/${m.id}`, m.title])
    );
    
    const titles = { ...staticTitles, ...moduleTitles };
    document.title = titles[location.pathname] || 'Ayush Docs | System Log';
  }, [location]);
  const isLearnRoute = location.pathname.startsWith('/learn');

  if (width < 768) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#09090b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        color: '#f4f4f5',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Floating animated ambient blur shapes */}
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(184,134,11,0.15) 0%, rgba(0,0,0,0) 70%)',
          top: '-50px',
          left: '-50px',
          borderRadius: '50%',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(218,165,32,0.12) 0%, rgba(0,0,0,0) 70%)',
          bottom: '-50px',
          right: '-50px',
          borderRadius: '50%',
          filter: 'blur(40px)',
        }} />

        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '32px',
          padding: '40px 24px',
          maxWidth: '420px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
          zIndex: 1,
        }}>
          {/* Pulsing Icon */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '72px',
            height: '72px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(184,134,11,0.2) 0%, rgba(218,165,32,0.05) 100%)',
            border: '1px solid rgba(184, 134, 11, 0.3)',
            marginBottom: '28px',
            animation: 'pulse-slow 3s infinite ease-in-out',
          }}>
            {/* Monitor / Laptop Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#daa520" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>

          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: '900',
            letterSpacing: '-0.5px',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #ffffff 30%, #daa520 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 16px 0',
          }}>
            Desktop Experience Required
          </h1>

          <p style={{
            fontSize: '0.92rem',
            color: '#a1a1aa',
            lineHeight: '1.6',
            marginBottom: '0',
            padding: '0 8px',
          }}>
            Ayush Quantum Adventure features complex physical simulations and mathematical derivations designed for larger displays.
          </p>
          
          <div style={{
            marginTop: '28px',
            padding: '12px 16px',
            borderRadius: '16px',
            background: 'rgba(218, 165, 32, 0.05)',
            border: '1px solid rgba(218, 165, 32, 0.1)',
            fontSize: '0.82rem',
            color: '#daa520',
            fontWeight: '600',
          }}>
            Please open this application on a laptop, desktop, or tablet to explore.
          </div>
        </div>

        <style>{`
          @keyframes pulse-slow {
            0%, 100% { transform: scale(1); opacity: 0.9; }
            50% { transform: scale(1.05); opacity: 1; filter: drop-shadow(0 0 8px rgba(184,134,11,0.3)); }
          }
          body {
            background-color: #09090b !important;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Navbar />
      <div 
        ref={mainScrollRef}
        style={{ 
          flex: 1, 
          position: 'relative', 
          overflowX: 'hidden',
          overflowY: isLearnRoute ? (width < 768 ? 'auto' : 'hidden') : 'auto',
          height: '100%'
      }}>
        {isLearnRoute && <ScrollToTop containerRef={mainScrollRef} />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/connect" element={<Connect />} />
          
          {/* Learn Section with specific Layout */}
          <Route path="/learn" element={<LearnLayout />}>
             <Route index element={<LearnIndex />} />
             <Route path="visualizations" element={<Visualizations />} />
             <Route path="formulas" element={<Formulas />} />
             <Route path="papers" element={<ResearchPapers />} />
             {learnModules.map(m => (
               <Route key={m.id} path={`visualizations/${m.id}`} element={<m.component />} />
             ))}
          </Route>
        </Routes>
      </div>
      {!isLearnRoute && <Footer />}
    </div>
  )
}

export default App
