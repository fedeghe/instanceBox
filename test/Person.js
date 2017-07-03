function Person(name, age, g) {
    this.name = name;
    this.data = {
        age : age || 7,
        gender : g || 'male'
    };
}
Person.prototype.sayHello = function () {
    return "Hello from " + this.name;
}