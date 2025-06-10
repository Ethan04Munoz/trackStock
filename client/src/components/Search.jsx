import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Search.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faCheck } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

function Search(props) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        /*
        const delayDebounceFn = setTimeout(() => {
            if (query.length > 0) {
                setLoading(true);
                axios.get(`http://localhost:5000/search?query=${query}`)
                    .then(response => {
                        console.log('Datos obtenidos:', response.data);
                        setResults(response.data);
                        setLoading(false);
                        setClicked(false); // reset button state on new results
                    })
                    .catch(error => {
                        console.error('Error al obtener datos:', error);
                        setLoading(false);
                    });
            } else {
                setResults([]);
                setClicked(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
        */
        toast.info('This is a mockup, download the project to see the real functionality of Search.');
    }, [query]);

    const handleAdd = (symbol) => {
        setClicked(true);
        props.onClick(symbol);
        setTimeout(() => {
            setResults([]);
        }, 1000);
    };

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
                    <li key={index}>
                        <p>{stock.symbol} - {stock.name}</p>
                        <button
                            onClick={() => handleAdd(stock.symbol)}
                            disabled={clicked}
                            className={`addButton ${clicked ? 'added' : ''}`}
                        >
                            {clicked ? <FontAwesomeIcon icon={faCheck} /> : 'Add'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Search;
