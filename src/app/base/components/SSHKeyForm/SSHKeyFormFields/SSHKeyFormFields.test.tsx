import { Formik } from "formik";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import SSHKeyFormFields from "./SSHKeyFormFields";

import {
  sshKeyState as sshKeyStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

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
    renderWithBrowserRouter(
      <Provider store={store}>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <SSHKeyFormFields />
        </Formik>
      </Provider>,
      { route: "/" }
    );
    expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
  });

  it("can show id field", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <SSHKeyFormFields />
        </Formik>
      </Provider>,
      { route: "/" }
    );
    const protocol = screen.getByLabelText(/protocol/i);
    await act(async () => {
      await protocol.setSelectionRange(1, 2); //make sure it is not the default
    });
    expect(screen.getByLabelText(/ID/i)).toBeInTheDocument();
  });

  it("can show key field", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <SSHKeyFormFields />
        </Formik>
      </Provider>,
      { route: "/" }
    );
    const protocol = screen.getByLabelText(/protocol/i);
    await act(async () => {
      await protocol.setSelectionRange(1, 2); //make sure it is not the default
    });
    expect(screen.getByLabelText(/Key/i)).toBeInTheDocument();
  });
});
