from flask import Flask, request, jsonify
from flask_lt import run_with_lt
from flask_cors import CORS
from Prediction import result
import logging
import re
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

def checkkey(key):
    with open('key.txt', 'r') as f:
        for line in f:
            line = line.rstrip()
            if re.search(f"({key})", line):
                return True
        return False

logging.basicConfig(filename='requests.log', level=logging.INFO, format='%(asctime)s %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p')

app = Flask(__name__)
CORS(app)
run_with_lt(app, subdomain='stockcastery1147511545')

limiter = Limiter(app, key_func=get_remote_address)

@app.get("/") # route
@limiter.limit("2/minute")
def index_get():
    return "Stock Price Prediction"
    # return render_template("index.html")

@app.errorhandler(429)
def ratelimit_handler(e):
    return  jsonify("You have exceeded the Rate-Limit")

@app.post("/predict")
@limiter.limit("5/minute")
def predict():
    key = request.args.get('KEY')
    
    if(not key):
        return jsonify("Unauthorized Request(Missing API Key)")
    
    if len(key) != 64:
        return jsonify("Unauthorized Request(Access Denied)")
    
    if not checkkey(key):
        return jsonify("Unauthorized Request(Access Denied)")
    
    stock_name = request.get_json().get("name")
    cur = request.get_json().get("cur")
    stock = f'{stock_name}-{cur}'
    ip = get_remote_address()
    logging.info(ip)
    logging.info(stock)
    resp1 = result(stock, 7)
    resp2 = result(stock, 14)
    resp3 = result(stock, 21)
    resp4 = result(stock, 28)
    resp = {"price": [resp1, resp2, resp3, resp4]}
    print(f"Future Price for {stock_name}: {resp}\n")
    return jsonify(resp)

if __name__ == "__main__":
    logging.info("Running application with local development server!")
    app.run(threaded=True, host='0.0.0.0', port='80')