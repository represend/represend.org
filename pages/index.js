import React from "react"

import { Container, Typography } from "@material-ui/core"

import Layout from "../src/components/Layout"
import SearchBar from "../src/components/SearchBar"
import SearchBarAutocomplete from "../src/components/SearchBarAutocomplete"

class Home extends React.Component {
  render() {
    return (
      <Layout title="Send Change">
        {process.env.AUTOCOMPLETE ? <SearchBarAutocomplete/> : <SearchBar/>}
        <Container maxWidth="sm">
          <Typography variant="h6">
            What is Send Change?
          </Typography>
          <Typography variant="body1">
            Send Change is ....
          </Typography>
        </Container>
      </Layout>
    )
  }
}

export default Home