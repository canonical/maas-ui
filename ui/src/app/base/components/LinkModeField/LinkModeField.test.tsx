import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import LinkModeField from "./LinkModeField";

import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("LinkModeField", () => {
  it("displays the link mode options", () => {
    const store = mockStore(rootStateFactory());
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ mode: "" }} onSubmit={jest.fn()}>
          <LinkModeField />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField")).toMatchSnapshot();
  });
});
