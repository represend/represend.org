import { makeStyles } from "@material-ui/core/styles";
import { Container, CssBaseline } from "@material-ui/core"

import Head from "./Head";
import Header from "./Header";
import Footer from "./Footer"

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  main: {
    marginTop: theme.spacing(2),
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

  const { children, title = "Send Change" } = props;
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Head title={title}/>
      <Header title={title}/>
      <Container component="main" className={classes.main}>
        {children}
      </Container>
      <Footer/>
    </div>
  );
};

export default Layout;