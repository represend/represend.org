import { Container, Typography } from "@material-ui/core"

import Layout from "../components/Layout"
import SearchBar from "../components/SearchBar"

import { searchCivics } from "../util/util"

const Search = (props) => {
  const { address } = props
  console.log(address)
  console.log(props)
  return (
    <Layout title="Send Change">
      <SearchBar/>
      <Container maxWidth="sm">
        <Typography variant="h6">
          information below
        </Typography>
        <Typography variant="body1">
          more informaton
        </Typography>
      </Container>
    </Layout>
  )
}

Search.getInitalProps = async (ctx) => {
  // get params
  const address = ctx.query.address
  console.log(address)
  const res = await searchCivics(address);
  return { 
    prop: {
      address: address 
    }
  }
}

export default Search