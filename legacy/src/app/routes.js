import layoutTmpl from "./partials/layout.html";
import dashboardTmpl from "./partials/dashboard.html";
import domainDetailsTmpl from "./partials/domain-details.html";
import domainsListTmpl from "./partials/domains-list.html";
import fabricDetailsTmpl from "./partials/fabric-details.html";
import imagesTmpl from "./partials/images.html";
import introTmpl from "./partials/intro.html";
import introUserTmpl from "./partials/intro-user.html";
import networksListTmpl from "./partials/networks-list.html";
import nodesListTmpl from "./partials/nodes-list.html";
import nodeDetailsTmpl from "./partials/node-details.html";
import nodeEventsTmpl from "./partials/node-events.html";
import nodeResultTmpl from "./partials/node-result.html";
import podDetailsTmpl from "./partials/pod-details.html";
import podsListTmpl from "./partials/pods-list.html";
import spaceDetailsTmpl from "./partials/space-details.html";
import subnetDetailsTmpl from "./partials/subnet-details.html";
import vlanDetailsTmpl from "./partials/vlan-details.html";
import zoneDetailsTmpl from "./partials/zone-details.html";
import zonesListTmpl from "./partials/zones-list.html";

export const prefixRoute = (route) =>
  `${process.env.BASENAME}${process.env.ANGULAR_BASENAME}${route}`;

