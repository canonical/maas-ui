import configureStore from "redux-mock-store";

import AddChassisForm from "./AddChassisForm";

import { PowerTypeNames } from "app/store/general/constants";
import {
  DriverType,
  PowerFieldScope,
  PowerFieldType,
} from "app/store/general/types";
import type { RootState } from "app/store/root/types";
import {
  domain as domainFactory,
  domainState as domainStateFactory,
  generalState as generalStateFactory,
  powerField as powerFieldFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import {
  renderWithBrowserRouter,
  screen,
  submitFormikForm,
  waitForComponentToPaint,
} from "testing/utils";

const mockStore = configureStore<RootState>();

describe("AddChassisForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      domain: domainStateFactory({
        items: [
          domainFactory({
            name: "maas",
          }),
        ],
        loaded: true,
      }),
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({
          data: [
            powerTypeFactory({
              name: "manual",
              description: "Manual",
              fields: [],
              can_probe: false,
            }),
            powerTypeFactory({
              name: PowerTypeNames.WEDGE,
              description: "Dummy power type",
              fields: [
                powerFieldFactory({
                  name: "power_address",
                  label: "IP address",
                  required: true,
                  field_type: PowerFieldType.STRING,
                  choices: [],
                  default: "",
                  scope: PowerFieldScope.BMC,
                }),
              ],
              can_probe: true,
            }),
            powerTypeFactory({
              driver_type: DriverType.POWER,
              name: "vmware",
              description: "VMware",
              fields: [
                powerFieldFactory({
                  name: "power_vm_name",
                  label: "VM Name (if UUID unknown)",
                  required: false,
                  field_type: PowerFieldType.STRING,
                  choices: [],
                  default: "",
                  scope: PowerFieldScope.NODE,
                }),
                powerFieldFactory({
                  name: "power_uuid",
                  label: "VM UUID (if known)",
                  required: false,
                  field_type: PowerFieldType.STRING,
                  choices: [],
                  default: "",
                  scope: PowerFieldScope.NODE,
                }),
                powerFieldFactory({
                  name: "power_address",
                  label: "VMware IP",
                  required: true,
                  field_type: PowerFieldType.STRING,
                  choices: [],
                  default: "",
                  scope: PowerFieldScope.BMC,
                }),
                powerFieldFactory({
                  name: "power_user",
                  label: "VMware username",
                  required: true,
                  field_type: PowerFieldType.STRING,
                  choices: [],
                  default: "",
                  scope: PowerFieldScope.BMC,
                }),
                powerFieldFactory({
                  name: "power_pass",
                  label: "VMware password",
                  required: true,
                  field_type: PowerFieldType.PASSWORD,
                  choices: [],
                  default: "",
                  scope: PowerFieldScope.BMC,
                }),
                powerFieldFactory({
                  name: "power_port",
                  label: "VMware API port (optional)",
                  required: false,
                  field_type: PowerFieldType.STRING,
                  choices: [],
                  default: "",
                  scope: PowerFieldScope.BMC,
                }),
                powerFieldFactory({
                  name: "power_protocol",
                  label: "VMware API protocol (optional)",
                  required: false,
                  field_type: PowerFieldType.STRING,
                  choices: [],
                  default: "",
                  scope: PowerFieldScope.BMC,
                }),
              ],
              missing_packages: [],
              can_probe: true,
              queryable: true,
            }),
          ],
          loaded: true,
        }),
      }),
    });
  });

  it("fetches the necessary data on load if not already loaded", () => {
    state.domain.loaded = false;
    const store = mockStore(state);
    renderWithBrowserRouter(
      <AddChassisForm clearSidePanelContent={jest.fn()} />,
      { route: "/machines/chassis/add", store }
    );
    const expectedActions = ["FETCH_DOMAIN", "general/fetchPowerTypes"];
    const actions = store.getActions();
    expectedActions.forEach((expectedAction) => {
      expect(actions.some((action) => action.type === expectedAction));
    });
  });

  it("displays a spinner if data has not loaded", () => {
    state.domain.loaded = false;
    state.general.powerTypes.loaded = false;
    const store = mockStore(state);
    renderWithBrowserRouter(
      <AddChassisForm clearSidePanelContent={jest.fn()} />,
      { route: "/machines/chassis/add", store }
    );
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("correctly dispatches action to add chassis", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <AddChassisForm clearSidePanelContent={jest.fn()} />,
      { route: "/machines/add", store }
    );

    // Select vmware from power types dropdown
    userEvent.selectOptions(
      screen.getByLabelText("Power Type"),
      "manual",
      "vmware"
    );
    await waitForComponentToPaint(screen);

    // Submit the form with unformatted power parameters
    submitFormikForm(screen.getByRole("form"), {
      domain: "maas",
      power_parameters: {
        power_address: "192.168.1.1",
        power_pass: "secret",
        power_port: "8000",
        power_protocol: "abc123",
        power_user: "user1",
      },
      power_type: "vmware",
    });

    // Expect the power_id param to be removed when action is dispatched.
    expect(
      store.getActions().find((action) => action.type === "machine/addChassis")
    ).toStrictEqual({
      type: "machine/addChassis",
      payload: {
        params: {
          chassis_type: "vmware",
          domain: "maas",
          hostname: "192.168.1.1",
          password: "secret",
          port: "8000",
          protocol: "abc123",
          username: "user1",
        },
      },
    });
  });
});
