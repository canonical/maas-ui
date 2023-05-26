import configureStore from "redux-mock-store";

import UpdateCertificate from "./UpdateCertificate";

import { actions as generalActions } from "app/store/general";
import { actions as podActions } from "app/store/pod";
import type { PodDetails } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import {
  generalState as generalStateFactory,
  generatedCertificate as generatedCertificateFactory,
  generatedCertificateState as generatedCertificateStateFactory,
  podDetails as podFactory,
  podState as podStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "testing/utils";

const mockStore = configureStore<RootState>();

describe("UpdateCertificate", () => {
  let state: RootState;
  let pod: PodDetails;

  beforeEach(() => {
    pod = podFactory({ id: 1, name: "my-pod" });
    state = rootStateFactory({
      general: generalStateFactory({
        generatedCertificate: generatedCertificateStateFactory({
          data: null,
        }),
      }),
      pod: podStateFactory({
        items: [pod],
        loaded: true,
      }),
    });
  });

  it("can dispatch an action to generate certificate if not providing certificate and key", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <UpdateCertificate closeForm={jest.fn()} hasCertificateData pod={pod} />,
      { route: "/kvm/edit", store }
    );

    // Radio should be set to generate certificate by default.
    await userEvent.click(screen.getByRole("button", { name: "Next" }));

    const expectedAction = generalActions.generateCertificate({
      object_name: "my-pod",
    });
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("can generate a certificate with a custom object name", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <UpdateCertificate
        closeForm={jest.fn()}
        hasCertificateData
        objectName="custom-name"
        pod={pod}
      />,
      {
        route: "/kvm/edit",
        store,
      }
    );
    // Radio should be set to generate certificate by default.
    await userEvent.click(screen.getByRole("button", { name: "Next" }));

    const expectedAction = generalActions.generateCertificate({
      object_name: "custom-name",
    });
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("can dispatch an action to update pod with generated certificate and key", async () => {
    const generatedCertificate = generatedCertificateFactory({
      certificate: "generated-certificate",
      private_key: "private-key",
    });
    state.general.generatedCertificate.data = generatedCertificate;
    const store = mockStore(state);

    renderWithBrowserRouter(
      <UpdateCertificate closeForm={jest.fn()} hasCertificateData pod={pod} />,
      {
        route: "/kvm/edit",
        store,
      }
    );

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    const expectedAction = podActions.update({
      certificate: "generated-certificate",
      id: pod.id,
      key: "private-key",
      password: "",
      tags: pod.tags.join(","),
    });
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("can dispatch an action to update pod with provided certificate and key", async () => {
    const store = mockStore(state);
    renderWithBrowserRouter(
      <UpdateCertificate closeForm={jest.fn()} hasCertificateData pod={pod} />,
      {
        route: "/kvm/edit",
        store,
      }
    );

    // Change radio to provide certificate instead of generating one.
    const radio = screen.getByRole("radio", {
      name: "Provide certificate and private key",
    });
    await userEvent.click(radio);
    await userEvent.type(
      screen.getByRole("textbox", { name: "Upload certificate" }),
      "certificate"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "Upload private key" }),
      "key"
    );
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    const expectedAction = podActions.update({
      certificate: "certificate",
      id: pod.id,
      key: "key",
      tags: pod.tags.join(","),
    });
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("closes the form on cancel if pod has a certificate", async () => {
    const closeForm = jest.fn();

    renderWithBrowserRouter(
      <UpdateCertificate closeForm={closeForm} hasCertificateData pod={pod} />,
      {
        route: "/kvm/edit",
        store: mockStore(state),
      }
    );

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(closeForm).toHaveBeenCalled();
  });

  it(`clears generated certificate on cancel if pod has no certificate and a
      certificate has been generated`, async () => {
    const closeForm = jest.fn();
    state.general.generatedCertificate.data = generatedCertificateFactory();
    const store = mockStore(state);

    renderWithBrowserRouter(
      <UpdateCertificate
        closeForm={closeForm}
        hasCertificateData={false}
        pod={pod}
      />,
      {
        route: "/kvm/edit",
        store,
      }
    );
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    const expectedAction = generalActions.clearGeneratedCertificate();
    const actualAction = store
      .getActions()
      .find((action) => action.type === expectedAction.type);
    expect(actualAction).toStrictEqual(expectedAction);
  });

  it(`does not show a cancel button if pod has no certificate and no certificate
      has been generated`, () => {
    state.general.generatedCertificate.data = null;
    const store = mockStore(state);
    renderWithBrowserRouter(
      <UpdateCertificate
        closeForm={jest.fn()}
        hasCertificateData={false}
        pod={pod}
      />,
      {
        route: "/kvm/edit",
        store,
      }
    );
    expect(
      screen.queryByRole("button", { name: "Cancel" })
    ).not.toBeInTheDocument();
  });
});
