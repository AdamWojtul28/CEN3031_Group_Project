describe('Create User / Login Test', () => {
  it('Does not allow sign up with existing username', () => {
    cy.visit('http://localhost:5000/')
    cy.contains('Login').click()
    cy.url().should('include', '/login')
    cy.contains('Sign Up').click()
    cy.url().should('include', '/signup')

    cy.get("[data-cy='email']").type('example@email.com')
    cy.get("[data-cy='username']").type('user123')
    cy.get("[data-cy='password']").type('pass123')
    cy.get("[data-cy='signup-btn']").click()
    cy.get("[data-cy='err-msg']").should(($span) => {
      expect($span).to.have.text(' Username is Taken! OK')
    })
  })

  it('Navigates to profile page after logging in', () => {
    cy.visit('http://localhost:5000/login')
    cy.get("[data-cy='username']").type('user123')
    cy.get("[data-cy='password']").type('pass123')
    cy.get("[data-cy='login-btn']").click()
    cy.url().should('include', '/users/user123')
    cy.get("[data-cy='username-h3']").should(($h3) => {
      expect($h3).to.have.text('user123\'s Profile')
    })
  })
})