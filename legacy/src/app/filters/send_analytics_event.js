/* Copyright 2019 Canonical Ltd. This software is licensed under the
 * GNU Affero General Public License version 3 (see the file LICENSE).
 *
 * Sends events to Google Analytics
 */

export function sendAnalyticsEvent() {
  window.ga =
    window.ga ||
    function () {
      return false;
    };
  return function (eventCategory, eventAction, eventLabel) {
    if (eventCategory && eventAction && eventLabel) {
      window.ga("send", "event", eventCategory, eventAction, eventLabel);
    }
  };
}
