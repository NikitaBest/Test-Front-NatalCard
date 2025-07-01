import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Splash from './pages/Splash';
import Start from './pages/Start';
import Name from './pages/Name';
import Gender from './pages/Gender';
import BirthDate from './pages/BirthDate';
import BirthTime from './pages/BirthTime';
import BirthCity from './pages/BirthCity';
import Success from './pages/Success';

function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
      setTimeout(() => setShowSplash(false), 500); // 500ms for fade out
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash && <Splash fadeOut={!isAppLoading} />}
      {!showSplash && (
        <Routes>
          <Route path="/" element={<Navigate to="/start" replace />} />
          <Route path="/start" element={<Start />} />
          <Route path="/name" element={<Name />} />
          <Route path="/gender" element={<Gender />} />
          <Route path="/birth-date" element={<BirthDate />} />
          <Route path="/birth-time" element={<BirthTime />} />
          <Route path="/birth-city" element={<BirthCity />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      )}
    </>
  );
}
export default App;
