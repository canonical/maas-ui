import { act } from "react-dom/test-utils";
import configureStore from "redux-mock-store";
import { Field } from "formik";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { Provider } from "react-redux";
import * as Yup from "yup";

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

  it("can reset form on save if resetOnSave is true", async () => {
    const store = mockStore({});
    const initialValues = {
      val1: "initial"
    };
    const Schema = Yup.object().shape({ val1: Yup.string() });

    // Proxy component required to be able to change FormikForm saved prop.
    const Proxy = ({ saved }) => (
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <FormikForm
            initialValues={initialValues}
            onSubmit={jest.fn()}
            resetOnSave
            saved={saved}
            validationSchema={Schema}
          >
            <Field name="val1" />
          </FormikForm>
        </MemoryRouter>
      </Provider>
    );

    const wrapper = mount(<Proxy saved={false} />);

    // Change input to a new value.
    await act(async () => {
      wrapper
        .find("input[name='val1']")
        .props()
        .onChange({ target: { name: "val1", value: "changed" } });
    });
    wrapper.update();
    expect(wrapper.find("input[name='val1']").props().value).toBe("changed");

    // Set saved prop to true and expect form value to revert to initial value.
    await act(async () => {
      wrapper.setProps({ saved: true });
    });
    wrapper.update();
    expect(wrapper.find("input[name='val1']").props().value).toBe("initial");
  });
});
