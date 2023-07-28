import { Formik } from "formik";

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
import {
  renderWithBrowserRouter,
  screen,
  userEvent,
  within,
} from "testing/utils";

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
    renderWithBrowserRouter(
      <Formik
        initialValues={{ existingProject: "", newProject: "" }}
        onSubmit={jest.fn()}
      >
        <SelectProjectFormFields newPodValues={newPodValues} />
      </Formik>,
      { route: "/kvm/add", state }
    );

    const radio = screen.getByRole("radio", {
      name: "Select existing project",
    });
    await userEvent.click(radio);

    expect(screen.getByTestId("existing-project-warning")).toBeInTheDocument();
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

    renderWithBrowserRouter(
      <Formik
        initialValues={{ existingProject: "", newProject: "" }}
        onSubmit={jest.fn()}
      >
        <SelectProjectFormFields newPodValues={newPodValues} />
      </Formik>,
      { route: "/kvm/add", state }
    );

    const radio = screen.getByRole("radio", {
      name: "Select existing project",
    });
    await userEvent.click(radio);

    expect(screen.getByRole("radio", { name: "other" })).toBeChecked();
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
    renderWithBrowserRouter(
      <Formik
        initialValues={{ existingProject: "", newProject: "" }}
        onSubmit={jest.fn()}
      >
        <SelectProjectFormFields newPodValues={newPodValues} />
      </Formik>,
      { route: "/kvm/add", state }
    );

    expect(
      screen.getByRole("radio", { name: "Select existing project" })
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
    renderWithBrowserRouter(
      <Formik
        initialValues={{ existingProject: "", newProject: "" }}
        onSubmit={jest.fn()}
      >
        <SelectProjectFormFields newPodValues={newPodValues} />
      </Formik>,
      { route: "/kvm/add", state }
    );

    const radio = screen.getByRole("radio", {
      name: "Select existing project",
    });
    await userEvent.click(radio);

    expect(screen.getByTestId("existing-pod")).toBeInTheDocument();
    expect(
      within(screen.getByTestId("existing-pod")).getByRole("link")
    ).toHaveAttribute("href", urls.kvm.lxd.single.index({ id: pod.id }));
  });
});
