import React from "react"

import { makeStyles } from "@material-ui/core/styles"
import { Grid, Container, Typography, Link } from "@material-ui/core"

import Layout from "../src/components/Layout"
import Logo from "../src/components/Logo"
import SearchBar from "../src/components/SearchBar"
import SearchBarAutocomplete from "../src/components/SearchBarAutocomplete"

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(8)
  },
  text: {
    color: "white"
  }
}));

const Home = (props) => {
  const classes = useStyles();
  return (
    <Layout titlePage>
      <Container className={classes.root} maxWidth="md">
        <Grid 
          container
          direction="column" 
          justify="space-around"
          alignItems="stretch"
          spacing={10}
        >
          <Grid item>
            <Typography className={classes.text} variant="h4">
              <Logo/> is a free to use, crowdsourced platform that empowers you to send demands directly to your representatives.
            </Typography>
          </Grid>
          <Grid item>
            {process.env.AUTOCOMPLETE ? <SearchBarAutocomplete inverted/> : <SearchBar inverted/>}
          </Grid>
          <Grid item>
            <Link href="/about">
              <Typography className={classes.text} variant="h5">
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