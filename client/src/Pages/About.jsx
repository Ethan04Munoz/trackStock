import React from "react";
import Header from "../components/Header";
import ShinyDivider from "../components/ShinyDivider";

function About() {
    const technologies = [
        {
            name: 'React',
            badgeUrl: 'https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB'
        },
        {
            name: 'Python',
            badgeUrl: 'https://img.shields.io/badge/Python-FFD43B?style=for-the-badge&logo=python&logoColor=3776AB'
        },
        {
            name: 'Flask',
            badgeUrl: 'https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=fff'
        },
        {
            name: 'CSS',
            badgeUrl: 'https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white'
        },
        {
            name: 'JavaScript',
            badgeUrl: 'https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=323330'
        },
        {
            name: 'Google Gemini',
            badgeUrl: 'https://img.shields.io/badge/Google%20Gemini-886FBF?style=for-the-badge&logo=googlegemini&logoColor=fff'
        }
    ];

    return (
        <div className="about">
            <Header page="/about" />
            <div className="page">
                <div className="container">
                    <h1>About TrackStock</h1>
                    <p>
                        TrackStock is a web application for educational purposes, designed to help
                        users track and manage their stock investments.
                        It allows users to monitor stock prices, view historical data,
                        and analyze market trends.
                    </p>
                    <p>
                        The application features a user-friendly interface, allowing users to easily
                        add, remove, and track their stocks.
                        It also includes tools for analyzing stock valuations, such as
                        Price-to-Earnings (P/E) ratio, Price-to-Earnings Growth (PEG) ratio,
                        and Price-to-Sales (P/S) ratio.
                    </p>
                    <p>
                        TrackStock also includes a module to use LLM AI models, using the Gemini API,
                        to provide users with insights and suggestions based on their stock data.
                    </p>
                    <ShinyDivider />
                    <h2>Tech Stack</h2>
                    <div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {technologies.map((tech, index) => (
                                <img
                                    key={index}
                                    src={tech.badgeUrl}
                                    alt={tech.name}
                                    style={{ margin: '5px' }}
                                />
                            ))}
                        </div>
                    </div>
                    <p>
                        React, CSS and Javascript are used to build the visual part of the project.
                        Build the UI and UX.
                    </p>
                    <p>
                        Python and Flask are used the build the backend, where the logic of the project is.
                        It makes work the endpoints and does the consults of financial information, calculates
                        metrics, etc. It is also used to enhance the AI answer by providing a better context,
                        like information of the industries and sectors of the companys the user holds.
                    </p>
                    <p>
                        Google Gemini is the AI model used to provide insights and suggestions based on the
                        stock data.
                    </p>
                    <ShinyDivider />
                    <div className="centrar8">
                        <div></div>
                        <a className='github' href="https://github.com/Ethan04Munoz">
                            <div className=''>
                                <img src="github-Dark.svg" alt="" />
                            </div>
                        </a>
                        <div></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;