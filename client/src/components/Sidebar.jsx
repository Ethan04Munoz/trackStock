import React, { use, useEffect, useState } from 'react';
import './Sidebar.css';
import HelpButton from './Helpbutton';
import GhostBtn from './GhostBtn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import TypewriterMarkdown from './TypewriterMarkdown';

function Sidebar() {
    const [activeBtn, setActiveBtn] = useState(true);
    const [apiKey, setApiKey] = useState('');
    const [recomendations, setRecommendations] = useState([]);
    const [userPrompt, setUserPrompt] = useState('');

    function handleApiKeyChange(event) {
        const key = event.target.value;
        setApiKey(key);
    }

    function saveUserPrompt(event) {
        const prompt = event.target.value;
        setUserPrompt(prompt);
    }

    async function handleRequest(type) {
        const stored = localStorage.getItem("trackedStocks");

        if (!stored) {
            //There are no tracked stocks in localStorage
            return;
        }

        let stocks;
        try {
            stocks = JSON.parse(stored);
        } catch (err) {
            console.error("Error parsing trackedSymbols from localStorage:", err);
            return;
        }

        if (!apiKey) {
            // If no API key is provided, we cannot proceed
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/${type}`, {
                api_key: apiKey,
                stocks: stocks,
                user_prompt: userPrompt
            });

            const result = response.data;
            console.log("Consult: ", result);
            setRecommendations(result.recommendations);

        } catch (error) {
            console.error("Error fetching stocks:", error);
        }
    }

    useEffect(() => {
        console.log("Recomendaciones: ", recomendations);
    }, [recomendations]);


    return (
        <div className="sidebar">
            <h3>StockAI</h3>
            {recomendations.length > 0 ?
                <TypewriterMarkdown content={recomendations} speed={100} />
                : ""
            }

            <div className="textarea-container">
                <textarea name="" id="" placeholder='Ask...' onChange={saveUserPrompt}>
                </textarea>
                <button
                    disabled={!activeBtn}
                    className={`sendr ${activeBtn == true ? 'sendrEbld' : 'sendrDbld'}`}
                    onClick={() => handleRequest('aig_consult')}>
                    <FontAwesomeIcon icon={faArrowUp} />
                </button>
            </div>
            <div className="apikey">
                <input type="text" placeholder='Write here your Gemini API Key' onChange={handleApiKeyChange} />
                <HelpButton
                    title="What happens with my API Key?"
                    text="THIS IS NOT A PROFESSIONAL TOOL. DO NOT USE YOUR REAL API KEY. THIS IS
                    FOR EDUCATIONAL PURPOSES ONLY. The API Key is used to access the Gemini
                    API and make consults, such as getting stock data. It is only stored
                    in your browser while you send the form. After that, it is send to the
                    server and used to make the request. It is descarted after the request is made.
                    This is an open project, so you can see the code and how it works.
                    If you want to use this tool (for educational porpuses) please download
                    it from GitHub and run it locally."
                />
            </div>
            <hr />
            <div className="suggestions">
                <GhostBtn text="Suggest similar stocks" onClick={() => handleRequest("similar_stocks")} />
                <GhostBtn text="Diversify my portfolio" onClick={() => handleRequest("diversify")} />
            </div>
        </div>
    );
}

export default Sidebar;