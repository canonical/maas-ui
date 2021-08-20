import { shallow, mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ThirdPartyDriversForm from "./ThirdPartyDriversForm";

import type { RootState } from "app/store/root/types";
import {
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ThirdPartyDriversForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [
          {
            name: "enable_third_party_drivers",
            value: true,
          },
        ],
      }),
    });
  });

  it("can render", () => {
    const store = mockStore(state);

    const wrapper = shallow(
      <Provider store={store}>
        <ThirdPartyDriversForm />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("sets enable_third_party_drivers value", () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <ThirdPartyDriversForm />
      </Provider>
    );
    expect(
      wrapper.find("input[name='enable_third_party_drivers']").props().value
    ).toBe(true);
  });
});
