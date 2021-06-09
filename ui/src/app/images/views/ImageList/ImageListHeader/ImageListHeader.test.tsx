import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ImageListHeader from "./ImageListHeader";

import {
  bootResourceState as bootResourceStateFactory,
  bootResourceStatuses as bootResourceStatusesFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ImageListHeader", () => {
  it("sets the loading state when polling", () => {
    const state = rootStateFactory({
      bootresource: bootResourceStateFactory({
        statuses: bootResourceStatusesFactory({
          poll: true,
        }),
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/images", key: "testKey" }]}
        >
          <ImageListHeader />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("SectionHeader").prop("loading")).toBe(true);
  });
});
