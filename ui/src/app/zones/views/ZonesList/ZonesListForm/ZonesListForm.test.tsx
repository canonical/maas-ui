import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import ZonesListForm from "./ZonesListForm";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("ZonesListForm", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory();
  });

  it("runs closeForm function when the cancel button is clicked", () => {
    const closeForm = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <ZonesListForm closeForm={closeForm} />
      </Provider>
    );

    wrapper.find("button[data-test='cancel-action']").simulate("click");
    expect(closeForm).toHaveBeenCalled();
  });

  it("calls actions.create on save click", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <ZonesListForm closeForm={jest.fn()} />
      </Provider>
    );
    act(() =>
      wrapper.find("Formik").props().onSubmit({
        description: "desc",
        name: "test-zone",
      })
    );

    expect(
      store.getActions().find((action) => action.type === "zone/create")
    ).toStrictEqual({
      type: "zone/create",
      meta: {
        method: "create",
        model: "zone",
      },
      payload: {
        params: {
          description: "desc",
          name: "test-zone",
        },
      },
    });
  });
});
