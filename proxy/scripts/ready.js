const address = require('address');
const colors = require('colors');

console.log("");
console.log("*****************");
console.log("");
console.log("All clients have loaded.".green);
console.log("");
console.log("maas-ui is ready to be viewed at", `http://${address.ip()}:8400`.blue);
console.log("");
console.log("When working on the React client it is more performant to run `yarn ui` but beware that the legacy client is unavailable and there may be some CSS differences.");
console.log("");
console.log("*****************");
console.log("");