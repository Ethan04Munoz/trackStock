export function fetchStockData(symbol) {
    const mockData = {
        AAPL: { price: 150.00, ps: 5.0, pe: 25.0, peg: 1.5 },
        GOOGL: { price: 2800.00, ps: 7.0, pe: 30.0, peg: 2.0 },
    };
    return mockData[symbol] || null;
};