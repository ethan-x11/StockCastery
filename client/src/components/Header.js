import {
  AppBar,
  Container,
  createTheme,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { makeStyles, ThemeProvider } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { CryptoState } from "../CryptoContext";

const useStyles = makeStyles(() => ({
  title: {
    flex: 1,
    color: "black",
    fontFamily: "Montserrat",
    fontWeight: "bold",
    cursor: "pointer",
  },
}));

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Header = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const { currency, setCurrency } = CryptoState();

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar color="transparent" position="static">
        <Container>
          <Toolbar style={{ paddingLeft: "0px" }}>
            <Typography
              style={{ marginLeft: "0" }}
              onClick={() => navigate("/")}
              variant="h5"
              className={classes.title}
            >
              StockCastery
            </Typography>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={currency}
              variant="outlined"
              style={{
                width: 100,
                height: 40,
                marginRight: "30px",
              }}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <MenuItem value={"USD"}>USD</MenuItem>
              <MenuItem value={"INR"}>INR</MenuItem>
            </Select>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;
