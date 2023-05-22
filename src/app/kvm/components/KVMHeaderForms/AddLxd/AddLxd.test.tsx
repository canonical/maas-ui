import { render } from "@testing-library/react";
import configureStore from "redux-mock-store";

import AddLxd from "./AddLxd";
import CredentialsForm from "./CredentialsForm";

import { ConfigNames } from "app/store/config/types";
import { actions as podActions } from "app/store/pod";
import { PodType } from "app/store/pod/constants";
import type { RootState } from "app/store/root/types";
import {
  configState as configStateFactory,
  generalState as generalStateFactory,
  generatedCertificate as generatedCertificateFactory,
  generatedCertificateState as generatedCertificateStateFactory,
  podProject as podProjectFactory,
  podState as podStateFactory,
  powerField as powerFieldFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("AddLxd", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [{ name: ConfigNames.MAAS_NAME, value: "MAAS" }],
      }),
      general: generalStateFactory({
        generatedCertificate: generatedCertificateStateFactory({
          data: null,
        }),
        powerTypes: powerTypesStateFactory({
          data: [
            powerTypeFactory({
              name: PodType.LXD,
              fields: [
                powerFieldFactory({ name: "power_address" }),
                powerFieldFactory({ name: "password" }),
              ],
            }),
          ],
          loaded: true,
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
  });

  it("shows the credentials form by default", () => {
    const store = mockStore(state);

    const { container } = renderWithBrowserRouter(
      <AddLxd clearSidePanelContent={jest.fn()} />,
      { route: "/kvm/add", store }
    );

    expect(
      container.querySelector('form[data-testid="credentials-form"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('form[data-testid="authentication-form"]')
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('form[data-testid="select-project-form"]')
    ).not.toBeInTheDocument();
  });

  it(`shows the authentication form if the user has generated a certificate for
    the LXD KVM host`, () => {
    const certificate = generatedCertificateFactory({
      CN: "my-favourite-kvm@host",
    });

    state.general.generatedCertificate.data = certificate;

    const store = mockStore(state);

    const { container } = renderWithBrowserRouter(
      <AddLxd clearSidePanelContent={jest.fn()} />,
      { route: "/kvm/add", store }
    );

    // Submit credentials form
    submitFormikForm(container, {
      name: "my-favourite-kvm",
      pool: 0,
      power_address: "192.168.1.1",
      zone: 0,
    });

    expect(
      container.querySelector('form[data-testid="credentials-form"]')
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('form[data-testid="authentication-form"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('form[data-testid="select-project-form"]')
    ).not.toBeInTheDocument();
  });

  it("shows the project select form once authenticated", () => {
    state.pod.projects = {
      "192.168.1.1": [podProjectFactory()],
    };

    const store = mockStore(state);

    const { container } = renderWithBrowserRouter(
      <AddLxd clearSidePanelContent={jest.fn()} />,
      { route: "/kvm/add", store }
    );

    // Submit credentials form
    submitFormikForm(container, {
      name: "my-favourite-kvm",
      pool: 0,
      power_address: "192.168.1.1",
      zone: 0,
    });

    expect(
      container.querySelector('form[data-testid="credentials-form"]')
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('form[data-testid="authentication-form"]')
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('form[data-testid="select-project-form"]')
    ).toBeInTheDocument();
  });

  it("clears projects and runs cleanup on unmount", () => {
    const store = mockStore(state);

    const { unmount } = renderWithBrowserRouter(
      <AddLxd clearSidePanelContent={jest.fn()} />,
      { route: "/kvm/add", store }
    );

    unmount();

    const expectedActions = [podActions.cleanup(), podActions.clearProjects()];
    const actualActions = store.getActions();

    expect(
      actualActions.every((actualAction) =>
        expectedActions.some(
          (expectedAction) => expectedAction.type === actualAction.type
        )
      )
    );
  });

  it("can display submission errors", () => {
    const store = mockStore(state);

    const { container } = renderWithBrowserRouter(
      <AddLxd clearSidePanelContent={jest.fn()} />,
      { route: "/kvm/add", store }
    );

    container
      .querySelector(`input[name="name"]`)
      ?.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
    container
      .querySelector(`input[name="power_address"]`)
      ?.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
    container
      .querySelector(`input[name="pool"]`)
      ?.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
    container
      .querySelector(`input[name="zone"]`)
      ?.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));

    container
      .querySelector('form[data-testid="credentials-form"]')
      .dispatchEvent(new Event("submit", { bubbles: true }));

    expect(
      container.querySelector('div[data-testid="submission-error"]')
    ).toBeInTheDocument();
  });
});
