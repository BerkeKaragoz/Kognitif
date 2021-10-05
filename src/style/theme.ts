import {
  extendTheme,
  ThemeComponents,
  ThemeConfig,
  ThemeDirection,
} from "@chakra-ui/react";
import { Dict } from "@chakra-ui/utils";
import { mode, Styles } from "@chakra-ui/theme-tools";

const components: ThemeComponents = {};

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const direction: ThemeDirection = "ltr";

const styles: Styles = {
  global: (props) => ({
    "html, body": {
      height: "100%",
      width: "100%",
      padding: "0",
      margin: "0",
      background: mode("gray.50", "gray.900")(props),
      color: mode("gray.900", "gray.50")(props),
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    },
    "*": {
      boxSizing: "border-box",
    },
    a: {
      color: mode("teal.300", "teal.500")(props),
    },
  }),
};

export const colors = {
  primary: {
    50: "#f2eaff",
    100: "#d4c4f1",
    200: "#b69ee2",
    300: "#9977d5",
    400: "#7c51c8",
    500: "#6237ae",
    600: "#4c2b89",
    700: "#361e63",
    800: "#21113d",
    900: "#0d041a",
  },
};

const theme: Dict = {
  components,
  config,
  direction,
  colors,
  styles,
};

export default extendTheme(theme);
