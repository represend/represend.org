import Link from "next/link"

import { makeStyles } from "@material-ui/core/styles";
import { Grid, Divider } from "@material-ui/core"

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
  },
  link: {
    cursor: "pointer"
  }
}));

const Header = ({ search = false, address }) => {
  const classes = useStyles()

  const LogoRef = React.forwardRef((props, ref) => {
    return (
      <div ref={ref} {...props}>
        <Logo variant="h4"/>
      </div>
    )
  })

  return (
    <div>
    <Grid container
      className={classes.header}
      direction="row" 
      justify="center"
      alignItems="center"
    >
      <Grid className={classes.link} item>
        <Link href="/" passHref>
          <LogoRef/>
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