/* Copyright 2017-2018 Canonical Ltd.  This software is licensed under the
 * GNU Affero General Public License version 3 (see the file LICENSE).
 *
 * Unit tests for NodesListController.
 */

import { makeInteger, makeName } from "testing/utils";
import MockWebSocket from "testing/websocket";

describe("PodsListController", function () {
  // Load the MAAS module.
  beforeEach(angular.mock.module("MAAS"));

  // Grab the needed angular pieces.
  var $controller, $rootScope, $scope, $q, $location;
  beforeEach(inject(function ($injector) {
    $controller = $injector.get("$controller");
    $rootScope = $injector.get("$rootScope");
    $scope = $rootScope.$new();
    $q = $injector.get("$q");
    $location = $injector.get("$location");
  }));

  // Load the required managers.
  let ControllersManager;
  let GeneralManager;
  let MachinesManager;
  let ManagerHelperService;
  let PodsManager;
  let ResourcePoolsManager;
  let UsersManager;
  let ZonesManager;

  beforeEach(inject(function ($injector) {
    ControllersManager = $injector.get("ControllersManager");
    GeneralManager = $injector.get("GeneralManager");
    MachinesManager = $injector.get("MachinesManager");
    ManagerHelperService = $injector.get("ManagerHelperService");
    PodsManager = $injector.get("PodsManager");
    ResourcePoolsManager = $injector.get("ResourcePoolsManager");
    UsersManager = $injector.get("UsersManager");
    ZonesManager = $injector.get("ZonesManager");
  }));

  // Mock the websocket connection to the region
  var RegionConnection, webSocket;
  beforeEach(inject(function ($injector) {
    RegionConnection = $injector.get("RegionConnection");
    // Mock buildSocket so an actual connection is not made.
    webSocket = new MockWebSocket();
    spyOn(RegionConnection, "buildSocket").and.returnValue(webSocket);
    spyOn(RegionConnection, "callMethod").and.returnValue($q.defer().promise);
  }));

  // Makes the PodsListController
  function makeController(loadManagersDefer) {
    var loadManagers = spyOn(ManagerHelperService, "loadManagers");
    if (angular.isObject(loadManagersDefer)) {
      loadManagers.and.returnValue(loadManagersDefer.promise);
    } else {
      loadManagers.and.returnValue($q.defer().promise);
    }

    // Start the connection so a valid websocket is created in the
    // RegionConnection.
    RegionConnection.connect("");

    // Create the controller.
    var controller = $controller("PodsListController", {
      $scope: $scope,
      $rootScope: $rootScope,
      $location: $location,
      PodsManager: PodsManager,
      UsersManager: UsersManager,
      ZonesManager: ZonesManager,
      MachinesManager: MachinesManager,
      ManagerHelperService: ManagerHelperService,
    });

    return controller;
  }

  // Makes a fake node/device.
  var podId = 0;
  function makePod() {
    var pod = {
      id: podId++,
      $selected: false,
      permissions: [],
    };
    PodsManager._items.push(pod);
    return pod;
  }

  it("sets title and page on $rootScope if KVM", function () {
    makeController();
    expect($rootScope.title).toBe("KVM");
    expect($rootScope.page).toBe("kvm");
  });

  it("sets title and page on $rootScope if RSD", function () {
    makeController();
    $location.path("/rsd");
    $scope.$on("$routeChangeSuccess", function () {
      expect($rootScope.title).toBe("RSD");
      expect($rootScope.page).toBe("rsd");
    });
  });

  it("sets initial values on $scope", function () {
    // tab-independent variables.
    makeController();
    expect($scope.pods).toBe(PodsManager.getItems());
    expect($scope.loading).toBe(true);
    expect($scope.filteredItems).toEqual([]);
    expect($scope.selectedItems).toBe(PodsManager.getSelectedItems());
    expect($scope.predicate).toBe("name");
    expect($scope.allViewableChecked).toBe(false);
    expect($scope.action.option).toBeNull();
    expect($scope.add.open).toBe(false);
    expect($scope.powerTypes).toBe(GeneralManager.getData("power_types"));
    expect($scope.zones).toBe(ZonesManager.getItems());
    expect($scope.pools).toBe(ResourcePoolsManager.getItems());
  });

  it(`calls loadManagers with PodsManager, MachinesManager, ControllersManager,
    UsersManager, GeneralManager, ZonesManager`, () => {
    makeController();
    expect(ManagerHelperService.loadManagers).toHaveBeenCalledWith($scope, [
      PodsManager,
      MachinesManager,
      ControllersManager,
      UsersManager,
      GeneralManager,
      ZonesManager,
      ResourcePoolsManager,
    ]);
  });

  it("sets loading to false with loadManagers resolves", function () {
    var defer = $q.defer();
    makeController(defer);
    defer.resolve();
    $rootScope.$digest();
    expect($scope.loading).toBe(false);
  });

  describe("isRackControllerConnected", function () {
    it("returns false no powerTypes", function () {
      makeController();
      $scope.powerTypes = [];
      expect($scope.isRackControllerConnected()).toBe(false);
    });

    it("returns true if powerTypes", function () {
      makeController();
      $scope.powerTypes = [{}];
      expect($scope.isRackControllerConnected()).toBe(true);
    });
  });

  describe("canAddPod", function () {
    it("returns false if not global permission", function () {
      makeController();
      spyOn(UsersManager, "hasGlobalPermission").and.returnValue(false);
      spyOn($scope, "isRackControllerConnected").and.returnValue(true);
      expect($scope.canAddPod()).toBe(false);
      expect(UsersManager.hasGlobalPermission).toHaveBeenCalledWith(
        "pod_create"
      );
    });

    it("returns false if rack disconnected", function () {
      makeController();
      spyOn(UsersManager, "hasGlobalPermission").and.returnValue(true);
      spyOn($scope, "isRackControllerConnected").and.returnValue(false);
      expect($scope.canAddPod()).toBe(false);
    });

    it("returns true if super user, rack connected", function () {
      makeController();
      spyOn(UsersManager, "hasGlobalPermission").and.returnValue(true);
      spyOn($scope, "isRackControllerConnected").and.returnValue(true);
      expect($scope.canAddPod()).toBe(true);
      expect(UsersManager.hasGlobalPermission).toHaveBeenCalledWith(
        "pod_create"
      );
    });
  });

  describe("showActions", function () {
    it("returns false if no permissions on pods", function () {
      makeController();
      var pod = makePod();
      PodsManager._items.push(pod);
      expect($scope.showActions()).toBe(false);
    });

    it("returns false if compose permissions on pods", function () {
      makeController();
      var pod = makePod();
      pod.permissions.push("compose");
      PodsManager._items.push(pod);
      expect($scope.showActions()).toBe(false);
    });

    it("returns true if edit permissions on pods", function () {
      makeController();
      var pod = makePod();
      pod.permissions.push("edit");
      PodsManager._items.push(pod);
      expect($scope.showActions()).toBe(true);
    });
  });

  describe("toggleChecked", function () {
    var pod;
    beforeEach(function () {
      makeController();
      pod = makePod();
      $scope.filteredItems = $scope.pods;
    });

    it("selects object", function () {
      $scope.toggleChecked(pod);
      expect(pod.$selected).toBe(true);
    });

    it("deselects object", function () {
      PodsManager.selectItem(pod.id);
      $scope.toggleChecked(pod);
      expect(pod.$selected).toBe(false);
    });

    it("sets allViewableChecked to true when all objects selected", function () {
      $scope.toggleChecked(pod);
      expect($scope.allViewableChecked).toBe(true);
    });

    it(
      "sets allViewableChecked to false when not all objects " + "selected",
      function () {
        makePod();
        $scope.toggleChecked(pod);
        expect($scope.allViewableChecked).toBe(false);
      }
    );

    it(
      "sets allViewableChecked to false when selected and " + "deselected",
      function () {
        $scope.toggleChecked(pod);
        $scope.toggleChecked(pod);
        expect($scope.allViewableChecked).toBe(false);
      }
    );

    it("clears action option when none selected", function () {
      $scope.action.option = {};
      $scope.toggleChecked(pod);
      $scope.toggleChecked(pod);
      expect($scope.action.option).toBeNull();
    });
  });

  describe("toggleCheckAll", function () {
    var pod1, pod2;
    beforeEach(function () {
      makeController();
      pod1 = makePod();
      pod2 = makePod();
      $scope.filteredItems = $scope.pods;
    });

    it("selects all objects", function () {
      $scope.toggleCheckAll();
      expect(pod1.$selected).toBe(true);
      expect(pod2.$selected).toBe(true);
    });

    it("deselects all objects", function () {
      $scope.toggleCheckAll();
      $scope.toggleCheckAll();
      expect(pod1.$selected).toBe(false);
      expect(pod2.$selected).toBe(false);
    });

    it("clears action option when none selected", function () {
      $scope.action.option = {};
      $scope.toggleCheckAll();
      $scope.toggleCheckAll();
      expect($scope.action.option).toBeNull();
    });
  });

  describe("sortTable", function () {
    it("sets predicate", function () {
      makeController();
      var predicate = makeName("predicate");
      $scope.sortTable(predicate);
      expect($scope.predicate).toBe(predicate);
    });

    it("reverses reverse", function () {
      makeController();
      $scope.reverse = true;
      $scope.sortTable(makeName("predicate"));
      expect($scope.reverse).toBe(false);
    });
  });

  describe("actionCancel", function () {
    it("sets actionOption to null", function () {
      makeController();
      $scope.action.option = {};
      $scope.actionCancel();
      expect($scope.action.option).toBeNull();
    });

    it("resets actionProgress", function () {
      makeController();
      $scope.action.progress.total = makeInteger(1, 10);
      $scope.action.progress.completed = makeInteger(1, 10);
      $scope.action.progress.errors = makeInteger(1, 10);
      $scope.actionCancel();
      expect($scope.action.progress.total).toBe(0);
      expect($scope.action.progress.completed).toBe(0);
      expect($scope.action.progress.errors).toBe(0);
    });
  });

  describe("actionGo and performAction", () => {
    it("calls performAction", () => {
      makeController();
      let spy = spyOn($scope, "performAction");
      $scope.podToAction = makePod();
      $scope.action.option = {
        name: "refresh",
        operation: () => false,
        isSingle: true,
      };
      $scope.actionGo();
      expect(spy).toHaveBeenCalled();
    });

    it("sets action.progress.total to the number of selectedItems", () => {
      makeController();
      makePod();
      $scope.action.option = { name: "refresh" };
      $scope.action.selectedItems = [makePod(), makePod(), makePod()];
      $scope.actionGo();
      expect($scope.action.progress.total).toBe($scope.selectedItems.length);
    });

    it("calls operation for selected action", () => {
      makeController();
      let pod = makePod();
      let spy = spyOn(PodsManager, "refresh").and.returnValue(
        $q.defer().promise
      );
      $scope.action.option = { name: "refresh", operation: spy };
      $scope.selectedItems = [pod];
      $scope.actionGo();
      expect(spy).toHaveBeenCalledWith(pod);
    });

    it("calls unselectItem after failed action", () => {
      makeController();
      let pod = makePod();
      pod.action_failed = false;
      spyOn($scope, "hasActionsFailed").and.returnValue(true);
      let defer = $q.defer();
      let refresh = jasmine.createSpy("refresh").and.returnValue(defer.promise);
      let spy = spyOn(PodsManager, "unselectItem");
      $scope.action.option = {
        name: "refresh",
        operation: refresh,
      };
      $scope.selectedItems = [pod];
      $scope.actionGo();
      defer.resolve();
      $scope.$digest();
      expect(spy).toHaveBeenCalled();
    });

    it("keeps items selected after success", () => {
      makeController();
      let pod = makePod();
      spyOn($scope, "hasActionsFailed").and.returnValue(false);
      spyOn($scope, "hasActionsInProgress").and.returnValue(false);
      let defer = $q.defer();
      let refresh = jasmine.createSpy("refresh").and.returnValue(defer.promise);
      $scope.action.option = { name: "refresh", operation: refresh };
      $scope.selectedItems = [pod];
      $scope.actionGo();
      defer.resolve();
      $scope.$digest();
      expect($scope.selectedItems).toEqual([pod]);
    });

    it(`increments action.progress.completed
        after action complete`, () => {
      makeController();
      let pod = makePod();
      let defer = $q.defer();
      let refresh = jasmine.createSpy("refresh").and.returnValue(defer.promise);
      spyOn($scope, "hasActionsFailed").and.returnValue(true);
      $scope.action.option = { name: "start", operation: refresh };
      $scope.selectedItems = [pod];
      $scope.actionGo();
      defer.resolve();
      $scope.$digest();
      expect($scope.action.progress.completed).toBe(1);
    });

    it("clears action option when complete", () => {
      makeController();
      let pod = makePod();
      let defer = $q.defer();
      let refresh = jasmine.createSpy("refresh").and.returnValue(defer.promise);
      spyOn($scope, "hasActionsFailed").and.returnValue(true);
      spyOn($scope, "hasActionsInProgress").and.returnValue(false);
      PodsManager._items.push(pod);
      PodsManager._selectedItems.push(pod);
      $scope.action.option = { name: "refresh", operation: refresh };
      $scope.actionGo();
      defer.resolve();
      $scope.$digest();
      expect($scope.action.option).toBeNull();
    });

    it("increments action.progress.errors after action error", () => {
      makeController();
      let pod = makePod();
      let defer = $q.defer();
      let refresh = jasmine.createSpy("refresh").and.returnValue(defer.promise);
      $scope.action.option = { name: "refresh", operation: refresh };
      $scope.selectedItems = [pod];
      $scope.actionGo();
      defer.reject(makeName("error"));
      $scope.$digest();
      expect($scope.action.progress.errors).toBe(1);
    });

    it("adds error to action.progress.errors on action error", () => {
      makeController();
      let pod = makePod();
      let defer = $q.defer();
      let refresh = jasmine.createSpy("refresh").and.returnValue(defer.promise);
      $scope.action.option = { name: "refresh", operation: refresh };
      $scope.selectedItems = [pod];
      $scope.actionGo();
      let error = makeName("error");
      defer.reject(error);
      $scope.$digest();
      expect(pod.action_error).toBe(error);
      expect(pod.action_failed).toBe(true);
    });
  });

  describe("hasActionsInProgress", function () {
    it("returns false if action.progress.total not > 0", function () {
      makeController();
      $scope.action.progress.total = 0;
      expect($scope.hasActionsInProgress()).toBe(false);
    });

    it("returns true if action.progress total != completed", function () {
      makeController();
      $scope.action.progress.total = 1;
      $scope.action.progress.completed = 0;
      expect($scope.hasActionsInProgress()).toBe(true);
    });

    it("returns false if actionProgress total == completed", function () {
      makeController();
      $scope.action.progress.total = 1;
      $scope.action.progress.completed = 1;
      expect($scope.hasActionsInProgress()).toBe(false);
    });
  });

  describe("hasActionsFailed", function () {
    it("returns false if no errors", function () {
      makeController();
      $scope.action.progress.errors = 0;
      expect($scope.hasActionsFailed()).toBe(false);
    });

    it("returns true if errors", function () {
      makeController();
      $scope.action.progress.errors = 1;
      expect($scope.hasActionsFailed()).toBe(true);
    });
  });

  describe("addPod", function () {
    function makeZone(id) {
      var zone = {
        name: makeName("name"),
      };
      if (angular.isDefined(id)) {
        zone.id = id;
      } else {
        zone.id = makeInteger(1, 100);
      }
      return zone;
    }

    function makePool(id) {
      var pool = {
        name: makeName("pool"),
      };
      if (angular.isDefined(id)) {
        pool.id = id;
      } else {
        pool.id = makeInteger(1, 100);
      }
      return pool;
    }

    it("sets add.open to true", function () {
      makeController();
      var zero = makeZone(0);
      ZonesManager._items.push(makeZone());
      ZonesManager._items.push(zero);
      var defaultPool = makePool(0);
      ResourcePoolsManager._items.push(makePool());
      ResourcePoolsManager._items.push(defaultPool);
      $scope.addPod();
      expect($scope.add.open).toBe(true);
      expect($scope.add.obj.cpu_over_commit_ratio).toBe(1);
      expect($scope.add.obj.memory_over_commit_ratio).toBe(1);
      expect($scope.add.obj.default_pool).toBe(0);
      expect(ZonesManager.getDefaultZone()).toBe(zero);
      expect(ResourcePoolsManager.getDefaultPool()).toBe(defaultPool);
    });
  });

  describe("cancelAddPod", function () {
    it("set add.open to false and clears add.obj", function () {
      makeController();
      var obj = {};
      $scope.add.obj = obj;
      $scope.add.open = true;
      $scope.cancelAddPod();
      expect($scope.add.open).toBe(false);
      expect($scope.add.obj).toEqual({});
      expect($scope.add.obj).not.toBe(obj);
    });
  });

  describe("getPowerTypeTitle", function () {
    it("returns power_type description", function () {
      makeController();
      $scope.powerTypes = [
        {
          name: "power_type",
          description: "Power type",
        },
      ];
      expect($scope.getPowerTypeTitle("power_type")).toBe("Power type");
    });

    it("returns power_type passed in", function () {
      makeController();
      $scope.powerTypes = [];
      expect($scope.getPowerTypeTitle("power_type")).toBe("power_type");
    });
  });

  describe("onRSDSection", function () {
    it("returns true if URL is 'rsd'", function () {
      makeController();
      $location.path("/rsd");
      expect($scope.onRSDSection()).toBe(true);
    });

    it("returns false if URL is 'kvm'", function () {
      makeController();
      $location.path("/kvm");
      expect($scope.onRSDSection()).toBe(false);
    });
  });

  describe("filterPods", function () {
    it("returns only rsd if on rsd page", function () {
      makeController();
      $location.path("/rsd");
      var pods = [{ type: "virsh" }, { type: "rsd" }, { type: "virsh" }];
      expect($scope.filterPods(pods)).toEqual([{ type: "rsd" }]);
    });

    it("returns only kvm if on kvm page", function () {
      makeController();
      var pods = [{ type: "virsh" }, { type: "rsd" }, { type: "virsh" }];
      expect($scope.filterPods(pods)).toEqual([
        { type: "virsh" },
        { type: "virsh" },
      ]);
    });
  });

  describe("getPageHeading", function () {
    it("returns RSD if on rsd page", function () {
      makeController();
      $location.path("/rsd");
      expect($scope.getPageHeading()).toBe("RSD");
    });

    it("returns KVM if on kvm page", function () {
      makeController();
      expect($scope.getPageHeading()).toBe("KVM");
    });
  });

  describe("getDetailsRoute", function () {
    it("returns rsd if on rsd page", function () {
      makeController();
      $location.path("/rsd");
      expect($scope.getDetailsRoute()).toBe("rsd");
    });

    it("returns kvm if on kvm page", function () {
      makeController();
      expect($scope.getDetailsRoute()).toBe("kvm");
    });
  });

  describe("getDefaultPoolData", function () {
    it("returns data for default pool", function () {
      makeController();

      $scope.pods = [
        {
          default_storage_pool: "foo",
          storage_pools: [
            {
              id: "foo",
              name: "firstpool",
            },
            {
              id: "bar",
              name: "secondpool",
            },
          ],
        },
      ];

      expect($scope.getDefaultPoolData($scope.pods[0])).toEqual(
        $scope.pods[0].storage_pools[0]
      );
    });
  });

  describe("getTotalNetworkDiskSize", function () {
    it("returns total network size", function () {
      makeController();

      $scope.pods = [
        {
          default_storage_pool: "foo",
          storage_pools: [
            {
              id: "foo",
              name: "firstpool",
              total: 53424,
            },
            {
              id: "bar",
              name: "secondpool",
              total: 64939,
            },
            {
              id: "baz",
              name: "thirdpool",
              total: 93829,
            },
          ],
        },
      ];

      expect($scope.getTotalNetworkDiskSize($scope.pods[0])).toEqual(158768);
    });
  });

  describe("getMeterValue", function () {
    it(
      "returns given value if more than 3% of total and " +
        "greater than 0% of total",
      function () {
        makeController();
        expect($scope.getMeterValue(679, 598)).toBe(598);
      }
    );

    it(
      "returns 3% of total if value is less than or " + "equal to 3% of total",
      function () {
        makeController();
        expect($scope.getMeterValue(257, 3)).toBe(8);
      }
    );

    it("returns 0 if value is 0", function () {
      makeController();
      expect($scope.getMeterValue(473, 0)).toBe(0);
    });
  });

  describe("handleMachineAction", () => {
    it("sets action name to same as action argument", () => {
      makeController();
      $scope.action.option = { name: "foo" };
      $scope.handleMachineAction({}, "refresh");
      expect($scope.action.option.name).toBe("refresh");
    });

    it("adds a isSingle property to action", () => {
      makeController();
      $scope.action.option = { name: "foo" };
      $scope.handleMachineAction({}, "refresh");
      expect($scope.action.option.isSingle).toBeDefined();
      expect($scope.action.option.isSingle).toBe(true);
    });
  });

  describe("getItemName", () => {
    it("returns undefined if no arguments", () => {
      makeController();
      expect($scope.getItemName()).toBeUndefined();
    });

    it("returns undefined if id argument is not a number", () => {
      makeController();
      expect($scope.getItemName(null, [])).toBeUndefined();
    });

    it("returns undefined if items argument is not an array", () => {
      makeController();
      expect($scope.getItemName(2, null)).toBeUndefined();
    });

    it("returns item name", () => {
      makeController();
      let items = [
        { id: 0, name: "foo" },
        { id: 1, name: "bar" },
        { id: 2, name: "baz" },
      ];
      expect($scope.getItemName(2, items)).toBe("baz");
    });
  });

  describe("getPowerIconClass", () => {
    it("returns unknown if pod does not have a host", () => {
      makeController();
      const pod = { id: 1, host: undefined };
      expect($scope.getPowerIconClass(pod)).toEqual("p-icon--power-unknown");
    });

    it(`returns spinner if pod has a host but host details are not yet stored
        in hostMap`, () => {
      makeController();
      const pod = { id: 1, host: "abc" };
      expect($scope.getPowerIconClass(pod)).toEqual(
        "p-icon--spinner u-animation--spin"
      );
    });

    it("returns power state of pod host if details are stored in hostMap", () => {
      makeController();
      const host = { system_id: "abc", power_state: "on" };
      const pod = { id: 1, host: host.system_id };
      $scope.hostMap.set(pod.id, host);
      expect($scope.getPowerIconClass(pod)).toEqual("p-icon--power-on");
    });
  });

  describe("getPodOwners", () => {
    it("returns a list of unique owners of pod VMs", () => {
      makeController();
      const pod = { id: 1 };
      $scope.machines = [
        { owner: "user1", pod: { id: 1 } },
        { owner: "user1", pod: { id: 1 } },
        { owner: "user2", pod: { id: 1 } },
        { owner: "user3", pod: { id: 1 } },
        { owner: "user4", pod: { id: 2 } },
      ];
      expect($scope.getPodOwners(pod)).toEqual(["user1", "user2", "user3"]);
    });
  });

  describe("getPodHost", () => {
    it("can get the machine that is associated with a pod", () => {
      makeController();
      const pod = { id: 1, host: "abc", name: "pod-1" };
      const [hostMachine, otherMachine] = [
        { system_id: "abc" },
        { system_id: "def" },
      ];
      $scope.machines = [hostMachine, otherMachine];
      expect($scope.getPodHost(pod)).toEqual(hostMachine);
    });

    it("can get the controller that is associated with a pod", () => {
      makeController();
      const pod = { id: 1, host: "abc", name: "pod-1" };
      const [hostController, otherController] = [
        { system_id: "abc" },
        { system_id: "def" },
      ];
      $scope.controllers = [hostController, otherController];
      expect($scope.getPodHost(pod)).toEqual(hostController);
    });
  });

  describe("getPodOSName", () => {
    it("returns host's OS info", () => {
      makeController();
      const pod = { id: 1, host: "abc" };
      $scope.hostMap.set(1, {
        system_id: "abc",
        distro_series: "centos70",
        osystem: "centos",
      });
      $scope.osInfo = {
        releases: [["centos/centos70", "CentOS 7"]],
      };
      expect($scope.getPodOSName(pod)).toEqual("CentOS 7");
    });

    it("returns trimmed host OS info if OS is ubuntu", () => {
      makeController();
      const pod = { id: 1, host: "abc" };
      $scope.hostMap.set(1, {
        system_id: "abc",
        distro_series: "bionic",
        osystem: "ubuntu",
      });
      $scope.osInfo = {
        releases: [["ubuntu/bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"']],
      };
      expect($scope.getPodOSName(pod)).toEqual("Ubuntu 18.04 LTS");
    });

    it("returns unformatted OS info if MAAS does not know about the release", () => {
      makeController();
      const pod = { id: 1, host: "abc" };
      $scope.hostMap.set(1, {
        system_id: "abc",
        distro_series: "focal",
        osystem: "ubuntu",
      });
      $scope.osInfo = {
        releases: [["ubuntu/bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"']],
      };
      expect($scope.getPodOSName(pod)).toEqual("ubuntu/focal");
    });

    it("returns unknown if the pod does not have a host", () => {
      makeController();
      const pod = { id: 1, host: undefined };
      expect($scope.getPodOSName(pod)).toEqual("Unknown");
    });
  });

  describe("getPodTotalStorage", () => {
    it("can correctly calculate the total storage of an lxd pod", () => {
      makeController();
      const pod = {
        type: "lxd",
        total: { local_storage: 123 },
        storage_pools: [{ total: 100 }, { total: 200 }],
      };
      expect($scope.getPodTotalStorage(pod)).toEqual(300);
    });

    it("correctly returns the total storage of a non-lxd pod", () => {
      makeController();
      const pod = {
        type: "virsh",
        total: { local_storage: 123 },
        storage_pools: [{ total: 100 }, { total: 200 }],
      };
      expect($scope.getPodTotalStorage(pod)).toEqual(123);
    });
  });

  describe("formatMemory", () => {
    it("correctly formats memory", () => {
      makeController();
      expect($scope.formatMemory(0)).toEqual("0 GiB");
      expect($scope.formatMemory(300)).toEqual("0.29 GiB");
      expect($scope.formatMemory(1024)).toEqual("1 GiB");
      expect($scope.formatMemory(3000)).toEqual("2.9 GiB");
    });
  });
});
