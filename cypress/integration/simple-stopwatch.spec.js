/// <reference types="cypress" />

const dataTestId = require("../support").dataTestId;

describe("Simple Stopwatch Test", () => {
  before(() => {
    cy.visit("/simple-stopwatch");
  });

  it("Has a title", () => {
    cy.checkTitle();
  });

  it("Has an item time", () => {
    cy.get(dataTestId("item-time")).then(($itemTime) => {
      const itemTime = parseInt($itemTime.text());
      assert.isNotNaN(itemTime);
    });
  });

  it("Has question statistics", () => {
    cy.get(dataTestId("correct-answers")).then(($correctAnswers) => {
      const correctAnswers = parseInt($correctAnswers.text());
      assert.isNotNaN(correctAnswers);
    });

    cy.get(dataTestId("total-answers")).then(($totalAnswers) => {
      const totalAnswers = parseInt($totalAnswers.text());
      assert.isNotNaN(totalAnswers);
    });
  });

  it("Can ask a question", () => {
    cy.get(dataTestId("question")).then(($question) => {
      const question = parseInt($question.text());
      assert.isNotNaN(question);
    });
  });

  it("Can answer incorrectly", () => {
    cy.get(dataTestId("question")).then(($question) => {
      const question = parseInt($question.text());

      cy.get(dataTestId("item-time")).then(($itemTime) => {
        const itemTime = parseInt($itemTime.text());

        const wrongAnswer = (question + itemTime + 10) % 60;

        cy.get(dataTestId("correct-answers")).should("have.text", "0");
        cy.get(dataTestId("total-answers")).should("have.text", "0");

        cy.get(
          dataTestId(
            `answer-button-${wrongAnswer.toString().padStart(2, "0")[0]}`,
          ),
        ).click();

        cy.get(dataTestId("correct-answers")).should("have.text", "0");
        cy.get(dataTestId("total-answers")).should("have.text", "1");
      });
    });
  });

  it("Can answer correctly", () => {
    cy.get(dataTestId("question")).then(($question) => {
      const question = parseInt($question.text());

      cy.get(dataTestId("item-time")).then(($itemTime) => {
        const itemTime = parseInt($itemTime.text());

        const correctAnswer = (question + itemTime) % 60;

        cy.get(dataTestId("correct-answers")).should("have.text", "0");
        cy.get(dataTestId("total-answers")).should("have.text", "1");

        cy.get(
          dataTestId(
            `answer-button-${correctAnswer.toString().padStart(2, "0")[0]}`,
          ),
        ).click();

        cy.get(dataTestId("correct-answers")).should("have.text", "1");
        cy.get(dataTestId("total-answers")).should("have.text", "2");
      });
    });
  });

  //
});
