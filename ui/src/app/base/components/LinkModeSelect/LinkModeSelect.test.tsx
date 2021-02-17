import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import LinkModeSelect from "./LinkModeSelect";

import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("LinkModeSelect", () => {
  it("displays the link mode options", () => {
    const store = mockStore(rootStateFactory());
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ mode: "" }} onSubmit={jest.fn()}>
          <LinkModeSelect name="mode" />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField")).toMatchSnapshot();
  });

  it("can display a default option", () => {
    const store = mockStore(rootStateFactory());
    const defaultOption = {
      label: "Default",
      value: "99",
    };
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ mode: "" }} onSubmit={jest.fn()}>
          <LinkModeSelect name="mode" defaultOption={defaultOption} />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField").prop("options")[0]).toStrictEqual(
      defaultOption
    );
  });

  it("can hide the default option", () => {
    const store = mockStore(rootStateFactory());
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ mode: "" }} onSubmit={jest.fn()}>
          <LinkModeSelect name="mode" defaultOption={null} />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField").prop("options").length).toBe(4);
    expect(wrapper.find("FormikField").prop("options")[0]).not.toStrictEqual({
      label: "Select IP mode",
      value: "",
    });
  });
});
