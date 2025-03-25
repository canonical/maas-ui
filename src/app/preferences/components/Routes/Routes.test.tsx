import Routes from "./Routes";

import urls from "@/app/base/urls";
import { Label as NotFoundLabel } from "@/app/base/views/NotFound/NotFound";
import { Label as APIKeyFormLabel } from "@/app/preferences/views/APIKeys/APIKeyForm/APIKeyForm";
import { Label as APIKeyListLabel } from "@/app/preferences/views/APIKeys/APIKeyList/APIKeyList";
import { Label as DetailsLabel } from "@/app/preferences/views/Details/Details";
import { Label as AddSSHKeyLabel } from "@/app/preferences/views/SSHKeys/AddSSHKey/AddSSHKey";
import { Label as SSHKeyListLabel } from "@/app/preferences/views/SSHKeys/SSHKeyList/SSHKeyList";
import { Label as AddSSLKeyLabel } from "@/app/preferences/views/SSLKeys/AddSSLKey/AddSSLKey";
import { Label as SSLKeyListLabel } from "@/app/preferences/views/SSLKeys/SSLKeyList/SSLKeyList";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, renderWithProviders } from "@/testing/utils";

let state: RootState;

beforeEach(() => {
  state = factory.rootState({
    token: factory.tokenState({
      items: [
        factory.token({
          id: 1,
          key: "ssh-rsa aabb",
          consumer: { key: "abc", name: "Name" },
        }),
      ],
    }),
  });
});

describe("Routes", () => {
  [
    {
      label: DetailsLabel.Title,
      path: urls.preferences.details,
    },
    {
      label: APIKeyListLabel.Title,
      path: urls.preferences.apiKeys.index,
    },
    {
      label: APIKeyFormLabel.AddTitle,
      path: urls.preferences.apiKeys.add,
    },
    {
      label: APIKeyFormLabel.EditTitle,
      path: urls.preferences.apiKeys.edit({ id: 1 }),
    },
    {
      label: SSHKeyListLabel.Title,
      path: urls.preferences.sshKeys.index,
    },
    {
      label: AddSSHKeyLabel.Title,
      path: urls.preferences.sshKeys.add,
    },
    {
      label: SSLKeyListLabel.Title,
      path: urls.preferences.sslKeys.index,
    },
    {
      label: AddSSLKeyLabel.Title,
      path: urls.preferences.sslKeys.add,
    },
    {
      label: NotFoundLabel.Title,
      path: `${urls.preferences.index}/not/a/path`,
    },
  ].forEach(({ label, path }) => {
    it(`Displays: ${label} at: ${path}`, () => {
      renderWithProviders(<Routes />, {
        initialEntries: [path],
        state,
      });
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  it("redirects to details", async () => {
    const { router } = renderWithProviders(<Routes />, {
      initialEntries: [urls.preferences.index],
    });
    expect(router.state.location.pathname).toBe(urls.preferences.details);
  });
});
