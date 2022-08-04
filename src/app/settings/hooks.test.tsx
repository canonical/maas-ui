import type { ReactNode } from "react";

import reduxToolkit from "@reduxjs/toolkit";
import { renderHook } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import type { MockStoreEnhanced } from "redux-mock-store";

import { useDhcpTarget } from "./hooks";

import type { RootState } from "app/store/root/types";
import {
  controller as controllerFactory,
  controllerState as controllerStateFactory,
  device as deviceFactory,
  deviceState as deviceStateFactory,
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  subnet as subnetFactory,
  subnetState as subnetStateFactory,
  machineStateDetailsItem as machineStateDetailsItemFactory,
} from "testing/factories";

const mockStore = configureStore();

const generateWrapper =
  (store: MockStoreEnhanced<unknown>) =>
  ({ children }: { children: ReactNode }) =>
    <Provider store={store}>{children}</Provider>;

let state: RootState;

beforeEach(() => {
  jest.spyOn(reduxToolkit, "nanoid").mockReturnValue("123456");
  state = rootStateFactory({
    controller: controllerStateFactory({
      items: [
        controllerFactory({
          system_id: "abc123",
        }),
      ],
      loaded: true,
    }),
    device: deviceStateFactory({
      items: [
        deviceFactory({
          system_id: "def456",
        }),
      ],
      loaded: true,
    }),
    machine: machineStateFactory({
      items: [
        machineFactory({
          system_id: "ghi789",
        }),
      ],
    }),
    subnet: subnetStateFactory({
      loaded: true,
      items: [subnetFactory({ id: 1 })],
    }),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

it("handles loading for a subnet", () => {
  state.subnet.loading = true;
  const store = mockStore(state);
  const { result } = renderHook(() => useDhcpTarget(null, 1), {
    wrapper: generateWrapper(store),
  });
  expect(result.current.loading).toBe(true);
});

it("handles loaded for a subnet", () => {
  state.subnet.loaded = true;
  const store = mockStore(state);
  const { result } = renderHook(() => useDhcpTarget(null, 1), {
    wrapper: generateWrapper(store),
  });
  expect(result.current.loaded).toBe(true);
});

it("can return a subnet", () => {
  const store = mockStore(state);
  const { result } = renderHook(() => useDhcpTarget(null, 1), {
    wrapper: generateWrapper(store),
  });
  expect(result.current.target).toStrictEqual(state.subnet.items[0]);
  expect(result.current.type).toBe("subnet");
});

it("handles loading for a controller", () => {
  state.controller.loading = true;
  const store = mockStore(state);
  const { result } = renderHook(() => useDhcpTarget("abc123"), {
    wrapper: generateWrapper(store),
  });
  expect(result.current.loading).toBe(true);
});

it("handles loading for a device", () => {
  state.device.loading = true;
  const store = mockStore(state);
  const { result } = renderHook(() => useDhcpTarget("def456"), {
    wrapper: generateWrapper(store),
  });
  expect(result.current.loading).toBe(true);
});

it("handles loaded for a device or controller", () => {
  state.controller.loaded = true;
  state.device.loaded = true;
  const store = mockStore(state);
  const { result } = renderHook(() => useDhcpTarget("abc123"), {
    wrapper: generateWrapper(store),
  });
  expect(result.current.loaded).toBe(true);
});

it("can return a controller", () => {
  const store = mockStore(state);
  const { result } = renderHook(() => useDhcpTarget("abc123"), {
    wrapper: generateWrapper(store),
  });
  expect(result.current.target).toStrictEqual(state.controller.items[0]);
  expect(result.current.type).toBe("controller");
});

it("can return a device", () => {
  const store = mockStore(state);
  const { result } = renderHook(() => useDhcpTarget("def456"), {
    wrapper: generateWrapper(store),
  });
  expect(result.current.target).toStrictEqual(state.device.items[0]);
  expect(result.current.type).toBe("device");
});

it("handles loading for a machine", () => {
  state.machine.details = {
    123456: machineStateDetailsItemFactory({
      loading: true,
      system_id: "ghi789",
    }),
  };
  const store = mockStore(state);
  const { result } = renderHook(() => useDhcpTarget("ghi789"), {
    wrapper: generateWrapper(store),
  });
  expect(result.current.loading).toBe(true);
});

it("handles loaded for a machine", () => {
  state.machine.details = {
    123456: machineStateDetailsItemFactory({
      loaded: true,
      system_id: "ghi789",
    }),
  };
  const store = mockStore(state);
  const { result } = renderHook(() => useDhcpTarget("ghi789"), {
    wrapper: generateWrapper(store),
  });
  expect(result.current.loaded).toBe(true);
});

it("can return a machine", () => {
  const store = mockStore(state);
  const { result } = renderHook(() => useDhcpTarget("ghi789"), {
    wrapper: generateWrapper(store),
  });
  expect(result.current.target).toStrictEqual(state.machine.items[0]);
  expect(result.current.type).toBe("machine");
});
