import { Formik } from "formik";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import LinkModeSelect, { Label } from "./LinkModeSelect";

import { NetworkInterfaceTypes, NetworkLinkMode } from "app/store/types/enum";
import { LINK_MODE_DISPLAY } from "app/store/utils";
import { rootState as rootStateFactory } from "testing/factories";
import { render, screen } from "testing/utils";

const mockStore = configureStore();

describe("LinkModeSelect", () => {
  it("only displays LINK_UP if a subnet is not provided", () => {
    const store = mockStore(rootStateFactory());
    render(
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

    expect(screen.getAllByRole("option").length).toBe(1);
    expect(
      screen.getByRole("option", {
        name: LINK_MODE_DISPLAY[NetworkLinkMode.LINK_UP],
      })
    ).toBeInTheDocument();
  });

  it("can display all options", () => {
    const store = mockStore(rootStateFactory());
    render(
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

    expect(
      screen.getByRole("option", {
        name: LINK_MODE_DISPLAY[NetworkLinkMode.AUTO],
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", {
        name: LINK_MODE_DISPLAY[NetworkLinkMode.STATIC],
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", {
        name: LINK_MODE_DISPLAY[NetworkLinkMode.LINK_UP],
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", {
        name: LINK_MODE_DISPLAY[NetworkLinkMode.DHCP],
      })
    ).toBeInTheDocument();
  });

  it("only displays auto or static for an alias", () => {
    const store = mockStore(rootStateFactory());
    render(
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

    expect(
      screen.getByRole("option", {
        name: LINK_MODE_DISPLAY[NetworkLinkMode.AUTO],
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", {
        name: LINK_MODE_DISPLAY[NetworkLinkMode.STATIC],
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("option", {
        name: LINK_MODE_DISPLAY[NetworkLinkMode.LINK_UP],
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("option", {
        name: LINK_MODE_DISPLAY[NetworkLinkMode.DHCP],
      })
    ).not.toBeInTheDocument();
  });

  it("can display a default option", () => {
    const store = mockStore(rootStateFactory());
    const defaultOption = {
      label: "Default",
      value: "99",
    };
    render(
      <Provider store={store}>
        <Formik initialValues={{ mode: "" }} onSubmit={jest.fn()}>
          <LinkModeSelect
            defaultOption={defaultOption}
            interfaceType={NetworkInterfaceTypes.PHYSICAL}
            name="mode"
          />
        </Formik>
      </Provider>
    );

    expect(screen.getByRole("option", { name: "Default" })).toBeInTheDocument();
  });

  it("can hide the default option", () => {
    const store = mockStore(rootStateFactory());
    render(
      <Provider store={store}>
        <Formik initialValues={{ mode: "" }} onSubmit={jest.fn()}>
          <LinkModeSelect
            defaultOption={null}
            interfaceType={NetworkInterfaceTypes.PHYSICAL}
            name="mode"
          />
        </Formik>
      </Provider>
    );

    expect(
      screen.queryByRole("option", { name: Label.DefaultOption })
    ).not.toBeInTheDocument();
  });
});
