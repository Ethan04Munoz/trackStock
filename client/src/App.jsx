import React from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import StockSearch from './components/Search';
import Main from './Pages/Main';
import About from './Pages/About';
import Test from './Pages/Test';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/test" element={<Test />}></Route>
        {/*<Route path="/test" element={<StockSearch />}></Route>*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;