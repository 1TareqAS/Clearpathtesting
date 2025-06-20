import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, useAppContext } from './contexts/AppContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Scripts from './pages/Scripts';
import Admin from './pages/Admin';
import clsx from 'clsx';

const AppContent: React.FC = () => {
  const { state } = useAppContext();

  useEffect(() => {
    // Apply theme to html element
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply RTL direction
    if (state.language === 'AR') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
  }, [state.theme, state.language]);

  return (
    <Router>
      <div className={clsx(
        'min-h-screen flex flex-col',
        'transition-colors duration-200',
        state.theme === 'dark' ? 'dark' : ''
      )}>
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scripts" element={<Scripts />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;