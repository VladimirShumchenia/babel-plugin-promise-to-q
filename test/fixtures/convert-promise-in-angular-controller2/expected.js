'use strict';

angular.module('testApp').controller('myController', controller);

function controller() {
  var vm = this;
  vm.test = $q(function (resolve, reject) {
    resolve(true);
  });
}
