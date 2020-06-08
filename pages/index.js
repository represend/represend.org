import React from "react"

import { Container, Typography } from "@material-ui/core"

import Layout from "../src/components/Layout"
import SearchBar from "../src/components/SearchBar"

const DEBUG = process.env.NODE_ENV != "production"
class Home extends React.Component {
  render() {
    return (
      <Layout title="Send Change">
        <SearchBar/>
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