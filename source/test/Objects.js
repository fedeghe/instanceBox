function Doc(name, age, gender) {
    this.name = name;
    this.age = age;
    this.gender = gender;
}
Doc.prototype.show = function () {
    return [this.name[0], this.age, this.gender, '__YEAR__'].join('')
}

function Person(name, age, g) {
    this.name = name;
    this.age = age || 'unknown';
    this.gender = g || 'unknown';
    this.doc = new Doc(this.name,  this.age, this.gender)
}
Person.prototype.getDocumentId = function () {
    return this.doc.show();
}
typeof module === 'object' &&
typeof module.exports === 'object' &&
(module.exports = Person);