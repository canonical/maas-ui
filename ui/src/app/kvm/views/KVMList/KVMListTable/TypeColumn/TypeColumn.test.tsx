import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import TypeColumn from "./TypeColumn";

import type { RootState } from "app/store/root/types";
import {
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("TypeColumn", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            type: "virsh",
          }),
        ],
      }),
    });
  });

  it("displays the formatted pod type", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <TypeColumn id={1} />
      </Provider>
    );
    expect(wrapper.find("[data-test='pod-type']").text()).toBe("Virsh");
  });
});
