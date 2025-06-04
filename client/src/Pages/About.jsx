import React from "react";
import Header from "../components/Header";

function About() {
    return (
        <div className="about">
            <Header page="/about" />
            <h1>About TrackStock</h1>
            <p>
                TrackStock is a web application for educational purposes, designed to help users track and manage their stock investments.
                It allows users to monitor stock prices, view historical data, and analyze market trends.
            </p>
            <p>
                The application features a user-friendly interface, allowing users to easily add, remove, and track their stocks. 
                It also includes tools for analyzing stock valuations, such as Price-to-Earnings (P/E) ratio, Price-to-Earnings Growth (PEG) ratio, and Price-to-Sales (P/S) ratio.
            </p>
            <p>
                TrackStock also includes a module to use LLM AI models, using the Gemini API, to provide users with insights and suggestions based on their stock data.
            </p>
        </div>
    );
}

export default About;