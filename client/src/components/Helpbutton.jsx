import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import './Helpbutton.css';

const HelpButton = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => setIsOpen(!isOpen);

    useEffect(() => {
        const firstTime = localStorage.getItem("f");
        if (!firstTime) {
            localStorage.setItem("f", "true");
            setIsOpen(true);
        }
    }, []);

    useEffect(() => {
        const firstTimeAPIKey = localStorage.getItem("fa");
        if (!firstTimeAPIKey && props.apikey.length > 0) {
            localStorage.setItem("fa", "true");
            setIsOpen(true);
        }
        console.log("API Key length:", props.apikey);
    }, [props.apikey]);

    return (
        <>
            <button className="help-button" onClick={toggleModal}>
                <FontAwesomeIcon icon={faCircleQuestion} />
            </button>

            {isOpen && (
                <div className="modal-overlay" onClick={toggleModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>{props.title}</h2>
                        <p>{props.text}</p>
                        <button className="close-button" onClick={toggleModal}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default HelpButton;
