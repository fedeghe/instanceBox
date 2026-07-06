[![codecov](https://codecov.io/gh/fedeghe/instanceBox/graph/badge.svg?token=fZSG4QuRBp)](https://codecov.io/gh/fedeghe/instanceBox)

# instanceBox


**What**: You want to store JavaScript instances (with their methods) in the browser
**Why**: You don't want to lose state and behavior when navigating pages or reloading
**How**: this module offers a solution

## Registration pattern

`instanceBox` now uses a **registration pattern**. Instead of saving the full source code of your constructors (which was heavy and relied on `eval`), you register your classes once. `instanceBox` then stores only the **state** (own properties) and restores the instance by looking up the registered constructor.

### Quick start

```js
function Person(name, age) {
    this.name = name;
    this.age = age;
}
Person.prototype.sayHello = function () {
    return 'Hi, my name is ' + this.name;
};

// Register once per page / per application bootstrap
instanceBox.register('Person', Person);

// Save
var me = new Person('Federico', 42);
instanceBox.set('thisIsMe', me);

// ... navigate to another page, reload, etc.

// Restore
var me = instanceBox.get('thisIsMe');
console.log(me.sayHello()); // ---> Hi, my name is Federico
```

### Deep objects (nested instances)

Instances that reference other custom instances are also supported, as long as every custom class is registered:

```js
function Doc(name, age, gender) {
    this.name = name;
    this.age = age;
    this.gender = gender;
}
Doc.prototype.show = function () {
    return [this.name[0], this.age, this.gender].join('');
};

function Person(name, age, g) {
    this.name = name;
    this.age = age;
    this.gender = g;
    this.doc = new Doc(name, age, g);
}
Person.prototype.getDocumentId = function () {
    return this.doc.show();
};

// Register both constructors
instanceBox.register('Person', Person);
instanceBox.register('Doc', Doc);

var p = new Person('Gabriele', 7, 'male');
instanceBox.set('Persons/Gabriele', p);

// Later...
var p = instanceBox.get('Persons/Gabriele');
console.log(p.getDocumentId()); // ---> G7male
```

---

## Storage targets

`localStorage` is the default container. To switch:

```js
instanceBox.useSessionStorage(); // use sessionStorage
instanceBox.useLocalStorage();   // back to localStorage
```

---

## API

- `register(name <string>, constructor <function>)`
  Register a class constructor so `instanceBox` can rebuild instances without `eval`.
  **returns**: `void`

- `useLocalStorage()`
  sets `localStorage` as container
  **returns**: `void`

- `useSessionStorage()`
  sets `sessionStorage` as container
  **returns**: `void`

- `set(key <string>, instance <object>)`
  saves the given instance using the key provided
  **returns**: `true` OR `Exception`

- `get(key <string>)`
  attempts to retrieve the instance saved with the given key
  **returns**: `Object` OR `null`

- `remove(key <string>)`
  if found removes the instance saved using the passed key
  **returns**: `void`

- `clear()`
  completely cleans out the container
  **returns**: `void`

- `length()`
  returns the number of saved instances
  **returns**: `Number`

- `getSize(key <string>)`
  returns the size in bytes of the saved instance
  **returns**: `Number` OR `null`

- `base64(boolean)`
  toggle Base64 encoding (default `true`). Disabling reduces CPU overhead slightly and makes stored data human-readable, but may cause issues with multi-byte characters.
  **returns**: `void`

---

## Build & test

```bash
yarn
yarn build     # build dist/index.js
yarn test      # run Jest unit tests
```

The test suite covers `localStorage`, `sessionStorage`, nested instances, remove, clear, length, key, getSize, base64 toggle and storage isolation.

---

## How does it compare?

| Approach | Security | Overhead | "Magic" | Requires setup |
|----------|----------|----------|---------|----------------|
| JSON.stringify | Safe | Minimal | No | You must manually call `new MyClass(data)` after parse |
| Factory pattern (`new Person(data)`) | Safe | Minimal | No | You must know the class name at restore time |
| `instanceBox` (registration) | Safe | Low | Yes | One `register()` call per class |
| Old `instanceBox` (eval + `toString()`) | Unsafe (eval) | Very high | Yes | None |

**What "Requires setup" means:**

- **JSON.stringify**: after `JSON.parse` you get a plain object. You must manually do `new Person(parsed)` to get methods back. You need to know which class to use.
- **Factory pattern**: same as above, but wrapped in a factory function. You still need to know the class or have a factory ready at restore time.
- **instanceBox registration**: you call `instanceBox.register('Person', Person)` once when the page loads. After that `set`/`get` work transparently, even with nested custom instances. No need to know the class name at restore time.
- **Old eval approach**: zero setup, but stores the full source code of every constructor and every method inside the storage, making it heavy and dangerous (`eval` on untrusted localStorage data).

