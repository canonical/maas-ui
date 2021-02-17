import { mount } from "enzyme";
import { Formik } from "formik";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import MacAddressField from "./MacAddressField";

import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("MacAddressField", () => {
  it("formats text as it is typed", async () => {
    const store = mockStore(rootStateFactory());
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ mac_address: "" }} onSubmit={jest.fn()}>
          <MacAddressField name="mac_address" />
        </Formik>
      </Provider>
    );
    await act(async () => {
      wrapper.find("FormikField input").simulate("change", {
        target: {
          name: "mac_address",
          value: "1a2",
        },
      });
    });
    wrapper.update();
    expect(wrapper.find("FormikField input").prop("value")).toBe("1a:2");
  });
});
