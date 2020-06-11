import { Container, Snackbar, Grow} from "@material-ui/core"
import { Alert } from "@material-ui/lab"
import { useRouter } from "next/router"

import Layout from "../src/components/Layout"
import SearchBar from "../src/components/SearchBar"
import SearchBarAutocomplete from "../src/components/SearchBarAutocomplete"
import Error from "../src/components/Error"
import Letter from "../src/components/Letter"

import QueryController from "../src/controllers/QueryController"
import LetterController from "../src/controllers/LetterController"

const levels = ["administrativeArea2", "locality", "regional", "subLocality1", "subLocality2"] // City

const constructDivisionInfo = (data) => {
  if (!data || !data.divisions) {
    return [null, null]
  }

  const toTitleCase = (str) => {
    return str.split(" ").map((x) => {return x[0].toUpperCase() + x.substr(1)}).join(" ")
  }

  const divisions = data.divisions
  // Rank by place, county (mutually exclusive)
  let divisionNames = []
  for (let key in divisions) {
    if (key.includes("place")) {
      divisionNames.unshift(toTitleCase(divisions[key].name))
    } else if (key.includes("county")) {
      divisionNames.push(toTitleCase(divisions[key].name))
    }
  }
  return [divisionNames[0], divisionNames.length > 1 ? divisionNames[1] : null]
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
  return [officials, emails]
}

const constructCivicLetterData = (data) => {
  const [location, sublocation] = constructDivisionInfo(data);
  const [officials, emails] = constructOfficials(data);
  return {
    location: location,
    sublocation: sublocation,
    officials: officials,
    emails: emails,
  }
}

const Search = ({ host, address, civicData, letterData, message, error }) => {
  const router = useRouter();
  const civicLetterData = constructCivicLetterData(civicData);
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
        <Error message={message}/>
      )
    } else {
      // Remove Location
      const index = letterData.tags.indexOf("Location")
      if (index > -1) { 
        letterData.tags.splice(index, 1) 
      }
      let data = {
        title: letterData.title ? letterData.title.replace(/\[Location\]/g, civicLetterData.location) : civicLetterData.location,
        subtitle: letterData.subtitle ? letterData.title.replace(/\[Location\]/g, civicLetterData.sublocation) : civicLetterData.sublocation,
        officials: letterData.add ? civicLetterData.officials.concat(letterData.officials).join(", ") : letterData.officials.join(", "),
        emails: letterData.add ? civicLetterData.emails.concat(letterData.emails).join(", ") : letterData.emails.join(", "),
        subject: letterData.subject.replace(/\[Location\]/g, civicLetterData.location),
        body: letterData.body.replace(/\[Location\]/g, civicLetterData.location),
        tags: letterData.tags,
        url: url,
        toast: showToast
      }
      return (
        <Letter {...data}/>
      )
    }
  }

  return (
    <Layout title="Send Change 📣">
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
        <Alert elevation={3} variant="standard" onClose={handleToastClose} severity={toastSeverity}>
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
    let error = false;
    let message = "";
    let letterData = null;
    // Fetch letter
    if ("divisions" in response.data) {
      try {
        const divisionIDs = Object.keys(response.data.divisions)
        letterData = await LetterController.query(divisionIDs)
      } catch (err) {
        error = true
        message = "Unable to show letter"
      }
    } else {
      error = true,
      message = "We could not find your location"
    }
    return {
      props: {
        host: host,
        address: ctx.query.address,
        civicData: response.data,
        letterData: letterData,
        message: message,
        error: error,
      }
    }
  } catch (err) {
    return {
      props: {
        host, host,
        address: ctx.query.address,
        civicData: null,
        letterData: null,
        message: err.message,
        error: true,
      }
    }
  }
}

export default Search;