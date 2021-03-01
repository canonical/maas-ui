import { mount } from "enzyme";
import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import LinkModeSelect from "./LinkModeSelect";

import { NetworkInterfaceTypes } from "app/store/machine/types";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("LinkModeSelect", () => {
  it("only displays LINK_UP if a subnet is not provided", () => {
    const store = mockStore(rootStateFactory());
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ mode: "" }} onSubmit={jest.fn()}>
          <LinkModeSelect
            defaultOption={null}
            interfaceType={NetworkInterfaceTypes.PHYSICAL}
            name="mode"
            subnet={null}
          />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField").prop("options")).toStrictEqual([
      {
        label: "Unconfigured",
        value: "link_up",
      },
    ]);
  });

  it("can display all options", () => {
    const store = mockStore(rootStateFactory());
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ mode: "" }} onSubmit={jest.fn()}>
          <LinkModeSelect
            defaultOption={null}
            interfaceType={NetworkInterfaceTypes.PHYSICAL}
            name="mode"
            subnet={1}
          />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField").prop("options")).toStrictEqual([
      {
        label: "Auto assign",
        value: "auto",
      },
      {
        label: "Static assign",
        value: "static",
      },
      {
        label: "Unconfigured",
        value: "link_up",
      },
      {
        label: "DHCP",
        value: "dhcp",
      },
    ]);
  });

  it("only displays auto or static for an alias", () => {
    const store = mockStore(rootStateFactory());
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ mode: "" }} onSubmit={jest.fn()}>
          <LinkModeSelect
            defaultOption={null}
            interfaceType={NetworkInterfaceTypes.ALIAS}
            name="mode"
            subnet={1}
          />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField").prop("options")).toStrictEqual([
      {
        label: "Auto assign",
        value: "auto",
      },
      {
        label: "Static assign",
        value: "static",
      },
    ]);
  });

  it("can display a default option", () => {
    const store = mockStore(rootStateFactory());
    const defaultOption = {
      label: "Default",
      value: "99",
    };
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ mode: "" }} onSubmit={jest.fn()}>
          <LinkModeSelect
            interfaceType={NetworkInterfaceTypes.PHYSICAL}
            name="mode"
            defaultOption={defaultOption}
          />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField").prop("options")[0]).toStrictEqual(
      defaultOption
    );
  });

  it("can hide the default option", () => {
    const store = mockStore(rootStateFactory());
    const wrapper = mount(
      <Provider store={store}>
        <Formik initialValues={{ mode: "" }} onSubmit={jest.fn()}>
          <LinkModeSelect
            interfaceType={NetworkInterfaceTypes.PHYSICAL}
            name="mode"
            defaultOption={null}
          />
        </Formik>
      </Provider>
    );
    expect(wrapper.find("FormikField").prop("options").length).toBe(1);
    expect(wrapper.find("FormikField").prop("options")[0]).not.toStrictEqual({
      label: "Select IP mode",
      value: "",
    });
  });
});
