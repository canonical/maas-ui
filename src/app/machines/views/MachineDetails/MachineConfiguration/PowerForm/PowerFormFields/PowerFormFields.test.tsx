import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

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

const mockStore = configureStore();

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
            name: "node-field",
            scope: PowerFieldScope.NODE,
          }),
          powerFieldFactory({
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
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik
          initialValues={{
            powerParameters: {},
            powerType: "manual",
          }}
          onSubmit={jest.fn()}
        >
          <PowerFormFields machine={machine} />
        </Formik>
      </Provider>
    );

    expect(wrapper.find("Select[name='powerType']").prop("disabled")).toBe(
      true
    );
    expect(
      wrapper.find("input[name='powerParameters.node-field']").exists()
    ).toBe(true);
    expect(
      wrapper.find("input[name='powerParameters.bmc-field']").exists()
    ).toBe(false);
  });
});
