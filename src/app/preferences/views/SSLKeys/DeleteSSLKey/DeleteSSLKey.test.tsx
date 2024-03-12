import configureStore from "redux-mock-store";

import DeleteSSLKey from "./DeleteSSLKey";

import { Label as SSLKeyListLabels } from "@/app/preferences/views/SSLKeys/SSLKeyList/SSLKeyList";
import type { RootState } from "@/app/store/root/types";
import {
  sslKey as sslKeyFactory,
  sslKeyState as sslKeyStateFactory,
  rootState as rootStateFactory,
} from "@/testing/factories";
import { screen, renderWithBrowserRouter, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();

let state: RootState;

beforeEach(() => {
  state = rootStateFactory({
    sslkey: sslKeyStateFactory({
      loading: false,
      loaded: true,
      items: [
        sslKeyFactory({
          id: 1,
          key: "ssh-rsa aabb",
        }),
        sslKeyFactory({
          id: 2,
          key: "ssh-rsa ccdd",
        }),
        sslKeyFactory({
          id: 3,
          key: "ssh-rsa eeff",
        }),
        sslKeyFactory({
          id: 4,
          key: "ssh-rsa gghh",
        }),
        sslKeyFactory({ id: 5, key: "ssh-rsa gghh" }),
      ],
    }),
  });
});

it("can show a delete confirmation", () => {
  renderWithBrowserRouter(<DeleteSSLKey />, {
    route: "/account/prefs/ssl-keys/1/delete",
    routePattern: "/account/prefs/ssl-keys/:id/delete",
    state,
  });
  expect(screen.getByRole("form", { name: SSLKeyListLabels.DeleteConfirm }));
  expect(
    screen.getByText(/Are you sure you want to delete this SSL key?/i)
  ).toBeInTheDocument();
});

it("can delete an SSL key", async () => {
  const store = mockStore(state);
  renderWithBrowserRouter(<DeleteSSLKey />, {
    route: "/account/prefs/ssl-keys/1/delete",
    routePattern: "/account/prefs/ssl-keys/:id/delete",
    store,
  });

  await userEvent.click(screen.getByRole("button", { name: "Delete" }));
  expect(
    store.getActions().find((action) => action.type === "sslkey/delete")
  ).toEqual({
    type: "sslkey/delete",
    payload: {
      params: {
        id: 1,
      },
    },
    meta: {
      model: "sslkey",
      method: "delete",
    },
  });
});
