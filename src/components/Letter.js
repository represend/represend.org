import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Button, Link, FormControlLabel, Switch, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
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

// Probably a better way to do this but I'm not good at regex
const updateTags = (tags, text) => {
  const keys = Object.keys(tags);
  let newText = text
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const pattern = new RegExp(`\\[${key}\\]`, "g")
    const value = tags[key] != "" ? tags[key] : `[${key}]`
    newText = newText.replace(pattern, value)
  }
  return newText
}

const formatEmail = (text) => {
  return text.replace(/\r?\n/g, "%0D%0A").replace(/\s/g, "%20")
}

const Letter = ({ title, officials, emails, subject, body, tags, url, toast }) => {
  const classes = useStyles();
  const [showNames, setShowNames] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [tagValues, setTagValues] = React.useState({});
  const [mailSubject, setMailSubject] = React.useState(encodeURIComponent(subject))
  const [mailBody, setMailBody] = React.useState(encodeURIComponent(body))
  const [mailSubjectDisplay, setMailSubjectDisplay] = React.useState(subject)
  const [mailBodyDisplay, setMailBodyDisplay] = React.useState(body)

  const handleDialogChange = (key, value) => {
    let newTagValues = tagValues
    newTagValues[key] = value;
    let newMailSubject = updateTags(tagValues, subject);
    let newMailBody = updateTags(tagValues, body);
    setTagValues(newTagValues);
    setMailSubject(encodeURIComponent(newMailSubject));
    setMailBody(encodeURIComponent(newMailBody));
    setMailSubjectDisplay(newMailSubject)
    setMailBodyDisplay(newMailBody);
  }

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <div>
    <Grid container spacing={3} alignItems="center">
      <Grid item xs={12}>
        <Typography variant="h4">
          {title} 📍
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container direction="row" justify="space-between">
          <Typography variant="body1">
            <b>To: </b>
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
          <b>Subject: </b> 
          <br/>
          {subject}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">
          <b>Message: </b>
        </Typography>
        <Typography variant="body1">
          {body.split(/\r?\n/g).map((part, index) => {
            return (
              <span key={index}>
                {part}
                <br/>
              </span>
            )
          })}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Button size="large" onClick={handleDialogOpen} fullWidth>
          Send 🚀
        </Button>
      </Grid>
      <Grid item xs={6}>
        <CopyToClipboard text={url}>
          <Button size="large" onClick={() => {toast("URL Copied to Clipboard", "success")}} fullWidth>
            Share 🌎
          </Button>
        </CopyToClipboard>
      </Grid>
    </Grid>
    <Dialog open={dialogOpen} onClose={handleDialogClose}>
      <DialogTitle>Complete Fields ✏️</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Filling out these values will automatically populate the email. If you choose to send without filling out this form, make sure to replace the [X]'s with your own values!
        </DialogContentText>
        {tags.map((key, index) => {
          return (
            <TextField
              key={`${key}-${index}`}
              variant="outlined"
              margin="normal"
              id={key}
              label={key}
              onChange={(event) => {
                handleDialogChange(key, event.target.value)
              }}
              fullWidth
            />
          )
        })}
        <DialogContentText>
          <br/>
          <b>Subject: </b>
          <br/>
          {mailSubjectDisplay}
        </DialogContentText>
        <DialogContentText>
          <b>Message: </b>
          <br/>
          {mailBodyDisplay.split(/\r?\n/g).map((part, index) => {
            return (
              <span key={index}>
                {part}
                <br/>
              </span>
            )
          })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Link href={`mailto:${emails}?subject=${mailSubject}&body=${mailBody}`} underline="none">
              <Button size="large" fullWidth>
                Send 🚀
              </Button>
            </Link>
          </Grid>
          <Grid item xs={6}>
            <Button size="large" onClick={handleDialogClose} fullWidth>
              Cancel ❌
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
    </div>
  );
};

export default Letter