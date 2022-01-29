/// <reference types="cypress" />

describe("Simple Mode Test", () => {
  before(() => {
    cy.visit("/simple");
  });

  it("Has a title", () => {
    cy.contains("Kognitif");
  });

  it("Has an item time", () => {
    cy.get("#item-time").then(($itemTime) => {
      const itemTime = parseInt($itemTime.text());
      assert.isNotNaN(itemTime);
    });
  });

  it("Has question statistics", () => {
    cy.get("#correct-answers").then(($correctAnswers) => {
      const correctAnswers = parseInt($correctAnswers.text());
      assert.isNotNaN(correctAnswers);
    });

    cy.get("#total-answers").then(($totalAnswers) => {
      const totalAnswers = parseInt($totalAnswers.text());
      assert.isNotNaN(totalAnswers);
    });
  });

  it("Can ask a question", () => {
    cy.get("#question").then(($question) => {
      const question = parseInt($question.text());
      assert.isNotNaN(question);
    });
  });

  it("Can answer incorrectly", () => {
    cy.get("#question").then(($question) => {
      const question = parseInt($question.text());

      cy.get("#item-time").then(($itemTime) => {
        const itemTime = parseInt($itemTime.text());

        const wrongAnswer = (question + itemTime + 10) % 60;

        cy.get("#correct-answers").should("have.text", "0");
        cy.get("#total-answers").should("have.text", "0");

        cy.get(
          "#answer-button-" + wrongAnswer.toString().padStart(2, "0")[0],
        ).click();

        cy.get("#correct-answers").should("have.text", "0");
        cy.get("#total-answers").should("have.text", "1");
      });
    });
  });

  it("Can answer correctly", () => {
    cy.get("#question").then(($question) => {
      const question = parseInt($question.text());

      cy.get("#item-time").then(($itemTime) => {
        const itemTime = parseInt($itemTime.text());

        const correctAnswer = (question + itemTime) % 60;

        cy.get("#correct-answers").should("have.text", "0");
        cy.get("#total-answers").should("have.text", "1");

        cy.get(
          "#answer-button-" + correctAnswer.toString().padStart(2, "0")[0],
        ).click();

        cy.get("#correct-answers").should("have.text", "1");
        cy.get("#total-answers").should("have.text", "2");
      });
    });
  });

  //
});
