import { Container, Typography } from "@material-ui/core"

import Layout from "../components/Layout"
import SearchBar from "../components/SearchBar"

import QueryController from "../controllers/QueryController"

const Search = ({ address, data, message }) => {
  return (
    <Layout title="Send Change">
      <SearchBar/>
      <Container maxWidth="sm">
        <Typography variant="h6">
          information below
        </Typography>
          {message}
        <Typography variant="body1">
        </Typography>
      </Container>
    </Layout>
  )
}

export const getServerSideProps = async (ctx) => {
  try {
    const response = await QueryController.query(ctx.query.address);
    console.log(response.data)
    return {
      props: {
        address: ctx.query.address,
        data: response.data,
        message: 'Success',
      }
    }
  } catch (error) {
    return {
      props: {
        address: ctx.query.address,
        data: null,
        message: error.message,
      }
    }
  }
}

export default Search