import { Container, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Carousel from "./Carousel";

const useStyles = makeStyles(() => ({
  banner: {
    // backgroundImage: "url(./banner2.jpg)",
    background: "transparent",
    width: "90vw",
    display: "center",
    marginRight: 0,
  },
  bannerContent: {
    height: 400,
    display: "flex",
    flexDirection: "column",
    paddingTop: 25,
    paddingLeft: 10,
    justifyContent: "space-around",
  },
  tagline: {
    display: "flex",
    height: "40%",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
    "&:hover": {
      transform: "scale(1.025)",
      transition: "all .4s ease",
    },
  },
  carousel: {
    height: "50%",
    display: "flex",
    alignItems: "center",
  },
}));

function Banner() {
  const classes = useStyles();

  return (
    <div>
      <div
        className={classes.banner}
        style={
          {
            // border: "1px solid black",
            // boxShadow: "1px 1px black",
          }
        }
      >
        <Container className={classes.bannerContent}>
          <div className={classes.tagline}>
            <Typography
              variant="h3"
              style={{
                fontWeight: "bold",
                marginBottom: 15,
                fontFamily: "Montserrat",
                //   color:"White"
                paddingLeft: "9vw",
                color: "hsla(260, 100%, 50%, 0.6)",
              }}
            >
              StockCastery
            </Typography>
            <Typography
              variant="h5"
              style={{
                // color: "white",
                color: "black",
                textTransform: "capitalize",
                fontFamily: "Montserrat",

                paddingLeft: "8vw",
              }}
            >
              Your Complete Crypto Tracking Platform
            </Typography>
          </div>
          <Carousel />
        </Container>
      </div>
    </div>
  );
}

export default Banner;
