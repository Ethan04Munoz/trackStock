import React from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import StockSearch from './components/Search';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}>
        </Route>
        {/*<Route path="/test" element={<StockSearch />}></Route>*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;