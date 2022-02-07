/// <reference types="cypress" />

const dataTestId = require("../support").dataTestId;

describe("Perceptual Speed Test", () => {
  before(() => {
    cy.visit("/perceptual-speed");
  });

  it("Has a title", () => {
    cy.checkTitle();
  });

  it("Can ask questions", () => {
    cy.get(dataTestId("question-list"))
      .children()
      .should("have.length.at.least", 1);

    const regex = /^[A-z]$/;

    cy.get(dataTestId("q-top-0")).then(($el) => {
      assert.isTrue(regex.test($el.text()));
    });
    cy.get(dataTestId("q-bottom-0")).then(($el) => {
      assert.isTrue(regex.test($el.text()));
    });
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
      .then(($el) => {
        const text = $el.text().toLowerCase();

        let matchCount = 0;

        for (let i = 0; i < text.length; i += 2) {
          matchCount += text[i] === text[i + 1];
        }

        cy.log(text);
        cy.log(matchCount);

        cy.get(dataTestId("correct-answers")).then(($el) => {
          const correctCount = parseInt($el.text());
          assert.isNotNaN(correctCount);

          cy.get(dataTestId(`answer-button-${matchCount}`)).click();
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
