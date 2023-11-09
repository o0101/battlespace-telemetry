class SuperProtected {
  #_api = null;
  #_protectedMember3 = 0;

  constructor(subclassSymbol) {
    this[subclassSymbol] = this.#getProtectedMembers();
    console.log(subclassSymbol, this[subclassSymbol]);
  }

  #getMember3() {
    console.log('getting 3');
    return this.#_protectedMember3;
  }

  #setMember3(val) {
    console.log('setting 3', val);
    this.#_protectedMember3 = val;
    console.log(this.#_protectedMember3);
  }

  #getProtectedMembers() {
    if ( this.#_api == null ) {
      const api = {};
      // enumerable is optional and here one purpose is to show using log
      // use arrows for getters and setters or remember to rebind this as in methods
      Object.defineProperties(api, {
        protectedMember: { value: this.#_protectedMember.bind(this), enumerable: true },
        protectedMember2: { value:  this.#_protectedMember2.bind(this), enumerable: true },
        protectedMember3: {
          get: () => this.#_protectedMember3,
          set: (val) => {
            this.#_protectedMember3 = val;
          },
          enumerable: true
        }
      });
      this.#_api = api;
    } 
    return this.#_api;
  }

  #_protectedMember() {
    console.log('I am');
  }

  #_protectedMember2() {
    console.log('I am 2');
  }
}

class SubWithAccess extends SuperProtected {
  #$; // access ancestor procted api under this symbol

  constructor() {
    const $ = Symbol(`[[protected]]`);
    super($);
    // assign the private field to be the value of the slot keyed by its symbol value
    this.#$ = this[$];
  }

  demonstrate() {
    this.#$.protectedMember2();
    this.#$.protectedMember3 = 555;
    this.#$.protectedMember();
    console.log('Value of protected member', this.#$.protectedMember3);
  }
}

const subInstance = new SubWithAccess();

subInstance.demonstrate();
