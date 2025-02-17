// import TextEditor from "./TextEditor";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate
// } from 'react-router-dom';
// import { v4 as uuidV4 } from 'uuid';  


// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Replace Redirect with Navigate */}
//         <Route path="/" element={<Navigate to={`/documents/${uuidV4()}`} />} />
        
//         {/* Use element prop for TextEditor */}
//         <Route path="/documents/:id" element={<TextEditor />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

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
