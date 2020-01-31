describe('Local Storage', function() {
    it('Visits the Local server', function() {
        cy.visit('http://localhost:9999')
        cy.get('.deep').click();
    })
    it('Should be in the local start point', function () {
        cy.location('pathname').should('include', 'testDeepStart');
        cy.window().then(
            win => {
                win.instanceBox.useLocalStorage();
                win.instanceBox.set("Persons/Gabriele", win.p);
            }
        );
        cy.get('.check').click();
    })
    it('Should be able to retrieve the instance', function () {
        cy.location('pathname').should('include', 'testLocalCheck');
        cy.window()
            .then(win => {
                win.instanceBox.useLocalStorage();
                expect(win.p.getDocumentId()).to.equal('G7male2020')
            });
    });

})