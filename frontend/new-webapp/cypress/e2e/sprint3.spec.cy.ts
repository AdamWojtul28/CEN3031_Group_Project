describe ('Test Admin / Logout / Listing Search', () => {
  it('Signs up and logs out', () => {
    cy.visit('http://localhost:5000/signup')
    cy.get("[data-cy='email']").type('example@email.com')
    cy.get("[data-cy='username']").type('testuser')
    cy.get("[data-cy='password']").type('pass123')
    cy.get("[data-cy='signup-btn']").click()
  })
})