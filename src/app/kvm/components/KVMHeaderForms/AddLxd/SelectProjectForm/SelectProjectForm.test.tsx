import configureStore from "redux-mock-store";

import { AddLxdSteps } from "../AddLxd";
import type { NewPodValues } from "../types";

import SelectProjectForm from "./SelectProjectForm";

import { actions as podActions } from "app/store/pod";
import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";
import {
  podProject as podProjectFactory,
  podState as podStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import {
  renderWithBrowserRouter,
  screen,
  userEvent,
  fireEvent,
} from "testing/utils";

const mockStore = configureStore<RootState>();

describe("SelectProjectForm", () => {
  let state: RootState;
  let newPodValues: NewPodValues;

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
    renderWithBrowserRouter(
      <SelectProjectForm
        clearSidePanelContent={jest.fn()}
        newPodValues={newPodValues}
        setStep={jest.fn()}
        setSubmissionErrors={jest.fn()}
      />,
      { route: "/kvm/add", state }
    );

    expect(screen.getByTestId("lxd-host-details")).toHaveTextContent(
      "LXD host: pod-name (192.168.1.1)"
    );
  });

  it("shows an error if attempting to add a project name that already exists", async () => {
    const project = podProjectFactory({ name: "foo" });
    state.pod.projects = {
      "192.168.1.1": [project],
    };
    renderWithBrowserRouter(
      <SelectProjectForm
        clearSidePanelContent={jest.fn()}
        newPodValues={newPodValues}
        setStep={jest.fn()}
        setSubmissionErrors={jest.fn()}
      />,
      { route: "/kvm/add", state }
    );

    const nameInput = screen.getByRole("textbox", {
      name: /New project name/i,
    });
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "foo");
    fireEvent.blur(nameInput);
    expect(
      screen.getByText("A project with this name already exists.")
    ).toBeInTheDocument();
  });

  it("can handle creating a LXD KVM with a new project", async () => {
    const project = podProjectFactory({ name: "foo" });
    state.pod.projects = {
      "192.168.1.1": [project],
    };
    const store = mockStore(state);

    renderWithBrowserRouter(
      <SelectProjectForm
        clearSidePanelContent={jest.fn()}
        newPodValues={newPodValues}
        setStep={jest.fn()}
        setSubmissionErrors={jest.fn()}
      />,
      { route: "/kvm/add", store }
    );

    const nameInput = screen.getByRole("textbox", {
      name: /New project name/i,
    });
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "new-project");

    await userEvent.click(
      screen.getByRole("button", { name: "Save LXD host" })
    );

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
    const project = podProjectFactory({ name: "existing-project" });
    state.pod.projects = {
      "192.168.1.1": [project],
    };
    const store = mockStore(state);

    renderWithBrowserRouter(
      <SelectProjectForm
        clearSidePanelContent={jest.fn()}
        newPodValues={newPodValues}
        setStep={jest.fn()}
        setSubmissionErrors={jest.fn()}
      />,
      { route: "/kvm/add", store }
    );

    await userEvent.click(
      screen.getByRole("radio", { name: "Select existing project" })
    );
    await userEvent.click(
      screen.getByRole("radio", { name: "existing-project" })
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Save LXD host" })
    );

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

  it("reverts back to credentials step if attempt to create pod results in error", () => {
    const setStep = jest.fn();
    const setSubmissionErrors = jest.fn();
    state.pod.errors = "it didn't work";
    renderWithBrowserRouter(
      <SelectProjectForm
        clearSidePanelContent={jest.fn()}
        newPodValues={newPodValues}
        setStep={setStep}
        setSubmissionErrors={setSubmissionErrors}
      />,
      { route: "/kvm/add", state }
    );

    expect(setStep).toHaveBeenCalledWith(AddLxdSteps.CREDENTIALS);
    expect(setSubmissionErrors).toHaveBeenCalledWith("it didn't work");
  });
});
