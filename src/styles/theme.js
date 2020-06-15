import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

let theme = createMuiTheme({
  palette: {
    logo: {
      main: '#d5c9df'
    },
    primary: {
      main: '#d5c9df',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#ffffff',
    },
  },
});

theme = responsiveFontSizes(theme)

export default theme;