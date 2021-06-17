import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import DomainDetails from "./DomainDetails";

import {
  domain as domainFactory,
  domainState as domainStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DomainDetails", () => {
  it("shows a spinner if domain has not loaded yet", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        items: [domainFactory({ id: 1, name: "domain-in-the-membrane" })],
        loading: true,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/domain/1", key: "testKey" }]}
        >
          <Route exact path="/domain/:id" component={() => <DomainDetails />} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("SectionHeader Spinner").exists()).toBe(true);
  });

  it("shows the domain name in the header if domain has loaded", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        items: [domainFactory({ id: 1, name: "domain-in-the-membrane" })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/domain/1", key: "testKey" }]}
        >
          <Route exact path="/domain/:id" component={() => <DomainDetails />} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='section-header-title']").text()).toBe(
      "domain-in-the-membrane"
    );
  });
});
