import { render } from "@testing-library/react";
import configureStore from "redux-mock-store";

import NodeNameFields from "./NodeNameFields";

import FormikForm from "app/base/components/FormikForm";
import {
  domainState as domainStateFactory,
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

describe("NodeNameFields", () => {
  let state;
  beforeEach(() => {
    state = rootStateFactory({
      domain: domainStateFactory({
        loaded: true,
      }),
      machine: machineStateFactory({
        loaded: true,
        items: [
          machineDetailsFactory({
            locked: false,
            permissions: ["edit"],
            system_id: "abc123",
          }),
        ],
      }),
    });
  });

  it("displays a spinner when loading domains", () => {
    state.domain.loaded = false;
    const store = mockStore(state);
    const { getByText } = renderWithBrowserRouter(
      <NodeNameFields setHostnameError={jest.fn()} />,
      { route: "/machine/abc123", store }
    );
    expect(getByText(/Loading/i)).toBeInTheDocument();
  });

  it("displays the fields", () => {
    const store = mockStore(state);
    const { container } = renderWithBrowserRouter(
      <FormikForm
        initialValues={{
          domain: "",
          hostname: "",
        }}
        onSubmit={jest.fn()}
      >
        <NodeNameFields canEditHostname setHostnameError={jest.fn()} />
      </FormikForm>,
      { route: "/machine/abc123", store }
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("disables fields when saving", () => {
    const store = mockStore(state);
    const { getByLabelText } = renderWithBrowserRouter(
      <FormikForm
        initialValues={{
          domain: "",
          hostname: "",
        }}
        onSubmit={jest.fn()}
      >
        <NodeNameFields canEditHostname saving setHostnameError={jest.fn()} />
      </FormikForm>,
      { route: "/machine/abc123", store }
    );
    expect(getByLabelText(/hostname/i)).toBeDisabled();
  });

  it("updates the hostname errors if they exist", () => {
    const setHostnameError = jest.fn();
    const store = mockStore(state);
    renderWithBrowserRouter(
      <FormikForm
        initialErrors={{ hostname: "Uh oh!" }}
        initialValues={{
          domain: "",
          hostname: "",
        }}
        onSubmit={jest.fn()}
      >
        <NodeNameFields
          canEditHostname
          saving
          setHostnameError={setHostnameError}
        />
      </FormikForm>,
      { route: "/machine/abc123", store }
    );
    expect(setHostnameError).toHaveBeenCalledWith("Uh oh!");
  });
});
