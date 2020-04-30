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
import ngCookies from "angular-cookies";
import ngRoute from "angular-route";
import ngSanitize from "angular-sanitize";
import React from "react";
import ReactDOM from "react-dom";
require("ng-tags-input");
require("angular-vs-repeat");
import singleSpaAngularJS from "single-spa-angularjs";
import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";

import configureRoutes from "./routes";
import bootstrapOverWebsocket from "./bootstrap";
import { Footer, Header } from "@canonical/maas-ui-shared";

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
import {
  filterSource
} from "./controllers/subnet_details"; // TODO: fix export/namespace
// prettier-ignore
import {
  ignoreSelf,
  removeNoDHCP
} from "./controllers/vlan_details"; // TODO: fix export/namespace
import filterByFabric from "./filters/by_fabric";
import { filterBySpace, filterByNullSpace } from "./filters/by_space";
import { filterBySubnet, filterBySubnetOrVlan } from "./filters/by_subnet";
import { filterByVLAN, filterControllersByVLAN } from "./filters/by_vlan";
import { formatBytes, convertGigabyteToBytes } from "./filters/format_bytes";
import { sendAnalyticsEvent } from "./filters/send_analytics_event";
import formatStorageType from "./filters/format_storage_type";
import nodesFilter from "./filters/nodes";
import orderByDate from "./filters/order_by_date";
import range from "./filters/range";
import removeDefaultVLAN from "./filters/remove_default_vlan";

// services
import BrowserService from "./services/browser";
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
// TODO: move to factories
import PollingManager from "./services/pollingmanager";
// TODO: fix name
import KVMDeployOSBlacklist from "./services/osblacklist";
import RegionConnection from "./services/region";
import SearchService from "./services/search";
import ValidationService from "./services/validation";

// factories
import BootResourcesManager from "./factories/bootresources";
import ConfigsManager from "./factories/configs";
import ControllersManager from "./factories/controllers";
import DevicesManager from "./factories/devices";
import DHCPSnippetsManager from "./factories/dhcpsnippets";
import DiscoveriesManager from "./factories/discoveries";
import DomainsManager from "./factories/domains";
import EventsManagerFactory from "./factories/events";
import FabricsManager from "./factories/fabrics";
import { getBakery } from "./directives/login"; // TODO: move to factories
import GeneralManager from "./factories/general";
import IPRangesManager from "./factories/ipranges";
import MachinesManager from "./factories/machines";
import NodeResultsManagerFactory from "./factories/node_results";
import NodesManager from "./factories/nodes"; // TODO: move to services
import NotificationsManager from "./factories/notifications";
import PackageRepositoriesManager from "./factories/packagerepositories";
import PodsManager from "./factories/pods"; // TODO: move to services
import ResourcePoolsManager from "./factories/resourcepools";
import ScriptsManager from "./factories/scripts";
import ServicesManager from "./factories/services";
import SpacesManager from "./factories/spaces";
import SSHKeysManager from "./factories/sshkeys";
import StaticRoutesManager from "./factories/staticroutes";
import SubnetsManager from "./factories/subnets";
import SwitchesManager from "./factories/switches";
import TagsManager from "./factories/tags";
import UsersManager from "./factories/users";
import VLANsManager from "./factories/vlans";
import ZonesManager from "./factories/zones";

// controllers
import AddDeviceController from "./controllers/add_device";
import AddDomainController from "./controllers/add_domain";
import AddHardwareController from "./controllers/add_hardware";
import DashboardController from "./controllers/dashboard";
import DomainDetailsController from "./controllers/domain_details";
import DomainsListController from "./controllers/domains_list";
import FabricDetailsController from "./controllers/fabric_details";
import ImagesController from "./controllers/images";
import IntroUserController from "./controllers/intro_user";
import IntroController from "./controllers/intro";
import NetworksListController from "./controllers/networks_list";
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
import NodesListController from "./controllers/nodes_list";
import PodDetailsController from "./controllers/pod_details";
import PodsListController from "./controllers/pods_list";
import PreferencesController from "./controllers/prefs";
import SettingsController from "./controllers/settings";
import SpaceDetailsController from "./controllers/space_details";
import { SubnetDetailsController } from "./controllers/subnet_details";
import { VLANDetailsController } from "./controllers/vlan_details";
import ZoneDetailsController from "./controllers/zone_details";
import ZonesListController from "./controllers/zones_list";

