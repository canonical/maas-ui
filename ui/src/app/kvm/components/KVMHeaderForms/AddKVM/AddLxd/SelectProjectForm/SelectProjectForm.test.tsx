import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { AddLxdSteps } from "../AddLxd";
import type { NewPodValues } from "../types";

import SelectProjectForm from "./SelectProjectForm";

import { actions as podActions } from "app/store/pod";
import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";
import {
  pod as podFactory,
  podProject as podProjectFactory,
  podState as podStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import { submitFormikForm, waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

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

  it("shows the LXD host details", () => {
    const project = podProjectFactory();
    state.pod.projects = {
      "192.168.1.1": [project],
    };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/add", key: "testKey" }]}
        >
          <SelectProjectForm
            clearHeaderContent={jest.fn()}
            newPodValues={newPodValues}
            setStep={jest.fn()}
            setSubmissionErrors={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("[data-test='lxd-host-details']").text()).toBe(
      "LXD host: pod-name (192.168.1.1)"
    );
  });

  it("shows an error if attempting to add a project name that already exists", async () => {
    const project = podProjectFactory({ name: "foo" });
    state.pod.projects = {
      "192.168.1.1": [project],
    };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/add", key: "testKey" }]}
        >
          <SelectProjectForm
            clearHeaderContent={jest.fn()}
            newPodValues={newPodValues}
            setStep={jest.fn()}
            setSubmissionErrors={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    wrapper.find("input[name='newProject']").simulate("change", {
      target: { name: "newProject", value: "foo" },
    });
    wrapper.find("input[name='newProject']").simulate("blur");
    await waitForComponentToPaint(wrapper);

    expect(
      wrapper
        .find("FormikField[name='newProject'] .p-form-validation__message")
        .text()
    ).toBe("Error: A project with this name already exists.");
  });

  it("redirects to the KVM details page of a newly created KVM", async () => {
    state.pod.saved = true;
    state.pod.items = [podFactory({ id: 111, name: "pod-name" })];
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/add", key: "testKey" }]}
        >
          <SelectProjectForm
            clearHeaderContent={jest.fn()}
            newPodValues={newPodValues}
            setStep={jest.fn()}
            setSubmissionErrors={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("Redirect").exists()).toBe(true);
    expect(wrapper.find("Redirect").prop("to")).toBe("/kvm/111");
  });

  it("can handle creating a LXD KVM with a new project", async () => {
    const project = podProjectFactory({ name: "foo" });
    state.pod.projects = {
      "192.168.1.1": [project],
    };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/add", key: "testKey" }]}
        >
          <SelectProjectForm
            clearHeaderContent={jest.fn()}
            newPodValues={newPodValues}
            setStep={jest.fn()}
            setSubmissionErrors={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    submitFormikForm(wrapper, {
      existingProject: "",
      newProject: "new-project",
    });
    wrapper.update();

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
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/add", key: "testKey" }]}
        >
          <SelectProjectForm
            clearHeaderContent={jest.fn()}
            newPodValues={newPodValues}
            setStep={jest.fn()}
            setSubmissionErrors={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    submitFormikForm(wrapper, {
      existingProject: "existing-project",
      newProject: "",
    });
    wrapper.update();

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
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/add", key: "testKey" }]}
        >
          <SelectProjectForm
            clearHeaderContent={jest.fn()}
            newPodValues={newPodValues}
            setStep={setStep}
            setSubmissionErrors={setSubmissionErrors}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(setStep).toHaveBeenCalledWith(AddLxdSteps.CREDENTIALS);
    expect(setSubmissionErrors).toHaveBeenCalledWith("it didn't work");
  });
});
