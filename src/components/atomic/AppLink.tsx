import { Link, LinkProps } from "@chakra-ui/layout";
import { FunctionalComponent, h } from "preact";
import {
  Link as PreactLink,
  LinkProps as PreactLinkProps,
} from "preact-router/match";

const AppLink: FunctionalComponent<PreactLinkProps & LinkProps> = (props) => {
  const { children, ...rest } = props;

  return (
    <Link as={PreactLink} {...rest}>
      {children}
    </Link>
  );
};

export default AppLink;
