function test(cb) {
  cb();
}

var _qPromise = $q(function (resolve, reject) {
  resolve(false);
});

test(_qPromise);
