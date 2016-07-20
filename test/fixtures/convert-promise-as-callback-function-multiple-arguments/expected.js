function test(arg1, cb, arg2) {
  cb();
}

var _qPromise = $q(function (resolve, reject) {
  resolve(false);
});

test('testArgument', _qPromise, 10);
