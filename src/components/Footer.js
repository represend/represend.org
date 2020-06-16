import { makeStyles } from "@material-ui/core/styles";
import { Container, Link, Typography } from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
  footer: {
    padding: theme.spacing(1),
    marginTop: "auto",
  },
  typography: {
    color: props => props.inverted ? "white" : "black"
  }
}));

const Footer = (props) => {
  const classes=useStyles(props)

  return (
    <footer className={classes.footer}>
      <Container maxWidth="sm">
        <Typography className={classes.typography} variant="body2" align="center">
          {new Date().getFullYear()} {" Represend"} 
          {" | "}
          <Link color="inherit" href="https://github.com/represend/represend.org" target="_blank">
            {"Contribute"}
          </Link>{" "}
        </Typography>
      </Container>
    </footer>
  );
}

export default Footer