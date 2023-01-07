import os
import numpy as np
from data import fetch_data
from train import train_model, build_model
from params import *

        
def get_final_df(model, data,LOOKUP_STEP):
    # if predicted future price is higher than the current, 
    # future price - current price = buy profit
    buy_profit  = lambda current, pred_future, true_future: true_future - current if pred_future > current else 0
    # if the predicted future price is lower than the current price,
    # then the current price - true future price
    sell_profit = lambda current, pred_future, true_future: current - true_future if pred_future < current else 0
    X_test = data["X_test"]
    y_test = data["y_test"]
    
    y_pred = model.predict(X_test)
    if SCALE:
        y_test = np.squeeze(data["column_scaler"]["adjclose"].inverse_transform(np.expand_dims(y_test, axis=0)))
        y_pred = np.squeeze(data["column_scaler"]["adjclose"].inverse_transform(y_pred))
    test_df = data["test_df"]

    test_df[f"adjclose_{LOOKUP_STEP}"] = y_pred
    test_df[f"true_adjclose_{LOOKUP_STEP}"] = y_test
    test_df.sort_index(inplace=True)
    final_df = test_df
    final_df["buy_profit"] = list(map(buy_profit, 
                                    final_df["adjclose"], 
                                    final_df[f"adjclose_{LOOKUP_STEP}"], 
                                    final_df[f"true_adjclose_{LOOKUP_STEP}"])
                                    # since we don't have profit for last sequence, add 0's
                                    )
    final_df["sell_profit"] = list(map(sell_profit, 
                                    final_df["adjclose"], 
                                    final_df[f"adjclose_{LOOKUP_STEP}"], 
                                    final_df[f"true_adjclose_{LOOKUP_STEP}"])
                                    # since we don't have profit for last sequence, add 0's
                                    )
    return final_df

def predict(model, data):
    last_sequence = data["last_sequence"][-N_STEPS:]
    last_sequence = np.expand_dims(last_sequence, axis=0)
    prediction = model.predict(last_sequence)
    return data["column_scaler"]["adjclose"].inverse_transform(prediction)[0][0] if SCALE else prediction[0][0]

def result(ticker,LOOKUP_STEP):
    ticker = ticker.upper()
    model_name = f"{date_now}_{ticker}_steps{LOOKUP_STEP}"

    path_to_file = f"results/{model_name}.h5"
    if os.path.exists(path_to_file) != True:
        train_model(ticker, LOOKUP_STEP)

    model = build_model()
    model_path = os.path.join("results", model_name) + ".h5"
    model.load_weights(model_path)

    data = fetch_data(ticker,LOOKUP_STEP)

    loss, mae = model.evaluate(data["X_test"], data["y_test"], verbose=0)
    # calculate the mean absolute error (inverse scaling)
    if SCALE:
        mean_absolute_error = data["column_scaler"]["adjclose"].inverse_transform([[mae]])[0][0]
    else:
        mean_absolute_error = mae

    # final testing dataframe
    final_df = get_final_df(model, data,LOOKUP_STEP)

    # predict the future price
    future_price = predict(model, data)

    return f"{future_price:.2f}" if (int(future_price) > 0) else f"{future_price:.8f}"

if __name__ == "__main__":
    ticker = input("Code: ")
    LOOKUP_STEP = int(input("Duration: "))
    resp = result(ticker,LOOKUP_STEP)
    print(f"{ticker.upper()} Price after {LOOKUP_STEP} day: {resp} ")
