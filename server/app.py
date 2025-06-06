from flask import Flask, jsonify, request
import yfinance as yf
from flask_cors import CORS
import google.generativeai as generativeai

app = Flask(__name__)

CORS(app, resources={r"/search": {"origins": "http://localhost:5173"}, 
                     r"/stock/*": {"origins": "http://localhost:5173"},
                     r"/similar_stocks": {"origins": "http://localhost:5173"},
                     r"/recommend_stocks": {"origins": "http://localhost:5173"},
                     r"/diversify": {"origins": "http://localhost:5173"},
                    r"/aig_consult": {"origins": "http://localhost:5173"},
                    })

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

def get_industry_biggest_companys(industry):
    '''
    For future modifications, .top_companies can be replaced for 
    top_performing_companies, so it shows the companys in the industry with the best performance, 
    instead of the biggest companys.
    '''
    try:
        industry = industry.replace(" ", "_").replace("&", "and")
        industry = industry.lower()
        print(f"Buscando compañías en la industria: {industry}")
        companys = yf.Sector(industry)  
        #print(companys.top_companies)
        return companys.top_companies
    except Exception:
        return None

@app.route('/stock/<ticker>', methods=['GET'])
def stock_data(ticker):
    try:
        info, history = get_stock_data(ticker)
        metrics = calculate_metrics(info, history)
        return jsonify({
            'ticker': ticker,
            'price': info.get('currentPrice', None),
            'info': info,
            'metrics': metrics,
            'industry': info.get('sector', None),
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
    
@app.route('/aig_consult', methods=['POST'])
def aig():
    data = request.get_json()

    generativeai.configure(api_key=data.get('api_key'))

    user_stocks = data.get('stocks', [])  
    userpromt = data.get('user_prompt', '')

    stocks_list = ', '.join([f"{stock['symbol']} - {stock['industry']}" for stock in user_stocks])

    prompt = f"""
    You are a financial analysis assistant. The user has provided a list of stocks along with the sectors they belong to. Additionally, they have a specific question or request.

    Here is the list of stocks and their sectors: {stocks_list}.

    The user has asked the following: {userpromt}.

    Based on the provided stocks and sectors, and the user's question, provide a detailed and informative response in English.
    """

    #Set model
    model = generativeai.GenerativeModel('gemini-1.5-flash')
        
    #Generate the content using the model
    response = model.generate_content(prompt)

    recommendations = response.text

    return jsonify({'recommendations': recommendations})

@app.route('/recommend_stocks', methods=['POST'])
def recommend_stocks():
    data = request.get_json()

    generativeai.configure(api_key=data.get('api_key'))

    user_stocks = data.get('user_stocks', [])  #EG: ["AAPL", "GOOGL", "MSFT"]

    #Create a prompt for the model
    prompt = f"Based on the stocks i follow: {', '.join(user_stocks)}, recomend similar stocks or with similar valuations."

    #Set model
    model = generativeai.GenerativeModel('gemini-1.5-flash')
        
    #Generate the content using the model
    response = model.generate_content(prompt)

    recommendations = response.text

    return jsonify({'recommendations': recommendations})

@app.route('/similar_stocks', methods=['POST'])
def similar_stocks():
    """
    Receives JSON with:
    {
        "api_key": "<your_api_key>",
        "stocks": [
        {"symbol": "AAPL", "industry": "Technology"},
        {"symbol": "MSFT", "industry": "Technology"},
        {"symbol": "JNJ", "industry": "Healthcare"}
        ]
    }
    Returns 4 stocks similar to those the user already holds, using the get_industry_biggest_companys function
    to obtain top companies by industry, filtering out those already owned by the user, and asking Gemini to
    generate the final recommendation.
    """

    data = request.get_json()
    api_key = data.get('api_key')
    generativeai.configure(api_key=api_key)

    user_stocks = data.get('stocks', [])  

    # print(f"Data: {user_stocks}")
    if not isinstance(user_stocks, list) or len(user_stocks) == 0:
        return jsonify({'error': 'You are not following any stocks yet. Please add some stocks so we can suggest you similar stocks.'}), 400
    
    user_industries = set()
    user_symbols = set()
    for s in user_stocks:
        symbol = s.get('symbol')
        industry = s.get('industry')
        if symbol and industry:
            user_symbols.add(symbol.upper())
            user_industries.add(industry)
    if len(user_industries) == 0:
        return jsonify({'error': 'There is an error in our side. Try again later.'}), 400

    candidate_symbols = set()
    for industry in user_industries:
        try:
            top_companies = get_industry_biggest_companys(industry)
        except Exception as e:
            # If there's an error fetching the industry data, skip this industry
            continue
        
        print("top COMPANIES:", top_companies)
        if top_companies is None or top_companies.empty:
            continue
        for sym in top_companies.index:
            sym_upper = sym.upper()
            if sym_upper not in user_symbols:
                candidate_symbols.add(sym_upper)

    if len(candidate_symbols) == 0:
        return jsonify({'error': 'No companies where found.'}), 500

    prompt = (
        f"The user holds the following stocks: {', '.join(sorted(user_symbols))}, "
        f"belonging to the industries: {', '.join(sorted(user_industries))}. "
        f"The top companies in those same industries are: "
        f"{', '.join(sorted(candidate_symbols))}. "
        f"Based on this information, recommend 4 stocks that are similar to the ones the user already owns. "
        f"Please provide a brief explanation in English for each suggested stock."
    )

    model = generativeai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(prompt)
    recommendations = response.text

    return jsonify({'recommendations': recommendations})


@app.route('/diversify', methods=['POST'])
def diversify_portfolio():
    """
    Receives JSON with:
    {
        "api_key": "<api_key>",
        "stocks": [
        {"symbol": "AAPL", "industry": "Technology"},
        {"symbol": "MSFT", "industry": "Technology"},
        {"symbol": "JNJ", "industry": "Healthcare"}
        ]
    }
    Returns 4 stocks that help diversify the user's portfolio. It detects the user's industries,
    selects different industries for diversification, retrieves the top companies from those industries
    via get_industry_biggest_companys, and finally asks Gemini to generate the response.
    """

    data = request.get_json()
    api_key = data.get('api_key')
    generativeai.configure(api_key=api_key)

    user_stocks = data.get('stocks', [])
    if not isinstance(user_stocks, list) or len(user_stocks) == 0:
        return jsonify({'error': 'You currently are not following any stock. Please add a stock at least so we can help you diversify your portfolio'}), 400

    # Get industrys and symbols from user's stocks
    user_industries = set()
    user_symbols = set()
    for s in user_stocks:
        symbol = s.get('symbol')
        industry = s.get('industry')
        if symbol and industry:
            user_symbols.add(symbol.upper())
            user_industries.add(industry)
    if len(user_industries) == 0:
        return jsonify({'error': 'There is a problem on our side, please try again later'}), 400

    all_industries = [
        "technology",
        "healthcare",
        "financial_services",
        "consumer_cyclical",
        "energy",
        "materials",
        "industrials",
        "utilities",
        "real_estate",
        "consumer_defensive",
        "communication_services"
    ]

    # Get industries to diversify, excluding those the user already has
    diversify_industries = [ind for ind in all_industries if ind not in user_industries]
    if len(diversify_industries) == 0:
        return jsonify({'error': 'You are already well diversified.'}), 500

    # Get biggest companies in those industries
    candidate_symbols = set()
    for industry in diversify_industries:
        try:
            top_companies = get_industry_biggest_companys(industry)
        except Exception:
            continue
        for sym in top_companies:
            sym_upper = sym.upper()
            if sym_upper not in user_symbols:
                candidate_symbols.add(sym_upper)

    if len(candidate_symbols) == 0:
        return jsonify({'error': 'We couldnt find a match of companies to diversify your portfolio.'}), 500

    prompt = (
        f"The user currently holds stocks in the following industries: {', '.join(sorted(user_industries))}. "
        f"To diversify their portfolio, select 4 stocks from different industries (not already in their portfolio). "
        f"The top candidate companies for diversification (excluding those already held) are: "
        f"{', '.join(sorted(candidate_symbols))}. "
        f"Please suggest 4 stocks that are different from the ones the user already owns and briefly explain in English "
        f"why each stock contributes to portfolio diversification."
    )

    model = generativeai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(prompt)
    recommendations = response.text

    return jsonify({'recommendations': recommendations})

if __name__ == '__main__':
    app.run(debug=True)