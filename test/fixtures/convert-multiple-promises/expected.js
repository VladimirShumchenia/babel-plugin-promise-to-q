$q(function (resolve, reject) {
  resolve();
});
$q(function named(resolve, reject) {
  reject();
});
$q((resolve, reject) => {
  // comment
  resolve(true);
});
$q((resolve, reject) => {
  try {
    // comment
    resolve(true);
  } catch (error) {
    reject(false);
  }
});
