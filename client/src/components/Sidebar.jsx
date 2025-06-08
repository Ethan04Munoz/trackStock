import React, { use, useEffect, useState } from 'react';
import './Sidebar.css';
import HelpButton from './Helpbutton';
import GhostBtn from './GhostBtn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import TypewriterMarkdown from './TypewriterMarkdown';

function Sidebar() {
    const [apiKey, setApiKey] = useState('');
    const [recomendations, setRecommendations] = useState([]);
    const [userPrompt, setUserPrompt] = useState('');
    const [showAskTooltip, setShowAskTooltip] = useState(false);
    const [showSuggestTooltip, setShowSuggestTooltip] = useState(false);
    const [showDiversifyTooltip, setShowDiversifyTooltip] = useState(false);

    function handleApiKeyChange(event) {
        const key = event.target.value;
        setApiKey(key);
    }

    function saveUserPrompt(event) {
        const prompt = event.target.value;
        setUserPrompt(prompt);
    }

    async function handleRequest(type) {
        console.log("Handling request for type:", type);
        const stored = localStorage.getItem("trackedStocks");

        if (!stored) {
            toast.error('You don\'t have any tracked stocks yet. Please add some stocks to your portfolio.');
            //There are no tracked stocks in localStorage
            return;
        }

        let stocks;
        try {
            stocks = JSON.parse(stored);
        } catch (err) {
            toast.error('There was an error parsing your tracked stocks. Please check your localStorage.');
            console.error("Error parsing trackedSymbols from localStorage:", err);
            return;
        }

        if (!apiKey) {
            toast.error('Please provide your Gemini API Key to make a request.');
            console.error("No API key provided.");
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
            toast.error('Something went wrong. Please try again later.');
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
                    disabled={(apiKey.length === 0 || userPrompt.length === 0) ? true : false}
                    className={`sendr ${(apiKey.length === 0 || userPrompt.length === 0) ? 'sendrDbld' : 'sendrEbld'}`}
                    onClick={() => handleRequest('aig_consult')}
                    onMouseOver={() => {console.log("Todo lo que tu me pidas");setShowAskTooltip(true)}}
                    onMouseOut={() => setShowAskTooltip(false)}
                >
                    <FontAwesomeIcon icon={faArrowUp} />
                </button>
            </div>
            {(showAskTooltip && (apiKey.length === 0 || userPrompt.length === 0)) &&
                <div className="tooltip askToltip">
                    To make a request, you need to write a prompt and have an API Key.
                </div>
            }

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
                    apikey={apiKey}
                />
            </div>
            <hr />
            <div className="suggestions">
                <GhostBtn
                    disabled={apiKey.length === 0 ? true : false}
                    text="Suggest similar stocks"
                    onClick={() => handleRequest("similar_stocks")}
                    extraClass={apiKey.length > 0 ? "" : "disabledGhost"}
                    onMouseOver={() => {console.log("Todo lo que tu me pidas"); setShowSuggestTooltip(true)}}
                    onMouseOut={() => setShowSuggestTooltip(false)}
                />
                {(showSuggestTooltip && apiKey.length < 1) &&
                    <div className="tooltip suggestTooltip">
                        To consult similar stocks, you need to have an API Key.
                    </div>
                }

                <GhostBtn
                    disabled={apiKey.length === 0 ? true : false}
                    text="Diversify my portfolio"
                    onClick={() => handleRequest("diversify")}
                    extraClass={apiKey.length > 0 ? "" : "disabledGhost"}
                    onMouseOver={() => setShowDiversifyTooltip(true)}
                    onMouseOut={() => setShowDiversifyTooltip(false)}
                />
                {(showDiversifyTooltip && apiKey.length < 1) &&
                    <div className="tooltip diversifyToltip">
                        To diversify your portfolio, you need to have an API Key.
                    </div>
                }
            </div>
        </div>
    );
}

export default Sidebar;