/* @ngInject */
const configureRoutes = ($stateProvider, $urlRouterProvider) => {
  $stateProvider
    .state("master", {
      abstract: true,
      template: layoutTmpl,
      controller: "MasterController",
    })
    .state("master.intro", {
      url: prefixRoute("/intro"),
      template: introTmpl,
      controller: "IntroController",
    })
    .state("master.introUser", {
      url: prefixRoute("/intro/user"),
      template: introUserTmpl,
      controller: "IntroUserController",
    })
    .state("master.machineResultDetails", {
      url: prefixRoute("/machine/:system_id/:result_type/:id"),
      template: nodeResultTmpl,
      controller: "NodeResultController",
    })
    .state("master.machineEvents", {
      url: prefixRoute("/machine/:system_id/events"),
      template: nodeEventsTmpl,
      controller: "NodeEventsController",
    })
    .state("master.machineDetails", {
      url: prefixRoute("/machine/:system_id"),
      template: nodeDetailsTmpl,
      controller: "NodeDetailsController",
      reloadOnSearch: false,
    })
    .state("master.devices", {
      url: prefixRoute("/devices"),
      template: nodesListTmpl,
      controller: "NodesListController",
    })
    .state("master.deviceResultDetails", {
      url: prefixRoute("/device/:system_id/:result_type/:id"),
      template: nodeResultTmpl,
      controller: "NodeResultController",
    })
    .state("master.deviceEvents", {
      url: prefixRoute("/device/:system_id/events"),
      template: nodeEventsTmpl,
      controller: "NodeEventsController",
    })
    .state("master.deviceDetails", {
      url: prefixRoute("/device/:system_id"),
      template: nodeDetailsTmpl,
      controller: "NodeDetailsController",
      reloadOnSearch: false,
    })
    .state("master.controllers", {
      url: prefixRoute("/controllers"),
      template: nodesListTmpl,
      controller: "NodesListController",
    })
    .state("master.controllerResultDetails", {
      url: prefixRoute("/controller/:system_id/:result_type/:id"),
      template: nodeResultTmpl,
      controller: "NodeResultController",
    })
    .state("master.controllerEvents", {
      url: prefixRoute("/controller/:system_id/events"),
      template: nodeEventsTmpl,
      controller: "NodeEventsController",
    })
    .state("master.controllerDetails", {
      url: prefixRoute("/controller/:system_id"),
      template: nodeDetailsTmpl,
      controller: "NodeDetailsController",
      reloadOnSearch: false,
    })
    .state("nodes", {
      url: prefixRoute("/nodes"),
      redirectTo: prefixRoute("/machines"),
    })
    .state("nodeDetails", {
      url: prefixRoute("/node/machine/:system_id"),
      redirectTo: prefixRoute("/machine/:system_id"),
    })
    .state("nodeResultDetails", {
      url: prefixRoute("/node/machine/:system_id/:result_type/:id"),
      redirectTo: prefixRoute("/machine/:system_id/:result_type/:id"),
    })
    .state("nodeEvents", {
      url: prefixRoute("/node/machine/:system_id/events"),
      redirectTo: prefixRoute("/machine/:system_id/events"),
    })
    .state("nodeDeviceDetails", {
      url: prefixRoute("/node/device/:system_id"),
      redirectTo: prefixRoute("/device/:system_id"),
    })
    .state("nodeDeviceResultDetail", {
      url: prefixRoute("/node/device/:system_id/:result_type/:id"),
      redirectTo: prefixRoute("/device/:system_id/:result_type/:id"),
    })
    .state("nodeDeviceEvents", {
      url: prefixRoute("/node/device/:system_id/events"),
      redirectTo: prefixRoute("/device/:system_id/events"),
    })
    .state("nodeControllerDetails", {
      url: prefixRoute("/node/controller/:system_id"),
      redirectTo: prefixRoute("/controller/:system_id"),
    })
    .state("nodeControllerResultDetails", {
      url: prefixRoute("/node/controller/:system_id/:result_type/:id"),
      redirectTo: prefixRoute("/controller/:system_id/:result_type/:id"),
    })
    .state("nodeControllerEvents", {
      url: prefixRoute("/node/controller/:system_id/events"),
      redirectTo: prefixRoute("/controller/:system_id/events"),
    })
    .state("master.kvm", {
      url: prefixRoute("/kvm"),
      template: podsListTmpl,
      controller: "PodsListController",
    })
    .state("master.kvmDetails", {
      url: prefixRoute("/kvm/:id"),
      template: podDetailsTmpl,
      controller: "PodDetailsController",
    })
    .state("pods", {
      url: prefixRoute("/pods"),
      redirectTo: prefixRoute("/kvm"),
    })
    .state("podDetails", {
      url: prefixRoute("/pod/:id"),
      redirectTo: prefixRoute("/kvm/:id"),
    })
    .state("master.rsd", {
      url: prefixRoute("/rsd"),
      template: podsListTmpl,
      controller: "PodsListController",
    })
    .state("master.rsdDetails", {
      url: prefixRoute("/rsd/:id"),
      template: podDetailsTmpl,
      controller: "PodDetailsController",
    })
    .state("master.images", {
      url: prefixRoute("/images"),
      template: imagesTmpl,
      controller: "ImagesController",
    })
    .state("master.domains", {
      url: prefixRoute("/domains"),
      template: domainsListTmpl,
      controller: "DomainsListController",
    })
    .state("master.domainDetails", {
      url: prefixRoute("/domain/:domain_id"),
      template: domainDetailsTmpl,
      controller: "DomainDetailsController",
    })
    .state("master.spaceDetails", {
      url: prefixRoute("/space/:space_id"),
      template: spaceDetailsTmpl,
      controller: "SpaceDetailsController",
    })
    .state("master.fabricDetails", {
      url: prefixRoute("/fabric/:fabric_id"),
      template: fabricDetailsTmpl,
      controller: "FabricDetailsController",
    })
    .state("master.subnets", {
      url: prefixRoute("/subnets"),
      redirectTo: "/networks?by=fabric",
    })
    .state("master.network", {
      url: prefixRoute("/networks"),
      template: networksListTmpl,
      controller: "NetworksListController",
      reloadOnSearch: false,
    })
    .state("master.subnetDetails", {
      url: prefixRoute("/subnet/:subnet_id"),
      template: subnetDetailsTmpl,
      controller: "SubnetDetailsController",
    })
    .state("master.vlanDetails", {
      url: prefixRoute("/vlan/:vlan_id"),
      template: vlanDetailsTmpl,
      controller: "VLANDetailsController",
      controllerAs: "vlanDetails",
    })
    .state("master.zoneDetails", {
      url: prefixRoute("/zone/:zone_id"),
      template: zoneDetailsTmpl,
      controller: "ZoneDetailsController",
    })
    .state("master.zones", {
      url: prefixRoute("/zones"),
      template: zonesListTmpl,
      controller: "ZonesListController",
      reloadOnSearch: false,
    })
    .state("master.pools", {
      url: prefixRoute("/pools"),
      template: nodesListTmpl,
      controller: "NodesListController",
    })
    .state("master.dashboard", {
      url: prefixRoute("/dashboard"),
      template: dashboardTmpl,
      controller: "DashboardController",
    });

  $urlRouterProvider.otherwise(($injector, $location) => {
    // Redirect old hash routes to new routes
    if ($location.hash()) {
      window.history.pushState(
        null,
        null,
        `${process.env.BASENAME}${
          process.env.ANGULAR_BASENAME
        }${$location.hash()}`
      );
    } else {
      // fallthrough redirect machine listing
      window.history.pushState(
        null,
        null,
        `${process.env.BASENAME}${process.env.REACT_BASENAME}/machines`
      );
    }
  });
};

export default configureRoutes;
