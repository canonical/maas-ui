/* Copyright 2016 Canonical Ltd.  This software is licensed under the
 * GNU Affero General Public License version 3 (see the file LICENSE).
 *
 * MAAS Intro Controller
 */
import angular from "angular";

/* @ngInject */
function IntroUserController(
  $rootScope,
  $scope,
  $window,
  $location,
  UsersManager,
  ManagerHelperService
) {
  $rootScope.page = "intro";
  $rootScope.title = "Welcome";

  $scope.loading = true;
  $scope.user = null;

  // Set the skip function on the rootScope to allow skipping the
  // intro view.
  $rootScope.skip = function () {
    $scope.clickContinue(true);
  };

  // Return true if super user.
  $scope.isSuperUser = function () {
    return UsersManager.isSuperUser();
  };

  // Return true if continue can be clicked.
  $scope.canContinue = function () {
    return $scope.user.sshkeys_count > 0;
  };

  const redirectToMachineList = () => {
    window.history.pushState(
      null,
      null,
      `${process.env.BASENAME}${process.env.REACT_BASENAME}/machines`
    );
  };

  // Called when continue button is clicked.
  $scope.clickContinue = function (force) {
    if (angular.isUndefined(force)) {
      force = false;
    }
    if (force || $scope.canContinue()) {
      UsersManager.markIntroComplete().then(function () {
        redirectToMachineList();
      });
    }
  };

  if ($window.CONFIG.current_user.completed_intro) {
    redirectToMachineList();
  } else {
    // Load the required managers.
    ManagerHelperService.loadManager($scope, UsersManager).then(function () {
      $scope.loading = false;
      $scope.user = UsersManager.getAuthUser();
    });
  }
}

export default IntroUserController;
