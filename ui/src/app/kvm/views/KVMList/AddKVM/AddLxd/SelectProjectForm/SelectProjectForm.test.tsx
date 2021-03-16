import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import type { AuthenticateFormValues } from "../AddLxd";

import SelectProjectForm from "./SelectProjectForm";

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
import { waitForComponentToPaint } from "testing/utils";

const mockStore = configureStore();

describe("SelectProjectForm", () => {
  let state: RootState;
  let authValues: AuthenticateFormValues;

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
    authValues = {
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
          <SelectProjectForm authValues={authValues} />
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
          <SelectProjectForm authValues={authValues} />
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
          <SelectProjectForm authValues={authValues} />
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
          <SelectProjectForm authValues={authValues} />
        </MemoryRouter>
      </Provider>
    );

    act(() => {
      wrapper.find("Formik").prop("onSubmit")({
        existingProject: "",
        newProject: "new-project",
      });
    });
    wrapper.update();

    expect(
      store.getActions().find((action) => action.type === "pod/create")
    ).toStrictEqual({
      type: "pod/create",
      meta: {
        method: "create",
        model: "pod",
      },
      payload: {
        params: {
          name: "pod-name",
          pool: 0,
          power_address: "192.168.1.1",
          password: "password",
          project: "new-project",
          type: "lxd",
          zone: 0,
        },
      },
    });
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
          <SelectProjectForm authValues={authValues} />
        </MemoryRouter>
      </Provider>
    );

    act(() => {
      wrapper.find("Formik").prop("onSubmit")({
        existingProject: "existing-project",
        newProject: "",
      });
    });
    wrapper.update();

    expect(
      store.getActions().find((action) => action.type === "pod/create")
    ).toStrictEqual({
      type: "pod/create",
      meta: {
        method: "create",
        model: "pod",
      },
      payload: {
        params: {
          name: "pod-name",
          pool: 0,
          power_address: "192.168.1.1",
          password: "password",
          project: "existing-project",
          type: "lxd",
          zone: 0,
        },
      },
    });
  });
});
