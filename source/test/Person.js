function Person(name, age, g) {
    this.name = name;
    this.age = age || 'unknown';
    this.gender = g || 'unknown';
}
Person.prototype.setSurname = function (s) {
    this.surname = s;
}
Person.prototype.sayHello = function () {
    return "Hello from " + this.name;
}
typeof module === 'object' &&
typeof module.exports === 'object' &&
(module.exports = Person);