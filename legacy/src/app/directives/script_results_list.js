/* Copyright 2017 Canonical Ltd.  This software is licensed under the
 * GNU Affero General Public License version 3 (see the file LICENSE).
 *
 * Script results listing directive.
 *
 */

import scriptResultsListTmpl from "../partials/script-results-list.html";

function maasScriptResultsList() {
  return {
    template: scriptResultsListTmpl,
  };
}

export default maasScriptResultsList;
