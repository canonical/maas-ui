/* Copyright 2015-2018 Canonical Ltd.  This software is licensed under the
 * GNU Affero General Public License version 3 (see the file LICENSE).
 *
 * Unit tests for NodesListController.
 */
import angular from "angular";

import { makeInteger, makeName } from "testing/utils";
import MockWebSocket from "testing/websocket";

describe("NodesListController", function () {
  // Load the MAAS module.
  beforeEach(angular.mock.module("MAAS"));

  // Grab the needed angular pieces.
  var $controller, $rootScope, $scope, $q, $stateParams, $location;
  beforeEach(inject(function ($injector) {
    $controller = $injector.get("$controller");
    $rootScope = $injector.get("$rootScope");
    $rootScope.navigateToNew = jest.fn();
    $location = $injector.get("$location");
    $scope = $rootScope.$new();
    $q = $injector.get("$q");
    $stateParams = {};
  }));

  // Load the required managers.
  var MachinesManager,
    DevicesManager,
    ControllersManager,
    GeneralManager,
    ZonesManager,
    UsersManager,
    ServicesManager,
    TagsManager;
  var ManagerHelperService, SearchService;
  var ScriptsManager, VLANsManager;
  beforeEach(inject(function ($injector) {
    MachinesManager = $injector.get("MachinesManager");
    DevicesManager = $injector.get("DevicesManager");
    ControllersManager = $injector.get("ControllersManager");
    GeneralManager = $injector.get("GeneralManager");
    ZonesManager = $injector.get("ZonesManager");
    UsersManager = $injector.get("UsersManager");
    ServicesManager = $injector.get("ServicesManager");
    ManagerHelperService = $injector.get("ManagerHelperService");
    SearchService = $injector.get("SearchService");
    ScriptsManager = $injector.get("ScriptsManager");
    VLANsManager = $injector.get("VLANsManager");
    TagsManager = $injector.get("TagsManager");
  }));

  // Mock the websocket connection to the region
  var RegionConnection, webSocket;
  beforeEach(inject(function ($injector) {
    RegionConnection = $injector.get("RegionConnection");
    // Mock buildSocket so an actual connection is not made.
    webSocket = new MockWebSocket();
    spyOn(RegionConnection, "getWebSocket").and.returnValue(webSocket);
    spyOn(RegionConnection, "callMethod").and.returnValue($q.defer().promise);
  }));

  // Makes the NodesListController
  function makeController(loadManagersDefer, defaultConnectDefer) {
    var loadManagers = spyOn(ManagerHelperService, "loadManagers");
    if (angular.isObject(loadManagersDefer)) {
      loadManagers.and.returnValue(loadManagersDefer.promise);
    } else {
      loadManagers.and.returnValue($q.defer().promise);
    }

    var defaultConnect = spyOn(RegionConnection, "defaultConnect");
    if (angular.isObject(defaultConnectDefer)) {
      defaultConnect.and.returnValue(defaultConnectDefer.promise);
    } else {
      defaultConnect.and.returnValue($q.defer().promise);
    }

    if ($location.path() === "") {
      $location.path("/controllers");
    }

    // Start the connection so a valid websocket is created in the
    // RegionConnection.
    RegionConnection.connect("");

    // Create the controller.
    var controller = $controller("NodesListController", {
      $q: $q,
      $scope: $scope,
      $rootScope: $rootScope,
      $stateParams: $stateParams,
      $location: $location,
      MachinesManager: MachinesManager,
      DevicesManager: DevicesManager,
      ControllersManager: ControllersManager,
      GeneralManager: GeneralManager,
      ZonesManager: ZonesManager,
      UsersManager: UsersManager,
      ServicesManager: ServicesManager,
      ManagerHelperService: ManagerHelperService,
      SearchService: SearchService,
      ScriptsManager: ScriptsManager,
    });
    return controller;
  }

  // Makes a fake node/device.
  function makeObject(tab) {
    if (tab === "devices") {
      var device = {
        system_id: makeName("system_id"),
        $selected: false,
      };
      DevicesManager._items.push(device);
      return device;
    } else if (tab === "controllers") {
      var controller = {
        system_id: makeName("system_id"),
        $selected: false,
      };
      ControllersManager._items.push(controller);
      return controller;
    }
    return null;
  }

  it("sets title and page on $rootScope", function () {
    makeController();
    expect($rootScope.title).toBe("Controllers");
    expect($rootScope.page).toBe("controllers");
  });

  it("sets initial values on $scope", function () {
    // tab-independent variables.
    makeController();
    expect($scope.devices).toBe(DevicesManager.getItems());
    expect($scope.controllers).toBe(ControllersManager.getItems());
    expect($scope.loading).toBe(true);
  });

  it(`saves current filters for nodes and
      devices when scope destroyed`, function () {
    makeController();
    var devicesFilters = {};
    var controllersFilters = {};
    $scope.tabs.devices.filters = devicesFilters;
    $scope.tabs.controllers.filters = controllersFilters;
    $scope.$destroy();
    expect(SearchService.retrieveFilters("devices")).toBe(devicesFilters);
    expect(SearchService.retrieveFilters("controllers")).toBe(
      controllersFilters
    );
  });

  angular.forEach(["devices", "controllers"], function (node_type) {
    it("calls loadManagers for " + node_type, function () {
      $location.path("/" + node_type);
      makeController();
      var page_managers = [$scope.tabs[node_type].manager];
      if ($scope.currentpage === "controllers") {
        page_managers.push(ScriptsManager);
        page_managers.push(VLANsManager);
      }
      expect(ManagerHelperService.loadManagers).toHaveBeenCalledWith(
        $scope,
        page_managers.concat([
          GeneralManager,
          ZonesManager,
          UsersManager,
          ServicesManager,
          TagsManager,
        ])
      );
    });
  });

  it("sets loading to false with loadManagers resolves", function () {
    var defer = $q.defer();
    makeController(defer);
    defer.resolve();
    $rootScope.$digest();
    expect($scope.loading).toBe(false);
  });

  it("sets nodes search from SearchService", function () {
    var query = makeName("query");
    SearchService.storeFilters(
      "controllers",
      SearchService.getCurrentFilters(query)
    );
    makeController();
    expect($scope.tabs.controllers.search).toBe(query);
  });

  it("sets devices search from SearchService", function () {
    var query = makeName("query");
    SearchService.storeFilters(
      "devices",
      SearchService.getCurrentFilters(query)
    );
    makeController();
    expect($scope.tabs.devices.search).toBe(query);
  });

  it("sets controllers search from SearchService", function () {
    var query = makeName("query");
    SearchService.storeFilters(
      "controllers",
      SearchService.getCurrentFilters(query)
    );
    makeController();
    expect($scope.tabs.controllers.search).toBe(query);
  });

  it("sets nodes search from $stateParams.query", function () {
    var query = makeName("query");
    $stateParams.query = query;
    makeController();
    expect($scope.tabs.controllers.search).toBe(query);
  });

  it(`calls updateFilters for nodes if search
      from $stateParams.query`, function () {
    var query = makeName("query");
    $stateParams.query = query;
    makeController();
    expect($scope.tabs.controllers.filters._).toEqual([query]);
  });

  describe("toggleTab", function () {
    it("sets $rootScope.title", function () {
      makeController();
      $scope.toggleTab("devices");
      expect($rootScope.title).toBe($scope.tabs.devices.pagetitle);
      $scope.toggleTab("controllers");
      expect($rootScope.title).toBe($scope.tabs.controllers.pagetitle);
    });

    it("sets currentpage and $rootScope.page", function () {
      makeController();
      $scope.toggleTab("devices");
      expect($scope.currentpage).toBe("devices");
      expect($rootScope.page).toBe("devices");
      $scope.toggleTab("controllers");
      expect($scope.currentpage).toBe("controllers");
      expect($rootScope.page).toBe("controllers");
    });
  });

  angular.forEach(["devices", "controllers"], function (tab) {
    describe("tab(" + tab + ")", function () {
      it("sets initial values on $scope", function () {
        // Only controllers tab uses the registerUrl and
        // registerSecret. Set the values before the controller is
        // created. The create will pull the values into the scope.
        var registerUrl, registerSecret;
        if (tab === "controllers") {
          registerUrl = makeName("url");
          registerSecret = makeName("secret");
          window.CONFIG = {
            maas_url: registerUrl,
            rpc_shared_secret: registerSecret,
          };
        }

        makeController();
        var tabScope = $scope.tabs[tab];
        expect(tabScope.previous_search).toBe("");
        expect(tabScope.search).toBe("");
        expect(tabScope.searchValid).toBe(true);
        expect(tabScope.selectedItems).toBe(
          tabScope.manager.getSelectedItems()
        );
        expect(tabScope.metadata).toBe(tabScope.manager.getMetadata());
        expect(tabScope.filters).toEqual(SearchService.getEmptyFilter());
        expect(tabScope.actionOption).toBeNull();

        expect(tabScope.filtered_items).toEqual([]);
        expect(tabScope.predicate).toBe("fqdn");
        expect(tabScope.allViewableChecked).toBe(false);
        expect(tabScope.column).toBe("fqdn");

        // The controllers page uses a function so it can handle
        // different controller types
        if (tab !== "controllers") {
          expect(tabScope.takeActionOptions).toEqual([]);
        }
        expect(tabScope.actionErrorCount).toBe(0);
        expect(tabScope.zoneSelection).toBeNull();

        // Only controllers tab uses the registerUrl and
        // registerSecret.
        if (tab === "controllers") {
          expect(tabScope.registerUrl).toBe(registerUrl);
          expect(tabScope.registerSecret).toBe(registerSecret);
        }
      });
    });
  });

  angular.forEach(["devices", "controllers"], function (tab) {
    describe("tab(" + tab + ")", function () {
      it(`resets search matches previous search
          and empty filtered_items`, function () {
        makeController();
        var tabScope = $scope.tabs[tab];
        var search = makeName("search");

        // Add item to filtered_items.
        tabScope.filtered_items.push(makeObject(tab));
        tabScope.search = "in:(Selected)";
        tabScope.previous_search = search;
        $scope.$digest();

        // Empty the filtered_items, which should clear the
        // search.
        tabScope.filtered_items.splice(0, 1);
        tabScope.search = search;
        $scope.$digest();
        expect(tabScope.search).toBe("");
      });

      it("doesnt reset search matches if not empty filtered_items", function () {
        makeController();
        var tabScope = $scope.tabs[tab];
        var search = makeName("search");
        var nodes = [makeObject(tab), makeObject(tab)];

        // Add item to filtered_items.
        tabScope.filtered_items.push(nodes[0], nodes[1]);
        tabScope.search = "in:(Selected)";
        tabScope.previous_search = search;
        $scope.$digest();

        tabScope.filtered_items.splice(0, 1);
        tabScope.search = search;
        $scope.$digest();
        expect(tabScope.search).toBe(search);
      });

      it("doesnt reset search when previous search doesnt match", function () {
        makeController();
        var tabScope = $scope.tabs[tab];
        var nodes = [makeObject(tab), makeObject(tab)];

        // Add item to filtered_items.
        tabScope.filtered_items.push(nodes[0]);

        tabScope.search = "in:(Selected)";
        tabScope.previous_search = makeName("search");
        $scope.$digest();

        // Empty the filtered_items, but change the search which
        // should stop the search from being reset.
        tabScope.filtered_items.splice(0, 1);
        var search = makeName("search");
        tabScope.search = search;
        $scope.$digest();
        expect(tabScope.search).toBe(search);
      });
    });
  });

  angular.forEach(["devices", "controllers"], function (tab) {
    describe("tab(" + tab + ")", function () {
      describe("clearSearch", function () {
        it("sets search to empty string", function () {
          makeController();
          $scope.tabs[tab].search = makeName("search");
          $scope.clearSearch(tab);
          expect($scope.tabs[tab].search).toBe("");
        });

        it("calls updateFilters", function () {
          makeController();
          spyOn($scope, "updateFilters");
          $scope.clearSearch(tab);
          expect($scope.updateFilters).toHaveBeenCalledWith(tab);
        });
      });
    });
  });

  angular.forEach(["devices", "controllers"], function (tab) {
    describe("tab(" + tab + ")", function () {
      describe("toggleChecked", function () {
        var object, tabObj;
        beforeEach(function () {
          makeController();
          object = makeObject(tab);
          tabObj = $scope.tabs[tab];
          $scope.tabs.devices.filtered_items = $scope.devices;
          $scope.tabs.controllers.filtered_items = $scope.controllers;
        });

        it("selects object", function () {
          $scope.toggleChecked(object, tab);
          expect(object.$selected).toBe(true);
        });

        it("deselects object", function () {
          tabObj.manager.selectItem(object.system_id);
          $scope.toggleChecked(object, tab);
          expect(object.$selected).toBe(false);
        });

        it(`sets allViewableChecked to true when
            all objects selected`, function () {
          $scope.toggleChecked(object, tab);
          expect(tabObj.allViewableChecked).toBe(true);
        });

        it(`sets allViewableChecked to false when
           not all objects selected`, function () {
          makeObject(tab);
          $scope.toggleChecked(object, tab);
          expect(tabObj.allViewableChecked).toBe(false);
        });

        it(`sets allViewableChecked to false when
            selected and deselected`, function () {
          $scope.toggleChecked(object, tab);
          $scope.toggleChecked(object, tab);
          expect(tabObj.allViewableChecked).toBe(false);
        });

        it(`resets search when in:selected
            and none selected`, function () {
          tabObj.search = "in:(Selected)";
          $scope.toggleChecked(object, tab);
          $scope.toggleChecked(object, tab);
          expect(tabObj.search).toBe("");
        });

        it(`ignores search when not in:selected
            and none selected`, function () {
          tabObj.search = "other";
          $scope.toggleChecked(object, tab);
          $scope.toggleChecked(object, tab);
          expect(tabObj.search).toBe("other");
        });

        it("updates actionErrorCount", function () {
          object.actions = [];
          tabObj.actionOption = {
            name: "test",
          };
          $scope.toggleChecked(object, tab);
          expect(tabObj.actionErrorCount).toBe(1);
        });

        it("clears action option when none selected", function () {
          object.actions = [];
          tabObj.actionOption = {};
          $scope.toggleChecked(object, tab);
          $scope.toggleChecked(object, tab);
          expect(tabObj.actionOption).toBeNull();
        });
      });

      describe("toggleCheckAll", function () {
        var object1, object2, tabObj;
        beforeEach(function () {
          makeController();
          object1 = makeObject(tab);
          object2 = makeObject(tab);
          tabObj = $scope.tabs[tab];
          $scope.tabs.devices.filtered_items = $scope.devices;
          $scope.tabs.controllers.filtered_items = $scope.controllers;
        });

        it("selects all objects", function () {
          $scope.toggleCheckAll(tab);
          expect(object1.$selected).toBe(true);
          expect(object2.$selected).toBe(true);
        });

        it("deselects all objects", function () {
          $scope.toggleCheckAll(tab);
          $scope.toggleCheckAll(tab);
          expect(object1.$selected).toBe(false);
          expect(object2.$selected).toBe(false);
        });

        it("resets search when in:selected and none selected", function () {
          tabObj.search = "in:(Selected)";
          $scope.toggleCheckAll(tab);
          $scope.toggleCheckAll(tab);
          expect(tabObj.search).toBe("");
        });

        it("ignores search when not in:selected and none selected", function () {
          tabObj.search = "other";
          $scope.toggleCheckAll(tab);
          $scope.toggleCheckAll(tab);
          expect(tabObj.search).toBe("other");
        });

        it("updates actionErrorCount", function () {
          object1.actions = [];
          object2.actions = [];
          tabObj.actionOption = {
            name: "test",
          };
          $scope.toggleCheckAll(tab);
          expect(tabObj.actionErrorCount).toBe(2);
        });

        it("clears action option when none selected", function () {
          $scope.actionOption = {};
          $scope.toggleCheckAll(tab);
          $scope.toggleCheckAll(tab);
          expect(tabObj.actionOption).toBeNull();
        });
      });

      describe("sortTable", function () {
        it("sets predicate", function () {
          makeController();
          var predicate = makeName("predicate");
          $scope.sortTable(predicate, tab);
          expect($scope.tabs[tab].predicate).toBe(predicate);
        });

        it("reverses reverse", function () {
          makeController();
          $scope.tabs[tab].reverse = true;
          $scope.sortTable(makeName("predicate"), tab);
          expect($scope.tabs[tab].reverse).toBe(false);
        });
      });

      describe("selectColumnOrSort", function () {
        it("sets column if different", function () {
          makeController();
          var column = makeName("column");
          $scope.selectColumnOrSort(column, tab);
          expect($scope.tabs[tab].column).toBe(column);
        });

        it("calls sortTable if column already set", function () {
          makeController();
          var column = makeName("column");
          $scope.tabs[tab].column = column;
          spyOn($scope, "sortTable");
          $scope.selectColumnOrSort(column, tab);
          expect($scope.sortTable).toHaveBeenCalledWith(column, tab);
        });
      });
    });
  });

  angular.forEach(["devices", "controllers"], function (tab) {
    describe("tab(" + tab + ")", function () {
      describe("showSelected", function () {
        it("sets search to in:selected", function () {
          makeController();
          $scope.tabs[tab].selectedItems.push(makeObject(tab));
          $scope.tabs[tab].actionOption = {};
          $scope.showSelected(tab);
          expect($scope.tabs[tab].search).toBe("in:(Selected)");
        });

        it("updateFilters with the new search", function () {
          makeController();
          $scope.tabs[tab].selectedItems.push(makeObject(tab));
          $scope.tabs[tab].actionOption = {};
          $scope.showSelected(tab);
          expect($scope.tabs[tab].filters["in"]).toEqual(["Selected"]);
        });
      });

      describe("toggleFilter", function () {
        it("does nothing if actionOption", function () {
          makeController();
          $scope.tabs[tab].actionOption = {};

          var filters = { _: [], in: ["Selected"] };
          $scope.tabs[tab].filters = filters;
          $scope.toggleFilter("hostname", "test", tab);
          expect($scope.tabs[tab].filters).toEqual(filters);
        });

        it("calls SearchService.toggleFilter", function () {
          makeController();
          spyOn(SearchService, "toggleFilter").and.returnValue(
            SearchService.getEmptyFilter()
          );
          $scope.toggleFilter("hostname", "test", tab);
          expect(SearchService.toggleFilter).toHaveBeenCalled();
        });

        it("sets $scope.filters", function () {
          makeController();
          var filters = { _: [], other: [] };
          spyOn(SearchService, "toggleFilter").and.returnValue(filters);
          $scope.toggleFilter("hostname", "test", tab);
          expect($scope.tabs[tab].filters).toBe(filters);
        });

        it("calls SearchService.filtersToString", function () {
          makeController();
          spyOn(SearchService, "filtersToString").and.returnValue("");
          $scope.toggleFilter("hostname", "test", tab);
          expect(SearchService.filtersToString).toHaveBeenCalled();
        });

        it("sets $scope.search", function () {
          makeController();
          $scope.toggleFilter("hostname", "test", tab);
          expect($scope.tabs[tab].search).toBe("hostname:(=test)");
        });
      });

      describe("isFilterActive", function () {
        it("returns true when active", function () {
          makeController();
          $scope.toggleFilter("hostname", "test", tab);
          expect($scope.isFilterActive("hostname", "test", tab)).toBe(true);
        });

        it("returns false when inactive", function () {
          makeController();
          $scope.toggleFilter("hostname", "test2", tab);
          expect($scope.isFilterActive("hostname", "test", tab)).toBe(false);
        });
      });

      describe("updateFilters", function () {
        it("updates filters and sets searchValid to true", function () {
          makeController();
          $scope.tabs[tab].search = "test hostname:name";
          $scope.updateFilters(tab);
          expect($scope.tabs[tab].filters).toEqual({
            _: ["test"],
            hostname: ["name"],
          });
          expect($scope.tabs[tab].searchValid).toBe(true);
        });

        it(`updates sets filters empty and
            sets searchValid to false`, function () {
          makeController();
          $scope.tabs[tab].search = "test hostname:(name";
          $scope.updateFilters(tab);
          expect($scope.tabs[tab].filters).toEqual(
            SearchService.getEmptyFilter()
          );
          expect($scope.tabs[tab].searchValid).toBe(false);
        });
      });

      describe("supportsAction", function () {
        it("returns true if actionOption is null", function () {
          makeController();
          var object = makeObject(tab);
          object.actions = ["start", "stop"];
          expect($scope.supportsAction(object, tab)).toBe(true);
        });

        it("returns true if actionOption in object.actions", function () {
          makeController();
          var object = makeObject(tab);
          object.actions = ["start", "stop"];
          $scope.tabs.controllers.actionOption = { name: "start" };
          expect($scope.supportsAction(object, tab)).toBe(true);
        });

        it("returns false if actionOption not in object.actions", function () {
          makeController();
          var object = makeObject(tab);
          object.actions = ["start", "stop"];
          $scope.tabs[tab].actionOption = { name: "test" };
          expect($scope.supportsAction(object, tab)).toBe(false);
        });
      });
    });
  });

  angular.forEach(["devices", "controllers"], function (tab) {
    describe("tab(" + tab + ")", function () {
      describe("actionOptionSelected", function () {
        it("sets actionErrorCount to zero", function () {
          makeController();
          $scope.tabs[tab].actionErrorCount = 1;
          $scope.actionOptionSelected(tab);
          expect($scope.tabs[tab].actionErrorCount).toBe(0);
        });

        it(
          "sets actionErrorCount to 1 when selected object doesn't " +
            "support action",
          function () {
            makeController();
            var object = makeObject(tab);
            object.actions = ["start", "stop"];
            $scope.tabs[tab].actionOption = { name: "test" };
            $scope.tabs[tab].selectedItems = [object];
            $scope.actionOptionSelected(tab);
            expect($scope.tabs[tab].actionErrorCount).toBe(1);
          }
        );

        it("sets search to in:selected", function () {
          makeController();
          $scope.actionOptionSelected(tab);
          expect($scope.tabs[tab].search).toBe("in:(Selected)");
        });

        it("sets previous_search to search value", function () {
          makeController();
          var search = makeName("search");
          $scope.tabs[tab].search = search;
          $scope.tabs[tab].actionErrorCount = 1;
          $scope.actionOptionSelected(tab);
          expect($scope.tabs[tab].previous_search).toBe(search);
        });

        it("calls hide on addHardwareScope", function () {
          makeController();
          if (tab === "devices") {
            $scope.addDeviceScope = {
              hide: jasmine.createSpy("hide"),
            };
            $scope.actionOptionSelected(tab);
            expect($scope.addDeviceScope.hide).toHaveBeenCalled();
          }
        });
      });

      describe("isActionError", function () {
        it("returns true if actionErrorCount > 0", function () {
          makeController();
          $scope.tabs[tab].actionErrorCount = 2;
          expect($scope.isActionError(tab)).toBe(true);
        });

        it("returns false if actionErrorCount === 0", function () {
          makeController();
          $scope.tabs[tab].actionErrorCount = 0;
          expect($scope.isActionError(tab)).toBe(false);
        });
      });

      describe("actionCancel", function () {
        it("clears search if in:selected", function () {
          makeController();
          $scope.tabs[tab].search = "in:(Selected)";
          $scope.actionCancel(tab);
          expect($scope.tabs[tab].search).toBe("");
        });

        it("clears search if in:selected (device)", function () {
          makeController();
          $scope.tabs.devices.search = "in:(Selected)";
          $scope.actionCancel("devices");
          expect($scope.tabs.devices.search).toBe("");
        });

        it("clears search if in:selected (controller)", function () {
          makeController();
          $scope.tabs.controllers.search = "in:(Selected)";
          $scope.actionCancel("controllers");
          expect($scope.tabs.controllers.search).toBe("");
        });

        it("doesnt clear search if not in:Selected", function () {
          makeController();
          $scope.tabs[tab].search = "other";
          $scope.tabs[tab].testSelection = [];
          $scope.actionCancel(tab);
          expect($scope.tabs[tab].search).toBe("other");
        });

        it("restores the previous search", function () {
          makeController();
          $scope.tabs.controllers.previous_search = "a:filter";
          $scope.tabs.controllers.search = "in:(Selected)";
          $scope.actionCancel("controllers");
          expect($scope.tabs.controllers.search).toBe("a:filter");
        });

        it("removes in:Selected from the previous search", function () {
          makeController();
          $scope.tabs.controllers.previous_search = "a:filter in:(Selected)";
          $scope.tabs.controllers.search = "in:(Selected)";
          $scope.actionCancel("controllers");
          expect($scope.tabs.controllers.search).toBe("a:filter");
        });

        it("sets actionOption to null", function () {
          makeController();
          $scope.tabs[tab].actionOption = {};
          $scope.tabs[tab].testSelection = [];
          $scope.actionCancel(tab);
          expect($scope.tabs[tab].actionOption).toBeNull();
        });

        it("supports pluralization of names based on tab", function () {
          var singulars = {
            machines: "machine",
            devices: "device",
            controllers: "controller",
          };
          makeController();
          expect($scope.pluralize(tab)).toEqual(singulars[tab]);
          $scope.tabs[tab].selectedItems.length = 2;
          expect($scope.pluralize(tab)).toEqual(tab);
        });

        it("resets actionProgress", function () {
          makeController();
          $scope.tabs[tab].actionProgress.total = makeInteger(0, 10);
          $scope.tabs[tab].actionProgress.completed = makeInteger(0, 10);
          $scope.tabs[tab].actionProgress.errors[makeName("error")] = [{}];
          $scope.tabs[tab].actionProgress.showing_confirmation = true;
          $scope.tabs[tab].actionProgress.confirmation_message = makeName(
            "message"
          );
          $scope.tabs[tab].actionProgress.confirmation_details = [
            makeName("detail"),
            makeName("detail"),
          ];
          $scope.tabs[tab].actionProgress.affected_nodes = makeInteger(0, 10);
          $scope.tabs[tab].testSelection = [];
          $scope.actionCancel(tab);
          expect($scope.tabs[tab].actionProgress.total).toBe(0);
          expect($scope.tabs[tab].actionProgress.completed).toBe(0);
          expect($scope.tabs[tab].actionProgress.errors).toEqual({});
          expect($scope.tabs[tab].actionProgress.showing_confirmation).toBe(
            false
          );
          expect($scope.tabs[tab].actionProgress.confirmation_message).toEqual(
            ""
          );
          expect($scope.tabs[tab].actionProgress.confirmation_details).toEqual(
            []
          );
          expect($scope.tabs[tab].actionProgress.affected_nodes).toBe(0);
        });
      });

      describe("actionGo", function () {
        it(`sets actionProgress.total to the number
            of selectedItems`, function () {
          makeController();
          makeObject(tab);
          $scope.tabs[tab].actionOption = { name: "start" };
          $scope.tabs[tab].selectedItems = [
            makeObject(tab),
            makeObject(tab),
            makeObject(tab),
          ];
          $scope.actionGo(tab);
          $scope.$digest();
          expect($scope.tabs[tab].actionProgress.total).toBe(
            $scope.tabs[tab].selectedItems.length
          );
        });

        it("calls performAction for selected object", function () {
          makeController();
          var object = makeObject(tab);
          var spy = spyOn(
            $scope.tabs[tab].manager,
            "performAction"
          ).and.returnValue($q.defer().promise);
          $scope.tabs[tab].actionOption = { name: "start" };
          $scope.tabs[tab].selectedItems = [object];
          $scope.actionGo(tab);
          $scope.$digest();
          expect(spy).toHaveBeenCalledWith(object, "start", {});
        });

        it("calls unselectItem after failed action", function () {
          makeController();
          var object = makeObject(tab);
          object.action_failed = false;
          spyOn($scope, "hasActionsFailed").and.returnValue(true);
          var defer = $q.defer();
          spyOn($scope.tabs[tab].manager, "performAction").and.returnValue(
            defer.promise
          );
          var spy = spyOn($scope.tabs[tab].manager, "unselectItem");
          $scope.tabs[tab].actionOption = { name: "start" };
          $scope.tabs[tab].selectedItems = [object];
          $scope.actionGo(tab);
          defer.resolve();
          $scope.$digest();
          expect(spy).toHaveBeenCalled();
        });

        it("keeps items selected after success", function () {
          makeController();
          var object = makeObject(tab);
          spyOn($scope, "hasActionsFailed").and.returnValue(false);
          spyOn($scope, "hasActionsInProgress").and.returnValue(false);
          var defer = $q.defer();
          spyOn($scope.tabs[tab].manager, "performAction").and.returnValue(
            defer.promise
          );
          $scope.tabs[tab].actionOption = { name: "start" };
          $scope.tabs[tab].selectedItems = [object];
          $scope.actionGo(tab);
          defer.resolve();
          $scope.$digest();
          expect($scope.tabs[tab].selectedItems).toEqual([object]);
        });

        it(`increments actionProgress.completed
            after action complete`, function () {
          makeController();
          var object = makeObject(tab);
          var defer = $q.defer();
          spyOn($scope.tabs[tab].manager, "performAction").and.returnValue(
            defer.promise
          );
          spyOn($scope, "hasActionsFailed").and.returnValue(true);
          $scope.tabs[tab].actionOption = { name: "start" };
          $scope.tabs[tab].selectedItems = [object];
          $scope.tabs[tab].testSelection = [];
          $scope.actionGo(tab);
          defer.resolve();
          $scope.$digest();
          expect($scope.tabs[tab].actionProgress.completed).toBe(1);
        });

        it("set search to in:(Selected) search after complete", function () {
          makeController();
          var defer = $q.defer();
          spyOn($scope.tabs[tab].manager, "performAction").and.returnValue(
            defer.promise
          );
          spyOn($scope, "hasActionsFailed").and.returnValue(false);
          spyOn($scope, "hasActionsInProgress").and.returnValue(false);
          var object = makeObject(tab);
          $scope.tabs[tab].manager._items.push(object);
          $scope.tabs[tab].manager._selectedItems.push(object);
          $scope.tabs[tab].previous_search = makeName("search");
          $scope.tabs[tab].search = "in:(Selected)";
          $scope.tabs[tab].actionOption = { name: "start" };
          $scope.tabs[tab].filtered_items = [makeObject(tab)];
          $scope.actionGo(tab);
          defer.resolve();
          $scope.$digest();
          expect($scope.tabs[tab].search).toBe("in:(Selected)");
        });

        it("clears action option when complete", function () {
          makeController();
          var defer = $q.defer();
          spyOn($scope.tabs[tab].manager, "performAction").and.returnValue(
            defer.promise
          );
          spyOn($scope, "hasActionsFailed").and.returnValue(false);
          spyOn($scope, "hasActionsInProgress").and.returnValue(false);
          var object = makeObject(tab);
          $scope.tabs[tab].manager._items.push(object);
          $scope.tabs[tab].manager._selectedItems.push(object);
          $scope.tabs[tab].actionOption = { name: "start" };
          $scope.actionGo(tab);
          defer.resolve();
          $scope.$digest();
          expect($scope.tabs[tab].actionOption).toBeNull();
        });

        it(`increments actionProgress.completed
            after action error`, function () {
          makeController();
          var object = makeObject(tab);
          var defer = $q.defer();
          spyOn($scope.tabs[tab].manager, "performAction").and.returnValue(
            defer.promise
          );
          $scope.tabs[tab].actionOption = { name: "start" };
          $scope.tabs[tab].selectedItems = [object];
          $scope.tabs[tab].testSelection = [];
          $scope.actionGo(tab);
          defer.reject(makeName("error"));
          $scope.$digest();
          expect($scope.tabs[tab].actionProgress.completed).toBe(1);
        });

        it("adds error to actionProgress.errors on action error", function () {
          makeController();
          var object = makeObject(tab);
          var defer = $q.defer();
          spyOn($scope.tabs[tab].manager, "performAction").and.returnValue(
            defer.promise
          );
          $scope.tabs[tab].actionOption = { name: "start" };
          $scope.tabs[tab].selectedItems = [object];
          $scope.tabs[tab].testSelection = [];
          $scope.actionGo(tab);
          var error = makeName("error");
          defer.reject(error);
          $scope.$digest();
          var errorObjects = $scope.tabs[tab].actionProgress.errors[error];
          expect(errorObjects[0].system_id).toBe(object.system_id);
        });
      });

      describe("hasActionsInProgress", function () {
        it("returns false if actionProgress.total not > 0", function () {
          makeController();
          $scope.tabs[tab].actionProgress.total = 0;
          expect($scope.hasActionsInProgress(tab)).toBe(false);
        });

        it("returns true if actionProgress total != completed", function () {
          makeController();
          $scope.tabs[tab].actionProgress.total = 1;
          $scope.tabs[tab].actionProgress.completed = 0;
          expect($scope.hasActionsInProgress(tab)).toBe(true);
        });

        it("returns false if actionProgress total == completed", function () {
          makeController();
          $scope.tabs[tab].actionProgress.total = 1;
          $scope.tabs[tab].actionProgress.completed = 1;
          expect($scope.hasActionsInProgress(tab)).toBe(false);
        });
      });

      describe("hasActionsFailed", function () {
        it("returns false if no errors", function () {
          makeController();
          $scope.tabs[tab].actionProgress.errors = {};
          expect($scope.hasActionsFailed(tab)).toBe(false);
        });

        it("returns true if errors", function () {
          makeController();
          var error = makeName("error");
          var object = makeObject(tab);
          var errors = $scope.tabs[tab].actionProgress.errors;
          errors[error] = [object];
          expect($scope.hasActionsFailed(tab)).toBe(true);
        });
      });

      describe("actionSetZone", function () {
        it("calls performAction with zone", function () {
          makeController();
          var spy = spyOn(
            $scope.tabs[tab].manager,
            "performAction"
          ).and.returnValue($q.defer().promise);
          var object = makeObject(tab);
          $scope.tabs[tab].actionOption = { name: "set-zone" };
          $scope.tabs[tab].selectedItems = [object];
          $scope.tabs[tab].zoneSelection = { id: 1 };
          $scope.actionGo(tab);
          $scope.$digest();
          expect(spy).toHaveBeenCalledWith(object, "set-zone", { zone_id: 1 });
        });

        it("clears action option when successfully complete", function () {
          makeController();
          var defer = $q.defer();
          spyOn($scope.tabs[tab].manager, "performAction").and.returnValue(
            defer.promise
          );
          spyOn($scope, "hasActionsFailed").and.returnValue(false);
          spyOn($scope, "hasActionsInProgress").and.returnValue(false);
          var object = makeObject(tab);
          $scope.tabs[tab].manager._items.push(object);
          $scope.tabs[tab].manager._selectedItems.push(object);
          $scope.tabs[tab].actionOption = { name: "set-zone" };
          $scope.tabs[tab].zoneSelection = { id: 1 };
          $scope.actionGo(tab);
          defer.resolve();
          $scope.$digest();
          expect($scope.tabs[tab].zoneSelection).toBeNull();
        });
      });
    });
  });

  describe("tab(nodes)", function () {
    describe("actionGo", function () {
      it("calls performAction with tag", function () {
        makeController();
        var object = makeObject("controllers");
        var spy = spyOn(
          $scope.tabs.controllers.manager,
          "performAction"
        ).and.returnValue($q.defer().promise);

        $scope.tabs.controllers.actionOption = { name: "tag" };
        $scope.tabs.controllers.selectedItems = [object];
        $scope.tags = [{ text: "foo" }, { text: "bar" }, { text: "baz" }];
        $scope.actionGo("controllers");
        $scope.$digest();
        expect(spy).toHaveBeenCalledWith(object, "tag", {
          tags: ["foo", "bar", "baz"],
        });
      });

      it("calls performAction with testOptions", function () {
        makeController();
        var object = makeObject("controllers");
        var spy = spyOn(
          $scope.tabs.controllers.manager,
          "performAction"
        ).and.returnValue($q.defer().promise);
        var testing_script_ids = [makeInteger(0, 100), makeInteger(0, 100)];
        $scope.tabs.controllers.actionOption = { name: "test" };
        $scope.tabs.controllers.selectedItems = [object];
        $scope.tabs.controllers.testOptions.enableSSH = true;
        $scope.tabs.controllers.testSelection = [];
        angular.forEach(testing_script_ids, function (script_id) {
          $scope.tabs.controllers.testSelection.push({
            id: script_id,
            name: makeName("script_name"),
          });
        });
        $scope.actionGo("controllers");
        $scope.$digest();
        expect(spy).toHaveBeenCalledWith(object, "test", {
          enable_ssh: true,
          testing_scripts: testing_script_ids,
          script_input: {},
        });
      });

      it("sets showing_confirmation with testOptions", function () {
        makeController();
        var object = makeObject("controllers");
        object.status_code = 6;
        var spy = spyOn(
          $scope.tabs.controllers.manager,
          "performAction"
        ).and.returnValue($q.defer().promise);
        $scope.tabs.controllers.actionOption = { name: "test" };
        $scope.tabs.controllers.selectedItems = [object];
        $scope.actionGo("controllers");
        expect(
          $scope.tabs["controllers"].actionProgress.showing_confirmation
        ).toBe(true);
        expect(
          $scope.tabs["controllers"].actionProgress.confirmation_message
        ).not.toBe("");
        expect($scope.tabs["controllers"].actionProgress.affected_nodes).toBe(
          1
        );
        expect(spy).not.toHaveBeenCalled();
      });

      it("sets showing_confirmation with deleteOptions", function () {
        // Regression test for LP:1793478
        makeController();
        var object = makeObject("controllers");
        $scope.vlans = [
          {
            id: 0,
            primary_rack: object.system_id,
            name: "Default VLAN",
          },
        ];
        var spy = spyOn(
          $scope.tabs.controllers.manager,
          "performAction"
        ).and.returnValue($q.defer().promise);
        $scope.tabs.controllers.actionOption = { name: "delete" };
        $scope.tabs.controllers.selectedItems = [object];
        $scope.actionGo("controllers");
        expect(
          $scope.tabs["controllers"].actionProgress.showing_confirmation
        ).toBe(true);
        expect(
          $scope.tabs["controllers"].actionProgress.confirmation_message
        ).not.toBe("");
        expect(
          $scope.tabs["controllers"].actionProgress.confirmation_details
        ).not.toBe([]);
        expect($scope.tabs["controllers"].actionProgress.affected_nodes).toBe(
          1
        );
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });

  describe("addDevice", function () {
    it("calls show in addDeviceScope", function () {
      makeController();
      $scope.addDeviceScope = {
        show: jasmine.createSpy("show"),
      };
      $scope.addDevice();
      expect($scope.addDeviceScope.show).toHaveBeenCalled();
    });
  });

  describe("cancelAddDevice", function () {
    it("calls cancel in addDeviceScope", function () {
      makeController();
      $scope.addDeviceScope = {
        cancel: jasmine.createSpy("cancel"),
      };
      $scope.cancelAddDevice();
      expect($scope.addDeviceScope.cancel).toHaveBeenCalled();
    });
  });

  describe("getDeviceIPAssignment", function () {
    it("returns 'External' for external assignment", function () {
      makeController();
      expect($scope.getDeviceIPAssignment("external")).toBe("External");
    });

    it("returns 'Dynamic' for dynamic assignment", function () {
      makeController();
      expect($scope.getDeviceIPAssignment("dynamic")).toBe("Dynamic");
    });

    it("returns 'Static' for static assignment", function () {
      makeController();
      expect($scope.getDeviceIPAssignment("static")).toBe("Static");
    });
  });

  describe("unselectImpossibleNodes", function () {
    it("unselects controllers for which an action cannot be done", function () {
      makeController();
      var controllerPossible = makeObject("controllers");
      var controllerImpossible = makeObject("controllers");
      var tab = $scope.tabs.controllers;

      tab.actionOption = { name: "test" };
      controllerPossible.actions = ["test"];
      controllerImpossible.actions = ["tag"];
      ControllersManager._items.push(controllerPossible, controllerImpossible);
      ControllersManager._selectedItems.push(
        controllerPossible,
        controllerImpossible
      );

      $scope.unselectImpossibleNodes("controllers");

      expect(tab.selectedItems).toEqual([controllerPossible]);
    });
  });

  describe("updateFailedActionSentence", () => {
    it("correctly sets $scope.failedActionSentence", () => {
      makeController();
      const tab = $scope.tabs.controllers;
      tab.actionOption = { name: "override-failed-testing" };
      tab.actionErrorCount = 2;

      expect($scope.failedActionSentence).toEqual(
        "Action cannot be performed."
      );
      $scope.updateFailedActionSentence("controllers");
      expect($scope.failedActionSentence).toEqual(
        "Cannot override failed tests on 2 controllers."
      );
    });
  });

  describe("getHardwareTestErrorText", function () {
    it(
      "returns correct string if 'Unable to run destructive" +
        " test while deployed!'",
      function () {
        makeController();
        var tab = "controllers";
        $scope.tabs[tab].selectedItems = ["foo", "bar", "baz"];
        expect(
          $scope.getHardwareTestErrorText(
            "Unable to run destructive test while deployed!",
            tab
          )
        ).toBe(
          "3 machines cannot run hardware testing. The selected hardware" +
            " tests contain one or more destructive tests." +
            " Destructive tests cannot run on deployed machines."
        );
      }
    );

    it("returns singular error string if only one selectedItem", function () {
      makeController();
      var tab = "controllers";
      $scope.tabs[tab].selectedItems = ["foo"];
      expect(
        $scope.getHardwareTestErrorText(
          "Unable to run destructive test while deployed!",
          tab
        )
      ).toBe(
        "1 machine cannot run hardware testing. The selected hardware tests" +
          " contain one or more destructive tests. Destructive tests cannot" +
          " run on deployed machines."
      );
    });

    it(
      "returns error string if not 'Unable to run destructive " +
        "test while deployed!'",
      function () {
        makeController();
        var tab = "controllers";
        $scope.tabs[tab].selectedItems = [];
        var errorString = "There was an error";
        expect($scope.getHardwareTestErrorText(errorString, tab)).toBe(
          errorString
        );
      }
    );
  });

  describe("getFailedTests", () => {
    it("calls MachinesManager.getLatestFailedTests", () => {
      makeController();
      const nodes = [makeObject("controllers"), makeObject("controllers")];
      const tab = $scope.tabs.controllers;
      tab.selectedItems = nodes;
      const defer = $q.defer();
      spyOn(MachinesManager, "getLatestFailedTests").and.returnValue(
        defer.promise
      );
      $scope.getFailedTests("controllers");

      expect(MachinesManager.getLatestFailedTests).toHaveBeenCalledWith(nodes);
    });
  });

  describe("getFailedTestCount", () => {
    it("correctly sums failed tests for each node", () => {
      makeController();
      const nodes = [makeObject("controllers"), makeObject("controllers")];
      const tab = $scope.tabs.controllers;
      tab.selectedItems = nodes;
      tab.failedTests = {
        [nodes[0].system_id]: [
          { name: makeName("script") },
          { name: makeName("script") },
        ],
        [nodes[1].system_id]: [
          { name: makeName("script") },
          { name: makeName("script") },
        ],
      };

      expect($scope.getFailedTestCount("controllers")).toEqual(4);
    });
  });

  describe("checkTestParameterValues", () => {
    it("disables test button if a parameter has no value", () => {
      makeController();
      $scope.disableTestButton = false;
      $scope.tabs.controllers.testSelection = [
        {
          name: "foo",
          parameters: {
            url: { type: "url", value: "" },
            bar: { type: "url", value: "https://example.com" },
          },
        },
      ];
      $scope.checkTestParameterValues();
      expect($scope.disableTestButton).toBe(true);
    });

    it("enables test button if all parameters have values", () => {
      makeController();
      $scope.disableTestButton = true;
      $scope.tabs.controllers.testSelection = [
        {
          name: "foo",
          parameters: {
            url: { type: "url", value: "https://one.example.com" },
            bar: { type: "url", value: "https://example.com" },
          },
        },
      ];
      $scope.checkTestParameterValues();
      expect($scope.disableTestButton).toBe(false);
    });
  });

  describe("setDefaultValues", () => {
    it("sets value to default if no value", () => {
      makeController();
      const parameters = {
        foo: { default: "https://example.com" },
      };
      const updatedParameters = $scope.setDefaultValues(parameters);
      expect(updatedParameters).toEqual({
        foo: { default: "https://example.com", value: "https://example.com" },
      });
    });

    it("sets value to default even if it has a value", () => {
      makeController();
      const parameters = {
        foo: { default: "https://example.com", value: "https://website.com" },
      };
      const updatedParameters = $scope.setDefaultValues(parameters);
      expect(updatedParameters).toEqual({
        foo: { default: "https://example.com", value: "https://example.com" },
      });
    });
  });

  describe("getVersions", () => {
    it("can get controller versions", () => {
      makeController();
      const controller = {
        versions: {
          current: {
            version: "1.2.3",
          },
          origin: "stable",
          snap_cohort:
            "MSBzaFkyMllUWjNSaEpKRE9qME1mbVNoVE5aVEViMUppcSAxNjE3MTgyOTcxIGJhM2VlYzQ2NDc5ZDdmNTI3NzIzNTUyMmRlOTc1MGIzZmNhYTI0MDE1MTQ3ZjVhM2ViNzQwZGZmYzk5OWFiYWU=",
          update: {
            version: "1.2.4",
          },
        },
      };
      expect($scope.getVersions(controller)).toStrictEqual({
        origin: "stable",
        cohortTooltip: `Cohort key: \nMSBzaFkyMllUWjNSaEpKRE9qME1mbVNoVE5aVEViM \nUppcSAxNjE3MTgyOTcxIGJhM2VlYzQ2NDc5ZDdmNT \nI3NzIzNTUyMmRlOTc1MGIzZmNhYTI0MDE1MTQ3ZjV \nhM2ViNzQwZGZmYzk5OWFiYWU=`,
        current: "1.2.3",
        isDeb: false,
        update: "1.2.4",
      });
    });

    it("handles a controller without versions", () => {
      makeController();
      const controller = {};
      expect($scope.getVersions(controller)).toStrictEqual({
        origin: null,
        cohortTooltip: null,
        current: null,
        isDeb: false,
        update: null,
      });
    });

    it("handles a controller without current and update objects", () => {
      makeController();
      const controller = {
        versions: {},
      };
      expect($scope.getVersions(controller)).toStrictEqual({
        origin: null,
        cohortTooltip: null,
        current: null,
        isDeb: false,
        update: null,
      });
    });

    it("handles a controller without an current and update versions", () => {
      makeController();
      const controller = {
        versions: {
          current: {},
          update: {},
        },
      };
      expect($scope.getVersions(controller)).toStrictEqual({
        origin: null,
        cohortTooltip: null,
        current: null,
        isDeb: false,
        update: null,
      });
    });

    it("can identify deb installs", () => {
      makeController();
      const controller = {
        versions: {
          install_type: "deb",
        },
      };
      expect($scope.getVersions(controller).isDeb).toBe(true);
    });

    it("handles snap installs", () => {
      makeController();
      const controller = {
        versions: {
          install_type: "snap",
        },
      };
      expect($scope.getVersions(controller).isDeb).toBe(false);
    });
  });

  describe("getHaVlans", () => {
    it("can display HA and non-HA VLANs", () => {
      makeController();
      const controller = {
        vlans_ha: {
          false: 5,
          true: 2,
        },
      };
      expect($scope.getHaVlans(controller)).toBe("Non-HA(5), HA(2)");
    });

    it("can display HA only VLANs", () => {
      makeController();
      const controller = {
        vlans_ha: {
          false: 0,
          true: 2,
        },
      };
      expect($scope.getHaVlans(controller)).toBe("HA(2)");
    });

    it("can display non-HA only VLANs", () => {
      makeController();
      const controller = {
        vlans_ha: {
          false: 5,
          true: 0,
        },
      };
      expect($scope.getHaVlans(controller)).toBe("Non-HA(5)");
    });

    it("can handle no HA or non-HA VLANs", () => {
      makeController();
      const controller = {
        vlans_ha: {
          false: 0,
          true: 0,
        },
      };
      expect($scope.getHaVlans(controller)).toBe(null);
    });

    it("can handle no HA VLAN info", () => {
      makeController();
      const controller = {};
      expect($scope.getHaVlans(controller)).toBe(null);
    });
  });
});
