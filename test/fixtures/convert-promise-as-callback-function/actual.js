function test(cb) {
  cb();
}

test(new Promise(function (resolve, reject) {
  resolve(false);
}));
