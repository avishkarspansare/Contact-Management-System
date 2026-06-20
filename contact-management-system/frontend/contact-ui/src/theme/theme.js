import { createTheme } from "@mui/material/styles";

/**
 * Custom MUI theme for the Contact Management System.
 *
 * Palette rationale:
 *  - primary (terracotta): warm, distinct from MUI's default blue,
 *    evokes "connection" without leaning on a corporate-tech cliché.
 *  - background: warm off-white instead of stark white, easier on the
 *    eyes for a screen people will look at repeatedly during a CRUD workflow.
 *  - slate: used for the header/nav, anchors the warm accent with something cool.
 */
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#C77B5E",
      light: "#DDA088",
      dark: "#A8603F",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#1A2332",
      light: "#2E3B52",
      dark: "#0F1620",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#4A7862",
    },
    error: {
      main: "#B85450",
    },
    background: {
      default: "#FAF9F6",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A2332",
      secondary: "#5C6470",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    h1: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 },
    h2: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 },
    h3: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 },
    h4: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 },
    h5: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 },
    h6: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 },
    button: { fontWeight: 600, textTransform: "none" },
  },
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          paddingInline: 18,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
