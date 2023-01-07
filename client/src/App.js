import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import CoinPage from "./Pages/CoinPage";
import Homepage from "./Pages/Homepage";

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  App: {
    background:
      "linear-gradient(145deg, rgba(254,242,236,1) 0%, rgba(219,223,255,1) 25%, rgba(204,255,239,1) 50%, rgba(219,223,255,1) 75%, rgba(255,232,250,1) 100%)",
    color: "black",
    minHeight: "100vh",
    marginRight: 0,
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    <BrowserRouter>
      <div className={classes.App}>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} exact />
          <Route path="/coins/:id" element={<CoinPage />} exact />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
