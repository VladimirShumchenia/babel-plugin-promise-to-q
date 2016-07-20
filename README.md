# babel-plugin-promise-to-q

Turns native promises into angular $q service

## Example

**In**

```js
// input code
```

**Out**

```js
"use strict";

// output code
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
