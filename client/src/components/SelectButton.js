import { makeStyles } from "@mui/styles";

const SelectButton = ({ children, selected, onClick }) => {
  const useStyles = makeStyles({
    selectbutton: {
      border: "1px solid gold",
      borderRadius: 5,
      padding: "2%",
      paddingLeft: "1%",
      paddingRight: "1%",
      textAlign: "center",
      fontFamily: "Montserrat",
      cursor: "pointer",
      backgroundColor: selected ? "rgb(115, 223, 240)" : "",
      color: selected ? "black" : "",
      fontWeight: selected ? 700 : 500,
      "&:hover": {
        background:
          "linear-gradient(90deg, rgba(151,244,232,1) 0%, rgba(96,235,202,1) 38%, rgba(82,237,152,1) 91%)",
        color: "black",
        transform: "scale(1.05)",
        transition: "all .4s ease",
      },
      width: "22%",
      //   margin: 5,
    },
  });

  const classes = useStyles();

  return (
    <span onClick={onClick} className={classes.selectbutton}>
      {children}
    </span>
  );
};

export default SelectButton;
