import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import DiatomicApp from './modules/DiatomicViz/DiatomicApp';
import About from './pages/About';
import Connect from './pages/Connect';
import Home from './pages/Home';
import LearnLayout from './pages/Learn/LearnLayout';
import LearnIndex from './pages/Learn/index';
function App() {
  const location = useLocation();
  
  useEffect(() => {
    const titles = {
        '/': 'System Log | Ayush Docs',
        '/about': 'About | Ayush Docs',
        '/connect': 'Connect | Ayush Docs',
        '/learn': 'Modules | Ayush Docs',
        '/learn/diatomic-vibration': 'Diatomic Model | Ayush Docs'
    };
    document.title = titles[location.pathname] || 'Ayush Docs | System Log';
  }, [location]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, position: 'relative' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/connect" element={<Connect />} />
          
          {/* Learn Section with specific Layout */}
          <Route path="/learn" element={<LearnLayout />}>
             <Route index element={<LearnIndex />} />
             <Route path="diatomic-vibration" element={<DiatomicApp />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
