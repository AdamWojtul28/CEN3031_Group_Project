describe('My First Test', () => {
  it('Find Create User', () => {
    cy.visit('http://localhost:5000/')
    cy.get('[name="username"]').type('user123')
    cy.get('[name="password"]').type('pass123')
    cy.contains('Create User').click()
    cy.contains('Fetch Users').click()
  })
})