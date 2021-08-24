import { mount } from "enzyme";
import { Formik } from "formik";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import SSHKeyFormFields from "./SSHKeyFormFields";

import type { RootState } from "app/store/root/types";
import {
  sshKeyState as sshKeyStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("SSHKeyFormFields", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      sshkey: sshKeyStateFactory({
        loading: false,
        loaded: true,
        items: [],
      }),
    });
  });

  it("can render", () => {
    const store = mockStore(state);
    // This component needs to be tested within the wrapping form so the
    // context exists.
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <SSHKeyFormFields />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("SSHKeyFormFields").exists()).toBe(true);
  });

  it("can show id field", async () => {
    const store = mockStore(state);
    // This component needs to be tested within the wrapping form so the
    // context exists.
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <SSHKeyFormFields />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    const protocol = wrapper.find("select[name='protocol']");
    await act(async () => {
      protocol.simulate("change", {
        target: { name: "protocol", value: "lp" },
      });
    });
    wrapper.update();
    expect(
      wrapper
        .findWhere(
          (n) => n.name() === "FormikField" && n.prop("name") === "auth_id"
        )
        .exists()
    ).toBe(true);
  });

  it("can show key field", async () => {
    const store = mockStore(state);
    // This component needs to be tested within the wrapping form so the
    // context exists.
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <SSHKeyFormFields />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    const protocol = wrapper.find("select[name='protocol']");
    await act(async () => {
      protocol.simulate("change", {
        target: { name: "protocol", value: "upload" },
      });
    });
    wrapper.update();
    expect(
      wrapper
        .findWhere(
          (n) => n.name() === "FormikField" && n.prop("name") === "key"
        )
        .exists()
    ).toBe(true);
  });
});
