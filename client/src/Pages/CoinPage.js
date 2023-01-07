import {
  Button,
  CircularProgress,
  createTheme,
  LinearProgress,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";

import CoinInfo from "../components/CoinInfo";
import { SingleCoin } from "../config/api";
import { numberWithCommas } from "../components/CoinsTable";
import { CryptoState } from "../CryptoContext";
import { makeStyles } from "@mui/styles";

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [btn, setBtn] = useState(true);
  const [err, setErr] = useState(false);
  const [name, setName] = useState("");
  let cur = "";

  let count = 0;

  const { currency, symbol } = CryptoState();

  useEffect(() => {
    // eslint-disable-next-line
    cur = currency;
    // eslint-disable-next-line
    setBtn(true);
  }, [coin, symbol, currency]);

  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id));
    setCoin(data);
    setName(data.symbol);
  };

  const fetchPrediction = async () => {
    try {
      axios.defaults.headers.post["Content-Type"] =
        "application/json;charset=utf-8";
      axios.defaults.headers.post["Bypass-Tunnel-Reminder"] = "1";
      axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
      const { data } = await axios.post(
        `https://stockcastery1147511545.loca.lt/predict?KEY=${process.env.REACT_APP_API_KEY}`,
        {
          name,
          cur,
        }
      );
      setLoading(false);
      setData(data.price);
    } catch (error) {
      setErr(true);
    }
  };

  const handleButtonSubmit = () => {
    setLoading(true);
    setBtn(false);
    fetchPrediction();
  };
  useEffect(() => {
    fetchCoin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 1080,
        lg: 1200,
        xl: 1536,
      },
    },
  });
  const useStyles = makeStyles((theme) => ({
    container: {
      display: "flex",

      [darkTheme.breakpoints.down("md")]: {
        flexDirection: "column",
        alignItems: "center",
      },
    },
    sidebar: {
      width: "30%",
      [darkTheme.breakpoints.up("md")]: {
        width: "100%",
      },
      [darkTheme.breakpoints.down("md")]: {
        padding: "5%",
      },
      [darkTheme.breakpoints.down("sm")]: {
        padding: "10%",
      },

      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: 25,
      padding: "1%",
      borderRight: "2px solid grey",
    },
    heading: {
      fontWeight: "bold",
      marginBottom: 20,
      fontFamily: "Montserrat",
    },
    description: {
      width: "100%",
      fontFamily: "Montserrat",
      paddingRight: "25",
      paddingBottom: "15",
      paddingTop: 0,
      textAlign: "center",
    },
    marketData: {
      alignSelf: "center",
      padding: 25,
      paddingTop: 10,
      width: "100%",
      display: "flex",
      justifyContent: "space-around",
      flexDirection: "column",
      alignItems: "center",

      [darkTheme.breakpoints.down("md")]: {
        display: "flex",
        justifyContent: "space-around",
      },
      [darkTheme.breakpoints.down("sm")]: {
        flexDirection: "column",
        alignItems: "center",
      },
      [darkTheme.breakpoints.down("xs")]: {
        alignItems: "start",
      },
    },
  }));

  const classes = useStyles();

  if (!coin) return <LinearProgress style={{ backgroundColor: "gold" }} />;

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <img
          src={coin?.image.large}
          alt={coin?.name}
          height="200"
          style={{ marginBottom: 20 }}
        />
        <Typography variant="h3" className={classes.heading}>
          {coin?.name}
        </Typography>
        <Typography variant="subtitle1" className={classes.description}>
          {ReactHtmlParser(coin?.description.en.split(". ")[0])}.
        </Typography>
        <div className={classes.marketData}>
          <span style={{ display: "flex" }}>
            <Typography variant="subtitle1" className={classes.heading}>
              Rank:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="subtitle1"
              style={{
                fontFamily: "Montserrat",
              }}
            >
              {numberWithCommas(coin?.market_cap_rank)}
            </Typography>
          </span>

          <span style={{ display: "flex" }}>
            <Typography variant="subtitle1" className={classes.heading}>
              Current Price:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="subtitle1"
              style={{
                fontFamily: "Montserrat",
              }}
            >
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.current_price[currency.toLowerCase()]
              )}
            </Typography>
          </span>
          <span style={{ display: "flex" }}>
            <Typography variant="subtitle1" className={classes.heading}>
              Market Cap:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="subtitle1"
              style={{
                fontFamily: "Montserrat",
              }}
            >
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.market_cap[currency.toLowerCase()]
                  .toString()
                  .slice(0, -6)
              )}
              M
            </Typography>
          </span>
        </div>
        {btn && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleButtonSubmit()}
          >
            Predict Future Price
          </Button>
        )}
        {loading && !err && (
          <>
            <CircularProgress color="success" />
            <Typography variant="subtitle1">Predicting...</Typography>
          </>
        )}
        {!btn && !loading && !err && data !== [] && (
          <Typography variant="h6">Prediction results: </Typography>
        )}
        {!btn &&
          !err &&
          !loading &&
          data !== [] &&
          data.map((datas) => {
            count += 7;
            return (
              <Typography key={datas}>
                Price after {count} days: {symbol}
                {datas}
              </Typography>
            );
          })}
        {err && (
          <Typography variant="h6" style={{ textAlign: "center" }}>
            Server Down! Please try again later
          </Typography>
        )}
      </div>
      <CoinInfo coin={coin} />
    </div>
  );
};

export default CoinPage;
