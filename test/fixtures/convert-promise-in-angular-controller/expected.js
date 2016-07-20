(() => {
  'use strict';

  angular.module('test').controller('testController', TestController);

  function TestController() {
    const vm = this;
    vm.myPromise = $q(function named(resolve, reject) {
      // do something
    });
  }
})();
