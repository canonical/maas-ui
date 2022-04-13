import { screen } from "@testing-library/react";

import StatusBar from "./StatusBar";

import type { RootState } from "app/store/root/types";
import { NodeStatus } from "app/store/types/node";
import {
  machineDetails as machineDetailsFactory,
  config as configFactory,
  configState as configStateFactory,
  generalState as generalStateFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
  versionState as versionStateFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

let state: RootState;
beforeEach(() => {
  jest.useFakeTimers("modern");
  // Thu, 31 Dec. 2020 23:00:00 UTC
  jest.setSystemTime(new Date(Date.UTC(2020, 11, 31, 23, 0, 0)));
  state = rootStateFactory({
    config: configStateFactory({
      items: [configFactory({ name: "maas_name", value: "bolla" })],
    }),
    general: generalStateFactory({
      version: versionStateFactory({ data: "2.10.0" }),
    }),
    machine: machineStateFactory({
      active: "abc123",
      items: [],
    }),
  });
});

afterEach(() => {
  jest.useRealTimers();
});

it("can show if a machine is currently commissioning", () => {
  state.machine.items = [
    machineDetailsFactory({
      fqdn: "test.maas",
      status: NodeStatus.COMMISSIONING,
      system_id: "abc123",
    }),
  ];

  renderWithMockStore(<StatusBar />, { state });

  expect(screen.getByTestId("status-bar-status")).toHaveTextContent(
    "test.maas: Commissioning in progress..."
  );
});

it("can show if a machine has not been commissioned yet", () => {
  state.machine.items = [
    machineDetailsFactory({
      commissioning_start_time: "",
      fqdn: "test.maas",
      system_id: "abc123",
    }),
  ];

  renderWithMockStore(<StatusBar />, { state });

  expect(screen.getByTestId("status-bar-status")).toHaveTextContent(
    "test.maas: Not yet commissioned"
  );
});

it("can show the last time a machine was commissioned", () => {
  state.machine.items = [
    machineDetailsFactory({
      enable_hw_sync: false,
      commissioning_start_time: "Thu, 31 Dec. 2020 22:59:00",
      fqdn: "test.maas",
      status: NodeStatus.DEPLOYED,
      system_id: "abc123",
    }),
  ];

  renderWithMockStore(<StatusBar />, { state });

  expect(screen.getByTestId("status-bar-status")).toHaveTextContent(
    "test.maas: Last commissioned 1 minute ago"
  );
});

it("can handle an incorrectly formatted commissioning timestamp", () => {
  state.machine.items = [
    machineDetailsFactory({
      enable_hw_sync: false,
      commissioning_start_time: "2020-03-01 09:12:43",
      fqdn: "test.maas",
      status: NodeStatus.DEPLOYED,
      system_id: "abc123",
    }),
  ];

  renderWithMockStore(<StatusBar />, { state });

  expect(screen.getByTestId("status-bar-status")).toHaveTextContent(
    "test.maas: Unable to parse commissioning timestamp (Invalid time value)"
  );
});

it("displays Last and Next sync instead of Last commissioned date for deployed machines with hardware sync enabled ", () => {
  state.machine.items = [
    machineDetailsFactory({
      commissioning_start_time: "Thu, 31 Dec. 2020 22:59:00",
      fqdn: "test.maas",
      status: NodeStatus.DEPLOYED,
      system_id: "abc123",
      enable_hw_sync: true,
      last_sync: "Thu, 31 Dec. 2020 22:00:00",
      next_sync: "Thu, 31 Dec. 2020 23:01:00",
    }),
  ];

  renderWithMockStore(<StatusBar />, { state: state });

  expect(screen.getByTestId("status-bar-status")).not.toHaveTextContent(
    /Last commissioned/
  );
  expect(screen.getByTestId("status-bar-status")).toHaveTextContent(
    /test.maas/
  );
  expect(screen.getByTestId("status-bar-status")).toHaveTextContent(
    /Last synced: about 1 hour ago/
  );
  expect(screen.getByTestId("status-bar-status")).toHaveTextContent(
    /Next sync: in 1 minute/
  );
});

it("doesn't display last or next sync for deploying machines with hardware sync enabled", () => {
  state.machine.items = [
    machineDetailsFactory({
      commissioning_start_time: "Thu, 31 Dec. 2020 22:59:00",
      fqdn: "test.maas",
      status: NodeStatus.DEPLOYING,
      system_id: "abc123",
      enable_hw_sync: true,
      last_sync: "Thu, 31 Dec. 2020 22:00:00",
      next_sync: "Thu, 31 Dec. 2020 23:01:00",
    }),
  ];

  renderWithMockStore(<StatusBar />, {
    state,
  });

  expect(screen.getByTestId("status-bar-status")).toHaveTextContent(
    /Last commissioned/
  );
  expect(screen.getByTestId("status-bar-status")).not.toHaveTextContent(
    /Last synced/
  );
  expect(screen.getByTestId("status-bar-status")).not.toHaveTextContent(
    /Next sync/
  );
});

it("displays correct text for machines with hardware sync enabled and no last_sync or next_sync", () => {
  state.machine.items = [
    machineDetailsFactory({
      commissioning_start_time: "Thu, 31 Dec. 2020 22:59:00",
      fqdn: "test.maas",
      status: NodeStatus.DEPLOYED,
      system_id: "abc123",
      enable_hw_sync: true,
      last_sync: "",
      next_sync: "",
    }),
  ];

  renderWithMockStore(<StatusBar />, {
    state,
  });

  expect(screen.getByTestId("status-bar-status")).not.toHaveTextContent(
    /Last commissioned/
  );
  expect(screen.getByTestId("status-bar-status")).toHaveTextContent(
    /test.maas/
  );
  expect(screen.getByTestId("status-bar-status")).toHaveTextContent(
    /Last synced: Never/
  );
  expect(screen.getByTestId("status-bar-status")).toHaveTextContent(
    /Next sync: Never/
  );
});
