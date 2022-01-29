import { ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, Heading, Text, Link, Box, LinkBox } from "@chakra-ui/layout";
import { Menu, MenuButton, Button, MenuList, MenuItem } from "@chakra-ui/react";
import { FunctionalComponent, Fragment, h } from "preact";
import { colors } from "../style/theme";
import AppLink from "./AppLink";

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
        <Heading size="lg">Kognitif</Heading>
        <nav>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Modes
            </MenuButton>
            <MenuList>
              <MenuItem as={Link} href="/simple">
                Simple Stopwatch
              </MenuItem>
              <MenuItem as={Link} href="/perceptual-speed">
                Perceptual Speed
              </MenuItem>
            </MenuList>
          </Menu>
        </nav>
      </Flex>
      <Box pb={50} />
    </Fragment>
  );
};

export default Header;
