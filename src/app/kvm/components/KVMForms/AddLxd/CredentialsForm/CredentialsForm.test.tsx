import configureStore from "redux-mock-store";

import { AddLxdSteps } from "../AddLxd";
import type { NewPodValues } from "../types";

import CredentialsForm from "./CredentialsForm";

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
import { screen, userEvent, renderWithBrowserRouter } from "testing/utils";

const mockStore = configureStore<RootState>();

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
      }),
    });
    newPodValues = {
      certificate: "",
      key: "",
      name: "my-favourite-kvm",
      password: "",
      pool: "1",
      power_address: "192.168.1.1",
      zone: "2",
    };
  });

  it("dispatches an action to generate certificate if not providing certificate and key", async () => {
    const setNewPodValues = jest.fn();
    const store = mockStore(state);
    renderWithBrowserRouter(
      <CredentialsForm
        clearSidePanelContent={jest.fn()}
        newPodValues={newPodValues}
        setNewPodValues={setNewPodValues}
        setStep={jest.fn()}
        setSubmissionErrors={jest.fn()}
      />,
      { route: "/kvm/add", store }
    );

    // Submit form
    await userEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(setNewPodValues).toHaveBeenCalledWith({
      certificate: "",
      key: "",
      name: "my-favourite-kvm",
      password: "",
      pool: "1",
      power_address: "192.168.1.1",
      zone: "2",
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

  it("dispatches an action to fetch projects if providing certificate and key", async () => {
    const setNewPodValues = jest.fn();
    const store = mockStore(state);
    newPodValues.certificate = "certificate";
    newPodValues.key = "key";
    newPodValues.zone = "4";
    newPodValues.pool = "3";
    renderWithBrowserRouter(
      <CredentialsForm
        clearSidePanelContent={jest.fn()}
        newPodValues={newPodValues}
        setNewPodValues={setNewPodValues}
        setStep={jest.fn()}
        setSubmissionErrors={jest.fn()}
      />,
      { route: "/kvm/add", store }
    );
    // Change radio to provide certificate instead of generating one.
    await userEvent.click(
      screen.getByRole("radio", { name: "Provide certificate and private key" })
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: "Upload certificate" }),
      "certificate"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "Upload private key" }),
      "key"
    );

    await userEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(setNewPodValues).toHaveBeenCalledWith({
      certificate: "certificate",
      key: "key",
      name: "my-favourite-kvm",
      password: "",
      pool: "3",
      power_address: "192.168.1.1",
      zone: "4",
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
    renderWithBrowserRouter(
      <CredentialsForm
        clearSidePanelContent={jest.fn()}
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
      />,
      { route: "/kvm/add", store }
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
    renderWithBrowserRouter(
      <CredentialsForm
        clearSidePanelContent={jest.fn()}
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
      />,
      { route: "/kvm/add", store }
    );

    expect(setStep).not.toHaveBeenCalled();
  });

  it("moves to the project select step if projects exist for given LXD address", () => {
    const setStep = jest.fn();
    state.pod.projects = {
      "192.168.1.1": [podProjectFactory()],
    };
    const store = mockStore(state);
    renderWithBrowserRouter(
      <CredentialsForm
        clearSidePanelContent={jest.fn()}
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
      />,
      { route: "/kvm/add", store }
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
    renderWithBrowserRouter(
      <CredentialsForm
        clearSidePanelContent={jest.fn()}
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
      />,
      { route: "/kvm/add", store }
    );

    expect(setStep).not.toHaveBeenCalled();
    expect(screen.getByTestId("notification-title")).toHaveTextContent(
      "Error:"
    );
    expect(screen.getByText("Failed to fetch projects.")).toBeInTheDocument();
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
    renderWithBrowserRouter(
      <CredentialsForm
        clearSidePanelContent={jest.fn()}
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
      />,
      { route: "/kvm/add", store }
    );
    expect(setStep).not.toHaveBeenCalled();
    expect(screen.getByTestId("notification-title")).toHaveTextContent(
      "Error:"
    );
    expect(screen.getByText("name too long")).toBeInTheDocument();
  });

  it("clears the submission errors when unmounting", () => {
    const setSubmissionErrors = jest.fn();
    state.pod.projects = {
      "192.168.1.1": [podProjectFactory()],
    };
    state.pod.errors = "Failed to fetch projects.";
    const store = mockStore(state);
    const { unmount } = renderWithBrowserRouter(
      <CredentialsForm
        clearSidePanelContent={jest.fn()}
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
      />,
      { route: "/kvm/add", store }
    );
    unmount();
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
