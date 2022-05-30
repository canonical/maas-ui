import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import DomainListHeader from "./DomainListHeader";

import type { RootState } from "app/store/root/types";
import {
  domain as domainFactory,
  domainState as domainStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DomainListHeader", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      domain: domainStateFactory({
        loaded: true,
        items: [domainFactory(), domainFactory()],
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("displays a loader if domains have not loaded", () => {
    const state = { ...initialState };
    state.domain.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/domains", key: "testKey" }]}
        >
          <CompatRouter>
            <DomainListHeader />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("displays a domain count if domains have loaded", () => {
    const state = { ...initialState };
    state.domain.loaded = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/domains", key: "testKey" }]}
        >
          <CompatRouter>
            <DomainListHeader />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find('[data-testid="section-header-subtitle"]').text()).toBe(
      "2 domains available"
    );
  });

  it("displays the form when Add domains is clicked", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/domains", key: "testKey" }]}
        >
          <CompatRouter>
            <DomainListHeader />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("DomainListHeaderForm").exists()).toBe(false);

    wrapper.find("button[data-testid='add-domain']").simulate("click");

    expect(wrapper.find("DomainListHeaderForm").exists()).toBe(true);
  });
});
