import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DomainDetailsHeader from "./DomainDetailsHeader";

import {
  domain as domainFactory,
  domainState as domainStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DomainDetailsHeader", () => {
  it("shows a spinner if domain has not loaded yet", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({ items: [] }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        component={() => <DomainDetailsHeader id={1} />}
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
        component={() => <DomainDetailsHeader id={1} />}
      </Provider>
    );

    expect(wrapper.find("[data-test='section-header-title']").text()).toBe(
      "domain-in-the-membrane"
    );
  });

  it("Shows the correct number of hosts and resource records", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        loaded: true,
        items: [
          domainFactory({
            id: 1,
            name: "domain-in-the-membrane",
            hosts: 5,
            resource_count: 9,
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        component={() => <DomainDetailsHeader id={1} />}
      </Provider>
    );

    expect(wrapper.find("[data-test='section-header-subtitle']").text()).toBe(
      "5 hosts; 9 resource records"
    );
  });
  it("Shows only resource records if there are no hosts", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        loaded: true,
        items: [
          domainFactory({
            id: 1,
            name: "domain-in-the-membrane",
            hosts: 0,
            resource_count: 9,
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        component={() => <DomainDetailsHeader id={1} />}
      </Provider>
    );

    expect(wrapper.find("[data-test='section-header-subtitle']").text()).toBe(
      "9 resource records"
    );
  });
  it("Shows only hosts if there are no resource records", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        loaded: true,
        items: [
          domainFactory({
            id: 1,
            name: "domain-in-the-membrane",
            hosts: 5,
            resource_count: 0,
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        component={() => <DomainDetailsHeader id={1} />}
      </Provider>
    );

    expect(wrapper.find("[data-test='section-header-subtitle']").text()).toBe(
      "5 hosts; No resource records"
    );
  });
  it("Shows the no records message if there is nothing", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        loaded: true,
        items: [
          domainFactory({
            id: 1,
            name: "domain-in-the-membrane",
            hosts: 0,
            resource_count: 0,
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        component={() => <DomainDetailsHeader id={1} />}
      </Provider>
    );

    expect(wrapper.find("[data-test='section-header-subtitle']").text()).toBe(
      "No resource records"
    );
  });
});
