import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import RSDListActionMenu from "./RSDListActionMenu";

import {
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("RSDListActionMenu", () => {
  it("is disabled with tooltip if no RSDs are selected", () => {
    const state = rootStateFactory({ pod: podStateFactory({ selected: [] }) });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/rsd", key: "testKey" }]}>
          <RSDListActionMenu setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find('[data-test="action-dropdown"] button').prop("disabled")
    ).toBe(true);
    expect(wrapper.find("Tooltip").prop("message")).toBe(
      "Select RSDs below to perform an action."
    );
  });

  it("is enabled if at least one RSD is selected", () => {
    const rsds = [podFactory({ type: "rsd" }), podFactory({ type: "rsd" })];
    const state = rootStateFactory({
      pod: podStateFactory({ items: rsds, selected: [rsds[0].id] }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/rsd", key: "testKey" }]}>
          <RSDListActionMenu setSelectedAction={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    expect(
      wrapper.find('[data-test="action-dropdown"] button').props().disabled
    ).toBe(false);
    expect(wrapper.find("Tooltip").prop("message")).toBe(undefined);
  });
});
