import configureStore from "redux-mock-store";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { Provider } from "react-redux";

import { useSendAnalytics } from "app/base/hooks";
import FormikForm from "./FormikForm";

const mockStore = configureStore();
jest.mock("app/base/hooks");

describe("FormikForm", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

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

  it("can send analytics when saved", () => {
    const eventData = {
      action: "Saved",
      category: "Settings",
      label: "Form"
    };
    const store = mockStore({});
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <FormikForm
            initialValues={{}}
            onSaveAnalytics={eventData}
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
    expect(useSendAnalytics).toHaveBeenCalled();
    expect(useSendAnalytics.mock.calls[0]).toEqual([
      true,
      eventData.category,
      eventData.action,
      eventData.label
    ]);
  });
});
