import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import AddMachineForm from "./AddMachineForm";

import { PowerFieldType } from "@/app/store/general/types";
import { machineActions } from "@/app/store/machine";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { userEvent, render, screen, waitFor } from "@/testing/utils";

const mockStore = configureStore();

let state: RootState;

beforeEach(() => {
  state = factory.rootState({
    domain: factory.domainState({
      items: [factory.domain({ name: "maas" })],
      loaded: true,
    }),
    general: factory.generalState({
      architectures: factory.architecturesState({
        data: ["amd64/generic"],
        loaded: true,
      }),
      defaultMinHweKernel: factory.defaultMinHweKernelState({
        data: "ga-16.04",
        loaded: true,
      }),
      hweKernels: factory.hweKernelsState({
        data: [
          ["ga-16.04", "xenial (ga-16.04)"],
          ["ga-18.04", "bionic (ga-18.04)"],
        ],
        loaded: true,
      }),
      powerTypes: factory.powerTypesState({
        data: [
          factory.powerType({
            name: "manual",
            fields: [],
          }),
          factory.powerType({
            name: "amt",
            fields: [
              factory.powerField({
                name: "power_address",
                label: "IP address",
                field_type: PowerFieldType.STRING,
              }),
            ],
          }),
          factory.powerType({
            name: "apc",
            fields: [
              factory.powerField({
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
    resourcepool: factory.resourcePoolState({
      items: [factory.resourcePool({ name: "swimming" })],
      loaded: true,
    }),
    zone: factory.zoneState({
      genericActions: factory.zoneGenericActions({ fetch: "success" }),
      items: [
        factory.zone({
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
        <CompatRouter>
          <AddMachineForm clearSidePanelContent={vi.fn()} />
        </CompatRouter>
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
        <CompatRouter>
          <AddMachineForm clearSidePanelContent={vi.fn()} />
        </CompatRouter>
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
        <CompatRouter>
          <AddMachineForm clearSidePanelContent={vi.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  // Choose the "manual" power type which has no power fields, and fill in other
  // required fields.
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Power type" }),
    "manual"
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: "MAC address" }),
    "11:11:11:11:11:11"
  );
  expect(screen.getByRole("button", { name: "Save machine" })).toBeEnabled();
});

it("can handle saving a machine", async () => {
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
      >
        <CompatRouter>
          <AddMachineForm clearSidePanelContent={vi.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  await userEvent.type(
    screen.getByRole("textbox", { name: "Machine name" }),
    "mean-bean"
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Domain" }),
    "maas"
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Architecture" }),
    "amd64/generic"
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Minimum kernel" }),
    "ga-16.04"
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Zone" }),
    "twilight"
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Resource pool" }),
    "swimming"
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: "MAC address" }),
    "11:11:11:11:11:11"
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Power type" }),
    "manual"
  );
  await userEvent.click(screen.getByRole("button", { name: "Save machine" }));

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
        <CompatRouter>
          <AddMachineForm clearSidePanelContent={vi.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  // Choose initial power type and fill in fields.
  await userEvent.type(
    screen.getByRole("textbox", { name: "MAC address" }),
    "11:11:11:11:11:11"
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Power type" }),
    "amt"
  );
  const amtField = screen.getByRole("textbox", { name: "IP address" });
  await userEvent.type(amtField, "192.168.1.1");

  // Change power type and fill in new fields.
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Power type" }),
    "apc"
  );
  const apcField = screen.getByRole("textbox", { name: "Power ID" });
  await userEvent.clear(apcField);
  await userEvent.type(apcField, "12345");
  await userEvent.click(screen.getByRole("button", { name: "Save machine" }));

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
        <CompatRouter>
          <AddMachineForm clearSidePanelContent={vi.fn()} />
        </CompatRouter>
      </MemoryRouter>
    </Provider>
  );

  // Submit the form with two extra macs, where one is an empty string
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Power type" }),
    "manual"
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: "MAC address" }),
    "11:11:11:11:11:11"
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Add MAC address" })
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Add MAC address" })
  );
  await userEvent.type(
    screen.getByLabelText("Extra MAC address 1"),
    "22:22:22:22:22:22"
  );
  await userEvent.clear(screen.getByLabelText("Extra MAC address 2"));
  await userEvent.click(screen.getByRole("button", { name: "Save machine" }));

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
