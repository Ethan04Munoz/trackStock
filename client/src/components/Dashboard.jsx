import React, { useState, useEffect } from "react";
import { fetchStockData } from "../utils/mockup";
import "./Dashboard.css";
import { getPEClass, getPEGClass, getPSClass } from "../utils/functions";
import Search from "./Search";

function Dashboard() {
    // States
    const [symbols, setSymbols] = useState([]);
    const [stockData, setStockData] = useState([]);

    // Obtener desde el localStorage los simbolos de acciones
    useEffect(() => {
        const storedSymbols = localStorage.getItem("trackedSymbols");
        if (storedSymbols) {
            setSymbols(JSON.parse(storedSymbols));
        }
    }, []);

    // Obtener la informacion de las acciones usando los simbolos 
    useEffect(() => {
        const data = symbols.map(symbol => ({
            symbol,
            ...fetchStockData(symbol)
        }));
        setStockData(data);
    }, [symbols]);

    // Función para agregar una nueva acción a la lista de seguimiento
    // (En este caso, se agrega AAPL como ejemplo, pendiendte de desarrollo el poder elegir el símbolo)
    function addStock() {
        const newSymbol = "AAPL";
        if (!symbols.includes(newSymbol)) {
            const updatedSymbols = [...symbols, newSymbol];
            setSymbols(updatedSymbols);
            localStorage.setItem("trackedSymbols", JSON.stringify(updatedSymbols));
        }
    };

    return (
        <div className="Dashboard">
            <div className="form">
                <h1>TrackStock</h1>
                <Search onClick={addStock} />
                {stockData.length === 0 ? (
                    <p>No stocks are being tracked yet.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Price</th>
                                <th>P/S</th>
                                <th>P/E</th>
                                <th>PEG</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockData.map((stock) => (
                                <tr key={stock.symbol}>
                                    <td>{stock.symbol}</td>
                                    <td>{stock.price}</td>
                                    <td className={getPSClass(stock.ps)}>{stock.ps}</td>
                                    <td className={getPEClass(stock.pe)}>{stock.pe}</td>
                                    <td className={getPEGClass(stock.peg)}>{stock.peg}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

        </div>
    );
}

export default Dashboard;