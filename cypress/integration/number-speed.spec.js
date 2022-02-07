/// <reference types="cypress" />

const dataTestId = require("../support").dataTestId;
const getMedian = require("../../src/lib/index").getMedian;

describe("Number Speed Test", () => {
  before(() => {
    cy.visit("/number-speed");
  });

  it("Has a title", () => {
    cy.checkTitle();
  });

  it("Can ask questions", () => {
    cy.get(dataTestId("question-list"))
      .children()
      .should("have.length.at.least", 3);
  });

  it("Can give an answer", () => {
    cy.get(dataTestId("total-answers")).should("have.text", "0");
    cy.get(dataTestId("answer-button-0")).click();
    cy.get(dataTestId("total-answers")).should("have.text", "1");
  });

  //testing incorrect asnwers maybe added later
  it("Can answer correctly", () => {
    cy.get(dataTestId("question-list"))
      .children()
      .then(($elList) => {
        const numbers = [];

        for (const el of $elList) {
          const num = parseInt(el.textContent);
          assert.isNotNaN(num);
          numbers.push(num);
        }

        let min = Math.min.apply(Math, numbers);
        const median = getMedian(numbers); //jic length changes
        const max = Math.max.apply(Math, numbers);

        const correctAnswer = median - min > max - median ? min : max;

        const correctAnswerIndex = numbers.indexOf(correctAnswer);

        cy.get(dataTestId("correct-answers")).then(($el) => {
          const correctCount = parseInt($el.text());
          assert.isNotNaN(correctCount);

          cy.get(dataTestId(`answer-button-${correctAnswerIndex}`)).click();
          cy.get(dataTestId("correct-answers")).should(
            "have.text",
            correctCount + 1,
          );
        });
      });
  });

  // Top section

  it("Has a target time", () => {
    cy.get(dataTestId("target-time")).then(($targetTime) => {
      const text = $targetTime.text();
      const itemTime = parseInt(text);

      assert.isNotNaN(itemTime);
    });
  });

  it("Has a remaining time", () => {
    cy.get(dataTestId("remaining-time")).then(($remainingTime) => {
      const text = $remainingTime.text();
      cy.log(text);

      assert.isNotNaN(parseInt(text));
    });
  });

  //
});
