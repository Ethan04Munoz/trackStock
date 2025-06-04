import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './Header.css';

function Header(props) {
    const page = props.page;
    return (
        <div className="header">
            <div className="mainHeader">
                <h1>TrackStock</h1>
            </div>
            <div className="barHeader">
                <div className="main">
                    <Link
                        className={`link ${page === "/" ? "currentPage" : ""}`}
                        to="/"
                    >
                        Main
                    </Link>
                </div>
                <div className="about">
                    <Link
                        className={`link ${page === "/about" ? "currentPage" : ""}`}
                        to="/about"
                    >
                        About
                    </Link>
                </div>
                <div className="test">
                    <Link
                        className={`link ${page === "/test" ? "currentPage" : ""}`}
                        to="/test"
                    >
                        Test
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Header;