describe('Session Storage', function() {
    it('Visits the Local server', function() {
        cy.visit('http://localhost:9999')
        cy.get('.session').click();
    })
    it('Should be in the local start point', function () {
        cy.location('pathname').should('include', 'testSessionStart');
        cy.window().then(
            win => {
                win.instanceBox.useSessionStorage();
                win.instanceBox.set("Persons/Federico", win.p);
            }
        );
        cy.get('.check').click();
    })
    it('Should be able to retrieve the instance', function () {
        cy.location('pathname').should('include', 'testSessionCheck');
        cy.window()
            .then(win => {
                win.instanceBox.useSessionStorage();
                expect(win.p.sayHello()).to.equal('Hello from Federico')
            });
    })

})