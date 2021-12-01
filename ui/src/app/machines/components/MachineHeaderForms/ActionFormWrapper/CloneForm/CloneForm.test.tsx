import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import CloneForm from "./CloneForm";

import ActionForm from "app/base/components/ActionForm";
import { actions as machineActions } from "app/store/machine";
import {
  machine as machineFactory,
  machineDetails as machineDetailsFactory,
  machineDisk as diskFactory,
  machineInterface as nicFactory,
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { submitFormikForm, waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

describe("CloneForm", () => {
  it("should be submittable only when a machine and cloning config are selected", async () => {
    const machines = [
      machineFactory({ system_id: "abc123" }),
      machineDetailsFactory({
        disks: [diskFactory()],
        interfaces: [nicFactory()],
        system_id: "def456",
      }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        active: null,
        items: machines,
        loaded: true,
        selected: ["abc123"],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
          def456: machineStatusFactory(),
        }),
      }),
    });
    state.fabric.loaded = true;
    state.subnet.loaded = true;
    state.vlan.loaded = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CloneForm
            clearHeaderContent={jest.fn()}
            machines={[]}
            processingCount={0}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );
    const isCheckboxDisabled = () =>
      wrapper.find("input[name='interfaces']").prop("disabled") === true;
    const isSubmitDisabled = () =>
      wrapper.find(".p-button--positive[type='submit']").prop("disabled") ===
      true;

    // Checkboxes and submit should be disabled at first.
    expect(isCheckboxDisabled()).toBe(true);
    expect(isSubmitDisabled()).toBe(true);

    // Select a source machine - checkbox should be enabled.
    wrapper.find("[data-testid='source-machine-row']").at(0).simulate("click");
    await waitForComponentToPaint(wrapper);
    expect(isCheckboxDisabled()).toBe(false);
    expect(isSubmitDisabled()).toBe(true);

    // Select config to clone - submit should be enabled.
    wrapper.find("input[name='interfaces']").simulate("change", {
      target: { name: "interfaces", value: true },
    });
    await waitForComponentToPaint(wrapper);
    expect(isCheckboxDisabled()).toBe(false);
    expect(isSubmitDisabled()).toBe(false);
  });

  it("shows cloning results when the form is successfully submitted", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CloneForm
            clearHeaderContent={jest.fn()}
            machines={[]}
            processingCount={0}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("CloneResults").exists()).toBe(false);

    act(() => {
      const onSuccess = wrapper.find(ActionForm).prop("onSuccess");
      onSuccess && onSuccess({});
    });
    wrapper.update();
    expect(wrapper.find("CloneResults").exists()).toBe(true);
  });

  it("can dispatch an action to clone to the given machines", () => {
    const machines = [
      machineFactory({ system_id: "abc123" }),
      machineFactory({ system_id: "def456" }),
      machineFactory({ system_id: "ghi789" }),
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        active: null,
        items: machines,
        loaded: true,
        selected: ["abc123", "def456"],
        statuses: machineStatusesFactory({
          abc123: machineStatusFactory(),
          def456: machineStatusFactory(),
          ghi789: machineStatusFactory(),
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <CloneForm
            clearHeaderContent={jest.fn()}
            machines={[machines[0], machines[1]]}
            processingCount={0}
            viewingDetails={false}
          />
        </MemoryRouter>
      </Provider>
    );

    submitFormikForm(wrapper, {
      interfaces: true,
      source: "ghi789",
      storage: false,
    });

    const expectedAction = machineActions.clone({
      destinations: ["abc123", "def456"],
      interfaces: true,
      storage: false,
      system_id: "ghi789",
    });
    const actualAction = store
      .getActions()
      .find((action) => action.type === expectedAction.type);
    expect(expectedAction).toStrictEqual(actualAction);
  });
});
