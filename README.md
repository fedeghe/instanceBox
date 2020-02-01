# instanceBox  

**What**: You want to store javascript instances in the browser  
**Why**: I dont care  
**How**: this module aims to offer a solution  

# Important  
This is a draft module, does not work when the instance references other objects within. Looks like it is not easy to have that but I'm working on that.

### build and run test  
- `yarn`
- `yarn build`
- `yarn serve` // runs on http://localhost:9999
- `yarn test`  // runs 2 basic cypress tests

---

### what to expect
In page _one.html_:
```
// a constructor is available
function Person(name, age){
    this.name = name;
    this.age = age;
    
    // not yet
    // this.doc = new Doc(this.name. this.age)
}
Person.prototype.sayHello = function () {
    return 'Hi, my name is ' + this.name;
};

// we create a instance
var me  = new Person('Federico', 42);

// now we would like to save it (local storage is the default one)
instanceBox.set('thisIsMe', me);
```
That's it, now we are free to navigate to another page and fully retrieve the instance. Let\`s go for instance at page _two.html_.  
We\`ll be able to retrieve the instance simply using the `get` method passing the right key:  

```
var me = instanceBox.get('thisIsMe');
console.log(me.sayHello()) // ---> Hi, my name is Federico
```
---

### What about `sessionStorage` ?  
To chance storage is enough to call the two functions:  
- `instanceBox.useSessionStorage()`
- `instanceBox.useLocalStorage()`  

before saving / retrieving from the target storage.

---

### something more  

`instanceBox` offers the following methods:
- `useLocalStorage()`  
sets `localStorage` as container  
**returns**: `void`

- `useSessionStorage()`  
sets `sessionStorage` as container  
**returns**: `void`

- `set(key <string>, instance <object instance>)`  
saves the given _instance_ using the _key_ provided  
**returns**: `true` OR `Exception`

- `get(key <string>)`  
attempts to retrieve the instance that has been saved with the given _key_  
**returns**: `Object` OR `null`

- `remove(key <string>)`  
if found removes the instance saved using the passed _key_  
**returns**: `void`

- `clear()`  
completely cleans out the container  
**returns**: `void`

- `length()`  
returns the number of elements saved  
**returns**: `Number`

- `getSize(key <string>)`  
returns the size in bytes of the instance saved using the given _key_  
**returns**: `Number` OR `null`

