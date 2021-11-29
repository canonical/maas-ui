import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
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
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

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

  it("can dispatch an action to generate certificate if not providing certificate and key", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/edit", key: "testKey" }]}
        >
          <UpdateCertificate
            closeForm={jest.fn()}
            hasCertificateData
            pod={pod}
          />
        </MemoryRouter>
      </Provider>
    );
    // Radio should be set to generate certificate by default.
    submitFormikForm(wrapper);
    wrapper.update();

    const expectedAction = generalActions.generateCertificate({
      object_name: "my-pod",
    });
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("can generate a certificate with a custom object name", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/edit", key: "testKey" }]}
        >
          <UpdateCertificate
            closeForm={jest.fn()}
            hasCertificateData
            objectName="custom-name"
            pod={pod}
          />
        </MemoryRouter>
      </Provider>
    );
    // Radio should be set to generate certificate by default.
    submitFormikForm(wrapper);
    wrapper.update();

    const expectedAction = generalActions.generateCertificate({
      object_name: "custom-name",
    });
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("can dispatch an action to update pod with generated certificate and key", () => {
    const generatedCertificate = generatedCertificateFactory({
      certificate: "generated-certificate",
      private_key: "private-key",
    });
    state.general.generatedCertificate.data = generatedCertificate;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/edit", key: "testKey" }]}
        >
          <UpdateCertificate
            closeForm={jest.fn()}
            hasCertificateData
            pod={pod}
          />
        </MemoryRouter>
      </Provider>
    );
    submitFormikForm(wrapper, {
      password: "password",
    });
    wrapper.update();

    const expectedAction = podActions.update({
      certificate: "generated-certificate",
      id: pod.id,
      key: "private-key",
      password: "password",
      tags: pod.tags.join(","),
    });
    const actualActions = store.getActions();
    expect(
      actualActions.find((action) => action.type === expectedAction.type)
    ).toStrictEqual(expectedAction);
  });

  it("can dispatch an action to update pod with provided certificate and key", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/edit", key: "testKey" }]}
        >
          <UpdateCertificate
            closeForm={jest.fn()}
            hasCertificateData
            pod={pod}
          />
        </MemoryRouter>
      </Provider>
    );
    // Change radio to provide certificate instead of generating one.
    wrapper.find("input[id='provide-certificate']").simulate("change");
    submitFormikForm(wrapper, {
      certificate: "certificate",
      key: "key",
    });
    wrapper.update();

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

  it("closes the form on cancel if pod has a certificate", () => {
    const closeForm = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/edit", key: "testKey" }]}
        >
          <UpdateCertificate
            closeForm={closeForm}
            hasCertificateData
            pod={pod}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-testid='cancel-action']").exists()).toBe(true);
    wrapper.find("button[data-testid='cancel-action']").simulate("click");
    expect(closeForm).toHaveBeenCalled();
  });

  it(`clears generated certificate on cancel if pod has no certificate and a
      certificate has been generated`, () => {
    state.general.generatedCertificate.data = generatedCertificateFactory();
    const closeForm = jest.fn();
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/edit", key: "testKey" }]}
        >
          <UpdateCertificate
            closeForm={closeForm}
            hasCertificateData={false}
            pod={pod}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-testid='cancel-action']").exists()).toBe(true);
    wrapper.find("button[data-testid='cancel-action']").simulate("click");

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
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/edit", key: "testKey" }]}
        >
          <UpdateCertificate
            closeForm={jest.fn()}
            hasCertificateData={false}
            pod={pod}
          />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("[data-testid='cancel-action']").exists()).toBe(false);
  });
});
