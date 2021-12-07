import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import WindowsForm from "./WindowsForm";

import type { RootState } from "app/store/root/types";
import {
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("WindowsForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        loading: false,
        loaded: true,
        items: [
          {
            name: "windows_kms_host",
            value: "127.0.0.1",
          },
        ],
      }),
    });
  });

  it("sets windows_kms_host value", () => {
    const store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <WindowsForm />
      </Provider>
    );
    expect(
      wrapper.find("input[name='windows_kms_host']").first().props().value
    ).toBe("127.0.0.1");
  });
});
