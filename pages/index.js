import Link from "next/link"
import { makeStyles } from "@material-ui/core/styles"
import { Grid, Container, Typography } from "@material-ui/core"

import Layout from "../src/components/Layout"
import Logo from "../src/components/Logo"
import SearchBar from "../src/components/SearchBar"
import SearchBarAutocomplete from "../src/components/SearchBarAutocomplete"

const useStyles = makeStyles((theme) => ({
  grid: {
    minHeight: "70vh",
    '& .MuiGrid-item': {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3)
    }
  },
  text: {
    color: "black",
  },
  about: {
    color: "black",
    textDecoration: "underline"
  },
  link: {
    cursor: "pointer"
  }
}));

const Home = (props) => {
  const classes = useStyles();
  return (
    <Layout>
      <Container maxWidth="md">
        <Grid 
          className={classes.grid}
          container
          direction="column" 
          justify="space-evenly"
          alignItems="stretch"
        >
          <Grid item>
            <Typography className={classes.text} variant="h4">
              <Logo/> is a free to use, crowdsourced platform that empowers you to send demands directly to your representatives.
            </Typography>
          </Grid>
          <Grid item>
            {process.env.AUTOCOMPLETE === "true" ? <SearchBarAutocomplete/> : <SearchBar/>}
          </Grid>
          <Grid className={classes.link} item>
            <Link href="/about">
              <Typography className={classes.about} variant="h5">
                How To Help 💡
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  )
}

export default Home