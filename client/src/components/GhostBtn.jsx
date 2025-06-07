import React from "react";
import "./GhostBtn.css";

function GhostBtn(props) {
    return (
        <button
            disabled={props.disabled}
            className={"btnGhost " + props.extraClass}
            onClick={props.onClick}
            onMouseOver={props.onMouseOver}
            onMouseOut={props.onMouseOut}
        >
            {props.text}
        </button>
    );
}

export default GhostBtn;