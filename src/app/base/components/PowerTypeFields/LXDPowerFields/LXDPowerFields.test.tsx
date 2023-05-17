import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import LXDPowerFields from "./LXDPowerFields";

import type { RootState } from "app/store/root/types";
import {
  powerField as powerFieldFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { render, screen } from "testing/utils";

const mockStore = configureStore();

describe("LXDPowerFields", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory();
  });

  it("can be given a custom power parameters name", () => {
    const field = powerFieldFactory({ name: "field", label: "custom field" });
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <LXDPowerFields
            fields={[field]}
            powerParametersValueName="custom-power-parameters"
          />
        </Formik>
      </Provider>
    );
    expect(screen.getByLabelText("custom field")).toHaveAttribute(
      "name",
      "custom-power-parameters.field"
    );
  });

  it("renders certificate fields if the user can edit them", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <LXDPowerFields canEditCertificate fields={[]} />
        </Formik>
      </Provider>
    );

    expect(
      screen.getByLabelText(/Generate new certificate/i)
    ).toBeInTheDocument();
  });

  it("does not render certificate fields if the user cannot edit them", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <LXDPowerFields canEditCertificate={false} fields={[]} />
        </Formik>
      </Provider>
    );

    expect(
      screen.queryByLabelText(/Generate new certificate/i)
    ).not.toBeInTheDocument();
  });
});
