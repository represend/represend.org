import Router from "next/router"

import { makeStyles } from "@material-ui/core/styles";
import { Search, MyLocation } from "@material-ui/icons";
import { Grid, FormControl, FormHelperText, OutlinedInput, InputAdornment, IconButton, Divider } from "@material-ui/core";

import { findLocation } from "../util/util";

const DEBUG = process.env.NODE_ENV != "production";

const useStyles = makeStyles((theme) => ({
  searchbar: {
    padding: theme.spacing(2)
  },
  input: {
    [`& fieldset`]: {
      borderRadius: 20,
    },
    minWidth: "300px"
  }
}));

const SearchBar = (props) => {
  const classes = useStyles();
  const [address, setAddress] = React.useState(props.address ? props.address : "")

  const handleSearch = () => {
    Router.push({
      pathname: "/search",
      query: { address: address },
    });
  }

  const handleLocateUser = async () => {
    try {
      const address = await findLocation();
      setAddress(address)
      Router.push({
        pathname: "/search",
        query: { address: address },
      });
    } catch (error) {
      if (DEBUG) { 
        console.log(error.message);
      }
    }
  };
  
  return (
    <Grid className={classes.searchbar} container justify="center">
      <FormControl variant="outlined">
        <OutlinedInput
          id="search-input"
          className={classes.input}
          placeholder="Search"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          onKeyPress={(event) => {
            if (event.key==="Enter") {
              handleSearch();
              event.preventDefault();
            };
          }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="search"
                onClick={handleSearch}
                edge="end"
              >
                <Search/>
              </IconButton>
              <Divider orientation="vertical" flexItem />
              <IconButton
                aria-label="locate-user"
                onClick={handleLocateUser}
                edge="end"
              >
                <MyLocation/>
              </IconButton>
            </InputAdornment>
          }
          aria-describedby="search-helper-text"
          inputProps={{
            "aria-label": "search",
          }}
          labelWidth={0}
        />
        <FormHelperText id="search-helper-text">Find with City, County, or Zip Code</FormHelperText>
      </FormControl>
    </Grid>
  )
}

export default SearchBar;