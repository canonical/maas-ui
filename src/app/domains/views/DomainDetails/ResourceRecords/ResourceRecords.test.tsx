import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ResourceRecords from "./ResourceRecords";

import {
  domainDetails as domainFactory,
  domainState as domainStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ResourceRecords", () => {
  it("shows a message if domain has no records", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        items: [domainFactory({ id: 1, rrsets: [] })],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <ResourceRecords id={1} />
      </Provider>
    );

    expect(wrapper.find("[data-testid='no-records']").text()).toBe(
      "Domain contains no records."
    );
  });

  it("displays a loading spinner with text when loading", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        items: [],
        loading: true,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <ResourceRecords id={1} />
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
    expect(wrapper.text().trim()).toBe("Loading...");
  });
});
