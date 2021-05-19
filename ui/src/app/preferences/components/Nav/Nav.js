import SideNav from "app/base/components/SideNav";
import prefsURLs from "app/preferences/urls";

export const Nav = () => (
  <SideNav
    items={[
      {
        path: prefsURLs.details,
        label: "Details",
      },
      {
        path: prefsURLs.apiKeys.index,
        label: "API keys",
      },
      {
        path: prefsURLs.sshKeys.index,
        label: "SSH keys",
      },
      {
        path: prefsURLs.sslKeys.index,
        label: "SSL keys",
      },
    ]}
  />
);

export default Nav;
