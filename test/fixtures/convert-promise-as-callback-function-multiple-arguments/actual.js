function test(arg1, cb, arg2) {
  cb();
}

test('testArgument', new Promise(function (resolve, reject) {
  resolve(false);
}), 10);
