import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { AddLxdSteps } from "../AddLxd";
import type { NewPodValues } from "../types";

import AuthenticationForm from "./AuthenticationForm";

import * as baseHooks from "app/base/hooks";
import { actions as podActions } from "app/store/pod";
import { PodType } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import {
  podState as podStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

jest.mock("app/base/hooks", () => {
  const hooks = jest.requireActual("app/base/hooks");
  return {
    ...hooks,
    useCycled: jest.fn(),
  };
});

describe("AuthenticationForm", () => {
  let state: RootState;
  let newPodValues: NewPodValues;
  let useCycledMock: jest.SpyInstance;

  beforeEach(() => {
    useCycledMock = jest
      .spyOn(baseHooks, "useCycled")
      .mockImplementation(() => [false, () => null]);
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
      certificate: "",
      key: "",
      name: "my-favourite-kvm",
      password: "",
      pool: "0",
      power_address: "192.168.1.1",
      zone: "0",
    };
  });

  it(`shows a spinner if authenticating with a certificate and no projects exist
    for that LXD address`, () => {
    state.pod.projects = {
      "192.168.1.1": [],
    };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/add", key: "testKey" }]}
        >
          <AuthenticationForm
            clearHeaderContent={jest.fn()}
            newPodValues={newPodValues}
            setNewPodValues={jest.fn()}
            setStep={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    // Trusting via certificate is selected by default, so spinner should show
    // with no changes.
    expect(
      wrapper.find("[data-test='trust-confirmation-spinner']").exists()
    ).toBe(true);

    wrapper.find("input[id='use-password']").simulate("change");
    expect(
      wrapper.find("[data-test='trust-confirmation-spinner']").exists()
    ).toBe(false);
  });

  it("can handle fetching projects using a password", () => {
    const setNewPodValues = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/add", key: "testKey" }]}
        >
          <AuthenticationForm
            clearHeaderContent={jest.fn()}
            newPodValues={newPodValues}
            setNewPodValues={setNewPodValues}
            setStep={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    // Change to trusting via password and submit the form.
    wrapper.find("input[id='use-password']").simulate("change");
    submitFormikForm(wrapper, {
      password: "password",
    });
    wrapper.update();

    const expectedAction = podActions.getProjects({
      password: "password",
      power_address: "192.168.1.1",
      type: PodType.LXD,
    });
    const actualAction = store
      .getActions()
      .find((action) => action.type === "pod/getProjects");
    expect(setNewPodValues).toHaveBeenCalledWith({
      ...newPodValues,
      password: "password",
    });
    expect(actualAction).toStrictEqual(expectedAction);
  });

  it(`reverts back to credentials step if attempt to fetch projects using a
    password results in error`, () => {
    // Mock usingPassword cycling from true to false, which tells us that the
    // user has tried to fetch projects using a password.
    useCycledMock.mockImplementationOnce(() => [true, () => null]);
    const setStep = jest.fn();
    state.pod.errors = "it didn't work";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/add", key: "testKey" }]}
        >
          <AuthenticationForm
            clearHeaderContent={jest.fn()}
            newPodValues={newPodValues}
            setNewPodValues={jest.fn()}
            setStep={setStep}
          />
        </MemoryRouter>
      </Provider>
    );
    submitFormikForm(wrapper, {
      password: "password",
    });
    wrapper.update();

    expect(setStep).toHaveBeenCalledWith(AddLxdSteps.CREDENTIALS);
  });
});
