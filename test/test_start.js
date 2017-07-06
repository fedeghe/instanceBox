var expect = chai.expect;

describe("local/session storage", function() {
    var sandbox;

    beforeEach(function() {
        // create a sandbox
        sandbox = sinon.sandbox.create();

        // stub some console methods
        sandbox.stub(window.console, "log");
        sandbox.stub(window.console, "error");
    });

    afterEach(function() {
        // restore the environment as it was before
        sandbox.restore();
    });

    describe("set", function() {
        it("should save the instance in localStorage", function() {
            
            instanceBox.base64 = true;
            instanceBox.use('local');

            var p = new Person("Federico", 40, 'male'),
                r = instanceBox.set("Persons/Federico", p);

            expect(r).to.equal(true);
        });
        it("should save the instance in sessionStorage... and open the test page after 3 seconds", function() {
            
            instanceBox.base64 = true;
            instanceBox.use('session');

            var p = new Person("Gabriele", 7, 'male'),
                r = instanceBox.set("Persons/Gabriele", p);

            expect(r).to.equal(true);

            setTimeout(function() {
                window.open('check.html');
            }, 3000);
        });
    });
});
