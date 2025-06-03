import React from "react";
import "./GhostBtn.css";

function GhostBtn(props) {
    return (
        <button className="btnGhost" onClick={props.onClick}>
            {props.text}
        </button>
    );
}

export default GhostBtn;