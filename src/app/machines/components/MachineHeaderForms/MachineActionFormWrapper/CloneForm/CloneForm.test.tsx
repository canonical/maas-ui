import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import CloneForm from "./CloneForm";

import {
  machineState as machineStateFactory,
  machineStatus as machineStatusFactory,
  machineStatuses as machineStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import {
  renderWithBrowserRouter,
  screen,
  userEvent,
  submitFormikForm,
  waitForComponentToPaint,
} from "testing/utils";
const mockStore = configureStore();
jest.mock("app/base/components/ActionForm", () => ({
  __esModule: true,
  default: (props: any) => {
    const { children, ...rest } = props;
    return <form {...rest}>{children}</form>;
  },
}));
describe("CloneForm", () => {
  jest.spyOn(require("@reduxjs/toolkit"), "nanoid").mockReturnValue("123456");
  test("should be submittable only when a machine and cloning config are selected", async () => {
    const machines = [
      { system_id: "abc123" },
      { disks: [{ id: 1 }], interfaces: [{ id: 1 }], system_id: "def456" },
    ];
    const state = rootStateFactory({
      machine: machineStateFactory({
        active: null,
        items: machines,
        loaded: true,
        selected: ["abc123"],
        lists: {
          "123456": {
            groups: [
              {
                items: [machines[1].system_id],
              },
            ],
            loaded: true,
          },
        },
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
    renderWithBrowserRouter(
      <CloneForm
        clearSidePanelContent={jest.fn()}
        machines={state.machine.items}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );
    const isSubmitDisabled = () =>
      screen.getByRole("button", { name: "Clone" }).getAttribute("disabled") ===
      "true";
    // Checkboxes and submit should be disabled at first.
    expect(isSubmitDisabled()).toBe(true);

    // Select a source machine - form should update
    userEvent.click(screen.getByRole("checkbox", { name: /abc123/i }));
    await waitForComponentToPaint();
    expect(isSubmitDisabled()).toBe(false);

    // Select config to clone - submit should be re-disabled.
    userEvent.click(screen.getByRole("checkbox", { name: "NICs" }));
    await waitForComponentToPaint();
    expect(isSubmitDisabled()).toBe(true);
  });

  test("shows cloning results when the form is successfully submitted", () => {
    const state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
      }),
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <CloneForm
          clearSidePanelContent={jest.fn()}
          machines={[]}
          processingCount={0}
          viewingDetails={false}
        />
      </Provider>,
      { route: "/machines" }
    );
    expect(screen.queryByText("Cloning Completed")).not.toBeInTheDocument();

    const onSubmit = screen.getByRole("button", { name: "Clone" });
    userEvent.click(onSubmit);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    act(() => {
      const onSuccess = onSubmit.props.onClick;
      onSuccess({});
    });
    expect(screen.queryByText("Cloning Completed")).toBeInTheDocument();
  });

  test("can dispatch an action to clone to the given machines", async () => {
    const machines = [
      { system_id: "abc123" },
      { system_id: "def456" },
      { system_id: "ghi789" },
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
    renderWithBrowserRouter(
      <Provider store={store}>
        <CloneForm
          clearSidePanelContent={jest.fn()}
          machines={state.machine.items}
          selectedMachines={{
            items: [machines[0].system_id, machines[1].system_id],
          }}
          viewingDetails={false}
        />
      </Provider>,
      { route: "/machines" }
    );
    const onSubmit = screen.getByRole("button", { name: "Clone" });
    userEvent.click(onSubmit);
    await waitForComponentToPaint();
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    submitFormikForm(screen, {
      interfaces: true,
      source: "ghi789",
      storage: false,
    });

    const expectedAction = {
      type: "machine/clone/pending",
      payload: {
        data: {
          filter: { id: ["abc123", "def456"] },
          interfaces: true,
          storage: false,
          system_id: "ghi789",
        },
        requestId: "123456",
        preventPolling: false,
      },
    };
    const actualAction = store
      .getActions()
      .find((action) => action.type === expectedAction.type);
    expect(expectedAction).toStrictEqual(actualAction);
  });
});