// directives
// prettier-ignore
import loading from "./directives/loading";
import storageDisksPartitions from "./directives/nodedetails/storage_disks_partitions";
import storageFilesystems from "./directives/nodedetails/storage_filesystems";
import storageDatastores from "./directives/nodedetails/storage_datastores";
import nodeDetailsSummary from "./directives/nodedetails/summary";
import podDetailsSummary from "./directives/pod-details/summary";
import maasMachinesTable from "./directives/machines_table";
import maasDhcpSnippetsTable from "./directives/dhcp_snippets_table";
import addMachine from "./directives/nodelist/add_machine";

import kvmStorageDropdown from "./directives/pod-details/kvm_storage_dropdown";
import nodesListFilter from "./directives/nodelist/nodes_list_filter";
import maasAccordion from "./directives/accordion";
import { maasActionButton } from "./directives/action_button";
import { maasBootImages, maasBootImagesStatus } from "./directives/boot_images";
import { maasCta } from "./directives/call_to_action";
import maasCardLoader from "./directives/card_loader";
import maasCodeLines from "./directives/code_lines";
import contenteditable from "./directives/contenteditable";
// prettier-ignore
import {
  maasControllerImageStatus
} from "./directives/controller_image_status";
import { maasControllerStatus } from "./directives/controller_status";
import { maasDblClickOverlay } from "./directives/dbl_click_overlay";
import maasDefaultOsSelect from "./directives/default_os_select";
import maasEnterBlur from "./directives/enter_blur";
import maasEnter from "./directives/enter";
import { maasErrorOverlay } from "./directives/error_overlay";
import maasErrorToggle from "./directives/error_toggle";
import maasIpRanges from "./directives/ipranges";
import { externalLogin } from "./directives/login";
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
import maasNavigationDropdown from "./directives/navigation_dropdown";
import maasNavigationMobile from "./directives/navigation_mobile";
import { maasNotifications } from "./directives/notifications";
import { maasOsSelect } from "./directives/os_select";
import ngPlaceholder from "./directives/placeholder";
import { maasPodParameters } from "./directives/pod_parameters";
import { maasCoresChart } from "./directives/cores_chart";
import {
  maasPowerInput,
  maasPowerParameters,
} from "./directives/power_parameters";
import {
  maasPrefKeys,
  maasPrefKeysInject,
  maasPrefKeysAdd,
  maasPrefKey,
  maasPrefKeyDelete,
  maasPrefKeyCopy,
} from "./directives/pref_keys";
import maasProxySettings from "./directives/proxy_settings";
import maasReleaseName from "./directives/release_name";
import { maasReleaseOptions } from "./directives/release_options";
import pScriptExpander from "./directives/script_expander";
import maasScriptResultsList from "./directives/script_results_list";
import { maasScriptRunTime } from "./directives/script_runtime";
import { maasScriptSelect } from "./directives/script_select";
import { maasScriptStatus } from "./directives/script_status";
import maasSshKeys from "./directives/ssh_keys";
import maasSwitchesTable from "./directives/switches_table";
import toggleCtrl from "./directives/toggle_control";
import ngType from "./directives/type";
import maasVersionReloader from "./directives/version_reloader";
import windowWidth from "./directives/window_width";

const ROOT_API = `${process.env.BASENAME}/api/2.0/`;
const LOGIN_CANARY_API = `${ROOT_API}account/?op=list_authorisation_tokens`;
const LOGOUT_API = `${process.env.BASENAME}/accounts/logout/`;

const checkAuthenticated = () => {
  // Check that the user is authenticated, otherwise redirect to the React
  // login form.
  fetch(LOGIN_CANARY_API).then((response) => {
    if (!response.ok) {
      window.location = `${process.env.BASENAME}${process.env.REACT_BASENAME}`;
    }
  });
};

checkAuthenticated();

