/* Copyright 2015-2016 Canonical Ltd.  This software is licensed under the
 * GNU Affero General Public License version 3 (see the file LICENSE).
 *
 * Error overlay.
 *
 * Directive overrides the entire transcluded element if an error occurs or
 * connection to the region over the websocket fails or becomes disconnected.
 */
import angular from "angular";

import errorOverlayTmpl from "../partials/directives/error_overlay.html";

/* @ngInject */
export function maasErrorOverlay(
  $window,
  $timeout,
  RegionConnection,
  ErrorService
) {
  return {
    restrict: "A",
    transclude: true,
    scope: true,
    template: errorOverlayTmpl,
    link: function(scope) {
      scope.connected = false;
      scope.showDisconnected = false;
      scope.clientError = false;
      scope.wasConnected = false;

      // Holds the promise that sets showDisconnected to true. Will
      // be cleared when the scope is destroyed.
      var markDisconnected;

      // Returns true when the overlay should be shown.
      scope.show = function() {
        // Always show if clientError.
        if (scope.clientError) {
          return true;
        }
        // Never show if connected.
        if (scope.connected) {
          return false;
        }
        // Never been connected then always show.
        if (!scope.wasConnected) {
          return true;
        }
        // Not connected.
        return scope.showDisconnected;
      };

      // Returns the title for the header.
      scope.getTitle = function() {
        if (scope.clientError) {
          return "Error occurred";
        } else if (scope.wasConnected) {
          return "Connection lost, reconnecting...";
        } else {
          return "Connecting...";
        }
      };

      // Called to reload the page.
      scope.reload = function() {
        $window.location.reload();
      };

      // Called to when the connection status of the region
      // changes. Updates the scope connected and error values.
      var watchConnection = function() {
        // Do nothing if already a client error.
        if (scope.clientError) {
          return;
        }

        // Set connected and the time it changed.
        var connected = RegionConnection.isConnected();
        if (connected !== scope.connected) {
          scope.connected = connected;
          if (!connected) {
            scope.showDisconnected = false;

            // Show disconnected after 1/2 second. This removes
            // the flicker that can occur, if it disconnecets
            // and reconnected quickly.
            markDisconnected = $timeout(function() {
              scope.showDisconnected = true;
              markDisconnected = undefined;
            }, 500);
          }
        }

        // Set error and whether of not the connection
        // has ever been made.
        scope.error = RegionConnection.error;
        if (!scope.wasConnected && connected) {
          scope.wasConnected = true;
        }
      };

      // Watch the isConnected and error value on the
      // RegionConnection.
      scope.$watch(function() {
        return RegionConnection.isConnected();
      }, watchConnection);
      scope.$watch(function() {
        return RegionConnection.error;
      }, watchConnection);

      // Called then the error value on the ErrorService changes.
      var watchError = function() {
        var error = ErrorService._error;
        if (angular.isString(error)) {
          scope.clientError = true;
          scope.error = ErrorService._error;
        }
      };

      // Watch _error on the ErrorService.
      scope.$watch(function() {
        return ErrorService._error;
      }, watchError);

      // Cancel the timeout on scope destroy.
      scope.$on("$destroy", function() {
        if (angular.isDefined(markDisconnected)) {
          $timeout.cancel(markDisconnected);
        }
      });
    }
  };
}
