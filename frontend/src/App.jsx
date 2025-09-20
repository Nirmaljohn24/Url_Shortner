import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateShort from './pages/CreateShort';
import Stats from './pages/Stats';
import RedirectHandler from './pages/RedirectHandler';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateShort />} />
        <Route path="/:code" element={<RedirectHandler />} />
        <Route path="/:code/stats" element={<Stats />} />
      </Routes>
    </BrowserRouter>
  );
}