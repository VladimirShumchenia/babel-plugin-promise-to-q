const obj = {
  myNumeric: 5,
  myPromise: $q(function named(resolve, reject) {
    // do something
  }),
  myString: 'String!',
  myInstance: new Instance(obj)
};
