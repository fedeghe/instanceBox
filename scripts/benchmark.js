const fs = require('fs');
const path = require('path');

// Mock browser environment
const store = {};
const storage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => (store[k] = String(v)),
    removeItem: (k) => delete store[k],
    clear: () => { for (const k in store) delete store[k]; },
    key: (i) => Object.keys(store)[i] || null,
    get length() { return Object.keys(store).length; }
};
global.localStorage = storage;
global.sessionStorage = storage;
global.btoa = (str) => Buffer.from(str, 'binary').toString('base64');
global.atob = (str) => Buffer.from(str, 'base64').toString('binary');

// Load instanceBox
const code = fs.readFileSync(path.join(__dirname, '../dist/index.js'), 'utf8');
eval(code);

// Define classes as globals so instanceBox can eval them back
function Simple(name, age) {
    this.name = name;
    this.age = age;
    this.active = true;
}

function Medium(name, age, city) {
    this.name = name;
    this.age = age;
    this.city = city;
    this.tags = ['js', 'node', 'browser'];
    this.scores = [10, 20, 30];
    this.meta = { created: '2024-01-01', updated: '2024-06-01' };
    this.active = true;
    this.verified = false;
    this.rating = 4.5;
    this.count = 999;
    this.id = 'usr-12345';
}

function Large() {
    for (let i = 0; i < 100; i++) {
        this['prop' + i] = 'value number ' + i;
    }
}

function Doc(name, age, gender) {
    this.name = name;
    this.age = age;
    this.gender = gender;
}
Doc.prototype.show = function () {
    return [this.name[0], this.age, this.gender, '2024'].join('');
};

function NestedPerson(name, age, g) {
    this.name = name;
    this.age = age;
    this.gender = g;
    this.doc = new Doc(name, age, g);
}
NestedPerson.prototype.getDocumentId = function () {
    return this.doc.show();
};

function Level2(val) {
    this.val = val;
    this.level = 2;
}
Level2.prototype.getVal = function () { return this.val; };

function Level1(val) {
    this.val = val;
    this.level = 1;
    this.child = new Level2(val + '-child');
}
Level1.prototype.getVal = function () { return this.val; };

function DeepRoot(val) {
    this.val = val;
    this.level = 0;
    this.child = new Level1(val + '-level1');
}
DeepRoot.prototype.getVal = function () { return this.val; };

function WithMethods(name, age) {
    this.name = name;
    this.age = age;
    this.active = true;
}
WithMethods.prototype.sayHello = function () {
    return 'Hello ' + this.name;
};
WithMethods.prototype.getAge = function () {
    return this.age;
};
WithMethods.prototype.toggle = function () {
    this.active = !this.active;
};

function HeavyMethods(name) {
    this.name = name;
}
HeavyMethods.prototype.m1 = function () { return this.name + '1'; };
HeavyMethods.prototype.m2 = function () { return this.name + '2'; };
HeavyMethods.prototype.m3 = function () { return this.name + '3'; };
HeavyMethods.prototype.m4 = function () { return this.name + '4'; };
HeavyMethods.prototype.m5 = function () { return this.name + '5'; };
HeavyMethods.prototype.m6 = function () { return this.name + '6'; };
HeavyMethods.prototype.m7 = function () { return this.name + '7'; };
HeavyMethods.prototype.m8 = function () { return this.name + '8'; };
HeavyMethods.prototype.m9 = function () { return this.name + '9'; };
HeavyMethods.prototype.m10 = function () { return this.name + '10'; };

// Make constructors available to instanceBox eval
global.Simple = Simple;
global.Medium = Medium;
global.Large = Large;
global.Doc = Doc;
global.NestedPerson = NestedPerson;
global.Level2 = Level2;
global.Level1 = Level1;
global.DeepRoot = DeepRoot;
global.WithMethods = WithMethods;
global.HeavyMethods = HeavyMethods;

function rawSize(obj) {
    // Buffer.byteLength of JSON.stringify gives the UTF-8 byte size of own properties
    return Buffer.byteLength(JSON.stringify(obj), 'utf8');
}

function run(label, factory) {
    instanceBox.useLocalStorage();
    instanceBox.clear();

    const obj = factory();
    const raw = rawSize(obj);

    const start = process.hrtime.bigint();
    instanceBox.set(label, obj);
    const stored = instanceBox.getSize(label);
    const end = process.hrtime.bigint();

    const overhead = stored - raw;
    const pct = raw > 0 ? ((overhead / raw) * 100).toFixed(1) : '0.0';
    const ms = Number(end - start) / 1e6;

    return { label, raw, stored, overhead, pct, ms };
}

const results = [
    run('Simple', () => new Simple('Federico', 42)),
    run('Medium', () => new Medium('Federico', 42, 'Milan')),
    run('Large', () => new Large()),
    run('Nested', () => new NestedPerson('Gabriele', 7, 'male')),
    run('Deep', () => new DeepRoot('root')),
    run('WithMethods', () => new WithMethods('Federico', 42)),
    run('HeavyMethods', () => new HeavyMethods('Federico'))
];

console.log('| Type | Raw (bytes) | Stored (bytes) | Overhead (bytes) | Overhead % | Time (ms) |');
console.log('|------|-------------|----------------|------------------|------------|-----------|');
results.forEach(r => {
    console.log(
        `| ${r.label.padEnd(13)} | ` +
        `${String(r.raw).padStart(11)} | ` +
        `${String(r.stored).padStart(14)} | ` +
        `${String(r.overhead).padStart(16)} | ` +
        `${r.pct.padStart(10)} | ` +
        `${r.ms.toFixed(3).padStart(9)} |`
    );
});
