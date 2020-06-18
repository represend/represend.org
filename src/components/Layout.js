import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";

import Header from "./Header";
import Footer from "./Footer";

import { initGA, logPageView } from "../util/analytics";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: props => props.titlePage && theme.palette.background.secondary
  },
  main: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: "auto",
  },
}));

const Layout = (props) => {
  const classes = useStyles(props);

  React.useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true
    }
    logPageView();
  }, [])

  const { children, search, address } = props;
  return (
    <div className={classes.root}>
      <Header search={search} address={address}/>
      <Container component="main" className={classes.main}>
        {children}
      </Container>
      <Footer/>
    </div>
  );
};

export default Layout;