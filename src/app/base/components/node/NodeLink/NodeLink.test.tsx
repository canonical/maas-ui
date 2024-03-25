import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import NodeLink from "./NodeLink";

import { NodeType } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import { render, screen } from "@/testing/utils";

const mockStore = configureStore();

it("can render a controller link", () => {
  const controller = factory.controller({
    domain: factory.modelRef({ name: "c" }),
    hostname: "controller",
  });
  const state = factory.rootState({
    controller: factory.controllerState({
      items: [controller],
      loading: false,
    }),
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
  const device = factory.device({
    domain: factory.modelRef({ name: "d" }),
    hostname: "device",
  });
  const state = factory.rootState({
    device: factory.deviceState({ items: [device], loading: false }),
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
  const machine = factory.machine({
    domain: factory.modelRef({ name: "m" }),
    hostname: "machine",
  });
  const state = factory.rootState({
    machine: factory.machineState({ items: [machine], loading: false }),
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
