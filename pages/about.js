import { Container, Typography } from "@material-ui/core"
import Layout from "../src/components/Layout"
import Logo from "../src/components/Logo"

const About = (props) => {
  return (
    <Layout>
      <Container maxWidth="sm">
        <br/>
        <Typography variant="h4">
          What is <Logo color="secondary"/>?
        </Typography>
        <br/>
        <Typography variant="body1">
          Send demands directly to your representatives. Build campaigns with your community. Use your voice and take action.
          Find your representatives and send templated emails or create your own campaign. Either way, <Logo color="secondary"/> has your back.
        </Typography>
      </Container>
    </Layout>
  )
}

export default About