/* @ngInject */
function configureMaas(
  $interpolateProvider,
  $routeProvider,
  $httpProvider,
  $locationProvider,
  $compileProvider,
  tagsInputConfigProvider
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

  $locationProvider.hashPrefix("");
  $locationProvider.html5Mode({
    enabled: false,
    requireBase: true,
  });

  // Set the $httpProvider to send the csrftoken in the header of any
  // http request.
  $httpProvider.defaults.xsrfCookieName = "csrftoken";
  $httpProvider.defaults.xsrfHeaderName = "X-CSRFToken";

  // Batch http responses into digest cycles
  $httpProvider.useApplyAsync(true);

  configureRoutes($routeProvider);
}

// Force users to #/intro when it has not been completed.
/* @ngInject */
function introRedirect($rootScope, $location, $window) {
  $rootScope.$on("$routeChangeStart", function (event, next, current) {
    if ($window.CONFIG && !$window.CONFIG.completed_intro) {
      if (next.controller !== "IntroController") {
        $location.path("/intro");
      }
    } else if ($window.CONFIG && !$window.CONFIG.current_user.completed_intro) {
      if (next.controller !== "IntroUserController") {
        $location.path("/intro/user");
      }
    }
  });
}

/* @ngInject */
function dashboardRedirect($rootScope, $location, $window) {
  $rootScope.$on("$routeChangeStart", function (event, next, current) {
    // Only superusers currently have access to the dashboard
    if ($window.CONFIG && !$window.CONFIG.current_user.is_superuser) {
      if (next.controller == "DashboardController") {
        $location.path("/machines");
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

const renderHeader = ($rootScope, $window, $http) => {
  const headerNode = document.querySelector("#header");
  if (!headerNode) {
    return;
  }
  const {
    completed_intro,
    navigation_options,
    current_user,
    uuid,
    version,
  } = $window.CONFIG;
  const debug = process.env.NODE_ENV === "development";
  ReactDOM.render(
    <Header
      authUser={current_user}
      basename={process.env.BASENAME}
      completedIntro={
        completed_intro && current_user && current_user.completed_intro
      }
      debug={debug}
      enableAnalytics={window.CONFIG.enable_analytics}
      location={window.location}
      logout={() => {
        localStorage.clear();
        $http.post(LOGOUT_API).then(() => {
          $window.location.href = `${process.env.BASENAME}${process.env.REACT_BASENAME}`;
        });
      }}
      newURLPrefix={process.env.REACT_BASENAME}
      onSkip={() => {
        // Call skip inside this function because skip won't exist when the
        // header is first rendered.
        $rootScope.skip();
      }}
      rootScope={$rootScope}
      showRSD={navigation_options && navigation_options.rsd}
      uuid={uuid}
      version={version}
    />,
    headerNode
  );
};

const renderFooter = ($window) => {
  const footerNode = document.querySelector("#footer");
  if (!footerNode) {
    return;
  }
  ReactDOM.render(
    <Footer
      maasName={$window.CONFIG.maas_name}
      version={$window.CONFIG.version}
    />,
    footerNode
  );
};

/* @ngInject */
const displayTemplate = ($rootScope, $window, $http) => {
  $rootScope.site = window.CONFIG.maas_name;
  renderHeader($rootScope, $window, $http);
  renderFooter($window);

  $rootScope.$on("$routeChangeSuccess", function (event, next, current) {
    // Update the header when the route changes.
    renderHeader($rootScope, $window, $http);
  });
};

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
};

const moduleName = "MAAS";
angular
  .module(moduleName, [
    ngRoute,
    ngCookies,
    ngSanitize,
    "ngTagsInput",
    "vs-repeat",
    "ngSentry",
  ])
  .config(configureMaas)
  .run(configureSentry)
  .run(displayTemplate)
  .run(dashboardRedirect)
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
  .filter("filterSource", filterSource)
  .filter("ignoreSelf", ignoreSelf)
  .filter("removeNoDHCP", removeNoDHCP)
  .filter("filterByFabric", filterByFabric)
  .filter("filterBySpace", filterBySpace)
  .filter("filterByNullSpace", filterByNullSpace)
  .filter("filterBySubnet", filterBySubnet)
  .filter("filterBySubnetOrVlan", filterBySubnetOrVlan)
  .filter("filterByVLAN", filterByVLAN)
  .filter("filterControllersByVLAN", filterControllersByVLAN)
  .filter("formatBytes", formatBytes)
  .filter("sendAnalyticsEvent", sendAnalyticsEvent)
  .filter("convertGigabyteToBytes", convertGigabyteToBytes)
  .filter("formatStorageType", formatStorageType)
  .filter("nodesFilter", nodesFilter)
  .filter("orderByDate", orderByDate)
  .filter("range", range)
  .filter("removeDefaultVLAN", removeDefaultVLAN)
  .filter("filterEditInterface", filterEditInterface)
  .filter("filterSelectedInterfaces", filterSelectedInterfaces)
  .filter("filterVLANNotOnFabric", filterVLANNotOnFabric)
  // factories
  .factory("PollingManager", PollingManager)
  .factory("BootResourcesManager", BootResourcesManager)
  .factory("ConfigsManager", ConfigsManager)
  .factory("ControllersManager", ControllersManager)
  .factory("DevicesManager", DevicesManager)
  .factory("DHCPSnippetsManager", DHCPSnippetsManager)
  .factory("DiscoveriesManager", DiscoveriesManager)
  .factory("DomainsManager", DomainsManager)
  .factory("EventsManagerFactory", EventsManagerFactory)
  .factory("FabricsManager", FabricsManager)
  .factory("GeneralManager", GeneralManager)
  .factory("getBakery", getBakery)
  .factory("IPRangesManager", IPRangesManager)
  .factory("MachinesManager", MachinesManager)
  .factory("NodeResultsManagerFactory", NodeResultsManagerFactory)
  .factory("NotificationsManager", NotificationsManager)
  .factory("PackageRepositoriesManager", PackageRepositoriesManager)
  .factory("ResourcePoolsManager", ResourcePoolsManager)
  .factory("ScriptsManager", ScriptsManager)
  .factory("ServicesManager", ServicesManager)
  .factory("SpacesManager", SpacesManager)
  .factory("SSHKeysManager", SSHKeysManager)
  .factory("StaticRoutesManager", StaticRoutesManager)
  .factory("SubnetsManager", SubnetsManager)
  .factory("SwitchesManager", SwitchesManager)
  .factory("TagsManager", TagsManager)
  .factory("UsersManager", UsersManager)
  .factory("VLANsManager", VLANsManager)
  .factory("ZonesManager", ZonesManager)
  // services
  .service("BrowserService", BrowserService)
  .service("ControllerImageStatusService", ControllerImageStatusService)
  .service("ConverterService", ConverterService)
  .service("ErrorService", ErrorService)
  .service("JSONService", JSONService)
  .service("LogService", LogService)
  .service("Manager", Manager)
  .service("ManagerHelperService", ManagerHelperService)
  .service("NodesManager", NodesManager)
  .service("KVMDeployOSBlacklist", KVMDeployOSBlacklist)
  .service("PodsManager", PodsManager)
  .service("RegionConnection", RegionConnection)
  .service("SearchService", SearchService)
  .service("ValidationService", ValidationService)
  // controllers
  .controller("AddDeviceController", AddDeviceController)
  .controller("AddDomainController", AddDomainController)
  .controller("AddHardwareController", AddHardwareController)
  .controller("DashboardController", DashboardController)
  .controller("DomainDetailsController", DomainDetailsController)
  .controller("DomainsListController", DomainsListController)
  .controller("FabricDetailsController", FabricDetailsController)
  .controller("ImagesController", ImagesController)
  .controller("IntroUserController", IntroUserController)
  .controller("IntroController", IntroController)
  .controller("NetworksListController", NetworksListController)
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
  .controller("NodesListController", NodesListController)
  .controller("PodDetailsController", PodDetailsController)
  .controller("PodsListController", PodsListController)
  .controller("PreferencesController", PreferencesController)
  .controller("SettingsController", SettingsController)
  .controller("SpaceDetailsController", SpaceDetailsController)
  .controller("SubnetDetailsController", SubnetDetailsController)
  .controller("VLANDetailsController", VLANDetailsController)
  .controller("ZoneDetailsController", ZoneDetailsController)
  .controller("ZonesListController", ZonesListController)
  // directives
  .directive("ngLoading", loading)
  .directive("storageDisksPartitions", storageDisksPartitions)
  .directive("storageFilesystems", storageFilesystems)
  .directive("storageDatastores", storageDatastores)
  .directive("addMachine", addMachine)
  .directive("kvmStorageDropdown", kvmStorageDropdown)
  .directive("nodesListFilter", nodesListFilter)
  .directive("maasAccordion", maasAccordion)
  .directive("maasActionButton", maasActionButton)
  .directive("maasBootImagesStatus", maasBootImagesStatus)
  .directive("maasBootImages", maasBootImages)
  .directive("maasCta", maasCta)
  .directive("maasCardLoader", maasCardLoader)
  .directive("maasCodeLines", maasCodeLines)
  .directive("contenteditable", contenteditable)
  .directive("maasControllerImageStatus", maasControllerImageStatus)
  .directive("maasControllerStatus", maasControllerStatus)
  .directive("maasDblClickOverlay", maasDblClickOverlay)
  .directive("maasDefaultOsSelect", maasDefaultOsSelect)
  .directive("maasEnterBlur", maasEnterBlur)
  .directive("maasEnter", maasEnter)
  .directive("maasErrorOverlay", maasErrorOverlay)
  .directive("maasErrorToggle", maasErrorToggle)
  .directive("maasIpRanges", maasIpRanges)
  .directive("externalLogin", externalLogin)
  .directive("maasObjForm", maasObjForm)
  .directive("maasObjFieldGroup", maasObjFieldGroup)
  .directive("maasObjField", maasObjField)
  .directive("maasObjSave", maasObjSave)
  .directive("maasObjErrors", maasObjErrors)
  .directive("maasObjSaving", maasObjSaving)
  .directive("maasObjShowSaving", maasObjShowSaving)
  .directive("maasObjHideSaving", maasObjHideSaving)
  .directive("macAddress", macAddress)
  .directive("maasMachinesTable", maasMachinesTable)
  .directive("maasDhcpSnippetsTable", maasDhcpSnippetsTable)
  .directive("maasNavigationDropdown", maasNavigationDropdown)
  .directive("maasNavigationMobile", maasNavigationMobile)
  .directive("maasNotifications", maasNotifications)
  .directive("maasOsSelect", maasOsSelect)
  .directive("ngPlaceholder", ngPlaceholder)
  .directive("maasPodParameters", maasPodParameters)
  .directive("maasCoresChart", maasCoresChart)
  .directive("maasPowerInput", maasPowerInput)
  .directive("maasPowerParameters", maasPowerParameters)
  .directive("maasPrefKeys", maasPrefKeys)
  .directive("maasPrefKeysInject", maasPrefKeysInject)
  .directive("maasPrefKeysAdd", maasPrefKeysAdd)
  .directive("maasPrefKey", maasPrefKey)
  .directive("maasPrefKeyDelete", maasPrefKeyDelete)
  .directive("maasPrefKeyCopy", maasPrefKeyCopy)
  .directive("maasProxySettings", maasProxySettings)
  .directive("maasReleaseName", maasReleaseName)
  .directive("maasReleaseOptions", maasReleaseOptions)
  .directive("nodeDetailsSummary", nodeDetailsSummary)
  .directive("podDetailsSummary", podDetailsSummary)
  .directive("pScriptExpander", pScriptExpander)
  .directive("maasScriptResultsList", maasScriptResultsList)
  .directive("maasScriptRunTime", maasScriptRunTime)
  .directive("maasScriptSelect", maasScriptSelect)
  .directive("maasScriptStatus", maasScriptStatus)
  .directive("maasSshKeys", maasSshKeys)
  .directive("maasSwitchesTable", maasSwitchesTable)
  .directive("toggleCtrl", toggleCtrl)
  .directive("ngType", ngType)
  .directive("maasVersionReloader", maasVersionReloader)
  .directive("windowWidth", windowWidth);

bootstrapOverWebsocket();

// export lifecycle events for singlespa
const ngLifecycles = singleSpaAngularJS({
  angular,
  mainAngularModule: moduleName,
  uiRouter: false,
  preserveGlobal: false
});

export const bootstrap = ngLifecycles.bootstrap;
export const mount = ngLifecycles.mount;
export const unmount = ngLifecycles.unmount;
