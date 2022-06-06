import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ServicesCard from "./ServicesCard";

import { actions as serviceActions } from "app/store/service";
import { ServiceName, ServiceStatus } from "app/store/service/types";
import { getServiceDisplayName } from "app/store/service/utils";
import { NodeType } from "app/store/types/node";
import {
  controllerDetails as controllerDetailsFactory,
  controllerState as controllerStateFactory,
  rootState as rootStateFactory,
  service as serviceFactory,
  serviceState as serviceStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("fetches services on load", () => {
  const controller = controllerDetailsFactory();
  const state = rootStateFactory({
    controller: controllerStateFactory({
      items: [controller],
    }),
  });
  const store = mockStore(state);

  render(
    <Provider store={store}>
      <ServicesCard controller={controller} />
    </Provider>
  );

  const expectedAction = serviceActions.fetch();
  expect(
    store.getActions().find((action) => action.type === expectedAction.type)
  ).toStrictEqual(expectedAction);
});

it("shows a spinner if services are loading", () => {
  const controller = controllerDetailsFactory();
  const state = rootStateFactory({
    controller: controllerStateFactory({
      items: [controller],
    }),
    service: serviceStateFactory({
      loading: true,
    }),
  });
  const store = mockStore(state);

  render(
    <Provider store={store}>
      <ServicesCard controller={controller} />
    </Provider>
  );

  expect(
    screen.getByRole("alert", { name: "Loading services" })
  ).toBeInTheDocument();
});

it("renders the title correctly when at least one service is dead", () => {
  const services = [
    serviceFactory({ status: ServiceStatus.DEAD }),
    serviceFactory({ status: ServiceStatus.DEGRADED }),
    serviceFactory({ status: ServiceStatus.DEGRADED }),
    serviceFactory({ status: ServiceStatus.RUNNING }),
    serviceFactory({ status: ServiceStatus.RUNNING }),
    serviceFactory({ status: ServiceStatus.RUNNING }),
    serviceFactory({ status: ServiceStatus.OFF }),
    serviceFactory({ status: ServiceStatus.UNKNOWN }),
  ];
  const controller = controllerDetailsFactory({
    service_ids: services.map(({ id }) => id),
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({
      items: [controller],
    }),
    service: serviceStateFactory({
      items: services,
    }),
  });
  const store = mockStore(state);

  render(
    <Provider store={store}>
      <ServicesCard controller={controller} />
    </Provider>
  );

  expect(screen.getByTestId("title")).toHaveTextContent(
    "1 dead, 2 degraded, 3 running"
  );
  expect(screen.getByTestId("title-icon")).toHaveAccessibleName("error");
});

it("renders the title corectly when at least one service is degraded and none are dead", () => {
  const services = [
    serviceFactory({ status: ServiceStatus.DEGRADED }),
    serviceFactory({ status: ServiceStatus.RUNNING }),
    serviceFactory({ status: ServiceStatus.RUNNING }),
    serviceFactory({ status: ServiceStatus.OFF }),
    serviceFactory({ status: ServiceStatus.UNKNOWN }),
  ];
  const controller = controllerDetailsFactory({
    service_ids: services.map(({ id }) => id),
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({
      items: [controller],
    }),
    service: serviceStateFactory({
      items: services,
    }),
  });
  const store = mockStore(state);

  render(
    <Provider store={store}>
      <ServicesCard controller={controller} />
    </Provider>
  );

  expect(screen.getByTestId("title")).toHaveTextContent(
    "1 degraded, 2 running"
  );
  expect(screen.getByTestId("title-icon")).toHaveAccessibleName("warning");
});

it("renders the title corectly when at least one service is running and none are dead or degraded", () => {
  const services = [
    serviceFactory({ status: ServiceStatus.RUNNING }),
    serviceFactory({ status: ServiceStatus.OFF }),
    serviceFactory({ status: ServiceStatus.UNKNOWN }),
  ];
  const controller = controllerDetailsFactory({
    service_ids: services.map(({ id }) => id),
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({
      items: [controller],
    }),
    service: serviceStateFactory({
      items: services,
    }),
  });
  const store = mockStore(state);

  render(
    <Provider store={store}>
      <ServicesCard controller={controller} />
    </Provider>
  );

  expect(screen.getByTestId("title")).toHaveTextContent("1 running");
  expect(screen.getByTestId("title-icon")).toHaveAccessibleName("success");
});

it("only renders rack controller services for a rack controller", () => {
  const services = [
    serviceFactory({ name: ServiceName.RACKD }),
    serviceFactory({ name: ServiceName.REGIOND }),
  ];
  const controller = controllerDetailsFactory({
    node_type: NodeType.RACK_CONTROLLER,
    service_ids: services.map(({ id }) => id),
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({
      items: [controller],
    }),
    service: serviceStateFactory({
      items: services,
    }),
  });
  const store = mockStore(state);

  render(
    <Provider store={store}>
      <ServicesCard controller={controller} />
    </Provider>
  );

  expect(
    screen.getByText(getServiceDisplayName(ServiceName.RACKD))
  ).toBeInTheDocument();
  expect(
    screen.queryByText(getServiceDisplayName(ServiceName.REGIOND))
  ).not.toBeInTheDocument();
});

it("only renders region controller services for a region controller", () => {
  const services = [
    serviceFactory({ name: ServiceName.RACKD }),
    serviceFactory({ name: ServiceName.REGIOND }),
  ];
  const controller = controllerDetailsFactory({
    node_type: NodeType.REGION_CONTROLLER,
    service_ids: services.map(({ id }) => id),
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({
      items: [controller],
    }),
    service: serviceStateFactory({
      items: services,
    }),
  });
  const store = mockStore(state);

  render(
    <Provider store={store}>
      <ServicesCard controller={controller} />
    </Provider>
  );

  expect(
    screen.getByText(getServiceDisplayName(ServiceName.REGIOND))
  ).toBeInTheDocument();
  expect(
    screen.queryByText(getServiceDisplayName(ServiceName.RACKD))
  ).not.toBeInTheDocument();
});

it("renders both region and rack controller services for a region+rack controller", () => {
  const services = [
    serviceFactory({ name: ServiceName.RACKD }),
    serviceFactory({ name: ServiceName.REGIOND }),
  ];
  const controller = controllerDetailsFactory({
    node_type: NodeType.REGION_AND_RACK_CONTROLLER,
    service_ids: services.map(({ id }) => id),
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({
      items: [controller],
    }),
    service: serviceStateFactory({
      items: services,
    }),
  });
  const store = mockStore(state);

  render(
    <Provider store={store}>
      <ServicesCard controller={controller} />
    </Provider>
  );

  expect(
    screen.getByText(getServiceDisplayName(ServiceName.REGIOND))
  ).toBeInTheDocument();
  expect(
    screen.getByText(getServiceDisplayName(ServiceName.RACKD))
  ).toBeInTheDocument();
});
