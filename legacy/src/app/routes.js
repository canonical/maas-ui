import {
  generateLegacyURL,
  navigateToNew,
  navigateToLegacy,
} from "@maas-ui/maas-ui-shared";

import layoutTmpl from "./partials/layout.html";
import nodeDetailsTmpl from "./partials/node-details.html";
import nodeEventsTmpl from "./partials/node-events.html";
import nodeResultTmpl from "./partials/node-result.html";

/* @ngInject */
const configureRoutes = ($stateProvider, $urlRouterProvider) => {
  $stateProvider
    .state("master", {
      abstract: true,
      template: layoutTmpl,
      controller: "MasterController",
    })
    .state("master.intro", {
      url: generateLegacyURL("/intro"),
      redirectTo: () => {
        navigateToNew("/intro");
      },
    })
    .state("master.introUser", {
      url: generateLegacyURL("/intro/user"),
      redirectTo: () => {
        navigateToNew("/intro/user");
      },
    })
    .state("master.machineResultDetails", {
      url: generateLegacyURL("/machine/:system_id/:result_type/:id"),
      redirectTo: (transition) => {
        const params = transition.params();
        navigateToNew(
          `/machine/${params.system_id}/${params.result_type}/${params.id}/details`
        );
      },
    })
    .state("master.machineEvents", {
      url: generateLegacyURL("/machine/:system_id/events"),
      redirectTo: (transition) => {
        const params = transition.params();
        navigateToNew(`/machine/${params.system_id}/logs/events`);
      },
    })
    .state("master.machineDetails", {
      url: generateLegacyURL("/machine/:system_id?{area}"),
      redirectTo: (transition) => {
        const params = transition.params();
        let url = `/machine/${params.system_id}`;
        if (params.area) {
          url = `${url}/${params.area}`;
        }
        navigateToNew(url);
      },
    })
    .state("master.devices", {
      url: generateLegacyURL("/devices"),
      redirectTo: () => {
        navigateToNew("/devices");
      },
    })
    .state("master.deviceDetails", {
      url: generateLegacyURL("/device/:system_id?{area}"),
      redirectTo: (transition) => {
        const params = transition.params();
        let url = `/device/${params.system_id}`;
        if (params.area) {
          url = `${url}/${params.area}`;
        }
        navigateToNew(url);
      },
    })
    .state("master.controllers", {
      url: generateLegacyURL("/controllers"),
      redirectTo: () => {
        navigateToNew("/controllers");
      },
    })
    .state("master.controllerResultDetails", {
      url: generateLegacyURL("/controller/:system_id/:result_type/:id"),
      template: nodeResultTmpl,
      controller: "NodeResultController",
    })
    .state("master.controllerEvents", {
      url: generateLegacyURL("/controller/:system_id/events"),
      template: nodeEventsTmpl,
      controller: "NodeEventsController",
    })
    .state("master.controllerDetails", {
      url: generateLegacyURL("/controller/:system_id"),
      template: nodeDetailsTmpl,
      controller: "NodeDetailsController",
      reloadOnSearch: false,
    })
    .state("nodes", {
      url: generateLegacyURL("/nodes"),
      redirectTo: generateLegacyURL("/machines"),
    })
    .state("nodeDetails", {
      url: generateLegacyURL("/node/machine/:system_id"),
      redirectTo: generateLegacyURL("/machine/:system_id"),
    })
    .state("nodeResultDetails", {
      url: generateLegacyURL("/node/machine/:system_id/:result_type/:id"),
      redirectTo: generateLegacyURL("/machine/:system_id/:result_type/:id"),
    })
    .state("nodeEvents", {
      url: generateLegacyURL("/node/machine/:system_id/events"),
      redirectTo: generateLegacyURL("/machine/:system_id/events"),
    })
    .state("nodeDeviceDetails", {
      url: generateLegacyURL("/node/device/:system_id"),
      redirectTo: generateLegacyURL("/device/:system_id"),
    })
    .state("nodeDeviceResultDetail", {
      url: generateLegacyURL("/node/device/:system_id/:result_type/:id"),
      redirectTo: generateLegacyURL("/device/:system_id/:result_type/:id"),
    })
    .state("nodeDeviceEvents", {
      url: generateLegacyURL("/node/device/:system_id/events"),
      redirectTo: generateLegacyURL("/device/:system_id/events"),
    })
    .state("nodeControllerDetails", {
      url: generateLegacyURL("/node/controller/:system_id"),
      redirectTo: generateLegacyURL("/controller/:system_id"),
    })
    .state("nodeControllerResultDetails", {
      url: generateLegacyURL("/node/controller/:system_id/:result_type/:id"),
      redirectTo: generateLegacyURL("/controller/:system_id/:result_type/:id"),
    })
    .state("nodeControllerEvents", {
      url: generateLegacyURL("/node/controller/:system_id/events"),
      redirectTo: generateLegacyURL("/controller/:system_id/events"),
    })
    .state("master.images", {
      url: generateLegacyURL("/images"),
      redirectTo: () => {
        navigateToNew("/images");
      },
    })
    .state("master.domains", {
      url: generateLegacyURL("/domains"),
      redirectTo: () => {
        navigateToNew("/domains");
      },
    })
    .state("master.domainDetails", {
      url: generateLegacyURL("/domain/:id"),
      redirectTo: (transition) => {
        const params = transition.params();
        navigateToNew(`/domain/${params.id}`);
      },
    })
    .state("master.zones", {
      url: generateLegacyURL("/zones"),
      redirectTo: () => {
        navigateToNew("/zones");
      },
    })
    .state("master.zoneDetails", {
      url: generateLegacyURL("/zone/:id"),
      redirectTo: (transition) => {
        const params = transition.params();
        navigateToNew(`/zone/${params.id}`);
      },
    })
    .state("master.spaceDetails", {
      url: generateLegacyURL("/space/:space_id"),
      redirectTo: (transition) => {
        const params = transition.params();
        navigateToNew(`/space/${params.space_id}`);
      },
    })
    .state("master.fabricDetails", {
      url: generateLegacyURL("/fabric/:fabric_id"),
      redirectTo: (transition) => {
        const params = transition.params();
        navigateToNew(`/fabric/${params.fabric_id}`);
      },
    })
    .state("master.subnets", {
      url: generateLegacyURL("/subnets"),
      redirectTo: "/networks?by=fabric",
    })
    .state("master.network", {
      url: generateLegacyURL("/networks"),
      redirectTo: () => {
        navigateToNew("/networks");
      },
    })
    .state("master.subnetDetails", {
      url: generateLegacyURL("/subnet/:subnet_id"),
      redirectTo: (transition) => {
        const params = transition.params();
        navigateToNew(`/subnet/${params.subnet_id}`);
      },
    })
    .state("master.vlanDetails", {
      url: generateLegacyURL("/vlan/:vlan_id"),
      redirectTo: (transition) => {
        const params = transition.params();
        navigateToNew(`/vlan/${params.vlan_id}`);
      },
    })
    .state("master.pools", {
      url: generateLegacyURL("/pools"),
      redirectTo: () => {
        navigateToNew("/pools");
      },
    })
    .state("master.dashboard", {
      url: generateLegacyURL("/dashboard"),
      redirectTo: () => {
        navigateToNew("/dashboard");
      },
    });

  $urlRouterProvider.otherwise(($injector, $location) => {
    // Redirect old hash routes to new routes
    if ($location.hash()) {
      navigateToLegacy($location.hash());
    } else if ($location.path().startsWith(generateLegacyURL())) {
      // This is an unknown legacy URL so redirect to the machine listing.
      navigateToNew("/machines");
    }
  });
};

export default configureRoutes;
