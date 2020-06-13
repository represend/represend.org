import { Grid, Typography, Link } from "@material-ui/core"

const Error = ({ message }) => {
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
          , so they may not be perfect. Currently, the results are limited to the US, and Represend only searches at the local level - your county and city.
        </Typography>
        <br/>
        <Typography>
          Some frequent errors are:
        </Typography>
        <ul style={{margin: 0}}>
            <li><Typography>Entering the state or country</Typography></li>
            <li><Typography>Location not in US</Typography></li>
            <li><Typography>Typo (happens to us too)</Typography></li>
        </ul>
        <br/>
        <Typography>
          <b>We encourage you to try again, but if the problem persists, there are many other communities that could use your help!</b>
        </Typography>
      </Grid>
    </Grid>
  )
}

export default Error;