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
import { waitForComponentToPaint } from "testing/utils";

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

  it("clears machine selected state on unmount", async () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [podFactory({ id: 1 })],
        loaded: false,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <ProjectVMs id={1} setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.unmount();
    await waitForComponentToPaint(wrapper);

    expect(
      store.getActions().find((action) => action.type === "machine/setSelected")
    ).toStrictEqual({ type: "machine/setSelected", payload: [] });
  });
});
