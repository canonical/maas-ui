import configureStore from "redux-mock-store";

import UserDelete from "./UserDelete";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen } from "@/testing/utils";

let state: RootState;

const mockStore = configureStore<RootState>();

beforeEach(() => {
  state = factory.rootState({
    status: factory.statusState({
      externalAuthURL: null,
    }),
    user: factory.userState({
      loaded: true,
      items: [
        factory.user({
          email: "admin@example.com",
          global_permissions: ["machine_create"],
          id: 1,
          is_superuser: true,
          last_name: "",
          sshkeys_count: 0,
          username: "admin",
        }),
      ],
    }),
  });
});

it("renders", () => {
  renderWithBrowserRouter(<UserDelete />, {
    state,
    route: "/settings/users/1/edit",
    routePattern: "/settings/users/:id/edit",
  });
  expect(screen.getByRole("form", { name: "Delete user" }));
});

it("can add a message when a user is deleted", () => {
  state.user.saved = true;
  const store = mockStore(state);
  renderWithBrowserRouter(<UserDelete />, {
    store,
    route: "/settings/users/1/edit",
    routePattern: "/settings/users/:id/edit",
  });
  const actions = store.getActions();
  expect(actions.some((action) => action.type === "user/cleanup")).toBe(true);
  expect(actions.some((action) => action.type === "message/add")).toBe(true);
});
