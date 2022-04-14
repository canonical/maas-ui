import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { AddLxdSteps } from "../AddLxd";
import type { NewPodValues } from "../types";

import AuthenticationForm from "./AuthenticationForm";

import FormikFormContent from "app/base/components/FormikFormContent";
import { actions as generalActions } from "app/store/general";
import { actions as podActions } from "app/store/pod";
import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";
import {
  generalState as generalStateFactory,
  generatedCertificate as generatedCertificateFactory,
  generatedCertificateState as generatedCertificateStateFactory,
  podProject as podProjectFactory,
  podState as podStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("AuthenticationForm", () => {
  let state: RootState;
  let newPodValues: NewPodValues;

  beforeEach(() => {
    state = rootStateFactory({
      general: generalStateFactory({
        generatedCertificate: generatedCertificateStateFactory({
          data: null,
        }),
      }),
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
    // after submitting the form.
    expect(
      wrapper.find("[data-testid='trust-confirmation-spinner']").exists()
    ).toBe(false);

    submitFormikForm(wrapper, { password: "" });
    wrapper.update();
    expect(
      wrapper.find("[data-testid='trust-confirmation-spinner']").exists()
    ).toBe(true);
  });

  it("dispatches an action to poll LXD server if authenticating via certificate", () => {
    const setNewPodValues = jest.fn();
    const generatedCert = generatedCertificateFactory({
      CN: "my-favourite-kvm@host",
    });
    state.general.generatedCertificate.data = generatedCert;
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
    submitFormikForm(wrapper, { password: "" });
    wrapper.update();

    const expectedAction = podActions.pollLxdServer({
      certificate: generatedCert.certificate,
      key: generatedCert.private_key,
      power_address: "192.168.1.1",
    });
    const actualAction = store
      .getActions()
      .find((action) => action.type === "pod/pollLxdServer");
    expect(setNewPodValues).toHaveBeenCalledWith({
      ...newPodValues,
      certificate: generatedCert.certificate,
      key: generatedCert.private_key,
    });
    expect(actualAction).toStrictEqual(expectedAction);
  });

  it("dispatches an action to fetch projects if using a password", () => {
    const setNewPodValues = jest.fn();
    const generatedCert = generatedCertificateFactory({
      CN: "my-favourite-kvm@host",
    });
    state.general.generatedCertificate.data = generatedCert;
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
      certificate: generatedCert.certificate,
      key: generatedCert.private_key,
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
    // Change to trusting via password and submit the form.
    wrapper.find("input[id='use-password']").simulate("change");
    submitFormikForm(wrapper, {
      password: "password",
    });
    wrapper.update();

    expect(setStep).toHaveBeenCalledWith(AddLxdSteps.CREDENTIALS);
  });

  it("displays errors when it failed to trust the cert", () => {
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
    submitFormikForm(wrapper);
    wrapper.update();
    expect(wrapper.find(FormikFormContent).prop("errors")).toBe(
      "it didn't work"
    );
    // It should not have reverted to the previous screen.
    expect(setStep).not.toHaveBeenCalledWith(AddLxdSteps.CREDENTIALS);
  });

  it("does not display errors when attempting to trust the cert", () => {
    const setStep = jest.fn();
    state.pod.errors = "Certificate is not trusted and no password was given";
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
    submitFormikForm(wrapper);
    wrapper.update();
    expect(wrapper.find(FormikFormContent).prop("errors")).toBe(null);
    // It should not have reverted to the previous screen.
    expect(setStep).not.toHaveBeenCalledWith(AddLxdSteps.CREDENTIALS);
  });

  it("moves to the project select step if projects exist for given LXD address", () => {
    const setStep = jest.fn();
    state.pod.projects = {
      "192.168.1.1": [podProjectFactory()],
    };
    const store = mockStore(state);
    mount(
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

    expect(setStep).toHaveBeenCalledWith(AddLxdSteps.SELECT_PROJECT);
  });

  it("clears certificate and stops polling LXD server on unmount", () => {
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
    wrapper.unmount();

    const expectedActions = [
      generalActions.clearGeneratedCertificate(),
      podActions.pollLxdServerStop(),
    ];
    const actualActions = store.getActions();
    expect(
      actualActions.every((actualAction) =>
        expectedActions.some(
          (expectedAction) => expectedAction.type === actualAction.type
        )
      )
    );
  });
});
