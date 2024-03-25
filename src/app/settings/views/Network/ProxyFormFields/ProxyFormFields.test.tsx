import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import ProxyForm from "../ProxyForm";

import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, render } from "@/testing/utils";

const mockStore = configureStore();

describe("ProxyFormFields", () => {
  let state: RootState;
  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        loading: false,
        loaded: true,
        items: [
          {
            name: ConfigNames.HTTP_PROXY,
            value: "http://www.url.com",
          },
          {
            name: ConfigNames.ENABLE_HTTP_PROXY,
            value: false,
          },
          {
            name: ConfigNames.USE_PEER_PROXY,
            value: false,
          },
        ],
      }),
    });
  });

  it("can render", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/settings/network", key: "testKey" }]}
        >
          <CompatRouter>
            <ProxyForm />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    const fields = ["Don't use a proxy", "MAAS built-in", "External", "Peer"];

    fields.forEach((field) =>
      expect(screen.getByRole("radio", { name: field })).toBeInTheDocument()
    );
  });
});
