describe('Users Test', () => {
  it('Creates user123', () => {
    cy.visit('http://localhost:5000/')
    cy.get('[name="username"]').type('user123')
    cy.get('[name="password"]').type('pass123')
    cy.contains('Create User').click()
    cy.contains('Fetch Users').click()
  })

  // it('Deletes user123' , () => {
  //   cy.visit('http://localhost:5000/')
  //   cy.get('[name="username"]').type('user123')
  // })

})