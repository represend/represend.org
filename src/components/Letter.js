import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Button, Link, FormControlLabel, Switch } from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";

const useStyles = makeStyles((theme) => ({
  body: {
    fontFamily: "inherit",
    margin: theme.spacing(0)
  },
  switch: {
    marginLeft: "auto",
    marginRight: 0,
  }
}));

const Letter = ({ division, officials, emails, url, toast }) => {
  const classes = useStyles();

  const [showNames, setShowNames] = React.useState(false)

  const subject = "placeholder subject"
  const body = "placeholder body\nthis is the second line\nand third"

  const sendMail = () => {
    const mailtoBody = body.replace("\n", "%0D%0A")
    return `mailto:${emails}?subject=${subject}&body=${mailtoBody}`
  }

  return (
    <Grid container spacing={3} alignItems="center">
      <Grid item xs={12}>
        <Typography variant="h4">
          {division} 📍
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container direction="row" justify="space-between">
          <Typography variant="body1">
            <strong>To: </strong>
          </Typography>
          <FormControlLabel
            className={classes.switch}
            control={
              <Switch
                checked={showNames}
                onChange={() => {setShowNames((prev) => !(prev))}}
                name="showNames"
                color="primary"
                size="small"
              />
            }
            label="Names"
          />
        </Grid>
        <Typography variant="body1">
          {showNames ? officials : emails}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">
          <strong>Subject: </strong> 
          {subject}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">
          <strong>
            Message:
          </strong>
        </Typography>
        <Typography component="pre" variant="body1">
          {body}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Link href={sendMail()}>
          <Button size="large" fullWidth>
            Send 🚀
          </Button>
        </Link>
      </Grid>
      <Grid item xs={6}>
        <CopyToClipboard text={url}>
          <Button size="large" onClick={() => {toast("URL Copied to Clipboard", "success")}} fullWidth>
            Share 🌎
          </Button>
        </CopyToClipboard>
      </Grid>
    </Grid>
  );
};

export default Letter