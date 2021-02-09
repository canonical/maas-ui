import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import EditDHCP from "./EditDHCP";

import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("EditDHCP", () => {
  it("renders", () => {
    const store = mockStore(rootStateFactory());
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machine/abc123", key: "testKey" }]}
        >
          <EditDHCP close={jest.fn()} id={1} />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("DhcpForm").exists()).toBe(true);
  });
});
