import { Button } from "@chakra-ui/button";
import { Center, Container, Divider, Text } from "@chakra-ui/layout";
import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router";

const buttonProps = {
  as: Link,
  colorScheme: "purple",
  size: "lg",
  isFullWidth: true,
  mb: 4,
};

const Homepage: FunctionalComponent<{}> = () => {
  return (
    <Center mb={8}>
      <Container mt={6}>
        <Text textAlign="center" mb={2} fontSize="3xl">
          Training Modes
        </Text>
        <Divider mb={6} />
        <Button href="/simple-stopwatch" {...buttonProps}>
          Simple Stopwatch
        </Button>
        <Text textAlign="center" mb={6} fontSize="lg">
          Add 30 seconds to the given time as fast as you can. This is trained
          to memorize the item pairings and reduce the workload on the brain for
          AFPS players.
        </Text>
        <Button href="/perceptual-speed" {...buttonProps}>
          Perceptual Speed
        </Button>
        <Text textAlign="center" mb={6} fontSize="lg">
          Given a number of pairings by column, count the number of matching
          letters.
        </Text>
        <Button href="/number-speed" {...buttonProps}>
          Number Speed
        </Button>
        <Text textAlign="center" mb={6} fontSize="lg">
          Given some numbers, find the median and select the furthest one from
          it.
        </Text>
      </Container>
    </Center>
  );
};

export default Homepage;
