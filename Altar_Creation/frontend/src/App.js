import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import AltarBuilder from './components/AltarBuilder';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/altar" element={<AltarBuilder />} />
      </Routes>
    </Router>
  );
}

export default App;