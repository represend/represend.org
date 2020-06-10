import Router from "next/router"
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";

import { makeStyles } from "@material-ui/core/styles";
import { Search, MyLocation } from "@material-ui/icons";
import { Grid, FormControl, FormHelperText, OutlinedInput, InputAdornment, IconButton, CircularProgress, Typography, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab"

import { findLocation } from "../util/util";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY

const useStyles = makeStyles((theme) => ({
  searchbar: {
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
  autocomplete: {
    root: {
      '&&[class*="MuiOutlinedInput-root"] $input': {
        padding: 100
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "green"
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "red"
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "purple"
      }
    }
  },
  input: {
    [`& fieldset`]: {
      borderRadius: 20,
    },
    ['& [class*="MuiOutlinedInput-root"]']: {
      paddingRight: 14,
    },
    minWidth: "300px",
  },
  loadingCircle: {
    paddingTop: theme.spacing(2)
  }
}));

function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null }

const SearchBarAutocomplete = (props) => {
  const classes = useStyles();
  const [searching, setSearching] = React.useState(false);
  const [value, setValue] = React.useState(props.address ? props.address : null);
  const [inputValue, setInputValue] = React.useState(props.address ? props.address : "");
  const [options, setOptions] = React.useState([]);
  const loaded = React.useRef(false);
  const toast = props.toast;

  if (typeof window !== "undefined" && !loaded.current) {
    if (!document.querySelector("#google-maps")) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_API_KEY}&libraries=places`,
        document.querySelector("head"),
        "google-maps",
      );
    }
    loaded.current = true;
  }

  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 200),
    [],
  );

  React.useEffect(() => {
    let active = true;
    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }
    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }
    const request = {
      input: inputValue,
      componentRestrictions: {
        country: "us"
      },
      types: ["(regions)"]
    }
    fetch(request, (results) => {
      if (active) {
        let newOptions = [];
        if (value) {
          newOptions = [value];
        }
        if (results) {
          newOptions = [...newOptions, ...results];
        }
        setOptions(newOptions);
      }
    });
    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  const handleSearch = (query) => {
    setSearching(true)
    Router.push({
      pathname: "/search",
      query: { address: query },
    })
    setSearching(false)
  }

  const handleLocateUser = async () => {
    setSearching(true)
    try {
      const address = await findLocation();
      setValue(address)
      setInputValue(address)
      Router.push({
        pathname: "/search",
        query: { address: address },
      });
    } catch (error) {
      toast(error.message, "error")
    } finally {
      setSearching(false)
    };
  };
  
  return (
    <Grid container
      className={classes.searchbar} 
      direction="column" 
      justify="center" 
      alignItems="center"
    >
      <Grid item xs={12}>
        <FormControl variant="outlined">
          <Autocomplete
            id="autocomplete"
            className={classes.autocomplete}
            getOptionLabel={(option) => (typeof option === "string" ? option : option.description)}
            filterOptions={(x) => x}
            options={options}
            autoComplete
            freeSolo
            disableClearable
            includeInputInList
            filterSelectedOptions
            value={value}
            onChange={(event, newValue) => {
              setOptions(newValue ? [newValue, ...options] : options);
              setValue(newValue);
              handleSearch(newValue.description);
            }}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            onKeyPress={(event) => {
              if (event.key==="Enter") {
                handleSearch(inputValue);
                event.preventDefault();
              };
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                className={classes.input}
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment:
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="search"
                        onClick={() => {
                          handleSearch(inputValue)
                        }}
                        edge="end"
                      >
                        <Search/>
                      </IconButton>
                      <IconButton
                        aria-label="locate-user"
                        onClick={handleLocateUser}
                        edge="end"
                      >
                        <MyLocation/>
                      </IconButton>
                    </InputAdornment>
                }}
                fullWidth
              />
            )}
            renderOption={(option) => {
              const matches = option.structured_formatting.main_text_matched_substrings;
              const parts = parse(
                option.structured_formatting.main_text,
                matches.map((match) => [match.offset, match.offset + match.length]),
              );

              return (
                <Grid container alignItems="center">
                  <Grid item xs={12}>
                    {parts.map((part, index) => (
                      <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                        {part.text}
                      </span>
                    ))}
                    <Typography variant="body2" color="textSecondary">
                      {option.structured_formatting.secondary_text}
                    </Typography>
                  </Grid>
                </Grid>
              );
            }}
          />
          <FormHelperText id="search-helper-text">Find with City, County, or Zip Code</FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <div className={classes.loadingCircle}>
          {searching ? <CircularProgress/> : <div></div>}
        </div>
      </Grid>
    </Grid>
  )
}

export default SearchBarAutocomplete;