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
const configureRoutes = ($routeProvider) => {
  let routes;
  routes = $routeProvider
    .when("/intro", {
      template: introTmpl,
      controller: "IntroController",
    })
    .when("/machines-legacy", {
      template: nodesListTmpl,
      controller: "NodesListController"
    })
    .when("/intro/user", {
      template: introUserTmpl,
      controller: "IntroUserController",
    })
    .when("/machine/:system_id/:result_type/:id", {
      template: nodeResultTmpl,
      controller: "NodeResultController",
    })
    .when("/machine/:system_id/events", {
      template: nodeEventsTmpl,
      controller: "NodeEventsController",
    })
    .when("/machine/:system_id", {
      template: nodeDetailsTmpl,
      controller: "NodeDetailsController",
      reloadOnSearch: false,
    })
    .when("/devices", {
      template: nodesListTmpl,
      controller: "NodesListController",
    })
    .when("/device/:system_id/:result_type/:id", {
      template: nodeResultTmpl,
      controller: "NodeResultController",
    })
    .when("/device/:system_id/events", {
      template: nodeEventsTmpl,
      controller: "NodeEventsController",
    })
    .when("/device/:system_id", {
      template: nodeDetailsTmpl,
      controller: "NodeDetailsController",
      reloadOnSearch: false,
    })
    .when("/controllers", {
      template: nodesListTmpl,
      controller: "NodesListController",
    })
    .when("/controller/:system_id/:result_type/:id", {
      template: nodeResultTmpl,
      controller: "NodeResultController",
    })
    .when("/controller/:system_id/events", {
      template: nodeEventsTmpl,
      controller: "NodeEventsController",
    })
    .when("/controller/:system_id", {
      template: nodeDetailsTmpl,
      controller: "NodeDetailsController",
      reloadOnSearch: false,
    })
    .when("/nodes", {
      redirectTo: "/machines",
    })
    .when("/node/machine/:system_id", {
      redirectTo: "/machine/:system_id",
    })
    .when("/node/machine/:system_id/:result_type/:id", {
      redirectTo: "/machine/:system_id/:result_type/:id",
    })
    .when("/node/machine/:system_id/events", {
      redirectTo: "/machine/:system_id/events",
    })
    .when("/node/device/:system_id", {
      redirectTo: "/device/:system_id",
    })
    .when("/node/device/:system_id/:result_type/:id", {
      redirectTo: "/device/:system_id/:result_type/:id",
    })
    .when("/node/device/:system_id/events", {
      redirectTo: "/device/:system_id/events",
    })
    .when("/node/controller/:system_id", {
      redirectTo: "/controller/:system_id",
    })
    .when("/node/controller/:system_id/:result_type/:id", {
      redirectTo: "/controller/:system_id/:result_type/:id",
    })
    .when("/node/controller/:system_id/events", {
      redirectTo: "/controller/:system_id/events",
    })
    .when("/kvm", {
      template: podsListTmpl,
      controller: "PodsListController",
    })
    .when("/kvm/:id", {
      template: podDetailsTmpl,
      controller: "PodDetailsController",
    })
    .when("/pods", {
      redirectTo: "/kvm",
    })
    .when("/pod/:id", {
      redirectTo: "/kvm/:id",
    })
    .when("/rsd", {
      template: podsListTmpl,
      controller: "PodsListController",
    })
    .when("/rsd/:id", {
      template: podDetailsTmpl,
      controller: "PodDetailsController",
    })
    .when("/images", {
      template: imagesTmpl,
      controller: "ImagesController",
    })
    .when("/domains", {
      template: domainsListTmpl,
      controller: "DomainsListController",
    })
    .when("/domain/:domain_id", {
      template: domainDetailsTmpl,
      controller: "DomainDetailsController",
    })
    .when("/space/:space_id", {
      template: spaceDetailsTmpl,
      controller: "SpaceDetailsController",
    })
    .when("/fabric/:fabric_id", {
      template: fabricDetailsTmpl,
      controller: "FabricDetailsController",
    })
    .when("/subnets", {
      redirectTo: "/networks?by=fabric",
    })
    .when("/networks", {
      template: networksListTmpl,
      controller: "NetworksListController",
      reloadOnSearch: false,
    })
    .when("/subnet/:subnet_id", {
      template: subnetDetailsTmpl,
      controller: "SubnetDetailsController",
    })
    .when("/vlan/:vlan_id", {
      template: vlanDetailsTmpl,
      controller: "VLANDetailsController",
      controllerAs: "vlanDetails",
    })
    .when("/zone/:zone_id", {
      template: zoneDetailsTmpl,
      controller: "ZoneDetailsController",
    })
    .when("/zones", {
      template: zonesListTmpl,
      controller: "ZonesListController",
      reloadOnSearch: false,
    })
    .when("/pools", {
      template: nodesListTmpl,
      controller: "NodesListController",
    })
    .when("/dashboard", {
      template: dashboardTmpl,
      controller: "DashboardController",
    });

  routes.otherwise({
    redirectTo: () => {
      window.location.replace(`${process.env.BASENAME}/r/machines`);
    },
  });
};

export default configureRoutes;
