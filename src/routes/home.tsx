import { FunctionalComponent, h } from "preact";
import {
  Button,
  Heading,
  Center,
  SimpleGrid,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Text,
  Flex,
  Container,
} from "@chakra-ui/react";
import { getRandomInt } from "../utils";
import { MouseEventHandler } from "react";
import { useState } from "preact/hooks";
import useTimer from "../components/useTimer";

const itemTime = 30;

const secondsToString = (number: number): string =>
  number.toString().padStart(2, "0");

const generateAnswer = (correctAnswer: number, seed: number): number =>
  (correctAnswer % 10) + seed * 10;

const getPercentage = (first: number, second: number): number =>
  first + second !== 0 ? (first / (first + second)) * 100 : 0;

type AnswerButtonProps = {
  answer: number;
  handler: (answer: number) => MouseEventHandler<HTMLButtonElement> | undefined;
};

const AnswerButton: FunctionalComponent<AnswerButtonProps> = (props) => {
  const { answer, handler } = props;

  return (
    <Button
      colorScheme="purple"
      onClick={handler(answer)}
      height="100%"
      width="100%"
    >
      <Flex align="baseline">
        <Text fontSize="2xl" opacity={0.4}>
          :
        </Text>
        <Text fontSize="2xl">{secondsToString(answer)[0]}</Text>
        <Text fontSize="2xl" opacity={0.4}>
          {secondsToString(answer)[1]}
        </Text>
      </Flex>
    </Button>
  );
};

let ind = 0;

const Home: FunctionalComponent = () => {
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [correctAnswerArrow, setCorrectAnswerArrow] = useState<
    "increase" | "decrease"
  >("increase");
  const { Timer, setTimerState } = useTimer();
  const [askedTime, setAskedTime] = useState<number>(getRandomInt(60));
  const correctAnswer = (askedTime + itemTime) % 60;
  const startTime = new Date();

  const answerHandler = (answer: number) => (): void => {
    if (answer === correctAnswer) {
      setCorrectCount((s) => s + 1);
      setCorrectAnswerArrow("increase");
    } else {
      setWrongCount((s) => s + 1);
      setCorrectAnswerArrow("decrease");
    }
    setAskedTime(getRandomInt(60));
  };

  console.log(
    `Start Time: ${startTime.toISOString()} | Render Count: ${ind++}`,
  );

  return (
    <div>
      <Timer />
      <Center mt={6} mb={12}>
        <Heading size="4xl" onClick={() => setTimerState((s) => !s)}>
          :{secondsToString(askedTime)}
        </Heading>
      </Center>
      <Container mb={12}>
        <SimpleGrid columns={3} spacing={5} minH="240px">
          {Array.from({ length: 6 }, (_, i) => (
            <AnswerButton
              key={`answerButton-${i}`}
              handler={answerHandler}
              answer={generateAnswer(correctAnswer, i)}
            />
          ))}
        </SimpleGrid>
      </Container>
      <Center>
        <StatGroup>
          <SimpleGrid columns={1} spacing={10}>
            <Stat>
              <StatLabel>Correct</StatLabel>
              <StatNumber>
                <Flex align="baseline">
                  {correctCount}
                  <Text ml={0.5} fontSize="xs">
                    / {correctCount + wrongCount}
                  </Text>
                </Flex>
              </StatNumber>
              <StatHelpText>
                <StatArrow type={correctAnswerArrow} />
                {getPercentage(correctCount, wrongCount).toFixed(2)}%
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Clicked</StatLabel>
              <StatNumber>45</StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" />
                9.05%
              </StatHelpText>
            </Stat>
          </SimpleGrid>
        </StatGroup>
      </Center>
    </div>
  );
};

export default Home;

/*
type AnswerButtonProps = ComponentWithAs<
  "button",
  ButtonProps & {
    correct: number;
    answer: number;
  }
>;

const AnswerButton = forwardRef<HTMLButtonElement, AnswerButtonProps>(
  (props, ref) => {
    const { children, onClick, correct, answer } = props;

    const answerHandler = (answer: number) => (): void => {
      if (answer === correct) {
        console.log("Correct!");
      } else {
        console.log("False!");
      }
    };

    return (
      <Button ref={ref} colorScheme="purple" onClick={answerHandler(answer)}>
        {children}
      </Button>
    );
  },
);
*/
