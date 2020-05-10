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
const configureRoutes = ($stateProvider) => {
  let routes;
  routes = $stateProvider
    .state("intro", {
      url: "/intro",
      template: introTmpl,
      controller: "IntroController",
    })
    .state("introUser", {
      url: "/intro/user",
      template: introUserTmpl,
      controller: "IntroUserController",
    })
    .state("machineResultDetails", {
      url: "/machine/:system_id/:result_type/:id",
      template: nodeResultTmpl,
      controller: "NodeResultController",
    })
    .state("machineEvents", {
      url: "/machine/:system_id/events",
      template: nodeEventsTmpl,
      controller: "NodeEventsController",
    })
    .state("machineDetails", {
      url: "/machine/:system_id",
      template: nodeDetailsTmpl,
      controller: "NodeDetailsController",
      reloadOnSearch: false,
    })
    .state("devices", {
      url: "/devices",
      template: nodesListTmpl,
      controller: "NodesListController",
    })
    .state("deviceResultDetails", {
      url: "/device/:system_id/:result_type/:id",
      template: nodeResultTmpl,
      controller: "NodeResultController",
    })
    .state("/device/:system_id/events", {
      template: nodeEventsTmpl,
      controller: "NodeEventsController",
    })
    .state("deviceDetails", {
      url: "/device/:system_id",
      template: nodeDetailsTmpl,
      controller: "NodeDetailsController",
      reloadOnSearch: false,
    })
    .state("controllers", {
      url: "/controllers",
      template: nodesListTmpl,
      controller: "NodesListController",
    })
    .state("controllerResultDetails", {
      url: "/controller/:system_id/:result_type/:id",
      template: nodeResultTmpl,
      controller: "NodeResultController",
    })
    .state("controllerEvents", {
      url: "/controller/:system_id/events",
      template: nodeEventsTmpl,
      controller: "NodeEventsController",
    })
    .state("controllerDetails", {
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
    .state("kvm", {
      url: "/kvm",
      template: podsListTmpl,
      controller: "PodsListController",
    })
    .state("kvmDetails", {
      url: "/kvm/:id",
      template: podDetailsTmpl,
      controller: "PodDetailsController",
    })
    .state("pods", { url: "/pods", redirectTo: "/kvm" })
    .state("podDetails", { url: "/pod/:id", redirectTo: "/kvm/:id" })
    .state("rsd", {
      url: "/rsd",
      template: podsListTmpl,
      controller: "PodsListController",
    })
    .state("rsdDetails", {
      url: "/rsd/:id",
      template: podDetailsTmpl,
      controller: "PodDetailsController",
    })
    .state("images", {
      url: "/images",
      template: imagesTmpl,
      controller: "ImagesController",
    })
    .state("domains", {
      url: "/domains",
      template: domainsListTmpl,
      controller: "DomainsListController",
    })
    .state("domainDetails", {
      url: "/domain/:domain_id",
      template: domainDetailsTmpl,
      controller: "DomainDetailsController",
    })
    .state("spaceDetails", {
      url: "/space/:space_id",
      template: spaceDetailsTmpl,
      controller: "SpaceDetailsController",
    })
    .state("fabricDetails", {
      url: "/fabric/:fabric_id",
      template: fabricDetailsTmpl,
      controller: "FabricDetailsController",
    })
    .state("subnets", {
      url: "/subnets",
      redirectTo: "/networks?by=fabric",
    })
    .state("network", {
      url: "/networks",
      template: networksListTmpl,
      controller: "NetworksListController",
      reloadOnSearch: false,
    })
    .state("subnetDetails", {
      url: "/subnet/:subnet_id",
      template: subnetDetailsTmpl,
      controller: "SubnetDetailsController",
    })
    .state("vlanDetails", {
      url: "/vlan/:vlan_id",
      template: vlanDetailsTmpl,
      controller: "VLANDetailsController",
      controllerAs: "vlanDetails",
    })
    .state("zoneDetails", {
      url: "/zone/:zone_id",
      template: zoneDetailsTmpl,
      controller: "ZoneDetailsController",
    })
    .state("zones", {
      url: "/zones",
      template: zonesListTmpl,
      controller: "ZonesListController",
      reloadOnSearch: false,
    })
    .state("pools", {
      url: "/pools",
      template: nodesListTmpl,
      controller: "NodesListController",
    })
    .state("dashboard", {
      url: "/dashboard",
      template: dashboardTmpl,
      controller: "DashboardController",
    });

  /*
  routes.otherwise({
    redirectTo: () => {
      window.location.replace(`${process.env.BASENAME}/r/machines`);
    },
  });
  */
};

export default configureRoutes;
