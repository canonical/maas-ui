import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import DomainDetails from "./DomainDetails";

import {
  domainState as domainStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("DomainDetails", () => {
  it("renders 'Not Found' header if domains loaded and domain not found", () => {
    const state = rootStateFactory({
      domain: domainStateFactory({
        items: [],
        loading: false,
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

    expect(wrapper.find("DomainNotFoundHeader").exists()).toBe(true);
  });
});
