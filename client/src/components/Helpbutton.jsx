import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import './Helpbutton.css';

const HelpButton = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => setIsOpen(!isOpen);

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
