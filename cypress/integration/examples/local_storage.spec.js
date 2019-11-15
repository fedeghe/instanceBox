/// <reference types="Cypress" />

context('Local Storage', () => {
  before(() => {
    cy.visit('/testLocalStart.html', {
        onLoad: () => cy.visit('/testLocalCheck.html')
    })
  })
  it('cy.clearLocalStorage() - clear all data in local storage', () => {
    
    const inst = localStorage.getItem('Persons/Gabriele')
    expect(inst.sayHello()).to.eq('"Hello from Gabriele')
  })
})
