function Person(name) {
    this.name = name;
    this.data = {
        age : 7,
        gender : 'male'
    };
}
Person.prototype.sayHello = function () {
    return "Hello from " + this.name;
}