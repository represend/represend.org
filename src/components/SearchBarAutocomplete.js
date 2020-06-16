import Router from "next/router"
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Search, MyLocation, Clear } from "@material-ui/icons";
import { Box, Grid, FormControl, FormHelperText, InputAdornment, IconButton, CircularProgress, Typography, TextField, Tooltip } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab"

import { findLocation } from "../util/util";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY

const useStyles = makeStyles((theme) => ({
  searchbar: {
    padding: theme.spacing(1)
  },
  form: {
    width: "100%",
    maxWidth: "300px",
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1)
  },
  input: {
    ['& [class*="MuiOutlinedInput-root"]']: {
      '& fieldset': {
      },
      '&:hover fieldset': {
      },
      '&.Mui-focused fieldset': {
      },
      borderRadius: 20,
      paddingRight: 14,
      backgroundColor: props => props.inverted ? "white" : "black",
    },
    width: "100%",
    maxWidth: "300px"
  },
  helper: {
    color: props => props.inverted ? "white" : "black",
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
  const classes = useStyles(props);
  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState(props.address ? props.address : null);
  const [inputValue, setInputValue] = React.useState(props.address ? props.address : "");
  const [options, setOptions] = React.useState([]);
  const loaded = React.useRef(false);
  const componentIsMounted = React.useRef(true);
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

  const fetch = React.useMemo(() => throttle((request, callback) => {
      autocompleteService.current.getPlacePredictions(request, callback);
    }, 200), [], );

  React.useEffect(() => {
    componentIsMounted.current = true;
    return () => {
      componentIsMounted.current = false;
    }
  }, []);

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
    if (loading) {
      return;
    }
    setLoading(true)
    try {
      Router.push({
        pathname: "/search",
        query: { address: query },
      }).finally(() => {
        if (componentIsMounted.current) {
          setLoading(false)
        }
      });
    } catch (error) {
      toast(error.message, "error")
      setLoading(false)
    }
  }

  const handleLocateUser = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const address = await findLocation();
      setValue(address)
      setInputValue(address)
      Router.push({
        pathname: "/search",
        query: { address: address },
      }).finally(() => {
        if (componentIsMounted.current) {
          setLoading(false)
        }
      });
    } catch (error) {
      toast(error.message, "error")
      setLoading(false)
    }
  };
  
  return (
    <FormControl className={classes.form} variant="outlined">
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
          handleSearch(newValue.description ? newValue.description : newValue)
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            className={classes.input}
            variant="outlined"
            placeholder="San Francisco, Los Angeles, New York, ..."
            InputProps={{
              ...params.InputProps,
              endAdornment:
                <InputAdornment position="end">
                  <Tooltip title="Search">
                    <IconButton
                      aria-label="search"
                      onClick={() => {
                        handleSearch(inputValue)
                      }}
                      edge="end"
                    >
                      <Search/>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={loading ? "Cancel" : "Find Me"}>
                    <IconButton
                      aria-label="action-icons"
                      onClick={loading ? (() => {setLoading(false)}) : handleLocateUser}
                      edge="end"
                    >
                      {loading ? (
                        <Box position="relative" display="inline-flex">
                          <CircularProgress size={24}/>
                          <Box
                            top={0}
                            left={0}
                            bottom={0}
                            right={0}
                            position="absolute"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Clear/>
                          </Box>
                        </Box>
                      ) : (
                        <MyLocation/>
                      )}
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
            }}
          />
        )}
        renderOption={(option) => {
          const matches = option.structured_formatting.main_text_matched_substrings;
          const parts = parse(
            option.structured_formatting.main_text,
            matches.map((match) => [match.offset, match.offset + match.length]),
          );

          return (
            <div style={{flexGrow: 1}}>
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <Typography>
                  {parts.map((part, index) => (
                    <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                      {part.text}
                    </span>
                  ))}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" color="textSecondary">
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>
            </div>
          );
        }}
      />
      {!props.simple && <FormHelperText className={classes.helper}>Find with City, County, or Zip Code</FormHelperText>}
    </FormControl>
  )
}

export default SearchBarAutocomplete;