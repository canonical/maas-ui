import { act } from "react-dom/test-utils";
import configureStore from "redux-mock-store";
import { Field } from "formik";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { Provider } from "react-redux";
import * as Yup from "yup";

import FormikForm from "./FormikForm";
import * as hooks from "app/base/hooks";
import {
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("FormikForm", () => {
  let state;
  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [configFactory({ name: "analytics_enabled", value: false })],
      }),
    });
  });

  it("can render", () => {
    const store = mockStore(state);
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
    const store = mockStore(state);
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
      type: "CLEANUP",
    }));
    const store = mockStore(state);
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
      label: "Form",
    };
    const useSendMock = jest.spyOn(hooks, "useSendAnalyticsWhen");
    const store = mockStore(state);
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
    expect(useSendMock).toHaveBeenCalled();
    expect(useSendMock.mock.calls[0]).toEqual([
      true,
      eventData.category,
      eventData.action,
      eventData.label,
    ]);
    useSendMock.mockRestore();
  });

  it("can reset form on save if resetOnSave is true", async () => {
    const store = mockStore(state);
    const initialValues = {
      val1: "initial",
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

  it("can be inline", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <FormikForm
            initialValues={{}}
            onSubmit={jest.fn()}
            validationSchema={{}}
            inline
          >
            Content
          </FormikForm>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("FormikFormContent").prop("inline")).toBe(true);
  });
});
