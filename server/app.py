from flask import Flask, jsonify, request
import yfinance as yf
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/search": {"origins": "http://localhost:5173"}})

def get_stock_data(ticker):
    stock = yf.Ticker(ticker)
    info = stock.info
    history = stock.history(period="5y")
    return info, history

def calculate_metrics(info, history):
    pe_ratio = info.get('trailingPE', None)
    ps_ratio = info.get('priceToSalesTrailing12Months', None)

    # Calcular crecimiento histórico si hay datos
    if not history.empty:
        initial_price = history['Close'].iloc[0]
        final_price = history['Close'].iloc[-1]
        growth_rate = ((final_price / initial_price) ** (1/5) - 1) * 100 if initial_price else None
    else:
        growth_rate = None

    # Calcular PEG si P/E y crecimiento están disponibles
    if pe_ratio and growth_rate:
        peg_ratio = pe_ratio / growth_rate  
    else:
        peg_ratio = None

    # Retornar métricas calculadas
    return {
        'P/E': pe_ratio,
        'P/S': ps_ratio,
        'PEG': peg_ratio,
        '5yr_growth': growth_rate
    }

@app.route('/stock/<ticker>', methods=['GET'])
def stock_data(ticker):
    try:
        info, history = get_stock_data(ticker)
        metrics = calculate_metrics(info, history)
        return jsonify({
            'ticker': ticker,
            'current_price': info.get('currentPrice', None),
            'info': info,
            'metrics': metrics
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400
 
@app.route('/search', methods=['GET'])
def search_stocks():
    query = request.args.get('query', '').upper()
    print(f"Search query: {query}")
    if not query:
        return jsonify([])

    try:
        ticker = yf.Ticker(query)
        info = ticker.info
        print(f"Ticker {ticker}/n")
        
        if 'symbol' not in info or 'longName' not in info:
            return jsonify([])

        result = [{
            'symbol': info['symbol'],
            'name': info.get('longName', 'Nombre no disponible')
        }]
        return jsonify(result)
    except Exception:
        print("Excepcion al buscar el ticker")
        return jsonify([])


if __name__ == '__main__':
    app.run(debug=True)