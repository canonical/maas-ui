/* Copyright 2015-2018 Canonical Ltd.  This software is licensed under the
 * GNU Affero General Public License version 3 (see the file LICENSE).
 *
 * MAAS Module
 *
 * Initializes the MAAS module with its required dependencies and sets up
 * the interpolator to use '{$' and '$}' instead of '{{' and '}}' as this
 * conflicts with Django templates.
 */

// Load the SCSS.
import "../scss/build.scss";

import * as angular from "angular";
import uiRouter from "@uirouter/angularjs";
import ngCookies from "angular-cookies";
import ngRoute from "angular-route";
import ngSanitize from "angular-sanitize";
require("ng-tags-input");
require("angular-vs-repeat");
import singleSpaAngularJS from "single-spa-angularjs";
import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";

import { navigateToNew } from "@maas-ui/maas-ui-shared";
import configureRoutes from "./routes";
import setupWebsocket from "./bootstrap";

// filters
import {
  filterByUnusedForInterface,
  removeInterfaceParents,
  removeDefaultVLANIfVLAN,
  filterLinkModes,
  filterEditInterface,
  filterSelectedInterfaces,
  filterVLANNotOnFabric,
} from "./controllers/node_details_networking"; // TODO: fix export/namespace
// prettier-ignore
import {
  removeAvailableByNew,
  datastoresOnly
} from "./controllers/node_details_storage"; // TODO: fix export/namespace
// prettier-ignore
import filterByFabric from "./filters/by_fabric";
import { filterByVLAN } from "./filters/by_vlan";
import { formatBytes } from "./filters/format_bytes";
import { sendAnalyticsEvent } from "./filters/send_analytics_event";
import orderByDate from "./filters/order_by_date";
import removeDefaultVLAN from "./filters/remove_default_vlan";

// services
// prettier-ignore
// TODO: move to services
import {
  ControllerImageStatusService
} from "./directives/controller_image_status";
import ConverterService from "./services/converter";
import ErrorService from "./services/error";
import JSONService from "./services/json";
import LogService from "./services/log";
import Manager from "./services/manager";
import ManagerHelperService from "./services/managerhelper";
// TODO: fix name
import RegionConnection from "./services/region";
import ValidationService from "./services/validation";

// factories
import ControllersManager from "./factories/controllers";
import DHCPSnippetsManager from "./factories/dhcpsnippets";
import DomainsManager from "./factories/domains";
import EventsManagerFactory from "./factories/events";
import FabricsManager from "./factories/fabrics";
import GeneralManager from "./factories/general";
import MachinesManager from "./factories/machines";
import NodeResultsManagerFactory from "./factories/node_results";
import NodesManager from "./factories/nodes"; // TODO: move to services
import NotificationsManager from "./factories/notifications";
import PodsManager from "./factories/pods"; // TODO: move to services
import ScriptsManager from "./factories/scripts";
import ServicesManager from "./factories/services";
import SubnetsManager from "./factories/subnets";
import TagsManager from "./factories/tags";
import UsersManager from "./factories/users";
import VLANsManager from "./factories/vlans";
import ZonesManager from "./factories/zones";

// controllers
import MasterController from "./controllers/master";
// prettier-ignore
import {
  NodeNetworkingController
} from "./controllers/node_details_networking";
import { NodeStorageController } from "./controllers/node_details_storage";
import {
  NodeFilesystemsController,
  NodeAddSpecialFilesystemController,
} from "./controllers/node_details_storage_filesystems";
import NodeDetailsController from "./controllers/node_details";
import NodeEventsController from "./controllers/node_events";
import NodeResultController from "./controllers/node_result";
import NodeResultsController from "./controllers/node_results";

// directives
// prettier-ignore
import loading from "./directives/loading";
import storageDisksPartitions from "./directives/nodedetails/storage_disks_partitions";
import storageFilesystems from "./directives/nodedetails/storage_filesystems";
import storageDatastores from "./directives/nodedetails/storage_datastores";
import nodeDetailsSummary from "./directives/nodedetails/summary";
import maasDhcpSnippetsTable from "./directives/dhcp_snippets_table";
import { maasCta } from "./directives/call_to_action";
import maasCardLoader from "./directives/card_loader";
import maasCodeLines from "./directives/code_lines";
import contenteditable from "./directives/contenteditable";
// prettier-ignore
import {
  maasControllerImageStatus
} from "./directives/controller_image_status";
import { maasControllerStatus } from "./directives/controller_status";
import maasEnter from "./directives/enter";
import { maasErrorOverlay } from "./directives/error_overlay";
import maasErrorToggle from "./directives/error_toggle";
import {
  maasObjForm,
  maasObjFieldGroup,
  maasObjField,
  maasObjSave,
  maasObjErrors,
  maasObjSaving,
  maasObjShowSaving,
  maasObjHideSaving,
} from "./directives/maas_obj_form";
import macAddress from "./directives/mac_address";
import { maasNotifications } from "./directives/notifications";
import ngPlaceholder from "./directives/placeholder";
import {
  maasPowerInput,
  maasPowerParameters,
} from "./directives/power_parameters";
import maasReleaseName from "./directives/release_name";
import maasScriptResultsList from "./directives/script_results_list";
import { maasScriptRunTime } from "./directives/script_runtime";
import { maasScriptSelect } from "./directives/script_select";
import { maasScriptStatus } from "./directives/script_status";
import toggleCtrl from "./directives/toggle_control";
import ngType from "./directives/type";
import windowWidth from "./directives/window_width";

