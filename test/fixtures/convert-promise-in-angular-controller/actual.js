(() => {
  'use strict';

  angular.module('test')
    .controller('testController', TestController);

  function TestController () {
    const vm = this;
    vm.myPromise = new Promise(function named(resolve, reject) {
      // do something
    });
  }
})();
