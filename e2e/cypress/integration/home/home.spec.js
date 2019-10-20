describe('sensor details page', () => {
  before(() => {
    cy.visit('/')
  })

  it('renders last readings', () => {
    cy.contains('moisture')
    cy.contains('temp.')
    cy.contains('battery')
  })
})
