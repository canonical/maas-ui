import { waitFor, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik } from "formik";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import type { NewPodValues } from "../../types";

import SelectProjectFormFields from "./SelectProjectFormFields";

import urls from "app/base/urls";
import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";
import {
  pod as podFactory,
  podPowerParameters as powerParametersFactory,
  podProject as podProjectFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen } from "testing/utils";

const mockStore = configureStore();

describe("SelectProjectFormFields", () => {
  let state: RootState;
  let newPodValues: NewPodValues;

  beforeEach(() => {
    state = rootStateFactory({
      pod: podStateFactory({
        loaded: true,
      }),
    });
    newPodValues = {
      certificate: "certificate",
      key: "key",
      name: "pod-name",
      password: "password",
      pool: "0",
      power_address: "192.168.1.1",
      zone: "0",
    };
  });

  it("shows a warning if an existing project is selected", async () => {
    const project = podProjectFactory();
    state.pod.projects = {
      "192.168.1.1": [project],
    };
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <Formik
          initialValues={{ existingProject: "", newProject: "" }}
          onSubmit={jest.fn()}
        >
          <SelectProjectFormFields newPodValues={newPodValues} />
        </Formik>
      </Provider>,
      { route: "/kvm/add" }
    );

    const radio = screen.getByRole("radio", { name: "Existing project" });
    userEvent.click(radio);

    await waitFor(() =>
      expect(screen.getByTestId("existing-project-warning")).toBeInTheDocument()
    );
    expect(screen.getByTestId("existing-project-warning")).toHaveTextContent(
      "MAAS will recommission all VMs in the selected project."
    );
  });

  it("selects the first available project when switching to existing projects", async () => {
    state.pod = podStateFactory({
      items: [
        podFactory({
          power_parameters: powerParametersFactory({
            power_address: "192.168.1.1",
            project: "default",
          }),
          type: PodType.LXD,
        }),
      ],
      loaded: true,
      projects: {
        "192.168.1.1": [
          podProjectFactory({ name: "default" }), // default is in use
          podProjectFactory({ name: "other" }), // other is not
        ],
      },
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <Formik
          initialValues={{ existingProject: "", newProject: "" }}
          onSubmit={jest.fn()}
        >
          <SelectProjectFormFields newPodValues={newPodValues} />
        </Formik>
      </Provider>,
      { route: "/kvm/add" }
    );

    const radio = screen.getByRole("radio", { name: "Existing project" });
    userEvent.click(radio);

    await waitFor(() =>
      expect(screen.getByRole("radio", { name: "other" })).toBeChecked()
    );
    expect(screen.getByRole("radio", { name: "default" })).toBeDisabled();
    expect(screen.getByRole("radio", { name: "other" })).toBeEnabled();
  });

  it("disables the existing project radio button if no existing projects are free", async () => {
    state.pod = podStateFactory({
      items: [
        podFactory({
          power_parameters: powerParametersFactory({
            power_address: "192.168.1.1",
            project: "default",
          }),
          type: PodType.LXD,
        }),
        podFactory({
          power_parameters: powerParametersFactory({
            power_address: "192.168.1.1",
            project: "other",
          }),
          type: PodType.LXD,
        }),
      ],
      loaded: true,
      projects: {
        "192.168.1.1": [
          podProjectFactory({ name: "default" }),
          podProjectFactory({ name: "other" }),
        ],
      },
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <Formik
          initialValues={{ existingProject: "", newProject: "" }}
          onSubmit={jest.fn()}
        >
          <SelectProjectFormFields newPodValues={newPodValues} />
        </Formik>
      </Provider>,
      { route: "/kvm/add" }
    );

    expect(
      screen.getByRole("radio", { name: "Existing project" })
    ).toBeDisabled();
  });

  it("disables radio and shows a link to an existing LXD project", async () => {
    const pod = podFactory({
      power_parameters: powerParametersFactory({
        power_address: "192.168.1.1",
        project: "default",
      }),
      type: PodType.LXD,
    });
    state.pod = podStateFactory({
      items: [pod],
      loaded: true,
      projects: {
        "192.168.1.1": [
          podProjectFactory({ name: "default" }),
          podProjectFactory({ name: "other" }),
        ],
      },
    });
    const store = mockStore(state);
    renderWithBrowserRouter(
      <Provider store={store}>
        <Formik
          initialValues={{ existingProject: "", newProject: "" }}
          onSubmit={jest.fn()}
        >
          <SelectProjectFormFields newPodValues={newPodValues} />
        </Formik>
      </Provider>,
      { route: "/kvm/add" }
    );

    const radio = screen.getByRole("radio", { name: "Existing project" });
    userEvent.click(radio);

    await waitFor(() =>
      expect(screen.getByTestId("existing-pod")).toBeInTheDocument()
    );
    expect(screen.getByTestId("existing-pod")).toHaveTextContent(
      urls.kvm.lxd.single.index({ id: pod.id })
    );
  });
});
