import React, { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import './Main.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

function Main() {
    return (
        <div className="main">
            <Header page="/"/>
            <div className="page">
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