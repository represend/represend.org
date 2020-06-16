import { makeStyles } from "@material-ui/core/styles";
import { ExpandMore } from "@material-ui/icons"
import { 
  Grid, 
  Typography, 
  Button, 
  Link, 
  Switch, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogActions, 
  DialogContent, 
  FormControl,
  FormControlLabel, 
  FormHelperText, 
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";

const useStyles = makeStyles((theme) => ({
  body: {
    fontFamily: "inherit",
    margin: theme.spacing(0)
  },
  switchLeft: {
    marginLeft: "auto",
    marginRight: 0,
  },
  switchRight: {
    marginLeft: 0,
    marginRight: "auto",
  },
  copy : {
    cursor: "pointer"
  },
  letterFont: {
    fontFamily: theme.typography.letter
  }
}));

// Probably a better way to do this but I'm not good at regex
const updateTags = (tags, text) => {
  const keys = Object.keys(tags);
  let newText = text
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const pattern = new RegExp(`\\[${key}\\]`, "g")
    const value = tags[key].trim() != "" ? tags[key].trim() : `[${key}]`
    newText = newText.replace(pattern, value)
  }
  return newText
}

const formatEmail = (text, htmlEncode = false) => {
  if (htmlEncode) {
    return text.replace(/\r?\n/g, "<br/>")
  }
  return encodeURIComponent(text)
}

const Letter = ({ title, subtitle, officials, emails, subject, body, tags, url, htmlEncoding, toast }) => {
  const classes = useStyles();
  const [showNames, setShowNames] = React.useState(false);
  const [htmlEncode, setHtmlEncode] = React.useState(htmlEncoding ? htmlEncoding : false)
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [tagValues, setTagValues] = React.useState({});
  const [mailSubject, setMailSubject] = React.useState(formatEmail(subject, htmlEncoding))
  const [mailBody, setMailBody] = React.useState(formatEmail(body, htmlEncoding))
  const [mailSubjectDisplay, setMailSubjectDisplay] = React.useState(subject)
  const [mailBodyDisplay, setMailBodyDisplay] = React.useState(body)

  const handleDialogChange = (key, value) => {
    let newTagValues = tagValues
    newTagValues[key] = value;
    let newMailSubject = updateTags(tagValues, subject);
    let newMailBody = updateTags(tagValues, body);
    setTagValues(newTagValues);
    setMailSubject(formatEmail(newMailSubject, htmlEncode));
    setMailBody(formatEmail(newMailBody, htmlEncode));
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
        <Typography variant="body2" color="textSecondary">
          {subtitle}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container direction="row" justify="space-between">
          <Typography>
            <CopyToClipboard className={classes.copy} onCopy={() => {toast(`${showNames ? "Names" : "Emails"} Copied to Clipboard`, "success")}} text={showNames ? officials : emails}>
              <b>To 🔗</b>
            </CopyToClipboard>
          </Typography>
          <FormControlLabel
            className={classes.switchLeft}
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
            labelPlacement="start"
          />
        </Grid>
        <Typography className={classes.letterFont}>
          {showNames ? officials : emails}
        </Typography>
      </Grid>
      <Grid item xs={12}>
          <Typography>
            <CopyToClipboard className={classes.copy} onCopy={() => {toast("Subject Copied to Clipboard", "success")}}  text={subject}>
              <b>Subject 🔗</b> 
            </CopyToClipboard>
          </Typography>
        <Typography className={classes.letterFont}>
          {subject}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography>
          <CopyToClipboard className={classes.copy} onCopy={() => {toast("Message Copied to Clipboard", "success")}} text={body}>
            <b>Message 🔗</b>
          </CopyToClipboard>
        </Typography>
        <Typography className={classes.letterFont}>
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
        <CopyToClipboard onCopy={() => {toast("URL Copied to Clipboard", "success")}} text={url}>
          <Button size="large" fullWidth>
            Share 🌎
          </Button>
        </CopyToClipboard>
      </Grid>
    </Grid>
    <Dialog open={dialogOpen} onClose={handleDialogClose}>
      <DialogTitle>Complete Fields ✏️</DialogTitle>
      <DialogContent>
        <Typography>
          Filling out these values will automatically populate the email. If you choose to send without filling out this form, make sure to replace the [X]'s with your own values!
        </Typography>
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
        <Typography>
          <br/>
          <CopyToClipboard className={classes.copy} onCopy={() => {toast("Subject Copied to Clipboard", "success")}}  text={mailSubjectDisplay}>
            <b>Subject 🔗</b> 
          </CopyToClipboard>
         </Typography>
         <Typography className={classes.letterFont}>
          {mailSubjectDisplay}
        </Typography>
        <Typography>
          <br/>
          <CopyToClipboard className={classes.copy} onCopy={() => {toast("Message Copied to Clipboard", "success")}}  text={mailBodyDisplay}>
            <b>Message 🔗</b> 
          </CopyToClipboard>
        </Typography>
        <Typography className={classes.letterFont}>
          {mailBodyDisplay.split(/\r?\n/g).map((part, index) => {
            return (
              <span key={index}>
                {part}
                <br/>
              </span>
            )
          })}
        </Typography>
        <br/>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
            <Typography>Advanced</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <FormControl>
              <FormControlLabel
                className={classes.switchRight}
                control={
                  <Switch
                    checked={htmlEncode}
                    onChange={() => {setHtmlEncode((prev) => !(prev))}}
                    name="htmlEncode"
                    color="primary"
                    size="small"
                  />
                }
                label="HTML Email Encoding"
                labelPlacement="end"
              />
              <FormHelperText>We try to either encode emails on RFC 6068 standards or HTML based on your device.</FormHelperText>
            </FormControl>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </DialogContent>
      <DialogActions>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Link href={`mailto:${emails}?subject=${mailSubject}&body=${mailBody}`} target="_blank" underline="none">
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