import { Formik } from "formik";

import AddAliasOrVlanFields from "./AddAliasOrVlanFields";

import urls from "app/base/urls";
import type { RootState } from "app/store/root/types";
import { NetworkInterfaceTypes } from "app/store/types/enum";
import { rootState as rootStateFactory } from "testing/factories";
import { screen, renderWithBrowserRouter } from "testing/utils";

const route = urls.machines.index;

describe("AddAliasOrVlanFields", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory();
  });

  it("displays a tag field for a VLAN", () => {
    renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <AddAliasOrVlanFields
          interfaceType={NetworkInterfaceTypes.VLAN}
          systemId="abc123"
        />
      </Formik>,
      { route: route, state }
    );
    expect(screen.getByRole("textbox", { name: "Tags" })).toBeInTheDocument();
  });

  it("does not display a tag field for an ALIAS", () => {
    renderWithBrowserRouter(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <AddAliasOrVlanFields
          interfaceType={NetworkInterfaceTypes.ALIAS}
          systemId="abc123"
        />
      </Formik>,
      { route: route, state }
    );
    expect(
      screen.queryByRole("textbox", { name: "Tags" })
    ).not.toBeInTheDocument();
  });
});
