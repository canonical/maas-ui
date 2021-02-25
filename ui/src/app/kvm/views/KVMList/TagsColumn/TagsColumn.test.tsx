import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import TagsColumn from "./TagsColumn";

import {
  pod as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("TagsColumn", () => {
  it("displays the pod's tags", () => {
    const state = rootStateFactory({
      pod: podStateFactory({
        items: [
          podFactory({
            tags: ["tag1", "tag2"],
          }),
        ],
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <TagsColumn id={1} />
      </Provider>
    );
    expect(wrapper.find("[data-test='pod-tags']").text()).toBe("tag1, tag2");
  });
});
