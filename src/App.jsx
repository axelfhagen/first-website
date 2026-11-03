import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { useI18n } from './i18n/useI18n.js';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import LavaBackground from './components/LavaBackground.jsx';
import Home from './routes/Home.jsx';
import Plog from './routes/Plog.jsx';
import Trip from './routes/Trip.jsx';
import NotFound from './routes/NotFound.jsx';

/** Scroll to the #hash target, or to the top on a new page. Back/forward keeps the browser's position. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    if (navType !== 'POP') window.scrollTo(0, 0);
  }, [pathname, hash, navType]);

  return null;
}

export default function App() {
  const { t } = useI18n();
  return (
    <>
      <a href="#main" className="skip-link">
        {t('nav.skip')}
      </a>
      <ScrollManager />
      <LavaBackground />
      <Header />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plog" element={<Plog />} />
          <Route path="/plog/:tripId" element={<Trip />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
