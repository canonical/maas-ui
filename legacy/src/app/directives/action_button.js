/* Copyright 2015-2016 Canonical Ltd.  This software is licensed under the
 * GNU Affero General Public License version 3 (see the file LICENSE).
 *
 * Action button directive.
 */

const actionBtnTmpl = [
  '<button data-ng-transclude class="p-action-button" ',
  "data-ng-class=\"{ 'is-indeterminate': indeterminateState, ",
  "'is-done': doneState }\">",
  "</button>",
].join("");

export function maasActionButton() {
  return {
    restrict: "E",
    replace: true,
    transclude: true,
    scope: {
      doneState: "<",
      indeterminateState: "<",
    },
    template: actionBtnTmpl,
  };
}
