import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import MachineFormFields from "../MachineFormFields";

import {
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("MachineFormFields", () => {
  it("shows tags as filter links if not in editing mode", () => {
    const machine = machineDetailsFactory({ system_id: "abc123" });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machine],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik
          initialValues={{
            architecture: machine.architecture || "",
            description: machine.description || "",
            minHweKernel: machine.min_hwe_kernel || "",
            pool: machine.pool?.name || "",
            tags: machine.tags || [],
            zone: machine.zone?.name || "",
          }}
          onSubmit={jest.fn()}
        >
          <MachineFormFields editing={false} />
        </Formik>
      </Provider>
    );

    expect(wrapper.find("TagSelector").exists()).toBe(false);
    expect(wrapper.find("TagLinks").exists()).toBe(true);
  });
});
