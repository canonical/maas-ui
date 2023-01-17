import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import NodePowerParameters from "./NodePowerParameters";

import { PowerTypeNames } from "app/store/general/constants";
import { PowerFieldScope } from "app/store/general/types";
import type { RootState } from "app/store/root/types";
import {
  certificateMetadata as certificateMetadataFactory,
  generalState as generalStateFactory,
  controllerDetails as controllerDetailsFactory,
  machineDetails as machineDetailsFactory,
  modelRef as modelRefFactory,
  powerField as powerFieldFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { render, screen } from "testing/utils";

const mockStore = configureStore();

let state: RootState;
beforeEach(() => {
  state = rootStateFactory({
    general: generalStateFactory({
      powerTypes: powerTypesStateFactory({
        data: [powerTypeFactory({ fields: [], name: PowerTypeNames.MANUAL })],
        loaded: true,
      }),
    }),
  });
});

it("shows an error if no rack controller is connected", () => {
  state.general.powerTypes.data = [];
  const machine = machineDetailsFactory({ system_id: "abc123" });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <NodePowerParameters node={machine} />
    </Provider>
  );

  expect(
    screen.getByText(/no rack controller is currently connected/)
  ).toBeInTheDocument();
});

it("shows an error if a power type has not been set", () => {
  const machine = machineDetailsFactory({
    power_type: "",
    system_id: "abc123",
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <NodePowerParameters node={machine} />
    </Provider>
  );

  expect(
    screen.getByText(/This node does not have a power type set/)
  ).toBeInTheDocument();
});

it("shows a warning if the power type is set to manual", () => {
  const machine = machineDetailsFactory({
    power_type: PowerTypeNames.MANUAL,
    system_id: "abc123",
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <NodePowerParameters node={machine} />
    </Provider>
  );

  expect(
    screen.getByText(
      /Power control for this power type will need to be handled manually/
    )
  ).toBeInTheDocument();
});

it("shows an error if the power type is missing packages", () => {
  state.general.powerTypes.data = [
    powerTypeFactory({
      description: "AMT",
      missing_packages: ["package1", "package2"],
      name: PowerTypeNames.AMT,
    }),
  ];
  const machine = machineDetailsFactory({
    power_type: PowerTypeNames.AMT,
    system_id: "abc123",
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <NodePowerParameters node={machine} />
    </Provider>
  );

  expect(
    screen.getByText(
      /Power control software for AMT is missing from the rack controller. /
    )
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      /To proceed, install the following packages on the rack controller: package1, package2/
    )
  ).toBeInTheDocument();
});

it("renders power parameters for all scopes if machine is not in a pod", () => {
  state.general.powerTypes.data = [
    powerTypeFactory({
      fields: [
        powerFieldFactory({ name: "node-field", scope: PowerFieldScope.NODE }),
        powerFieldFactory({ name: "bmc-field", scope: PowerFieldScope.BMC }),
      ],
      name: PowerTypeNames.LXD,
    }),
  ];
  const machine = machineDetailsFactory({
    pod: undefined,
    power_parameters: {
      "node-field": "node field",
      "bmc-field": "bmc field",
    },
    power_type: PowerTypeNames.LXD,
    system_id: "abc123",
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <NodePowerParameters node={machine} />
    </Provider>
  );

  expect(screen.getByText("node field")).toBeInTheDocument();
  expect(screen.getByText("bmc field")).toBeInTheDocument();
});

it("renders power parameters only for node scope if machine is in a pod", () => {
  state.general.powerTypes.data = [
    powerTypeFactory({
      fields: [
        powerFieldFactory({ name: "node-field", scope: PowerFieldScope.NODE }),
        powerFieldFactory({ name: "bmc-field", scope: PowerFieldScope.BMC }),
      ],
      name: PowerTypeNames.LXD,
    }),
  ];
  const machine = machineDetailsFactory({
    pod: modelRefFactory(),
    power_parameters: {
      "node-field": "node field",
      "bmc-field": "bmc field",
    },
    power_type: PowerTypeNames.LXD,
    system_id: "abc123",
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <NodePowerParameters node={machine} />
    </Provider>
  );

  expect(screen.getByText("node field")).toBeInTheDocument();
  expect(screen.queryByText("bmc field")).not.toBeInTheDocument();
});

it("renders certificate power parameters with metadata", () => {
  const certificateMetadata = certificateMetadataFactory();
  state.general.powerTypes.data = [
    powerTypeFactory({
      fields: [powerFieldFactory({ name: "certificate" })],
      name: PowerTypeNames.LXD,
    }),
  ];
  const machine = machineDetailsFactory({
    certificate: certificateMetadata,
    power_parameters: {
      certificate: "abc",
    },
    power_type: PowerTypeNames.LXD,
    system_id: "abc123",
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <NodePowerParameters node={machine} />
    </Provider>
  );

  expect(screen.getByText(certificateMetadata.CN)).toBeInTheDocument();
  expect(screen.getByText(certificateMetadata.expiration)).toBeInTheDocument();
  expect(screen.getByText(certificateMetadata.fingerprint)).toBeInTheDocument();
  expect(screen.getByRole("textbox")).toHaveValue("abc");
});

it("renders power parameters for a controller", () => {
  state.general.powerTypes.data = [
    powerTypeFactory({
      fields: [
        powerFieldFactory({ name: "node-field", scope: PowerFieldScope.NODE }),
        powerFieldFactory({ name: "bmc-field", scope: PowerFieldScope.BMC }),
      ],
      name: PowerTypeNames.LXD,
    }),
  ];
  const controller = controllerDetailsFactory({
    power_parameters: {
      "node-field": "node field",
      "bmc-field": "bmc field",
    },
    power_type: PowerTypeNames.LXD,
    system_id: "abc123",
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <NodePowerParameters node={controller} />
    </Provider>
  );

  expect(screen.getByText("node field")).toBeInTheDocument();
  expect(screen.getByText("bmc field")).toBeInTheDocument();
});
