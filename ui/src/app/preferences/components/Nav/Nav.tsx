import SideNav from "app/base/components/SideNav";
import prefsURLs from "app/preferences/urls";

export const Nav = (): JSX.Element => (
  <SideNav
    closeToggleText="Close preferences menu"
    items={[
      {
        label: "Details",
        path: prefsURLs.details,
      },
      {
        label: "API keys",
        path: prefsURLs.apiKeys.index,
      },
      {
        label: "SSH keys",
        path: prefsURLs.sshKeys.index,
      },
      {
        label: "SSL keys",
        path: prefsURLs.sslKeys.index,
      },
    ]}
    openToggleText="Preferences menu"
  />
);

export default Nav;
