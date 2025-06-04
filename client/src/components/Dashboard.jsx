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
                            <th>P/E</th>
                            <th>Forward P/E</th>
                            <th>P/S</th>
                            <th>PEG</th>
                            <th>Debt to Equity</th>
                            <th>50 days Average</th>
                            <th>52 Weeks High</th>
                            <th>Gross Margin</th>
                            <th>P/B</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stockData.map((stock) => (
                            <tr key={stock.symbol}>
                                <td>{stock.symbol}</td>
                                <td>{stock.price}</td>
                                <td className={getPEClass(stock.metrics.pe)}>{stock.metrics.pe}</td>
                                <td className={getPEClass(stock.metrics.fwd_pe)}>{stock.metrics.fwd_pe}</td>
                                <td className={getPSClass(stock.metrics.ps)}>{stock.metrics.ps}</td>
                                <td className={getPEGClass(stock.metrics.peg)}>{stock.metrics.peg}</td>
                                <td>{stock.metrics.debt_to_equity}</td>
                                <td>{stock.metrics.fifty_day_avg}</td>
                                <td>{stock.metrics.fifty_two_week_high}</td>
                                <td>{stock.metrics.gross_margin}</td>
                                <td>{stock.metrics.pb}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Dashboard;