import { Formik } from "formik";

import LXDPowerFields from "./LXDPowerFields";

import { powerField as powerFieldFactory } from "testing/factories";
import { renderWithMockStore, screen } from "testing/utils";

describe("LXDPowerFields", () => {
  it("can be given a custom power parameters name", () => {
    const field = powerFieldFactory({ name: "field", label: "custom field" });
    renderWithMockStore(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <LXDPowerFields
          fields={[field]}
          powerParametersValueName="custom-power-parameters"
        />
      </Formik>
    );
    expect(screen.getByLabelText("custom field")).toHaveAttribute(
      "name",
      "custom-power-parameters.field"
    );
  });

  it("renders certificate fields if the user can edit them", () => {
    renderWithMockStore(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <LXDPowerFields canEditCertificate fields={[]} />
      </Formik>
    );

    expect(
      screen.getByLabelText(/Generate new certificate/i)
    ).toBeInTheDocument();
  });

  it("does not render certificate fields if the user cannot edit them", () => {
    renderWithMockStore(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <LXDPowerFields canEditCertificate={false} fields={[]} />
      </Formik>
    );

    expect(
      screen.queryByLabelText(/Generate new certificate/i)
    ).not.toBeInTheDocument();
  });
});
