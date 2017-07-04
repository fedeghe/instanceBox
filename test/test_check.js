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

    
    describe("get", function() {
        var ls, ss;
        it("should get the instance of Person from localStorage", function() {
            instanceBox.base64 = true;
            instanceBox.use('local');
            ls = instanceBox.get("Persons/Federico");
            expect(ls).to.be.an.instanceof(Person)
        });
        it("it should contain the right values", function() {
            expect(ls.name).to.equal("Federico");
            expect(ls.data.age).to.equal(40);
            expect(ls.data.gender).to.equal('male');
        });
        it("should get the instance of Person from sessionStorage", function() {
            instanceBox.base64 = true;
            instanceBox.use('session');
            ss = instanceBox.get("Persons/Gabriele");
            expect(ss).to.be.an.instanceof(Person)
        });
        it("it should contain the right values", function() {
            expect(ss.name).to.equal("Gabriele");
            expect(ss.data.age).to.equal(7);
            expect(ss.data.gender).to.equal('male');
        });
    });

});
