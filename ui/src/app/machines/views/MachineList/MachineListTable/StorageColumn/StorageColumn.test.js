import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import { StorageColumn } from "./StorageColumn";

const mockStore = configureStore();

describe("StorageColumn", () => {
  let state;
  beforeEach(() => {
    state = {
      config: {
        items: [],
      },
      machine: {
        errors: {},
        loading: false,
        loaded: true,
        items: [
          {
            system_id: "abc123",
            storage: 8,
          },
        ],
      },
    };
  });

  it("renders", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <StorageColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("StorageColumn")).toMatchSnapshot();
  });

  it("displays the storage value correctly", () => {
    state.machine.items[0].storage = 2000;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <StorageColumn systemId="abc123" />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find('[data-test="storage-value"]').text()).toEqual("2");
    expect(wrapper.find('[data-test="storage-unit"]').text()).toEqual("TB");
  });
});
