import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";

import Home from "./routes/home";
import Profile from "./routes/profile";
import NotFoundPage from "./routes/notfound";
import Header from "./components/header";
import { ChakraProvider } from "@chakra-ui/react";

import theme from "./style/theme";

const Main: FunctionalComponent = () => {
  return (
    <div id="preact_root">
      <ChakraProvider theme={theme}>
        <Header />
        <Router>
          <Route path="/" component={Home} />
          <Route path="/profile/" component={Profile} user="me" />
          <Route path="/profile/:user" component={Profile} />
          <NotFoundPage default />
        </Router>
      </ChakraProvider>
    </div>
  );
};

export default Main;
