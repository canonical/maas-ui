import layoutTmpl from "../partials/layout.html";

/* @ngInject */
function layout() {
  console.log('rendering layout')
  return {
    restrict: 'E',
    template: layoutTmpl
  }
}

export default layout;
