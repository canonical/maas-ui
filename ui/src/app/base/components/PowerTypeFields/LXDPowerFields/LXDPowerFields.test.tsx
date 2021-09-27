import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import LXDPowerFields from "./LXDPowerFields";

import type { RootState } from "app/store/root/types";
import {
  certificateMetadata as certMetadataFactory,
  machineDetails as machineFactory,
  powerField as powerFieldFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("LXDPowerFields", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory();
  });

  it("can be disabled", () => {
    const field = powerFieldFactory({ name: "field" });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <LXDPowerFields disabled fields={[field]} />
        </Formik>
      </Provider>
    );
    expect(
      wrapper.find("input[name='power_parameters.field']").prop("disabled")
    ).toBe(true);
  });

  it("can be given a custom power parameters name", () => {
    const field = powerFieldFactory({ name: "field" });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <LXDPowerFields
            disabled
            fields={[field]}
            powerParametersValueName="custom-power-parameters"
          />
        </Formik>
      </Provider>
    );
    expect(
      wrapper.find("input[name='custom-power-parameters.field']").exists()
    ).toBe(true);
  });

  it(`renders certificate data if provided machine has certificate data and the
      user is not currently editing the form`, () => {
    const machine = machineFactory({
      certificate: certMetadataFactory(),
      power_parameters: {
        certificate: "certificate",
        key: "key",
      },
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <LXDPowerFields
            disabled
            editing={false}
            fields={[]}
            machine={machine}
          />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("CertificateDetails").exists()).toBe(true);
    expect(wrapper.find("CertificateFields").exists()).toBe(false);
  });

  it(`renders certificate fields if provided machine has certificate data and
      the user is currently editing the form`, () => {
    const machine = machineFactory({
      certificate: certMetadataFactory(),
      power_parameters: {
        certificate: "certificate",
        key: "key",
      },
    });
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <LXDPowerFields editing fields={[]} machine={machine} />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("CertificateDetails").exists()).toBe(false);
    expect(wrapper.find("CertificateFields").exists()).toBe(true);
  });

  it("renders certificate fields if machine is not provided", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <LXDPowerFields fields={[]} />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("CertificateDetails").exists()).toBe(false);
    expect(wrapper.find("CertificateFields").exists()).toBe(true);
  });

  it("does not render certificate fields if the user cannot edit them", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <LXDPowerFields canEditCertificate={false} fields={[]} />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("CertificateDetails").exists()).toBe(false);
    expect(wrapper.find("CertificateFields").exists()).toBe(false);
  });
});
