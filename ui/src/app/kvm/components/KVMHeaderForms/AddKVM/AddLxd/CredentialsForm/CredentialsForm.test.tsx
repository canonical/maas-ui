import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import type { NewPodValues } from "../types";

import CredentialsForm from "./CredentialsForm";

import { actions as generalActions } from "app/store/general";
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

describe("CredentialsForm", () => {
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
      certificate: "",
      key: "",
      name: "",
      password: "",
      pool: "",
      power_address: "",
      zone: "",
    };
  });

  it("dispatches action if choosing to generate certificate and key", () => {
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
            setKvmType={jest.fn()}
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

  it("can handle fetching projects if providing certificate and key", () => {
    const setNewPodValues = jest.fn();
    const setStep = jest.fn();
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
            setKvmType={jest.fn()}
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

    expect(setStep).not.toHaveBeenCalled();
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
});
