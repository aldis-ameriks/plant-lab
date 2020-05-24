describe("sensor details page", () => {
  before(() => {
    cy.visit("/sensors/999");
  });

  it("renders last readings", () => {
    cy.contains("1%");
    cy.contains("24.0°c");
    cy.contains("12.09 V");
  });

  it("renders graphs", () => {
    cy.get(".apexcharts-graphical").should(($el) => {
      expect($el).to.have.length(6);
    });
  });
});
