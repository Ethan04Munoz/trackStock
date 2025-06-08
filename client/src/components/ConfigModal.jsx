import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import './ConfigModal.css';

const METRIC_KEYS = ['de', 'pb', 'pe', 'peg', 'ps'];
const METRIC_LABELS = {
    de: 'Debt to Equity',
    pb: 'Price / Book',
    pe: 'Price / Earnings',
    peg: 'PEG',
    ps: 'Price / Sales'
};

function ConfigModal() {
    const [show, setShow] = useState(false);
    const [thresholds, setThresholds] = useState({});
    const [errors, setErrors] = useState({});
    const [clicked, setClicked] = useState(false);

    // load thresholds from localStorage
    useEffect(() => {
        const loaded = {};
        console.log('Loading thresholds from localStorage');
        METRIC_KEYS.forEach((key) => {
            console.log(`Loading thresholds for ${key}`);
            try {
                const item = localStorage.getItem(key);
                loaded[key] = item ? JSON.parse(item) : { 1: '', 2: '', 3: '', 4: '' };
            } catch {
                loaded[key] = { 1: '', 2: '', 3: '', 4: '' };
            }
        });
        setThresholds(loaded);
    }, []);

    const open = () => setShow(true);
    const close = () => setShow(false);

    const handleChange = (metric, level, value) => {
        const valNum = parseFloat(value);
        setThresholds((prev) => ({
            ...prev,
            [metric]: { ...prev[metric], [level]: value }
        }));

        // validation: greater than previous level, less than next level
        const lvl = Number(level);
        const prevVal = lvl > 1 ? parseFloat(thresholds[metric][lvl - 1]) : -Infinity;
        const nextVal = lvl < 4 ? parseFloat(thresholds[metric][lvl + 1]) : Infinity;
        setErrors((err) => ({
            ...err,
            [`${metric}_${level}`]: isNaN(valNum) || valNum <= prevVal || valNum >= nextVal
        }));
    };

    const canSave = () => {
        return METRIC_KEYS.every((metric) =>
            [1, 2, 3, 4].every((lvl) => {
                const errKey = `${metric}_${lvl}`;
                const val = parseFloat(thresholds[metric]?.[lvl]);
                return !errors[errKey] && !isNaN(val);
            })
        );
    };

    const handleSave = () => {
        setClicked(true);
        METRIC_KEYS.forEach((metric) => {
            const obj = thresholds[metric];
            localStorage.setItem(metric, JSON.stringify(
                Object.fromEntries(
                    Object.entries(obj).map(([lvl, val]) => [lvl, parseFloat(val)])
                )
            ));
        });
        close();
    };

    return (
        <>
            <div className='gear' onClick={open}>
                <FontAwesomeIcon icon={faGear} />
            </div>
            {show && (
                <div className='overlay'>
                    <div className='modal'>
                        <h2>Metric Configuration</h2>
                        <p>Set your default values for the Levels on each metric.</p>
                        <div className='grid'>
                            {Object.keys(METRIC_LABELS).map((metric) => (
                                <div key={metric} className='metric-block'>
                                    <h3>{METRIC_LABELS[metric]}</h3>
                                    {[1, 2, 3, 4].map((lvl) => (
                                        <div key={lvl} className='input-row'>
                                            <label>Level {lvl}:</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={thresholds[metric]?.[lvl] ?? ''}
                                                onChange={(e) => handleChange(metric, lvl, e.target.value)}
                                            />
                                            {errors[`${metric}_${lvl}`] && (
                                                <span className='error'>
                                                    Must be &gt; previous &amp; &lt; next
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div className='actions'>
                            <button
                                onClick={handleSave}
                                disabled={!canSave()}
                                className={`green-button`}
                            >
                                Save
                            </button>
                            <button
                                onClick={close}
                                className='close-button'
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ConfigModal;
