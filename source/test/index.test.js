const fs = require('fs');
const path = require('path');

let localStorage, sessionStorage, btoa, atob;

function createStorage() {
    const store = {};
    return {
        getItem: (k) => (k in store ? store[k] : null),
        setItem: (k, v) => (store[k] = String(v)),
        removeItem: (k) => delete store[k],
        clear: () => { for (const k in store) delete store[k]; },
        key: (i) => Object.keys(store)[i] || null,
        get length() { return Object.keys(store).length; }
    };
}

function loadInstanceBox() {
    localStorage = createStorage();
    sessionStorage = createStorage();
    btoa = (str) => Buffer.from(str, 'binary').toString('base64');
    atob = (str) => Buffer.from(str, 'base64').toString('binary');
    const code = fs.readFileSync(path.join(__dirname, '../../dist/index.js'), 'utf8');
    eval(code);
    return instanceBox;
}

function Person(name, age, g) {
    this.name = name;
    this.age = age || 'unknown';
    this.gender = g || 'unknown';
}
Person.prototype.setSurname = function (s) {
    this.surname = s;
};
Person.prototype.sayHello = function () {
    return 'Hello from ' + this.name;
};

function Doc(name, age, gender) {
    this.name = name;
    this.age = age;
    this.gender = gender;
}
Doc.prototype.show = function () {
    return [this.name[0], this.age, this.gender, new Date().getFullYear()].join('');
};

function DeepPerson(name, age, g) {
    this.name = name;
    this.age = age || 'unknown';
    this.gender = g || 'unknown';
    this.doc = new Doc(this.name, this.age, this.gender);
}
DeepPerson.prototype.getDocumentId = function () {
    return this.doc.show();
};

describe('instanceBox', () => {
    let instanceBox;

    beforeEach(() => {
        instanceBox = loadInstanceBox();
        instanceBox.register('Person', Person);
        instanceBox.register('Doc', Doc);
        instanceBox.register('DeepPerson', DeepPerson);
    });

    test('localStorage: save and retrieve a shallow instance', () => {
        instanceBox.useLocalStorage();
        const p = new Person('Federico', 42, 'male');
        p.setSurname('Ghedina');
        instanceBox.set('Persons/Federico', p);
        const restored = instanceBox.get('Persons/Federico');
        expect(restored.name).toBe('Federico');
        expect(restored.age).toBe(42);
        expect(restored.surname).toBe('Ghedina');
        expect(restored.sayHello()).toBe('Hello from Federico');
    });

    test('sessionStorage: save and retrieve a shallow instance', () => {
        instanceBox.useSessionStorage();
        const p = new Person('Moana', 41, 'female');
        p.setSurname('Pozzi');
        instanceBox.set('Persons/Moana', p);
        const restored = instanceBox.get('Persons/Moana');
        expect(restored.name).toBe('Moana');
        expect(restored.age).toBe(41);
        expect(restored.surname).toBe('Pozzi');
        expect(restored.sayHello()).toBe('Hello from Moana');
    });

    test('deep object: save and retrieve nested custom instances', () => {
        instanceBox.useLocalStorage();
        const p = new DeepPerson('Gabriele', 7, 'male');
        instanceBox.set('Persons/Gabriele', p);
        const restored = instanceBox.get('Persons/Gabriele');
        expect(restored.name).toBe('Gabriele');
        expect(restored.getDocumentId()).toBe('G7male' + new Date().getFullYear());
    });

    test('remove: deletes an instance', () => {
        instanceBox.useLocalStorage();
        instanceBox.set('A', new Person('A', 1));
        expect(instanceBox.get('A')).not.toBeNull();
        instanceBox.remove('A');
        expect(instanceBox.get('A')).toBeNull();
    });

    test('length: counts only instance keys', () => {
        instanceBox.useLocalStorage();
        instanceBox.set('A', new Person('A', 1));
        instanceBox.set('B', new Person('B', 2));
        expect(instanceBox.length()).toBe(2);
    });

    test('clear: removes all instances', () => {
        instanceBox.useLocalStorage();
        instanceBox.set('A', new Person('A', 1));
        instanceBox.clear();
        expect(instanceBox.get('A')).toBeNull();
        expect(instanceBox.length()).toBe(0);
    });

    test('key: returns the key without the iB- prefix', () => {
        instanceBox.useLocalStorage();
        instanceBox.set('A', new Person('A', 1));
        expect(instanceBox.key(0)).toBe('A');
    });

    test('getSize: returns a positive number after set', () => {
        instanceBox.useLocalStorage();
        instanceBox.set('A', new Person('A', 1));
        expect(typeof instanceBox.getSize('A')).toBe('number');
        expect(instanceBox.getSize('A')).toBeGreaterThan(0);
    });

    test('base64 toggle: works when disabled', () => {
        instanceBox.useLocalStorage();
        instanceBox.base64(false);
        const p = new Person('NoBase', 99);
        instanceBox.set('NoBase', p);
        const restored = instanceBox.get('NoBase');
        expect(restored.name).toBe('NoBase');
        expect(restored.sayHello()).toBe('Hello from NoBase');
    });

    test('switch storage: localStorage and sessionStorage are isolated', () => {
        instanceBox.useLocalStorage();
        instanceBox.set('Key', new Person('Key', 1));
        instanceBox.useSessionStorage();
        expect(instanceBox.get('Key')).toBeNull();
        instanceBox.useLocalStorage();
        expect(instanceBox.get('Key')).not.toBeNull();
    });
});
