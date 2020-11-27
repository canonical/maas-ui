import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import RAMColumn from "./RAMColumn";

import type { RootState } from "app/store/root/types";
import {
  pod as podFactory,
  podHint as podHintFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("RAMColumn", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            id: 1,
            memory_over_commit_ratio: 1,
            name: "pod-1",
            total: podHintFactory({
              memory: 8192,
            }),
            used: podHintFactory({
              memory: 2048,
            }),
          }),
        ],
      }),
    });
  });

  it("can display correct RAM information without overcommit", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <RAMColumn id={1} />
      </Provider>
    );
    expect(wrapper.find("Meter").find(".p-meter__label").text()).toBe(
      "2 of 8 GiB allocated"
    );
    expect(wrapper.find("Meter").props().max).toBe(8192);
  });

  it("can display correct RAM information with overcommit", () => {
    const state = { ...initialState };
    state.pod.items[0].memory_over_commit_ratio = 2;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <RAMColumn id={1} />
      </Provider>
    );
    expect(wrapper.find("Meter").find(".p-meter__label").text()).toBe(
      "2 of 16 GiB allocated"
    );
    expect(wrapper.find("Meter").props().max).toBe(16384);
  });
});
