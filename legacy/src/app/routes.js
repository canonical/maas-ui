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

/* @ngInject */
const configureRoutes = ($stateProvider, $urlRouterProvider) => {
  // Remove class on the HTML element when initialed to aid styling separation.
  document.getElementsByTagName('html')[0].classList.remove("ui-view");

  $stateProvider
    .state("master", {
      abstract: true,
      template: layoutTmpl,
      controller: "MasterController",
    })
    .state("master.intro", {
      url: "/intro",
      template: introTmpl,
      controller: "IntroController",
    })
    .state("master.introUser", {
      url: "/intro/user",
      template: introUserTmpl,
      controller: "IntroUserController",
    })
    .state("master.machineResultDetails", {
      url: "/machine/:system_id/:result_type/:id",
      template: nodeResultTmpl,
      controller: "NodeResultController",
    })
    .state("master.machineEvents", {
      url: "/machine/:system_id/events",
      template: nodeEventsTmpl,
      controller: "NodeEventsController",
    })
    .state("master.machineDetails", {
      url: "/machine/:system_id",
      template: nodeDetailsTmpl,
      controller: "NodeDetailsController",
      reloadOnSearch: false,
    })
    .state("master.devices", {
      url: "/devices",
      template: nodesListTmpl,
      controller: "NodesListController",
    })
    .state("master.deviceResultDetails", {
      url: "/device/:system_id/:result_type/:id",
      template: nodeResultTmpl,
      controller: "NodeResultController",
    })
    .state("master.deviceEvents", {
      url: "/device/:system_id/events",
      template: nodeEventsTmpl,
      controller: "NodeEventsController",
    })
    .state("master.deviceDetails", {
      url: "/device/:system_id",
      template: nodeDetailsTmpl,
      controller: "NodeDetailsController",
      reloadOnSearch: false,
    })
    .state("master.controllers", {
      url: "/controllers",
      template: nodesListTmpl,
      controller: "NodesListController",
    })
    .state("master.controllerResultDetails", {
      url: "/controller/:system_id/:result_type/:id",
      template: nodeResultTmpl,
      controller: "NodeResultController",
    })
    .state("master.controllerEvents", {
      url: "/controller/:system_id/events",
      template: nodeEventsTmpl,
      controller: "NodeEventsController",
    })
    .state("master.controllerDetails", {
      url: "/controller/:system_id",
      template: nodeDetailsTmpl,
      controller: "NodeDetailsController",
      reloadOnSearch: false,
    })
    .state("nodes", {
      url: "/nodes",
      redirectTo: "/machines",
    })
    .state("nodeDetails", {
      url: "/node/machine/:system_id",
      redirectTo: "/machine/:system_id",
    })
    .state("nodeResultDetails", {
      url: "/node/machine/:system_id/:result_type/:id",
      redirectTo: "/machine/:system_id/:result_type/:id",
    })
    .state("nodeEvents", {
      url: "/node/machine/:system_id/events",
      redirectTo: "/machine/:system_id/events",
    })
    .state("nodeDeviceDetails", {
      url: "/node/device/:system_id",
      redirectTo: "/device/:system_id",
    })
    .state("nodeDeviceResultDetail", {
      url: "/node/device/:system_id/:result_type/:id",
      redirectTo: "/device/:system_id/:result_type/:id",
    })
    .state("nodeDeviceEvents", {
      url: "/node/device/:system_id/events",
      redirectTo: "/device/:system_id/events",
    })
    .state("nodeControllerDetails", {
      url: "/node/controller/:system_id",
      redirectTo: "/controller/:system_id",
    })
    .state("nodeControllerResultDetails", {
      url: "/node/controller/:system_id/:result_type/:id",
      redirectTo: "/controller/:system_id/:result_type/:id",
    })
    .state("nodeControllerEvents", {
      url: "/node/controller/:system_id/events",
      redirectTo: "/controller/:system_id/events",
    })
    .state("master.kvm", {
      url: "/kvm",
      template: podsListTmpl,
      controller: "PodsListController",
    })
    .state("master.kvmDetails", {
      url: "/kvm/:id",
      template: podDetailsTmpl,
      controller: "PodDetailsController",
    })
    .state("pods", { url: "/pods", redirectTo: "/kvm" })
    .state("podDetails", { url: "/pod/:id", redirectTo: "/kvm/:id" })
    .state("master.rsd", {
      url: "/rsd",
      template: podsListTmpl,
      controller: "PodsListController",
    })
    .state("master.rsdDetails", {
      url: "/rsd/:id",
      template: podDetailsTmpl,
      controller: "PodDetailsController",
    })
    .state("master.images", {
      url: "/images",
      template: imagesTmpl,
      controller: "ImagesController",
    })
    .state("master.domains", {
      url: "/domains",
      template: domainsListTmpl,
      controller: "DomainsListController",
    })
    .state("master.domainDetails", {
      url: "/domain/:domain_id",
      template: domainDetailsTmpl,
      controller: "DomainDetailsController",
    })
    .state("master.spaceDetails", {
      url: "/space/:space_id",
      template: spaceDetailsTmpl,
      controller: "SpaceDetailsController",
    })
    .state("master.fabricDetails", {
      url: "/fabric/:fabric_id",
      template: fabricDetailsTmpl,
      controller: "FabricDetailsController",
    })
    .state("master.subnets", {
      url: "/subnets",
      redirectTo: "/networks?by=fabric",
    })
    .state("master.network", {
      url: "/networks",
      template: networksListTmpl,
      controller: "NetworksListController",
      reloadOnSearch: false,
    })
    .state("master.subnetDetails", {
      url: "/subnet/:subnet_id",
      template: subnetDetailsTmpl,
      controller: "SubnetDetailsController",
    })
    .state("master.vlanDetails", {
      url: "/vlan/:vlan_id",
      template: vlanDetailsTmpl,
      controller: "VLANDetailsController",
      controllerAs: "vlanDetails",
    })
    .state("master.zoneDetails", {
      url: "/zone/:zone_id",
      template: zoneDetailsTmpl,
      controller: "ZoneDetailsController",
    })
    .state("master.zones", {
      url: "/zones",
      template: zonesListTmpl,
      controller: "ZonesListController",
      reloadOnSearch: false,
    })
    .state("master.pools", {
      url: "/pools",
      template: nodesListTmpl,
      controller: "NodesListController",
    })
    .state("master.dashboard", {
      url: "/dashboard",
      template: dashboardTmpl,
      controller: "DashboardController",
    });

  $urlRouterProvider.otherwise(() => {
    window.location.replace(`${process.env.BASENAME}/r/machines`);
  });
};

export default configureRoutes;
