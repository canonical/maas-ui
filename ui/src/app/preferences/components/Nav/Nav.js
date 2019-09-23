import React from "react";

import SideNav from "app/base/components/SideNav";

export const Nav = () => (
  <SideNav
    items={[
      {
        path: "details",
        label: "Details"
      },
      {
        path: "maas-keys",
        label: "MAAS keys"
      },
      {
        path: "ssh-keys",
        label: "SSH keys"
      },
      {
        path: "ssl-keys",
        label: "SSL keys"
      }
    ]}
  />
);

export default Nav;
