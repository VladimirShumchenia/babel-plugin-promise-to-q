const obj = {};
obj.myString = 'String!';
obj.myPromise = $q(function named(resolve, reject) {
  // do something
});
obj.myNumeric = 5;
obj.myFunction = function () {
  obj.myNumeric = 6;
};
obj.myNewClass = new InstanceOfSomething(obj);
