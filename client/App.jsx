import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import SkillForm from './components/SkillForm';


const App = () => (
  <Router>
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route path="/skills/*" element={<SkillForm />} />
      </Routes>
    </div>
  </Router>
);

export default App;
