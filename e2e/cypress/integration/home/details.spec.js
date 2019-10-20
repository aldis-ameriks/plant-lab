describe('sensor details page', () => {
  before(() => {
    cy.visit('/sensors/999')
  })

  it('renders last readings', () => {
    cy.contains('44%')
    cy.contains('23°c')
    cy.contains('3.53 V')
  })

  it('renders graphs', () => {
    cy.get('.apexcharts-graphical').should(($el) => {
      expect($el).to.have.length(6)
    })
  })
})
