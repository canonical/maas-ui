const address = require('address');
const colors = require('colors');

console.log("");
console.log("*****************");
console.log("");
console.log("Wait for the React dev server to start and then visit:".red, `http://${address.ip()}:8400`.blue);
console.log("The URL displayed by the React dev server message will be incorrect.".red);
console.log("");
console.log("*****************");
console.log("");