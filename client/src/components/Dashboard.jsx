import React, { useState, useEffect } from "react";
import { fetchStockData } from "../utils/mockup";
import "./Dashboard.css";
import { getPEClass, getPEGClass, getPSClass, truncate } from "../utils/functions";
import Search from "./Search";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { toast } from "react-toastify";

function Dashboard() {
    // States
    const [symbols, setSymbols] = useState([]);
    const [stockData, setStockData] = useState([]);
    const [stocks, setStocks] = useState([]);

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

                //Set the stock data (symbol, industry)
                const stockdata = responses.map((response, index) => ({
                    symbol: symbols[index],
                    industry: response.data.industry,
                }));
                setStocks(stockdata);

                setStockData(data);
            } catch (error) {
                toast.error('Error fetching stock data. Please try again later.');
                console.error('Error fetching stock data:', error);
            }
        };
        fetchData();
    }, [symbols]);

    function addStock(newSymbol) {
        if (!symbols.includes(newSymbol)) {
            const updatedSymbols = [...symbols, newSymbol];
            setSymbols(updatedSymbols);
            localStorage.setItem("trackedSymbols", JSON.stringify(updatedSymbols));
            toast.success(`Stock ${newSymbol} added successfully!`);
        }
    };

    function deleteStock(symbol) {
        const updatedSymbols = symbols.filter(s => s !== symbol);
        setSymbols(updatedSymbols);
        localStorage.setItem("trackedSymbols", JSON.stringify(updatedSymbols));
        
        const updatedStockData = stockData.filter(stock => stock.symbol !== symbol);
        setStockData(updatedStockData);
        localStorage.setItem("trackedStocks", JSON.stringify(updatedStockData));
        toast.success(`Stock ${symbol} removed successfully!`);
    }
    
    useEffect(() => {
        console.log("Stock data updated:", stocks);
        if (stocks.length > 0) {
            localStorage.setItem("trackedStocks", JSON.stringify(stocks));
        }
    }
    , [stocks]);


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
                            <th>FWD P/E</th>
                            <th>P/S</th>
                            <th>PEG</th>
                            <th>Debt to Equity</th>
                            <th>50 days Average</th>
                            <th>52 Weeks High</th>
                            <th>Gross Margin</th>
                            <th>P/B</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {stockData.map((stock) => (
                            <tr key={stock.symbol}>
                                <td>{stock.symbol}</td>
                                <td>{stock.price}</td>
                                <td className={getPEClass(stock.metrics.pe)}>{truncate(stock.metrics.pe, 2)}</td>
                                <td className={getPEClass(stock.metrics.fwd_pe)}>{truncate(stock.metrics.fwd_pe, 2)}</td>
                                <td className={getPSClass(stock.metrics.ps)}>{truncate(stock.metrics.ps, 2)}</td>
                                <td className={getPEGClass(stock.metrics.peg)}>{truncate(stock.metrics.peg, 2)}</td>
                                <td>{truncate(stock.metrics.debt_to_equity, 2)}</td>
                                <td>{truncate(stock.metrics.fifty_day_avg, 2)}</td>
                                <td>{truncate(stock.metrics.fifty_two_week_high, 2)}</td>
                                <td>{truncate(stock.metrics.gross_margin, 2)}</td>
                                <td>{truncate(stock.metrics.pb, 2)}</td>
                                <td onClick={() => deleteStock(stock.symbol)} className="btn_delete"><FontAwesomeIcon icon={faTrash}/></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Dashboard;