import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

let theme = createMuiTheme({
  palette: {
    primary: {
      main: "#5B5EA6",
    },
    secondary: {
      main: "#BDBEDB",
    },
    logo: {
      main: "#FFFFFF",
      secondary: "#BDBEDB"
    },
    logoSecondary: {
      main: "#5B5EA6",
      secondary: "#BDBEDB"
    },
    error: {
      main: "#CC0000",
      light: "#FF6666"
    },
    background: {
      default: "#FFFFFF",
      secondary: "#5B5EA6"
    }
  },
});

theme = responsiveFontSizes(theme)

export default theme;