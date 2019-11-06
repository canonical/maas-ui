import configureStore from "redux-mock-store";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { Provider } from "react-redux";

import FormikForm from "./FormikForm";

jest.mock("uuid/v4", () =>
  jest.fn(() => "00000000-0000-0000-0000-000000000000")
);

const mockStore = configureStore();

jest.mock("uuid/v4", () =>
  jest.fn(() => "00000000-0000-0000-0000-000000000000")
);

describe("FormikForm", () => {
  it("can render", () => {
    const store = mockStore({});
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <FormikForm
            initialValues={{}}
            onSubmit={jest.fn()}
            validationSchema={{}}
          >
            Content
          </FormikForm>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Formik").exists()).toBe(true);
  });

  it("can redirect when saved", () => {
    const store = mockStore({});
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <FormikForm
            initialValues={{}}
            onSubmit={jest.fn()}
            saved={true}
            savedRedirect="/success"
            validationSchema={{}}
          >
            Content
          </FormikForm>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Redirect").exists()).toBe(true);
  });

  it("can clean up when unmounted", () => {
    const cleanup = jest.fn(() => ({
      type: "CLEANUP"
    }));
    const store = mockStore({});
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <FormikForm
            cleanup={cleanup}
            initialValues={{}}
            onSubmit={jest.fn()}
            validationSchema={{}}
          >
            Content
          </FormikForm>
        </MemoryRouter>
      </Provider>
    );
    wrapper.unmount();
    expect(store.getActions()).toEqual([{ type: "CLEANUP" }]);
  });
});
