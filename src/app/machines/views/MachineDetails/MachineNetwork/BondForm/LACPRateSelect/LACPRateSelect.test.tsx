import { Formik } from "formik";

import LACPRateSelect from "./LACPRateSelect";

import { BondLacpRate } from "app/store/general/types";
import type { RootState } from "app/store/root/types";
import {
  generalState as generalStateFactory,
  bondOptions as bondOptionsFactory,
  bondOptionsState as bondOptionsStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { screen, within, renderWithMockStore } from "testing/utils";

describe("LACPRateSelect", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      general: generalStateFactory({
        bondOptions: bondOptionsStateFactory({
          data: bondOptionsFactory({
            lacp_rates: [
              [BondLacpRate.FAST, BondLacpRate.FAST],
              [BondLacpRate.SLOW, BondLacpRate.SLOW],
            ],
          }),
          loaded: true,
        }),
      }),
    });
  });

  it("shows a spinner if the bond options haven't loaded", () => {
    state.general.bondOptions.loaded = false;
    renderWithMockStore(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <LACPRateSelect name="lacp_rate" />
      </Formik>,
      { state }
    );
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("displays the options", () => {
    renderWithMockStore(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <LACPRateSelect name="lacp_rate" />
      </Formik>,
      { state }
    );

    const lacpRateSelect = screen.getByRole("combobox", { name: "LACP rate" });
    const lacpRateOptions = within(lacpRateSelect).getAllByRole("option");
    const expectedOptions = [
      { label: "Select LACP rate", value: "" },
      {
        label: BondLacpRate.FAST,
        value: BondLacpRate.FAST,
      },
      {
        label: BondLacpRate.SLOW,
        value: BondLacpRate.SLOW,
      },
    ];

    for (let i in expectedOptions) {
      expect(lacpRateOptions[i]).toHaveValue(expectedOptions[i].value);
      expect(lacpRateOptions[i]).toHaveTextContent(expectedOptions[i].label);
    }
  });

  it("can display a default option", () => {
    const defaultOption = {
      label: "Default",
      value: "99",
    };
    renderWithMockStore(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <LACPRateSelect defaultOption={defaultOption} name="lacp_rate" />
      </Formik>,
      { state }
    );

    const lacpRateSelect = screen.getByRole("combobox", { name: "LACP rate" });
    const lacpRateOptions = within(lacpRateSelect).getAllByRole("option");

    expect(lacpRateOptions[0]).toHaveValue(defaultOption.value);
    expect(lacpRateOptions[0]).toHaveTextContent(defaultOption.label);
  });

  it("can hide the default option", () => {
    state.general.bondOptions = bondOptionsStateFactory({
      data: undefined,
      loaded: true,
    });
    renderWithMockStore(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <LACPRateSelect defaultOption={null} name="lacp_rate" />
      </Formik>,
      { state }
    );
    const lacpRateSelect = screen.getByRole("combobox", { name: "LACP rate" });
    const lacpRateOptions = within(lacpRateSelect).queryAllByRole("option");

    expect(lacpRateOptions).toHaveLength(0);
  });
});
