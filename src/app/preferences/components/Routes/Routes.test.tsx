import { screen } from "@testing-library/react";

import Routes from "./Routes";

import urls from "app/base/urls";
import { Label as NotFoundLabel } from "app/base/views/NotFound/NotFound";
import { Label as APIKeyFormLabel } from "app/preferences/views/APIKeys/APIKeyForm/APIKeyForm";
import { Label as APIKeyListLabel } from "app/preferences/views/APIKeys/APIKeyList/APIKeyList";
import { Label as DetailsLabel } from "app/preferences/views/Details/Details";
import { Label as AddSSHKeyLabel } from "app/preferences/views/SSHKeys/AddSSHKey/AddSSHKey";
import { Label as SSHKeyListLabel } from "app/preferences/views/SSHKeys/SSHKeyList/SSHKeyList";
import { Label as AddSSLKeyLabel } from "app/preferences/views/SSLKeys/AddSSLKey/AddSSLKey";
import { Label as SSLKeyListLabel } from "app/preferences/views/SSLKeys/SSLKeyList/SSLKeyList";
import type { RootState } from "app/store/root/types";
import {
  token as tokenFactory,
  tokenState as tokenStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";
import { renderWithBrowserRouter } from "testing/utils";

let state: RootState;

beforeEach(() => {
  state = rootStateFactory({
    token: tokenStateFactory({
      items: [
        tokenFactory({
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
      renderWithBrowserRouter(<Routes />, {
        route: path,
        routePattern: `${urls.preferences.index}/*`,
        state,
      });
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  it("redirects to details", () => {
    renderWithBrowserRouter(<Routes />, {
      route: urls.preferences.index,
      routePattern: `${urls.preferences.index}/*`,
    });
    expect(window.location.pathname).toBe(urls.preferences.details);
  });
});
