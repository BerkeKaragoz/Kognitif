import { Flex, Heading, Text, Link, Box } from "@chakra-ui/layout";
import { FunctionalComponent, Fragment, h } from "preact";
import { Link as PreactLink } from "preact-router/match";
import { colors } from "../style/theme";

const Header: FunctionalComponent = () => {
  return (
    <Fragment>
      <Flex
        bg={`${colors.primary[400]}cc`} // 0.8 opacity
        position="fixed"
        align="center"
        justify="space-around" //because there are only 2 items atm
        h={50}
        w="100%"
        zIndex={10}
      >
        <Heading size="lg">
          St
          <Text as="code" fontSize="2xl">
            0
          </Text>
          pwatch
        </Heading>
        <nav>
          <Link as={PreactLink} href="/simple">
            Simple Mode
          </Link>
        </nav>
      </Flex>
      <Box pb={50} />
    </Fragment>
  );
};

export default Header;
