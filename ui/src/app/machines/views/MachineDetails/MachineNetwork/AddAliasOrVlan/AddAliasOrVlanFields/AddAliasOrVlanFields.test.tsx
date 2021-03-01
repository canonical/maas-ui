import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import AddAliasOrVlanFields from "./AddAliasOrVlanFields";

import { NetworkInterfaceTypes } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("AddAliasOrVlanFields", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory();
  });

  it("displays a tag field for a VLAN", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <AddAliasOrVlanFields
              systemId="abc123"
              interfaceType={NetworkInterfaceTypes.VLAN}
            />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("TagField").exists()).toBe(true);
  });

  it("does not display a tag field for an ALIAS", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines", key: "testKey" }]}
        >
          <Formik initialValues={{}} onSubmit={jest.fn()}>
            <AddAliasOrVlanFields
              systemId="abc123"
              interfaceType={NetworkInterfaceTypes.ALIAS}
            />
          </Formik>
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("TagField").exists()).toBe(false);
  });
});
