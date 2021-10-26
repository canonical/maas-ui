import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DomainDetailsHeader from "./DomainDetailsHeader";

import {
  domain as domainFactory,
  domainDetails as domainDetailsFactory,
  domainState as domainStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DomainDetailsHeader", () => {
  it("shows a spinner if domain details has not loaded yet", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({ items: [domainFactory({ id: 1 })] }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DomainDetailsHeader id={1} />
      </Provider>
    );

    expect(
      wrapper.find("[data-test='section-header-subtitle'] Spinner").exists()
    ).toBe(true);
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
        <DomainDetailsHeader id={1} />
      </Provider>
    );

    expect(wrapper.find("[data-test='section-header-title']").text()).toBe(
      "domain-in-the-membrane"
    );
  });

  it("Shows the correct number of hosts and resource records once details loaded", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        loaded: true,
        items: [
          domainDetailsFactory({
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
        <DomainDetailsHeader id={1} />
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
          domainDetailsFactory({
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
        <DomainDetailsHeader id={1} />
      </Provider>
    );

    expect(wrapper.find("[data-test='section-header-subtitle']").text()).toBe(
      "9 resource records"
    );
  });

  it("shows only hosts if there are no resource records", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        loaded: true,
        items: [
          domainDetailsFactory({
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
        <DomainDetailsHeader id={1} />
      </Provider>
    );

    expect(wrapper.find("[data-test='section-header-subtitle']").text()).toBe(
      "5 hosts; No resource records"
    );
  });

  it("shows the no records message if there is nothing", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        loaded: true,
        items: [
          domainDetailsFactory({
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
        <DomainDetailsHeader id={1} />
      </Provider>
    );

    expect(wrapper.find("[data-test='section-header-subtitle']").text()).toBe(
      "No resource records"
    );
  });

  it("does not show a button to delete domain if it is the default", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        loaded: true,
        items: [
          domainDetailsFactory({
            id: 0,
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <DomainDetailsHeader id={0} />
      </Provider>
    );

    expect(wrapper.find("[data-test='delete-domain']").exists()).toBe(false);
  });
});
