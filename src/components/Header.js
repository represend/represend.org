import { makeStyles } from "@material-ui/core/styles";
import { Grid, Link, Divider } from "@material-ui/core"

import Logo from "./Logo"
import SearchBar from "./SearchBar"
import SearchBarAutocomplete from "./SearchBarAutocomplete"

const useStyles = makeStyles((theme) => ({
  header: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.secondary,
  },
  search: {
    maxWidth: "300px",
    paddingRight: theme.spacing(0),
    paddingLeft: theme.spacing(1)
  },
  divider: {
    margin: "0 30% 0 30%",
    height: "0.8px",
    backgroundColor: "black"
  }
}));

const Header = ({ search = false, address }) => {
  const classes = useStyles()

  return (
    <div>
    <Grid container
      className={classes.header}
      direction="row" 
      justify="center"
      alignItems="center"
    >
      <Grid item>
        <Link href="/" underline="none">
          <Logo variant="h4"/>
        </Link>
      </Grid>
      {search && (
        <Grid className={classes.search} item xs>
          {process.env.AUTOCOMPLETE ? <SearchBarAutocomplete address={address} simple/> : <SearchBar address={address} simple/>}
        </Grid>
      )}
    </Grid>
    <Divider className={classes.divider}/>
    </div>
  );
};

export default Header;