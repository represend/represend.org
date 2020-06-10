import { Container, Grid, Typography, Snackbar, Grow, Link } from "@material-ui/core"
import { Alert } from "@material-ui/lab"
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

  const [toastShow, setToastShow] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");
  const [toastSeverity, setSeverity] = React.useState("");
  const handleToastClose = () => {
    setToastShow(false);
  };
  const showToast = (message, severity) => {
    setToastMessage(message);
    setSeverity(severity);
    setToastShow(true);
  }

  function renderBody() {
    if (error) {
      return (
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h4">
              Oops! 📍
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <b>{message}</b>
              <br/><br/>
              Sorry we couldn't find your location! Our search results are based off{" "}
              <Link href="https://developers.google.com/civic-information">Google's Civic Information API</Link>
              , so they may not be perfect. Currently, the results are limited to the US, and Send Change only searches at the local level - your county and city.
              <br/><br/>
              Some frequent errors are:
              <ul style={{margin: 0}}>
                <li>Entering the state or country</li>
                <li>Location not in US</li>
                <li>Typo (happens to us too)</li>
              </ul>
              <br/>
              <b>We encourage you to try again, but if the problem persists, there are many other communities that could use your help!</b>
            </Typography>
          </Grid>
        </Grid>
      )
    } else {
      return <Letter division={divisionID} officials={officials} emails={emails} url={url} toast={showToast}/>
    }
  }

  return (
    <Layout title="Send Change 📢">
      {process.env.AUTOCOMPLETE ? <SearchBarAutocomplete address={address}/> : <SearchBar address={address}/>}
      <Container maxWidth="sm">
        {renderBody()}
      </Container>
      <Snackbar 
        open={toastShow} 
        autoHideDuration={2000} 
        onClose={handleToastClose}
        TransitionComponent={Grow}
      >
        <Alert elevation={3} variant="outlined" onClose={handleToastClose} severity={toastSeverity}>
          {toastMessage}
        </Alert>
      </Snackbar>
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
        message: error ? "We could not find your location" : "",
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