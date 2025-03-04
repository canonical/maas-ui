import { Formik } from "formik";

import LACPRateSelect from "./LACPRateSelect";

import { BondLacpRate } from "@/app/store/general/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, within, renderWithMockStore } from "@/testing/utils";

describe("LACPRateSelect", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      general: factory.generalState({
        bondOptions: factory.bondOptionsState({
          data: factory.bondOptions({
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
      <Formik initialValues={{}} onSubmit={vi.fn()}>
        <LACPRateSelect name="lacp_rate" />
      </Formik>,
      { state }
    );
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("displays the options", () => {
    renderWithMockStore(
      <Formik initialValues={{}} onSubmit={vi.fn()}>
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

    for (const i in expectedOptions) {
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
      <Formik initialValues={{}} onSubmit={vi.fn()}>
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
    state.general.bondOptions = factory.bondOptionsState({
      data: undefined,
      loaded: true,
    });
    renderWithMockStore(
      <Formik initialValues={{}} onSubmit={vi.fn()}>
        <LACPRateSelect defaultOption={null} name="lacp_rate" />
      </Formik>,
      { state }
    );
    const lacpRateSelect = screen.getByRole("combobox", { name: "LACP rate" });
    const lacpRateOptions = within(lacpRateSelect).queryAllByRole("option");

    expect(lacpRateOptions).toHaveLength(0);
  });
});
