import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import MachineCommissioning from ".";

import type { RootState } from "app/store/root/types";
import {
  machineState as machineStateFactory,
  machineDetails as machineDetailsFactory,
  scriptResultState as scriptResultStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("MachineCommissioning", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineDetailsFactory({
            locked: false,
            permissions: ["edit"],
            system_id: "abc123",
          }),
        ],
      }),
      scriptresult: scriptResultStateFactory({
        loaded: true,
      }),
    });
  });

  it("renders", () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <MachineCommissioning />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });
});
