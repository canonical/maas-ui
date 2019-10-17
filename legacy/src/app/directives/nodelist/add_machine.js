import addMachineTmpl from "../../partials/nodelist/add-machine.html";

function addMachine() {
  return {
    restrict: "E",
    scope: true,
    template: addMachineTmpl
  };
}

export default addMachine;
