describe ('Test Friend Requests / Update Profile', () => {
  it('Creates a friendship and then destroys it', () => {
    cy.visit('http://localhost:5000')
    cy.get("[data-cy='login-header']").click()
    cy.get("[data-cy='username']").type('testuser1')
    cy.get("[data-cy='password']").type('password')
    cy.get("[data-cy='login-btn']").click()
    cy.get("[data-cy='home-btn']").click()
    cy.url().should('eq', 'http://localhost:5000/home')
    cy.get("[data-cy='add-friend-text']").type('testuser2')
    cy.get("[data-cy='add-friend-btn']").click()
    cy.get("[data-cy='add-friend-pending']").should('contain.text','testuser2')
    cy.get("[data-cy='profile-nav']").click()
    cy.get("[data-cy='logout-btn']").click()
    cy.url().should('eq', 'http://localhost:5000/')

    cy.visit('http://localhost:5000')
    cy.get("[data-cy='login-header']").click()
    cy.get("[data-cy='username']").type('testuser2')
    cy.get("[data-cy='password']").type('password')
    cy.get("[data-cy='login-btn']").click()
    cy.get("[data-cy='home-btn']").click()
    cy.get("[data-cy='incoming-request']").should('contain.text', 'testuser1')
    cy.get("[data-cy='accept-request-btn']").click()
    cy.get("[data-cy='incoming-request']").should('not.exist')
    cy.get("[data-cy='friend-item']").should('contain.text', 'testuser1')
    cy.get("[data-cy='delete-friend-btn']").click()
    cy.get("[data-cy='no-friends']").should('contain.text', 'You have no friends')
    
  })
})