import configureStore from "redux-mock-store";

import DeleteSSHKey from "./DeleteSSHKey";

import * as sidePanelHooks from "@/app/base/side-panel-context";
import { PreferenceSidePanelViews } from "@/app/preferences/constants";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

let state: RootState;
const mockStore = configureStore<RootState>();

beforeEach(() => {
  const keys = [
    factory.sshKey({
      id: 1,
      key: "ssh-rsa aabb",
      keysource: { protocol: "lp", auth_id: "koalaparty" },
    }),
    factory.sshKey({
      id: 2,
      key: "ssh-rsa ccdd",
      keysource: { protocol: "gh", auth_id: "koalaparty" },
    }),
    factory.sshKey({
      id: 3,
      key: "ssh-rsa eeff",
      keysource: { protocol: "lp", auth_id: "maaate" },
    }),
    factory.sshKey({
      id: 4,
      key: "ssh-rsa gghh",
      keysource: { protocol: "gh", auth_id: "koalaparty" },
    }),
    factory.sshKey({ id: 5, key: "ssh-rsa gghh" }),
  ];
  vi.spyOn(sidePanelHooks, "useSidePanel").mockReturnValue({
    setSidePanelContent: vi.fn(),
    sidePanelContent: {
      view: PreferenceSidePanelViews.DELETE_SSH_KEYS,
      extras: { group: { keys } },
    },
    setSidePanelSize: vi.fn(),
    sidePanelSize: "regular",
  });
  state = factory.rootState({
    sshkey: factory.sshKeyState({
      loading: false,
      loaded: true,
      items: keys,
    }),
  });
});

it("renders", () => {
  renderWithBrowserRouter(<DeleteSSHKey />, {
    state,
    route: "/account/prefs/ssh-keys/delete?ids=2,3",
  });
  expect(
    screen.getByRole("form", { name: "Delete SSH key confirmation" })
  ).toBeInTheDocument();
  expect(
    screen.getByText("Are you sure you want to delete these SSH keys?")
  ).toBeInTheDocument();
});

it("can delete a group of SSH keys", async () => {
  const store = mockStore(state);
  renderWithBrowserRouter(<DeleteSSHKey />, {
    route: "/account/prefs/ssh-keys/delete?ids=2,3",
    store,
  });
  await userEvent.click(screen.getByRole("button", { name: /delete/i }));

  expect(
    store.getActions().some((action) => action.type === "sshkey/delete")
  ).toBe(true);
});

it("can add a message when a SSH key is deleted", async () => {
  state.sshkey.saved = true;
  const store = mockStore(state);
  renderWithBrowserRouter(<DeleteSSHKey />, {
    route: "/account/prefs/ssh-keys/delete?ids=2,3",
    store,
  });
  // Click on the delete button:
  await userEvent.click(screen.getByRole("button", { name: /delete/i }));

  const actions = store.getActions();
  expect(actions.some((action) => action.type === "sshkey/cleanup")).toBe(true);
  expect(actions.some((action) => action.type === "message/add")).toBe(true);
});
