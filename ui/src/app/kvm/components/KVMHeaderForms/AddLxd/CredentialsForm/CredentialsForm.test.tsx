import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import { AddLxdSteps } from "../AddLxd";
import type { NewPodValues } from "../types";

import CredentialsForm from "./CredentialsForm";

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

describe("CredentialsForm", () => {
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
      name: "",
      password: "",
      pool: "",
      power_address: "",
      zone: "",
    };
  });

  it("dispatches an action to generate certificate if not providing certificate and key", () => {
    const setNewPodValues = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/add", key: "testKey" }]}
        >
          <CredentialsForm
            clearHeaderContent={jest.fn()}
            newPodValues={newPodValues}
            setNewPodValues={setNewPodValues}
            setStep={jest.fn()}
            setSubmissionErrors={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    // Radio should be set to generate certificate by default.
    submitFormikForm(wrapper, {
      certificate: "",
      key: "",
      name: "my-favourite-kvm",
      pool: "0",
      power_address: "192.168.1.1",
      zone: "0",
    });
    wrapper.update();

    expect(setNewPodValues).toHaveBeenCalledWith({
      certificate: "",
      key: "",
      name: "my-favourite-kvm",
      password: "",
      pool: "0",
      power_address: "192.168.1.1",
      zone: "0",
    });

    const expectedAction = generalActions.generateCertificate({
      object_name: "my-favourite-kvm",
    });
    const actualActions = store.getActions();
    expect(
      actualActions.find(
        (action) => action.type === "general/generateCertificate"
      )
    ).toStrictEqual(expectedAction);
    expect(
      actualActions.find((action) => action.type === "pod/getProjects")
    ).toBeUndefined();
  });

  it("dispatches an action to fetch projects if providing certificate and key", () => {
    const setNewPodValues = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/add", key: "testKey" }]}
        >
          <CredentialsForm
            clearHeaderContent={jest.fn()}
            newPodValues={newPodValues}
            setNewPodValues={setNewPodValues}
            setStep={jest.fn()}
            setSubmissionErrors={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    // Change radio to provide certificate instead of generating one.
    wrapper.find("input[id='provide-certificate']").simulate("change");
    submitFormikForm(wrapper, {
      certificate: "certificate",
      key: "key",
      name: "my-favourite-kvm",
      pool: "0",
      power_address: "192.168.1.1",
      zone: "0",
    });
    wrapper.update();

    expect(setNewPodValues).toHaveBeenCalledWith({
      certificate: "certificate",
      key: "key",
      name: "my-favourite-kvm",
      password: "",
      pool: "0",
      power_address: "192.168.1.1",
      zone: "0",
    });
    const expectedAction = podActions.getProjects({
      certificate: "certificate",
      key: "key",
      power_address: "192.168.1.1",
      type: PodType.LXD,
    });
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === "pod/getProjects")
    ).toStrictEqual(expectedAction);
    expect(
      actualActions.find(
        (action) => action.type === "general/generateCertificate"
      )
    ).toBeUndefined();
  });

  it("moves to the authentication step if certificate successfully generated", () => {
    const setStep = jest.fn();
    state.general.generatedCertificate.data = generatedCertificateFactory({
      CN: "my-favourite-kvm@host",
    });
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/add", key: "testKey" }]}
        >
          <CredentialsForm
            clearHeaderContent={jest.fn()}
            newPodValues={{
              certificate: "",
              key: "",
              name: "my-favourite-kvm",
              password: "",
              pool: "0",
              power_address: "192.168.1.1",
              zone: "0",
            }}
            setNewPodValues={jest.fn()}
            setStep={setStep}
            setSubmissionErrors={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(setStep).toHaveBeenCalledWith(AddLxdSteps.AUTHENTICATION);
  });

  it(`does not move to the authentication step if certificate successfully
      generated but errors are present`, () => {
    const setStep = jest.fn();
    state.general.generatedCertificate.data = generatedCertificateFactory({
      CN: "my-favourite-kvm@host",
    });
    state.pod.errors = "Failed to connect to LXD.";
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/add", key: "testKey" }]}
        >
          <CredentialsForm
            clearHeaderContent={jest.fn()}
            newPodValues={{
              certificate: "",
              key: "",
              name: "my-favourite-kvm",
              password: "",
              pool: "0",
              power_address: "192.168.1.1",
              zone: "0",
            }}
            setNewPodValues={jest.fn()}
            setStep={setStep}
            setSubmissionErrors={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(setStep).not.toHaveBeenCalled();
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
          <CredentialsForm
            clearHeaderContent={jest.fn()}
            newPodValues={{
              certificate: "certificate",
              key: "key",
              name: "my-favourite-kvm",
              password: "",
              pool: "0",
              power_address: "192.168.1.1",
              zone: "0",
            }}
            setNewPodValues={jest.fn()}
            setStep={setStep}
            setSubmissionErrors={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(setStep).toHaveBeenCalledWith(AddLxdSteps.SELECT_PROJECT);
  });

  it(`does not move to the project select step if projects exist for given LXD
      address but pod errors are present`, () => {
    const setStep = jest.fn();
    state.pod.projects = {
      "192.168.1.1": [podProjectFactory()],
    };
    state.pod.errors = "Failed to fetch projects.";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/add", key: "testKey" }]}
        >
          <CredentialsForm
            clearHeaderContent={jest.fn()}
            newPodValues={{
              certificate: "certificate",
              key: "key",
              name: "my-favourite-kvm",
              password: "",
              pool: "0",
              power_address: "192.168.1.1",
              zone: "0",
            }}
            setNewPodValues={jest.fn()}
            setStep={setStep}
            setSubmissionErrors={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(setStep).not.toHaveBeenCalled();
    expect(wrapper.find(FormikFormContent).prop("errors")).toBe(
      "Failed to fetch projects."
    );
  });

  it("displays errors if generating a cert failed", () => {
    const setStep = jest.fn();
    state.pod.projects = {
      "192.168.1.1": [podProjectFactory()],
    };
    state.general = generalStateFactory({
      generatedCertificate: generatedCertificateStateFactory({
        errors: "name too long",
      }),
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/add", key: "testKey" }]}
        >
          <CredentialsForm
            clearHeaderContent={jest.fn()}
            newPodValues={{
              certificate: "certificate",
              key: "key",
              name: "my-favourite-kvm",
              password: "",
              pool: "0",
              power_address: "192.168.1.1",
              zone: "0",
            }}
            setNewPodValues={jest.fn()}
            setStep={setStep}
            setSubmissionErrors={jest.fn()}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(setStep).not.toHaveBeenCalled();
    expect(wrapper.find(FormikFormContent).prop("errors")).toBe(
      "name too long"
    );
  });

  it("clears the submission errors when unmounting", () => {
    const setSubmissionErrors = jest.fn();
    state.pod.projects = {
      "192.168.1.1": [podProjectFactory()],
    };
    state.pod.errors = "Failed to fetch projects.";
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/add", key: "testKey" }]}
        >
          <CredentialsForm
            clearHeaderContent={jest.fn()}
            newPodValues={{
              certificate: "certificate",
              key: "key",
              name: "my-favourite-kvm",
              password: "",
              pool: "0",
              power_address: "192.168.1.1",
              zone: "0",
            }}
            setNewPodValues={jest.fn()}
            setStep={jest.fn()}
            setSubmissionErrors={setSubmissionErrors}
          />
        </MemoryRouter>
      </Provider>
    );
    wrapper.unmount();
    expect(
      store
        .getActions()
        .some((action) => action.type === podActions.cleanup().type)
    ).toBe(true);
    expect(
      store
        .getActions()
        .some(
          (action) =>
            action.type ===
            generalActions.cleanupGeneratedCertificateErrors().type
        )
    ).toBe(true);
    expect(setSubmissionErrors).toHaveBeenCalled();
  });
});
