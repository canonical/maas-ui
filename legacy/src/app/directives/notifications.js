/* Copyright 2017 Canonical Ltd.  This software is licensed under the
 * GNU Affero General Public License version 3 (see the file LICENSE).
 *
 * Notifications.
 */
import angular from "angular";

import NotificationsTmpl from "../partials/nodelist/notifications.html";

/* @ngInject */
export function maasNotifications(
  $rootScope,
  NotificationsManager,
  ManagerHelperService
) {
  return {
    restrict: "E",
    template: NotificationsTmpl,
    link: function (scope, element, attrs) {
      ManagerHelperService.loadManager(scope, NotificationsManager);

      scope.notifications = NotificationsManager.getItems(
        scope.showReleaseNotification
      );
      scope.dismiss = angular.bind(
        NotificationsManager,
        NotificationsManager.dismiss
      );

      scope.categories = ["error", "warning", "success", "info"];
      scope.categoryTitles = {
        error: "Errors",
        warning: "Warnings",
        success: "Successes",
        info: "Other messages",
      };
      scope.categoryClasses = {
        error: "p-notification--negative",
        warning: "p-notification--caution",
        success: "p-notification--positive",
        info: "p-notification", // No suffix.
      };
      scope.categoryNotifications = {
        error: [],
        warning: [],
        success: [],
        info: [],
      };

      scope.dismissCategory = (category) => {
        const categoryNotifications = scope.notifications.filter(
          (notification) =>
            notification.category === category && notification.dismissable
        );
        categoryNotifications.forEach((notification) => {
          scope.dismiss(notification);
        });
      };

      scope.dismissable = (notifications) =>
        notifications.some(({ dismissable }) => !!dismissable);

      scope.navigateToSettings = () => {
        $rootScope.navigateToNew("/settings");
      };

      scope.$watchCollection("notifications", function () {
        var cns = scope.categoryNotifications;
        angular.forEach(scope.categories, function (category) {
          cns[category].length = 0;
        });
        angular.forEach(scope.notifications, function (notification) {
          cns[notification.category].push(notification);
        });
      });
    },
  };
}
