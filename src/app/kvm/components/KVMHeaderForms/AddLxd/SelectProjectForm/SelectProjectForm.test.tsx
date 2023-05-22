import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AddLxdSteps } from "../AddLxd";

import { SelectProjectForm } from "./SelectProjectForm";

import { actions as podActions } from "app/store/pod";
import { PodType } from "app/store/pod/constants";
import {
  podProject as podProjectFactory,
  podState as podStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import { render, screen, submitFormikForm } from "testing/utils";

describe("SelectProjectForm", () => {
  let state;
  let newPodValues;

  beforeEach(() => {
    state = rootStateFactory({
      pod: podStateFactory({
        loaded: true,
      }),
      resourcepool: resourcePoolStateFactory({
        items: [resourcePoolFactory()],
        loaded: true,
      }),
      zone: zoneStateFactory({
        items: [zoneFactory()],
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

  it("shows the LXD host details", () => {
    const project = podProjectFactory();
    state.pod.projects = {
      "192.168.1.1": [project],
    };
    const { container } = render(
      <SelectProjectForm
        clearSidePanelContent={jest.fn()}
        newPodValues={newPodValues}
        setStep={jest.fn()}
        setSubmissionErrors={jest.fn()}
      />,
      { route: "/kvm/add", store: state }
    );

    expect(container).toHaveTextContent("LXD host: pod-name (192.168.1.1)");
  });

  it("shows an error if attempting to add a project name that already exists", async () => {
    const project = podProjectFactory({ name: "foo" });
    state.pod.projects = {
      "192.168.1.1": [project],
    };
    const { container } = render(
      <SelectProjectForm
        clearSidePanelContent={jest.fn()}
        newPodValues={newPodValues}
        setStep={jest.fn()}
        setSubmissionErrors={jest.fn()}
      />,
      { route: "/kvm/add", store: state }
    );

    const nameInput = screen.getByRole("textbox", {
      name: /Name your project/i,
    });
    userEvent.clear(nameInput);
    userEvent.type(nameInput, "foo");
    await waitFor(() =>
      expect(
        screen.queryByText("Error: A project with this name already exists.")
      ).toBeInTheDocument()
    );
  });

  it("can handle creating a LXD KVM with a new project", async () => {
    const project = podProjectFactory({ name: "foo" });
    state.pod.projects = {
      "192.168.1.1": [project],
    };
    const { container, store } = render(
      <SelectProjectForm
        clearSidePanelContent={jest.fn()}
        newPodValues={newPodValues}
        setStep={jest.fn()}
        setSubmissionErrors={jest.fn()}
      />,
      { route: "/kvm/add", store: state }
    );

    submitFormikForm(container, {
      existingProject: "",
      newProject: "new-project",
    });

    const expectedAction = podActions.create({
      certificate: "certificate",
      key: "key",
      name: "pod-name",
      password: "password",
      pool: 0,
      power_address: "192.168.1.1",
      project: "new-project",
      type: PodType.LXD,
      zone: 0,
    });
    const actualAction = store
      .getActions()
      .find((action) => action.type === "pod/create");
    expect(actualAction).toStrictEqual(expectedAction);
  });

  it("can handle saving a LXD KVM with an existing project", async () => {
    const project = podProjectFactory({ name: "foo" });
    state.pod.projects = {
      "192.168.1.1": [project],
    };
    const { container, store } = render(
      <SelectProjectForm
        clearSidePanelContent={jest.fn()}
        newPodValues={newPodValues}
        setStep={jest.fn()}
        setSubmissionErrors={jest.fn()}
      />,
      { route: "/kvm/add", store: state }
    );

    submitFormikForm(container, {
      existingProject: "existing-project",
      newProject: "",
    });

    const expectedAction = podActions.create({
      certificate: "certificate",
      key: "key",
      name: "pod-name",
      password: "password",
      pool: 0,
      power_address: "192.168.1.1",
      project: "existing-project",
      type: PodType.LXD,
      zone: 0,
    });
    const actualAction = store
      .getActions()
      .find((action) => action.type === "pod/create");
    expect(actualAction).toStrictEqual(expectedAction);
  });

  it("reverts back to credentials step if attempt to create pod results in error", async () => {
    const setStep = jest.fn();
    const setSubmissionErrors = jest.fn();
    state.pod.errors = "it didn't work";
    const { container } = render(
      <SelectProjectForm
        clearSidePanelContent={jest.fn()}
        newPodValues={newPodValues}
        setStep={setStep}
        setSubmissionErrors={setSubmissionErrors}
      />,
      { route: "/kvm/add", store: state }
    );

    await waitFor(() =>
      expect(setStep).toHaveBeenCalledWith(AddLxdSteps.CREDENTIALS)
    );
    expect(setSubmissionErrors).toHaveBeenCalledWith("it didn't work");
  });
});