/* @ngInject */
function configureMaas(
  $interpolateProvider,
  $stateProvider,
  $httpProvider,
  $locationProvider,
  $compileProvider,
  tagsInputConfigProvider,
  $urlRouterProvider
) {
  // Disable debugInfo unless in a Jest context.
  // Re-enable debugInfo in development by running
  // angular.reloadWithDebugInfo(); in the console.
  // See: https://docs.angularjs.org/guide/production#disabling-debug-data
  $compileProvider.debugInfoEnabled(!!window.DEBUG);

  $interpolateProvider.startSymbol("{$");
  $interpolateProvider.endSymbol("$}");

  tagsInputConfigProvider.setDefaults("autoComplete", {
    minLength: 0,
    loadOnFocus: true,
    loadOnEmpty: true,
  });

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false,
  });

  // Set the $httpProvider to send the csrftoken in the header of any
  // http request.
  $httpProvider.defaults.xsrfCookieName = "csrftoken";
  $httpProvider.defaults.xsrfHeaderName = "X-CSRFToken";

  // Batch http responses into digest cycles
  $httpProvider.useApplyAsync(true);

  configureRoutes($stateProvider, $urlRouterProvider);
}

// Force users to #/intro when it has not been completed.
/* @ngInject */
function introRedirect($rootScope, $window) {
  $rootScope.$on("$routeChangeStart", function (event, next, current) {
    if ($window.CONFIG && !$window.CONFIG.completed_intro) {
      if (next.controller !== "IntroController") {
        navigateToNew("/intro");
      }
    } else if ($window.CONFIG && !$window.CONFIG.current_user.completed_intro) {
      if (next.controller !== "IntroUserController") {
        navigateToNew("/intro/user");
      }
    }
  });
}

/* @ngInject */
// Removes hide class from RSD link which is hidden
// so it doesn't flash up in the nav before angular is ready
function unhideRSDLinks() {
  let rsdLinks = document.querySelectorAll(".js-rsd-link");
  rsdLinks.forEach((link) => link.classList.remove("u-hide"));
}

Sentry.init({
  beforeSend(event) {
    if (process.env.NODE_ENV === "production") {
      return event;
    }
    return null;
  },
  dsn: process.env.SENTRY_DSN,
  integrations: [new Integrations.Angular()],
});

/* @ngInject */
const configureSentry = ($window) => {
  Sentry.setExtra("maasVersion", $window.CONFIG.version);
  Sentry.setTag("maas.version", $window.CONFIG.version);
};

const maasModule = "MAAS";
const MAAS = angular.module(maasModule, [
  ngRoute,
  ngCookies,
  ngSanitize,
  uiRouter,
  "ngTagsInput",
  "vs-repeat",
  "ngSentry",
]);

