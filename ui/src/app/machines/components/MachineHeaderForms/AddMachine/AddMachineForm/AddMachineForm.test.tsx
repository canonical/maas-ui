import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import AddMachineForm from "./AddMachineForm";

import { ACTION_STATUS } from "app/base/constants";
import { PowerFieldType } from "app/store/general/types";
import { actions as machineActions } from "app/store/machine";
import type { RootState } from "app/store/root/types";
import { ZONE_ACTIONS } from "app/store/zone/constants";
import {
  architecturesState as architecturesStateFactory,
  defaultMinHweKernelState as defaultMinHweKernelStateFactory,
  domain as domainFactory,
  domainState as domainStateFactory,
  generalState as generalStateFactory,
  hweKernelsState as hweKernelsStateFactory,
  powerField as powerFieldFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneGenericActions as zoneGenericActionsFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

const mockStore = configureStore();

let state: RootState;

beforeEach(() => {
  state = rootStateFactory({
    domain: domainStateFactory({
      items: [domainFactory({ name: "maas" })],
      loaded: true,
    }),
    general: generalStateFactory({
      architectures: architecturesStateFactory({
        data: ["amd64/generic"],
        loaded: true,
      }),
      defaultMinHweKernel: defaultMinHweKernelStateFactory({
        data: "ga-16.04",
        loaded: true,
      }),
      hweKernels: hweKernelsStateFactory({
        data: [
          ["ga-16.04", "xenial (ga-16.04)"],
          ["ga-18.04", "bionic (ga-18.04)"],
        ],
        loaded: true,
      }),
      powerTypes: powerTypesStateFactory({
        data: [
          powerTypeFactory({
            name: "manual",
            fields: [],
          }),
          powerTypeFactory({
            name: "amt",
            fields: [
              powerFieldFactory({
                name: "power_address",
                label: "IP address",
                field_type: PowerFieldType.STRING,
              }),
            ],
          }),
          powerTypeFactory({
            name: "apc",
            fields: [
              powerFieldFactory({
                name: "power_id",
                label: "Power ID",
                field_type: PowerFieldType.STRING,
              }),
            ],
          }),
        ],
        loaded: true,
      }),
    }),
    resourcepool: resourcePoolStateFactory({
      items: [resourcePoolFactory({ name: "swimming" })],
      loaded: true,
    }),
    zone: zoneStateFactory({
      genericActions: zoneGenericActionsFactory({
        [ZONE_ACTIONS.fetch]: ACTION_STATUS.successful,
      }),
      items: [
        zoneFactory({
          name: "twilight",
        }),
      ],
    }),
  });
});

it("fetches the necessary data on load if not already loaded", () => {
  state.resourcepool.loaded = false;
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
      >
        <AddMachineForm clearHeaderContent={jest.fn()} />
      </MemoryRouter>
    </Provider>
  );
  const expectedActions = [
    "FETCH_DOMAIN",
    "general/fetchArchitectures",
    "general/fetchDefaultMinHweKernel",
    "general/fetchHweKernels",
    "general/fetchPowerTypes",
    "resourcepool/fetch",
    "zone/fetch",
  ];
  const actions = store.getActions();
  expectedActions.forEach((expectedAction) => {
    expect(actions.some((action) => action.type === expectedAction));
  });
});

it("displays a spinner if data has not loaded", () => {
  state.resourcepool.loaded = false;
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
      >
        <AddMachineForm clearHeaderContent={jest.fn()} />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByTestId("loading")).toBeInTheDocument();
});

it("enables submit when a power type with no fields is chosen", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
      >
        <AddMachineForm clearHeaderContent={jest.fn()} />
      </MemoryRouter>
    </Provider>
  );

  // Choose the "manual" power type which has no power fields, and fill in other
  // required fields.
  fireEvent.change(screen.getByRole("combobox", { name: "Power type" }), {
    target: { value: "manual" },
  });
  fireEvent.change(screen.getByRole("textbox", { name: "MAC address" }), {
    target: { value: "11:11:11:11:11:11" },
  });
  await waitFor(() => {
    expect(screen.getByRole("button", { name: "Save machine" })).toBeEnabled();
  });
});

