import React from "react";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";

function TypewriterMarkdown(content, speed) {
    content = content.content
    console.log("Content: ", content, speed);
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        if (!content) return;

        let index = 0;
        const interval = setInterval(() => {
            setDisplayedText((prev) => prev + content[index]);
            index++;
            if (index >= content.length) clearInterval(interval);
        }, speed);

        return () => clearInterval(interval);
    }, [content, speed]);

    return (
        <div className="anws-container">
            <ReactMarkdown>{displayedText}</ReactMarkdown>
        </div>
    );
};

export default TypewriterMarkdown;