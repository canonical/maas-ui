/* Copyright 2016 Canonical Ltd.  This software is licensed under the
 * GNU Affero General Public License version 3 (see the file LICENSE).
 *
 * Release options directive.
 */
import releaseOptionsTmpl from "../partials/directives/release-options.html";

/* @ngInject */
export function maasReleaseOptions(ConfigsManager, ManagerHelperService) {
  return {
    restrict: "E",
    scope: {
      localOptions: "="
    },
    template: releaseOptionsTmpl,
    controller: releaseOptionsController
  };

  /* @ngInject */
  function releaseOptionsController($scope) {
    // Set initial values
    $scope.loading = true;
    $scope.localOptions = {
      enableDiskErasing: false,
      quickErase: false,
      secureErase: false
    };

    // If disk erase is enabled, set other values to global defaults.
    // Otherwise set everything to false.
    $scope.onEraseChange = () => {
      if ($scope.localOptions.enableDiskErasing) {
        $scope.localOptions.secureErase = $scope.globalOptions.secureErase;
        $scope.localOptions.quickErase = $scope.globalOptions.quickErase;
      } else {
        $scope.localOptions.secureErase = false;
        $scope.localOptions.quickErase = false;
      }
    };

    // Load relevant config parameters
    ManagerHelperService.loadManagers($scope, [ConfigsManager]).then(() => {
      $scope.loading = false;
      $scope.globalOptions = {
        enableDiskErasing: ConfigsManager.getItemFromList(
          "enable_disk_erasing_on_release"
        ).value,
        quickErase: ConfigsManager.getItemFromList(
          "disk_erase_with_quick_erase"
        ).value,
        secureErase: ConfigsManager.getItemFromList(
          "disk_erase_with_secure_erase"
        ).value
      };

      // Set default values in release form
      if ($scope.globalOptions.enableDiskErasing) {
        $scope.localOptions.enableDiskErasing =
          $scope.globalOptions.enableDiskErasing;
      }
      $scope.onEraseChange();
    });
  }
}
