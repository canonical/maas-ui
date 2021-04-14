/* Copyright 2015-2018 Canonical Ltd.  This software is licensed under the
 * GNU Affero General Public License version 3 (see the file LICENSE).
 *
 * MAAS Nodes List Controller
 */
import angular from "angular";

/* @ngInject */
function NodesListController(
  $q,
  $scope,
  $interval,
  $rootScope,
  $stateParams,
  $route,
  $location,
  $window,
  $log,
  $filter,
  MachinesManager,
  DevicesManager,
  ControllersManager,
  GeneralManager,
  ManagerHelperService,
  SearchService,
  ZonesManager,
  UsersManager,
  ServicesManager,
  ScriptsManager,
  VLANsManager,
  TagsManager,
  NotificationsManager
) {
  // Mapping of device.ip_assignment to viewable text.
  var DEVICE_IP_ASSIGNMENT = {
    external: "External",
    dynamic: "Dynamic",
    static: "Static",
  };

  // Set title and page.
  $rootScope.title = "Controllers";
  $rootScope.page = "controllers";

  // Set initial values.
  $scope.zones = ZonesManager.getItems();
  $scope.devices = DevicesManager.getItems();
  $scope.controllers = ControllersManager.getItems();
  $scope.currentpage = "controllers";
  $scope.scripts = ScriptsManager.getItems();
  $scope.vlans = VLANsManager.getItems();
  $scope.loading = true;
  $scope.tags = [];
  $scope.failedActionSentence = "Action cannot be performed.";

  // Called for autocomplete when the user is typing a tag name.
  $scope.tagsAutocomplete = function (query) {
    return TagsManager.autocomplete(query);
  };

  $scope.tabs = {};
  $scope.pluralize = function (tab) {
    var singulars = {
      machines: "machine",
      devices: "device",
      controllers: "controller",
    };
    var verb = singulars[tab];
    if ($scope.tabs[tab].selectedItems.length > 1) {
      verb = tab;
    }
    return verb;
  };

  $scope.nodesManager = MachinesManager;

  // Device tab.
  $scope.tabs.devices = {};
  $scope.tabs.devices.pagetitle = "Devices";
  $scope.tabs.devices.currentpage = "devices";
  $scope.tabs.devices.manager = DevicesManager;
  $scope.tabs.devices.previous_search = "";
  $scope.tabs.devices.search = "";
  $scope.tabs.devices.searchValid = true;
  $scope.tabs.devices.selectedItems = DevicesManager.getSelectedItems();
  $scope.tabs.devices.filtered_items = [];
  $scope.tabs.devices.predicate = "fqdn";
  $scope.tabs.devices.allViewableChecked = false;
  $scope.tabs.devices.metadata = DevicesManager.getMetadata();
  $scope.tabs.devices.filters = SearchService.getEmptyFilter();
  $scope.tabs.devices.column = "fqdn";
  $scope.tabs.devices.actionOption = null;
  $scope.tabs.devices.takeActionOptions = [];
  $scope.tabs.devices.actionErrorCount = 0;
  $scope.tabs.devices.actionProgress = {
    total: 0,
    completed: 0,
    errors: {},
    showing_confirmation: false,
    confirmation_message: "",
    confirmation_details: [],
    affected_nodes: 0,
  };
  $scope.tabs.devices.zoneSelection = null;
  $scope.tabs.devices.filterOrder = ["owner", "tags", "zone"];

  // Controller tab.
  $scope.tabs.controllers = {};
  $scope.tabs.controllers.pagetitle = "Controllers";
  $scope.tabs.controllers.currentpage = "controllers";
  $scope.tabs.controllers.manager = ControllersManager;
  $scope.tabs.controllers.previous_search = "";
  $scope.tabs.controllers.search = "";
  $scope.tabs.controllers.searchValid = true;
  $scope.tabs.controllers.selectedItems = ControllersManager.getSelectedItems();
  $scope.tabs.controllers.filtered_items = [];
  $scope.tabs.controllers.predicate = "fqdn";
  $scope.tabs.controllers.allViewableChecked = false;
  $scope.tabs.controllers.metadata = ControllersManager.getMetadata();
  $scope.tabs.controllers.filters = SearchService.getEmptyFilter();
  $scope.tabs.controllers.column = "fqdn";
  $scope.tabs.controllers.actionOption = null;
  // Rack controllers contain all options
  $scope.tabs.controllers.takeActionOptions = [];
  $scope.tabs.controllers.actionErrorCount = 0;
  $scope.tabs.controllers.actionProgress = {
    total: 0,
    completed: 0,
    errors: {},
    showing_confirmation: false,
    confirmation_message: "",
    confirmation_details: [],
    affected_nodes: 0,
  };
  $scope.tabs.controllers.zoneSelection = null;
  $scope.tabs.controllers.syncStatuses = {};
  $scope.tabs.controllers.addController = false;
  $scope.tabs.controllers.registerUrl = $window.CONFIG.maas_url;
  $scope.tabs.controllers.registerSecret = $window.CONFIG.rpc_shared_secret;
  $scope.tabs.controllers.testOptions = {
    enableSSH: false,
  };
  $scope.tabs.controllers.testSelection = [];

  $scope.disableTestButton = false;

  // This will hold the AddDeviceController once it is initialized.
  // The controller will set this variable as it's always a child of
  // this scope.
  $scope.addDeviceScope = null;

  // Return true if the tab is in viewing selected mode.
  function isViewingSelected(tab) {
    var search = $scope.tabs[tab].search.toLowerCase();
    return search === "in:(selected)" || search === "in:selected";
  }

  // Sets the search bar to only show selected.
  function enterViewSelected(tab) {
    $scope.tabs[tab].previous_search = $scope.tabs[tab].search;
    $scope.tabs[tab].search = "in:(Selected)";
  }

  // Clear search bar from viewing selected.
  function leaveViewSelected(tab) {
    if (isViewingSelected(tab)) {
      $scope.tabs[tab].search = $scope.tabs[tab].previous_search;
      $scope.updateFilters(tab);
    }
  }

  // Called to update `allViewableChecked`.
  function updateAllViewableChecked(tab) {
    // Not checked when the filtered nodes are empty.
    if ($scope.tabs[tab].filtered_items.length === 0) {
      $scope.tabs[tab].allViewableChecked = false;
      return;
    }

    // Loop through all filtered nodes and see if all are checked.
    var i;
    for (i = 0; i < $scope.tabs[tab].filtered_items.length; i++) {
      if (!$scope.tabs[tab].filtered_items[i].$selected) {
        $scope.tabs[tab].allViewableChecked = false;
        return;
      }
    }
    $scope.tabs[tab].allViewableChecked = true;
  }

  function clearAction(tab) {
    resetActionProgress(tab);
    leaveViewSelected(tab);
    $scope.tabs[tab].actionOption = null;
    $scope.tabs[tab].zoneSelection = null;
    $scope.tabs[tab].testSelection = [];
  }

  // Clear the action if required.
  function shouldClearAction(tab) {
    if ($scope.tabs[tab].selectedItems.length === 0) {
      clearAction(tab);
    }
    if ($scope.tabs[tab].actionOption && !isViewingSelected(tab)) {
      $scope.tabs[tab].actionOption = null;
    }
  }

  // Called when the filtered_items are updated. Checks if the
  // filtered_items are empty and if the search still matches the
  // previous search. This will reset the search when no nodes match
  // the current filter.
  function removeEmptyFilter(tab) {
    if (
      $scope.tabs[tab].filtered_items.length === 0 &&
      $scope.tabs[tab].search !== "" &&
      $scope.tabs[tab].search === $scope.tabs[tab].previous_search
    ) {
      $scope.tabs[tab].search = "";
      $scope.updateFilters(tab);
    }
  }

  // Update the number of selected items which have an error based on the
  // current selected action.
  function updateActionErrorCount(tab) {
    var i;
    $scope.tabs[tab].actionErrorCount = 0;
    for (i = 0; i < $scope.tabs[tab].selectedItems.length; i++) {
      var supported = $scope.supportsAction(
        $scope.tabs[tab].selectedItems[i],
        tab
      );
      if (!supported) {
        $scope.tabs[tab].actionErrorCount += 1;
      }
      $scope.tabs[tab].selectedItems[i].action_failed = false;
    }
    $scope.updateFailedActionSentence(tab);
  }

  // Reset actionProgress on tab to zero.
  function resetActionProgress(tab) {
    var progress = $scope.tabs[tab].actionProgress;
    progress.completed = progress.total = 0;
    progress.errors = {};
    progress.showing_confirmation = false;
    progress.confirmation_message = "";
    progress.confirmation_details = [];
    progress.affected_nodes = 0;
  }

  // Add error to action progress and group error messages by nodes.
  function addErrorToActionProgress(tab, error, node) {
    const authUser = UsersManager.getAuthUser();
    if (angular.isObject(authUser) && node) {
      const name = node.hostname || "node";
      NotificationsManager.createItem({
        message: `Unable to perform action on ${name}: ${error}`,
        category: "error",
        user: authUser.id,
      });
    } else {
      $log.error(error);
    }

    var progress = $scope.tabs[tab].actionProgress;
    progress.completed += 1;
    var nodes = progress.errors[error];
    if (angular.isUndefined(nodes)) {
      progress.errors[error] = [node];
    } else {
      nodes.push(node);
    }
  }

  // After an action has been performed check if we can leave all nodes
  // selected or if an error occured and we should only show the failed
  // nodes.
  function updateSelectedItems(tab) {
    if (!$scope.hasActionsFailed(tab)) {
      if (!$scope.hasActionsInProgress(tab)) {
        clearAction(tab);
        enterViewSelected(tab);
      }
      return;
    }
    angular.forEach($scope.tabs[tab].manager.getItems(), function (node) {
      if (node.action_failed === false) {
        $scope.tabs[tab].manager.unselectItem(node.system_id);
      }
    });
  }

  $scope.setDefaultValues = (parameters) => {
    const keys = Object.keys(parameters);

    keys.forEach((key) => {
      if (parameters[key].default) {
        parameters[key].value = parameters[key].default;
      }
    });

    return parameters;
  };

  $scope.checkTestParameterValues = () => {
    let disableButton = false;
    $scope.tabs.controllers.testSelection.forEach((test) => {
      const params = test.parameters;
      for (let key in params) {
        const isTypeOfUrl = params[key].type === "url";

        if (isTypeOfUrl && !disableButton && !params[key].value) {
          disableButton = true;
          return;
        }

        if (isTypeOfUrl && params[key].value) {
          disableButton = !$scope.nodesManager.urlValuesValid(
            params[key].value
          );
          return;
        }
      }
    });

    $scope.disableTestButton = disableButton;
  };

  // Toggles between the current tab.
  $scope.toggleTab = function (tab) {
    $rootScope.title = $scope.tabs[tab].pagetitle;
    $rootScope.page = tab;
    $scope.currentpage = tab;

    switch (tab) {
      case "devices":
        $scope.tabs.devices.takeActionOptions = GeneralManager.getData(
          "device_actions"
        );
        break;
      case "controllers":
        $scope.tabs.controllers.takeActionOptions = GeneralManager.getData(
          "rack_controller_actions"
        );
        break;
    }
  };

  // Clear the search bar.
  $scope.clearSearch = function (tab) {
    $scope.tabs[tab].search = "";
    $scope.updateFilters(tab);
  };

  // Mark a node as selected or unselected.
  $scope.toggleChecked = function (node, tab) {
    if ($scope.tabs[tab].manager.isSelected(node.system_id)) {
      $scope.tabs[tab].manager.unselectItem(node.system_id);
    } else {
      $scope.tabs[tab].manager.selectItem(node.system_id);
    }
    updateAllViewableChecked(tab);
    updateActionErrorCount(tab);
    shouldClearAction(tab);
  };

  // Select all viewable nodes or deselect all viewable nodes.
  $scope.toggleCheckAll = function (tab) {
    if ($scope.tabs[tab].allViewableChecked) {
      angular.forEach($scope.tabs[tab].filtered_items, function (node) {
        $scope.tabs[tab].manager.unselectItem(node.system_id);
      });
    } else {
      angular.forEach($scope.tabs[tab].filtered_items, function (node) {
        $scope.tabs[tab].manager.selectItem(node.system_id);
      });
    }
    updateAllViewableChecked(tab);
    updateActionErrorCount(tab);
    shouldClearAction(tab);
  };

  $scope.updateAvailableActions = function (tab) {
    var selectedNodes = $scope.tabs[tab].selectedItems;
    var actionOptions = $scope.tabs[tab].takeActionOptions;

    actionOptions.forEach(function (action) {
      var count = 0;
      selectedNodes.forEach(function (node) {
        if (node.actions.indexOf(action.name) > -1) {
          count += 1;
        }
        action.available = count;
      });
    });
  };

  $scope.unselectImpossibleNodes = (tab) => {
    const { actionOption, manager, selectedItems } = $scope.tabs[tab];

    const nodesToUnselect = selectedItems.reduce((acc, node) => {
      if (!node.actions.includes(actionOption.name)) {
        acc.push(node);
      }
      return acc;
    }, []);

    nodesToUnselect.forEach((node) => {
      manager.unselectItem(node.system_id);
    });

    updateActionErrorCount(tab);

    // 07/05/2019 Caleb: Force refresh of filtered machines.
    // Remove when machines table rewritten with one-way binding.
    $scope.tabs[tab].search = "in:(selected)";
  };

  $scope.onNodeListingChanged = function (nodes, tab) {
    if (
      nodes.length === 0 &&
      $scope.tabs[tab].search !== "" &&
      $scope.tabs[tab].search === $scope.tabs[tab].previous_search
    ) {
      $scope.tabs[tab].search = "";
      $scope.updateFilters(tab);
    }
  };

  // When the filtered nodes change update if all check buttons
  // should be checked or not.
  $scope.$watchCollection("tabs.devices.filtered_items", function () {
    updateAllViewableChecked("devices");
    removeEmptyFilter("devices");
  });
  $scope.$watchCollection("tabs.controllers.filtered_items", function () {
    updateAllViewableChecked("controllers");
    removeEmptyFilter("controllers");
  });

  // Shows the current selection.
  $scope.showSelected = function (tab) {
    enterViewSelected(tab);
    $scope.updateFilters(tab);
  };

  // Adds or removes a filter to the search.
  $scope.toggleFilter = function (type, value, tab) {
    // Don't allow a filter to be changed when an action is
    // in progress.
    if (angular.isObject($scope.tabs[tab].actionOption)) {
      return;
    }
    $scope.tabs[tab].filters = SearchService.toggleFilter(
      $scope.tabs[tab].filters,
      type,
      value,
      true
    );
    $scope.tabs[tab].search = SearchService.filtersToString(
      $scope.tabs[tab].filters
    );
  };

  // Return True if the filter is active.
  $scope.isFilterActive = function (type, value, tab) {
    return SearchService.isFilterActive(
      $scope.tabs[tab].filters,
      type,
      value,
      true
    );
  };

  // Update the filters object when the search bar is updated.
  $scope.updateFilters = function (tab) {
    var filters = SearchService.getCurrentFilters($scope.tabs[tab].search);
    if (filters === null) {
      $scope.tabs[tab].filters = SearchService.getEmptyFilter();
      $scope.tabs[tab].searchValid = false;
    } else {
      $scope.tabs[tab].filters = filters;
      $scope.tabs[tab].searchValid = true;
    }
    shouldClearAction(tab);
  };

  // Sorts the table by predicate.
  $scope.sortTable = function (predicate, tab) {
    $scope.tabs[tab].predicate = predicate;
    $scope.tabs[tab].reverse = !$scope.tabs[tab].reverse;
  };

  // Sets the viewable column or sorts.
  $scope.selectColumnOrSort = function (predicate, tab) {
    if ($scope.tabs[tab].column !== predicate) {
      $scope.tabs[tab].column = predicate;
    } else {
      $scope.sortTable(predicate, tab);
    }
  };

  // Return True if the node supports the action.
  $scope.supportsAction = function (node, tab) {
    if (!$scope.tabs[tab].actionOption) {
      return true;
    }
    return node.actions.indexOf($scope.tabs[tab].actionOption.name) >= 0;
  };

  $scope.getFailedTests = (tabName) => {
    const tab = $scope.tabs[tabName];
    const nodes = tab.selectedItems;
    tab.failedTests = [];
    tab.loadingFailedTests = true;
    MachinesManager.getLatestFailedTests(nodes).then(
      (tests) => {
        tab.failedTests = tests;
        tab.loadingFailedTests = false;
      },
      (error) => {
        const authUser = UsersManager.getAuthUser();
        if (angular.isObject(authUser)) {
          NotificationsManager.createItem({
            message: `Unable to load tests: ${error}`,
            category: "error",
            user: authUser.id,
          });
        } else {
          $log.error(error);
        }
      }
    );
  };

  $scope.getFailedTestCount = (tabName) => {
    const tab = $scope.tabs[tabName];
    const nodes = tab.selectedItems;
    const tests = tab.failedTests;
    return nodes.reduce((acc, node) => {
      if (tests[node.system_id]) {
        acc += tests[node.system_id].length;
      }
      return acc;
    }, 0);
  };

  // Called when the action option gets changed.
  $scope.actionOptionSelected = function (tab) {
    updateActionErrorCount(tab);
    enterViewSelected(tab);

    // Hide the add device section.
    if (tab === "devices") {
      if (angular.isObject($scope.addDeviceScope)) {
        $scope.addDeviceScope.hide();
      }
    }

    if (
      $scope.tabs[tab].actionOption &&
      $scope.tabs[tab].actionOption.name === "override-failed-testing"
    ) {
      $scope.getFailedTests(tab);
    }
  };

  // Return True if there is an action error.
  $scope.isActionError = function (tab) {
    return $scope.tabs[tab].actionErrorCount !== 0;
  };

  // Called when the current action is cancelled.
  $scope.actionCancel = function (tab) {
    resetActionProgress(tab);
    leaveViewSelected(tab);
    $scope.tabs[tab].actionOption = null;
    $scope.tabs[tab].suppressFailedTestsChecked = false;
    if ($scope.tabs[tab].testSelection) {
      $scope.tabs[tab].testSelection.forEach((script) => {
        script.parameters = $scope.setDefaultValues(script.parameters);
      });
    }
  };

  // Perform the action on all nodes.
  $scope.actionGo = function (tabName) {
    var tab = $scope.tabs[tabName];
    var extra = {};
    let scriptInput = {};
    var deferred = $q.defer();
    // Actions can use preAction is to execute before the action
    // is exectued on all the nodes. We initialize it with a
    // promise so that later we can always treat it as a
    // promise, no matter if something is to be executed or not.
    var preAction = deferred.promise;
    deferred.resolve();
    var i, j;

    // Set deploy parameters if a deploy or set zone action.
    if (
      tab.actionOption.name === "set-zone" &&
      angular.isNumber(tab.zoneSelection.id)
    ) {
      // Set the zone parameter.
      extra.zone_id = tab.zoneSelection.id;
    } else if (tab.actionOption.name === "test") {
      if (!tab.actionProgress.showing_confirmation) {
        var progress = tab.actionProgress;
        for (i = 0; i < tab.selectedItems.length; i++) {
          if (tab.selectedItems[i].status_code === 6) {
            progress.affected_nodes++;
          }
        }
        if (progress.affected_nodes != 0) {
          progress.confirmation_message =
            progress.affected_nodes +
            " of " +
            tab.selectedItems.length +
            " " +
            $scope.page +
            " are in a deployed state.";
          progress.showing_confirmation = true;
          return;
        }
      }
      // Set the test options.
      extra.enable_ssh = tab.testOptions.enableSSH;
      extra.testing_scripts = [];
      for (i = 0; i < tab.testSelection.length; i++) {
        extra.testing_scripts.push(tab.testSelection[i].id);
      }
      if (extra.testing_scripts.length === 0) {
        // Tell the region not to run any tests.
        extra.testing_scripts.push("none");
      }
      const testingScriptsWithUrlParam = tab.testSelection.filter((test) => {
        const paramsWithUrl = [];
        for (let key in test.parameters) {
          if (test.parameters[key].type === "url") {
            paramsWithUrl.push(test.parameters[key]);
          }
        }
        return paramsWithUrl.length;
      });

      testingScriptsWithUrlParam.forEach((test) => {
        let urlValue;
        for (let key in test.parameters) {
          if (test.parameters[key].type === "url") {
            urlValue =
              test.parameters[key].value || test.parameters[key].default;
            break;
          }
        }
        scriptInput[test.name] = {
          url: urlValue,
        };
      });

      extra.script_input = scriptInput;
    } else if (
      tab.actionOption.name === "delete" &&
      tabName === "controllers" &&
      !tab.actionProgress.showing_confirmation
    ) {
      for (i = 0; i < tab.selectedItems.length; i++) {
        var controller = tab.selectedItems[i];
        for (j = 0; j < $scope.vlans.length; j++) {
          var vlan = $scope.vlans[j];
          if (vlan.primary_rack === controller.system_id) {
            tab.actionProgress.confirmation_details.push(
              controller.fqdn +
                " is the primary rack controller for " +
                vlan.name
            );
            tab.actionProgress.affected_nodes++;
          }
          if (vlan.secondary_rack === controller.system_id) {
            tab.actionProgress.confirmation_details.push(
              controller.fqdn +
                " is the secondary rack controller for " +
                vlan.name
            );
            tab.actionProgress.affected_nodes++;
          }
        }
      }

      // remove duplicates
      tab.actionProgress.confirmation_details = [
        ...new Set(tab.actionProgress.confirmation_details),
      ];

      if (tab.actionProgress.affected_nodes != 0) {
        if (tab.actionProgress.affected_nodes === 1) {
          tab.actionProgress.confirmation_message =
            "1 controller will be deleted.";
        } else {
          tab.actionProgress.confirmation_message =
            tab.actionProgress.affected_nodes + " controllers will be deleted.";
        }
        tab.actionProgress.showing_confirmation = true;
        return;
      }
    } else if (tab.actionOption.name === "tag") {
      extra.tags = $scope.tags.map(function (tag) {
        return tag.text;
      });

      $scope.tags = [];
    } else if (
      tab.actionOption.name === "override-failed-testing" &&
      tab.suppressFailedTestsChecked
    ) {
      const nodes = tab.selectedItems;
      const tests = tab.failedTests;
      nodes.forEach((node) => {
        if (tests[node.system_id]) {
          tab.manager.suppressTests(node, tests[node.system_id]);
        }
      });
    }

    preAction.then(
      function () {
        // Setup actionProgress.
        resetActionProgress(tabName);
        tab.actionProgress.total = tab.selectedItems.length;
        // Perform the action on all selected items.
        angular.forEach(tab.selectedItems, function (node) {
          tab.manager
            .performAction(node, tab.actionOption.name, extra)
            .then(
              function () {
                tab.actionProgress.completed += 1;
                node.action_failed = false;
              },
              function (error) {
                addErrorToActionProgress(tabName, error, node);
                node.action_failed = true;
                tab.testSelection.forEach((script) => {
                  script.parameters = $scope.setDefaultValues(
                    script.parameters
                  );
                });
              }
            )
            .finally(function () {
              updateSelectedItems(tabName);
            });
        });
      },
      function (error) {
        addErrorToActionProgress(tabName, error);
      }
    );
  };

  // Returns true when actions are being performed.
  $scope.hasActionsInProgress = function (tab) {
    var progress = $scope.tabs[tab].actionProgress;
    return progress.total > 0 && progress.completed !== progress.total;
  };

  // Returns true if any of the actions have failed.
  $scope.hasActionsFailed = function (tab) {
    return Object.keys($scope.tabs[tab].actionProgress.errors).length > 0;
  };

  // Called when the add device button is pressed.
  $scope.addDevice = function () {
    $scope.addDeviceScope.show();
  };

  // Called when the cancel add device button is pressed.
  $scope.cancelAddDevice = function () {
    $scope.addDeviceScope.cancel();
  };

  // Get the display text for device ip assignment type.
  $scope.getDeviceIPAssignment = function (ipAssignment) {
    return DEVICE_IP_ASSIGNMENT[ipAssignment];
  };

  $scope.updateFailedActionSentence = (tab) => {
    const { actionOption, actionErrorCount } = $scope.tabs[tab];

    // e.g. "5 machines" or "1 controller"
    const nodeString =
      actionErrorCount > 1
        ? `${actionErrorCount} ${tab}`
        : `${actionErrorCount} ${tab.slice(0, -1)}`;
    let sentence = `Action cannot be performed on ${nodeString}.`;

    if (actionOption && actionOption.name) {
      switch (actionOption.name) {
        case "exit-rescue-mode":
          sentence = `${nodeString} cannot exit rescue mode.`;
          break;
        case "lock":
          sentence = `${nodeString} cannot be locked.`;
          break;
        case "override-failed-testing":
          sentence = `Cannot override failed tests on ${nodeString}.`;
          break;
        case "rescue-mode":
          sentence = `${nodeString} cannot be put in rescue mode.`;
          break;
        case "set-zone":
          sentence = `Cannot set zone of ${nodeString}.`;
          break;
        case "unlock":
          sentence = `${nodeString} cannot be unlocked.`;
          break;
        default:
          sentence = `${nodeString} cannot be ${actionOption.sentence}.`;
      }
    }

    $scope.failedActionSentence = sentence;
  };

  $scope.getHardwareTestErrorText = function (error, tab) {
    var selectedItemsCount = $scope.tabs[tab].selectedItems.length;

    if (error === "Unable to run destructive test while deployed!") {
      var singular = false;
      var machinesText = "";

      if (selectedItemsCount === 1) {
        singular = true;
      }

      if (singular) {
        machinesText += "1 machine";
      } else {
        machinesText += selectedItemsCount + " machines";
      }

      return (
        machinesText +
        " cannot run hardware testing. The selected hardware tests contain" +
        " one or more destructive tests. Destructive tests cannot run on" +
        " deployed machines."
      );
    } else {
      return error;
    }
  };

  // Switch to the specified tab, if specified.
  angular.forEach(["devices", "controllers"], function (node_type) {
    if ($location.path().indexOf("/" + node_type) !== -1) {
      $scope.toggleTab(node_type);
    }
  });

  // The ScriptsManager is only needed for selecting testing or
  // commissioning scripts.
  var page_managers = [$scope.tabs[$scope.currentpage].manager];
  if ($scope.currentpage === "controllers") {
    page_managers.push(ScriptsManager);
    // VLANsManager is used during controller delete to see if its
    // managing a VLAN when confirming delete.
    page_managers.push(VLANsManager);
  }

  $scope.sendAnalyticsEvent = $filter("sendAnalyticsEvent");

  // Load the required managers for this controller. The ServicesManager
  // is required by the maasControllerStatus directive that is used
  // in the partial for this controller.
  ManagerHelperService.loadManagers(
    $scope,
    page_managers.concat([
      GeneralManager,
      ZonesManager,
      UsersManager,
      ServicesManager,
      TagsManager,
    ])
  ).then(function () {
    $scope.loading = false;

    // Set flag for RSD navigation item.
    if (!$rootScope.showRSDLink) {
      GeneralManager.getNavigationOptions().then(
        (res) => ($rootScope.showRSDLink = res.rsd)
      );
    }
  });

  // Stop polling and save the current filter when the scope is destroyed.
  $scope.$on("$destroy", function () {
    $interval.cancel($scope.statusPoll);
    SearchService.storeFilters("devices", $scope.tabs.devices.filters);
    SearchService.storeFilters("controllers", $scope.tabs.controllers.filters);
  });

  // Restore the filters if any saved.
  var devicesFilter = SearchService.retrieveFilters("devices");
  if (angular.isObject(devicesFilter)) {
    $scope.tabs.devices.search = SearchService.filtersToString(devicesFilter);
    $scope.updateFilters("devices");
  }
  var controllersFilter = SearchService.retrieveFilters("controllers");
  if (angular.isObject(controllersFilter)) {
    $scope.tabs.controllers.search = SearchService.filtersToString(
      controllersFilter
    );
    $scope.updateFilters("controllers");
  }

  // Set the query if the present in $stateParams.
  var query = $stateParams.query;
  if (angular.isString(query)) {
    $scope.tabs[$scope.currentpage].search = query;
    $scope.updateFilters($scope.currentpage);
  }
}

export default NodesListController;
