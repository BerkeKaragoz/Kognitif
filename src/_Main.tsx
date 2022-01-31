import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";

import SimpleStopwatch from "./pages/SimpleStopwatch";
import NotFoundPage from "./pages/notfound";
import Counter from "./pages/Counter";
import Header from "./components/Header";
import { ChakraProvider } from "@chakra-ui/react";

import theme from "./style/theme";

import { store } from "./redux/store";
import { Provider } from "react-redux";
import Redirect from "./components/Redirect";
import { KeyboardProvider } from "./contexts/Keyboard";
import PerceptualSpeed from "./pages/PerceptualSpeed";
import NumberSpeed from "./pages/NumberSpeed";

const Main: FunctionalComponent = () => {
  return (
    <Provider store={store}>
      <KeyboardProvider>
        <div id="preact_root">
          <ChakraProvider theme={theme}>
            <Header />
            <Router>
              <Redirect path="/" to="/simple-stopwatch" />
              <Route path="/counter" component={Counter} />
              <Route path="/simple-stopwatch" component={SimpleStopwatch} />
              <Route path="/perceptual-speed" component={PerceptualSpeed} />
              <Route path="/number-speed" component={NumberSpeed} />
              <NotFoundPage default />
            </Router>
          </ChakraProvider>
        </div>
      </KeyboardProvider>
    </Provider>
  );
};

export default Main;
