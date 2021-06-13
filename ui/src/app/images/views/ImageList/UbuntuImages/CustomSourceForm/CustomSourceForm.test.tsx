import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import CustomSourceForm from "./CustomSourceForm";

import { actions as bootResourceActions } from "app/store/bootresource";
import { BootResourceSourceType } from "app/store/bootresource/types";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("CustomSourceForm", () => {
  it("dispatches an action to fetch images from a custom source", () => {
    const state = rootStateFactory();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <CustomSourceForm />
      </Provider>
    );
    wrapper.find("Formik").invoke("onSubmit")({
      keyring_data: "data",
      keyring_filename: "/path/to/file",
      url: "http://www.example.com/",
    });

    const actualActions = store.getActions();
    const expectedAction = bootResourceActions.fetch({
      keyring_data: "data",
      keyring_filename: "/path/to/file",
      source_type: BootResourceSourceType.CUSTOM,
      url: "http://www.example.com/",
    });
    expect(
      actualActions.find(
        (actualAction) => actualAction.type === expectedAction.type
      )
    ).toStrictEqual(expectedAction);
  });
});
