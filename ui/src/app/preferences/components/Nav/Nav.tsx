import SideNav from "app/base/components/SideNav";
import prefsURLs from "app/preferences/urls";

export const Nav = (): JSX.Element => (
  <SideNav
    items={[
      {
        path: prefsURLs.details,
        label: "Details",
      },
      {
        path: prefsURLs.apiAuthentication.index,
        label: "API authentication",
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
