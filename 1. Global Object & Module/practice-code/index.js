/*
console.log(global);

const a = 10;
console.log(global.a);


console.log(__dirname);
//C:\Users\User\OneDrive\Desktop\Nodejs\Global Object & Module\practice-code
console.log(__filename);
//C:\Users\User\OneDrive\Desktop\Nodejs\Global Object & Module\practice-code\index.js


console.log(module);
Module {
  id: '.',
  path: 'C:\\Users\\User\\OneDrive\\Desktop\\Nodejs\\Global Object & Module\\practice-code',
  exports: {},
  filename: 'C:\\Users\\User\\OneDrive\\Desktop\\Nodejs\\Global Object & Module\\practice-code\\index.js',
  loaded: false,
  children: [],
  paths: [
    'C:\\Users\\User\\OneDrive\\Desktop\\Nodejs\\Global Object & Module\\practice-code\\node_modules',
    'C:\\Users\\User\\OneDrive\\Desktop\\Nodejs\\Global Object & Module\\node_modules',
    'C:\\Users\\User\\OneDrive\\Desktop\\Nodejs\\node_modules',
    'C:\\Users\\User\\OneDrive\\Desktop\\node_modules',
    'C:\\Users\\User\\OneDrive\\node_modules',
    'C:\\Users\\User\\node_modules',
    'C:\\Users\\node_modules',
    'C:\\node_modules'
  ]
}



*/

(function (module, exports, __dirname, __filename, require) {
  var people = ["masud", "rana", "sheikh"];
  var a = 10;
  function test() {
    console.log("this is test");
  }

  module.exports = function
});
