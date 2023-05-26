import NodeNameFields from "./NodeNameFields";

import FormikForm from "app/base/components/FormikForm";
import type { RootState } from "app/store/root/types";
import {
  domainState as domainStateFactory,
  machineDetails as machineDetailsFactory,
  machineState as machineStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

describe("NodeNameFields", () => {
  let state: RootState;
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
    renderWithBrowserRouter(
      <FormikForm
        initialValues={{
          domain: "",
          hostname: "",
        }}
        onSubmit={jest.fn()}
      >
        <NodeNameFields setHostnameError={jest.fn()} />
      </FormikForm>,
      {
        route: "/machine/abc123",
        state,
      }
    );
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("displays the fields", () => {
    renderWithBrowserRouter(
      <FormikForm
        initialValues={{
          domain: "",
          hostname: "",
        }}
        onSubmit={jest.fn()}
      >
        <NodeNameFields canEditHostname setHostnameError={jest.fn()} />
      </FormikForm>,
      { route: "/machine/abc123", state }
    );

    expect(
      screen.getByRole("textbox", { name: "Hostname" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "Domain" })
    ).toBeInTheDocument();
  });

  it("disables fields when saving", () => {
    renderWithBrowserRouter(
      <FormikForm
        initialValues={{
          domain: "",
          hostname: "",
        }}
        onSubmit={jest.fn()}
      >
        <NodeNameFields canEditHostname saving setHostnameError={jest.fn()} />
      </FormikForm>,
      { route: "/machine/abc123", state }
    );
    expect(screen.getByRole("textbox", { name: "Hostname" })).toBeDisabled();
    expect(screen.getByRole("combobox", { name: "Domain" })).toBeDisabled();
  });

  it("updates the hostname errors if they exist", () => {
    const setHostnameError = jest.fn();
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
      { route: "/machine/abc123", state }
    );
    expect(setHostnameError).toHaveBeenCalledWith("Uh oh!");
  });
});
