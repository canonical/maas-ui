import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import CloneFormFields from "./CloneFormFields";

import { actions as machineActions } from "app/store/machine";
import {
  machine as machineFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

describe("CloneFormFields", () => {
  it("dispatches action to fetch machines on load", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <Formik
          initialValues={{ interfaces: false, source: "", storage: false }}
          onSubmit={jest.fn()}
        >
          <CloneFormFields />
        </Formik>
      </Provider>
    );

    expect(
      store.getActions().some((action) => action.type === "machine/fetch")
    ).toBe(true);
  });

  it("dispatches action to get full machine details on machine click", async () => {
    const machine = machineFactory({ system_id: "abc123" });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machine],
        loaded: true,
        selected: [],
        active: null,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik
          initialValues={{ interfaces: false, source: "", storage: false }}
          onSubmit={jest.fn()}
        >
          <CloneFormFields />
        </Formik>
      </Provider>
    );
    wrapper.find("[data-test='source-machine-row']").at(0).simulate("click");
    await waitForComponentToPaint(wrapper);

    const expectedAction = machineActions.get(machine.system_id);
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("applies different styling depending on clone selection state", async () => {
    const machine = machineFactory({ system_id: "abc123" });
    const state = rootStateFactory({
      machine: machineStateFactory({
        items: [machine],
        loaded: true,
        selected: [],
        active: null,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik
          initialValues={{ interfaces: false, source: "", storage: false }}
          onSubmit={jest.fn()}
        >
          <CloneFormFields />
        </Formik>
      </Provider>
    );
    const getTableClass = () =>
      wrapper.find(".clone-table").at(0).prop("className");
    // Table has unselected styling by default
    expect(getTableClass()?.includes("not-selected")).toBe(true);

    // Check the checkbox for the table.
    wrapper
      .find("input[name='interfaces']")
      .at(0)
      .simulate("change", { target: { name: "interfaces", value: true } });
    await waitForComponentToPaint(wrapper);

    // Table should not have unselected styling.
    expect(getTableClass()?.includes("not-selected")).toBe(false);
  });
});
