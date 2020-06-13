import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";

import Header from "./Header";
import Footer from "./Footer"

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  main: {
    marginBottom: theme.spacing(2),
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: "auto",
    backgroundColor:
      theme.palette.type === "light" ? theme.palette.grey[200] : theme.palette.grey[800],
  },
}));

const Layout = (props) => {
  const classes = useStyles();

  const { children, title = "Represend" } = props;
  return (
    <div className={classes.root}>
      <Header title={title}/>
      <Container component="main" className={classes.main}>
        {children}
      </Container>
      <Footer/>
    </div>
  );
};

export default Layout;