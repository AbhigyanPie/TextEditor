import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import TextEditor from './TextEditor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/documents/:id" element={<TextEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
