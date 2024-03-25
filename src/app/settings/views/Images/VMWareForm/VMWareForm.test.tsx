import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import VMWareForm, { Labels as VMWareFormLabels } from "./VMWareForm";

import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, render } from "@/testing/utils";

const mockStore = configureStore();

describe("VMWareForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        items: [
          {
            name: ConfigNames.VCENTER_SERVER,
            value: "my server",
          },
          {
            name: ConfigNames.VCENTER_USERNAME,
            value: "admin",
          },
          {
            name: ConfigNames.VCENTER_PASSWORD,
            value: "passwd",
          },
          {
            name: ConfigNames.VCENTER_DATACENTER,
            value: "my datacenter",
          },
        ],
      }),
    });
  });

  it("sets vcenter_server value", () => {
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <VMWareForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByRole("textbox", { name: VMWareFormLabels.ServerLabel })
    ).toHaveValue("my server");
  });

  it("sets vcenter_username value", () => {
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <VMWareForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByRole("textbox", { name: VMWareFormLabels.UsernameLabel })
    ).toHaveValue("admin");
  });

  it("sets vcenter_password value", () => {
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <VMWareForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    const passwordInput = screen.getByLabelText(VMWareFormLabels.PasswordLabel);
    expect(passwordInput).toHaveValue("passwd");
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("sets vcenter_datacenter value", () => {
    const store = mockStore(state);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CompatRouter>
            <VMWareForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByRole("textbox", { name: VMWareFormLabels.DatacenterLabel })
    ).toHaveValue("my datacenter");
  });
});