MAAS.config(configureMaas)
  .run(configureSentry)
  .run(introRedirect)
  .run(unhideRSDLinks)
  // Registration
  // filters
  .filter("filterByUnusedForInterface", filterByUnusedForInterface)
  .filter("removeInterfaceParents", removeInterfaceParents)
  .filter("removeDefaultVLANIfVLAN", removeDefaultVLANIfVLAN)
  .filter("filterLinkModes", filterLinkModes)
  .filter("removeAvailableByNew", removeAvailableByNew)
  .filter("datastoresOnly", datastoresOnly)
  .filter("filterByFabric", filterByFabric)
  .filter("filterByVLAN", filterByVLAN)
  .filter("formatBytes", formatBytes)
  .filter("sendAnalyticsEvent", sendAnalyticsEvent)
  .filter("orderByDate", orderByDate)
  .filter("removeDefaultVLAN", removeDefaultVLAN)
  .filter("filterEditInterface", filterEditInterface)
  .filter("filterSelectedInterfaces", filterSelectedInterfaces)
  .filter("filterVLANNotOnFabric", filterVLANNotOnFabric)
  // factories
  .factory("ControllersManager", ControllersManager)
  .factory("DHCPSnippetsManager", DHCPSnippetsManager)
  .factory("DomainsManager", DomainsManager)
  .factory("EventsManagerFactory", EventsManagerFactory)
  .factory("FabricsManager", FabricsManager)
  .factory("GeneralManager", GeneralManager)
  .factory("MachinesManager", MachinesManager)
  .factory("NodeResultsManagerFactory", NodeResultsManagerFactory)
  .factory("NotificationsManager", NotificationsManager)
  .factory("ScriptsManager", ScriptsManager)
  .factory("ServicesManager", ServicesManager)
  .factory("SubnetsManager", SubnetsManager)
  .factory("TagsManager", TagsManager)
  .factory("UsersManager", UsersManager)
  .factory("VLANsManager", VLANsManager)
  .factory("ZonesManager", ZonesManager)
  // services
  .service("ControllerImageStatusService", ControllerImageStatusService)
  .service("ConverterService", ConverterService)
  .service("ErrorService", ErrorService)
  .service("JSONService", JSONService)
  .service("LogService", LogService)
  .service("Manager", Manager)
  .service("ManagerHelperService", ManagerHelperService)
  .service("NodesManager", NodesManager)
  .service("PodsManager", PodsManager)
  .service("RegionConnection", RegionConnection)
  .service("ValidationService", ValidationService)
  // controllers
  .controller("MasterController", MasterController)
  .controller("NodeNetworkingController", NodeNetworkingController)
  .controller("NodeFilesystemsController", NodeFilesystemsController)
  .controller(
    "NodeAddSpecialFilesystemController",
    NodeAddSpecialFilesystemController
  )
  .controller("NodeStorageController", NodeStorageController)
  .controller("NodeDetailsController", NodeDetailsController)
  .controller("NodeEventsController", NodeEventsController)
  .controller("NodeResultController", NodeResultController)
  .controller("NodeResultsController", NodeResultsController)
  // directives
  .directive("ngLoading", loading)
  .directive("storageDisksPartitions", storageDisksPartitions)
  .directive("storageFilesystems", storageFilesystems)
  .directive("storageDatastores", storageDatastores)
  .directive("maasCta", maasCta)
  .directive("maasCardLoader", maasCardLoader)
  .directive("maasCodeLines", maasCodeLines)
  .directive("contenteditable", contenteditable)
  .directive("maasControllerImageStatus", maasControllerImageStatus)
  .directive("maasControllerStatus", maasControllerStatus)
  .directive("maasEnter", maasEnter)
  .directive("maasErrorOverlay", maasErrorOverlay)
  .directive("maasErrorToggle", maasErrorToggle)
  .directive("maasObjForm", maasObjForm)
  .directive("maasObjFieldGroup", maasObjFieldGroup)
  .directive("maasObjField", maasObjField)
  .directive("maasObjSave", maasObjSave)
  .directive("maasObjErrors", maasObjErrors)
  .directive("maasObjSaving", maasObjSaving)
  .directive("maasObjShowSaving", maasObjShowSaving)
  .directive("maasObjHideSaving", maasObjHideSaving)
  .directive("macAddress", macAddress)
  .directive("maasDhcpSnippetsTable", maasDhcpSnippetsTable)
  .directive("maasNotifications", maasNotifications)
  .directive("ngPlaceholder", ngPlaceholder)
  .directive("maasPowerInput", maasPowerInput)
  .directive("maasPowerParameters", maasPowerParameters)
  .directive("maasReleaseName", maasReleaseName)
  .directive("nodeDetailsSummary", nodeDetailsSummary)
  .directive("maasScriptResultsList", maasScriptResultsList)
  .directive("maasScriptRunTime", maasScriptRunTime)
  .directive("maasScriptSelect", maasScriptSelect)
  .directive("maasScriptStatus", maasScriptStatus)
  .directive("toggleCtrl", toggleCtrl)
  .directive("ngType", ngType)
  .directive("windowWidth", windowWidth);

const lifecycles = singleSpaAngularJS({
  angular,
  mainAngularModule: maasModule,
  uiRouter: true,
  preserveGlobal: false,
});

export const bootstrap = [setupWebsocket, lifecycles.bootstrap];
export const mount = (opts, mountedInstances, props) => {
  // If the config doesn't exist it probably means the application was
  // bootstrapped when logged out.
  if (!window.CONFIG) {
    // Bootstrap the application before mounting it.
    return setupWebsocket().then(() => {
      lifecycles.mount(opts, mountedInstances, props);
    });
  } else {
    // The application has already been bootstrapped so mount it.
    return lifecycles.mount(opts, mountedInstances, props);
  }
};
export const unmount = lifecycles.unmount;
