import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import type { FormValues } from "../EditBootArchitectures";

import BootArchitecturesTable, { Headers } from "./BootArchitecturesTable";

import {
  generalState as generalStateFactory,
  knownBootArchitecture as knownBootArchitectureFactory,
  knownBootArchitecturesState as knownBootArchitecturesStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { render, screen, within } from "testing/utils";

const mockStore = configureStore();
let initialValues: FormValues;

beforeEach(() => {
  initialValues = {
    disabled_boot_architectures: [],
  };
});

it("renders a table of known boot architectures", () => {
  const knownBootArchitecture = knownBootArchitectureFactory();
  const state = rootStateFactory({
    general: generalStateFactory({
      knownBootArchitectures: knownBootArchitecturesStateFactory({
        data: [knownBootArchitecture],
      }),
    }),
  });
  const store = mockStore(state);
  render(
    <Provider store={store}>
      <Formik initialValues={initialValues} onSubmit={jest.fn()}>
        <BootArchitecturesTable />
      </Formik>
    </Provider>
  );

  expect(
    within(screen.getByRole("gridcell", { name: Headers.Name })).getByText(
      knownBootArchitecture.name
    )
  ).toBeInTheDocument();
  expect(
    screen.getByRole("gridcell", { name: Headers.BootMethod }).textContent
  ).toBe(knownBootArchitecture.bios_boot_method);
  expect(
    screen.getByRole("gridcell", { name: Headers.BootloaderArch }).textContent
  ).toBe(knownBootArchitecture.bootloader_arches);
  expect(
    screen.getByRole("gridcell", { name: Headers.Protocol }).textContent
  ).toBe(knownBootArchitecture.protocol);
  expect(
    screen.getByRole("gridcell", { name: Headers.Octet }).textContent
  ).toBe(knownBootArchitecture.arch_octet);
});
