import Link from "next/link"

import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  header: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.white,
  },
}));

const Header = ({title}) => {
  const classes = useStyles()

  return (
    <Container className={classes.header} maxWidth="sm">
      <Link href="/">
        <Typography variant="h4" color="inherit" align="center">
              {title ? title : "Represend 📣"}
        </Typography>
      </Link>
    </Container>
  );
};

export default Header;