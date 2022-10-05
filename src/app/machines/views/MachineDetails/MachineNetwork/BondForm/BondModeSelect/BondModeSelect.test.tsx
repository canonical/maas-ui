import { screen, within } from "@testing-library/react";
import { Formik } from "formik";

import BondModeSelect from "./BondModeSelect";

import { BondMode } from "app/store/general/types";
import type { RootState } from "app/store/root/types";
import {
  generalState as generalStateFactory,
  bondOptions as bondOptionsFactory,
  bondOptionsState as bondOptionsStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithMockStore } from "testing/utils";

describe("BondModeSelect", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory({
      general: generalStateFactory({
        bondOptions: bondOptionsStateFactory({
          data: bondOptionsFactory({
            modes: [
              [BondMode.BALANCE_RR, BondMode.BALANCE_RR],
              [BondMode.ACTIVE_BACKUP, BondMode.ACTIVE_BACKUP],
              [BondMode.BALANCE_XOR, BondMode.BALANCE_XOR],
              [BondMode.BROADCAST, BondMode.BROADCAST],
              [BondMode.LINK_AGGREGATION, BondMode.LINK_AGGREGATION],
              [BondMode.BALANCE_TLB, BondMode.BALANCE_TLB],
              [BondMode.BALANCE_ALB, BondMode.BALANCE_ALB],
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
        <BondModeSelect name="mode" />
      </Formik>,
      { state }
    );
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("displays the options", () => {
    renderWithMockStore(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <BondModeSelect name="mode" />
      </Formik>,
      { state }
    );

    const bondModeSelect = screen.getByRole("combobox", { name: "Bond mode" });
    const bondModeOptions = within(bondModeSelect).getAllByRole("option");
    const expectedOptions = [
      { label: "Select bond mode", value: "" },
      {
        label: BondMode.BALANCE_RR,
        value: BondMode.BALANCE_RR,
      },
      {
        label: BondMode.ACTIVE_BACKUP,
        value: BondMode.ACTIVE_BACKUP,
      },
      {
        label: BondMode.BALANCE_XOR,
        value: BondMode.BALANCE_XOR,
      },
      {
        label: BondMode.BROADCAST,
        value: BondMode.BROADCAST,
      },
      {
        label: BondMode.LINK_AGGREGATION,
        value: BondMode.LINK_AGGREGATION,
      },
      {
        label: BondMode.BALANCE_TLB,
        value: BondMode.BALANCE_TLB,
      },
      {
        label: BondMode.BALANCE_ALB,
        value: BondMode.BALANCE_ALB,
      },
    ];

    for (var i = 0; i < expectedOptions.length; i++) {
      expect(bondModeOptions[i]).toHaveValue(expectedOptions[i].value);
      expect(bondModeOptions[i]).toHaveTextContent(expectedOptions[i].label);
    }
  });

  it("can display a default option", () => {
    const defaultOption = {
      label: "Default",
      value: "99",
    };
    renderWithMockStore(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <BondModeSelect defaultOption={defaultOption} name="mode" />
      </Formik>,
      { state }
    );

    const bondModeSelect = screen.getByRole("combobox", { name: "Bond mode" });
    const bondModeOptions = within(bondModeSelect).getAllByRole("option");

    expect(bondModeOptions[0]).toHaveValue(defaultOption.value);
    expect(bondModeOptions[0]).toHaveTextContent(defaultOption.label);
  });

  it("can hide the default option", () => {
    state.general.bondOptions = bondOptionsStateFactory({
      data: undefined,
      loaded: true,
    });
    renderWithMockStore(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <BondModeSelect defaultOption={null} name="mode" />
      </Formik>,
      { state }
    );
    const bondModeSelect = screen.getByRole("combobox", { name: "Bond mode" });
    const bondModeOptions = within(bondModeSelect).queryAllByRole("option");

    expect(bondModeOptions).toHaveLength(0);
  });
});
