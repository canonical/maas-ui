import userEvent from "@testing-library/user-event";
import { Field, Formik } from "formik";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";
import * as Yup from "yup";

import FormikFormContent from "./FormikFormContent";

import { TestIds } from "app/base/components/FormikFormButtons";
import * as hooks from "app/base/hooks/analytics";
import { ConfigNames } from "app/store/config/types";
import type { RootState } from "app/store/root/types";
import {
  config as configFactory,
  configState as configStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { render, screen, renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState>();
const mockUseNavigate = jest.fn();
jest.mock("react-router-dom-v5-compat", () => ({
  ...jest.requireActual("react-router-dom-v5-compat"),
  useNavigate: () => mockUseNavigate,
}));

describe("FormikFormContent", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [
          configFactory({ name: ConfigNames.ENABLE_ANALYTICS, value: false }),
        ],
      }),
    });
  });

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  it("disables cancel button while saving", () => {
    renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <FormikFormContent onCancel={jest.fn()} saving>
          Content
        </FormikFormContent>
      </Formik>,
      { state }
    );

    expect(screen.getByTestId(TestIds.CancelButton)).toBeDisabled();
  });

  it("can disable the submit button", async () => {
    const onSubmit = jest.fn();
    renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={onSubmit}>
        <FormikFormContent
          aria-label="example"
          submitDisabled
          submitLabel="Save"
        >
          Content
        </FormikFormContent>
      </Formik>,
      { state }
    );

    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("can override disabling cancel button while saving", () => {
    renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <FormikFormContent cancelDisabled={false} onCancel={jest.fn()} saving>
          Content
        </FormikFormContent>
      </Formik>,
      { state }
    );

    expect(screen.getByTestId(TestIds.CancelButton)).not.toBeDisabled();
  });

  it("can display non-field errors from a string", () => {
    renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <FormikFormContent errors="Uh oh!">Content</FormikFormContent>
      </Formik>,
      { state }
    );

    expect(screen.getByText("Uh oh!")).toBeInTheDocument();
  });

  it("can display non-field errors from the __all__ key", () => {
    renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <FormikFormContent errors={{ __all__: ["Uh oh!"] }}>
          Content
        </FormikFormContent>
      </Formik>,
      { state }
    );

    expect(screen.getByText("Uh oh!")).toBeInTheDocument();
  });

  it("can display non-field errors from the unknown keys with strings", () => {
    renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <FormikFormContent errors={{ username: "Wrong username" }}>
          Content
        </FormikFormContent>
      </Formik>,
      { state }
    );

    expect(screen.getByText("Wrong username")).toBeInTheDocument();
  });

  it("does not display non-field errors for fields", () => {
    renderWithBrowserRouter(
      <Formik initialValues={{ username: "" }} onSubmit={jest.fn()}>
        <FormikFormContent errors={{ username: "Wrong username" }}>
          Content
        </FormikFormContent>
      </Formik>,
      { state }
    );

    expect(screen.queryByText("Wrong username")).not.toBeInTheDocument();
  });

  it("can display non-field errors from the unknown keys with arrays", () => {
    renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <FormikFormContent
          errors={{
            username: ["Wrong username", "Username must be provided"],
          }}
        >
          Content
        </FormikFormContent>
      </Formik>,
      { state }
    );
    expect(
      screen.getByText("Wrong username, Username must be provided")
    ).toBeInTheDocument();
  });

  it("can be inline", () => {
    renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <FormikFormContent aria-label="Fake form" inline>
          Content
        </FormikFormContent>
      </Formik>,
      { state }
    );
    expect(screen.getByRole("form", { name: "Fake form" })).toHaveClass(
      "p-form--inline"
    );
  });

  it("does not render buttons if editable is set to false", () => {
    renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <FormikFormContent editable={false}>Content</FormikFormContent>
      </Formik>,
      { state }
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("can redirect when saved", () => {
    renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <FormikFormContent saved={true} savedRedirect="/success">
          Content
        </FormikFormContent>
      </Formik>,
      { state }
    );

    expect(mockUseNavigate.mock.calls[0][0]).toBe("/success");
  });

  it("can clean up when unmounted", async () => {
    const store = mockStore(state);
    const cleanup = jest.fn(() => ({
      type: "CLEANUP",
    }));

    const { unmount } = renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <FormikFormContent cleanup={cleanup}>Content</FormikFormContent>
      </Formik>,
      { store }
    );

    unmount();

    expect(store.getActions()).toEqual([{ type: "CLEANUP" }]);
  });

  it("can send analytics when saved", () => {
    const eventData = {
      action: "Saved",
      category: "Settings",
      label: "Form",
    };
    const useSendMock = jest.spyOn(hooks, "useSendAnalyticsWhen");

    renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <FormikFormContent
          onSaveAnalytics={eventData}
          saved={true}
          savedRedirect="/success"
        >
          Content
        </FormikFormContent>
      </Formik>,
      { state }
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
          <CompatRouter>
            <Formik
              initialValues={initialValues}
              onSubmit={jest.fn()}
              validationSchema={Schema}
            >
              <FormikFormContent resetOnSave saved={saved}>
                <Field name="val1" />
              </FormikFormContent>
            </Formik>
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const { rerender } = render(<Proxy saved={false} />);
    const textbox = screen.getByRole("textbox");

    await userEvent.clear(textbox);
    await userEvent.type(textbox, "changed");
    expect(textbox).toHaveValue("changed");

    rerender(<Proxy saved={true} />);
    expect(textbox).toHaveValue("initial");
  });

  it("does not reset the form more than once", async () => {
    const store = mockStore(state);
    const initialValues = {
      val1: "initial",
    };
    const Schema = Yup.object().shape({ val1: Yup.string() });
    // Proxy component required to be able to change FormikForm saved prop.
    const Proxy = ({ saved }: { saved: boolean }) => (
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <CompatRouter>
            <Formik
              initialValues={initialValues}
              onSubmit={jest.fn()}
              validationSchema={Schema}
            >
              <FormikFormContent resetOnSave saved={saved}>
                <Field name="val1" />
              </FormikFormContent>
            </Formik>
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const { rerender } = render(<Proxy saved={false} />);
    const textbox = screen.getByRole("textbox");

    await userEvent.clear(textbox);
    await userEvent.type(textbox, "changed");
    expect(textbox).toHaveValue("changed");

    rerender(<Proxy saved={true} />);
    expect(textbox).toHaveValue("initial");

    await userEvent.clear(textbox);
    await userEvent.type(textbox, "changed again");
    rerender(<Proxy saved={true} />);
    expect(textbox).toHaveValue("changed again");
  });

  it("runs onSuccess function if successfully saved with no errors", async () => {
    const onSuccess = jest.fn();
    const store = mockStore(state);
    const Proxy = ({ saved }: { saved: boolean }) => (
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <CompatRouter>
            <Formik initialValues={{}} onSubmit={jest.fn()}>
              <FormikFormContent onSuccess={onSuccess} saved={saved}>
                <Field name="val1" />
              </FormikFormContent>
            </Formik>
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const { rerender } = render(<Proxy saved={false} />);
    expect(onSuccess).not.toHaveBeenCalled();

    rerender(<Proxy saved={true} />);
    expect(onSuccess).toHaveBeenCalled();
  });

  it("does not run onSuccess on first render", async () => {
    const onSuccess = jest.fn();
    renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <FormikFormContent errors={null} onSuccess={onSuccess} saved={true}>
          <Field name="val1" />
        </FormikFormContent>
      </Formik>,
      { state }
    );

    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("does not run onSuccess function if saved but there are errors", async () => {
    const onSuccess = jest.fn();
    const store = mockStore(state);
    const Proxy = ({ errors, saved }: { errors?: string; saved: boolean }) => (
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <CompatRouter>
            <Formik initialValues={{}} onSubmit={jest.fn()}>
              <FormikFormContent
                errors={errors}
                onSuccess={onSuccess}
                saved={saved}
              >
                <Field name="val1" />
              </FormikFormContent>
            </Formik>
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const { rerender } = render(<Proxy errors={undefined} saved={false} />);
    expect(onSuccess).not.toHaveBeenCalled();

    rerender(<Proxy errors="Everything is ruined" saved={true} />);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("does not run onSuccess function more than once", async () => {
    const onSuccess = jest.fn();
    const store = mockStore(state);
    const Proxy = ({
      saved,
      errors,
    }: {
      saved: boolean;
      errors?: string | null;
    }) => (
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <CompatRouter>
            <Formik initialValues={{}} onSubmit={jest.fn()}>
              <FormikFormContent
                errors={errors}
                onSuccess={onSuccess}
                saved={saved}
              >
                <Field name="val1" />
              </FormikFormContent>
            </Formik>
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const { rerender } = render(<Proxy saved={false} />);
    rerender(<Proxy saved={true} />);
    expect(onSuccess).toHaveBeenCalledTimes(1);

    // Cycle the errors so that the success conditions are met again:
    rerender(<Proxy errors="Uh oh" saved={true} />);
    rerender(<Proxy errors={null} saved={true} />);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("can run onSuccess again after resetting the form", async () => {
    const onSuccess = jest.fn();
    const store = mockStore(state);
    const Proxy = ({
      saved,
      errors,
    }: {
      saved: boolean;
      errors?: string | null;
    }) => (
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <CompatRouter>
            <Formik initialValues={{}} onSubmit={jest.fn()}>
              <FormikFormContent
                errors={errors}
                onSuccess={onSuccess}
                resetOnSave
                saved={saved}
              >
                <Field name="val1" />
              </FormikFormContent>
            </Formik>
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const { rerender } = render(<Proxy saved={false} />);

    rerender(<Proxy saved={true} />);
    expect(onSuccess).toHaveBeenCalledTimes(1);

    // Cycle the errors so that the success conditions are met again:
    rerender(<Proxy errors="Uh oh" saved={true} />);
    rerender(<Proxy errors={null} saved={true} />);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("can display a footer", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/", key: "testKey" }]}>
          <CompatRouter>
            <Formik initialValues={{}} onSubmit={jest.fn()}>
              <FormikFormContent
                footer={<div data-testid="footer"></div>}
                onCancel={jest.fn()}
              >
                Content
              </FormikFormContent>
            </Formik>
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });
});
