import { mount } from "enzyme";
import { Field, Formik } from "formik";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import * as Yup from "yup";

import FormikFormContent from "./FormikFormContent";

import * as hooks from "app/base/hooks";
import type { RootState } from "app/store/root/types";
import {
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

describe("FormikFormContent", () => {
  let state: RootState;
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
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <FormikFormContent>Content</FormikFormContent>
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("FormikFormContent").exists()).toBe(true);
  });

  it("can display non-field errors from a string", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <FormikFormContent errors="Uh oh!">Content</FormikFormContent>
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").text()).toEqual("Error:Uh oh!");
  });

  it("can display non-field errors from the __all__ key", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <FormikFormContent errors={{ __all__: ["Uh oh!"] }}>
              Content
            </FormikFormContent>
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").text()).toEqual("Error:Uh oh!");
  });

  it("can display non-field errors from the unknown keys with strings", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <FormikFormContent errors={{ username: "Wrong username" }}>
              Content
            </FormikFormContent>
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").text()).toEqual("Error:Wrong username");
  });

  it("does not display non-field errors for fields", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <Formik initialValues={{ username: "" }} onSubmit={jest.fn()}>
            <FormikFormContent errors={{ username: "Wrong username" }}>
              Content
            </FormikFormContent>
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").exists()).toBe(false);
  });

  it("can display non-field errors from the unknown keys with arrays", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <FormikFormContent
              errors={{
                username: ["Wrong username", "Username must be provided"],
              }}
            >
              Content
            </FormikFormContent>
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Notification").text()).toEqual(
      "Error:Wrong username, Username must be provided"
    );
  });

  it("can be inline", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <FormikFormContent inline>Content</FormikFormContent>
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Form").prop("inline")).toBe(true);
  });

  it("does not render buttons if editable is set to false", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <FormikFormContent editable={false}>Content</FormikFormContent>
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("button").exists()).toBe(false);
  });

  it("can redirect when saved", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <FormikFormContent saved={true} savedRedirect="/success">
              Content
            </FormikFormContent>
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Redirect").exists()).toBe(true);
  });

  it("can clean up when unmounted", async () => {
    const cleanup = jest.fn(() => ({
      type: "CLEANUP",
    }));
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <FormikFormContent cleanup={cleanup}>Content</FormikFormContent>
          </Formik>
        </MemoryRouter>
      </Provider>
    );

    act(() => {
      wrapper.unmount();
    });

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
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <FormikFormContent
              onSaveAnalytics={eventData}
              saved={true}
              savedRedirect="/success"
            >
              Content
            </FormikFormContent>
          </Formik>
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
    const Proxy = ({ saved }: { saved: boolean }) => (
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <Formik
            initialValues={initialValues}
            onSubmit={jest.fn()}
            validationSchema={Schema}
          >
            <FormikFormContent resetOnSave saved={saved}>
              <Field name="val1" />
            </FormikFormContent>
          </Formik>
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

  it("runs onSuccess function if successfully saved with no errors", async () => {
    const onSuccess = jest.fn();
    const store = mockStore(state);

    const Proxy = ({ saved }: { saved: boolean }) => (
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <FormikFormContent onSuccess={onSuccess} saved={saved}>
              <Field name="val1" />
            </FormikFormContent>
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    const wrapper = mount(<Proxy saved={false} />);

    expect(onSuccess).not.toHaveBeenCalled();

    wrapper.setProps({ saved: true });
    await waitForComponentToPaint(wrapper);
    expect(onSuccess).toHaveBeenCalled();
  });

  it("does not run onSuccess on first render", async () => {
    const onSuccess = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <FormikFormContent errors={null} onSuccess={onSuccess} saved={true}>
              <Field name="val1" />
            </FormikFormContent>
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    await waitForComponentToPaint(wrapper);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("does not run onSuccess function if saved but there are errors", async () => {
    const onSuccess = jest.fn();
    const store = mockStore(state);

    const Proxy = ({ errors, saved }: { errors?: string; saved: boolean }) => (
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <FormikFormContent
              errors={errors}
              onSuccess={onSuccess}
              saved={saved}
            >
              <Field name="val1" />
            </FormikFormContent>
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    const wrapper = mount(<Proxy errors={undefined} saved={false} />);

    expect(onSuccess).not.toHaveBeenCalled();

    wrapper.setProps({ errors: "Everything is ruined", saved: true });
    await waitForComponentToPaint(wrapper);
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
