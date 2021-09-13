import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";

import SimpleMode from "./routes/SimpleMode";
import Profile from "./routes/profile";
import NotFoundPage from "./routes/notfound";
import Counter from "./routes/Counter";
import Header from "./components/header";
import { ChakraProvider } from "@chakra-ui/react";

import theme from "./style/theme";

import { store } from "./redux/store";
import { Provider } from "react-redux";
import Redirect from "./components/header/Redirect";

const Main: FunctionalComponent = () => {
  return (
    <Provider store={store}>
      <div id="preact_root">
        <ChakraProvider theme={theme}>
          <Header />
          <Router>
            <Redirect path="/" to="/simple" />
            <Route path="/simple" component={SimpleMode} />
            <Route path="/counter" component={Counter} />
            <Route path="/profile/" component={Profile} user="me" />
            <Route path="/profile/:user" component={Profile} />
            <NotFoundPage default />
          </Router>
        </ChakraProvider>
      </div>
    </Provider>
  );
};

export default Main;
