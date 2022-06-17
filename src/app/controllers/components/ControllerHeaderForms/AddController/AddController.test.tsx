import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import AddController from "./AddController";

import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("AddController", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [
          { name: ConfigNames.MAAS_URL, value: "http://1.2.3.4/MAAS" },
          { name: ConfigNames.RPC_SHARED_SECRET, value: "veryverysecret" },
        ],
      }),
    });
  });

  it("includes the config in the instructions", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <AddController clearHeaderContent={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );
    const instructions = wrapper
      .find("div[data-testid='register-snippet']")
      .text();
    expect(instructions.includes("http://1.2.3.4/MAAS")).toBe(true);
    expect(instructions.includes("veryverysecret")).toBe(true);
  });

  it("can close the instructions", () => {
    const store = mockStore(state);
    const clearHeaderContent = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <AddController clearHeaderContent={clearHeaderContent} />
        </MemoryRouter>
      </Provider>
    );
    wrapper
      .find("Button[data-testid='add-controller-close']")
      .simulate("click");
    expect(clearHeaderContent).toHaveBeenCalled();
  });
});
