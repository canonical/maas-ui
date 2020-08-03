/* Copyright 2016 Canonical Ltd.  This software is licensed under the
 * GNU Affero General Public License version 3 (see the file LICENSE).
 *
 * Unit tests for SpacesListController.
 */
import angular from "angular";

import { makeInteger, makeName } from "testing/utils";

describe("SpaceDetailsController", function () {
  // Load the MAAS module.
  beforeEach(angular.mock.module("MAAS"));

  // Make a fake space
  function makeSpace() {
    var space = {
      id: makeInteger(1, 10000),
      name: makeName("space"),
    };
    SpacesManager._items.push(space);
    return space;
  }

  // Grab the needed angular pieces.
  var $controller, $rootScope, $location, $scope, $q, $stateParams;
  beforeEach(inject(function ($injector) {
    $controller = $injector.get("$controller");
    $rootScope = $injector.get("$rootScope");
    $rootScope.navigateToLegacy = jest.fn();
    $location = $injector.get("$location");
    $scope = $rootScope.$new();
    $q = $injector.get("$q");
    $stateParams = {};
  }));

  // Load any injected managers and services.
  var SpacesManager, VLANsManager, SubnetsManager, FabricsManager;
  var ControllersManager, UsersManager, ManagerHelperService, ErrorService;
  beforeEach(inject(function ($injector) {
    SpacesManager = $injector.get("SpacesManager");
    VLANsManager = $injector.get("VLANsManager");
    SubnetsManager = $injector.get("SubnetsManager");
    FabricsManager = $injector.get("FabricsManager");
    ControllersManager = $injector.get("ControllersManager");
    UsersManager = $injector.get("UsersManager");
    ManagerHelperService = $injector.get("ManagerHelperService");
    ErrorService = $injector.get("ErrorService");
  }));

  var space;
  beforeEach(function () {
    space = makeSpace();
  });

  // Makes the NodesListController
  function makeController(loadManagerDefer) {
    spyOn(UsersManager, "isSuperUser").and.returnValue(true);
    var loadManagers = spyOn(ManagerHelperService, "loadManagers");
    if (angular.isObject(loadManagerDefer)) {
      loadManagers.and.returnValue(loadManagerDefer.promise);
    } else {
      loadManagers.and.returnValue($q.defer().promise);
    }

    // Create the controller.
    var controller = $controller("SpaceDetailsController", {
      $scope: $scope,
      $rootScope: $rootScope,
      $stateParams: $stateParams,
      $location: $location,
      SpacesManager: SpacesManager,
      VLANsManager: VLANsManager,
      SubnetsManager: SubnetsManager,
      FabricsManager: FabricsManager,
      ControllersManager: ControllersManager,
      UsersManager: UsersManager,
      ManagerHelperService: ManagerHelperService,
      ErrorService: ErrorService,
    });

    return controller;
  }

  // Make the controller and resolve the setActiveItem call.
  function makeControllerResolveSetActiveItem() {
    var setActiveDefer = $q.defer();
    spyOn(SpacesManager, "setActiveItem").and.returnValue(
      setActiveDefer.promise
    );
    var defer = $q.defer();
    var controller = makeController(defer);
    $stateParams.space_id = space.id;

    defer.resolve();
    $rootScope.$digest();
    setActiveDefer.resolve(space);
    $rootScope.$digest();

    return controller;
  }

  it("sets title and page on $rootScope", function () {
    makeController();
    expect($rootScope.title).toBe("Loading...");
    expect($rootScope.page).toBe("networks");
  });

  it("raises error if space identifier is invalid", function () {
    spyOn(SpacesManager, "setActiveItem").and.returnValue($q.defer().promise);
    spyOn(ErrorService, "raiseError").and.returnValue($q.defer().promise);
    var defer = $q.defer();
    makeController(defer);
    $stateParams.space_id = "xyzzy";

    defer.resolve();
    $rootScope.$digest();

    expect($scope.space).toBe(null);
    expect($scope.loaded).toBe(false);
    expect(SpacesManager.setActiveItem).not.toHaveBeenCalled();
    expect(ErrorService.raiseError).toHaveBeenCalled();
  });

  it("doesn't call setActiveItem if space is loaded", function () {
    spyOn(SpacesManager, "setActiveItem").and.returnValue($q.defer().promise);
    var defer = $q.defer();
    makeController(defer);
    SpacesManager._activeItem = space;
    $stateParams.space_id = space.id;

    defer.resolve();
    $rootScope.$digest();

    expect($scope.space).toBe(space);
    expect($scope.loaded).toBe(true);
    expect(SpacesManager.setActiveItem).not.toHaveBeenCalled();
  });

  it("calls setActiveItem if space is not active", function () {
    spyOn(SpacesManager, "setActiveItem").and.returnValue($q.defer().promise);
    var defer = $q.defer();
    makeController(defer);
    $stateParams.space_id = space.id;

    defer.resolve();
    $rootScope.$digest();

    expect(SpacesManager.setActiveItem).toHaveBeenCalledWith(space.id);
  });

  it("sets space and loaded once setActiveItem resolves", function () {
    makeControllerResolveSetActiveItem();
    expect($scope.space).toBe(space);
    expect($scope.loaded).toBe(true);
  });

  it("title is updated once setActiveItem resolves", function () {
    makeControllerResolveSetActiveItem();
    expect($rootScope.title).toBe(space.name);
  });

  it("default space title is not special", function () {
    space.id = 0;
    makeControllerResolveSetActiveItem();
    expect($rootScope.title).toBe(space.name);
  });

  describe("enterEditSummary", function () {
    it("sets editSummary", function () {
      makeController();
      $scope.enterEditSummary();
      expect($scope.editSummary).toBe(true);
    });
  });

  describe("exitEditSummary", function () {
    it("sets editSummary", function () {
      makeController();
      $scope.enterEditSummary();
      $scope.exitEditSummary();
      expect($scope.editSummary).toBe(false);
    });
  });

  describe("canBeDeleted", function () {
    it("returns false if space is null", function () {
      makeControllerResolveSetActiveItem();
      $scope.space = null;
      expect($scope.canBeDeleted()).toBe(false);
    });

    it("returns false if space has subnets", function () {
      makeControllerResolveSetActiveItem();
      $scope.space.subnet_ids = [makeInteger()];
      expect($scope.canBeDeleted()).toBe(false);
    });

    it("returns true if space has no subnets", function () {
      makeControllerResolveSetActiveItem();
      $scope.space.subnet_ids = [];
      expect($scope.canBeDeleted()).toBe(true);
    });
  });

  describe("deleteButton", function () {
    it("confirms delete", function () {
      makeControllerResolveSetActiveItem();
      $scope.deleteButton();
      expect($scope.confirmingDelete).toBe(true);
    });

    it("clears error", function () {
      makeControllerResolveSetActiveItem();
      $scope.error = makeName("error");
      $scope.deleteButton();
      expect($scope.error).toBeNull();
    });
  });

  describe("cancelDeleteButton", function () {
    it("cancels delete", function () {
      makeControllerResolveSetActiveItem();
      $scope.deleteButton();
      $scope.cancelDeleteButton();
      expect($scope.confirmingDelete).toBe(false);
    });
  });

  describe("deleteSpace", function () {
    it("calls deleteSpace and redirects to network list", function () {
      makeController();
      var deleteSpace = spyOn(SpacesManager, "deleteSpace");
      var defer = $q.defer();
      deleteSpace.and.returnValue(defer.promise);
      $scope.deleteConfirmButton();
      defer.resolve();
      $rootScope.$apply();
      expect(deleteSpace).toHaveBeenCalled();
      expect($rootScope.navigateToLegacy).toHaveBeenCalledWith("/networks");
    });
  });
});
