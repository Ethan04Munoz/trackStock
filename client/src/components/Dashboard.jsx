import React, { useState, useEffect } from "react";
import { fetchStockData } from "../utils/mockup";
import "./Dashboard.css";
import { getPEClass, getPEGClass, getPSClass } from "../utils/functions";
import Search from "./Search";
import axios from "axios";

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

    // Obtener la información de las acciones usando los símbolos
    useEffect(() => {
        const fetchData = async () => {
            try {
                const requests = symbols.map(symbol =>
                    axios.get(`http://localhost:5000/stock/${symbol}`)
                );
                const responses = await Promise.all(requests);
                console.log(responses);
                const data = responses.map((response, index) => ({
                    symbol: symbols[index],
                    ...response.data
                }));
                setStockData(data);
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };
        fetchData();
    }, [symbols]);

    // Función para agregar una nueva acción a la lista de seguimiento
    // (En este caso, se agrega AAPL como ejemplo, pendiendte de desarrollo el poder elegir el símbolo)
    function addStock(newSymbol) {
        if (!symbols.includes(newSymbol)) {
            const updatedSymbols = [...symbols, newSymbol];
            setSymbols(updatedSymbols);
            localStorage.setItem("trackedSymbols", JSON.stringify(updatedSymbols));
        }
    };

    return (
        <div className="Dashboard">
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
                                <td className={getPSClass(stock.metrics.ps)}>{stock.metrics.ps}</td>
                                <td className={getPEClass(stock.metrics.pe)}>{stock.metrics.pe}</td>
                                <td className={getPEGClass(stock.metrics.peg)}>{stock.metrics.peg}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Dashboard;