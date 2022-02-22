import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";

import SimpleStopwatch from "./pages/SimpleStopwatch";
import NotFoundPage from "./pages/notfound";
import Counter from "./pages/Counter";
import Header from "./components/layout/Header";
import { ChakraProvider } from "@chakra-ui/react";

import theme from "./style/theme";

import { store } from "./redux/store";
import { Provider } from "react-redux";
import { KeyboardProvider } from "./contexts/Keyboard";
import PerceptualSpeed from "./pages/PerceptualSpeed";
import NumberSpeed from "./pages/NumberSpeed";
import Homepage from "./pages/Homepage";
import Footer from "./components/layout/Footer";

const Main: FunctionalComponent = () => {
  return (
    <Provider store={store}>
      <KeyboardProvider>
        <div
          id="preact_root"
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <ChakraProvider theme={theme}>
            <Header />
            <main
              style={{
                flexGrow: 1,
              }}
            >
              <Router>
                <Route path="/" component={Homepage} />
                <Route path="/counter" component={Counter} />
                <Route path="/simple-stopwatch" component={SimpleStopwatch} />
                <Route path="/perceptual-speed" component={PerceptualSpeed} />
                <Route path="/number-speed" component={NumberSpeed} />
                <NotFoundPage default />
              </Router>
            </main>
            <Footer />
          </ChakraProvider>
        </div>
      </KeyboardProvider>
    </Provider>
  );
};

export default Main;
