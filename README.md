# babel-plugin-promise-to-q

Turns native promises into angular $q service

## Why?

Babel uses native browser promises, which in most cases are perfectly fine, but they can cause some problems if you are using babel with Angular 1. Since Angular already relies on the $q service, this plugin converts the native browser promises to also use the $q service. This eliminates $digest problems that happen when mixing the two types of promises.

## Example

**In**

```js
new Promise(function(resolve, reject) {
  try {
    if (something) {
      resolve(true);
    } else {
      resolve(false);
    }
  } catch (error) {
    reject(error);
  }
});
```

**Out**

```js
$q(function(resolve, reject) {
  try {
    if (something) {
      resolve(true);
    } else {
      resolve(false);
    }
  } catch (error) {
    reject(error);
  }
});
```

## Installation

```sh
$ npm install babel-plugin-promise-to-q
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["promise-to-q"]
}
```

### Via CLI

```sh
$ babel --plugins promise-to-q script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["promise-to-q"]
});
```
