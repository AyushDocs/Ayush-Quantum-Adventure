import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Layout/Footer';
import Navbar from './components/Layout/Navbar';
import { useWindowSize } from './hooks/useWindowSize';
import { learnModules } from './modules/registry';
import About from './pages/About';
import Connect from './pages/Connect';
import Home from './pages/Home';
import LearnLayout from './pages/Learn/LearnLayout';
import LearnIndex from './pages/Learn/index';

function App() {
  const { width } = useWindowSize();
  const location = useLocation();
  
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

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Navbar />
      <div style={{ 
          flex: 1, 
          position: 'relative', 
          overflow: isLearnRoute ? (width < 768 ? 'auto' : 'hidden') : 'auto',
          height: isLearnRoute ? (width < 768 ? 'auto' : '100%') : 'auto'
      }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/connect" element={<Connect />} />
          
          {/* Learn Section with specific Layout */}
          <Route path="/learn" element={<LearnLayout />}>
             <Route index element={<LearnIndex />} />
             {learnModules.map(m => (
               <Route key={m.id} path={m.id} element={<m.component />} />
             ))}
          </Route>
        </Routes>
      </div>
      {!isLearnRoute && <Footer />}
    </div>
  )
}

export default App

