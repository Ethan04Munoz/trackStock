from flask import Flask, jsonify, request
import yfinance as yf
from flask_cors import CORS
import google.generativeai as generativeai

app = Flask(__name__)

CORS(app, resources={r"/search": {"origins": "http://localhost:5173"}, r"/stock/*": {"origins": "http://localhost:5173"}})

def get_stock_data(ticker):
    stock = yf.Ticker(ticker)
    info = stock.info
    history = stock.history(period="5y")
    return info, history

def calculate_metrics(info, history):
    pe_ratio = info.get('trailingPE', None)
    fwd_pe_ratio = info.get('forwardPE', None)
    ps_ratio = info.get('priceToSalesTrailing12Months', None)
    peg_ratio = info.get('trailingPegRatio', None)
    debt_to_equity = info.get('debtToEquity', None)
    fifty_day_avg = info.get('fiftyDayAverage', None)
    fifty_two_week_high = info.get('fiftyTwoWeekHigh', None)
    gross_margin = info.get('grossMargins', None)
    pb_ratio = info.get('priceToBook', None)

    # Calcular crecimiento histórico si hay datos
    if not history.empty:
        initial_price = history['Close'].iloc[0]
        final_price = history['Close'].iloc[-1]
        growth_rate = ((final_price / initial_price) ** (1/5) - 1) * 100 if initial_price else None
    else:
        growth_rate = None

    # Retornar métricas calculadas
    return {
        'pe': pe_ratio,
        'fwd_pe': fwd_pe_ratio,
        'ps': ps_ratio,
        'peg': peg_ratio,
        'debt_to_equity': debt_to_equity,
        'fifty_day_avg': fifty_day_avg,
        'fifty_two_week_high': fifty_two_week_high,
        'gross_margin': gross_margin,
        'pb': pb_ratio,
        '5yrGrwth': growth_rate
    }

@app.route('/stock/<ticker>', methods=['GET'])
def stock_data(ticker):
    try:
        info, history = get_stock_data(ticker)
        metrics = calculate_metrics(info, history)
        return jsonify({
            'ticker': ticker,
            'price': info.get('currentPrice', None),
            #'info': info,
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

@app.route('/recommend_stocks', methods=['POST'])
def recommend_stocks():
    data = request.get_json()

    generativeai.configure(api_key=data.get('api_key'))

    user_stocks = data.get('user_stocks', [])  #Ejemplo: ["AAPL", "GOOGL", "MSFT"]

    #Crear un prompt 
    prompt = f"Basado en las acciones que el usuario sigue: {', '.join(user_stocks)}, recomienda otras acciones de sectores similares o con valuaciones comparables."

    #Configurar el modelo de Gemini
    model = generativeai.GenerativeModel('gemini-1.5-flash')
        
    #Genera contenido usando el modelo
    response = model.generate_content(prompt)

    #Procesa la respuesta de Gemini
    recommendations = response.text

    return jsonify({'recommendations': recommendations})

if __name__ == '__main__':
    app.run(debug=True)