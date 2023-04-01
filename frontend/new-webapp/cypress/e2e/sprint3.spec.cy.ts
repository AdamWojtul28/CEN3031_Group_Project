describe ('Test Admin / Logout / Listing Search', () => {
  it('Signs up and logs out', () => {
    cy.visit('http://localhost:5000/signup')
    cy.get("[data-cy='email']").type('example@email.com')
    cy.get("[data-cy='username']").type('testuser')
    cy.get("[data-cy='password']").type('pass123')
    cy.get("[data-cy='signup-btn']").click()
    cy.url().should('include', '/users/testuser')
    cy.get("[data-cy='logout-btn']").click()
    cy.url().should('eq', 'http://localhost:5000/')
  })

  it('Deletes new user on admin page', () => {
    cy.visit('http://localhost:5000/admin')
    cy.contains('testuser').should('exist')
    cy.contains('testuser').click().parent().parent().children('.col-6').children('.btn').click()
    cy.contains('testuser').should('not.exist')
  })

  it('Sends a listing search get request', ()=> {
    cy.visit('http://localhost:5000/booking')
    cy.get("[data-cy='location-input']").type('Oxford, England')
    cy.get("[data-cy='distance-input']").type('1000')
    cy.get("[data-cy='unit-input']").select('mi')
    cy.get("[data-cy='search-btn']").click()
    cy.get("[data-cy='http-sent']").should('contain', "Search was sent!")
  })
})