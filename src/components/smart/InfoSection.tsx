import { Container, Flex, SimpleGrid, Text } from "@chakra-ui/layout";
import {
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { FunctionalComponent, h } from "preact";
import { TimerHook } from "../../hooks/useTimer";
import { getPercentage } from "../../lib";
import { ABaseQuestionStateName } from "../../lib/redux";
import { useAppSelector } from "../../redux/hooks";

const InfoSection: FunctionalComponent<{
  stateName: ABaseQuestionStateName;
  Timer: TimerHook["Timer"];
}> = (props) => {
  const { children, stateName, Timer } = props;

  const {
    totalCorrectAnswers,
    totalWrongAnswers,
    totalTime,
    isAvgTimeDecreased,
    isCorrectRatioIncreased,
  } = useAppSelector((state) => state[stateName]);

  return (
    <Container mb={8}>
      <SimpleGrid columns={3} spacing={10}>
        <Stat>
          <StatLabel>Correct</StatLabel>
          <StatNumber as="code">
            <Flex align="baseline">
              <span id="correct-answers">{totalCorrectAnswers}</span>
              <Text ml={1} fontSize="xs">
                /{" "}
                <span id="total-answers">
                  {totalCorrectAnswers + totalWrongAnswers}
                </span>
              </Text>
            </Flex>
          </StatNumber>
          <StatHelpText>
            <StatArrow
              type={isCorrectRatioIncreased ? "increase" : "decrease"}
              me={0.5}
            />
            <code>
              {getPercentage(totalCorrectAnswers, totalWrongAnswers).toFixed(1)}
              %
            </code>
          </StatHelpText>
        </Stat>
        <Text
          textAlign="center"
          fontSize="sm"
          opacity={0.8}
          display="flex"
          alignItems="center"
        >
          {children}
        </Text>
        <Stat textAlign="end">
          <StatLabel>Time</StatLabel>
          <StatNumber as="code">
            <Flex align="baseline" justify="end">
              <Timer />
              <Text ml={1} fontSize="xs">
                ms
              </Text>
            </Flex>
          </StatNumber>
          <StatHelpText>
            <code>
              ~
              {(
                totalTime / (totalCorrectAnswers + totalWrongAnswers) || 0
              ).toFixed(0)}
              ms
            </code>
            <StatArrow
              type={isAvgTimeDecreased ? "increase" : "decrease"}
              me={0}
              ms={0.5}
            />
          </StatHelpText>
        </Stat>
      </SimpleGrid>
    </Container>
  );
};

export default InfoSection;
