import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ProjectResourcesCard from "./ProjectResourcesCard";

import {
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ProjectResourcesCard", () => {
  it("shows a spinner if pods have not loaded yet", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [],
        loaded: false,
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/1/project", key: "testKey" }]}
        >
          <ProjectResourcesCard id={1} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Spinner").exists()).toBe(true);
  });
});
