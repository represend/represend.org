import { makeStyles } from "@material-ui/core/styles";
import { Container, Link, Typography } from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
  footer: {
    padding: theme.spacing(1),
    marginTop: "auto",
    backgroundColor: theme.palette.grey[200],
  },
}));

const Footer = () => {
  const classes=useStyles()

  return (
    <footer className={classes.footer}>
      <Container maxWidth="sm">
        <Typography variant="body2" color="textSecondary" align="center">
          {new Date().getFullYear()} {" Send Change"} 
          {" | "}
          <Link color="inherit" href="https://github.com/donutdaniel/sendchange" target="_blank">
            {"Code"}
          </Link>{" "}
        </Typography>
      </Container>
    </footer>
  );
}

export default Footer