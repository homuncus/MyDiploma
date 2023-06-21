// https://on.cypress.io/api

describe('My First Test', () => {
  it('visits the app root url', () => {
    cy.visit('/')
    cy.location('href').should('contain', 'login')
  })
  // Assuming you have Cypress installed and configured
})

describe('Login Form', () => {
  beforeEach(() => {
    cy.visit('/a/login') // Assuming the login page is accessible at '/login'
  })

  it('should login and receive a JWT token', () => {
    cy.intercept('POST', '/api/auth/login').as('loginRequest')

    // Fill in the login form fields
    cy.get('input[placeholder="E-mail"]').type('cot.cotenov@gmail.com')
    cy.get('input[placeholder="Password"]').type('123123')

    // Submit the form
    cy.get('button[type="button"]').click()

    // Wait for the login request to complete and assert the response
    cy.wait('@loginRequest').then((xhr) => {
      expect(xhr.response?.body).to.have.property('access_token')
      expect(xhr.response?.statusCode).to.equal(200) // Assuming a successful response has a status code of 200
    })
  })
})