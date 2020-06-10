import { Container, Typography } from "@material-ui/core"
import { useRouter } from "next/router"

import Layout from "../src/components/Layout"
import SearchBar from "../src/components/SearchBar"
import SearchBarAutocomplete from "../src/components/SearchBarAutocomplete"
import Letter from "../src/components/Letter"

import QueryController from "../src/controllers/QueryController"

const levels = ["administrativeArea2", "locality", "regional", "subLocality1", "subLocality2"] // City

const constructDivisionID = (data) => {
  if (!data || !data.divisions) {
    return null
  }
  const divisions = data.divisions
  // Rank by county, place (mutually exclusive)
  let searchIDs = []
  for (let key in divisions) {
    if (key.includes("county")) {
      searchIDs.unshift(divisions[key].name)
    } else if (key.includes("place")) {
      searchIDs.push(divisions[key].name)
    }
  }
  let searchID = searchIDs.join(", ")
  // To Title Case
  searchID = searchID.split(" ").map((x) =>  {return x[0].toUpperCase() + x.substr(1)}).join(" ")
  return searchID
}

const constructOfficials = (data) =>  {
  if (!data || !data.offices || !data.officials){
    return [null, null]
  }
  let officials = []
  let emails = []
  for (let i = 0; i < data.offices.length; i++) {
    let office = data.offices[i]
    if ("officialIndices" in office) {
      let official = data.officials[office.officialIndices[0]]
      if ("emails" in official) {
        officials.push(`${office.name} ${official.name}`)
        emails.push(official.emails[0])
      }
    }
  }
  return [officials.join(", "), emails.join(", ")]
}

const Search = ({ host, address, message, data, error }) => {
  const router = useRouter();
  const divisionID = constructDivisionID(data);
  const [officials, emails] = constructOfficials(data);
  const url = host + router.asPath

  function renderBody() {
    if (error) {
      return <Typography align="center">Sorry, {message}</Typography>
    } else {
      return <Letter division={divisionID} officials={officials} emails={emails} url={url}/>
    }
  }

  return (
    <Layout title="Send Change">
      {process.env.AUTOCOMPLETE ? <SearchBarAutocomplete/> : <SearchBar/>}
      <Container maxWidth="sm">
        {renderBody()}
      </Container>
    </Layout>
  )
}

export const getServerSideProps = async (ctx) => {
  const host = `https://${ctx.req.headers.host}`
  try {
    const response = await QueryController.query(ctx.query.address, levels);
    const error = !("divisions" in response.data);
    return {
      props: {
        host: host,
        address: ctx.query.address,
        data: response.data,
        message: error ? "the location could not be found." : "",
        error: error,
      }
    }
  } catch (error) {
    return {
      props: {
        host, host,
        address: ctx.query.address,
        data: null,
        message: error.message,
        error: true,
      }
    }
  }
}

export default Search;