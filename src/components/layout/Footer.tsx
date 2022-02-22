import { Divider, Link, Text } from "@chakra-ui/layout";
import { FunctionalComponent, h } from "preact";

const Footer: FunctionalComponent = () => {
  return (
    <footer style={{ marginTop: "16px", textAlign: "center" }}>
      <Divider />
      <Text
        as={Link}
        href="https://berkekaragoz.com"
        fontSize="sm"
        py={0.5}
        color="gray.400"
        isTruncated
      >
        berkekaragoz.com © {new Date().getFullYear()}.
      </Text>
    </footer>
  );
};

export default Footer;
