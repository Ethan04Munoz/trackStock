import React from "react";
import Header from "../components/Header";

function Test() {
    return (
        <div className="about">
            <Header page="/test" />
            <div className="page">
                <div></div>
                <div className="container">
                    <h1>Test TrackStock</h1>
                    <p>
                        You can test the TrackStock application here.
                        This is a web application for educational purposes, designed to help users track
                        their stock investments and take a desicion about if a stock is a good buy at the
                        moment, and you can test all of the features here. However, please note that
                        the AI features are powered by the Gemini API, which requires a key. This app is designed
                        to manage securely the key, however, my best recommendation is that, if you want to use
                        the AI features, you should download the app from GitHub and run it locally.
                    </p>
                    <h2>Follow the next steps to get this working locally in your computer</h2>
                </div>
            </div>
        </div>
    );
}

export default Test;