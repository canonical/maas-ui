import SideNav from "app/base/components/SideNav";
import urls from "app/base/urls";

export const Nav = (): JSX.Element => (
  <SideNav
    closeToggleText="Close preferences menu"
    items={[
      {
        path: urls.preferences.details,
        label: "Details",
      },
      {
        path: urls.preferences.apiKeys.index,
        label: "API keys",
      },
      {
        path: urls.preferences.sshKeys.index,
        label: "SSH keys",
      },
      {
        path: urls.preferences.sslKeys.index,
        label: "SSL keys",
      },
    ]}
    openToggleText="Preferences menu"
  />
);

export default Nav;