it("can handle saving a machine", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
      >
        <AddMachineForm clearHeaderContent={jest.fn()} />
      </MemoryRouter>
    </Provider>
  );

  fireEvent.change(screen.getByRole("textbox", { name: "Machine name" }), {
    target: { value: "mean-bean" },
  });
  fireEvent.change(screen.getByRole("combobox", { name: "Domain" }), {
    target: { value: "maas" },
  });
  fireEvent.change(screen.getByRole("combobox", { name: "Architecture" }), {
    target: { value: "amd64/generic" },
  });
  fireEvent.change(screen.getByRole("combobox", { name: "Minimum kernel" }), {
    target: { value: "ga-16.04" },
  });
  fireEvent.change(screen.getByRole("combobox", { name: "Zone" }), {
    target: { value: "twilight" },
  });
  fireEvent.change(screen.getByRole("combobox", { name: "Resource pool" }), {
    target: { value: "swimming" },
  });
  fireEvent.change(screen.getByRole("textbox", { name: "MAC address" }), {
    target: { value: "11:11:11:11:11:11" },
  });
  fireEvent.change(screen.getByRole("combobox", { name: "Power type" }), {
    target: { value: "manual" },
  });
  await waitFor(() => {
    expect(screen.getByRole("button", { name: "Save machine" })).toBeEnabled();
  });
  fireEvent.click(screen.getByRole("button", { name: "Save machine" }));

  const expectedAction = machineActions.create({
    architecture: "amd64/generic",
    domain: { name: "maas" },
    extra_macs: [],
    hostname: "mean-bean",
    min_hwe_kernel: "ga-16.04",
    pool: { name: "swimming" },
    power_parameters: {},
    power_type: "manual",
    pxe_mac: "11:11:11:11:11:11",
    zone: { name: "twilight" },
  });
  await waitFor(() => {
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});

it("correctly trims power parameters before dispatching action", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
      >
        <AddMachineForm clearHeaderContent={jest.fn()} />
      </MemoryRouter>
    </Provider>
  );

  // Choose initial power type and fill in fields.
  fireEvent.change(screen.getByRole("textbox", { name: "MAC address" }), {
    target: { value: "11:11:11:11:11:11" },
  });
  fireEvent.change(screen.getByRole("combobox", { name: "Power type" }), {
    target: { value: "amt" },
  });
  const amtField = await screen.findByRole("textbox", { name: "IP address" });
  fireEvent.change(amtField, { target: { value: "192.168.1.1" } });

  // Change power type and fill in new fields.
  fireEvent.change(screen.getByRole("combobox", { name: "Power type" }), {
    target: { value: "apc" },
  });
  const apcField = await screen.findByRole("textbox", { name: "Power ID" });
  fireEvent.change(apcField, { target: { value: "12345" } });
  await waitFor(() => {
    expect(screen.getByRole("button", { name: "Save machine" })).toBeEnabled();
  });
  fireEvent.click(screen.getByRole("button", { name: "Save machine" }));

  const expectedAction = machineActions.create({
    architecture: "amd64/generic",
    domain: { name: "maas" },
    extra_macs: [],
    hostname: "",
    min_hwe_kernel: "ga-16.04",
    pool: { name: "swimming" },
    // Create action should not include power_address parameter since it does
    // not exist for the currently selected power type.
    power_parameters: {
      power_id: "12345",
    },
    power_type: "apc",
    pxe_mac: "11:11:11:11:11:11",
    zone: { name: "twilight" },
  });
  await waitFor(() => {
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});

it("correctly filters empty extra mac fields", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
      >
        <AddMachineForm clearHeaderContent={jest.fn()} />
      </MemoryRouter>
    </Provider>
  );

  // Submit the form with two extra macs, where one is an empty string
  fireEvent.change(screen.getByRole("combobox", { name: "Power type" }), {
    target: { value: "manual" },
  });
  fireEvent.change(screen.getByRole("textbox", { name: "MAC address" }), {
    target: { value: "11:11:11:11:11:11" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Add MAC address" }));
  fireEvent.click(screen.getByRole("button", { name: "Add MAC address" }));
  fireEvent.change(screen.getByLabelText("Extra MAC address 1"), {
    target: { value: "22:22:22:22:22:22" },
  });
  fireEvent.change(screen.getByLabelText("Extra MAC address 2"), {
    target: { value: "" },
  });
  await waitFor(() => {
    expect(screen.getByRole("button", { name: "Save machine" })).toBeEnabled();
  });
  fireEvent.click(screen.getByRole("button", { name: "Save machine" }));

  const expectedAction = machineActions.create({
    architecture: "amd64/generic",
    domain: { name: "maas" },
    // There should only be one extra MAC defined.
    extra_macs: ["22:22:22:22:22:22"],
    hostname: "",
    min_hwe_kernel: "ga-16.04",
    pool: { name: "swimming" },
    power_parameters: {},
    power_type: "manual",
    pxe_mac: "11:11:11:11:11:11",
    zone: { name: "twilight" },
  });
  await waitFor(() => {
    expect(
      store.getActions().find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });
});
