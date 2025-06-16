import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import NameColumn from "./NameColumn";

import type { RootState } from "@/app/store/root/types";
import { NetworkInterfaceTypes } from "@/app/store/types/enum";
import { NodeStatus } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import { render, screen } from "@/testing/utils";

const mockStore = configureStore();

describe("NameColumn", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      machine: factory.machineState({
        items: [factory.machineDetails({ system_id: "abc123" })],
        loaded: true,
        statuses: {
          abc123: factory.machineStatus(),
        },
      }),
    });
  });

  it("disables the checkboxes when networking is disabled", () => {
    const nic = factory.machineInterface({
      type: NetworkInterfaceTypes.PHYSICAL,
    });
    state.machine.items = [
      factory.machineDetails({
        interfaces: [nic],
        status: NodeStatus.COMMISSIONING,
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <NameColumn
          handleRowCheckbox={vi.fn()}
          nic={nic}
          node={state.machine.items[0]}
          selected={[]}
          showCheckbox={true}
        />
      </Provider>
    );
    const checkbox: HTMLInputElement = screen.getByRole("checkbox");
    expect(checkbox.disabled).toBe(true);
  });

  it("can not show a checkbox", () => {
    const nic = factory.machineInterface({
      type: NetworkInterfaceTypes.PHYSICAL,
    });
    state.machine.items = [
      factory.machineDetails({
        interfaces: [nic],
        status: NodeStatus.COMMISSIONING,
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <NameColumn
          handleRowCheckbox={vi.fn()}
          nic={nic}
          node={state.machine.items[0]}
          selected={[]}
          showCheckbox={false}
        />
      </Provider>
    );
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(screen.getByTestId("name")).toBeInTheDocument();
  });
});
