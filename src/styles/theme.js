import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

let theme = createMuiTheme({
  typography: {
    fontFamily: "Noto, sans-serif",
    letter: "Noto Serif, serif",
  },
  palette: {
    primary: {
      main: "#3579DC",
    },
    secondary: {
      main: "#FFFFFF",
    },
    logo: {
      main: "#000000",
      secondary: "#959595"
    },
    logoSecondary: {
      main: "#000000",
      secondary: "#959595"
    },
    error: {
      main: "#CC0000",
      light: "#FF6666"
    },
    background: {
      default: "#FFFFFF",
      secondary: "#FFFFFF"
    }
  },
});

theme = responsiveFontSizes(theme)

export default theme;