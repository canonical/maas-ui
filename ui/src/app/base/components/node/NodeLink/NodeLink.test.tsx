import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import NodeLink from "./NodeLink";

import { NodeType } from "app/store/types/node";
import {
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  device as deviceFactory,
  deviceState as deviceStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  modelRef as modelRefFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

it("can render a controller link", () => {
  const controller = controllerFactory({
    domain: modelRefFactory({ name: "c" }),
    hostname: "controller",
  });
  const state = rootStateFactory({
    controller: controllerStateFactory({ items: [controller], loading: false }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <NodeLink
            nodeType={NodeType.RACK_CONTROLLER}
            systemId={controller.system_id}
          />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByRole("link")).toHaveTextContent("controller.c");
});

it("can render a device link", () => {
  const device = deviceFactory({
    domain: modelRefFactory({ name: "d" }),
    hostname: "device",
  });
  const state = rootStateFactory({
    device: deviceStateFactory({ items: [device], loading: false }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <NodeLink nodeType={NodeType.DEVICE} systemId={device.system_id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByRole("link")).toHaveTextContent("device.d");
});

it("can render a machine link", () => {
  const machine = machineFactory({
    domain: modelRefFactory({ name: "m" }),
    hostname: "machine",
  });
  const state = rootStateFactory({
    machine: machineStateFactory({ items: [machine], loading: false }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CompatRouter>
          <NodeLink nodeType={NodeType.MACHINE} systemId={machine.system_id} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByRole("link")).toHaveTextContent("machine.m");
});
