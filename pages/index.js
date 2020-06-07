import React from "react"
import Router from "next/router"

import { Container, Typography } from "@material-ui/core"

import Layout from "../components/Layout"
import SearchBar from "../components/SearchBar"

import { findLocation } from "../util/util"

const DEBUG = process.env.NODE_ENV != "production"
class Home extends React.Component {
  // don't force geolocation everytime
  // async componentDidMount() {
  //   try {
  //     const address = await findLocation()
  //     console.log(address)
  //     Router.push({
  //       pathname: "/search",
  //       query: { address: address },
  //     })
  //   } catch (error) {
  //     if (DEBUG) { 
  //       console.log(error.message)
  //     }
  //   }
  // }

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