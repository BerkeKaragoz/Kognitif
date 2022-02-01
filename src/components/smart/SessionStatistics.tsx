import { CheckCircleIcon } from "@chakra-ui/icons";
import { Container } from "@chakra-ui/layout";
import {
  Table,
  TableCaption,
  TableProps,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/table";
import { FunctionalComponent, h, VNode } from "preact";
import { AnswerEntity, AnswerSelectors, BaseAnswerData } from "../../lib/redux";
import { useAppSelector } from "../../redux/hooks";
import CircleIcon from "../atomic/CircleIcon";

const SessionStatistics: FunctionalComponent<{
  selectors: AnswerSelectors;
  tableSize?: TableProps["size"];
  AdditionalTh?: VNode;
  AdditionalTd?: (answer: AnswerEntity<BaseAnswerData>) => VNode;
}> = (props) => {
  const {
    selectors,
    tableSize = "sm",
    AdditionalTh,
    AdditionalTd = () => {},
  } = props;

  const answerList = useAppSelector(selectors.selectAll);

  return (
    <Container pb={8}>
      <Table variant="simple" size={tableSize}>
        <TableCaption>Session Statistics</TableCaption>
        <Thead>
          <Tr>
            <Th>#</Th>
            <Th>✓</Th>
            {AdditionalTh}
            <Th isNumeric>A</Th>
            <Th isNumeric>ms</Th>
          </Tr>
        </Thead>
        <Tbody>
          {
            //TODO make as a component & virtualize & minimize
            answerList
              .slice()
              .reverse()
              .map((a) => (
                <Tr>
                  <Td>
                    <i>{a.id + 1}</i>
                  </Td>
                  <Td>
                    {a.isCorrect ? (
                      <CheckCircleIcon color="green.500" />
                    ) : (
                      <CircleIcon color="red.500" />
                    )}
                  </Td>
                  {AdditionalTd(a)}
                  <Td isNumeric>
                    <b>{a.givenAnswer}</b>
                  </Td>
                  <Td isNumeric>
                    <code>{a.answerTime}</code>
                  </Td>
                </Tr>
              ))
          }
        </Tbody>
      </Table>
    </Container>
  );
};

export default SessionStatistics;
