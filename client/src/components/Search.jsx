import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Search.css';

function Search (props) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.length > 0) {
                setLoading(true);
                axios.get(`http://localhost:5000/search?query=${query}`)
                    .then(response => {
                        console.log('Datos obtenidos:', response.data);
                        setResults(response.data);
                        setLoading(false);
                    })
                    .catch(error => {
                        console.error('Error al obtener datos:', error);
                        setLoading(false);
                    });
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    return (
        <div className='searchContainer'>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a stock..."
                className='searchStockInput'
            />
            {loading && <p className='loadingOption'>Loading...</p>}
            <ul>
                {results.map((stock, index) => (
                    <li
                        key={index}
                    >
                        <p>{stock.symbol} - {stock.name}</p>
                        <button onClick={() => props.onClick(stock.symbol)}>
                            Add
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Search;