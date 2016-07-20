new Promise(function (resolve, reject) {
  resolve();
});

new Promise(function named(resolve, reject) {
  reject();
});

new Promise((resolve, reject) => {
  // comment
  resolve(true);
});

new Promise((resolve, reject) => {
  try {
    // comment
    resolve(true);
  } catch (error) {
    reject(false);
  }
});
