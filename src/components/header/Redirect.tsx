import { Component } from "preact";
import { route } from "preact-router";

interface RedirectProps {
  to: string;
}

export default class Redirect extends Component<RedirectProps> {
  componentWillMount(): void {
    route(this.props.to, true);
  }

  render(): null {
    return null;
  }
}
