import { makeStyles } from "@material-ui/core/styles";
import { Grid, Link } from "@material-ui/core"

import Logo from "./Logo"
import SearchBar from "./SearchBar"
import SearchBarAutocomplete from "./SearchBarAutocomplete"

const useStyles = makeStyles((theme) => ({
  header: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.secondary,
  },
  search: {
    maxWidth: "300px"
  }
}));

const Header = ({ search = false, address }) => {
  const classes = useStyles()

  return (
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
          {process.env.AUTOCOMPLETE ? <SearchBarAutocomplete address={address} simple inverted/> : <SearchBar address={address} simple inverted/>}
        </Grid>
      )}
    </Grid>
  );
};

export default Header;