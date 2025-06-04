import React from 'react';
import './Sidebar.css';
import HelpButton from './Helpbutton';
import GhostBtn from './GhostBtn';

function Sidebar() {
    return (
        <div className="sidebar">
            <textarea name="" id="" placeholder='Ask...'></textarea>
            <div className="apikey">
                <input type="text" placeholder='Write here your Gemini API Key' />
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
            <GhostBtn text="Suggest similar stocks"/>
            <GhostBtn text="Diversify my portfolio" />
        </div>
    );
}

export default Sidebar;