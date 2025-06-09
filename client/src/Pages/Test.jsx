import React from "react";
import Header from "../components/Header";
import ShinyDivider from "../components/ShinyDivider";

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
                    <ShinyDivider />
                    <h2>Follow the next steps to get this working locally in your computer</h2>
                    <p>IMPORTANT! To use this project, you must have Node and Python installed, as you will need npm and Python.</p>
                    <p>If you don't have Node, <a href="https://nodejs.org/en/download">click here</a></p>
                    <p>If you don't have Python, <a href="https://www.python.org/downloads/">click here</a></p>
                    <p>
                        1. Go to <a href="">https://github.com/Ethan04Munoz/trackStock</a>
                    </p>
                    <p>
                        2. Click the green "Code" button and select "Download ZIP" to download the repository.
                    </p>
                    <img src="code.png" alt="" />
                    <img src="dwnld_zip.png" alt="" />
                    <p>
                        3. Extract the ZIP file to a folder of your choice.
                    </p>
                    <p>
                        4. Enter the extracted folder, then go into the "client" folder and open a terminal in that location.
                    </p>
                    <p>
                        5. Run the command <code>npm install</code> to install the project dependencies.
                    </p>
                    <p>
                        6. Once the dependencies are installed, run the command <code>npm run dev</code> to start the application.
                    </p>
                    <p>
                        7. Open your browser and go to <a href="http://localhost:5173">http://localhost:5173</a> to see the application running.
                    </p>
                    <p>
                        This will start the client side of the application, which is responsible for displaying the user interface and handling user interactions.
                    </p>
                    <p>
                        8. To start the server side of the application, go back to the extracted folder and enter the "server" folder. Open a terminal in that location.
                    </p>
                    <p>
                        9. Run the command <code>python -m venv venv</code>. This will create a virtual environment named "venv" in the server folder.
                    </p>
                    <p>
                        10. Then, activate the virtual environment by running <code>venv/bin/activate</code> on Linux or Mac, or <code>venv\Scripts\activate</code> on Windows.
                    </p>
                    <p>
                        11. Once the virtual environment is active, run the command <code>pip install -r requirements.txt</code> to install the server dependencies.
                    </p>
                    <p>
                        12. Finally, run the command <code>python app.py</code> to start the server.
                    </p>
                    <p>
                        By following these steps, you should be able to run the TrackStock application locally on your computer.
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

export default Test;