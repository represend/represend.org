import { Container, Typography } from "@material-ui/core"

import Layout from "../components/Layout"
import SearchBar from "../components/SearchBar"
import Letter from "../components/Letter"

import QueryController from "../controllers/QueryController"

const levels = ["administrativeArea2", "locality", "regional", "subLocality1", "subLocality2"] // City

const Search = ({ address, message, data, error, url }) => {
  const district = error ? "" : data.divisions[Object.keys(data.divisions)[0]].name;
  const emails = error ? "" :data.officials.filter((x) => {return "emails" in x}).map((x) => {return x.emails[0]}).join(', ');

  function renderBody() {
    if (error) {
      return <Typography align="center">Sorry, {message}</Typography>
    } else {
      return <Letter district={district} emails={emails} url={url}/>
    }
  }

  return (
    <Layout title="Send Change">
      <SearchBar address={address}/>
      <Container maxWidth="sm">
        {renderBody()}
      </Container>
    </Layout>
  )
}

export const getServerSideProps = async (ctx) => {
  try {
    const response = await QueryController.query(ctx.query.address, levels);
    const error = !("divisions" in response.data);
    return {
      props: {
        url: ctx.req.headers.referer,
        address: ctx.query.address,
        data: response.data,
        message: error ? "the location could not be found." : "",
        error: error,
      }
    }
  } catch (error) {
    return {
      props: {
        url: ctx.req.headers.referer,
        address: ctx.query.address,
        data: null,
        message: error.message,
        error: true,
      }
    }
  }
}

export default Search;