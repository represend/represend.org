import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Button, Link } from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";

const useStyles = makeStyles((theme) => ({
  body: {
    fontFamily: "inherit"
  }
}));

const Letter = ({ district, emails, url }) => {
  const classes = useStyles();

  const subject = "placeholder subject"
  const body = "placeholder body\nthis is the second line\nand third"

  function sendMail() {
    const mailtoBody = body.replace("\n", "%0D%0A")
    return `mailto:${emails}?subject=${subject}&body=${mailtoBody}`
  }

  return (
    <Grid container spacing={3} alignItems="center">
      <Grid item xs={12}>
        <Typography variant="h4">
          {district} 📍
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">
          <strong>To: </strong>
          {emails}
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
        <strong>Message: </strong>
        <pre className={classes.body}>
          {body}
        </pre>
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
          <Button size="large" fullWidth>
            Share 🌎
          </Button>
        </CopyToClipboard>
      </Grid>
    </Grid>
  );
};

export default Letter