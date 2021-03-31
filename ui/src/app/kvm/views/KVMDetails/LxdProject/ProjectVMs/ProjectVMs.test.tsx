import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ProjectVMs from "./ProjectVMs";

import {
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ProjectVMs", () => {
  it("fetches machines on load", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ id: 1 })],
        loaded: false,
      }),
    });
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <ProjectVMs id={1} setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(
      store.getActions().some((action) => action.type === "machine/fetch")
    );
  });
});
