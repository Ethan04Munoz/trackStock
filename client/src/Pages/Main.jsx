import React, { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import './Main.css';
import Header from '../components/Header';

function Main() {
    return (
        <div className="main">
            <Header />
            <div className="page">
                <div className="sidebar">
                    mockup
                </div>

                <Dashboard />
            </div>
        </div>
    )
}

export default Main;