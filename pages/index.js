import React from "react"

import { Container, Typography } from "@material-ui/core"

import Layout from "../src/components/Layout"
import SearchBar from "../src/components/SearchBar"
import SearchBarAutocomplete from "../src/components/SearchBarAutocomplete"

class Home extends React.Component {
  render() {
    const IntroTitle = "What is Send Change?"
    const IntroBody = ""

    return (
      <Layout title="Send Change 📣">
        {process.env.AUTOCOMPLETE ? <SearchBarAutocomplete/> : <SearchBar/>}
        <Container maxWidth="sm">
          <Typography variant="h4">
            What is Send Change?
          </Typography>
          <br/>
          <Typography variant="body1">
            Lend your voice to others. Speak up about injustices. Make a change, starting in your community.<br/><br/>
            Send Change is a platform where you can access templated emails advocating for defunding the police, and send
            them to representatives in your county or city.<br/><br/>
          </Typography>
        </Container>
      </Layout>
    )
  }
}

export default Home