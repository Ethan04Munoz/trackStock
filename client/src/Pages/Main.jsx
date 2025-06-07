import React, { useState, useEffect } from 'react';
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

    return (
        <div className="main">
            <Header page="/" />
            <div className="page mainPage">
                {/*<div className="sidebar">
                    mockup
                </div>*/}
                <Sidebar />

                <Dashboard />
            </div>
        </div>
    )
}

export default Main;