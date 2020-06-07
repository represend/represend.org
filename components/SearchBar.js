import Router from "next/router"

import { makeStyles } from "@material-ui/core/styles";
import { Search, MyLocation } from "@material-ui/icons";
import { Grid, FormControl, FormHelperText, OutlinedInput, InputAdornment, IconButton, Divider } from "@material-ui/core";

import { findLocation } from "../util/util"

const DEBUG = process.env.NODE_ENV != "production"

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

const SearchBar = () => {
  const classes = useStyles();
  const [query, setQuery] = React.useState("");

  const handleSearch = () => {
    Router.push({
      pathname: "/search",
      query: { address: query },
    });
  }

  const handleLocateUser = async () => {
    try {
      const address = await findLocation();
      setQuery(address)
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
          value={query}
          onChange={(event) => setQuery(event.target.value)}
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

export default SearchBar