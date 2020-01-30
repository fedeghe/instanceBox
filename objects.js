function Doc(type, number) {
    this.type = type;
    this.number = number;
}
Doc.prototype.show = function () {
    return this.type + ' ' + this.number;
}

function Person(name, surname, age) {
    // this.o = o;
    this.name = name;
    this.surname = surname;
    this.age = age;
    this.createdAt = new Date;
    this.arr = [1];
    this.math = {};
    this.alive = true;
    this.doc = new Doc('passport', 'AA33434448')
}
Person.prototype.toString = function () {
    console.log(this.name)
    console.log(this.surname)
    console.log(this.age)
    console.log(this.createdAt)
    console.log(this.arr)
    console.log(this.math)
    console.log(this.alive)
    console.log(this.doc.number)
};
