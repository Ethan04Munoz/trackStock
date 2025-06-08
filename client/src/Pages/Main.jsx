import React, { useState, useEffect, use } from 'react';
import Dashboard from '../components/Dashboard';
import './Main.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

function Main() {

    //This block of code makes that the overflow hidden only applies to the main page
    // and not to the whole application, so in the other pages the scroll works
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    // This block of code sets the localStorage with the default values for the stocks
    useEffect(() => {
        localStorage.setItem("ps", JSON.stringify({ 1: 4, 2: 8, 3: 12, 4: 16 }));
        localStorage.setItem("peg", JSON.stringify({ 1: 1, 2: 1.5, 3: 2, 4: 3 }));
        localStorage.setItem("pe", JSON.stringify({ 1: 10, 2: 18, 3: 26, 4: 34 }));
        localStorage.setItem("de", JSON.stringify({ 1: 19.83, 2: 60.97, 3: 118.02, 4: 205.76 }));
        localStorage.setItem("pb", JSON.stringify({ 1: 5, 2: 8, 3: 11, 4: 14 }));
        //Gross Margin
        localStorage.setItem("gm", JSON.stringify({ 1: .85, 2: .65, 3: 0.45, 4: 0.20 }));
    }, []);

    return (
        <div className="main">
            <Header page="/" />
            <div className="page mainPage">
                <Sidebar />
                <Dashboard />
            </div>
        </div>
    )
}

export default Main;