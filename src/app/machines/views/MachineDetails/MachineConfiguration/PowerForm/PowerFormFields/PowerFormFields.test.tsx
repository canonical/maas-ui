import { Formik } from "formik";

import PowerFormFields from ".";

import { PowerFieldScope } from "app/store/general/types";
import type { RootState } from "app/store/root/types";
import {
  generalState as generalStateFactory,
  machineDetails as machineDetailsFactory,
  powerField as powerFieldFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { screen, renderWithMockStore } from "testing/utils";

describe("PowerFormFields", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({
          data: [powerTypeFactory({ fields: [], name: "manual" })],
          loaded: true,
        }),
      }),
    });
  });

  it("disables the power select and limits field scopes to node if machine is in a pod", () => {
    state.general.powerTypes.data = [
      powerTypeFactory({
        fields: [
          powerFieldFactory({
            label: "Node field",
            name: "node-field",
            scope: PowerFieldScope.NODE,
          }),
          powerFieldFactory({
            label: "BMC field",
            name: "bmc-field",
            scope: PowerFieldScope.BMC,
          }),
        ],
        name: "manual",
      }),
    ];
    const machine = machineDetailsFactory({
      pod: {
        id: 1,
        name: "pod",
      },
      power_bmc_node_count: 1,
      power_type: "manual",
      system_id: "abc123",
    });

    renderWithMockStore(
      <Formik
        initialValues={{
          powerParameters: {},
          powerType: "manual",
        }}
        onSubmit={jest.fn()}
      >
        <PowerFormFields machine={machine} />
      </Formik>,
      { state }
    );

    expect(screen.getByRole("combobox", { name: /Power type/ })).toBeDisabled();
    expect(
      screen.getByRole("textbox", { name: "Node field" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: "BMC field" })
    ).not.toBeInTheDocument();
  });
});
