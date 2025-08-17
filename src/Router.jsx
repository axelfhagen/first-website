import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Plog from './pages/Plog';
import { LanguageProvider } from './contexts/LanguageContext';

function AppRouter() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/plog" element={<Plog />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default AppRouter;