import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  title1: {
    color: props => {
      if (props.color === "primary") return theme.palette.logo.main
      if (props.color === "secondary") return theme.palette.logoSecondary.main
      if (props.color === "white") return "white"
      if (props.color === "black") return "black"
      return theme.palette.logo.main
    },
  },
  title2: {
    color: props => {
      if (props.color === "primary") return theme.palette.logo.secondary
      if (props.color === "secondary") return theme.palette.logoSecondary.secondary
      if (props.color === "white") return "white"
      if (props.color === "black") return "black"
      return theme.palette.logo.secondary
    },
  }
}));

const Logo = ({ variant, color }) => {
  const classes = useStyles({ color: color })

  return (
    <Typography variant={variant ? variant : "inherit"} color="inherit" align="center">
      <span className={classes.title1}>
        repre
      </span>
      <span className={classes.title2}>
        send
      </span>
      <span className={classes.title1}>
        .org
      </span>
    </Typography>
  )
}

export default Logo