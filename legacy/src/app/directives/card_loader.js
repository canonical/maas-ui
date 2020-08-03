/* Copyright 2017 Canonical Ltd.  This software is licensed under the
 * GNU Affero General Public License version 3 (see the file LICENSE).
 *
 * Controller status icon. Used in the controllers listing on the nodes page.
 */

/* @ngInject */
function maasCardLoader($compile) {
  return {
    restrict: "A",
    link: function (scope, element, attrs) {
      const card = require(`../partials/cards/${attrs.maasCardLoader}.html`);
      const content = $compile(card)(scope);
      element.replaceWith(content);
    },
  };
}

export default maasCardLoader;
