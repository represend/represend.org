import Router from "next/router"

import { makeStyles } from "@material-ui/core/styles";
import { Search, MyLocation, Clear } from "@material-ui/icons";
import { Box, Grid, FormControl, FormHelperText, TextField, InputAdornment, IconButton, CircularProgress, Tooltip } from "@material-ui/core";

import { findLocation } from "../util/util";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    maxWidth: "300px"
  },
  input: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 20,
      paddingRight: 14,
      backgroundColor: props => props.inverted && "white",
      '& .MuiInputAdornment-root': {
        marginLeft: 0,
      }
    },
    width: "100%",
    maxWidth: "300px",
    minWidth: "140px"
  },
  helper: {
    color: props => props.inverted ? "white" : "black",
  },
}));

const SearchBar = (props) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(props.address ? props.address : "");
  const [loading, setLoading] = React.useState(false);
  const componentIsMounted = React.useRef(true);
  const toast = props.toast;

  React.useEffect(() => {
    componentIsMounted.current = true;
    return () => {
      componentIsMounted.current = false;
    }
  }, []);

  const handleSearch = () => {
    if (loading) {
      return;
    }
    setLoading(true)
    Router.push({
      pathname: "/search",
      query: { address: value },
    }).finally(() => {
      if (componentIsMounted.current) {
        setLoading(false)
      }
    })
  }

  const handleLocateUser = async () => {
    if (loading) { 
      return
    }
    setLoading(true)
    try {
      const address = await findLocation();
      setValue(address)
      Router.push({
        pathname: "/search",
        query: { address: address },
      }).finally(() => {
        if (componentIsMounted.current) {
          setLoading(false)
        }
      })
    } catch (error) {
      toast(error.message, "error")
      setLoading(false)
    }
  };
  
  return (
    <FormControl variant="outlined">
      <TextField
        className={classes.input}
        variant="outlined"
        placeholder="San Francisco, Los Angeles, New York, ..."
        value={value}
        onChange={(event) => {
          setValue(event.target.value)
        }}
        onKeyPress={(event) => {
          if (event.key==="Enter") {
            handleSearch();
            event.preventDefault();
          };
        }}
        InputProps={{
          endAdornment: 
            <InputAdornment position="end">
              <Tooltip title="Search">
                <IconButton
                  aria-label="search"
                  onClick={handleSearch}
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
      {!props.simple && <FormHelperText className={classes.helper}>Find with City, County, or Zip Code</FormHelperText>}
    </FormControl>
  )
}

export default SearchBar;