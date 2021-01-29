import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DHCPTable from "./DHCPTable";

import type { RootState } from "app/store/root/types";
import { NodeStatus } from "app/store/types/node";
import {
  dhcpSnippet as dhcpSnippetFactory,
  dhcpSnippetState as dhcpSnippetStateFactory,
  machineDetails as machineDetailsFactory,
  machineEvent as machineEventFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DHCPTable", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      dhcpsnippet: dhcpSnippetStateFactory({
        loaded: true,
        loading: false,
        items: [
          dhcpSnippetFactory({ node: "abc123" }),
          dhcpSnippetFactory({ node: "abc123" }),
          dhcpSnippetFactory(),
        ],
      }),
      machine: machineStateFactory({
        items: [
          machineDetailsFactory({
            architecture: "amd64",
            events: [machineEventFactory()],
            system_id: "abc123",
          }),
        ],
        loaded: true,
        loading: false,
      }),
    });
  });

  it("shows snippets for a machine", () => {
    state.machine.items = [
      machineDetailsFactory({
        on_network: true,
        osystem: "ubuntu",
        status: NodeStatus.NEW,
        system_id: "abc123",
      }),
    ];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <DHCPTable systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("TableRow").length).toBe(3);
  });
});
